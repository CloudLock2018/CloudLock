console.log("Corriendo Administrador");

var misCookies = document.cookie;


//Gets the username saved in the cookie 
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

//Gets user's IMEI
var data = {
    usuario: document.getElementById("name").textContent
}
$.ajax({
    url: '/imei',
    type: "POST",
    dataType: "json",
    data: data,
    success: function(data){
        if(data.msg === 'No imei'){
            alert("No existe un IMEI vinculado a su cuenta. Por favor, apoye su celular sobre la placa NFC");
        }
        else if (data.msg === 'Hay imei'){
            alert("IMEI encontrado");
            //Shows IMEI
            $('.IMEI').text("IMEI: " + data.imei);
        }
    }
})

// Gets the value of num that was saved in the cookie
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

//Creates new subusers
function agre(){
	$('#agregar').click(function(){
        //When it is the first time you save a new subuser
		if (num === 0 && clickeado === 0){
			$("#0").show();
			agreg = true;
            clickeado += 1;
		}
		else {
			if (agreg === false){
                //Adds new textbox and buttons to the set or delete new subuser
                var agregarNombre = "<div id='" + num + "' class='contenedor2'><input class='member' type='text' placeholder='Usuario' id='" + num + "'><input class='error' type='button' value='✖' id='" + num + "'><input class='buttons' type='button' value='✔' id='" + num + "'></div>";
				$(agregarNombre).appendTo(".subusuarios");
				$('.contenedor2').show();
				agreg = true;
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

//Saves the new subuser
function nuevo(){
    $('.buttons').click(function(){
        if ($('.member').val().length > 0 && clickeado > 0)
        {
            var data = {
                usuario: document.getElementById("name").textContent,
                subusuario: $('.member').val()
            }
            $.ajax({
                url: '/subuser',
                type: "POST",
                dataType: "json",
                data: data,
                success: function(data){
                    if (data.msg === 'Error'){
                        alert("El subusuario ya existe");
                    }
                    else if (data.msg === 'Gracias'){
                        $('.contenedor2').remove();
                        alert("Subusuario agregado");
                    }
                }
            })
            agreg = false;
            num += 1;
            console.log(num);
            //Sets cookie for the last subuser was set. This avoids being an id used more than once
            //document.cookie = "ultagreg=" + num + "; expires=Fri, 31 Dec 9999 23:59:59 GMT;"
        }
        else
        {
            alert("Agregue un nombre");
            agreg = true;
        }
    });
}

//Deletes the subuser about to create
function borrar(){
	$('.error').click(function(){
		elegido = this.id;
    	$('#' + elegido).closest("div").remove();
        agreg = false;
 	});  
}

//Edits user's IMEI
function editar(){
    $('#editar').click(function(){
        console.log("editar");
    })
}