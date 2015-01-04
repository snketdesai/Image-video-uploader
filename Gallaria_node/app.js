
var express = require('express')
  , events = require('events')
  , routes = require('./routes')
  , user = require('./routes/user')
  
  , upload = require('./routes/upload')
  , path = require('path');


var app = express();
var http = require('http').createServer(app);
var AWS = require('aws-sdk');
var events = require('events');
var EventEmitter = events.EventEmitter;
var eventOnUpload = new EventEmitter();
var redis = require('redis');
var redisClient = redis.createClient();

app.set('port', process.env.PORT || 3002);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/upload', upload.upload);

AWS.config.loadFromPath('./public/access.json');

//var s3 = new AWS.S3();
//s3.createBucket({Bucket:"FirstBucket"});

var s3Bucket = new AWS.S3({params:{Bucket:"snket"}});

http.listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});

var io = require('socket.io')(http);
io.on('connection',function(client){
	
client.on('onupload',function(name,temp){

		console.log(name);
		console.log(temp);
	var data = {Key: name, Body: temp};
	s3Bucket.putObject(data, function(err, data){
	  if (err) 
	    { 
		  console.log(err); 
	    }
	  else 
	    {
	      console.log('succesfully uploaded the image!');
	      var urlParams = {Bucket: 'snket', Key: name};
	      s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
	          var url_image = url;
	          eventOnUpload.emit('store',url_image,name);
	      })
	    }
	});
});

eventOnUpload.on('store',function(url,name){
	
	//console.log(url);
	//make an entry in the database for image name and the url.
	redisClient.set(name,url);
	redisClient.get(name,function(error,data){
		console.log(data);
	});
});
});