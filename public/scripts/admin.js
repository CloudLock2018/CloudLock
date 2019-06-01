console.log("Corriendo Administrador");

var misCookies = document.cookie;
var elegido;
var existente = true;
var agreg = false;
var guardasub = 0;
var guardarPuerta = 0;
var subusuario;
var on = 0;
var on2 = 0;

window.setInterval(orden, 100);
window.setInterval(orden2, 100);

//Gets the username saved in the cookie 
function leerCookie(nombre) {
    var lista = document.cookie.split(";");
    for (i in lista) {
        var busca = lista[i].search(nombre);
        if (busca > -1) {
            micookie = lista[i];
        } else {
            window.location.href = "../index.html";
        }
    }
    var igual = micookie.indexOf("=");
    var valor = micookie.substring(igual + 1);
    return valor;
}
//document.getElementById("name").innerHTML = leerCookie("username");


var dataUsuario = {
    usuario: leerCookie("username")
}

//Checks if there is any door associated to the account. If not, it will ask for a generic code
$.ajax({
    url: '/doors',
    type: "POST",
    dataType: "json",
    data: dataUsuario,
    success: function (data){
        if (data.msg === 'No existe'){
            $('.contenedorAdmin').css('display', 'block');
            $('.INFO').show();
            $('.INFO').text("No existe una puerta vinculada a su cuenta, por favor ingrese el código genérico que se encuentra en la caja");
            $('.INFO').css("color", "red");
            $('.INFO').css("font-weight", "Bold");
            //Mostrar Pantalla de agregar puerta
        }
        else if (data.msg === 'Existe'){
            $('.contenedorAdmin').css('display', 'block');
            $('.INFO').show();
            $('.INFO').text("Se encontró la/s puerta/s vinculada/s a su cuenta");
            $('.INFO').css("color", "#49ff00");
            $('.INFO').css("font-weight", "Bold");
            setTimeout(function () {
                $('.INFO').text("");
            }, 10000);
            document.querySelector("#limit").innerHTML += data.contenido;
            guardarPuerta = data.cantidadPuerta;
            if (existeSubusuario === true){
                $('.contenedor3').show();
                guardasub = data.cantidadSubusuario;
            }
        }
    }
})

