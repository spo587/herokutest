
var set = require('./set');

var express = require('express');

var fs = require('fs');

var app = express();

var server = require('http').createServer(app);

var io = require('socket.io')(server);

io.on('connection', function(client){
  console.log('client has connected');
});



app.get('/', function(req, res){
    var file = fs.createReadStream('./set.html');
    file.pipe(res);

});

app.get('/besttimes', function(req, res){
    var file = fs.createReadStream('./besttimes.html');
    file.pipe(res);
});

app.get('/superset', function(req, res){
    var file = fs.createReadStream('./superset.html');
    file.pipe(res);
})

var port = process.env.PORT || 8080;

//server.listen(8080);

server.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});