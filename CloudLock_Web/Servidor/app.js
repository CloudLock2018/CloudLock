//Server Location (Axel): C:\Users\43871824\Documents\4to TIC\Proyecto Final\CloudLock\CloudLock_Web\Servidor
//Server Location (Joako): C:\Users\43322826\Documents\GitHub\CloudLock\CloudLock_Web\Servidor

//Initialize Express (Server)
var express = require('express');
var bodyParser = require('body-parser')
var app = express();

//Set up Server
app.listen(3000, function () { console.log('Listen on port 3000') });
app.use('/', express.static('public'));
//Set up BodyParse
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//Allow CORS 
app.use(function (req, res, next) {
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
var nombreV;

//Receive info from client (Verify Account)
app.post('/verify', function (req, res) {
	nombreV = req.body.usuario;
	var usuario = db.collection("Users").doc(nombreV);
	usuario.get()
		.then(doc => {
			if (doc.exists) {
				usuario.update({
					Verificado: true
				});
				reply = {
					msg: 'Verificado'
				};
				res.end(JSON.stringify(reply));
			}
			else{
				reply = {
					msg: 'Error, usuario'
				};
				res.end(JSON.stringify(reply));
			}
		});
})

var nombreL;
var contraL;

//Receive info from client (Login)
app.post('/login', function (req, res) {
	//Get info
	nombreL = req.body.usuario;
	contraL = req.body.contra;
	var usuario = db.collection("Users").doc(nombreL);
	usuario.get()
		.then(doc => {
			//Checks if the username exists
			if (doc.exists) {
				//Checks if the password set is equal to the password written
				if (doc.data().Contraseña === contraL) {
					reply = {
						msg: 'Usuario Encontrado'
					};
					res.end(JSON.stringify(reply));
				}
				else {
					reply = {
						msg: 'Error, contra'
					};
					res.end(JSON.stringify(reply));
				}
			}
			else {
				reply = {
					msg: 'Error, usuario'
				};
				res.end(JSON.stringify(reply));
			}
		})
});


var nombreC;
var contraC;

//Receive info from client (Change Password)
app.post('/password', function (req, res) {
	nombreC = req.body.usuario;
	contraC = req.body.contra;
	var usuario = db.collection("Users").doc(nombreC);
	usuario.get()
		.then(doc => {
			if (doc.exists) {
				if (doc.data().Contraseña === contraC) {
					reply = {
						msg: 'Contraseña actual'
					};
					res.end(JSON.stringify(reply));
				}
				else {
					//Updates user's password (insecure)
					usuario.update({
						Contraseña: contraC
					});
					reply = {
						msg: 'Contraseña Actualizada'
					};
					res.end(JSON.stringify(reply));
				}
			}
			else {
				reply = {
					msg: 'Error, usuario'
				};
				res.end(JSON.stringify(reply));
			}
		})
});

var subusuarioA;

//Receive info from client (Admin - Save new subuser)
app.post('/subuser', function (req, res) {
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
				res.end(JSON.stringify(reply));
			}
			else {
				usuario.set({
					Nombre_de_Subusuario: subusuarioA,
					IMEI: null
				})
					.then(function (docRef) {
						reply = {
							msg: 'Gracias'
						};
						res.end(JSON.stringify(reply));
					})
					//Send error if it happens one
					.catch(function (error) {
						console.error("Error adding document: ", error);
					})
			}
		})
})


