var emailTB = $('#mail');

$('#entrar').click(function(){
	$('#error').css("display", "none");
	$('#correcto').css("display", "none");
	var sEmail = emailTB.val();
	
	if (emailTB.val().length === 0){
		$('#error').show();
		$('#errText').text("Correo electrónico no ingresado");
	}
	else if (validateEmail(sEmail)) {
    	console.log('Email is valid');

    	//Saves info in a json var
		var data = {
			email: emailTB.val(),
		}
		//Sends data to the server
		$.ajax({
	        url: 'http://localhost:3000/register',
	        type: "POST",
	        dataType: "json",
	        data: data,
	        success: function(data){
	        	//Checks if the user already exists and alerts
	        	if (data.msg === 'Correcto, mail'){
	        		$('#correcto').show();
					$('#corText').text("¡Te hemos enviado un correo!");
	        	}
	        	else
	        	{
	        		$('#error').show();
					$('#errText').text("¡Este correo electrónico no existe!");
	        	}
        	}
    	});
	}
    else {
    	$('#error').show();
		$('#errText').text("Correo electrónico inválido");
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