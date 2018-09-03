console.log("Corriendo");

$('#entrar').click(function(){
	$('#nombre').keypress(function (e) {
    	var allowedChars = new RegExp("^[a-zA-Z0-9\-]+$");
    	var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    	if (allowedChars.test(str)) {
        	return true;
    	}
    	e.preventDefault();
    	alert("Solo se aceptan letras, números y el signo '-'");
	});
})