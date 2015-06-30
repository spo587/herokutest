//this script is sourced into the index.html file which is for the homepage of the site

//create socket for communicating with server
var socket = io('/');


//when the server sends a player join event
socket.on('player joined game', function(data){
    //console.log('event fired');
    //data is an object with two properties: gameStartedTracker and visitCounter

    //visitCounter is an object that keeps track of how many visitors are at each url
    // e.g. {superSet0 : 1, set1: 2}, etc.
    
    //gameStartedTracker is false and switches to true when someone presses the start game button
    //count the number of games currently being played?

    //both visitCounter and gameStartedTracker get initizlied in homeSocket.js when the request goes to the server
    //to load a new page

    //keep track of how many games are in play
    var gameCounter = 0;
    var visitCounter = data.visitCounter;
    var gameStartedTracker = data.gameStartedTracker;
    forEachIn(visitCounter, function(prop, val){
        gameCounter += visitCounter[prop] > 0 ? 1 : 0;
    });
    onJoinOrDeparture(data, gameCounter);

    //check this later, not sure why it was here
    // if (gameCounter > 0){
    //     ////console.log(visitCounter);
    //     changeLinkForNewGame(visitCounter, gameCounter, 'set');
    //     changeLinkForNewGame(visitCounter, gameCounter, 'superSet');
    // }
    
    //resetGameLinks(visitCounter);
    socket.on('player left game', function(data){
        onJoinOrDeparture(data, gameCounter);
    });
    socket.on('game no longer open', function(gameStartedTracker){
        //console.log('GAME JUST CLOSED');
        setLinksToWaitingGames(gameStartedTracker, visitCounter);
    }); 

});


function onJoinOrDeparture(data, gameCounter){
    setLinksToWaitingGames(data.gameStartedTracker, data.visitCounter);
    changeLinkForNewGame(data.visitCounter, gameCounter, 'set');
    changeLinkForNewGame(data.visitCounter, gameCounter, 'superSet');
}


function setLinksToWaitingGames(gameStartedTracker, visitCounter){
    $('#games-in-progress').html('');
    forEachIn(gameStartedTracker, function(prop, val){
        if (val === false && visitCounter[prop] > 0 && prop != 'besttimes.html'){ //someones in game, but it hasn't started
            var gameNumber = Number(prop[prop.length - 1]); //the number at the end of the url
            var route = '/' + prop; //the url
            var gameType = prop.slice(0, prop.length - 1); //set or superSet
            var newLink = dom('A', {gameNumber: gameNumber, href: route}, 'Click to join game ' + String(gameNumber) + ', ' + gameType + ', player(s) waiting!');
            $('#games-in-progress').append(newLink).append('<br>');
        }
    });
}

function changeLinkForNewGame(visitCounter, gameCounter, gameType){
    $('#start-game-' + gameType).html('');
    //debugger;
    var gameNumber = findLowestOpenGameNumber(visitCounter, gameCounter, gameType);
    var newLink = dom('A', {gameNumber: gameNumber, href: '/' + String(gameNumber)}, 'Click to start new ' + gameType + ' game');
    $('#start-game-' + gameType).append(newLink).append('<br>');
    
}

function findLowestOpenGameNumber(visitCounter, gameCounter, gameType){
    //console.log(visitCounter);
    // find the number for the lowest game
    //this function's fracked. gotta be an easier way
    var lowestOpenGame;
    forEachIn(visitCounter, function(prop, val){
        if (prop.slice(0,3) === gameType.slice(0,3)){ //check for matching game type
            if (visitCounter[prop] === 0){ //that game must be over or everyone left
                
                var gameNumber = Number(prop[prop.length - 1]);
                if (!lowestOpenGame){
                    //console.log('assigning lowestopengame not with min to next one');
                    lowestOpenGame = gameNumber; 
                }
                else {
                    //console.log('assigning with min');
                    lowestOpenGame = Math.min((gameNumber), lowestOpenGame);
                }
            }
        }
    });
    //if all games are in play, then just assign to the next number up
    if (lowestOpenGame === undefined){
        lowestOpenGame = gameCounter;
    }
    //append the gametype to the beginning, and make a string
    lowestOpenGame = gameType + lowestOpenGame;
    ////console.log(lowestOpenGame);
    return lowestOpenGame;
}



function forEachIn(object, func) {
    for (var property in object) {
        if (object.hasOwnProperty(property))
            func(property, object[property])
    }
}