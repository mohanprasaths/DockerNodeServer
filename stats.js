
var Docker = require('dockerode');
var docker = new Docker({host: 'http://10.203.63.242', port: 2375});

function formatBytes(bytes) {
    if(bytes < 1024) return bytes + " Bytes";
    else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KB";
    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MB";
    else return(bytes / 1073741824).toFixed(3) + " GB";
};


function getContainers(req,res){
  var container = [];
  var dataToSend =[];
  docker.listContainers(function (err, containers) {
    containers.forEach(function (containerInfo) {
      container = docker.getContainer(containerInfo.Id);
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
      

    });
    });
  }); 
}

getContainers()