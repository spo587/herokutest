
exports.connectSocket = function(socketVar, io, gameStartedTracker){
    var firstClick = false;
    var setsPerPlayer = {};
    //socketVar is the socket connection communicating between players in whatever page
    // the function is being called for
    socketVar.on('connection', function(socket){
        //can i / should i split up this massive function ?
        socket.on('join', function(name){
            socket.NICKNAME = name;
            console.log(name + 'joined the game');
            setsPerPlayer[name] = 0;
            socket.broadcast.emit('new player', name);
            //emit to the other players in the game
            socketVar.emit('allPlayers', setsPerPlayer);
            //and also to the homepage
            io.emit('allPlayers', setsPerPlayer);
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
            var data = {SETLENGTH: SETLENGTH, deck: deck}
            socketVar.emit('order of deck', data);
            //console.log(socketVar.name);
            //console.log(visitCounter);
            var gameName = socketVar.name.slice(1, socketVar.name.length);
            gameStartedTracker[gameName] = true;
            io.emit('game no longer open', gameStartedTracker);

        });

        socket.on('game over', function(t){
            socket.emit('game over', {setsPerPlayer: setsPerPlayer, t: t});         
        });

        socket.on('chat message', function(data){
            socketVar.emit('chat message', data);
        });

        socket.on('hintcard called', function(){
            //send to other players
            socketVar.emit('show hintcard');
        });

        socket.on('set found', function(data){

            var cards = data.cards;
            //add to sets object that's keeping track of all players sets
            setsPerPlayer[data.playerName] += 1;
            //send it along
            var transmit = {cards: cards, setsPerPlayer: setsPerPlayer, player: data.playerName};
            socketVar.emit('set found', transmit);
            //deal more cards, if board is 'depleted'
            socketVar.emit('dealing more');
        });
        //old version
        // socket.on('cardClick', function(id){
        //     socket.broadcast.emit('cardClick', id);
        // });

        socket.on('firstCardClick', function(data){
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
            socket.broadcast.emit('noClicksUntil', data);
        });

        socket.on('secondCardClick', function(data){
            var card = data.card;
            var clicked = data.clicked;
            socket.broadcast.emit('secondCardClick', card);
        });

        socket.on('clickBanExpiring', function(){
            //time to find the set is up
            console.log('click ban expiring, resetting first click');
            firstClick = false;
        });

        socket.on('falsey', function(name){
            //set wasn't collected in time. penalty!
            setsPerPlayer[name] = setsPerPlayer[name] - 1;
            socketVar.emit('false set call', setsPerPlayer);
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
