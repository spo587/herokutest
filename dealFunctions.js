var CARDCOUNT = 0;


function SetBoard(SETLENGTH, NICKNAME, orderedDeck){
    this.orderedDeck = orderedDeck;
    this.cards = [];
    this.div = $('#div1');
    this.SETLENGTH = SETLENGTH;
    this.depletedBoard = SETLENGTH === 4 ? 5 : 9;
    this.height = 3;
    this.clicked = [];
    this.setFound = null;
    this.findSet = null;
    this.playerName = NICKNAME;
    this.getCardNumbers = function(){
        return this.cards.map(function(c){
            return c.cardNumber;
        });
    }
    this.checkClickListeners = function(){
        this.cards.forEach(function(c){console.log(c.clickListenerOn)});
    }
    this.firstDeal = function(){
        this.dealNewCards(this.getFirstCards());
    }
    this.getFirstCards = function(){
        return this.orderedDeck.splice(0, 36 / this.SETLENGTH);
    }
    this.addCards = function(cards){
        this.cards = this.cards.concat(cards);
    }
    this.setupBoard = function(){
        for (var j=0; j < this.height; j++) {
            newp = dom('P', {id: j+100}); //careful with this id hack!!!
            this.div.append(newp);
        }
    }
    this.getRowLengths = function(){
        var height = this.height;
        var lengths = [];
        for (var i=0; i < height; i++){
            lengths.push(this.div[0].childNodes[i].childNodes.length);
        }
        return lengths;
    }

    this.getShortestRow = function(){
        var lengths = this.getRowLengths();
        var rowInd = lengths.indexOf(Math.min.apply(Math, lengths));
        return this.div[0].childNodes[rowInd];
    }
    this.getLongestRow = function(){
        var lengths = this.getRowLengths();
        var rowInd = lengths.indexOf(Math.max.apply(Math, lengths));
        return this.div[0].childNodes[rowInd]
    }
    this.dealNewCards = function(cards){
        var setBoardObj = this;
        cards.forEach(function(card){
            setBoardObj.dealOne(card);
        });
    }
    this.dealOne = function(card){
        card.addSetBoard(this);
        var dc = card.domCard();
        var shortestRow = this.getShortestRow();
        shortestRow.appendChild(dc);
        this.addCards([card]);
    }
    this.takeAwayCards = function(cards){
        var setBoardObj = this;
        cards.forEach(function(card){
            setBoardObj.removeDomElem(card);
            setBoardObj.removeFromList(card);
        });
        this.realign();
        this.realign();
    }
    this.removeFromList = function(card){
        var numbers = this.cards.map(function(card){
            return card.cardNumber;
        });
        var index = numbers.indexOf(card.cardNumber);
        this.cards.splice(index, 1);

    }
    this.removeDomElem = function(card){
        //find card with that cardNumber FIRST
        var domElem = card.getDomElement(card.cardNumber)[0];
        takeAway(domElem);
    }
    this.realign = function(){
        var shortestRow = this.getShortestRow();
        var longestRow = this.getLongestRow();
        var toMove = longestRow.childNodes[longestRow.childNodes.length - 1];
        takeAway(toMove);
        shortestRow.appendChild(toMove); 
    } 

    this.addClickListeners = function(){
        var cards = this.cards;
        //var setBoardObj = this;
        cards.forEach(function(card){
            card.addClickListener();
            //setBoardObj.addClickListener(card);
        });
    }
    this.registerClick = function(card){
        if (this.clicked.indexOf(card) === -1){
            this.addToClicked(card);
        }
        if (this.clicked.length === 1){
            //socket.emit('firstCardClick', this.playerName)
            this.setFound = false;
            socket.emit('firstCardClick', {cardNumber: card.cardNumber}); //have to change socket event
            var setBoardObj = this;
            setBoardObj.findSet = setTimeout(function(){
                console.log('returning');
                console.log(setBoardObj.setFound);
                setBoardObj.allBordersBlack();
                setBoardObj.clicked = [];
                socket.emit('falsey', setBoardObj.playerName);
                return setBoardObj.setFound === true;
            }, 700 * setBoardObj.SETLENGTH);
        }
        else if (this.clicked.length === 2){
            console.log('second card clicked');
            socket.emit('secondCardClick', {cardNumber: card.cardNumber});
        }
        else if (this.clicked.length === this.SETLENGTH){
            this.checkClicks(this.clicked);
            this.allBordersBlack();
            this.clicked = [];
        }
    }
    this.addToClicked = function(card){
        this.clicked.push(card);
        card.changeBorderColor('red');
    }

    this.endTimeout = function(){
        var setBoardObj = this;
        clearTimeout(setBoardObj.findSet);
    }

    this.checkClicks = function(arr){
        var setBoardObj = this;
        if (isSetEitherType(arr)){
            console.log('set found');
            this.setFound = true;
            // doesnt work to transmit the cards for some reason? transmitting instead just their numbers
            var cards = arr.map(function(c){
                console.log(c.cardNumber);
                return {cardNumber: c.cardNumber};
            });
            socket.emit('set found', {cards: cards, playerName: this.playerName});
            clearTimeout(setBoardObj.findSet);    
        }
        else {
            this.setFound = false;
            socket.emit('falsey', this.playerName);
            clearTimeout(setBoardObj.findSet);
        }
    }
    this.allBordersBlack = function(){
        this.cards.forEach(function(card){
            card.changeBorderColor('black');
        });
    }

    this.allBordersSolid = function(){
        this.cards.forEach(function(card){
            card.setBorderStyle('solid');
        });
    }

    // this.allBorders = function(callback, arg){
    //     this.cards.forEach(function(card){
    //         card.callback(arg);
    //     });
    // }
    this.clickListenersOff = function(){
        var setBoardObj = this;
        setBoardObj.cards.forEach(function(card){
            card.clickListenerOff();
        });
    }

    this.isThereASet = function(){
        var numCards = this.cards.length;
        var SETLENGTH = this.SETLENGTH;
        var all_indices = makeIterator(makeSubsets(range(numCards), SETLENGTH));
        var len = factorial(numCards) / (factorial(numCards - SETLENGTH) * factorial(SETLENGTH)) 
        var setBoardObj = this;
        for (var i = 0; i < len; i += 1){
            var cardBoardIndices = all_indices.next().value;
            var cards = cardBoardIndices.map(function(index){
                return setBoardObj.cards[index];
            });
            if (isset(cards)){
                cards.forEach(function(card){
                    console.log(card.cardNumber);
                });
                return cards;
            }

        }
        return false;
    }

    this.getCardsFromIndices = function(indices){
        var cards = [];
        return indices.map(function(ind){})
    }

    this.shuffleBoard = function(){

    }
    this.checkAndDeal = function(){
        var toDeal = this.orderedDeck.splice(0, this.SETLENGTH);
        if (this.cards.length <= this.depletedBoard){
            this.dealNewCards(toDeal);
        }
        else if (this.checkDeadBoard()){
            this.dealNewCards(toDeal);
        }
    }

}

