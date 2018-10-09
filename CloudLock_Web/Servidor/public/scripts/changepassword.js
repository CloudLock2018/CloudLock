console.log("Corriendo contraseña");

$("#form").submit(function(e) {
    e.preventDefault();
});

var nomTB = $('#usuario');
var passTB = $('#contra');
var pass2TB = $('#repcontra');

$('#entrar').click(function(){
	$('#error').css("display", "none");
	$('#correcto').css("display", "none");
	error.className = "error";
	error.innerHTML = "";
	if (passTB.val() != pass2TB.val()){
		$('#error').show();
		error.innerHTML = "Las contraseñas no coinciden";
    	error.className = "error active";
	}
	else if (passTB.val().length === 0){
		$('#error').show();
		error.innerHTML = "Contraseña no ingresada";
    	error.className = "error active";
	}
	else if (passTB.val().length > 20){
		$('#error').show();
		error.innerHTML = "Contraseña muy larga (Máximo: 20 caracteres)";
    	error.className = "error active";
	}
	else if (passTB.val().length < 6){
		$('#error').show();
		error.innerHTML = "Contraseña muy corta (Mínimo: 6 caracteres)";
    	error.className = "error active";
	}
	else if (pass2TB.val().length === 0){
		$('#error').show();
		error.innerHTML = "Repetir Contraseña no ingresada";
    	error.className = "error active";
	}
	else{
		var data = {
			usuario: nomTB.val(),
			contra: passTB.val() 
		};
		$.ajax({
			url: '/password',
			type: "POST",
		    dataType: "json",
		    data: data,
		    success: function(data){
		    	if(data.msg === 'Error, usuario'){
		    		$('#error').show();
					error.innerHTML = "El usuario no existe";
	    			error.className = "error active";
		    	}
		    	else if (data.msg === 'Contraseña actual'){
		    		$('#error').show();
					error.innerHTML = "Esta es la contraseña actual";
	    			error.className = "error active";
		    	}
		    	else if (data.msg === 'Contraseña Actualizada'){
		    		$('#correcto').show();
					correcto.innerHTML = "Contraseña Actualizada";
	    			correcto.className = "correcto active";
	    			window.location.href = "../index.html";
		    	}
		    }
		});
	}
})