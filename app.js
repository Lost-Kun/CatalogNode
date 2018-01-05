const http = require('http');

const socketIo = require('socket.io');

const dirStructure = require('./utils/dirStructure');

const server = http.createServer((req, res) => {
    let url = req.url.replace(/\/[\/]+/g,'/').replace(/\/$/,'');
    if(url.startsWith('/static/') || url === '/static'){
        dirStructure(req, res);
    }else{
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
        res.end('<h1>UnitAresManger测试Demon</h1>')
    }
});

// const io = socketIo(server);

server.listen(8082);
console.log("server start in http://localhost:8082");