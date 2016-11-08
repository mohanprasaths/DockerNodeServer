var express = require('express');
var api = require('./API/API.js');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var count = 0;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Headers","*")
	  res.header('Access-Control-Allow-Origin','*')
  	   next();
});

app.get('/hello', api.helloWorld)
app.get('/getContainers', api.getContainers)
app.get('/getImages', api.getImages)
app.get('/getNetworks', api.getNetworks)
app.get('/getInfo', api.getInfo)
app.get('/getEvents', api.getEvents)


var server = app.listen(8085, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port);

})