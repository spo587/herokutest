var CARDCOUNT = 0;


function firstDeal(cards, SETLENGTH){
    CARDCOUNT += cards.length;
    dealCards(cards, 3, 12 / SETLENGTH);
    checkDeadboardAndDeal();
}

function dealCards(cards, height, width){
    console.log(width);
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
            
            var randNum = cards.shift();
            var card = domCard(randNum);
            newp.appendChild(card);
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


function endGame() {
    console.log('endgame function called');
    if (CARDCOUNT === 81 && !isthereanyset(SETLENGTH)){
        var t = $('#time').text();
        socket.emit('game over', t);
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