//test

function test(){
var s = new SetBoard(3);

var deck = shuffleArray(range(81));

var deck = deck.map(function(c){return new SetCard(c)});

var firstCards = deck.splice(0,12);
s.setupBoard();
s.dealNewCards(firstCards);
s.addClickListeners()
}




function endGame() {
    console.log('endgame function called');
    if (CARDCOUNT === 81 && !isthereanyset(SETLENGTH)){
        var t = $('#time').text();
        var data = {t:t, startTime: startTime};
        var winner = findWinner();
        if (gameNotAlreadyEnded){
            socket.emit('game over', data);
            console.log('game over emitted to server');
            gameNotAlreadyEnded = false;
            alert('game over! ' + winner + ' won! ' + 'game time : ' + String(t) + ' seconds ');
        }
    }
        
}


var setsFound = 0;
var numHints = 0;


function displayHint() {
    //for hint function
    
    if (!isthereanyset(SETLENGTH)){
        console.log('error!!! no set detected but board didnt auto-deal more cards');
    }
    else {
        var hintCardNum = isthereanyset(SETLENGTH)[0]; //choose first card, doesn't matter which
        var hintCard = domCard(hintCardNum);
        var secondDiv = $('#hint-card-position')[0];
        if (secondDiv.children.length > 0){
            takeAway(secondDiv.children[0]);
        }
        secondDiv.appendChild(hintCard);
            //alert('you fool, it\'s not a deadboard! here\'s your hint!');
        //$('numHints').innerHTML = 'Number of hints used: ' + numHints;           
    }

}

function takeAway(elem){
    var par = elem.parentNode;
    par.removeChild(elem);
}

function timer() {
    var t = new Date().getTime();
    var myVar = setInterval(function(){
        var toShow = String(Math.floor((new Date().getTime() - t)/1000));
        $('#time').text(toShow);
    }, 1000);
    return Math.floor((new Date().getTime() - t)/1000);
}



