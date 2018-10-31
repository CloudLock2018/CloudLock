console.log("Corriendo contraseña");

$("#form").submit(function (e) {
	e.preventDefault();
});

var nomTB = $('#usuario');

$('#form').submit(function () {
	$('#entrar').addClass("pressed");
	$('#entrar').attr('value', '');
	$('#error').css("display", "none");
	$('#correcto').css("display", "none");
	error.className = "error";
	error.innerHTML = "";
	if (nomTB.val().length === 0) {
		$('#error').show();
		error.innerHTML = "Nombre de usuario no ingresado";
		error.className = "error active";
		$('#entrar').removeClass("pressed");
		$('#entrar').attr('value', 'Verificar Cuenta');
	} else {
		var data = {
			usuario: nomTB.val()
		};
		$.ajax({
			url: '/verify',
			type: "POST",
			dataType: "json",
			data: data,
			success: function (data) {
				if (data.msg === 'Error, usuario') {
					$('#error').show();
					error.innerHTML = "El usuario no existe";
					error.className = "error active";
					$('#entrar').removeClass("pressed");
					$('#entrar').attr('value', 'Verificar Cuenta');
				} else if (data.msg === 'Verificado') {
					$('#correcto').show();
					correcto.innerHTML = "Cuenta Verificada";
					correcto.className = "correcto active";
					$('#entrar').removeClass("pressed");
					$('#entrar').attr('value', 'Verificar Cuenta');
					setTimeout(function () {
						window.location.href = "../index.html";
					}, 2000);
				}
			}
		});
	}
})