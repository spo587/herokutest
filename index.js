
var set = require('./set');

var express = require('express');


var app = express();

var server = require('http').createServer(app);

var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('client has connected');
});

// io.on('highlight', function(){
//     console.log('click received');
// })

app.get('/', function(req, res){
    res.sendFile(__dirname + '/set.html');

});

app.get('/test', function(req, res){
    res.sendFile(__dirname + '/test.html')
});


var port = process.env.PORT || 8080;

//server.listen(8080);

server.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});