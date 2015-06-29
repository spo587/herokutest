var express = require('express');
var app = express();
var sf = require('./socketFunctions');
// var af = require('./arrayFunctions');
// var set = require('./set');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var hs = require('./homeSocket');
var bt = require('./bestTimesSocket');
var Datastore = require('nedb'), db = {}; //new Datastore({filename: 'test2', autoload: true});

//db.users = new Datastore({filename: 'data/users.db'});
db.gameTimes = new Datastore({filename: 'data/gameTimes.db', autoload: true});
//db.users.loadDatabase();

db.gameTimes.loadDatabase();

function removeDuplicatesFromGamesDB(db){
    db.find({}, function(e, docs){
         //gives us an array
         var idsToRemove = [];
         for (var i=0; i < docs.length - 1; i++){
            if (docs[i].startTime === docs[i + 1].startTime){
                idsToRemove.push(docs[i + 1]._id);
            }

         }
        idsToRemove.forEach(function(id){
            db.remove({_id: id}, {}, function(e, numRemoved){

            });
        });
    });
    
}


var bt = io.of('/besttimes.html');
bt.on('connection', function(socket){
    console.log('user queried besttimes.html');
    removeDuplicatesFromGamesDB(db.gameTimes);
    db.gameTimes.find({}).sort({time: 1}).limit(10).exec(function(e, docs){
        console.log(docs);
        socket.emit('games', docs);
    });
});



var visitCounter = {};
var gameStartedTracker = {};
hs.connectHomeSocket(io, visitCounter, gameStartedTracker);

function setUpGames(number){
    var gameNumbers = sf.range(number); //create array of game numbers
    var setGames = gameNumbers.map(function(current){
        return livegameVar(current).setGame;
    });
    var superSetGames = gameNumbers.map(function(current){
        return livegameVar(current).superSetGame;
    });
    setGames.forEach(function(game){
        sf.connectSocket(game, io, db.gameTimes, gameStartedTracker);
    });
    superSetGames.forEach(function(game){
        sf.connectSocket(game, io, db.gameTimes, gameStartedTracker);
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


function appGet(urlPath, fileExtension){
    app.get(urlPath, function(req, res){
        // res.header("Access-Control-Allow-Origin", "*");
        // res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // res.header("Access-Control-Allow-Headers", "Content-Type");
        // res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        res.sendFile(__dirname + fileExtension);
    });
}

//put all scripts on the dickin server
var clientScripts = ['/helperFunctions.js', '/dealFunctions.js', '/setCardObject.js','/setLogicFunctions.js', '/computerPlay.js'];
var pages = ['/home.js','/node_modules/socket.io/node_modules/socket.io-client/socket.io.js',
    '/utilities/jquery.js','/livegame.js', '/data/gameTimes.db', '/besttimes.html'];

pages.forEach(function(page){
    appGet(page, page);
});

clientScripts.forEach(function(page){
    appGet('/clientScripts' + page, '/clientScripts' + page);
});

appGet('/','/index.html');

for (var i=0; i < 81; i += 1){
    appGet('/cards/' + String(i) + '.JPG', '/cards/' + String(i) + '.JPG');
}

var port = process.env.PORT || 8080;

server.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

function forEachIn(object, func) {
    for (var property in object) {
        if (object.hasOwnProperty(property))
            func(property, object[property]);
    }
}




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