console.log("Corriendo");

var nomTB = $('#nombre');
var emailTB = $('#mail');
var passTB = $('#contra');
var pass2TB = $('#repcontra');

//Function when the button is clicked
$('#entrar').click(function(){
	$('#error').css("display", "none");
	$('#correcto').css("display", "none");
	var sEmail = emailTB.val();
	if (passTB.val() != pass2TB.val()){
		$('#error').show();
		$('#errText').text("Las contraseñas no coinciden");
	}
	//Checks if there is info in the TextBoxes
	if (nomTB.val().length === 0){
		$('#error').show();
		$('#errText').text("Nombre de usuario no ingresado");
	}
	else if (nomTB.val().length > 16){
		$('#error').show();
		$('#errText').text("Nombre de usuario muy largo (Máximo: 16 caracteres)");
	}
	else if (nomTB.val().length < 6){
		$('#error').show();
		$('#errText').text("Nombre de usuario muy corto (Mínimo: 6 caracteres)");
	}
	else if (emailTB.val().length === 0){
		$('#error').show();
		$('#errText').text("Email no ingresada");
	}
	else if (passTB.val().length === 0){
		$('#error').show();
		$('#errText').text("Contraseña no ingresada");
	}
	else if (passTB.val().length > 20){
		$('#error').show();
		$('#errText').text("Contraseña muy larga (Máximo: 20 caracteres)");
	}
	else if (passTB.val().length < 6){
		$('#error').show();
		$('#errText').text("Contraseña muy corta (Mínimo: 6 caracteres)");
	}
	else if (pass2TB.val().length === 0){
		$('#error').show();
		$('#errText').text("Repetir Contraseña no ingresada");
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
	        		$('#error').show();
					$('#errText').text("Nombre de Usuario ya utilizado");
	        	}
	        	else if (data.msg === 'Error, mail'){
	        		$('#error').show();
					$('#errText').text("Email ya utilizado");
	        	}
	        	else{
	        		$('#correcto').show();
					$('#corText').text("Registro realizado correctamente");
					setTimeout(function(){
						window.location.href = "../IniciarSesion/index.html";	
					}, 2000);
	        	}
        	}
    	});
	}
    else {
    	$('#error').show();
		$('#errText').text("Email inválido");
    }
});

//Set the basics of an email
function validateEmail(sEmail) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(sEmail)) {
        return true;
    }
    else {
	    return false;
    }
}

function myFunction() {
    var x = document.getElementById("contra");
    var z = document.getElementById("repcontra");
    if (x.type === "password" && z.type === "password") {
        x.type = "text";
        z.type = "text";
    } else {
        x.type = "password";
        z.type = "password";
    }
}