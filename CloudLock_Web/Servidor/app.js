//Server Location (Axel): C:\Users\43871824\Documents\4to TIC\Proyecto Final\CloudLock\SmartDoor_Web\Servidor
//Server Location (Joako): C:\Users\43322826\Documents\GitHub\CloudLock\SmartDoor_Web\Servidor

//Initialize Express (Server)
var express = require('express');
var bodyParser = require('body-parser')
var app = express();

//Set up Server
app.listen(3000, function(){console.log('Listen on port 3000')});
app.use('/', express.static('public'));
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


//---------------------------------------WEB----------------------------------------------------//
var nombreR;
var contraR;
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
								Contraseña: contraR,
								IMEI: null
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


var nombreL;
var contraL;

//Receive info from client (Login)
app.post('/login', function(req, res){
	//Get info
	nombreL = req.body.usuario;
	contraL = req.body.contra;
	var usuario = db.collection("Users").doc(nombreL);
	usuario.get()
		.then(doc =>{
			//Checks if the username exists
			if(doc.exists){
				//Checks if the password set is equal to the password written
				if(doc.data().Contraseña === contraL){
					reply = {
						msg: 'Usuario Encontrado'
					};
					res.send(reply);
				}
				else{
					reply = {
						msg: 'Error, contra'
					};
					res.send(reply);
				}
			}
			else{
				reply = {
					msg: 'Error, usuario'
				};
				res.send(reply);
			}
		})
});


var nombreC;
var contraC;

//Receive info from client (Change Password)
app.post('/password', function(req, res){
	nombreC = req.body.usuario;
	contraC = req.body.contra;
	var usuario = db.collection("Users").doc(nombreC);
	usuario.get()
		.then(doc => {
			if(doc.exists){
				//Updates user's password (insecure)
				usuario.update({
					Contraseña: contraC
				});
				reply = {
					msg: 'Contraseña Actualizada'
				};
				res.send(reply);
			}
			else{
				reply = {
					msg: 'Error, usuario'
				};
				res.send(reply);
			}
		})
});


var usuarioA;
var subusuarioA;
var eliminarsubA;
var subusuarios = null;
var cant = 1;
var hay = true;

//Receive info from client (Admin - IMEI & subuser already saved)
app.post('/imei', function(req, res){
	usuarioA = req.body.usuario;
	var usuario = db.collection("Users").doc(usuarioA);
	usuario.get()
		.then(doc =>{
			if(doc.exists){
				//Checks if user's IMEI is null or not
				if(doc.data().IMEI === null){
					reply = {
						msg: 'No imei'
					};
					res.send(reply);
				}
				else{
					usuario.collection("Subusers").get().then(function(querySnapshot) {
    					querySnapshot.forEach(function(doc) {
    						if (subusuarios === null){
    							subusuarios = "<div id='" + cant + "' class='contenedor3'><span class='sub' id='" + cant +"'>"+ doc.data().Nombre_de_Subusuario +"</span><span class='IMEI' id='"+ cant +"'>IMEI: "+ doc.data().IMEI + "</span><input class='eliminar' type='button' value='✖' id='" + cant + "'><input class='cambiar' type='button' value='✎' id='" + cant + "'></div>";
    							cant += 1;
    						}
    						else{
    							subusuarios += "<div id='" + cant + "' class='contenedor3'><span class='sub' id='" + cant +"'>"+ doc.data().Nombre_de_Subusuario +"</span><span class='IMEI' id='"+ cant +"'>IMEI: "+ doc.data().IMEI + "</span><input class='eliminar' type='button' value='✖' id='" + cant + "'><input class='cambiar' type='button' value='✎' id='" + cant + "'></div>";
    							cant += 1;
    						}
   						});
   						if (subusuarios === null){
   							hay = false;
   						}
						reply = {
							msg: 'Hay imei',
							imei: doc.data().IMEI,
							contenido: subusuarios,
							cantidad: cant,
							existe: hay
						}
						res.send(reply);
						cant = 1;
						subusuarios = null;
						hay = true;
					});
				}
			}
		})
});

//Receive info from client (Admin - Save new subuser)
app.post('/subuser', function(req, res){
	usuarioA = req.body.usuario;
	subusuarioA = req.body.subusuario;
	var usuario = db.collection("Users").doc(usuarioA).collection("Subusers").doc(subusuarioA);
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
    			usuario.set({
					Nombre_de_Subusuario: subusuarioA,
					IMEI: null
				})
				.then(function(docRef) {
					reply = {
			   			msg: 'Gracias'
			   		};
					res.send(reply);
				})
				//Send error if it happens one
				.catch(function(error) {
			   		console.error("Error adding document: ", error);
				})
    		}
    	})
})

//Receive info from client (Admin - Delete certain subuser)
app.post('/delete', function(req, res){
	usuarioA = req.body.usuario;
	eliminarsubA = req.body.sub;
	var usuario = db.collection("Users").doc(usuarioA).collection("Subusers").doc(eliminarsubA);
	usuario.get()
		.then(doc => {
			if (doc.exists) {				
				usuario.delete();
				reply = {
					msg: 'Borrado'
				};
				res.send(reply);
			}
			else{
				reply = {
					msg: 'Error'
				};
				res.send(reply);
			}
		})
})

//-------------------------------------ADAFRUIT API---------------------------------------------//
/*var mqtt = require('mqtt');
var prueba = 'CloudlockTeam/f/prueba';

var client  = mqtt.connect('mqtt://io.adafruit.com', {
	port: 1883,
	username: 'CloudlockTeam',
	password: '17d40238f10342fdb884cf02a62db208'
});

client.on('connect', function () {
  client.subscribe(prueba)
});

client.on('connect', function() {
	client.publish(prueba, 'Hola')
});

client.on('error', (error) => {
	console.log('MQTT Client Errored');
    console.log(error);
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
})*/