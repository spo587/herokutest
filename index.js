var express = require('express');
var app = express();

// var redis = require('redis');

// var client = redis.createClient();

var set = require('./set');

var server = require('http').createServer(app);

var io = require('socket.io')(server);

//socket across all pages
var visitCounter = {};

io.on('connection', function(socket){
    
    console.log(socket.client.request.headers.referer);
    var route = socket.client.request.headers.referer;
    var page = route.split('/')[route.split('/').length - 1];
    if (visitCounter[page]){
        visitCounter[page] += 1;
    }
    else {
        visitCounter[page] = 1;
    }
    console.log(visitCounter);
    io.emit('player joined game', visitCounter);
    socket.on('disconnect', function(){
        var route = socket.client.request.headers.referer;
        var page = route.split('/')[route.split('/').length - 1];
        visitCounter[page] = visitCounter[page] - 1;
        console.log(visitCounter);
        io.emit('player left game', visitCounter);
    });
});

//var gameNumbers = [];

function livegameVar(num){
    //gameNumbers.push(num);
    game = io.of('/livegame' + String(num));
    game.numPlayers = 0;
    return game;
}

function connectSocket(socketVar){
    //var numPlayers = 0;
    
    socketVar.on('connection', function(socket){
        //console.log(socket);
        //console.log(socketVar.name);
        //console.log('connected!!!');
        //numPlayers += 1;
        socketVar.numPlayers += 1;
        //console.log(socketVar.numPlayers);
        socketVar.emit('new connection', socketVar.numPlayers);
        socket.broadcast.emit('new player');
        socket.on('disconnect', function(){
            socketVar.numPlayers = socketVar.numPlayers - 1;
            console.log('client disconnected');
            socketVar.emit('disconnect', socketVar.numPlayers);
            socket.broadcast.emit('player has departed');
        });

        socket.on('chat message', function(data){
            socketVar.emit('chat message', data);
            //console.log(msg);
        });
        socket.on('start game', function(){
            // var allCards = set.allCards;
            // console.log(allCards);
            //console.log('game starting??');
            var deck = set.setDeckShuffled();
            socketVar.emit('order of deck', deck);
            //console.log(deck);
            //io.emit('dealing twelve cards', twelve);
            //io.emit('array of all cards', allCards);
        });
        socket.on('set found', function(setcards){
            //console.log('set found');
            socket.broadcast.emit('set found', setcards);
            // var three = set.nextThree();
            socketVar.emit('dealing next three');
        });

    });
}

function setUpGames(number){
    var gameNumbers = set.range(number);
    var games = gameNumbers.map(function(current){
        return livegameVar(current);
    });
    games.forEach(function(game){
        connectSocket(game);
    });
    getGamesOnly(gameNumbers);
}

function getGamesOnly(gameNumbers){
    gameNumbers.forEach(function(number){
        app.get('/livegame' + String(number), function(req, res){
            res.sendFile(__dirname + '/livegame.html')
        });
    });
}

setUpGames(10);


var homesocket = io.of('/');
homesocket.on('connection', function(socket){

});

var oneplayer = io.of('/oneplayer');


//console.log(oneplayer);

var bestTime = 1000000;

//var numPlayers = 0;

oneplayer.on('connection', function(socket){
    console.log('player connected to one player game');
    socket.on('timed game over', function(t){
    console.log(t);
    bestTime = Math.min(t, bestTime);
    console.log(bestTime);

        //client.set('best time', t);

    });
});


app.get('/oneplayer', function(req, res){
    res.sendFile(__dirname + '/oneplayer.html')
});

app.get('/besttime', function(req, res){
    res.writeHead(200);
    res.write(String('best time so far is ' + bestTime + ' seconds'));
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