console.log("Corriendo");

var nomTB = $('#nombre');
var emailTB = $('#mail');
var passTB = $('#contra');
var pass2TB = $('#repcontra');

//Function when the button is clicked
$('#entrar').click(function(){
	var sEmail = emailTB.val();
	if (passTB.val() != pass2TB.val()){
		alert ("Las contraseñas no coinciden");
	}
	//Checks if there is info in the TextBoxes
	if (nomTB.val().length === 0){
		alert("Nombre de usuario no ingresado");
	}
	else if (emailTB.val().length === 0){
		alert("Email no ingresada");
	}
	else if (passTB.val().length === 0){
		alert("Contraseña no ingresada");
	}
	else if (passTB.val().length === 0){
		alert("Repetir Contraseña no ingresada");
	}
	//Check if the mail could be possible
	else if (validateEmail(sEmail)) {
    	console.log('Email is valid');
		//Saves info in a json var
		var data = {
			nombre: nomTB.val(),
			email: emailTB.val(),
			contra: passTB.val()
		}
		//Sends data to the server
		$.ajax({
	        url: 'http://localhost:3000/register',
	        type: "POST",
	        dataType: "json",
	        data: data,
	        success: function(data){
	        	//Checks if the user already exists and alerts
	        	if (data.msg === 'Error'){
	        		alert("Nombre de Usuario ya utilizado");
	        	}
	        	else if(data.msg === 'Error, mail'){
	        		alert("Email ya utilizado");
	        	}
	        	else{
	        		console.log(data);
	        	}
        	}
    	});
	}
    else {
        alert('Invalid Email Address');
    }
});

function validateEmail(sEmail) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(sEmail)) {
        return true;
    }
    else {
	    return false;
    }
}