var Docker = require('dockerode');
var docker = new Docker({host: 'http://10.203.63.242', port: 2375});
//var docker = new Docker({socketPath: '/var/run/docker.sock'});


function helloWorld(req,res){
	res.send("helloWorls");
}

function getContainers(req,res){
	var container = [];
	docker.listContainers(function (err, containers) {
	  res.header("Access-Control-Allow-Headers",'*')
	  res.send(containers);
	});	
}

function getImages(req,res){
	var images = [];
	docker.listImages(function(err,images){
		res.send(images);
	})
}

function getInfo(req,res){
	docker.info(function(err,info){
		res.header("Access-Control-Allow-Headers",'*')
		res.send(info);
	})
}

function getNetworks(req,res){
	docker.listNetworks(function(err,networks){
		res.send(networks);
	})
}

function getEvents(res,ress){
	docker.getEvents(function(err,data){
		ress.send(data);
	})
}

module.exports = {
	"helloWorld" : helloWorld,
	"getContainers" : getContainers,
	"getImages" : getImages,
	"getInfo" : getInfo,
	"getNetworks" : getNetworks,
	"getEvents" : getEvents
}