//Initialize Express (Server)
var express = require('express');
var bodyParser = require('body-parser')
var app = express();

//Set up Server
app.listen(3000, function(){console.log('Listen on port 3000')});
//Set up BodyParse
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//Allow CORS 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Initialize Firebase
var admin = require("firebase-admin");
var serviceAccount = require("./CloudLockAdminSDK.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cloudlock-2018.firebaseio.com"
});
// Initialize Cloud Firestore through Firebase
var db = admin.firestore();