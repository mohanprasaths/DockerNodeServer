var Docker = require('dockerode');
var docker = new Docker({host: 'http://10.203.63.242', port: 2375});
var Promise = require('promise');
var con;

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
	 b.then(function(data){console.log(data);})


