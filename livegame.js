
//get game type and set intro text
$('#intro').text(gameType.slice(0, gameType.length - 1) + '!!!');

var SETBOARD;
var NICKNAME;
var TIME;

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
        NICKNAME = NICKNAME.split(' ').join('-');
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
            alert('game in progress, please go to home page to start or join a new game');
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


function dealFunctions(socket){
    socket.on('order of deck', function(data){
        //event that fires when start-game button is clicked.
        //server sends all clients the shuffled deck order
        var deck = data.deck.map(function(current){
            return new SetCard(current);
        });
        SETBOARD = new SetBoard(data.SETLENGTH, NICKNAME, deck, data.startTime, data.setsPerPlayer);
        SETBOARD.setupBoard();
        SETBOARD.firstDeal()
        SETBOARD.addClickListeners();
        TIME = timer();
    });
    socket.on('set-found', function(data){
        console.log('set found emitted back to page');
        //another player in thh game found a set
        var cards = data.cards;
        console.log(cards);
        var setsPerPlayerObj = data.setsPerPlayer;
        addSetsToCount(setsPerPlayerObj);
        SETBOARD.setsPerPlayer = setsPerPlayerObj;
        SETBOARD.takeAwayCards(cards);
        SETBOARD.checkAndDeal();
        SETBOARD.addClickListeners();
        addToSetsOnScreen(cards, data.player);
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

    socket.on('page refresh', function(){
        if ($('IMG').length > 0){ //game started already
            var deckCardNumbers = SETBOARD.orderedDeck.map(function(c){
                return c.cardNumber;
            });
            console.log(deckCardNumbers);
            var data = {setlength: SETBOARD.SETLENGTH, orderedDeckNumbers: deckCardNumbers, cardNumbers: SETBOARD.getCardNumbers(), startTime: SETBOARD.startTime};
            console.log('emitting board back to server');
            socket.emit('current-board', data);
            setTimeout(resetSetsPerPlayer, 1000);
        }
    });
    socket.on('game-in-progress', function(data){
        console.log('receiving data from server');
        console.log(data.orderedDeckNumbers);
        var orderedDeck = data.orderedDeckNumbers.map(function(c){
            return new SetCard(c);
        });
        SETBOARD = new SetBoard(data.setlength, NICKNAME, orderedDeck);
        SETBOARD.startTime = data.startTime;
        TIME = timer();
        //cards on the board right now
        var cardNumbers = data.cardNumbers;
        var cards = cardNumbers.map(function(num){
            return new SetCard(num);
        });
        SETBOARD.setupBoard();
        SETBOARD.dealNewCards(cards);
        SETBOARD.addClickListeners();
        //reset SETBOARD.setsPerPlayer;
        SETBOARD.setsPerPlayer = resetSetsPerPlayer();
    });
}

function addSetsToCount(setsPerPlayerObj){
    console.log(setsPerPlayerObj);
    forEachIn(setsPerPlayerObj, function(prop, val){
        var formattedProp = prop.split(' ').join('-');
        $('#' + formattedProp + '-count').text(String(val));
    });
}

function resetSetsPerPlayer(){
    var players = [];
    forEachIn($('#players')[0].childNodes, function(prop, val){
        if (prop != 'length'){
            players.push(val.id);
        }
    });
    SETBOARD.setsPerPlayer = {};
    var counts = players.forEach(function(player){
        SETBOARD.setsPerPlayer[player] = Number($('#player-count').text());
    });
    console.log(SETBOARD.setsPerPlayer);
}

function addToSetsOnScreen(cards, playerName){
    //cards is an object with just the cardNumber property
    var formattedName = playerName.split(' ').join('-');
    var newp = dom('P', null);
    var cardImgs = cards.map(function(current){
        var card = new SetCard(current.cardNumber);
        return card.domCard();
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

//for debugging
function getCardsOnBoard(){
    var ret = [];
    forEachIn($('IMG'), function(prop, val){
        ret.push(Number(val.id));
    });
    ret.splice(ret.length - 4, ret.length);
    return ret
}

