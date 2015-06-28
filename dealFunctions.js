var CARDCOUNT = 0;


function SetBoard(SETLENGTH){
    this.cards = [];
    this.div = $('#div1');
    this.SETLENGTH = SETLENGTH;
    this.depletedBoard = SETLENGTH === 4 ? 5 : 9;
    this.height = 3;
    this.clicked = [];
    this.setFound = null;
    this.findSet = null;
    this.addCards = function(cards){
        this.cards = this.cards.concat(cards);
    }
    this.removeCards = function(cards){
        var setBoardObj = this;
        cards.forEach(function(card){
            var ind = setBoardObj.cards.indexOf(card);
            setBoardObj.cards.splice(ind, 1);
        });
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
        var len = cards.length;
        // if (CARDCOUNT === 81){
        //     endGame();
        //     return false;
        // }
        for (var i = 0; i < len; i++) {
            //console.log(cards);
            var card = cards.shift();
            this.dealOne(card);

        }
    }
    this.dealOne = function(card){
        var dc = card.domCard();
        var shortestRow = this.getShortestRow();
        shortestRow.appendChild(dc);
        this.addCards([card]);
    }
    this.takeAwayCards = function(cards){

        var setBoardObj = this;
        cards.forEach(function(card){
            setBoardObj.takeAwayCard(card);
        });
        this.realign();
        this.realign();
    }
    this.takeAwayCard = function(card){
        var domElem = card.getDomElement()[0];
        takeAway(domElem);
        this.removeCards([card]);
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
        var setBoardObj = this;
        cards.forEach(function(card){
            setBoardObj.addClickListener(card);
        });
    }
    this.addToClicked = function(card){
        if (this.clicked.indexOf(card) === -1){
            this.clicked.push(card);
        }
    }
    this.addClickListener = function(card){
        var dc = card.getDomElement();
        var setBoardObj = this;
        dc.bind('click', function(click){
            if (setBoardObj.clicked.length === 0){
                setBoardObj.setFound = false;
                socket.emit('firstCardClick', {card: card, clicked: setBoardObj.clicked}); //have to change socket event

                setBoardObj.findSet = setTimeout(function(){
                    console.log('returning');
                    console.log(setBoardObj.setFound);
                    setBoardObj.allBordersBlack();
                    setBoardObj.clicked = [];
                    return setBoardObj.setFound === true},
                700 * SETLENGTH);
            }
            if (setBoardObj.clicked.length === 1){
                socket.emit('secondCardClick', {card: card, clicked: setBoardObj.clicked});
            }
            setBoardObj.addToClicked(card);
            card.changeBorderColor('red');
            //click.target.style.borderColor = chooseNewBorderColor(click.target.style.borderColor);
            
            if (setBoardObj.clicked.length === setBoardObj.SETLENGTH){
                //allBordersBlack
                setBoardObj.checkClicks(setBoardObj.clicked);
                setBoardObj.allBordersBlack();
                setBoardObj.clicked = [];
            }
        });
    }
    this.checkClicks = function(arr){
        if (isset(arr)){
            console.log('set found');
            this.setFound = true;
            var setBoardObj = this;
            clearTimeout(setBoardObj.findSet);
        }
        else {
            console.log('not a set');
            this.setFound = false;
        }
    }
    this.allBordersBlack = function(){
        this.cards.forEach(function(card){
            card.changeBorderColor('black');
        });
    }
    this.setFoundOrNot = function(){

        console.log('returning!');
        console.log(setBoardObj.setFound);
        setBoardObj.allBordersBlack();
        setBoardObj.clicked = [];
        return this.setFound === true;
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
                console.log(cardBoardIndices);
                return cards;
            }

        }
        return false;
    }
    this.getCardsFromIndices = function(indices){
        var cards = [];
        return indices.map(function(ind){})
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















function firstDeal(cards, SETLENGTH){
    CARDCOUNT += cards.length;
    dealCards(cards, 3, 12 / SETLENGTH);
    checkDeadboardAndDeal();
}

function dealCards(cards, height, width){
    //console.log(width);
    if (height*width !== cards.length){
        console.log(height*width);
        console.log(cards.length);
        throw('cards called dont match length of board')
    }
    for (var j=0; j<height; j++) {
        newp = dom('P',null);
        var firstDiv = $('#div1');
        firstDiv.append(newp);
        for (var i=0; i<width; i++) {
            
            var card = cards.shift();
            //var card = domCard(randNum);
            newp.appendChild(card.domCard());
        }
    }
    clickListenersOff()
    addEventListeners(cardnumarray_numbers(), SETLENGTH);
}


function dealMore(cards) {
    var len = cards.length;
    if (CARDCOUNT === 81){
        endGame();
        return false;
    }
    for (var i = 0; i < len; i++) {
        //console.log(cards);
        var card = cards.shift();
        dealOne(card);
    }
    clickListenersOff();
    addEventListeners(cardnumarray_numbers(), SETLENGTH);
    //realign();
    //realign();
    CARDCOUNT += 3;
    checkDeadboardAndDeal();  
}



function dealOne(card){
    var cardDom = domCard(card);
    var firstDiv = $('#div1')[0];
    var rowLengths = getRowLengths(firstDiv);
    
    var shortestRow;
    var shortestLength = 100;
    forEachIn(rowLengths, function(row, length){
        if (length < shortestLength){
            shortestRow = row;
            shortestLength = length;
        }
    });
    firstDiv.childNodes[shortestRow].appendChild(cardDom);
}

    
function getRowLengths(div){
    var firstRow = div.childNodes[0].childNodes.length;
    var secondRow = div.childNodes[1].childNodes.length;
    var thirdRow = div.childNodes[2].childNodes.length;
    return {0: firstRow, 1: secondRow, 2: thirdRow};
}



function removeElement(node) {
  if (node.parentNode)
    node.parentNode.removeChild(node);
}


function realign() {
    //this is ugly i can rewrite this much prettier on the to-do list
    //should be easy with the getRowLengths function, above
    //but for now, it works
    var firstDiv = $('#div1')[0];
    var lines = firstDiv.getElementsByTagName('P');
    var arr = [];
    forEach(lines,function(a){arr.push(a.childNodes.length)});
    var longLine = arr.indexOf(Math.max(arr[0],arr[1],arr[2]));
    var shortLine = arr.indexOf(Math.min(arr[0],arr[1],arr[2]));
    if (longLine != shortLine) {
        var cardToMove = lines[longLine].lastChild;
        lines[shortLine].appendChild(cardToMove);
    }


}

function findAndRemoveCard(cardnum){
    var str = '#' + String(cardnum);
    var elem = $(str)[0];
    takeAway(elem);
}

function takeAway(elem){
    var par = elem.parentNode;
    par.removeChild(elem);
}

function removeDeal(cards) {
    console.log('remove deal function called');
    console.log(cards);
    for (var i = 0; i < cards.length; i += 1){
        findAndRemoveCard(cards[i]);
        var cardSetForm = convertCard(cards[i]);
        clicked.forEach(function(current){
            var ind = clicked.indexOf(current);
            if (equalArray(current, cardSetForm)){
                console.log('removing from clicked');
                clicked.splice(ind, 1);
                console.log(clicked);
            }
        });
    }
    realign();
    realign();
    if (cardnumarray_numbers().length >= 12){
        console.log('12 or more cards on board');
        checkDeadboardAndDeal();
    }
}



