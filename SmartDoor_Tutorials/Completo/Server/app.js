var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.listen(3000, function(){console.log('Listen  on port 3000')});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Initialize Firebase
var admin = require("firebase-admin");
var serviceAccount = require("./FirebaseAdminSDKProbando.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://probandocloudfirestore.firebaseio.com"
});

// Initialize Cloud Firestore through Firebase
var db = admin.firestore();

//------------------------------------------Enviar info-------------------------------------------------------------------
//------------------------------------------Cliente - Servidor------------------------------------------------------------
var nombre;
var contra;
var reply;
var data;

app.post('/', function(req, res){
	console.log(req.body);
	nombre = req.body.nom;
	contra = req.body.pass;
	
//------------------------------------------Servidor - Database----------------------------------------------------------
	var nombreRef = db.collection("Users").doc(nombre);
	nombreRef.get()
		.then(doc => {
    		if (doc.exists) {
      			reply = {
      				msg: 'Error'
      			};      			
				res.send(reply);
    		}else{
      			nombreRef.set({
				    Name: nombre,
				    Contraseña: contra
				})
				.then(function(docRef) {
			    	reply = {
			    		msg: 'Gracias ' + nombre + ', contraseña: ' + contra
			    	};
					res.send(reply);
				})
				.catch(function(error) {
			    	console.error("Error adding document: ", error);
				})
			}
		})
})

//--------------------------------------------Devolver Info---------------------------------------------------------------
//------------------------------------------Cliente - Servidor------------------------------------------------------------
app.post('/receive', function(req, res){
	var Buscar = req.body.nombre;
//------------------------------------------Servidor - Database----------------------------------------------------------
	var getDocs = db.collection("Users").get()
	.then(snapshot => {
    	snapshot.forEach(doc => {
    		if (doc.id === Buscar){    			
	       		nombre = doc.data().Name,
	       		contra = doc.data().Contraseña
	       		console.log(nombre, contra);       		
	    		reply = {
	    			Nombre: nombre,
	    			Contraseña: contra
	    		};
	    		res.send(reply);
    		}
    		else{
    			reply = {
      				msg: 'ERROR, Documento no encontrado'
      			};      			
				res.send(reply);
    		}
    	});
	})
	.catch(err => {
      console.log('Error getting documents', err);
    });
})
