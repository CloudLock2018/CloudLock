console.log("Corriendo Inicio de Sesion");

$("#form").submit(function (e) {
	e.preventDefault();
});

function myFunction() {
	var x = document.getElementById("pass");
	if (x.type === "password") {
		x.type = "text";
	} else {
		x.type = "password";
	}
}

var nomTB = $('#usuario');
var passTB = $('#pass');

$('#form').submit(function () {
	$('#btn').addClass("pressed");
	$('#btn').attr('value', '');
	$('.error').css("display", "none");
	$('#correcto').css("display", "none");
	error.className = "error";
	error.innerHTML = "";
	var data = {
		usuario: nomTB.val(),
		contra: passTB.val()
	}
	$.ajax({
		url: '/login',
		type: "POST",
		dataType: "json",
		data: data,
		success: function (data) {
			if (data.msg === 'Error, usuario') {
				$('#error').show();
				error.innerHTML = "El usuario no existe";
				error.className = "error active";
				$('#btn').removeClass("pressed");
				$('#btn').attr('value', 'Entrar');
			}
			else if (data.msg === 'Error, contra') {
				$('#error').show();
				error.innerHTML = "La contraseña es incorrecta";
				error.className = "error active";
				$('#btn').removeClass("pressed");
				$('#btn').attr('value', 'Entrar');
			}
			else if (data.msg === 'Usuario Encontrado') {
				$('#correcto').show();
				correcto.innerHTML = "Usuario Encontrado";
				correcto.className = "correcto active";
				$('#btn').removeClass("pressed");
				$('#btn').attr('value', 'Entrar');
				var date = new Date();
				var minutes = 30;
				date.setTime(date.getTime() + (minutes * 60 * 1000));
				document.cookie = "username=" + nomTB.val() + "; expires=" + date.toUTCString() + ";"
				window.location.href = "../admin.html";
			}
		}
	});
});