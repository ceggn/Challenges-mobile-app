/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require('express')
const bodyParser = require('body-parser')
const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

AWS.config.update({ region: process.env.REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const mhprefix  = process.env.MOBILE_HUB_DYNAMIC_PREFIX;
let tableName = "comments";
const hasDynamicPrefix = true;

const userIdPresent = true;
const partitionKeyName = "userId";
const partitionKeyType = "S"
const sortKeyName = "creationDate";
const sortKeyType = "N";
const hasSortKey = true;
const path = "/comments";

const awsmobile = {}

if (hasDynamicPrefix) {
  tableName = mhprefix + '-' + tableName;
} 

const UNAUTH = 'UNAUTH';

// declare a new express app
var app = express()
app.use(awsServerlessExpressMiddleware.eventContext({ deleteHeaders: false }), bodyParser.json(), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get('/comments', function(req, res) {
  var condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }
  
  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH ];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [ convertUrlType(req.params[partitionKeyName], partitionKeyType) ];
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if( req.apiGateway.event.queryStringParameters.getAllCommentsForChallenge == '1' ){
    let queryParams = {
      TableName : tableName,
      IndexName: 'challengeId-creationDate',

      KeyConditionExpression : 'challengeId = :challengeIdVal and creationDate > :creationDateVal',  
      ExpressionAttributeValues : {
          ':challengeIdVal' : req.apiGateway.event.queryStringParameters.challengeId,
          ':creationDateVal' : 1
      },
      ScanIndexForward: false
    };
    dynamodb.query(queryParams, (err, data) => {
      if (err) {
        res.json({error: 'Could not load items: ' + err});
      } else {
        res.json(data.Items);
      }
    });
  }else{
    let queryParams = {
      TableName: tableName,
      KeyConditions: condition
    } 
  
    dynamodb.query(queryParams, (err, data) => {
      if (err) {
        res.json({error: 'Could not load items: ' + err});
      } else {
        res.json(data.Items);
      }
    });
  }
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get('/comments/object/:creationDate', function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data) ;
      }
    }
  });
});


/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, function(req, res) {
  
  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  var challengeId = req.body['challengeId'];
  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.json({error: err, url: req.url, body: req.body});
    } else{
      let queryParams = {
        TableName: "challengesapp-mobilehub-1228559550-videos",
        IndexName: 'UUID',
        KeyConditionExpression: 'challengeId = :challengeId',
        ExpressionAttributeValues: { ':challengeId': challengeId }
      }
      dynamodb.query(queryParams, (error, singleChallengeData) => {
        if (error) {
          console.log("Error", error);
          res.json({error: 'get challenge error', url: req.url, data: error});
        } else {
          var videoObj = singleChallengeData.Items[0];
          videoObj.comments = videoObj.comments ? videoObj.comments + 1 : 1;
          let putItemParams = {
            TableName: "challengesapp-mobilehub-1228559550-videos",
            Item: videoObj
          }
          dynamodb.put(putItemParams, (putErr, challengePutData) => {
            if(putErr) {
              console.log(putErr);
              res.json({error: 'put comments number error', url: req.url, data: putErr});
            } else{
              console.log({success: 'comment increment succeed!', data: challengePutData})
              res.json({success: 'put comments number success', url: req.url, data: challengePutData});
            }
          });
        }
      });
    }
  });
});

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, function(req, res) {
  
  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'post call succeed!', url: req.url, data: data})
    }
  });
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete('/comments/object/:creationDate', function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
     try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params
  }
  dynamodb.delete(removeItemParams, (err, data)=> {
    if(err) {
      res.json({error: err, url: req.url});
    } else {
      if( req.apiGateway.event.queryStringParameters && req.apiGateway.event.queryStringParameters.challengeID ){
        let queryParams = {
          TableName: "challengesapp-mobilehub-1228559550-videos",
          IndexName: 'UUID',
          KeyConditionExpression: 'challengeId = :challengeId',
          ExpressionAttributeValues: { ':challengeId': req.apiGateway.event.queryStringParameters.challengeID }
        }
        dynamodb.query(queryParams, (error, singleChallengeData) => {
          if (error) {
            console.log("Error", error);
          } else {
            var videoObj = singleChallengeData.Items[0];
            videoObj.comments = videoObj.comments > 0 ? (videoObj.comments - 1) : 0;
            let putItemParams = {
              TableName: "challengesapp-mobilehub-1228559550-videos",
              Item: videoObj
            }
            dynamodb.put(putItemParams, (putErr, challengePutData) => {
              if(putErr) {
                console.log(putErr);
              } else{
                console.log({success: 'comment decrease succeed!', data: challengePutData})
              }
            });
          }
        });
      }else{
        console.log('No Challenge ID provided');
      }
      res.json({url: req.url, data: data});
    }
  });
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
