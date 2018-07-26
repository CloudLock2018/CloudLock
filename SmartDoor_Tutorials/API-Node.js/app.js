var express = require('express');
var bodyParser = require('body-parser')
var app = express();


/*--------------------------------------------------CLASE 2---------------------------------------------------------------*/
app.get('/blocks', function(req, res) {
	/*var blocks = '<ul><li>Fixed</li><li>Movable</li></ul>';
	res.send(blocks);*/
	res.send(301, '/parts');
});

app.listen(3000, function(){console.log('Listen  on port 3000')});

app.use(express.static('WebPage'));

/*---------------------------------------------------CLASE 3--------------------------------------------------------------*/
app.get('/hola/:nombre/:num', function(req, res){
	var data = req.params;
	var numero = data.num;
	var reply = '';
	for (var i = 0; i < numero; i++){
		reply += 'Hola, como estas ' + data.nombre +'?</br>';
	}
	res.send(reply);
});

/*----------------------------------------------------CLASE 4 ------------------------------------------------------------*/
/*var palabras = {
	'boca': 10,
	'barcelona': 5,
	'real madrid': 2,
	'river': -4
}

app.get('/all', function(req, res){
	res.send(palabras);
})

app.get('/add/:palabra/:puntaje?', function(req, res){
	var data = req.params;
	var palabra = data.palabra;
	var puntaje = Number(data.puntaje);
	var reply;
	if(!puntaje){
		reply = {
			msg: 'Se requeire de un puntaje'
		}
	}else{
		palabras[palabra] = puntaje;

		reply = {
			msg: 'Gracias por agregar.'
		}
	}
	res.send(reply);
})

app.get('/search/:palabra', function(req, res){
	var palabra = req.params.palabra;
	var reply;
	if(palabras[palabra]){
		reply = {
			status: 'Palabra encontrada',
			buscado: palabra,
			puntaje: palabras[palabra]
		}
	}else{
		reply = {
			status: 'Palabra no encontrada',
			buscado: palabra
		}
	}
	res.send(reply);
})*/

/*---------------------------------------------------------CLASE 5--------------------------------------------------------*/
var fs = require ('fs');
var data = fs.readFileSync('palabras.json')
var palabras = JSON.parse(data);
console.log(palabras);

app.get('/all', function(req, res){
	res.send(palabras);
})

app.get('/add/:palabra/:puntaje?', function(req, res){
	var data = req.params;
	var palabra = data.palabra;
	var puntaje = Number(data.puntaje);
	var reply;
	if(!puntaje){
		reply = {
			msg: 'Se requeire de un puntaje'
		}
		res.send(reply);
	}else{
		palabras[palabra] = puntaje;
		var data = JSON.stringify(palabras, null, 2);
		fs.writeFile('palabras.json', data, terminado)
		
		function terminado(err){	
			console.log("Ya esta");
			reply = {
				palabra : palabra,
				puntaje : puntaje,
				status : "Listo"
			}
			res.send(reply);
		}
	}
})

/*--------------------------------------------CLASE 6--------------------------------------------------------------------*/
/*-----------------------------Todo fue realizado en la carpeta WEB Page-------------------------------------------------*/

/*--------------------------------------------CLASE 7--------------------------------------------------------------------*/
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.post('/analyze', function(req, res){
	console.log(req.body);
	var nombre = req.body.text;
	var reply = {
		msg: 'Gracias ' + nombre
	}
	res.send(reply);
})