//Receive info from client (Admin - Reload subusers)
app.post('/reload', function (req, res) {
	usuarioA = req.body.usuario;
	var usuario = db.collection("Users").doc(usuarioA);
	usuario.get()
		.then(doc => {
			if (doc.exists) {
				usuario.collection("Subusers").get().then(function (querySnapshot) {
					querySnapshot.forEach(function (doc) {
						if (subusuarios === null) {
							subusuarios = "<div id='" + cant + "' class='contenedor3'><span class='sub' id='" + cant + "'>" + doc.data().Nombre_de_Subusuario + "</span><span class='IMEI' id='" + cant + "'>IMEI: " + doc.data().IMEI + "</span><input class='eliminar' type='button' title='Borrar' value='✖' id='" + cant + "'><input class='cambiar' type='button' title='Editar' value='✎' id='" + cant + "'></div>";
							cant += 1;
						}
						else {
							subusuarios += "<div id='" + cant + "' class='contenedor3'><span class='sub' id='" + cant + "'>" + doc.data().Nombre_de_Subusuario + "</span><span class='IMEI' id='" + cant + "'>IMEI: " + doc.data().IMEI + "</span><input class='eliminar' type='button' title='Borrar' value='✖' id='" + cant + "'><input class='cambiar' type='button' title='Editar' value='✎' id='" + cant + "'></div>";
							cant += 1;
						}
					});
					if (subusuarios === null) {
						hay = false;
					}
					reply = {
						msg: 'Hecho',
						contenido: subusuarios,
						cantidad: cant,
						existe: hay
					};
					res.end(JSON.stringify(reply));
					cant = 1;
					subusuarios = null;
					hay = true;
				});
			}
			else {
				reply = {
					msg: 'Error'
				};
				res.end(JSON.stringify(reply));
			}
		})
})

var eliminarsubA;

//Receive info from client (Admin - Delete certain subuser)
app.post('/delete', function (req, res) {
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
				res.end(JSON.stringify(reply));
			}
			else {
				reply = {
					msg: 'Error'
				};
				res.end(JSON.stringify(reply));
			}
		})
})

//----------------------------------------EMAIL-------------------------------------------------//
var nodemailer = require("nodemailer");

var nombreR;
var emailR;
var contraR;
var repetido;

//Receive info from client (Register)
app.post('/register', function (req, res) {
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
				res.end(JSON.stringify(reply));
			}
			else {
				//Checks if the email was already used
				db.collection("Users").where('Email', '==', emailR).get()
					.then(snapshot => {
						snapshot.forEach(doc => {
							repetido = true;
							reply = {
								msg: 'Error, mail'
							};
							res.end(JSON.stringify(reply));
						});
						//if the email has never been used before, then it will create a new doc in the DB
						if (repetido === false) {
							usuario.set({
								Nombre_de_Usuario: nombreR,
								Email: emailR,
								Contraseña: contraR,
								Verificado: false,
								IMEI: null
							})
								.then(function (docRef) {
									var transporter = nodemailer.createTransport(({
										service: 'gmail',
										auth: {
											type: 'OAuth2',
											user: 'cloudlockteam@gmail.com',
											password: 'Cloudlock2018',
											clientId: '557641999434-ukib5ncu6roold8t316tjavflnnjtsds.apps.googleusercontent.com',
											clientSecret: 'wpt8HbRwrY1zW8_JbxWFQR9z',
											refreshToken: '1/R1EUSacpTsW7AgV9_dY19oMRBBKYaVeb-9fANlrCJjg',
											accessToken: 'ya29.GlswBrG4PlHMn0eeS12uEhEODfv73OPOeAoNnFU1z98Bkaad7KAQIdt8FVPhpzmNKlnn9OdmVi7rIpBwJ4gejoazX0S_eFNRBQHNRfuOMoAMBrQRj9ToWZjWoNG2'
										}
									}));

									var mailOptions = {
										from: 'CloudLock Team <cloudlockteam@gmail.com>',
										to: emailR,
										subject: 'Verificar Cuenta',
										text: 'Buenos Dias. Usted se ha registrado a CloudLock y es necesario que verifique su cuenta, en caso de que en el futuro se borren las cuentas no verificadas. Para realizarlo, por favor ingrese a este link: http://localhost:3000/verifyaccount.html. El equipo de CloudLock.'
									}

									transporter.sendMail(mailOptions, function (err, res) {
										if (err) {
											console.log('Error: ' + err);
										}
										else {
											console.log('Email sent');
										}
									})
									reply = {
										msg: 'Gracias ' + nombreR + ', contraseña: ' + contraR
									};
									res.end(JSON.stringify(reply));
								})
								//Send error if it happens one
								.catch(function (error) {
									console.error("Error adding document: ", error);
								})
						}
					})
			}
		})
});

