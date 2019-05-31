Path to be used on API for get and remove an object should be like:
/videos/object/:challengeId

Path to be used on API for list objects on get method should be like:
/videos

JSON to be used as data on put request should be like:
{
  "author": "INSERT VALUE HERE",
  "category": "INSERT VALUE HERE",
  "challengeId": "INSERT VALUE HERE",
  "creationDate": "INSERT VALUE HERE",
  "deadlineDate": "INSERT VALUE HERE",
  "description": "INSERT VALUE HERE",
  "payment": "INSERT VALUE HERE",
  "rating": "INSERT VALUE HERE",
  "title": "INSERT VALUE HERE",
  "videoFile": "INSERT VALUE HERE",
  "videoThumb": "INSERT VALUE HERE"
}
To test the api from the command line (after awsmobile push) use this commands
awsmobile cloud-api invoke videosCRUD <method> <path> [init]


Path to be used on API for get and remove an object should be like:
/comments/object/:creationDate

Path to be used on API for list objects on get method should be like:
/comments

JSON to be used as data on put request should be like:
{
  "avatar": "INSERT VALUE HERE",
  "challengeId": "INSERT VALUE HERE",
  "creationDate": "INSERT VALUE HERE",
  "message": "INSERT VALUE HERE",
  "username": "INSERT VALUE HERE"
}

{
  id: '1',
  name: 'Josie Lewis',
  text: 'Mission accomplished. It\'s magnificent =)',
  picture: 'https://s3-us-west-1.amazonaws.com/challengesapp-userfiles-mobilehub-1228559550/public/image2.tif',
},
{
  id: '2',
  name: 'Benedict Schmitt',
  text: 'Sleek work you have here.',
  picture: 'https://s3-us-west-1.amazonaws.com/challengesapp-userfiles-mobilehub-1228559550/public/image1.tif',
},
{
  id: '3',
  name: 'Howard Hodson',
  text: 'Extra delightful dude',
  picture: 'https://s3-us-west-1.amazonaws.com/challengesapp-userfiles-mobilehub-1228559550/public/image3.tif',
},
{
  id: '4',
  name: 'Jim Mcneil',
  text: 'I want to learn this kind of shot! Teach me.',
  picture: 'https://s3-us-west-1.amazonaws.com/challengesapp-userfiles-mobilehub-1228559550/public/image4.tif',
},
{
  id: '5',
  name: 'Elliott Mooney',
  text: 'It\s killer not just magnificent!',
  picture: 'https://s3-us-west-1.amazonaws.com/challengesapp-userfiles-mobilehub-1228559550/public/image5.tif',
},
{
  id: '6',
  name: 'Andreas Logan (Andy)',
  text: 'Truly thought out! Ahhhhhhh...',
  picture: 'https://s3-us-west-1.amazonaws.com/challengesapp-userfiles-mobilehub-1228559550/public/image6.tif',
},
{
  id: '7',
  name: 'Nelly Laing',
  text: 'Pattern, style, shot, colour – beastly m8',
  picture: 'https://s3-us-west-1.amazonaws.com/challengesapp-userfiles-mobilehub-1228559550/public/image7.tif',
},
{
  id: '8',
  name: 'Luc Cantu',
  text: 'My 74 year old dad rates this camera angle very strong =)',
  picture: 'https://s3-us-west-1.amazonaws.com/challengesapp-userfiles-mobilehub-1228559550/public/image8.tif',
},
{
  id: '9',
  name: 'Stevie Rodriguez',
  text: 'So amazing and delightful :)',
  picture: 'https://s3-us-west-1.amazonaws.com/challengesapp-userfiles-mobilehub-1228559550/public/image9.tif',
},