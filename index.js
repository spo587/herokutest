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
    // socket.on('player name received', function(visitCounter){
    //     io.emit('player name', visitCounter);
    // });
    //console.log(socket.client.request.headers.referer);
    var route = socket.client.request.headers.referer;
    var page = route.split('/')[route.split('/').length - 1];
    if (visitCounter[page]){
        visitCounter[page] += 1;
    }
    else if (page !== '') {
        //console.log('this step');
        visitCounter[page] = 1;    
    }
    //console.log(visitCounter);
    io.emit('player joined game', visitCounter);
    socket.on('disconnect', function(){
        var route = socket.client.request.headers.referer;
        var page = route.split('/')[route.split('/').length - 1];
        if (visitCounter[page]){
            visitCounter[page] = visitCounter[page] - 1;
        }
        //console.log(visitCounter);
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
    socketVar.on('connection', function(socket){
        console.log(socketVar.name);
        //take off the slash
        var route = socketVar.name.split('').splice(1,socketVar.name.split('').length).join('');
        socketVar.numPlayers += 1;
        //console.log(socketVar.numPlayers);
        socketVar.emit('new connection', socketVar.numPlayers);
        var otherName;
        socket.on('player name', function(playerName){
            otherName = playerName;
            //console.log('player name received, broadcasting now');
            socket.broadcast.emit('player name', otherName);
            // if (visitCounter[route]){
            //     visitCounter[route].push(otherName);
            // }
            // else {
            //     visitCounter[route] = [otherName];
            // }

        });
        //socket.broadcast.emit('new player', otherName);
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
            var deck = set.setDeckShuffled();
            socketVar.emit('order of deck', deck);

        });
        // socket.on('deadboard', function(){
        //     socketVar.emit('force deal next three');
        // });
        // socket.on('dealt three more', function(){
        //     socket.broadcast.emit('force deal next three');
        // });
        socket.on('set found', function(setcards, nextThree){
            
            socket.broadcast.emit('set found', setcards);
            socketVar.emit('dealing next three');
        });
        socket.on('cardClick', function(id){
            socket.broadcast.emit('cardClick', id);
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


// var homesocket = io.of('/');
// homesocket.on('connection', function(socket){

// });

var oneplayer = io.of('/oneplayer');


//console.log(oneplayer);

var bestTime = 1000000;
var bestPlayer = 'postman';

//var numPlayers = 0;

oneplayer.on('connection', function(socket){
    console.log('player connected to one player game');
    socket.on('timed game over', function(data){
        console.log(data);
        if (data.t < bestTime){
            bestTime = data.t;
            bestPlayer = data.playerName;
        }
        
        //client.set('best time', t);

    });
});

function appGet(urlPath, fileExtension){
    app.get(urlPath, function(req, res){
        res.sendFile(__dirname + fileExtension);
    });
}

appGet('/oneplayer', '/oneplayer.html');
appGet('/setgame.js', '/setgame.js');
appGet('/','/index.html');
appGet('/socket.io/socket.io.js','/node_modules/socket.io/socket.io.js');
appGet('/utilities/jquery.js', '/utilities/jquery.js');

for (var i=0; i < 81; i += 1){
    appGet('/cards/' + String(i) + '.JPG', '/cards/' + String(i) + '.JPG');
}

app.get('/besttime', function(req, res){
    res.writeHead(200);
    res.write(String('best time so far is ' + bestTime + ' seconds by ' + bestPlayer));
    res.end();
});

var port = process.env.PORT || 8080;

//server.listen(8080);

server.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});