var usuarioP;
var emailP;
//Receive info from client (Password)
app.post('/newpassword', function (req, res) {
	usuarioP = req.body.usuario;
	var usuario = db.collection("Users").doc(usuarioP);
	usuario.get()
		.then(doc => {
			if (doc.exists) {
				emailP = doc.data().Email;
				var transporter = nodemailer.createTransport(({
					service: 'gmail',
					auth: {
						type: 'OAuth2',
						user: 'cloudlockteam@gmail.com',
						password: 'Cloudlock2018',
						clientId: '557641999434-ukib5ncu6roold8t316tjavflnnjtsds.apps.googleusercontent.com',
						clientSecret: 'wpt8HbRwrY1zW8_JbxWFQR9z',
						refreshToken: '1/R1EUSacpTsW7AgV9_dY19oMRBBKYaVeb-9fANlrCJjg',
						accessToken: 'ya29.GlswBrG4PlHMn0eeS12uEhEODfv73OPOeAoNnFU1z98Bkaad7KAQIdt8FVPhpzmNKlnn9OdmVi7rIpBwJ4gejoazX0S_eFNRBQHNRfuOMoAMBrQRj9ToWZjWoNG2'
					}
				}));

				var mailOptions = {
					from: 'CloudLock Team <cloudlockteam@gmail.com>',
					to: emailP,
					subject: 'Cambio de Contraseña',
					text: 'Buenos Dias. Usted ha solicitado un cambio de contraseña para su cuenta. Para realizarlo, por favor ingrese a este link: http://localhost:3000/changepassword.html. El equipo de CloudLock.'
				}

				transporter.sendMail(mailOptions, function (err, res) {
					if (err) {
						console.log('Error: ' + err);
					}
					else {
						console.log('Email sent');
					}
				})
				reply = {
					msg: 'Email enviado'
				};
				res.end(JSON.stringify(reply));
			}
			else {
				reply = {
					msg: 'Error, usuario'
				};
				res.end(JSON.stringify(reply));
			}
		})
})


//-------------------------------------ADAFRUIT API---------------------------------------------//
var mqtt = require('mqtt');
var Door = 'CloudlockTeam/f/Door';
var IMEI = 'CloudlockTeam/f/IMEI';
var Status = 'CloudlockTeam/f/Status';

var client = mqtt.connect('mqtt://io.adafruit.com', {
	port: 1883,
	username: 'CloudlockTeam',
	password: '17d40238f10342fdb884cf02a62db208'
});

client.on('connect', function () {
	//Abrir y cerrar puerta
	client.subscribe(Door)
	//Enviar IMEI
	client.subscribe(IMEI)
	//Verificar o subir IMEI
	client.subscribe(Status)
});

client.on('connect', function () {
	//Cerrado
	client.publish(Door, 'D0')
	//Nulo
	client.publish(IMEI, 'M0')
	//Verificar
	client.publish(Status, 'S0')
});

client.on('error', (error) => {
	console.log('MQTT Client Errored');
	console.log(error);
})

var usuarioA;
var subusuarios = null;
var cant = 1;
var hay = true;
var verificar = true;

//Receive info from client (Admin - IMEI & subuser already saved)
app.post('/imei', function (req, res) {
	usuarioA = req.body.usuario;
	var usuario = db.collection("Users").doc(usuarioA);
	usuario.get()
		.then(doc => {
			if (doc.exists) {
				//Checks if user's IMEI is null or not
				if (doc.data().IMEI === null) {
					//Agregar
					client.publish(Status, 'S1')
					verificar = false;
					reply = {
						msg: 'No imei'
					};
					res.end(JSON.stringify(reply));
				}
				else {
					usuario.collection("Subusers").get().then(function (querySnapshot) {
						querySnapshot.forEach(function (doc) {
							if (subusuarios === null) {
								subusuarios = "<div id='" + cant + "' class='contenedor3'><span class='sub' id='" + cant + "'>" + doc.data().Nombre_de_Subusuario + "</span><span class='IMEI' id='" + cant + "'>IMEI: " + doc.data().IMEI + "</span><input class='eliminar' type='button' title='Borrar' value='✖' id='" + cant + "'><input class='cambiar' type='button' title='Editar' value='✎' id='" + cant + "'></div>";
								cant += 1;
							}
							else {
								subusuarios += "<div id='" + cant + "' class='contenedor3'><span class='sub' id='" + cant + "'>" + doc.data().Nombre_de_Subusuario + "</span><span class='IMEI' id='" + cant + "'>IMEI: " + doc.data().IMEI + "</span><input class='eliminar' type='button' title='Borrar' value='✖' id='" + cant + "'><input class='cambiar' type='button' title='Editar' value='✎' id='" + cant + "'></div>";
								cant += 1;
							}
						});
						if (subusuarios === null) {
							hay = false;
						}
						reply = {
							msg: 'Hay imei',
							imei: doc.data().IMEI,
							contenido: subusuarios,
							cantidad: cant,
							existe: hay
						}
						res.end(JSON.stringify(reply));
						cant = 1;
						subusuarios = null;
						hay = true;
					});
				}
			}
		})
});

