console.log("Preparing the Barbeque");

var express 				= require('express'),
app 				= express(),
bodyParser			= require('body-parser'),
mongoose			= require('mongoose'),
fs 					= require('fs'),
path	    		= require('path'),
passport			= require('passport'),
flash    			= require('connect-flash'),
session      		= require('express-session'),
cookieParser 		= require('cookie-parser'),
http 				= require('http').Server(app),
roastController 	= require('./server/controllers/roastController'),
debateController	= require('./server/controllers/debateController'),
trendingController 	= require('./server/controllers/trendingController');

mongoose.connect('mongodb://localhost:27017/roastDB');

app.use(cookieParser()); // read cookies (needed for auth)

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./server/config/passport')(passport);

app.engine('html', require('ejs').renderFile); //TODO npm install ejs
app.set('view engine', 'html');
app.use('/', express.static(__dirname + '/client'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});

app.get('/roast/:id', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
app.get('/create', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
app.get('/roastList', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
app.get('/QandA/:id', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
app.get('/QandAlist', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
app.get('/replies/:id', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
app.get('/repliesR/:id', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
app.get('/home', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
app.get('/aboutUs', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
app.get('/404', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});

require( './server/routers/routes' )(app, passport, express);


app.listen(3000, function(){
	console.log("Ready to Roast");
});