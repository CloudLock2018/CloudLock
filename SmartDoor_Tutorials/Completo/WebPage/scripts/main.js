console.log("Corriendo");

function setup(){
	var button = select('#entrar');
	button.mousePressed(sendServer);
	var devolver = select('#info');
	devolver.mousePressed(ReceiveServer);
}
//------------------------------------------------------Enviar Info-------------------------------------------------------
function sendServer(){
	var nombre = select('#Nombre').value();
	var contra = select('#Pass').value();
	var data = {
		nom: nombre,
		pass: contra
	}
	httpPost('http://localhost:3000/', data, 'json', dataPosted, postError);
}

function dataPosted(result){
	if (result.msg === 'Error'){
		alert("ERROR, Nombre ya agregado");
	}else{
		console.log(result);
	}
}

function postError(err){
	console.log(err);
}

//----------------------------------------------------Devolver Info-------------------------------------------------------
function ReceiveServer(){
	var data = {
		nombre: select('#Buscar').value()
	};
	httpPost('http://localhost:3000/receive', data, 'json', dataReceived, receiveError);
}

function dataReceived(result){
	if (result.msg === 'ERROR, Documento no encontrado'){
		alert("ERROR, Documento no encontrado");
	}else{
		console.log(result);	
	}
}

function receiveError(err){
	console.log(err);
}