var usuarioMA;
var IMEIingresado;
var infinito = 1;
var existente = false;

//Receive info from Adafruit API (NFC) and saves the IMEI into the user's database
app.post('/imeiAdmin', function (req, res) {
	usuarioMA = req.body.usuario;
	if (verificar === false) {
		for (var i = 0; i < infinito; i++) {
			client.on('message', function (topic, message) {
				// message is Buffer
				if (topic === IMEI) {
					if (message.toString() === 'M0') {
						infinito++;
					}
					else {
						IMEIingresado = message.toString();
						var col = db.collection("Users");
						var usuario = db.collection("Users").doc(usuarioMA);
						usuario.get()
							.then(doc => {
								col.get().then(function (querySnapshot) {
									querySnapshot.forEach(function (doc) {
										if (doc.data().IMEI === IMEIingresado) {
											existente = true;
										}
										else {
											col.doc(doc.data().Nombre_de_Usuario).collection("Subusers").get().then(function (querySnapshot) {
												querySnapshot.forEach(function (doc) {
													if (doc.data().IMEI === IMEIingresado) {
														existente = true;
													}
												});
												if (existente === true){
													//Error
													client.publish(Door, 'D2')
													//Nulo
													client.publish(IMEI, 'M0')
													//Verificar
													client.publish(Status, 'S0')
													verificar = true;
													infinito = 1;
													existente = false;
													reply = {
														msg: "Ya existe"
													}
													res.end(JSON.stringify(reply));
												}
												else if (existente === false) {
													usuario.update({
														IMEI: IMEIingresado
													});
													//Nulo
													client.publish(IMEI, 'M0')
													//Verificar
													client.publish(Status, 'S0')
													verificar = true;
													infinito = 1;
													reply = {
														msg: 'IMEI Actualizada'
													}
													res.end(JSON.stringify(reply));
												}
											});
										}
									});
									if (existente === true){
										//Error
										client.publish(Door, 'D2')
										//Nulo
										client.publish(IMEI, 'M0')
										//Verificar
										client.publish(Status, 'S0')
										verificar = true;
										infinito = 1;
										existente = false;
										reply = {
											msg: "Ya existe"
										}
										res.end(JSON.stringify(reply));
									}
								});
							})
					}
				}
			})
		}
	}
	else {
		reply = {
			msg: 'Error'
		}
		res.end(JSON.stringify(reply));
	}
})

var usuarioEA;

//Checks if the user exists and establish the protocols
app.post('/editAdmin', function (req, res) {
	usuarioEA = req.body.usuario;
	client.publish(Status, 'S1')
	verificar = false;
	var usuario = db.collection("Users").doc(usuarioEA);
	usuario.get()
		.then(doc => {
			if (doc.exists) {
				reply = {
					msg: 'Editar'
				}
				res.end(JSON.stringify(reply));
			}
			else {
				reply = {
					msg: 'Error'
				}
				res.end(JSON.stringify(reply));
			}
		})
})

var usuarioES;
var subusuarioES;

//Checks if the user exists and establish the protocols
app.post('/editSub', function (req, res) {
	usuarioES = req.body.usuario;
	subusuarioES = req.body.sub;
	client.publish(Status, 'S1')
	verificar = false;
	var usuario = db.collection("Users").doc(usuarioES).collection("Subusers").doc(subusuarioES);
	usuario.get()
		.then(doc => {
			if (doc.exists) {
				reply = {
					msg: 'Editar'
				}
				res.end(JSON.stringify(reply));
			}
			else {
				reply = {
					msg: 'Error'
				}
				res.end(JSON.stringify(reply));
			}
		})
})

