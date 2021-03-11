const express = require('express');

const app = express();
const router = require('./router');

app.use(express.static('public'));
app.use(express.static('files'));


const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var exphandle  = require('express-handlebars');
var handle = exphandle.create();

app.set('view engine', 'handlebars');
app.engine('handlebars', handle.engine);


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var data = db.db("Cakes");

  app.get('/', (request, response)=>{
  	response.render('firstPAge', {style: 'first.css'});
  });

  app.get('/search', (request, response) => {
    response.render('search.handlebars', {style: 'search.css'});
  });

  app.post('/cake', (request, response)=>{
  	var query = {name:request.body.search};
    data.collection("collections").find(query).toArray((error, result)=>{
      if(err) throw err;

      if(result.length==0){
        response.render('page.handlebars');
      } else{
        response.render('search', {search: result, style: 'search.css'});
      }

  	});
  });


  app.get('/list', (request, response)=>{
  	data.collection("collections").find({}).toArray((error, result)=>{
  		if(err) throw err;
    	response.render('listPage', {listPage: result, style: 'listPage.css'});
  	});
  });

  app.post('/item', (request, response)=>{
  	const menu_list = request.body.menu;
  	console.log(menu_list);
  	data.collection("collections").find({type: menu_list}).toArray((error, result)=>{
  		if(err) throw err;
  		response.render('listPage', {listPage: result, style: 'listPage.css'});
  	});
  });

  app.get('/:path', (request, response)=>{
  	const list_element = request.params.path;
  	console.log(list_element);
  	data.collection("collections").find({path: list_element}).toArray((error, result)=>{
  		console.log(result);
  		if(err) throw err;
  		response.render('elementPage', {elementPage: result, style: 'element.css'});
  	});
  });
});


	

const cookieParser = require('cookie-parser');
let session = require('express-session');
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));

const bodyParser = require('body-parser');
const {response} = require('express');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(router.router);
app.listen(8008, ()=>{
	console.log("Listening...");
});