//---------------------------------------Nov/2018------------------------------------------------------------------------------//
//Gets user's IMEI
/*var data = {
    usuario: document.getElementById("name").textContent
}
$.ajax({
    url: '/imei',
    type: "POST",
    dataType: "json",
    data: data,
    success: function (data) {
        if (data.msg === 'No imei') {
            $('.contenedorAdmin').css('display', 'block');
            $('.INFO').show();
            $('.INFO').text("No existe un IMEI vinculado a su cuenta, apoye su celular sobre la placa NFC y luego espere");
            $('.INFO').css("color", "red");
            $('.INFO').css("font-weight", "Bold");
            existente = false;
            $('#descargar').prop('disabled', true);
            $('#descargar').css("background", "#cccccc");
            $('#agregar').prop('disabled', true);
            $('#agregar').css("background", "#cccccc");
            $('#default').prop('disabled', true);
            $('#default').css("background", "#cccccc");
            $('#editar').prop('disabled', true);
            $('#editar').css("background", "#cccccc");
            var info = {
                usuario: document.getElementById("name").textContent
            }
            $.ajax({
                url: '/IMEIAdmin',
                type: "POST",
                dataType: "json",
                data: info,
                timeout: 120000,
                success: function (data) {
                    if (data.msg === 'IMEI Actualizada') {
                        $('.INFO').show();
                        $('.INFO').text("Se ha actualizado su cuenta");
                        $('.INFO').css("color", "#49ff00");
                        $('.INFO').css("font-weight", "Bold");
                        setTimeout(function () {
                            document.location.reload(true);
                        }, 2000);
                    } else if (data.msg === 'Error') {
                        $('.INFO').show();
                        $('.INFO').text("Ha ocurrido un error con el protocolo");
                        $('.INFO').css("color", "red");
                        $('.INFO').css("font-weight", "Bold");
                        setTimeout(function () {
                            document.location.reload(true);
                        }, 2000);
                    }
                },
                error: function (err) {
                    $('.INFO').show();
                    $('.INFO').text("Tiempo de espera agotado");
                    $('.INFO').css("color", "red");
                    $('.INFO').css("font-weight", "Bold");
                    $.ajax({
                        url: '/timeout',
                        type: "POST",
                        success: function (data) {
                            if (data.msg === "Listo") {
                                setTimeout(function () {
                                    $('.INFO').text("");
                                }, 10000);
                            }
                        }
                    })
                }
            })
        } else if (data.msg === 'Hay imei') {
            $('.contenedorAdmin').css('display', 'block');
            $('.INFO').show();
            $('.INFO').text("Se encontro el IMEI vinculado a su cuenta");
            $('.INFO').css("color", "#49ff00");
            $('.INFO').css("font-weight", "Bold");
            setTimeout(function () {
                $('.INFO').text("");
            }, 10000);
            //Shows IMEI
            $('.IMEI').text("IMEI: " + data.imei);
            if (data.existe === true) {
                document.querySelector(".subusuarios").innerHTML += data.contenido;
                $('.contenedor3').show();
                guardasub = data.cantidad;
            }
        }
    }
})

agre();
borrar();
eliminarAdmin();
eliminar();
editar();
editarSub();

//Creates new subusers
function agre() {
    $('#agregar').click(function () {
        if (existente === true){
            if (agreg === false) {
                //Adds new textbox and buttons to the set or delete new subuser
                setTimeout(function () {
                    $('.contenedor2').show();
                    rotacion2();
                }, 1000);
                setTimeout(function () {
                }, 500);
                rotacion2R();
                agreg = true;
                $('#descargar').prop('disabled', true);
                $('#descargar').css("background", "#cccccc");
                $('#agregar').prop('disabled', true);
                $('#agregar').css("background", "#cccccc");
                $('#default').prop('disabled', true);
                $('#default').css("background", "#cccccc");
                $('#editar').prop('disabled', true);
                $('#editar').css("background", "#cccccc");
                nuevo();
                borrar();
            } else {
                $('.INFO').show();
                $('.INFO').text("Agregue un nombre");
                $('.INFO').css("color", "red");
                $('.INFO').css("font-weight", "Bold");
            }
        }
        else {
            $('.INFO').show();
            $('.INFO').text("No se puede agregar un subusuario si no tiene un IMEI asignado");
            $('.INFO').css("color", "red");
            $('.INFO').css("font-weight", "Bold");
        }
    })
}

//Saves the new subuser
function nuevo() {
    $('.buttons').click(function () {
        if ($('.member').val().length > 0) {
            if ($('.member').val().length <= 25) {
                $('.buttons').prop('disabled', true);
                $('.buttons').css("background", "#cccccc");
                $('.error').prop('disabled', true);
                $('.error').css("background", "#cccccc");
                var data = {
                    usuario: document.getElementById("name").textContent,
                    subusuario: $('.member').val()
                }
                $.ajax({
                    url: '/subuser',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        if (data.msg === 'Error') {
                            setTimeout(function () {
                                $('.buttons').prop('disabled', false);
                                $('.buttons').css("background", "#FF851B");
                                $('.error').prop('disabled', false);
                                $('.error').css("background", "#FF851B");
                            }, 500);
                            $('.INFO').show();
                            $('.INFO').text("El subusuario ya existe");
                            $('.INFO').css("color", "red");
                            $('.INFO').css("font-weight", "Bold");
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                        } else if (data.msg === 'Gracias') {
                            rotacion2R();
                            reactive();
                            $('.INFO').show();
                            $('.INFO').text("Subusuario agregado");
                            $('.INFO').css("color", "#49ff00");
                            $('.INFO').css("font-weight", "Bold")
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                            var reload = {
                                usuario: document.getElementById("name").textContent
                            }
                            $.ajax({
                                url: '/reload',
                                type: "POST",
                                dataType: "json",
                                data: reload,
                                success: function (data) {
                                    if (data.msg === 'Error') {
                                        $('.INFO').show();
                                        $('.INFO').text("El usuario no existe");
                                        $('.INFO').css("color", "red");
                                        $('.INFO').css("font-weight", "Bold");
                                    } else if (data.msg === 'Hecho') {
                                        active = true;
                                        $('.contenedor2').css("display", "none");
                                        $('.member').text("");
                                        $('#agregar').show();
                                        $('.contenedor3').remove();
                                        if (data.existe === true) {
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
            else {
                $('.INFO').show();
                $('.INFO').text("Nombre demasiado largo (Máximo: 25 caracteres)");
                $('.INFO').css("color", "red");
                $('.INFO').css("font-weight", "Bold");
                setTimeout(function () {
                    $('.INFO').text("");
                }, 10000);
                agreg = true;
            }
        } else {
            $('.INFO').show();
            $('.INFO').text("Agregue un nombre");
            $('.INFO').css("color", "red");
            $('.INFO').css("font-weight", "Bold");
            setTimeout(function () {
                $('.INFO').text("");
            }, 10000);
            agreg = true;
        }
    });
}

//Deletes the subuser about to create
function borrar() {
    $('.error').click(function () {
        $('.member').text("");
        $('#agregar').show();
        agreg = false;
        setTimeout(function () {
            $('#descargar').prop('disabled', false);
            $('#descargar').css("background", "#FF851B");
            $('#agregar').prop('disabled', false);
            $('#agregar').css("background", "#FF851B");
            $('#editar').prop('disabled', false);
            $('#editar').css("background", "#FF851B");
            $('#default').prop('disabled', false);
            $('#default').css("background", "#FF851B");
        }, 2500);
        rotacion3R();
    });
}

//Declares user's IMEI non-existent
function eliminarAdmin() {
    $('#default').click(function () {
        if (existente === true){
            aviso2();
            on2 = 2;
        }
        else {
            $('.INFO').show();
            $('.INFO').text("No se puede desactivar su IMEI si no tiene uno asignado");
            $('.INFO').css("color", "red");
            $('.INFO').css("font-weight", "Bold");
        }
    });
}

//Deletes subuser selected from the database
function eliminar() {
    $(document).on("click", ".eliminar", function () {
        aviso();
        on = 2;
        setTimeout(function () {
            $('#descargar').prop('disabled', false);
            $('#descargar').css("background", "#FF851B");
            $('#agregar').prop('disabled', false);
            $('#agregar').css("background", "#FF851B");
            $('#editar').prop('disabled', false);
            $('#editar').css("background", "#FF851B");
            $('#default').prop('disabled', false);
            $('#default').css("background", "#FF851B");
            agreg = false;
        }, 1500);
        elegido = $(this).attr('id');
    });
}

//Edits user's IMEI
function editar() {
    $('#editar').click(function () {
        if (existente === true) {
            $('#descargar').prop('disabled', true);
            $('#descargar').css("background", "#cccccc");
            $('#agregar').prop('disabled', true);
            $('#agregar').css("background", "#cccccc");
            $('#editar').prop('disabled', true);
            $('#editar').css("background", "#cccccc");
            $('#default').prop('disabled', true);
            $('#default').css("background", "#cccccc");
            $('.eliminar').prop('disabled', true);
            $('.eliminar').css("background", "#cccccc");
            $('.cambiar').prop('disabled', true);
            $('.cambiar').css("background", "#cccccc");
            var data = {
                usuario: document.getElementById("name").textContent
            }
            $.ajax({
                url: '/editAdmin',
                type: "POST",
                dataType: "json",
                data: data,
                success: function (data) {
                    if (data.msg === 'Error') {
                        $('#descargar').prop('disabled', false);
                        $('#descargar').css("background", "#FF851B");
                        $('#agregar').prop('disabled', false);
                        $('#agregar').css("background", "#FF851B");
                        $('#editar').prop('disabled', false);
                        $('#editar').css("background", "#FF851B");
                        $('#default').prop('disabled', false);
                        $('#default').css("background", "#FF851B");
                        $('.eliminar').prop('disabled', false);
                        $('.eliminar').css("background", "#FF851B");
                        $('.cambiar').prop('disabled', false);
                        $('.cambiar').css("background", "#FF851B");
                        $('.INFO').show();
                        $('.INFO').text("No existe el usuario");
                        $('.INFO').css("color", "red");
                        $('.INFO').css("font-weight", "Bold");
                        setTimeout(function () {
                            $('.INFO').text("");
                        }, 10000);
                    } else if (data.msg === 'Editar') {
                        $('.INFO').show();
                        $('.INFO').text("Apoye su celular sobre la placa NFC y luego espere");
                        $('.INFO').css("color", "#49ff00");
                        $('.INFO').css("font-weight", "Bold");
                        var info = {
                            usuario: document.getElementById("name").textContent
                        }
                        $.ajax({
                            url: '/imeiAdmin',
                            type: "POST",
                            dataType: "json",
                            data: info,
                            timeout: 120000,
                            success: function (data) {
                                if (data.msg === 'IMEI Actualizada') {
                                    $('#descargar').prop('disabled', false);
                                    $('#descargar').css("background", "#FF851B");
                                    $('#agregar').prop('disabled', false);
                                    $('#agregar').css("background", "#FF851B");
                                    $('#editar').prop('disabled', false);
                                    $('#editar').css("background", "#FF851B");
                                    $('#default').prop('disabled', false);
                                    $('#default').css("background", "#FF851B");
                                    $('.eliminar').prop('disabled', false);
                                    $('.eliminar').css("background", "#FF851B");
                                    $('.cambiar').prop('disabled', false);
                                    $('.cambiar').css("background", "#FF851B");
                                    $('.INFO').show();
                                    $('.INFO').text("Se ha actualizado su cuenta");
                                    $('.INFO').css("color", "#49ff00");
                                    $('.INFO').css("font-weight", "Bold");
                                    setTimeout(function () {
                                        document.location.reload(true);
                                    }, 2000);
                                } else if (data.msg === 'Error') {
                                    $('#descargar').prop('disabled', false);
                                    $('#descargar').css("background", "#FF851B");
                                    $('#agregar').prop('disabled', false);
                                    $('#agregar').css("background", "#FF851B");
                                    $('#editar').prop('disabled', false);
                                    $('#editar').css("background", "#FF851B");
                                    $('#default').prop('disabled', false);
                                    $('#default').css("background", "#FF851B");
                                    $('.eliminar').prop('disabled', false);
                                    $('.eliminar').css("background", "#FF851B");
                                    $('.cambiar').prop('disabled', false);
                                    $('.cambiar').css("background", "#FF851B");
                                    $('.INFO').show();
                                    $('.INFO').text("Ha ocurrido un error con el protocolo");
                                    $('.INFO').css("color", "red");
                                    $('.INFO').css("font-weight", "Bold");
                                    setTimeout(function () {
                                        document.location.reload(true);
                                    }, 2000);
                                }
                            },
                            error: function (err) {
                                $('#descargar').prop('disabled', false);
                                $('#descargar').css("background", "#FF851B");
                                $('#agregar').prop('disabled', false);
                                $('#agregar').css("background", "#FF851B");
                                $('#editar').prop('disabled', false);
                                $('#editar').css("background", "#FF851B");
                                $('#default').prop('disabled', false);
                                $('#default').css("background", "#FF851B");
                                $('.eliminar').prop('disabled', false);
                                $('.eliminar').css("background", "#FF851B");
                                $('.cambiar').prop('disabled', false);
                                $('.cambiar').css("background", "#FF851B");
                                $('.INFO').show();
                                $('.INFO').text("Tiempo de espera agotado");
                                $('.INFO').css("color", "red");
                                $('.INFO').css("font-weight", "Bold");
                                $.ajax({
                                    url: '/timeout',
                                    type: "POST",
                                    success: function (data) {
                                        if (data.msg === "Listo") {
                                            setTimeout(function () {
                                                $('.INFO').text("");
                                            }, 10000);
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
        else {
            $('.INFO').show();
            $('.INFO').text("No se puede editar su IMEI si no tiene uno asignado");
            $('.INFO').css("color", "red");
            $('.INFO').css("font-weight", "Bold");
        }
    })
}

//Edits certain subuser's IMEI
function editarSub() {
    $(document).on("click", ".cambiar", function () {
        elegido = $(this).attr('id');
        subusuario = $('#' + elegido + '.sub').text();
        var data = {
            usuario: document.getElementById("name").textContent,
            sub: subusuario
        }
        $.ajax({
            url: '/editSub',
            type: "POST",
            dataType: "json",
            data: data,
            success: function (data) {
                if (data.msg === 'Error') {
                    $('.INFO').show();
                    $('.INFO').text("No existe el subusuario");
                    $('.INFO').css("color", "red");
                    $('.INFO').css("font-weight", "Bold");
                    setTimeout(function () {
                        $('.INFO').text("");
                    }, 10000);
                } else if (data.msg === 'Editar') {
                    $('.INFO').show();
                    $('.INFO').text("Apoye su celular sobre la placa NFC y luego espere");
                    $('.INFO').css("color", "#49ff00");
                    $('.INFO').css("font-weight", "Bold");
                    var info = {
                        usuario: document.getElementById("name").textContent,
                        sub: subusuario
                    };
                    $.ajax({
                        url: '/imeiSub',
                        type: "POST",
                        dataType: "json",
                        data: info,
                        timeout: 120000,
                        success: function (data) {
                            if (data.msg === 'IMEI Actualizada') {
                                $('.INFO').show();
                                $('.INFO').text("Se ha actualizado el subusuario");
                                $('.INFO').css("color", "#49ff00");
                                $('.INFO').css("font-weight", "Bold");
                                setTimeout(function () {
                                    document.location.reload(true);
                                }, 2000);
                            } else if (data.msg === 'Error') {
                                $('.INFO').show();
                                $('.INFO').text("Ha ocurrido un error con el protocolo");
                                $('.INFO').css("color", "red");
                                $('.INFO').css("font-weight", "Bold");
                                setTimeout(function () {
                                    document.location.reload(true);
                                }, 2000);
                            }
                        },
                        error: function (err) {
                            $('.INFO').show();
                            $('.INFO').text("Tiempo de espera agotado");
                            $('.INFO').css("color", "red");
                            $('.INFO').css("font-weight", "Bold");
                            $.ajax({
                                url: '/timeout',
                                type: "POST",
                                success: function (data) {
                                    if (data.msg === "Listo") {
                                        setTimeout(function () {
                                            $('.INFO').text("");
                                        }, 10000);
                                    }
                                }
                            })
                        }
                    })
                }
            }
        })
    })
}*/

