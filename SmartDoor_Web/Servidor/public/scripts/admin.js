console.log("Corriendo Administrador");

var misCookies = document.cookie;

/*function leerCookie(nombre) {
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

/*function cookieNum(numero) {
    var lista = document.cookie.split(";");
     for (i in lista) {
         var busca = lista[i].search(numero);
         if (busca > -1) 
            {
                micookie = lista[i];
            }
        else
            {
                micookie = 0;
            }
     }
 var igual = micookie.indexOf("=");
 var valor = micookie.substring(igual+1);
return valor;
}
*/

agre();
nuevo();
borrar();
editar();

var num = /*cookieNum("ultagreg")*/ 0;
var elegido = 0;
var agreg = false;
var clickeado = 0;

function agre(){
	$('#agregar').click(function(){
		if (num === 0 && clickeado === 0){
			$("#0").show();
			agreg = true;
            clickeado += 1;
            num += 1;
		}
		else {
			if (agreg === false){
                var agregarNombre = "<div id='" + num + "' class='contenedor2'><input class='member' type='text' placeholder='Usuario' id='" + num + "'><input class='error' type='button' value='✖' id='" + num + "'><input class='buttons' type='button' value='✔' id='" + num + "'></div>";
				$(agregarNombre).appendTo(".subusuarios");
				$('.contenedor2').show();
				agreg = true;
                num += 1;
                console.log(num);
                document.cookie = "ultagreg=" + num + "; expires=Fri, 31 Dec 9999 23:59:59 GMT;"
				nuevo();
                borrar();
			}
			else
			{
				alert("Agregue un nombre");
			}
		}
	})
}

function nuevo(){
    $('.buttons').click(function(){
        if ($('.member').val().length > 0 && clickeado > 0)
        {
            agreg = false;
            console.log("si");
        }
        else
        {
            console.log("no");
            agreg = true;
        }
    });
}

function borrar(){
	$('.error').click(function(){
		elegido = this.id;
		console.log(elegido);
    	$('#' + elegido).closest("div").remove();
        agreg = false;
 	});  
}

function editar(){
    $('#editar').click(function(){
        console.log("editar");
    })
}