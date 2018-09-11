var nomTB = $('#usuario');

$('#entrar').click(function(){
	$('#error').css("display", "none");
	$('#correcto').css("display", "none");
	error.className = "error";
	error.innerHTML = "";
	var data = {
		usuario: nomTB.val() 
	};
	$.ajax({
		url: 'http://localhost:3000/password',
		type: "POST",
	    dataType: "json",
	    data: data,
	    success: function(data){
	    	if(data.msg === 'Error, usuario'){
	    		$('#error').show();
				error.innerHTML = "El usuario no existe";
    			error.className = "error active";
	    	}
	    	else if (data.msg === 'Usuario Encontrado'){
	    		$('#correcto').show();
				correcto.innerHTML = "Usuario Encontrado";
    			correcto.className = "correcto active";
	    	}
	    }
	});
})