//---------------------------------------Nov/2018------------------------------------------------------------------------------//

function reactive() {
    setTimeout(function () {
        $('#descargar').prop('disabled', false);
        $('#descargar').css("background", "#FF851B");
        $('#agregar').prop('disabled', false);
        $('#agregar').css("background", "#FF851B");
        $('#editar').prop('disabled', false);
        $('#editar').css("background", "#FF851B");
        $('#default').prop('disabled', false);
        $('#default').css("background", "#FF851B");
    }, 1500);
    $('.buttons').prop('disabled', false);
    $('.buttons').css("background", "#FF851B");
    $('.error').prop('disabled', false);
    $('.error').css("background", "#FF851B");
}

function rotacion2() {
    $(".contenedor2").css("transform", "perspective(130px) rotateX(0deg)");
    $(".contenedor3").each(function () {
        $(this).css("transform", "perspective(130px) rotateX(0deg)");
    })
}

function rotacion2R() {
    $(".contenedor2").css("transform", "perspective(130px) rotateX(-90deg)");
    $(".contenedor3").each(function () {
        $(this).css("transform", "perspective(130px) rotateX(-90deg)");
    })
}

function rotacion3R() {
    setTimeout(function () {
        $(".contenedor3").each(function () {
            $(this).css("transform", "perspective(130px) rotateX(0deg)");
        })
    }, 1000);
    $(".contenedor2").css("transform", "perspective(130px) rotateX(-90deg)");
    $(".contenedor3").each(function () {
        $(this).css("transform", "perspective(130px) rotateX(-90deg)");
    })
    $('.member').val("");
    sacar();
}

