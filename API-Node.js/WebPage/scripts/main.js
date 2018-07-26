console.log("Corriendo");

/*------------------------------------------CLASE 6---------------------------------------------------------------------*/
/*function setup() {
	loadJSON('/all', gotData);
	var button = select('#entrar');
	button.mousePressed(EnviarInfo);
}

function EnviarInfo(){
	var palabra = select('#Nombre').value();
	console.log (palabra);
}*/

function gotData(data){
	console.log(data);
}

/*-----------------------------------------CLASE 7-----------------------------------------------------------------------*/
function setup(){
	loadJSON('/all', gotData);
	var button = select('#entrar');
	button.mousePressed(analyzeThis);
}

function analyzeThis(){
	var palabra = select('#Nombre').value();
	var data = {
		text: palabra
	}
	httpPost('analyze', data, 'json', dataPosted, postError);
}

function dataPosted(result){
	console.log(result);
}

function postError(err){
	console.log(err);
}