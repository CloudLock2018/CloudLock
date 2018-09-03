console.log("Corriendo");

var nomTB = $('#nombre');
var passTB = $('#contra');

//Function when the button is clicked
$('#entrar').click(function(){
	//Checks if there is info in the TextBoxes
	if (nomTB.val().length === 0){
		alert("Nombre de usuario no ingresado");
	}
	else if (passTB.val().length === 0){
		alert("Contraseña no ingresada");
	}
	else{
		//Saves info in a json var
		var data = {
			nombre: nomTB.val(),
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
	        	else{
	        		console.log(data);
	        	}
        	}
    	});
	}
});