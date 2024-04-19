import { runServer } from "./server";

const os =require('os');
const cluster = require('cluster');
const len =os.cpus.length;

if(cluster.isMaster) {
    console.log(`worker ${process.pid} is running`)
    for(let i = 0; i < len; i++) {
        cluster.fork();
    }
}else{
    console.log(`new worker ${process.pid} is started`)
    runServer()
}