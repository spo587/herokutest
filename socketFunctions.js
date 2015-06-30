
exports.connectSocket = function(socketVar, io, db, gameStartedTracker){
    var firstClick = false;
    var setsPerPlayer = {};
    var startTimes = [];
    var gameInProgress = false;
    //socketVar is the socket connection communicating between players in whatever page
    // the function is being called for
    socketVar.on('connection', function(socket){
        console.log('CONNECTION');
        //can i / should i split up this massive function ?
        socket.on('join', function(name){
            //console.log('game started??');
            //check if the game is already in progress
            console.log(gameStartedTracker);
            var route = socket.client.request.headers.referer;
            //console.log(route);
            var page = route.split('/')[route.split('/').length - 1];
            //console.log(page);

            if (gameStartedTracker[page] === true){
                console.log('page refreshed, emitting')
                socketVar.emit('page refresh');
            }
            socket.NICKNAME = name;
            console.log(name + 'joined the game');
            setsPerPlayer[name] = 0;
            socket.broadcast.emit('new player', name);
            //emit to the other players in the game
            socketVar.emit('allPlayers', setsPerPlayer);
            //and also to the homepage
            io.emit('allPlayers', setsPerPlayer);
        });
        socket.on('current-board', function(data){
            socket.broadcast.emit('game-in-progress', data);
        });
        socket.on('disconnect', function(){
            var departed = socket.NICKNAME;
            delete setsPerPlayer[socket.NICKNAME];
            console.log(setsPerPlayer);
            socket.broadcast.emit('player has departed', departed);
            //take that hater off the player's list     
            socket.broadcast.emit('allPlayers', setsPerPlayer);
        });
        socket.on('start game', function(SETLENGTH){
            var deck = setDeckShuffled();
            var startTime = new Date().getTime() + 1500;
            var data = {SETLENGTH: SETLENGTH, deck: deck, startTime: startTime, setsPerPlayer: setsPerPlayer};
            setTimeout(function(){
                socketVar.emit('order of deck', data);
                gameInProgress = true;
            }, 1500);
            //console.log(socketVar.name);
            //console.log(visitCounter);
            var gameName = socketVar.name.slice(1, socketVar.name.length);
            gameStartedTracker[gameName] = true;
            io.emit('game no longer open', gameStartedTracker);

        });
        socket.on('game over', function(data){
            gameInProgress = false;
            var t = data.t;
            var startTime = data.startTime;
            var winner = data.winner;
            if (startTime != startTimes[startTimes.length - 1]){
                console.log('ADDING TO DATABASE');
                var game = makeDatabaseEntry(setsPerPlayer, t, startTime, winner);
                db.insert(game);
                startTimes.push(startTime);
            }
            else {
                console.log('NOT ADDING TO DATABASE');
                startTimes = [];
            }
        });

        socket.on('chat message', function(data){
            socketVar.emit('chat message', data);
        });

        socket.on('hintcard called', function(){
            //send to other players
            socketVar.emit('show hintcard');
        });

        socket.on('set found', function(data){
            console.log('set found');
            var cards = data.cards;
            //add to sets object that's keeping track of all players sets
            setsPerPlayer[data.playerName] += 1;
            var transmit = {cards: cards, setsPerPlayer: setsPerPlayer, player: data.playerName};
            socketVar.emit('set-found', transmit);
            firstClick = false;
        });
        socket.on('firstCardClick', function(card){
            console.log('first click received');
            //one player clicked a card, therefore calling 'set!' send it off to the ohter players so
            //clicks by others won't be registered in the apporpriate time

            //but first, check if an earlier 'firstclick' event already came in sooner,
            //but hasnt yet been communicated to the client that fired this click
            if (firstClick === true){
                console.log('already received click');
                //emit something letting them know??
                return false;
            }
            firstClick = true;
            socket.broadcast.emit('turnClickListenersOff', card);
        });

        socket.on('secondCardClick', function(card){
            socket.broadcast.emit('secondCardClick', card);
        });
        socket.on('falsey', function(name){
            console.log('falsey');
            //set wasn't collected in time. penalty!
            setsPerPlayer[name] = setsPerPlayer[name] - 1;
            socketVar.emit('falsey', setsPerPlayer);
            socket.broadcast.emit('clickListenersBackOn');
            firstClick = false;
        });
        // socket.on('game data', function(data){
        //     console.log('game data socket line 106!!!')
        //     console.log(data);
        //     // if (data.t < bestTimeTwoPlayer){
        //     //     bestTimeTwoPlayer = data.t;
        //     //     bestPlayers = [data.player1, data.player2];
        //     // }
        // });
    });
}

function forEachIn(object, func) {
    for (var property in object) {
        if (object.hasOwnProperty(property))
            func(property, object[property]);
    }
}

function makeDatabaseEntry(setsPerPlayer, time, startTime, winner){
    var players = [];
    forEachIn(setsPerPlayer, function(prop, val){
        players.push(prop);
    });
    // var winner = findWinningPlayer(setsPerPlayer);
    return {players: players, time: Number(time), startTime: startTime, winner: winner};
}

// function findWinningPlayer(setsPerPlayer){
//     var max = 0;
//     var winner;
//     forEachIn(setsPerPlayer, function(prop, val){
//         if (val > max){
//             max = val;
//             winner = prop;
//         }
//     });
//     return winner;
// }

range = function(end) {
    var arr = [];
    for (var i=0; i<end; i++){
        arr.push(i);
    }
    return arr;
}

exports.range = range;

shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


setDeckShuffled = function(){
    //returns an array of numbers 1-81 shuffled which will correspond to set cards
    return shuffleArray(range(81));
}
