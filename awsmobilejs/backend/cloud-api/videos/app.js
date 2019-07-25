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
const cloudsearchdomain = new AWS.CloudSearchDomain(
  {
      endpoint: 'doc-videos-3roxe5yrb2btq4r5i6xssxicu4.us-west-1.cloudsearch.amazonaws.com'
  }
);

const mhprefix  = process.env.MOBILE_HUB_DYNAMIC_PREFIX;
let tableName = "videos";
const hasDynamicPrefix = true;

const userIdPresent = true;
const partitionKeyName = "userId";
const partitionKeyType = "S"
const sortKeyName = "challengeId";
const sortKeyType = "S";
const hasSortKey = true;
const path = "/videos";

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

app.get('/videos', function(req, res) {
  var condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }

  if( req.apiGateway.event.queryStringParameters && req.apiGateway.event.queryStringParameters.category == 'all' ){
    var queryParams = {};
    if( req.apiGateway.event.queryStringParameters.s ){
      var params = {
        query: req.apiGateway.event.queryStringParameters.s.toString()
      };
      cloudsearchdomain.search(params, function(err, data) {
        if (err) res.json({error: 'Could not load items: ' + err});
        else res.json(data);
      });
    }else{
      queryParams = {
        TableName : tableName,
        Limit : 6,
        IndexName: 'parent-creationDate-index',
        KeyConditionExpression: 'parent = :null',
        ExpressionAttributeValues: {
          ':null': 'null',
        },
        ScanIndexForward: false
      };
      if(
        req.apiGateway.event.queryStringParameters.parent &&
        req.apiGateway.event.queryStringParameters.creationDate &&
        req.apiGateway.event.queryStringParameters.challengeId &&
        req.apiGateway.event.queryStringParameters.userId
      ){
        queryParams.ExclusiveStartKey = {
          parent: "null",
          creationDate: Number.parseInt( req.apiGateway.event.queryStringParameters.creationDate ),
          challengeId: toString( req.apiGateway.event.queryStringParameters.challengeId ),
          userId: toString( req.apiGateway.event.queryStringParameters.userId ),
        }
      }
      dynamodb.query(queryParams, (err, data) => {
        if (err) {
          res.json({error: 'Could not load items: ' + err});
        } else {
          res.json([data.Items, data.LastEvaluatedKey ? data.LastEvaluatedKey : null]);
        }
      });
    }
  }else if( req.apiGateway.event.queryStringParameters && req.apiGateway.event.queryStringParameters.category ){
    var queryParams = {};
    queryParams = {
      TableName: tableName,
      Limit : 40,
      IndexName: 'Categories',
      KeyConditionExpression: 'category = :cat_name',
      ExpressionAttributeValues: {
        ':cat_name': req.apiGateway.event.queryStringParameters.category
      },
      ScanIndexForward: false,
    }
    if(
      req.apiGateway.event.queryStringParameters.creationDate &&
      req.apiGateway.event.queryStringParameters.challengeId &&
      req.apiGateway.event.queryStringParameters.userId
    ){
      queryParams.ExclusiveStartKey = {
        category: toString( req.apiGateway.event.queryStringParameters.category ),
        creationDate: Number.parseInt( req.apiGateway.event.queryStringParameters.creationDate ),
        challengeId: toString( req.apiGateway.event.queryStringParameters.challengeId ),
        userId: toString( req.apiGateway.event.queryStringParameters.userId ),
      }
    }
    dynamodb.query(queryParams, (err, data) => {
      if (err) {
        res.json({error: 'Could not load items: ' + err});
      } else {
        res.json([data.Items, data.LastEvaluatedKey ? data.LastEvaluatedKey : null]);
      }
    });
  }else if( req.apiGateway.event.queryStringParameters && req.apiGateway.event.queryStringParameters.friends ){
    // Load all users that I follow
    let queryParams = {
      TableName: 'challengesapp-mobilehub-1228559550-Followers',
      IndexName: 'userId-index',
        FilterExpression: "userId = :sub",
        ExpressionAttributeValues: {
            ':sub': req.apiGateway.event.queryStringParameters.friends
        }
    }

    dynamodb.scan(queryParams,(err, data) => {
      console.log('Followers Error', err);
      console.log('Followers Data', data);
      if(err) {
        res.json({error: 'Could not load items: ' + err.message});
      } else {
        if (data.Items[0]) {
          // Need to retrive all users data
          if( data.Items[0].following && data.Items[0].following.values.length > 0 ){
            // Following users are here
            var subs = '';
            var dictionary = {};
            for (let iterator=0; iterator<data.Items[0].following.values.length; iterator++) {
              if( subs == '' ){
                subs = 'authorSub = :user'+iterator;
                dictionary[':user'+iterator] = data.Items[0].following.values[iterator];
              }else{
                subs += ' or authorSub = :user'+iterator;
                dictionary[':user'+iterator] = data.Items[0].following.values[iterator];
              }
            }
            console.log('subs Data', subs);
            console.log('dictionary Data', dictionary);
            // Scan videos from my following users
            let queryParams = {
              TableName: tableName,
              IndexName: 'Categories',
              FilterExpression: subs,
              ExpressionAttributeValues: dictionary
            }
            dynamodb.scan(queryParams, (err, followingVideos) => {
              if (err) {
                res.json({error: 'Could not load items: ' + err});
              } else {
                res.json(followingVideos.Items);
              }
            });
          }else{
            res.json([]);
          }
        } else {
          res.json([]) ;
        }
      }
    });
  }else if( req.apiGateway.event.queryStringParameters && req.apiGateway.event.queryStringParameters.trending ){
    if(
      req.apiGateway.event.queryStringParameters.creationDate &&
      req.apiGateway.event.queryStringParameters.challengeId &&
      req.apiGateway.event.queryStringParameters.rating &&
      req.apiGateway.event.queryStringParameters.userId
    ){
      var queryParams = {
        TableName : tableName,
        Limit : 40,
        IndexName: 'Hot',
        FilterExpression: "parent = :null or parent = :snull",
        ExpressionAttributeValues: {
          ':null': null,
          ':snull': 'null'
        },
        ExclusiveStartKey : {
          challengeId: toString( req.apiGateway.event.queryStringParameters.challengeId ),
          creationDate: Number.parseInt( req.apiGateway.event.queryStringParameters.creationDate ),
          rating: Number.parseInt( req.apiGateway.event.queryStringParameters.rating ),
          userId: toString( req.apiGateway.event.queryStringParameters.userId ),
        }
      };
    }else{
      var queryParams = {
        TableName : tableName,
        Limit : 40,
        IndexName: 'Hot',
        FilterExpression: "parent = :null or parent = :snull",
        ExpressionAttributeValues: {
          ':null': null,
          ':snull': 'null'
        }
      };
    }
    dynamodb.scan(queryParams, (err, data) => {
      if (err) {
        res.json({error: 'Could not load items: ' + err});
      } else {
        res.json([data.Items, data.LastEvaluatedKey ? data.LastEvaluatedKey : null]);
      }
    });
  }else if( req.apiGateway.event.queryStringParameters && req.apiGateway.event.queryStringParameters.parent ){
    let queryParams = {
      TableName : tableName,
      IndexName: 'Categories',
      FilterExpression: "parent = :challengeId",
      ExpressionAttributeValues: {
        ':challengeId': req.apiGateway.event.queryStringParameters.parent
      }
    };
    dynamodb.scan(queryParams, (err, data) => {
      if (err) {
        res.json({error: 'Could not load items: ' + err});
      } else {
        res.json(data.Items);
      }
    });
  }else if( req.apiGateway.event.queryStringParameters && req.apiGateway.event.queryStringParameters.userName ){
    AWS.config.update({ region: "us-west-2" });
    const cognito = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'})
    cognito.adminGetUser({
      UserPoolId: "us-west-2_YwLbWMH0r",
      Username: req.apiGateway.event.queryStringParameters.userName,
    }, function(err, data) {
      if (err) {
        res.json({error: 'Could not load user: ' + err});
      } else {
        var subObj = data.UserAttributes.find(function (obj) { return obj.Name === 'sub'; });
        if( subObj.Value ){
          let queryParams = {
            TableName: tableName,
            IndexName: 'User',
            KeyConditionExpression: 'authorSub = :sub',
            ExpressionAttributeValues: { ':sub': subObj.Value }
          }
          dynamodb.query(queryParams, (err, videos) => {
            if (err) {
              res.json(data);
            } else {
              res.json([data, videos.Items]);
            }
          });
        }else{
          res.json(data);
        }
      }
    });
    AWS.config.update({ region: process.env.REGION });
  }else if( req.apiGateway.event.queryStringParameters && req.apiGateway.event.queryStringParameters.userSub ){
    AWS.config.update({ region: "us-west-2" });
    const cognito = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'})
    var filter = "sub = \"" + req.apiGateway.event.queryStringParameters.userSub + "\"";
    var req = {
        "Filter": filter,
        "UserPoolId": "us-west-2_YwLbWMH0r"
    };
    cognito.listUsers(req, function(err, data) {
      if (err) {
          console.log(err);
      }
      else {
          if (data.Users.length === 1){ //as far as we search by sub, should be only one user.
              var user = data.Users[0];
              //var attributes = data.Users[0].Attributes;
              res.json(user);
          } else {
              console.log("Something wrong.");
          }
      }
    });
    AWS.config.update({ region: process.env.REGION });
  }else if( req.apiGateway.event.queryStringParameters && req.apiGateway.event.queryStringParameters.usersSearch ){
    AWS.config.update({ region: "us-west-2" });
    const cognito = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'})
    var filter = "preferred_username ^= \""+ req.apiGateway.event.queryStringParameters.usersSearch + "\"";
    var req = {
        "Filter": filter,
        "UserPoolId": "us-west-2_YwLbWMH0r"
    };
    cognito.listUsers(req, function(err, data) {
      if (err) {
          console.log(err);
      }
      else {
        res.json(data);
      }
    });
    AWS.config.update({ region: process.env.REGION });
  }else{
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
  }

});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get('/videos/object/:challengeId', function(req, res) {
  // var params = {};
  // if (userIdPresent && req.apiGateway) {
  //   params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  // } else {
  //   params[partitionKeyName] = req.params[partitionKeyName];
  //   try {
  //     params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
  //   } catch(err) {
  //     res.json({error: 'Wrong column type ' + err});
  //   }
  // }
  // if (hasSortKey) {
  //   try {
  //     params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
  //   } catch(err) {
  //     res.json({error: 'Wrong column type ' + err});
  //   }
  // }

  // let getItemParams = {
  //   TableName: tableName,
  //   Key: params
  // }

  // dynamodb.get(getItemParams,(err, data) => {
  //   if(err) {
  //     res.json({error: 'Could not load items: ' + err.message});
  //   } else {
  //     if (data.Item) {
  //       res.json(data.Item);
  //     } else {
  //       res.json(data) ;
  //     }
  //   }
  // });
  let queryParams = {
    TableName: tableName,
    IndexName: 'UUID',
    KeyConditionExpression: 'challengeId = :challengeId',
    ExpressionAttributeValues: { ':challengeId': convertUrlType(req.params[sortKeyName], sortKeyType) }
  }
  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Items[0]);
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
  if( req.apiGateway.event.queryStringParameters && req.apiGateway.event.queryStringParameters.view && req.apiGateway.event.queryStringParameters.uuid ){
    let queryParams = {
      TableName: tableName,
      IndexName: 'UUID',
      KeyConditionExpression: 'challengeId = :challengeId',
      ExpressionAttributeValues: { ':challengeId': req.apiGateway.event.queryStringParameters.uuid }
    }
    dynamodb.query(queryParams, (err, data) => {
      if (err) {
        res.json({error: 'Could not load items: ' + err});
      } else {
        var videoObj = data.Items[0];
        //res.json(data.Items[0]);
        videoObj.views = videoObj.views ? videoObj.views + 1 : 1;
        let putItemParams = {
          TableName: tableName,
          Item: videoObj
        }
        dynamodb.put(putItemParams, (err, data) => {
          if(err) {
            res.json(err);
          } else{
            res.json({success: 'view increment succeed!', data: data})
          }
        });
      }
    });
  }else if( req.apiGateway.event.queryStringParameters && req.apiGateway.event.queryStringParameters.participant && req.apiGateway.event.queryStringParameters.uuid ){
    let queryParams = {
      TableName: tableName,
      IndexName: 'UUID',
      KeyConditionExpression: 'challengeId = :challengeId',
      ExpressionAttributeValues: { ':challengeId': req.apiGateway.event.queryStringParameters.uuid }
    }
    dynamodb.query(queryParams, (err, data) => {
      if (err) {
        res.json({error: 'Could not load items: ' + err});
      } else {
        var videoObj = data.Items[0];
        if(req.apiGateway.event.queryStringParameters.remove){
          videoObj.participants = videoObj.participants && videoObj.participants > 0 ? videoObj.participants - 1 : 0;
        }else{
          videoObj.participants = videoObj.participants ? videoObj.participants + 1 : 1;
        }
        let putItemParams = {
          TableName: tableName,
          Item: videoObj
        }
        dynamodb.put(putItemParams, (err, data) => {
          if(err) {
            res.json(err);
          } else{
            res.json({success: 'participant increment succeed!', data: data})
          }
        });
      }
    });
  }else{
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
  }
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

app.delete('/videos/object/:challengeId', function(req, res) {
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
