const express = require('express');
const router = express.Router();

const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({
  extended:true
}))

app.use(express.static('public'));
app.use(express.static('files'));


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


mongoose.connect("mongodb://localhost:27017/userdb", { useNewUrlParser: true });

const userScheme = new Schema({
	number: {
		type: Number,
		required: true,
		min:10
	}
});

const User = mongoose.model('User', userScheme);

MongoClient.connect(url, function(err, db) {

if(err) throw err;
var data = db.db("userdb");


router.get('/login', (req, res)=>{
	if(req.session.number){
		res.send("You already authorized");
	} else{
		res.render('register.handlebars');
	}
});


router.post('/user_new', (req, res)=>{
const num = req.body.name;

const query = {name: num};
console.log(query);
data.collection("users").find(query).toArray(function(err, result){
	console.log(result);
	if(result.length==0){

		const user = new User({
			number: num
		});

		req.session.number = num;

		user.save((err)=>{
		if(err) console.log("Еrror occur...");
		});
		console.log("saved...");
		res.redirect('/');
		
	} else{
		console.log("this number is in database");
		res.redirect('/');
	}
});
});
});


module.exports = router;
