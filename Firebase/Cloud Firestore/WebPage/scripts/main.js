var config = {
    apiKey: "AIzaSyBUFm68r5EIIJGYKzV7qpGOEeBs6apFZic",
    authDomain: "probandocloudfirestore.firebaseapp.com",
    databaseURL: "https://probandocloudfirestore.firebaseio.com",
    projectId: "probandocloudfirestore",
    storageBucket: "probandocloudfirestore.appspot.com",
    messagingSenderId: "1039546222511"
  };
firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Envia informacion al database - Verifica que ya este agregado
$('#entrar').click(function(){
	var nombre = $('#Nombre').val();
	var contra = $('#Pass').val();
	var nombreRef = db.collection("Users").doc(nombre);
	nombreRef.get()
		.then(doc => {
    		if (doc.exists) {
      			alert("ERROR, Nombre ya Agregado");
    		}else{
      			nombreRef.set({
				    Name: nombre,
				    Contraseña: contra
				})
				.then(function(docRef) {
			    	console.log("Document successfully written");
				})
				.catch(function(error) {
			    	console.error("Error adding document: ", error);
				});
			}
		});
});

// Recibir informacion del database
db.collection("Users").onSnapshot(function(querySnapshot) {
    querySnapshot.docChanges.forEach(function(change) {
    	if (change.type === "added"){
        	console.log(change.doc.id, " => Contraseña:", change.doc.data().Contraseña);
    	}
    });
});

// Envia informacion al database - Basico
/*$('#entrar').click(function(){
	var nombre = $('#Nombre').val();
	var contra = $('#Pass').val();
	db.collection("Users").doc(nombre).set({
	    Name: nombre,
	    Contraseña: contra
	})
	.then(function(docRef) {
    	console.log("Document successfully written");
	})
	.catch(function(error) {
    	console.error("Error adding document: ", error);
	});
});*/
	