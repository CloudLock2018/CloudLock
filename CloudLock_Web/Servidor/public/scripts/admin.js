console.log("Corriendo Administrador");

var misCookies = document.cookie;
var elegido;
var agreg = false;
var guardasub = 0;
var subusuario;

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
        	$('.INFO').show();
            $('.INFO').text("No existe un IMEI vinculado a su cuenta.");
            $('.INFO').css("color", "red");
            $('.INFO').css("font-weight", "Bold");
        }
        else if (data.msg === 'Hay imei'){
        	$('.INFO').show();
            $('.INFO').text("Se encontro el IMEI vinculado a su cuenta.");
            $('.INFO').css("color", "#49ff00");
            $('.INFO').css("font-weight", "Bold");
            //Shows IMEI
            $('.IMEI').text("IMEI: " + data.imei);
            console.log(data.contenido);
            if(data.existe === true){
                document.querySelector(".subusuarios").innerHTML += data.contenido;
                $('.contenedor3').show();
                guardasub = data.cantidad;
            }
        }
    }
})

agre();
nuevo();
borrar();
editar();
eliminar();
editarSub();

//Creates new subusers
function agre(){
	$('#agregar').click(function(){
        if (agreg === false){
            //Adds new textbox and buttons to the set or delete new subuser
            $('.contenedor2').show();
            agreg = true;
            $('#agregar').css("display", "none");
            nuevo();
            borrar();
        }
        else
        {
            $('.INFO').show();
            $('.INFO').text("Agregue un nombre");
            $('.INFO').css("color", "red");
            $('.INFO').css("font-weight", "Bold");
        }
	})
}

//Saves the new subuser
function nuevo(){
    $('.buttons').click(function(){
        if ($('.member').val().length > 0)
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
                    	$('.INFO').show();
                    	$('.INFO').text("El subusuario ya existe");
                    	$('.INFO').css("color", "red");
            			$('.INFO').css("font-weight", "Bold");
                    }
                    else if (data.msg === 'Gracias'){
    					$('.INFO').show();
    					$('.INFO').text("Subusuario agregado");
    					$('.INFO').css("color", "#49ff00");
            			$('.INFO').css("font-weight", "Bold");
                        /*setTimeout(function(){
                            document.location.reload(true);
                        }, 2000);*/
                        var reload = {
                        	usuario: document.getElementById("name").textContent
                        }
                        $.ajax({
                        	url: '/reload',
			                type: "POST",
			                dataType: "json",
			                data: reload,
			                success: function(data){
			                	if (data.msg === 'Error'){
			                		$('.INFO').show();
                    				$('.INFO').text("El usuario no existe");
                    				$('.INFO').css("color", "red");
            						$('.INFO').css("font-weight", "Bold");
			                	}
			                	else if(data.msg === 'Hecho'){
			                		$('.contenedor2').css("display", "none");
        							$('.member').text("");
        							$('#agregar').show();
        							$('.contenedor3').remove();
        							if(data.existe === true){
						                document.querySelector(".subusuarios").innerHTML += data.contenido;
						                $('.contenedor3').show();
						                guardasub = data.cantidad;
						            }
			                	}
			                }
                        })
                    }
                }
            })
            agreg = false;
        }
        else
        {
            $('.INFO').show();
            $('.INFO').text("Agregue un nombre");
            $('.INFO').css("color", "red");
            $('.INFO').css("font-weight", "Bold");
            agreg = true;
        }
    });
}

//Deletes the subuser about to create
function borrar(){
	$('.error').click(function(){
		$('.contenedor2').css("display", "none");
        $('.member').text("");
        $('#agregar').show();
        agreg = false;
 	});  
}

//Edits user's IMEI
function editar(){
    $('#editar').click(function(){
        console.log("editar");
    })
}

function eliminar(){
    $(document).on("click", ".eliminar", function(){
        elegido = $(this).attr('id');
        console.log(elegido);
        if (confirm('¿Está seguro que quiere borrar este subusuario?')) {
            subusuario = $('#' + elegido + '.sub').text();
            var data = {
                usuario: document.getElementById("name").textContent,
                sub: subusuario
            }
            $.ajax({
                url: '/delete',
                type: "POST",
                dataType: "json",
                data: data,
                success: function(data){
                    if (data.msg === 'Error'){
                        $('.INFO').show();
                        $('.INFO').text("El subusuario no existe");
                        $('.INFO').css("color", "red");
                        $('.INFO').css("font-weight", "Bold");
                    }
                    else if (data.msg === 'Borrado'){
                        $('.INFO').show();
                        $('.INFO').text("Subusuario eliminado");
                        $('.INFO').css("color", "#49ff00");
                        $('.INFO').css("font-weight", "Bold");
                        /*setTimeout(function(){
                            document.location.reload(true);
                        }, 2000);*/
                        var reload = {
                        	usuario: document.getElementById("name").textContent
                        }
                        $.ajax({
                        	url: '/reload',
			                type: "POST",
			                dataType: "json",
			                data: reload,
			                success: function(data){
			                	if (data.msg === 'Error'){
			                		$('.INFO').show();
                    				$('.INFO').text("El usuario no existe");
                    				$('.INFO').css("color", "red");
            						$('.INFO').css("font-weight", "Bold");
			                	}
			                	else if(data.msg === 'Hecho'){
			                		$('.contenedor2').css("display", "none");
        							$('.member').text("");
        							$('#agregar').show();
        							$('.contenedor3').remove();
        							if(data.existe === true){
						                document.querySelector(".subusuarios").innerHTML += data.contenido;
						                $('.contenedor3').show();
						                guardasub = data.cantidad;
						            }
			                	}
			                }
                        })
                    }
                }
            })
        } else {
        // Do nothing!
        }
    })
}

//Edits certain subuser's IMEI
function editarSub(){
    $(document).on("click", ".cambiar", function(){
        console.log("editar sub");
    })
}