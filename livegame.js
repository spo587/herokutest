
//get game type and set intro text
$('#intro').text(gameType.slice(0, gameType.length - 1) + '!!!');

function getCardsOnBoard(){
    var ret = [];
    forEachIn($('IMG'), function(prop, val){
        ret.push(Number(val.id));
    });
    ret.splice(ret.length - 4, ret.length);
    return ret
}

function arraysSameElements(arr1, arr2){
    var answers = [];
    arr1.forEach(function(c){
        if (arr2.indexOf(c) != -1){ //arr2 also contains c
            answers.push(true);
        }
        else {
            answers.push(false);
            console.log(c);
        }
    });
    return answers.indexOf(false) === -1;
}

function findWinner(){
    var max = 0;
    var winner;
    forEachIn($('#players')[0].childNodes, function(prop, val){
        var player = val.id;
        var count = Number($('#' + player + '-count').text());
        if (count > max){
            winner = player;
            max = count;
        }
    });
    return winner;
}

//the name of the player playing
var NICKNAME;
//global for determining when to deal more cards.
var DEPLETEDBOARD = SETLENGTH === 4 ? 5 : 9;


//okay, now for the real stuff, setting up the socket that communicates with the server

function fullSetUp(socket){
    setUpPregame(socket);
    startGame(socket);
    chatForm(socket);
    cardClicks(socket);
    dealFunctions(socket);   
}

function setUpPregame(socket){
    socket.on('connect', function(data){
        NICKNAME = prompt("Your name, please", 'anonymous' + String(Math.round(1000*Math.random())));
        socket.emit('join', NICKNAME);

    });
    socket.on('allPlayers', function(setsPerPlayerObj){
        //an event that fires when a new player joins game. setsPerPlayerObj is an object that keeps
        //track not only of who's in the game but how many sets hesh has.
        //the event triggers two new lines, one to keep track of the number of sets for each player
        // and one that will list out the sets (like the actual cards for each player)
        $('#players').text('');
        $('#sets').text('');
        forEachIn(setsPerPlayerObj, function(prop, val){
            var formattedProp = prop.split(' ').join('-');
            var newp = dom('P', {id: formattedProp }, prop + '\'s set count: ');
            var span = dom('SPAN', {id: formattedProp + '-count'}, String(val));
            newp.appendChild(span);
            $('#players').append(newp);
            var dummy = dom('P', null, prop + '\'s sets: ');
            var setp = dom('P', {id: formattedProp + '-sets'});
            $('#sets').append(dummy).append(setp);

        });
        var numPlayers = Object.size(setsPerPlayerObj);
        $('#numclients').text(String(numPlayers));
    });
    socket.on('disconnect', function(numPlayers){
        //var current = $('#numclients').text();
        $('#numclients').text(String(numPlayers));
    });
    // socket.on('player has departed', function(name){
    //     alert(name + ' left :(');    
    // });
}


function startGame(socket){
    $('#start-game').click(function(){
        //new code! don't let that button break the whole dickin site
        if ($('IMG').length > 0){
            alert('game in progress, please go to home page or refresh to start a new game');
        }
        else {
            socket.emit('start game', SETLENGTH); //$('#paragraph').html());
        }
    });
    //for the end
    socket.on('game over', function(data){
        console.log('game over socket emitted back to page');
        var t = data.t; //game time
        var setsPerPlayerObj = data.setsPerPlayer;
        var max = 0;
        var winner;
        forEachIn(setsPerPlayerObj, function(prop, val){
            if (val > max){
                winner = prop;
                max = val;
            }
        });
        if (gameNotAlreadyEnded = true){
            alert('game over! ' + winner + ' won! ' + 'game time : ' + String(t) + ' seconds ');
            gameNotAlreadyEnded = false;
        }
    });
}


function chatForm(socket){

    $('form').submit(function(){
        var data = {playerName: NICKNAME, msg: $('#m').val()}
        socket.emit('chat message', data);
        $('#m').val('');
        return false;
      });

    socket.on('chat message', function(data){
        //console.log('incoming message');
        $('#messages').append($('<li>').text(data.playerName + ':  ' + data.msg));
    });
}

var oppFindSet;

//function deals with receiving click event from other players
function cardClicks(socket){
    socket.on('turnClickListenersOff', function(card){
        if (SETBOARD.clicked.length > 0){
            console.log('server received click from other player first?');
            SETBOARD.endTimeout();
            SETBOARD.allBordersBlack();
            SETBOARD.clicked = [];
        }
        console.log(card);
        card.changeBorderStyle();
        //dont allow clicks in meantime
        SETBOARD.clickListenersOff();
    });
    socket.on('secondCardClick', function(card){
        card.changeBorderStyle();
    });
}


var startTime;
var SETBOARD;

function dealFunctions(socket){
    socket.on('order of deck', function(data){
        //event that fires when start-game button is clicked.
        //server sends all clients the shuffled deck order
        var deck = data.deck.map(function(current){
            return new SetCard(current);
        });
        SETLENGTH = data.SETLENGTH;
        var type = SETLENGTH === 4 ? 'superSet' : 'set';
        SETBOARD = new SetBoard(SETLENGTH, NICKNAME, deck);
        SETBOARD.setupBoard();
        SETBOARD.firstDeal()
        SETBOARD.addClickListeners();
        startTime = data.startTime;
        timer();
    });
    socket.on('set-found', function(data){
        console.log('set found emitted back to page');
        //another player in thh game found a set
        var cards = data.cards;
        console.log(cards);
        var setsPerPlayerObj = data.setsPerPlayer;
        addSetsToCount(setsPerPlayerObj);
        SETBOARD.takeAwayCards(cards);
        SETBOARD.checkAndDeal();
        SETBOARD.addClickListeners();
        //addToSetsOnScreen(cards, data.player);
    });
    socket.on('falsey', function(setsPerPlayer){
        addSetsToCount(setsPerPlayer);
    });
    socket.on('show hintcard', function(){
        displayHint();
    });
    socket.on('clickListenersBackOn', function(){
        SETBOARD.allBordersSolid();
        SETBOARD.addClickListeners();
    });
}

function addSetsToCount(setsPerPlayerObj){
    console.log(setsPerPlayerObj);
    forEachIn(setsPerPlayerObj, function(prop, val){
        var formattedProp = prop.split(' ').join('-');
        $('#' + formattedProp + '-count').text(String(val));
    });
}

function addToSetsOnScreen(cards, playerName){
    var formattedName = playerName.split(' ').join('-');
    var newp = dom('P', null);
    var cardImgs = cards.map(function(current){
        return domCard(current);
    });
    var id = formattedName + '-sets';
    $('#' + id).prepend(newp);
    cardImgs.forEach(function(cardImg){
        newp.appendChild(cardImg);
    });
}

//create socket for the current url
var socket = io('/' + document.URL.split('/')[document.URL.split('/').length - 1]);
//get er done
fullSetUp(socket);