function rotacion4R() {
    $(".contenedor2").css("transform", "perspective(130px) rotateX(-90deg)");
    $(".contenedor3").each(function () {
        $(this).css("transform", "perspective(130px) rotateX(-90deg)");
    })
}

function rotacion5() {
    $(".contenedorAdmin").css("transform", "perspective(130px) rotateX(0deg)");
    $(".contenedor2").css("transform", "perspective(130px) rotateX(0deg)");
    $(".contenedor3").each(function () {
        $(this).css("transform", "perspective(130px) rotateX(0deg)");
    })
}

function rotacion5R() {
    $(".contenedorAdmin").css("transform", "perspective(130px) rotateX(-90deg)");
    $(".contenedor2").css("transform", "perspective(130px) rotateX(-90deg)");
    $(".contenedor3").each(function () {
        $(this).css("transform", "perspective(130px) rotateX(-90deg)");
    })
    setTimeout(function () {
        rotacion5();
    }, 1500);
}

function sacar() {
    setTimeout(function () {
        $('.contenedor2').css("display", "none");
    }, 500);
}

function orden() {
    $('span').each(function () {
        if ($(this).text() == 'IMEI: null') {
            $(this).css('margin-right', '384px');
        }
    });
}

function orden2() {
    $('span').each(function () {
        if ($(this).text() == 'IMEI: Desactivado') {
            $(this).css('margin-right', '459px');
        }
    });
}

window.onload = function () {
    aviso3();
    setTimeout(function () {
        $('#descargar').prop('disabled', false);
        $('#agregar').prop('disabled', false);
        $('#editar').prop('disabled', false);
        $('#default').prop('disabled', false);
    }, 500);
}

function aviso() {
    janelaPopUp.abre("asdf", 'p blue', '¡Atención!', '¿Está seguro que quiere borrar este subusuario?');
}

function aviso2() {
    janelaPopUp.abre("asdf", 'p blue', '¡Atención!', '¿Está seguro que quiere borrar su IMEI?');
}

function aviso3() {
    janelaPopUp2.abre("asdf", 'p blue', '¡Atención!', 'Ingrese su código de activación');
}

var janelaPopUp = new Object();
var janelaPopUp2 = new Object();

