console.log("Corriendo Administrador");

var misCookies = document.cookie;
var elegido;
var agreg = false;
var guardasub = 0;
var subusuario;
var on = 0;

//Gets the username saved in the cookie 
function leerCookie(nombre) {
    var lista = document.cookie.split(";");
    for (i in lista) {
        var busca = lista[i].search(nombre);
        if (busca > -1) {
            micookie = lista[i];
        }
        else {
            window.location.href = "../index.html";
        }
    }
    var igual = micookie.indexOf("=");
    var valor = micookie.substring(igual + 1);
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
    success: function (data) {
        if (data.msg === 'No imei') {
            $('.INFO').show();
            $('.INFO').text("No existe un IMEI vinculado a su cuenta, apoye su celular sobre la placa NFC y luego espere");
            $('.INFO').css("color", "red");
            $('.INFO').css("font-weight", "Bold");
            $('#agregar').prop('disabled', true);
            $('#agregar').css("background", "#cccccc");
            var info = {
                usuario: document.getElementById("name").textContent
            }
            console.log(info);
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
                    }
                    else if (data.msg === 'Error') {
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
                }
            })
        }
        else if (data.msg === 'Hay imei') {
            $('.INFO').show();
            $('.INFO').text("Se encontro el IMEI vinculado a su cuenta");
            $('.INFO').css("color", "#49ff00");
            $('.INFO').css("font-weight", "Bold");
            setTimeout(function () {
                $('.INFO').text("");
            }, 10000);
            //Shows IMEI
            $('.IMEI').text("IMEI: " + data.imei);
            console.log(data.contenido);
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
eliminar();
editar();
editarSub();

//Creates new subusers
function agre() {
    $('#agregar').click(function () {
        if (agreg === false) {
            //Adds new textbox and buttons to the set or delete new subuser
            setTimeout(function () {
                $('.contenedor2').show();
                rotacion2();
            }, 1000);
            rotacion2R();
            agreg = true;
            $('#agregar').prop('disabled', true);
            $('#agregar').css("background", "#cccccc");
            nuevo();
            borrar();
        }
        else {
            $('.INFO').show();
            $('.INFO').text("Agregue un nombre");
            $('.INFO').css("color", "red");
            $('.INFO').css("font-weight", "Bold");
        }
    })
}

//Saves the new subuser
function nuevo() {
    $('.buttons').click(function () {
        if ($('.member').val().length > 0) {
            $('.buttons').prop('disabled', true);
            $('.buttons').css("background", "#cccccc");
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
                            console.log("skrr2");
                        }, 500);
                        $('.INFO').show();
                        $('.INFO').text("El subusuario ya existe");
                        $('.INFO').css("color", "red");
                        $('.INFO').css("font-weight", "Bold");
                        setTimeout(function () {
                            $('.INFO').text("");
                        }, 10000);
                    }
                    else if (data.msg === 'Gracias') {
                        rotacion2R();
                        reactive();
                        $('.INFO').show();
                        $('.INFO').text("Subusuario agregado");
                        $('.INFO').css("color", "#49ff00");
                        $('.INFO').css("font-weight", "Bold")
                        setTimeout(function () {
                            $('.INFO').text("");
                        }, 10000);;
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
                                }
                                else if (data.msg === 'Hecho') {
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
            $('#agregar').prop('disabled', false);
            $('#agregar').css("background", "#FF851B");
        }, 2500);
        rotacion3R();
    });
}

//Deletes subuser slected from the database
function eliminar() {
    $(document).on("click", ".eliminar", function () {
        setTimeout(function () {
            $('#agregar').prop('disabled', false);
            $('#agregar').css("background", "#FF851B");
            agreg = false;
            console.log("team");
        }, 1500);
        elegido = $(this).attr('id');
        console.log(elegido);
        if (confirm('¿Está seguro que quiere borrar este subusuario?')) {
            rotacion4R();
            $('#agregar').prop('disabled', true);
            $('#agregar').css("background", "#cccccc");
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
                        $('.INFO').show();
                        $('.INFO').text("El subusuario no existe");
                        $('.INFO').css("color", "red");
                        $('.INFO').css("font-weight", "Bold");
                        setTimeout(function () {
                            $('.INFO').text("");
                        }, 10000);
                    }
                    else if (data.msg === 'Borrado') {
                        $('.INFO').show();
                        $('.INFO').text("Subusuario eliminado");
                        $('.INFO').css("color", "red");
                        $('.INFO').css("font-weight", "Bold");
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
                                    setTimeout(function () {
                                        $('.INFO').text("");
                                    }, 10000);
                                }
                                else if (data.msg === 'Hecho') {
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
        } else {
            // Do nothing!
        }
    })
}

//Edits user's IMEI
function editar() {
    $('#editar').click(function () {
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
                    $('.INFO').show();
                    $('.INFO').text("No existe el usuario");
                    $('.INFO').css("color", "red");
                    $('.INFO').css("font-weight", "Bold");
                    setTimeout(function () {
                        $('.INFO').text("");
                    }, 10000);
                }
                else if (data.msg === 'Editar') {
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
                                $('.INFO').show();
                                $('.INFO').text("Se ha actualizado su cuenta");
                                $('.INFO').css("color", "#49ff00");
                                $('.INFO').css("font-weight", "Bold");
                                setTimeout(function () {
                                    document.location.reload(true);
                                }, 2000);
                            }
                            else if (data.msg === 'Error') {
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
                            setTimeout(function () {
                                $('.INFO').text("");
                            }, 10000);
                        }
                    })
                }
            }
        })
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
                }
                else if (data.msg === 'Editar') {
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
                            }
                            else if (data.msg === 'Error') {
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
                        }
                    })
                }
            }
        })
    })
}

function reactive() {
    setTimeout(function () {
        $('#agregar').prop('disabled', false);
        $('#agregar').css("background", "#FF851B");
    }, 1500);
    $('.buttons').prop('disabled', false);
    $('.buttons').css("background", "#FF851B");
}

function rotacion2() {
    console.log("1a");
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
    console.log("3a");
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
    console.log("4a");
    $(".contenedor2").css("transform", "perspective(130px) rotateX(-90deg)");
    $(".contenedor3").each(function () {
        $(this).css("transform", "perspective(130px) rotateX(-90deg)");
    })
}

function sacar() {
    setTimeout(function () {
        console.log("2");
        $('.contenedor2').css("display", "none");
    }, 500);
}

window.onload = function () {
    setTimeout(function () {
        $('#agregar').prop('disabled', false);
        $('#editar').prop('disabled', false);
    }, 500);
}