var express = require('express');
var app = express();

// var redis = require('redis');

// var client = redis.createClient();

var set = require('./set');

var server = require('http').createServer(app);

var io = require('socket.io')(server);

var bestTime = 1000000;

var numPlayers = 0;
io.on('connection', function(socket){
    console.log('client connected');
    // console.log('client connected');
    // socket.on('form-click', function(data){
    //     console.log('click');
    //     console.log(data);
    // });
    numPlayers += 1;
    io.emit('new connection', numPlayers);
    socket.on('disconnect', function(){
        numPlayers = numPlayers - 1;
        console.log('client disconnected');
        io.emit('disconnect', numPlayers);
    });

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
        console.log(msg);
    });
    socket.on('click for card', function(){
        // var allCards = set.allCards;
        // console.log(allCards);
        var twelve = set.firstTwelve();
        io.emit('dealing twelve cards', twelve);
        //io.emit('array of all cards', allCards);
    });
    socket.on('set found', function(setcards){
        console.log('set found');
        socket.broadcast.emit('set found', setcards);
        var three = set.nextThree();
        io.emit('dealing next three', three);
    });
    socket.on('timed game over', function(t){
        console.log(t);
        bestTime = Math.min(t, bestTime);
        console.log(bestTime);

        //client.set('best time', t);

    });
});

app.get('/livegame', function(req, res){
    res.sendFile(__dirname + '/livegame.html');
});

app.get('/oneplayer', function(req, res){
    res.sendFile(__dirname + '/oneplayer.html')
});

app.get('/besttime', function(req, res){
    res.writeHead(200);
    res.write(String('best time so far is ' + bestTime));
    res.end();
})

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
})

var port = process.env.PORT || 8080;

//server.listen(8080);

server.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});