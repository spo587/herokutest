var CARDCOUNT = 0;


var setFound;
var findSet;


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


function removeElement(node) {
  if (node.parentNode)
    node.parentNode.removeChild(node);
}



function realign() {
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



