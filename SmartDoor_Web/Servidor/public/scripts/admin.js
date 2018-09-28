console.log("Corriendo Administrador");

/*var misCookies = document.cookie;

function leerCookie(nombre) {
 var lista = document.cookie.split(";");
     for (i in lista) {
         var busca = lista[i].search(nombre);
         if (busca > -1) 
         	{
         		micookie=lista[i];
         	}
         	else
         	{
         		window.location.href = "../index.html";
         	}
     }
 var igual = micookie.indexOf("=");
 var valor = micookie.substring(igual+1);
return valor;
}
document.getElementById("name").innerHTML = leerCookie("username");
*/
agre();
borrar();
var num = 0;
var elegido = 0;
var agreg = false;


function agre(){
	$('#agregar').click(function(){
		if (num === 0){
			$("#0").show();
			agreg = true;
		}
		else {
			if (agreg === false){
				console.log(num);
				var agregarNombre = "<div id='" + num + "' class='contenedor2'><input type='text' placeholder='Usuario' id='" + num + "'><input class='error' type='button' value='✖' id='" + num + "'><input class='button' type='button' value='✔' id='" + num + "'></div>";
				$(agregarNombre).appendTo(".subusuarios");
				$('.contenedor2').show();
				agreg = true;
				borrar();
			}
			else
			{
				alert("Agregue un nombre");
			}
		}
	})
}
/*$('.button').click(function(){
	if ($('#nombre').val().length === 0){
		alert("Agregue un nombre");
	}
	else
	{
		num += 1;
		agreg = false;
	}
})*/

function borrar(){
	$('.error').click(function(){
		elegido = this.id;
		console.log(elegido);
    	$('#' + elegido).closest("div").remove();
    		num += 1;
    		agreg = false;
 	});  
}
