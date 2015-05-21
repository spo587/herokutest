function dealCards(cards, height, width){
    if (height*width !== cards.length){
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
            //console.log(card.id)
        
        }

    }
    clickListenersOff()
    addEventListeners();
}

function checkDeadboardAndDeal() {
    console.log('heres the board input to deadboard');
    console.log(cardnumarray_numbers());
    if (!isthereanyset()){
        endGame();
        console.log('deadboard');
        //checkDeadboardAndDeal()
        dealThree(deck.splice(0,3));
        //socket.emit('dealt three more');
        //socket.emit('deadboard');
    }

}


function cardnumarray_numbers() {
    //same as above but trying to use actual numbers, not strings
    var div = $('#div1')[0];
    var elements = div.getElementsByTagName('IMG');
    var cardnums = [];
    for (var i=0; i<elements.length; i++){
        cardnums.push(Number(elements[i].id));
    }
    return cardnums;

}

function three_cards_a_set(three_indices) {
    //three_indices is an array of BOARD indices
    var cards = cardnumarray_numbers();
    var testarr = [];
    for (var i = 0; i<3; i++){
        testarr.push(convertCard(cards[three_indices[i]]));
    }
    return isset(testarr);
}


function generate_all_three_card_indices(numCardsOnBoard){
    //var cards = cardnumarray_numbers();
    //var num = cards.length;
    var all_indices = [];
        for (var i = 0; i < numCardsOnBoard - 2; i++) {
            for (var j = i+1; j< numCardsOnBoard - 1; j++){
                for (var k=j+1; k < numCardsOnBoard; k++) {
                    all_indices.push([i,j,k]);
                }
            }
        }
    return all_indices;
}



function changeBorderStyle(card){
    var cardDom = getDomElement(card);
    cardDom.style.borderStyle === 'dotted' ? cardDom.style.borderStyle = 'solid' : cardDom.style.borderStyle = 'dotted';
}

function changeBorderColor(card){//, color1, color2){
    var cardDom = getDomElement(card);
    cardDom.style.borderColor = 'red'; //== color1 ? (cardDom.style.borderColor = color2) : (cardDom.style.borderColor = color1);
    
}



function allBordersBlack(){
    var imgs = $('IMG');
        forEach(imgs, function(img){
            img.style.borderColor = 'black';
        });

}


function clickListenersOff(){
    var cards = cardnumarray_numbers();
    cards.forEach(function(card){
        clickListenerOff(card);
    });
}

function clickListenerOff(card){
    //console.log(card);
    var cardDom = $('#' + String(card));
    //console.log(cardDom);
    cardDom.unbind('click');
}

function addEventListeners(cards) {
    //console.log(clicked);

    if (cards === undefined){ 
        var cards = cardnumarray_numbers();
    }

    else {
        //console.log(cards);
    }
    //console.log(cards);
    cards.forEach(function(current, index, array){
        clickListener(current);
    });
}


function addToSetsOnScreen(cards, playerName){
    console.log(playerName);
    var newp = dom('P', null);
    var cardImgs = cards.map(function(current){
        return domCard(current);
    });
    var id = playerName + '-sets';
    console.log(id);
    $('#' + id).append(newp);
    cardImgs.forEach(function(cardImg){
        newp.appendChild(cardImg);
    });
}



function convertCard(cardNum) {
    att3 = Math.floor(cardNum/27);
    att2 = Math.floor((cardNum - att3*27) / 9);
    att1 = Math.floor((cardNum - 27*att3 - 9*att2) / 3);
    att0 = Math.floor(cardNum - 27*att3 - 9*att2 - 3*att1);
    return [att0, att1, att2, att3]
    //return {'att0': att0, 'att1': att1, 'att2': att2, 'att3':att3}
}





function isset(cards) {
    //console.log(cards);
    console.log('isset function called');
    if (equalArray(cards[0], cards[1])){
        return false;
    }
    var ans = 0;
    for (var j=0; j<4; j++) {
        testarray = [];
        forEach(cards, function(card) {testarray.push(card[j])});
        //console.log(testarray)
        if (reduce(function(a,b){return a + b}, 0, testarray) % 3 === 0){
            ans +=1
        }
    }
    //console.log(cards)
    return ans === 4;    

}

function removeElement(node) {
  if (node.parentNode)
    node.parentNode.removeChild(node);
}

function convertCardBack(cardArray) {
    if (cardArray === undefined) {
        return undefined;
    }
    return cardArray[0]*1 + cardArray[1]*3 + cardArray[2]*9 + cardArray[3]*27
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

function highlight(card){
    //console.log('highlight called');
    //var card = $('#' + String(cardNumber))[0];
    if (card === undefined){
        console.log('highlight function call, card undefined');
    }
    changeBorderColor(card, 'red', 'black');
}