var Docker = require('dockerode');
var docker = new Docker({host: 'http://10.203.63.242', port: 2375});
var Promise = require('promise');
//var docker = new Docker({socketPath: '/var/run/docker.sock'});
function formatBytes(bytes) {
    if(bytes < 1024) return bytes + " Bytes";
    else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KB";
    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MB";
    else return(bytes / 1073741824).toFixed(3) + " GB";
};

function helloWorld(req,res){
	res.send("helloWorls");
}

function getContainers(req,res){
	var container = [];
	docker.listContainers(function (err, containers) {
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

function getSwarmService(req,res){
	docker.listServices(function(err,services){
		res.send(services);
	})
}

function getDashBoardKPI(req,res){
	var container = [];
	var data=[];
	var a = new Promise(function(resolve,reject){
		 docker.listContainers(function(e,c){
			resolve(c)	
		})
	})


	 var b =  a.then(function(data){
	 	return Promise.all(data.map(function(container){
	 	return new Promise(function(resolve){
	 		con = docker.getContainer(container.Id);
	 		resolve(con)
	 	}).then(function(data){
	 		return new Promise(function(resolve){
	 			data.stats({stream:false}, function(err, stream){
	 				resolve(stream)
	 			})
	 		}).then(function(stream){
	 			return new Promise(function(resolve){
	 				var dataToSend ;
	 				dataToSend = {
	 					containerID : container,
	 					cpu : {totalUsage : stream.cpu_stats.cpu_usage.total_usage ,
	 				                  maxUsage : stream.memory_stats.max_usage },
	 				    memory : {maxUsage : stream.memory_stats.max_usage , totalUsage : stream.memory_stats.usage },
	 				    networks : {rx_bytes : stream.networks.eth0.rx_bytes , rx_packets : stream.networks.eth0.rx_packets,
	 				                      tx_bytes : stream.networks.eth0.tx_bytes , tx_packets : stream.networks.eth0.tx_packets }
	 				}
	 				 resolve(dataToSend)
	 			}).then(function(dataTosend){
	 				return new Promise(function(resolve){resolve(dataTosend)})
	 			})
	 		})
	 	})
	 }))
	 	
	 })
	 console.log(b)
	 b.then(function(data){console.log(data);res.send(data)})
		}

module.exports = {
	"helloWorld" : helloWorld,
	"getContainers" : getContainers,
	"getImages" : getImages,
	"getInfo" : getInfo,
	"getNetworks" : getNetworks,
	"getEvents" : getEvents,
	"getSwarmService":getSwarmService,
	"getDashBoardKPI" : getDashBoardKPI
}