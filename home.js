var socket = io('/');

socket.on('player joined game', function(data){
    //console.log(data);
    var gameCounter = 0;
    var visitCounter = data.visitCounter;
    var gameStartedTracker = data.gameStartedTracker;
    forEachIn(visitCounter, function(prop, val){
        gameCounter += visitCounter[prop] > 0 ? 1 : 0;
    });
    setLinksToWaitingGames(gameStartedTracker, visitCounter);
    if (gameCounter > 0){
        //console.log(visitCounter);
        changeLinkForNewGame(visitCounter, gameCounter);
    }
    
    //resetGameLinks(visitCounter);
    socket.on('player left game', function(data){
        var gameStartedTracker = data.gameStartedTracker;
        var visitCounter = data.visitCounter;
        setLinksToWaitingGames(gameStartedTracker, visitCounter);
        changeLinkForNewGame(visitCounter, gameCounter);
    });
    socket.on('game no longer open', function(gameStartedTracker){
        //console.log('start game event fired on server');
        //console.log(gameStartedTracker);
        setLinksToWaitingGames(gameStartedTracker);
    });    
});


function setLinksToWaitingGames(gameStartedTracker, visitCounter){
    //console.log(visitCounter);
    //console.log(gameStartedTracker);
    $('#games-in-progress').html('');
    forEachIn(gameStartedTracker, function(prop, val){
        if (val === false && visitCounter[prop] > 0){
            var id = Number(prop[prop.length - 1]);
            var route = '/' + prop;
            var numPlayers = visitCounter[prop];
            var newLink = dom('A', {id: id, href: route}, 'click to join game ' + String(id) + ', ' + String(numPlayers) + ' player(s) waiting!');
            $('#games-in-progress').append(newLink).append('<br>');
        }
    });
}

function findLowestOpenGameNumber(visitCounter, gameCounter){
    //some bug in this function, doesn't go to the min call somehow
    var lowestOpenGame;
    console.log(lowestOpenGame);
    forEachIn(visitCounter, function(prop, val){
        if (visitCounter[prop] === 0){
            //console.log(visitCounter);
            if (!lowestOpenGame){
                console.log('assigning lowestopengame not with min to next one');
                lowestOpenGame = Number(prop[prop.length - 1]);
            }
            else {
                console.log('assigning with min');
                lowestOpenGame = Math.min(Number(prop[prop.length - 1]), lowestOpenGame);
            }
            //console.log(lowestOpenGame);
        }
    });
    if (lowestOpenGame === undefined){
        lowestOpenGame = gameCounter;
    }
    //console.log(lowestOpenGame);
    return lowestOpenGame;
}

function changeLinkForNewGame(visitCounter, gameCounter){
    //console.log(visitCounter);
    //fix this!!!
    $('#start-game').html('');
    //debugger;
    var id = findLowestOpenGameNumber(visitCounter, gameCounter);
    var newLink = dom('A', {id: id, href: '/livegame' + String(id)}, 'click to start new game');
    $('#start-game').append(newLink).append('<br>');
    
}

function forEachIn(object, func) {
    for (var property in object) {
        if (object.hasOwnProperty(property))
            func(property, object[property])
    }
}