var stats = require('docker-stats')
var through = require('through2')
var Docker = require('dockerode');
var docker = new Docker({host: 'http://10.203.63.242', port: 2375});

function getContainers(req,res){
  var container = [];
  docker.listContainers(function (err, containers) {
    containers.forEach(function (containerInfo) {
      container = docker.getContainer(containerInfo.Id);
      container.stats({stream:false}, function(err, stream){
      // to close the stream you need to use a nested method from inside the stream itself\
      console.log(stream.cpu_stats.cpu_usage.total_usage);
      console.log(stream.cpu_stats.system_cpu_usage);
      console.log(stream.cpu_stats.cpu_usage.total_usage);
      console.log(stream.cpu_stats.cpu_usage.total_usage);
      console.log(stream.cpu_stats.cpu_usage.total_usage);
      console.log(stream.cpu_stats.cpu_usage.total_usage);
      console.log(stream.cpu_stats.cpu_usage.total_usage);
    });
    });
  }); 
}

getContainers()