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
var num = 0;

$('#agregar').click(function(){
    if (num === 0) {
    document.getElementById("1").style.display = "block";
    console.log("agregar");
    num += 1;
} else if (num === 1) {
    document.getElementById("2").style.display = "block";
    console.log("agregar");
    num += 1;
} else if (num === 2) {
    document.getElementById("3").style.display = "block";
    console.log("agregar");
    num += 1;
}
    
})

$('#eliminar').click(function(){
    console.log("eliminar");
})

$('#editar').click(function(){
    console.log("editar");
})