var usuarioMS;
var subusuarioMS;

//Receive info from Adafruit API (NFC) and saves the IMEI into the subuser's database
app.post('/imeiSub', function (req, res) {
	usuarioMS = req.body.usuario;
	subusuarioMS = req.body.sub;
	if (verificar === false) {
		for (var i = 0; i < infinito; i++) {
			client.on('message', function (topic, message) {
				// message is Buffer
				if (topic === IMEI) {
					if (message.toString() === 'M0') {
						infinito++;
					}
					else {
						IMEIingresado = message.toString();
						var col = db.collection("Users");
						col.get().then(function (querySnapshot) {
							querySnapshot.forEach(function (doc) {
								if (doc.data().IMEI === IMEIingresado) {
									existente = true;
								}
								else {
									col.doc(doc.data().Nombre_de_Usuario).collection("Subusers").get().then(function (querySnapshot) {
										querySnapshot.forEach(function (doc) {
											if (doc.data().IMEI === IMEIingresado) {
												existente = true;
											}
										});
										if (existente === true){
											//Error
											client.publish(Door, 'D2')
											//Nulo
											client.publish(IMEI, 'M0')
											//Verificar
											client.publish(Status, 'S0')
											verificar = true;
											infinito = 1;
											existente = false;
											reply = {
												msg: "Ya existe"
											}
											res.end(JSON.stringify(reply));
										}
										else if (existente === false) {
											var actualizarSub = db.collection("Users").doc(usuarioMS).collection("Subusers").doc(subusuarioMS).update({
												IMEI: IMEIingresado
											});
											//Nulo
											client.publish(IMEI, 'M0')
											//Verificar
											client.publish(Status, 'S0')
											verificar = true;
											infinito = 1;
											reply = {
												msg: 'IMEI Actualizada'
											}
											res.end(JSON.stringify(reply));
										}
									});
								}
							});
							if (existente === true){
								//Error
								client.publish(Door, 'D2')
								//Nulo
								client.publish(IMEI, 'M0')
								//Verificar
								client.publish(Status, 'S0')
								verificar = true;
								infinito = 1;
								existente = false;
								reply = {
									msg: "Ya existe"
								}
								res.end(JSON.stringify(reply));
							}
						});
					}
				}
			})
		}
	}
	else {
		reply = {
			msg: 'Error'
		}
		res.end(JSON.stringify(reply));
	}
})

var abierto = false;
//Checks if the IMEI sent exists in the database. If it does, opens the door
client.on('message', function (topic, message) {
	if (topic === Status) {
		if (message.toString() === 'S0') {
			verificar = true;
		}
		else{
			verificar = false;
		}
	}
	if (topic === IMEI) {
		if (verificar === true) {
			if (message.toString() === 'M0') {

			}
			else {
				IMEIingresado = message.toString();
				console.log('IMEI ingresada: ' + IMEIingresado);
				var usuario = db.collection("Users");
				usuario.get().then(function (querySnapshot) {
					querySnapshot.forEach(function (doc) {
						console.log("IMEI del documento: " + doc.data().IMEI);
						if (doc.data().IMEI === IMEIingresado) {
							abierto = true;
						}
						else {
							usuario.doc(doc.data().Nombre_de_Usuario).collection("Subusers").get().then(function (querySnapshot) {
								querySnapshot.forEach(function (doc) {
									console.log("IMEI del documento: " + doc.data().IMEI);
									if (doc.data().IMEI === IMEIingresado) {
										abierto = true;
									}
								});
								if (abierto === true) {
									client.publish(Door, 'D1')
									console.log("abierto");
								}
								else if (abierto === false) {
									client.publish(Door, 'D2')
									console.log("no existe esa imei")
								}
								abierto = false;
							});
						}
					});
					if (abierto === true) {
						client.publish(Door, 'D1')
						console.log("abierto");
					}
					else if (abierto === false) {
						client.publish(Door, 'D2')
						console.log("no existe esa imei");
					}
					client.publish(IMEI, 'M0')
					abierto = false;
				});
			}
		}
		else{

		}
	}
});