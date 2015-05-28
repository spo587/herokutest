var express = require('express');
var app = express();
var sf = require('./socketFunctions');
var af = require('./arrayFunctions');
var set = require('./set');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var hs = require('./homeSocket');


var visitCounter = {};
var gameStartedTracker = {};
//var players = {};

//make socket for communicating with home page
io.on('connection', function(socket){
    hs.connectHomeSocket(io, visitCounter, gameStartedTracker);
});

function setUpGames(number){
    var gameNumbers = sf.range(number); //create array of game numbers
    var setGames = gameNumbers.map(function(current){
        return livegameVar(current).setGame;
    });
    var superSetGames = gameNumbers.map(function(current){
        return livegameVar(current).superSetGame;
    });
    setGames.forEach(function(game){
        sf.connectSocket(game, io, gameStartedTracker);
    });
    superSetGames.forEach(function(game){
        sf.connectSocket(game, io, gameStartedTracker);
    })
    getGamesOnly(gameNumbers);
}


function livegameVar(num){
    var setGame = io.of('/set' + String(num));
    var superSetGame = io.of('/superSet' + String(num));
    return {setGame: setGame, superSetGame: superSetGame};
}



function getGamesOnly(gameNumbers){
    gameNumbers.forEach(function(number){
        app.get('/set' + String(number), function(req, res){
            res.sendFile(__dirname + '/livegame.html');
        });
        app.get('/superSet' + String(number), function(req, res){
            res.sendFile(__dirname + '/livegame.html');
        })
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


//put all scripts on the dickin server
appGet('/oneplayer', '/oneplayer.html');
appGet('/helperFunctions.js', '/helperFunctions.js');
appGet('/noGlobalFunctions.js', '/noGlobalFunctions.js');
appGet('/home.js','/home.js');
appGet('/domFunctions.js', '/domFunctions.js');
appGet('/setgame.js', '/setgame.js');
appGet('/setgameNoClicks.js', '/setgameNoClicks.js');
appGet('/','/index.html');
appGet('/node_modules/socket.io/node_modules/socket.io-client/socket.io.js','/node_modules/socket.io/node_modules/socket.io-client/socket.io.js');
appGet('/utilities/jquery.js', '/utilities/jquery.js');
appGet('/livegame.js', '/livegame.js');

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





//redis stuff for later
// var redis = require('redis');

// var redisClient = redis.createClient();

// redisClient.set('bestTimes', 10000);
// redisClient.get('bestTime', function(err, reply){
//     console.log(reply);
// });

// function deleteAllKeys(client){

// }

// redisClient.zadd('nameOfSet', '400', 'bey', function(err, val){
//     console.log(err);
//     console.log(val);
// });

// redisClient.zadd('nameOfSet', '500', 'zoom', function(err, val){
//     console.log(err);
//     console.log(val);
// });
// var sortedSet = redisClient.zrange('nameOfSet', 0, -1, function(err, reply){
//     console.log(err);
//     console.log(reply);
// });
// console.log(sortedSet);

// var obj = {'a':4, 'b':5};

// console.log(obj);
// redisClient.lpush('foo', 'brett', '20', function(err, val){
//     console.log(val);
//     //list = val;
// });

// var myVar;

// var test2 = redisClient.lrange('foo', 0, 10, function(err, vals){
//     //console.log(err);
//     //list = val;
//     //console.log(val);
//     var test = vals;
//     myVar = vals;
//     console.log('logging var');
//     //console.log(myVar);
//     test.forEach(function(cur){
//         console.log(cur);
//     });
//     return vals;
//     //console.log(list);
// });


// console.log('hello');
// setTimeout(function(){
//     console.log(myVar);
// },2000);