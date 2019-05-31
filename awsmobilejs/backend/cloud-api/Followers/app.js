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
const cognito = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18', region: "us-west-2"});

const mhprefix  = process.env.MOBILE_HUB_DYNAMIC_PREFIX;
let tableName = "Followers";
const hasDynamicPrefix = true;

const userIdPresent = false;
const partitionKeyName = "userId";
const partitionKeyType = "S"
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = false;
const path = "/Followers";

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

app.get('/Followers/:userId', function(req, res) {
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
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get('/Followers/object/:userId', function(req, res) {
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
  var self = req.apiGateway.event;

  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      if (data.Item) {
        if( self.queryStringParameters && self.queryStringParameters.all ){
          // Need to retrive all users data
          if( data.Item.following ){
            // Search for users
            var usersOutput = [];
            var counter = 0;
            for (let i=0; i<data.Item.following.values.length; i++) {
              console.log("Foreach", i);
              var filter = "sub = \"" + data.Item.following.values[i] + "\"";
              var reqOptions = {
                  "Filter": filter,
                  "UserPoolId": "us-west-2_YwLbWMH0r"
              };
              console.log("Request Options", reqOptions);
              cognito.listUsers(reqOptions, function(error, followersResult) {
                if (error) {
                  console.log("Error", error);
                }
                else {
                  usersOutput.push(followersResult.Users[0]);
                  counter++;
                  if( counter == data.Item.following.values.length ){
                    res.json(usersOutput);
                  }
                }
              });
            }
          }else{
            res.json([]);
          }
        }else if( self.queryStringParameters && self.queryStringParameters.allfollowers ){
          // Need to retrive all users data
          if( data.Item.followers ){
            // Search for users
            var usersOutput = [];
            var counter = 0;
            for (let i=0; i<data.Item.followers.values.length; i++) {
              console.log("Foreach", i);
              var filter = "sub = \"" + data.Item.followers.values[i] + "\"";
              var reqOptions = {
                  "Filter": filter,
                  "UserPoolId": "us-west-2_YwLbWMH0r"
              };
              console.log("Request Options", reqOptions);
              cognito.listUsers(reqOptions, function(error, followersResult) {
                if (error) {
                  console.log("Error", error);
                }
                else {
                  usersOutput.push(followersResult.Users[0]);
                  counter++;
                  if( counter == data.Item.followers.values.length ){
                    res.json(usersOutput);
                  }
                }
              });
            }
          }else{
            res.json([]);
          }
        }else{
          res.json(data.Item);
        }
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
  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'put call succeed!', url: req.url, data: data})
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
  if( req.body['unfollow'] == true ){
    // Unfollow
    var updateExpressionString = "";
    var expressionValues = {}
    if( req.body['followers'] && req.body['following'] ){
      updateExpressionString = "delete followers :followers, following :following";
      expressionValues = {
          ":followers": dynamodb.createSet([ req.body['followers'] ]),
          ":following": dynamodb.createSet([ req.body['following'] ])
      }
    }else if( !req.body['followers'] && req.body['following'] ){
      updateExpressionString = "delete following :following";
      expressionValues = {
        ":following": dynamodb.createSet([ req.body['following'] ])
      }
    }else if( req.body['followers'] && !req.body['following'] ){
      updateExpressionString = "delete followers :followers";
      expressionValues = {
        ":followers": dynamodb.createSet([ req.body['followers'] ])
      }
    }
    var params = {
      TableName: tableName,
      Key: {
        "userId": req.body['userId']
      },
      UpdateExpression: updateExpressionString,
      ExpressionAttributeValues: expressionValues
    };
    dynamodb.update(params, (err, data) => {
      if(err) {
        res.json({error: err, url: req.url, body: req.body});
      } else{
        res.json({success: 'unfollow call succeed!', url: req.url, data: data})
      }
    });
  }else{
    //Follow
    var updateExpressionString = "";
    var expressionValues = {}
    if( req.body['followers'] && req.body['following'] ){
      updateExpressionString = "add followers :followers, following :following";
      expressionValues = {
          ":followers": dynamodb.createSet([ req.body['followers'] ]),
          ":following": dynamodb.createSet([ req.body['following'] ])
      }
    }else if( !req.body['followers'] && req.body['following'] ){
      updateExpressionString = "add following :following";
      expressionValues = {
        ":following": dynamodb.createSet([ req.body['following'] ])
      }
    }else if( req.body['followers'] && !req.body['following'] ){
      updateExpressionString = "add followers :followers";
      expressionValues = {
        ":followers": dynamodb.createSet([ req.body['followers'] ])
      }
    }
    var params = {
      TableName: tableName,
      Key: {
        "userId": req.body['userId']
      },
      UpdateExpression: updateExpressionString,
      ExpressionAttributeValues: expressionValues
    };
    dynamodb.update(params, (err, data) => {
      if(err) {
        res.json({error: err, url: req.url, body: req.body});
      } else{
        res.json({success: 'follow call succeed!', url: req.url, data: data})
      }
    });
  }
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete('/Followers/object/:userId', function(req, res) {
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