janelaPopUp.abre = function (id, classes, titulo, corpo, functionCancelar, functionEnviar, textoCancelar, textoEnviar) {
    var cancelar = (textoCancelar !== undefined) ? textoCancelar : 'Cancelar';
    var enviar = (textoEnviar !== undefined) ? textoEnviar : 'Aceptar';
    classes += ' ';
    var classArray = classes.split(' ');
    classes = '';
    classesFundo = '';
    var classBot = '';
    $.each(classArray, function (index, value) {
        switch (value) {
            case 'blue': classesFundo += this + ' ';
            default: classes += this + ' '; break;
        }
    });
    var popFundo = '<div id="popFundo_' + id + '" class="popUpFundo ' + classesFundo + '"></div>'
    var janela = '<div id="' + id + '" class="popUp ' + classes + '"><h1>' + titulo + "</h1><div><span>" + corpo + "</span></div><button class='puCancelar " + classBot + "' id='" + id + "_cancelar' data-parent=" + id + ">" + cancelar + "</button><button class='puEnviar" + classBot + "' data-parent=" + id + " id='" + id + "_enviar'>" + enviar + "</button></div>";
    $("window, body").css('overflow', 'hidden');

    $("body").append(popFundo);
    $("body").append(janela);
    $("body").append(popFundo);
    //alert(janela);
    $("#popFundo_" + id).fadeIn("fast");
    $("#" + id).addClass("popUpEntrada");

    $("#" + id + '_cancelar').on("click", function () {
        on = 0;
        on2 = 0;
        if ((functionCancelar !== undefined) && (functionCancelar !== '')) {
            janelaPopUp.fecha(id);
        } else {
            janelaPopUp.fecha(id);
        }
    });

    $("#" + id + '_enviar').on("click", function () {
        on2 = 2;
        if ((functionEnviar !== undefined) && (functionEnviar !== '')) {
            if (on === 2) {
                rotacion4R();
                $('#descargar').prop('disabled', true);
                $('#descargar').css("background", "#cccccc");
                $('#agregar').prop('disabled', true);
                $('#agregar').css("background", "#cccccc");
                $('#editar').prop('disabled', true);
                $('#editar').css("background", "#cccccc");
                $('#default').prop('disabled', true);
                $('#default').css("background", "#cccccc");
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
                    success: function (data) {
                        if (data.msg === 'Error') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("El subusuario no existe");
                            $('.INFO').css("color", "red");
                            $('.INFO').css("font-weight", "Bold");
                            $('#descargar').prop('disabled', false);
                            $('#descargar').css("background", "#FF851B");
                            $('#agregar').prop('disabled', false);
                            $('#agregar').css("background", "#FF851B");
                            $('#editar').prop('disabled', false);
                            $('#editar').css("background", "#FF851B");
                            $('#default').prop('disabled', false);
                            $('#default').css("background", "#FF851B");
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                        } else if (data.msg === 'Borrado') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("Subusuario eliminado");
                            $('.INFO').css("color", "red");
                            $('.INFO').css("font-weight", "Bold");
                            $('.member').val("");
                            $('#descargar').prop('disabled', false);
                            $('#descargar').css("background", "#FF851B");
                            $('#agregar').prop('disabled', false);
                            $('#agregar').css("background", "#FF851B");
                            $('#editar').prop('disabled', false);
                            $('#editar').css("background", "#FF851B");
                            $('#default').prop('disabled', false);
                            $('#default').css("background", "#FF851B");
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                            var reload = {
                                usuario: document.getElementById("name").textContent
                            }
                            $.ajax({
                                url: '/reload',
                                type: "POST",
                                dataType: "json",
                                data: reload,
                                success: function (data) {
                                    if (data.msg === 'Error') {
                                        $('.INFO').show();
                                        $('.INFO').text("El usuario no existe");
                                        $('.INFO').css("color", "red");
                                        $('.INFO').css("font-weight", "Bold");
                                        $('#descargar').prop('disabled', false);
                                        $('#descargar').css("background", "#FF851B");
                                        $('#agregar').prop('disabled', false);
                                        $('#agregar').css("background", "#FF851B");
                                        $('#editar').prop('disabled', false);
                                        $('#editar').css("background", "#FF851B");
                                        $('#default').prop('disabled', false);
                                        $('#default').css("background", "#FF851B");
                                        setTimeout(function () {
                                            $('.INFO').text("");
                                        }, 10000);
                                    } else if (data.msg === 'Hecho') {
                                        $('.contenedor2').css("display", "none");
                                        $('.member').text("");
                                        $('#agregar').show();
                                        $('.contenedor3').remove();
                                        $('#descargar').prop('disabled', false);
                                        $('#descargar').css("background", "#FF851B");
                                        $('#agregar').prop('disabled', false);
                                        $('#agregar').css("background", "#FF851B");
                                        $('#editar').prop('disabled', false);
                                        $('#editar').css("background", "#FF851B");
                                        $('#default').prop('disabled', false);
                                        $('#default').css("background", "#FF851B");
                                        if (data.existe === true) {
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
            } else if (on2 === 2) {
                rotacion5R();
                $('#descargar').prop('disabled', true);
                $('#descargar').css("background", "#cccccc");
                $('#agregar').prop('disabled', true);
                $('#agregar').css("background", "#cccccc");
                $('#editar').prop('disabled', true);
                $('#editar').css("background", "#cccccc");
                $('#default').prop('disabled', true);
                $('#default').css("background", "#cccccc");
                var data = {
                    usuario: document.getElementById("name").textContent
                };
                $.ajax({
                    url: '/deleteAdmin',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        if (data.msg === 'Borrado') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("Se ha borrado su IMEI");
                            $('.INFO').css("color", "#49ff00");
                            $('.INFO').css("font-weight", "Bold");
                            $('.contenedorAdmin .IMEI').text("IMEI: Desactivado");
                            $('#descargar').prop('disabled', false);
                            $('#descargar').css("background", "#FF851B");
                            $('#agregar').prop('disabled', false);
                            $('#agregar').css("background", "#FF851B");
                            $('#editar').prop('disabled', false);
                            $('#editar').css("background", "#FF851B");
                            $('#default').prop('disabled', false);
                            $('#default').css("background", "#FF851B");
                        } else if (data.msg === 'Ya borrado') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("El IMEI ya fue borrado anteriormente");
                            $('.INFO').css("color", "red");
                            $('.INFO').css("font-weight", "Bold");
                            setTimeout(function () {
                                $('#descargar').prop('disabled', false);
                                $('#descargar').css("background", "#FF851B");
                                $('#agregar').prop('disabled', false);
                                $('#agregar').css("background", "#FF851B");
                                $('#editar').prop('disabled', false);
                                $('#editar').css("background", "#FF851B");
                                $('#default').prop('disabled', false);
                                $('#default').css("background", "#FF851B");
                            }, 2000);
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                        } else if (data.msg === 'Error') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("El usuario no existe");
                            $('.INFO').css("color", "red");
                            $('.INFO').css("font-weight", "Bold");
                            $('#descargar').prop('disabled', false);
                            $('#descargar').css("background", "#FF851B");
                            $('#agregar').prop('disabled', false);
                            $('#agregar').css("background", "#FF851B");
                            $('#editar').prop('disabled', false);
                            $('#editar').css("background", "#FF851B");
                            $('#default').prop('disabled', false);
                            $('#default').css("background", "#FF851B");
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                        }
                    }
                })
            } else {
                on = 0;
                on2 = 0;
            }
            janelaPopUp.fecha(id);
        } else {
            if (on === 2) {
                rotacion4R();
                $('#descargar').prop('disabled', true);
                $('#descargar').css("background", "#cccccc");
                $('#agregar').prop('disabled', true);
                $('#agregar').css("background", "#cccccc");
                $('#editar').prop('disabled', true);
                $('#editar').css("background", "#cccccc");
                $('#default').prop('disabled', true);
                $('#default').css("background", "#cccccc");
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
                    success: function (data) {
                        if (data.msg === 'Error') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("El subusuario no existe");
                            $('.INFO').css("color", "red");
                            $('.INFO').css("font-weight", "Bold");
                            $('#descargar').prop('disabled', false);
                            $('#descargar').css("background", "#FF851B");
                            $('#agregar').prop('disabled', false);
                            $('#agregar').css("background", "#FF851B");
                            $('#editar').prop('disabled', false);
                            $('#editar').css("background", "#FF851B");
                            $('#default').prop('disabled', false);
                            $('#default').css("background", "#FF851B");
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                        } else if (data.msg === 'Borrado') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("Subusuario eliminado");
                            $('.INFO').css("color", "red");
                            $('.INFO').css("font-weight", "Bold");
                            $('.member').val("");
                            $('#descargar').prop('disabled', false);
                            $('#descargar').css("background", "#FF851B");
                            $('#agregar').prop('disabled', false);
                            $('#agregar').css("background", "#FF851B");
                            $('#editar').prop('disabled', false);
                            $('#editar').css("background", "#FF851B");
                            $('#default').prop('disabled', false);
                            $('#default').css("background", "#FF851B");
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                            var reload = {
                                usuario: document.getElementById("name").textContent
                            }
                            $.ajax({
                                url: '/reload',
                                type: "POST",
                                dataType: "json",
                                data: reload,
                                success: function (data) {
                                    if (data.msg === 'Error') {
                                        $('.INFO').show();
                                        $('.INFO').text("El usuario no existe");
                                        $('.INFO').css("color", "red");
                                        $('.INFO').css("font-weight", "Bold");
                                        $('#descargar').prop('disabled', false);
                                        $('#descargar').css("background", "#FF851B");
                                        $('#agregar').prop('disabled', false);
                                        $('#agregar').css("background", "#FF851B");
                                        $('#editar').prop('disabled', false);
                                        $('#editar').css("background", "#FF851B");
                                        $('#default').prop('disabled', false);
                                        $('#default').css("background", "#FF851B");
                                        setTimeout(function () {
                                            $('.INFO').text("");
                                        }, 10000);
                                    } else if (data.msg === 'Hecho') {
                                        $('.contenedor2').css("display", "none");
                                        $('.member').text("");
                                        $('#agregar').show();
                                        $('.contenedor3').remove();
                                        $('#descargar').prop('disabled', false);
                                        $('#descargar').css("background", "#FF851B");
                                        $('#agregar').prop('disabled', false);
                                        $('#agregar').css("background", "#FF851B");
                                        $('#editar').prop('disabled', false);
                                        $('#editar').css("background", "#FF851B");
                                        $('#default').prop('disabled', false);
                                        $('#default').css("background", "#FF851B");
                                        if (data.existe === true) {
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
            } else if (on2 === 2) {
                rotacion5R();
                $('#descargar').prop('disabled', true);
                $('#descargar').css("background", "#cccccc");
                $('#agregar').prop('disabled', true);
                $('#agregar').css("background", "#cccccc");
                $('#editar').prop('disabled', true);
                $('#editar').css("background", "#cccccc");
                $('#default').prop('disabled', true);
                $('#default').css("background", "#cccccc");
                var data = {
                    usuario: document.getElementById("name").textContent
                };
                $.ajax({
                    url: '/deleteAdmin',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        if (data.msg === 'Borrado') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("Se ha borrado su IMEI");
                            $('.INFO').css("color", "#49ff00");
                            $('.INFO').css("font-weight", "Bold");
                            $('.contenedorAdmin .IMEI').text("IMEI: Desactivado");
                            $('#descargar').prop('disabled', false);
                            $('#descargar').css("background", "#FF851B");
                            $('#agregar').prop('disabled', false);
                            $('#agregar').css("background", "#FF851B");
                            $('#editar').prop('disabled', false);
                            $('#editar').css("background", "#FF851B");
                            $('#default').prop('disabled', false);
                            $('#default').css("background", "#FF851B");
                        } else if (data.msg === 'Ya borrado') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("El IMEI ya fue borrado anteriormente");
                            $('.INFO').css("color", "red");
                            $('.INFO').css("font-weight", "Bold");
                            setTimeout(function () {
                                $('#descargar').prop('disabled', false);
                                $('#descargar').css("background", "#FF851B");
                                $('#agregar').prop('disabled', false);
                                $('#agregar').css("background", "#FF851B");
                                $('#editar').prop('disabled', false);
                                $('#editar').css("background", "#FF851B");
                                $('#default').prop('disabled', false);
                                $('#default').css("background", "#FF851B");
                            }, 2000);
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                        } else if (data.msg === 'Error') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("El usuario no existe");
                            $('.INFO').css("color", "red");
                            $('.INFO').css("font-weight", "Bold");
                            $('#descargar').prop('disabled', false);
                            $('#descargar').css("background", "#FF851B");
                            $('#agregar').prop('disabled', false);
                            $('#agregar').css("background", "#FF851B");
                            $('#editar').prop('disabled', false);
                            $('#editar').css("background", "#FF851B");
                            $('#default').prop('disabled', false);
                            $('#default').css("background", "#FF851B");
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                        }
                    }
                })
            } else {
                on = 0;
                on2 = 0;
            }
        }
        janelaPopUp.fecha(id);
    });
}

janelaPopUp2.abre = function (id, classes, titulo, corpo, functionEnviar, textoEnviar) {
    var enviar = (textoEnviar !== undefined) ? textoEnviar : 'Aceptar';
    classes += ' ';
    var classArray = classes.split(' ');
    classes = '';
    classesFundo = '';
    var classBot = '';
    $.each(classArray, function (index, value) {
        switch (value) {
            case 'blue': classesFundo += this + ' ';
            default: classes += this + ' '; break;
        }
    });
    var popFundo = '<div id="popFundo_' + id + '" class="popUp2Fundo ' + classesFundo + '"></div>'
    var janela = '<div id="' + id + '" class="popUp2 ' + classes + '"><h1>' + titulo + "</h1><div><span>" + corpo + "</span><input type='text' title='Completa este campo' placeholder='Código' required></div><button class='puEnviar" + classBot + "' data-parent=" + id + " id='" + id + "_enviar'>" + enviar + "</button></div>";
    $("window, body").css('overflow', 'hidden');

    $("body").append(popFundo);
    $("body").append(janela);
    $("body").append(popFundo);
    //alert(janela);
    $("#popFundo_" + id).fadeIn("fast");
    $("#" + id).addClass("popUp2Entrada");

    $("#" + id + '_enviar').on("click", function () {
        on2 = 2;
        if ((functionEnviar !== undefined) && (functionEnviar !== '')) {
            if (on === 2) {
                rotacion4R();
                $('#descargar').prop('disabled', true);
                $('#descargar').css("background", "#cccccc");
                $('#agregar').prop('disabled', true);
                $('#agregar').css("background", "#cccccc");
                $('#editar').prop('disabled', true);
                $('#editar').css("background", "#cccccc");
                $('#default').prop('disabled', true);
                $('#default').css("background", "#cccccc");
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
                    success: function (data) {
                        if (data.msg === 'Error') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("El subusuario no existe");
                            $('.INFO').css("color", "red");
                            $('.INFO').css("font-weight", "Bold");
                            $('#descargar').prop('disabled', false);
                            $('#descargar').css("background", "#FF851B");
                            $('#agregar').prop('disabled', false);
                            $('#agregar').css("background", "#FF851B");
                            $('#editar').prop('disabled', false);
                            $('#editar').css("background", "#FF851B");
                            $('#default').prop('disabled', false);
                            $('#default').css("background", "#FF851B");
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                        } else if (data.msg === 'Borrado') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("Subusuario eliminado");
                            $('.INFO').css("color", "red");
                            $('.INFO').css("font-weight", "Bold");
                            $('.member').val("");
                            $('#descargar').prop('disabled', false);
                            $('#descargar').css("background", "#FF851B");
                            $('#agregar').prop('disabled', false);
                            $('#agregar').css("background", "#FF851B");
                            $('#editar').prop('disabled', false);
                            $('#editar').css("background", "#FF851B");
                            $('#default').prop('disabled', false);
                            $('#default').css("background", "#FF851B");
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                            var reload = {
                                usuario: document.getElementById("name").textContent
                            }
                            $.ajax({
                                url: '/reload',
                                type: "POST",
                                dataType: "json",
                                data: reload,
                                success: function (data) {
                                    if (data.msg === 'Error') {
                                        $('.INFO').show();
                                        $('.INFO').text("El usuario no existe");
                                        $('.INFO').css("color", "red");
                                        $('.INFO').css("font-weight", "Bold");
                                        $('#descargar').prop('disabled', false);
                                        $('#descargar').css("background", "#FF851B");
                                        $('#agregar').prop('disabled', false);
                                        $('#agregar').css("background", "#FF851B");
                                        $('#editar').prop('disabled', false);
                                        $('#editar').css("background", "#FF851B");
                                        $('#default').prop('disabled', false);
                                        $('#default').css("background", "#FF851B");
                                        setTimeout(function () {
                                            $('.INFO').text("");
                                        }, 10000);
                                    } else if (data.msg === 'Hecho') {
                                        $('.contenedor2').css("display", "none");
                                        $('.member').text("");
                                        $('#agregar').show();
                                        $('.contenedor3').remove();
                                        $('#descargar').prop('disabled', false);
                                        $('#descargar').css("background", "#FF851B");
                                        $('#agregar').prop('disabled', false);
                                        $('#agregar').css("background", "#FF851B");
                                        $('#editar').prop('disabled', false);
                                        $('#editar').css("background", "#FF851B");
                                        $('#default').prop('disabled', false);
                                        $('#default').css("background", "#FF851B");
                                        if (data.existe === true) {
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
            } else if (on2 === 2) {
                rotacion5R();
                $('#descargar').prop('disabled', true);
                $('#descargar').css("background", "#cccccc");
                $('#agregar').prop('disabled', true);
                $('#agregar').css("background", "#cccccc");
                $('#editar').prop('disabled', true);
                $('#editar').css("background", "#cccccc");
                $('#default').prop('disabled', true);
                $('#default').css("background", "#cccccc");
                var data = {
                    usuario: document.getElementById("name").textContent
                };
                $.ajax({
                    url: '/deleteAdmin',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        if (data.msg === 'Borrado') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("Se ha borrado su IMEI");
                            $('.INFO').css("color", "#49ff00");
                            $('.INFO').css("font-weight", "Bold");
                            $('.contenedorAdmin .IMEI').text("IMEI: Desactivado");
                            $('#descargar').prop('disabled', false);
                            $('#descargar').css("background", "#FF851B");
                            $('#agregar').prop('disabled', false);
                            $('#agregar').css("background", "#FF851B");
                            $('#editar').prop('disabled', false);
                            $('#editar').css("background", "#FF851B");
                            $('#default').prop('disabled', false);
                            $('#default').css("background", "#FF851B");
                        } else if (data.msg === 'Ya borrado') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("El IMEI ya fue borrado anteriormente");
                            $('.INFO').css("color", "red");
                            $('.INFO').css("font-weight", "Bold");
                            setTimeout(function () {
                                $('#descargar').prop('disabled', false);
                                $('#descargar').css("background", "#FF851B");
                                $('#agregar').prop('disabled', false);
                                $('#agregar').css("background", "#FF851B");
                                $('#editar').prop('disabled', false);
                                $('#editar').css("background", "#FF851B");
                                $('#default').prop('disabled', false);
                                $('#default').css("background", "#FF851B");
                            }, 2000);
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                        } else if (data.msg === 'Error') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("El usuario no existe");
                            $('.INFO').css("color", "red");
                            $('.INFO').css("font-weight", "Bold");
                            $('#descargar').prop('disabled', false);
                            $('#descargar').css("background", "#FF851B");
                            $('#agregar').prop('disabled', false);
                            $('#agregar').css("background", "#FF851B");
                            $('#editar').prop('disabled', false);
                            $('#editar').css("background", "#FF851B");
                            $('#default').prop('disabled', false);
                            $('#default').css("background", "#FF851B");
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                        }
                    }
                })
            } else {
                on = 0;
                on2 = 0;
            }
            janelaPopUp2.fecha(id);
        } else {
            if (on === 2) {
                rotacion4R();
                $('#descargar').prop('disabled', true);
                $('#descargar').css("background", "#cccccc");
                $('#agregar').prop('disabled', true);
                $('#agregar').css("background", "#cccccc");
                $('#editar').prop('disabled', true);
                $('#editar').css("background", "#cccccc");
                $('#default').prop('disabled', true);
                $('#default').css("background", "#cccccc");
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
                    success: function (data) {
                        if (data.msg === 'Error') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("El subusuario no existe");
                            $('.INFO').css("color", "red");
                            $('.INFO').css("font-weight", "Bold");
                            $('#descargar').prop('disabled', false);
                            $('#descargar').css("background", "#FF851B");
                            $('#agregar').prop('disabled', false);
                            $('#agregar').css("background", "#FF851B");
                            $('#editar').prop('disabled', false);
                            $('#editar').css("background", "#FF851B");
                            $('#default').prop('disabled', false);
                            $('#default').css("background", "#FF851B");
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                        } else if (data.msg === 'Borrado') {
                            on = 0;
                            on2 = 0;
                            $('.INFO').show();
                            $('.INFO').text("Subusuario eliminado");
                            $('.INFO').css("color", "red");
                            $('.INFO').css("font-weight", "Bold");
                            $('.member').val("");
                            $('#descargar').prop('disabled', false);
                            $('#descargar').css("background", "#FF851B");
                            $('#agregar').prop('disabled', false);
                            $('#agregar').css("background", "#FF851B");
                            $('#editar').prop('disabled', false);
                            $('#editar').css("background", "#FF851B");
                            $('#default').prop('disabled', false);
                            $('#default').css("background", "#FF851B");
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                            var reload = {
                                usuario: document.getElementById("name").textContent
                            }
                            $.ajax({
                                url: '/reload',
                                type: "POST",
                                dataType: "json",
                                data: reload,
                                success: function (data) {
                                    if (data.msg === 'Error') {
                                        $('.INFO').show();
                                        $('.INFO').text("El usuario no existe");
                                        $('.INFO').css("color", "red");
                                        $('.INFO').css("font-weight", "Bold");
                                        $('#descargar').prop('disabled', false);
                                        $('#descargar').css("background", "#FF851B");
                                        $('#agregar').prop('disabled', false);
                                        $('#agregar').css("background", "#FF851B");
                                        $('#editar').prop('disabled', false);
                                        $('#editar').css("background", "#FF851B");
                                        $('#default').prop('disabled', false);
                                        $('#default').css("background", "#FF851B");
                                        setTimeout(function () {
                                            $('.INFO').text("");
                                        }, 10000);
                                    } else if (data.msg === 'Hecho') {
                                        $('.contenedor2').css("display", "none");
                                        $('.member').text("");
                                        $('#agregar').show();
                                        $('.contenedor3').remove();
                                        $('#descargar').prop('disabled', false);
                                        $('#descargar').css("background", "#FF851B");
                                        $('#agregar').prop('disabled', false);
                                        $('#agregar').css("background", "#FF851B");
                                        $('#editar').prop('disabled', false);
                                        $('#editar').css("background", "#FF851B");
                                        $('#default').prop('disabled', false);
                                        $('#default').css("background", "#FF851B");
                                        if (data.existe === true) {
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
            } else if (on2 === 2) {
                rotacion5R();
                /*$('#descargar').prop('disabled', true);
                $('#descargar').css("background", "#cccccc");
                $('#agregar').prop('disabled', true);
                $('#agregar').css("background", "#cccccc");
                $('#editar').prop('disabled', true);
                $('#editar').css("background", "#cccccc");
                $('#default').prop('disabled', true);
                $('#default').css("background", "#cccccc");*/
                var data = {
                    usuario: document.getElementById("name").textContent
                };
                $.ajax({
                    url: '/deleteAdmin',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        
                    }
                })
            } else {
                on = 0;
                on2 = 0;
            }
        }
        janelaPopUp2.fecha(id);
    });
}

janelaPopUp.fecha = function (id) {
    if (id !== undefined) {
        $("#" + id).removeClass("popUpEntrada").addClass("popUpSaida");

        $("#popFundo_" + id).fadeOut(1000, function () {
            $("#popFundo_" + id).remove();
            $("#" + $(this).attr("id") + ", #" + id).remove();
            if (!($(".popUp")[0])) {
                $("window, body").css('overflow', 'auto');
            }
        });


    }
    else
    {
        $(".popUp").removeClass("popUpEntrada").addClass("popUpSaida");

        $(".popUpFundo").fadeOut(1000, function () {
            $(".popUpFundo").remove();
            $(".popUp").remove();
            $("window, body").css('overflow', 'auto');
        });
    }
}

janelaPopUp2.fecha = function (id) {
    if (id !== undefined) {
        $("#" + id).removeClass("popUp2Entrada").addClass("popUp2Saida");

        $("#popFundo_" + id).fadeOut(1000, function () {
            $("#popFundo_" + id).remove();
            $("#" + $(this).attr("id") + ", #" + id).remove();
            if (!($(".popUp2")[0])) {
                $("window, body").css('overflow', 'auto');
            }
        });


    }
    else
    {
        $(".popUp2").removeClass("popUp2Entrada").addClass("popUp2Saida");

        $(".popUp2Fundo").fadeOut(1000, function () {
            $(".popUp2Fundo").remove();
            $(".popUp2").remove();
            $("window, body").css('overflow', 'auto');
        });
    }
}