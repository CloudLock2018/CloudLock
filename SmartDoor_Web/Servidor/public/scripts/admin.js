console.log("Corriendo Administrador");

var misCookies = document.cookie;

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

var num = 0;
var agreg = false;

$('#agregar').click(function(){
	if (agreg === false){
		var agregarNombre = "<div class='contenedor2'><input id='nombre'><input type='button' value='Entrar' id='btn'></div>";
		$(".contenedor2").show();
		$("#nombre").show();
		$("#btn").show();
		$(agregarNombre).appendTo(".subusuarios");
		agreg = true;
	}
	else
	{
		alert("Agregue un nombre");
	}
})

$('#btn').click(function(){
	if ($('#nombre').val().length === 0){
		alert("Agregue un nombre");
	}
	else
	{
		agreg = false;
	}
})

$('#eliminar').click(function(){
    console.log("eliminar");
})

$('#editar').click(function(){
    console.log("editar");
})