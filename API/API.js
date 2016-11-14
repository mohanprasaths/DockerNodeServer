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
	(new Promise(function(resolve,reject){
		 docker.listContainers(function (err, containers) {
		  containers.forEach(function (containerInfo) {
		    container = docker.getContainer(containerInfo.Id);
		    var dataToSend =[];
		    container.stats({stream:false}, function(err, stream){
		    // to close the stream you need to use a nested method from inside the stream itself\
		    console.log(container.id)
		    console.log(formatBytes(stream.cpu_stats.cpu_usage.total_usage));
		    console.log(formatBytes(stream.cpu_stats.system_cpu_usage));
		    console.log(formatBytes(stream.memory_stats.max_usage));
		    console.log(formatBytes(stream.memory_stats.usage));
		    console.log(formatBytes(stream.networks.eth0.rx_bytes));
		    console.log(formatBytes(stream.networks.eth0.rx_packets));
		    console.log(formatBytes(stream.networks.eth0.tx_bytes));
		    console.log(formatBytes(stream.networks.eth0.tx_packets));
		    dataToSend.containerID = container.id;
		    dataToSend.cpu = {totalUsage : stream.cpu_stats.cpu_usage.total_usage ,
		                      maxUsage : stream.memory_stats.max_usage };
		    dataToSend.memory = {maxUsage : stream.memory_stats.max_usage , totalUsage : stream.memory_stats.usage };
		    dataToSend.networks = {rx_bytes : stream.networks.eth0.rx_bytes , rx_packets : stream.networks.eth0.rx_packets,
		                          tx_bytes : stream.networks.eth0.tx_bytes , tx_packets : stream.networks.eth0.tx_packets };
		    data.push(dataToSend);

		  });
		  });
		}); 

	})).then(function(){console.log("data");res.send(data)},function(){console.log("failes")})

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