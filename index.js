var express = require('express');
var app = express();
var sf = require('./socketFunctions');
var af = require('./arrayFunctions');
var set = require('./set');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var hs = require('./homeSocket');
//socket across all pages


var visitCounter = {};
var gameStartedTracker = {};

io.on('connection', function(socket){
    hs.connectHomeSocket(io, visitCounter, gameStartedTracker);
});

function livegameVar(num){
    //gameNumbers.push(num);
    game = io.of('/livegame' + String(num));
    game.numPlayers = 0;
    return game;
}


function setUpGames(number){
    var gameNumbers = sf.range(number);
    var games = gameNumbers.map(function(current){
        return livegameVar(current);
    });
    games.forEach(function(game){
        sf.connectSocket(game, io, gameStartedTracker);
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


var oneplayer = io.of('/oneplayer');




var bestTimeTwoPlayer = 100000;
var bestPlayers = ['sam', 'brett'];

var bestTime;
var bestPlayer;

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
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        res.sendFile(__dirname + fileExtension);
    });
}



appGet('/oneplayer', '/oneplayer.html');
appGet('/helperFunctions.js', '/helperFunctions.js');
appGet('/noGlobalFunctions.js', '/noGlobalFunctions.js');
appGet('/domFunctions.js', '/domFunctions.js');
appGet('/setgame.js', '/setgame.js');
appGet('/setgameNoClicks.js', '/setgameNoClicks.js');
appGet('/','/index.html');
appGet('/node_modules/socket.io/node_modules/socket.io-client/socket.io.js','/node_modules/socket.io/node_modules/socket.io-client/socket.io.js');
appGet('/utilities/jquery.js', '/utilities/jquery.js');

// app.get('/node_modules/socket.io/node_modules/socket.io-client/socket.io.js', function(req, res){
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.sendFile(__dirname + '/node_modules/socket.io/node_modules/socket.io-client/socket.io.js');
// });

for (var i=0; i < 81; i += 1){
    appGet('/cards/' + String(i) + '.JPG', '/cards/' + String(i) + '.JPG');
}

app.get('/besttime', function(req, res){
    res.writeHead(200);
    res.write(String('best time so far is ' + bestTimeTwoPlayer + ' seconds by ' + bestPlayers[0] + ' and ' + bestPlayers[1]));
    res.end();
});

var port = process.env.PORT || 8080;

//server.listen(8080);

server.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});