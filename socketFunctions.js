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



function cutOffFirst(str){
    return str.split('').splice(1, str.split('').length).join('');
}
//shuffleArray(allCards)

setDeckShuffled = function(){
    //returns an array of numbers 1-81 shuffled which will correspond to set cards
    return shuffleArray(range(81));
}

exports.connectSocket = function(socketVar, io, gameStartedTracker){
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
            //setsPerPlayer[name] = 0;
            // if (!players[socketVar.name]){
            //     players[socketVar.name] = [];
            //     players[socketVar.name].push(name);
            // }
            // else {
            //     players[socketVar.name].push(name);
            // }
            // io.emit('new player', players )
            //socketVar.numPlayers += 1;
            //socketVar.emit('new connection', socketVar.numPlayers);

        });

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

        });
        socket.on('game over', function(t){
            socket.emit('game over', {setsPerPlayer: setsPerPlayer, t: t});
            
        });

        socket.on('chat message', function(data){
            socketVar.emit('chat message', data);
            //console.log(msg);
        });
        socket.on('start game', function(){
            var deck = setDeckShuffled();
            socketVar.emit('order of deck', deck);
            //console.log(socketVar.name);
            //console.log(visitCounter);
            var gameName = cutOffFirst(socketVar.name);
            gameStartedTracker[gameName] = true;
            io.emit('game no longer open', gameStartedTracker);

        });
        socket.on('hintcard called', function(){
            socketVar.emit('show hintcard');
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
        socket.on('secondCardClick', function(data){
            var card = data.card;
            var clicked = data.clicked;
            socket.broadcast.emit('secondCardClick', card);
        });
        socket.on('clickBanExpiring', function(){
            console.log('click ban expiring, resetting first click');
            firstClick = false;
            console.log(firstClick);
        });
        socket.on('falsey', function(name){
            setsPerPlayer[name] = setsPerPlayer[name] - 1;
            socketVar.emit('adjustSets', setsPerPlayer);
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