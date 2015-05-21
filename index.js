var express = require('express');
var app = express();

// var redis = require('redis');
// var client = redis.createClient();

var set = require('./set');

var server = require('http').createServer(app);

var io = require('socket.io')(server);

//socket across all pages
var visitCounter = {};
var gameStartedTracker = {};

io.on('connection', function(socket){
    var route = socket.client.request.headers.referer;
    var page = route.split('/')[route.split('/').length - 1];
    if (visitCounter[page]){
        visitCounter[page] += 1;

    }
    else if (page !== '') {
        //console.log('this step');
        visitCounter[page] = 1; 
        gameStartedTracker[page] = false;   
    }
    //console.log(visitCounter);
    var data = {visitCounter: visitCounter, gameStartedTracker: gameStartedTracker};
    io.emit('player joined game', data);
    socket.on('disconnect', function(){
        var route = socket.client.request.headers.referer;
        var page = route.split('/')[route.split('/').length - 1];
        if (visitCounter[page]){
            visitCounter[page] = visitCounter[page] - 1;
            if (visitCounter[page] === 0){
                gameStartedTracker[page] = false;
            }
        }
        //console.log(visitCounter);
        io.emit('player left game', data);
    });
});

//var gameNumbers = [];

function livegameVar(num){
    //gameNumbers.push(num);
    game = io.of('/livegame' + String(num));
    game.numPlayers = 0;
    return game;
}

//putting this var here works only in one direction
//var firstClick = false;



function cutOffFirst(str){
    return str.split('').splice(1, str.split('').length).join('');
}

function connectSocket(socketVar){
    var firstClick = false;
    //var players = [];
    var setsPerPlayer = {};
    socketVar.on('connection', function(socket){
        

        socket.on('join', function(name){
            socket.nickname = name;
            console.log(name + 'joined the game');
            setsPerPlayer[name] = 0;
            socket.broadcast.emit('new player', name);
            console.log(setsPerPlayer);
            
            socketVar.emit('allPlayers', setsPerPlayer);
            setsPerPlayer[name] = 0;
            //socketVar.numPlayers += 1;
            //socketVar.emit('new connection', socketVar.numPlayers);

        });
        //take off the slash
        //var route = socketVar.name.split('').splice(1,socketVar.name.split('').length).join('');
        
        //console.log(socketVar.numPlayers);
        // socketVar.emit('new connection', socketVar.numPlayers);
        // var otherName;
        // socket.on('player name', function(playerName){
        //     console.log('name event firing from client to server');
        //     console.log(playerName);
        //     if (otherName !== playerName){
        //         otherName = playerName;
        //         socket.broadcast.emit('player name', otherName);
        //     }
        //     else {
        //         console.log('duplicate???');
        //     }
        //     //console.log('player name received, broadcasting now');
            

        // });
        //socket.broadcast.emit('new player', otherName);
        socket.on('disconnect', function(){
            var departed = socket.nickname;
            console.log(departed);
            console.log(setsPerPlayer);
            delete setsPerPlayer[socket.nickname];
            console.log(setsPerPlayer);
            //players.splice(players.indexOf(departed), 1);
            
            socket.broadcast.emit('player has departed', departed);
            
            socket.broadcast.emit('allPlayers', setsPerPlayer);

            // socketVar.numPlayers = socketVar.numPlayers - 1;
            console.log('client disconnected');
            //console.log(players);
            // socketVar.emit('disconnect', socketVar.numPlayers);
            // socket.broadcast.emit('player has departed');
        });

        socket.on('chat message', function(data){
            socketVar.emit('chat message', data);
            //console.log(msg);
        });
        socket.on('start game', function(){
            var deck = set.setDeckShuffled();
            socketVar.emit('order of deck', deck);
            //console.log(socketVar.name);
            //console.log(visitCounter);
            var gameName = cutOffFirst(socketVar.name);
            gameStartedTracker[gameName] = true;
            io.emit('game no longer open', gameStartedTracker);

        });
        
        socket.on('set found', function(data){
            // var cards = data.cards;
            // var player = data.playerName;
            var cards = data.cards;
            setsPerPlayer[data.playerName] += 1;

            var transmit = {cards: cards, setsPerPlayer: setsPerPlayer, player: data.playerName};
            socketVar.emit('set found', transmit);
            socketVar.emit('dealing next three');
        });
        socket.on('cardClick', function(id){
            socket.broadcast.emit('cardClick', id);
        });
        socket.on('firstCardClick', function(data){
            console.log(firstClick);
            if (firstClick === true){
                console.log('already received click');
                return false;
            }
            firstClick = true;
            console.log(data);
            socket.broadcast.emit('noClicksUntil', data);
        });
        socket.on('clickBanExpiring', function(){
            console.log('click ban expiring, resetting first click');
            firstClick = false;
            console.log(firstClick);
        });
        socket.on('opponent falsey', function(){
            socket.broadcast.emit('falsey');
        });
        socket.on('game data', function(data){
            console.log(data);
            if (data.t < bestTimeTwoPlayer){
                bestTimeTwoPlayer = data.t;
                bestPlayers = [data.player1, data.player2];
            }
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