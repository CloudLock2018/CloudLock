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

$('#btn').click(function(){
	var data = {
		usuario: nomTB.val(),
		contra: passTB.val()
	}
	console.log(data);
	$.ajax({
		url: 'http://localhost:3000/login',
		type: "POST",
	    dataType: "json",
	    data: data, 
	    success: function(data){
	    	if(data.msg === 'Error, usuario'){
	    		alert("ERROR, el usuario no existe");
	    	}
	    	else if (data.msg === 'Error, contra'){
	    		alert("ERROR, la contraseña es incorrecta");
	    	}
	    	else if (data.msg === 'Usuario Encontrado'){
	    		alert("Usuario Encontrado");
	    	}
	    }
	});
})