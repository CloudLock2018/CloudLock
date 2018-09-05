//Server Location: C:\Users\43871824\Documents\4to TIC\Proyecto Final\CloudLock\SmartDoor_Web\Servidor

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

var nombreR;
var contraR;
var replyR;
var repetido;

//Receive info from client (Register)
app.post('/register', function(req, res){
	repetido = false;
	//Get info
	nombreR = req.body.nombre;
	emailR = req.body.email;
	contraR = req.body.contra;
	//Creates a document inside the collection USERS
	var usuario = db.collection("Users").doc(nombreR);
	usuario.get()
		//Check if the doc already exists and send an error if happens
		.then(doc => {
    		if (doc.exists) {
      			reply = {
      				msg: 'Error'
      			};      			
				res.send(reply);
    		}
    		else{
    			//Checks if the email was already used
    			db.collection("Users").where('Email', '==', emailR).get()
    				.then(snapshot => {
     					snapshot.forEach(doc => {
     						repetido = true;
     						reply = {
     							msg: 'Error, mail'
     						};
     						res.send(reply);
     					});
     					//if the email has never been used before, then it will create a new doc in the DB
     					if (repetido === false){
		     				usuario.set({
								Nombre_de_Usuario: nombreR,
								Email: emailR,
								Contraseña: contraR
							})
								.then(function(docRef) {
						    		reply = {
						    			msg: 'Gracias ' + nombreR + ', contraseña: ' + contraR
						    		};
									res.send(reply);
								})
								//Send error if it happens one
								.catch(function(error) {
						    		console.error("Error adding document: ", error);
								})
		     			}
     				})
			}
		})
});