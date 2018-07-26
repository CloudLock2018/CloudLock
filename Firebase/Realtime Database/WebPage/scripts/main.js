/* Agregar Firebase al proyecto */
var config = {
    apiKey: "AIzaSyBnA_o13gJezbMqz3SVYvnTb7L5ray-gYo",
    authDomain: "probandofirebase-8bf1d.firebaseapp.com",
    databaseURL: "https://probandofirebase-8bf1d.firebaseio.com",
    projectId: "probandofirebase-8bf1d",
    storageBucket: "probandofirebase-8bf1d.appspot.com",
    messagingSenderId: "881595412805"
  };
firebase.initializeApp(config);

/* Obtener el database de Firebase */
var database = firebase.database();
/* Crear un contenedor en el database */
var ref = database.ref('Nombres');

var nombres;
var keys;

/* Enviar Informacion al database */
$('#entrar').click(function(){
	var nombre = $('#Nombre').val();
	var yaAgregado = false;
	for (var i = 0; i < keys.length; i++){
		var k = keys[i];
		if (nombre === nombres[k].nom){
			yaAgregado = true;
			alert("ERROR, Nombre ya agregado");
			break;
		}
	}
	if (yaAgregado === false){	
		var data = {
			nom: nombre
		}
		console.log(data);
		ref.push(data);
	}
});


/* Obtener Informacion del database */
ref.on('value', getData, errData);

function getData(data){
	//console.log(data.val());
	nombres = data.val();
	keys = Object.keys(nombres);
	for(var i = 0; i < keys.length; i++){
		var k = keys[i]
		var nombre = nombres[k].nom;
		console.log(nombre);
	}
}

function errData(err){
	console.log('ERROR!');
	console.log(err);
}


/* Enviar Informacion al database - Basico */
/*$('#entrar').click(function(){
	var nombre = $('#Nombre').val();
	var data = {
		nom: nombre
	}
	console.log(data);
	ref.push(data);
});*/

/*Firebase private rules*/
/*{
  //Visit https://firebase.google.com/docs/database/security to learn more about security rules.
  "rules": {
    ".read": false,
    ".write": false
  }
}*/

/* Firebase public rules */
/*{
  "rules": {
    ".read": true,
    ".write": true
  }
}*/