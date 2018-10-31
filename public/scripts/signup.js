console.log("Corriendo Registro");

$("#form").submit(function (e) {
	e.preventDefault();
});

var nomTB = $('#nombre');
var emailTB = $('#mail');
var passTB = $('#contra');
var pass2TB = $('#repcontra');

//Function when the button is clicked
$('#form').submit(function () {
	$('#entrar').addClass("pressed");
	$('#entrar').attr('value', '');
	$('.error').css("display", "none");
	$('#correcto').css("display", "none");
	error.className = "error";
	error.innerHTML = "";
	var sEmail = emailTB.val();
	if (passTB.val() != pass2TB.val()) {
		$('#error').show();
		error.innerHTML = "Las contraseñas no coinciden";
		error.className = "error active";
		$('#entrar').removeClass("pressed");
		$('#entrar').attr('value', 'Registrate');
	}
	//Checks if there is info in the TextBoxes
	else if (nomTB.val().length === 0) {
		$('.error').show();
		error.innerHTML = "Nombre de usuario no ingresado";
		error.className = "error active";
		$('#entrar').removeClass("pressed");
		$('#entrar').attr('value', 'Registrate');
	} else if (nomTB.val().length > 16) {
		$('#error').show();
		error.innerHTML = "Nombre de usuario muy largo (Máximo: 16 caracteres)";
		error.className = "error active";
		$('#entrar').removeClass("pressed");
		$('#entrar').attr('value', 'Registrate');
	} else if (nomTB.val().length < 6) {
		$('#error').show();
		error.innerHTML = "Nombre de usuario muy corto (Mínimo: 6 caracteres)";
		error.className = "error active";
		$('#entrar').removeClass("pressed");
		$('#entrar').attr('value', 'Registrate');
	} else if (emailTB.val().length === 0) {
		$('#error').show();
		error.innerHTML = "Correo electrónico no ingresado";
		error.className = "error active";
		$('#entrar').removeClass("pressed");
		$('#entrar').attr('value', 'Registrate');
	} else if (passTB.val().length === 0) {
		$('#error').show();
		error.innerHTML = "Contraseña no ingresada";
		error.className = "error active";
		$('#entrar').removeClass("pressed");
		$('#entrar').attr('value', 'Registrate');
	} else if (passTB.val().length > 20) {
		$('#error').show();
		error.innerHTML = "Contraseña muy larga (Máximo: 20 caracteres)";
		error.className = "error active";
		$('#entrar').removeClass("pressed");
		$('#entrar').attr('value', 'Registrate');
	} else if (passTB.val().length < 6) {
		$('#error').show();
		error.innerHTML = "Contraseña muy corta (Mínimo: 6 caracteres)";
		error.className = "error active";
		$('#entrar').removeClass("pressed");
		$('#entrar').attr('value', 'Registrate');
	} else if (pass2TB.val().length === 0) {
		$('#error').show();
		error.innerHTML = "Repetir Contraseña no ingresada";
		error.className = "error active";
		$('#entrar').removeClass("pressed");
		$('#entrar').attr('value', 'Registrate');
	}
	//Check if the mail could be possible
	else if (validateEmail(sEmail)) {
		//Saves info in a json var
		var data = {
			nombre: nomTB.val(),
			email: emailTB.val(),
			contra: passTB.val()
		}
		//Sends data to the server
		$.ajax({
			url: '/register',
			type: "POST",
			dataType: "json",
			data: data,
			success: function (data) {
				//Checks if the user already exists and alerts
				if (data.msg === 'Error') {
					$('#error').show();
					error.innerHTML = "Nombre de Usuario ya utilizado";
					error.className = "error active";
					$('#entrar').removeClass("pressed");
					$('#entrar').attr('value', 'Registrate');
				} else if (data.msg === 'Error, mail') {
					$('#error').show();
					error.innerHTML = "Correo electrónico ya utilizado";
					error.className = "error active";
					$('#entrar').removeClass("pressed");
					$('#entrar').attr('value', 'Registrate');
				} else {
					$('#correcto').show();
					$('#entrar').removeClass("pressed");
					$('#entrar').attr('value', 'Registrate');
					correcto.innerHTML = "Registro realizado correctamente";
					correcto.className = "correcto active";
					setTimeout(function () {
						window.location.href = "../index.html";
					}, 2000);
				}
			}
		});
	} else {
		$('#error').show();
		error.innerHTML = "Correo electrónico inválido";
		error.className = "error active";
		$('#entrar').removeClass("pressed");
		$('#entrar').attr('value', 'Registrate');
	}
});

//Set the basics of an email
function validateEmail(sEmail) {
	var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	if (filter.test(sEmail)) {
		return true;
	} else {
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