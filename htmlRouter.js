const express = require('express');
const router = express.Router();


const app = express();

app.use(express.static('public'));
app.use(express.static('files'));

var exphandle  = require('express-handlebars');
var handle = exphandle.create();

app.set('view engine', 'handlebars');
app.engine('handlebars', handle.engine);


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;


mongoose.connect("mongodb://localhost:27017/Cakes", { useNewUrlParser: true });

const elementScheme = new Schema({
	title: String,
	image_url: String,
	name: String,
	path: String,
	price: String
});

const Cakes = mongoose.model('collection', elementScheme);

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var data = db.db("Cakes");

  router.get('/admin', (request, response)=>{
  	data.collection("collections").find({}).toArray((error, result)=>{
      if(err) throw err;
    	console.log(result);

    	if(request.session.number){
    		response.render('admin', {admin: result, style: 'admin.css'});
    	} else{
    		response.send("You are not authorized");
    	}
  	});
  });

  router.post('/delete/:path', (request, response)=>{

  	data.collection("collections").find({path: request.params.path}).toArray((err, result)=>{
  		console.log({path: request.params.path});
  		if(err) throw err;
  		data.collection("collections").deleteOne(result);
  	});
  	
  });

  router.post('/create', (request, response)=>{
  	const newName = request.body.name;
		const newTitle = request.body.title;
		const newImage = request.body.image;
		const newPath = request.body.path;
		const newPrice = request.body.price;



		const element = new Cakes({
			title: newTitle,
			image_url: newImage,
			name: newName,
			path: newPath,
			price: newPrice
		});

		element.save((err)=>{
			if(err) response.send("Еrror occur...");
			console.log('Created');
		});
		response.redirect('/list');

  });

});

module.exports = router;