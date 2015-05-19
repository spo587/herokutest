
//helper functions for later (since not using jQuery)
// function $(id) {
//     return document.getElementById(id)
// }


function forEachIn(object, func) {
    for (var property in object) {
        if (object.hasOwnProperty(property))
            func(property, object[property])
    }
}

function forEach(arr, func) {
    for (var i=0; i<arr.length; i++)
        func(arr[i])
}


function range(end) {
    var arr = []
    for (var i=0; i<end; i++)
        arr.push(i)
    return arr

}


function timer() {
    var t = new Date().getTime();
    var myVar=setInterval(function(){
        $('time').innerHTML = Math.floor((new Date().getTime() - t)/1000);
    },1000);
    return Math.floor((new Date().getTime() - t)/1000);

}

function setNodeAttribute(node, attribute, value) {
  if (attribute == "class")
    node.className = value;
  else if (attribute == "checked")
    node.defaultChecked = value;
  else if (attribute == "for")
    node.htmlFor = value;
  else if (attribute == "style")
    node.style.cssText = value;
  else
    node.setAttribute(attribute, value);
}



function dom(name, attributes) {
  var node = document.createElement(name);
  if (attributes) {
    forEachIn(attributes, function(name, value) {
      setNodeAttribute(node, name, value);
    });
  }
  for (var i = 2; i < arguments.length; i++) {
    console.log(child);
    var child = arguments[i];
    if (typeof child === "string"){
      child = document.createTextNode(child);
    node.appendChild(child);
    }
  }
  return node;
}



//this function creates a dom element for each card
function domCard(cardnum) {
    var cardsrc = './cards/' + String(cardnum) + '.JPG';
    //console.log(cardsrc);
    return dom('IMG', {src: cardsrc, id: cardnum, border: 5}) //click: printnum()}) //adding click to the properties just executes the function without click...wtf?
}


var CARDCOUNT = 0;

function getDomElement(cardNumber){
    return $('#' + String(cardNumber))[0];
}
 

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


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
    addEventListeners();
}

function firstDeal(cards){
    //deal twelve cards to the board, in 3 groups of four
    dealCards(cards, 3, 4);
    checkDeadboardAndDeal();
    CARDCOUNT += 12;
}



function checkDeadboardAndDeal() {
    console.log('heres the board input to deadboard');
    console.log(cardnumarray_numbers());
    if (!isthereanyset()){
        endGame();
        console.log('deadboard');
        dealThree(deck.splice(0,3));
        //socket.emit('dealt three more');
        //socket.emit('deadboard');
    }

}

function superSetFirstDeal() {
    dealCards(3, 3);
    addEventListeners();
    checkDeadboardAndDeal();

}


function cardnumarray() {
    return cardnumarray_numbers().map(function(current){
        return String(current);
    });
}

function cardnumarray_numbers() {
    //same as above but trying to use actual numbers, not strings
    var elements = $('IMG');
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

var twelveCardIndices = generate_all_three_card_indices(12);
var nineCardIndices = generate_all_three_card_indices(9);
var fifteenCardIndices = generate_all_three_card_indices(15);
var eighteenCardIndices = generate_all_three_card_indices(18);
var sixCardIndices = generate_all_three_card_indices(6);

var INDICESSTORE = {6: sixCardIndices, 12: twelveCardIndices, 9: nineCardIndices, 15: fifteenCardIndices, 18: eighteenCardIndices};

function isthereanyset() {
    var numCards = cardnumarray_numbers().length;
    
    var all_indices = INDICESSTORE[numCards];
    //for (var i = 0; i<array_of_all_three_index_triples.length; i++) {
    // var set = false;
    // all_indices.forEach(function(current){
    //     if (three_cards_a_set(current)){
    //         set = current;
    //     }
    // });
    for (var i = 0; i < all_indices.length; i++) {
        if (three_cards_a_set(all_indices[i])) {
            return all_indices[i];
        }
    }
    return false;
    //return set;
    //dealThree()
}

function allSets(){
    var numCards = cardnumarray_numbers().length;
    var all_indices = INDICESSTORE[numCards];
    var all = [];
    all_indices.forEach(function(current){
        if (three_cards_a_set(current)){
            all.push(current);
        }
    });
    return all;
}

var numHints = 0;

function deadBoard() {
    //for hint function
    if (isthereanyset()) {
        var indices = isthereanyset()

        function choose(choices) {
            var index = Math.floor(Math.random() * choices.length);
            return choices[index];
        }
        hintCardPosition = choose(indices);
        console.log(hintCardPosition);
        hintCardNum = cardnumarray()[hintCardPosition];
        console.log(hintCardNum);
        hintcard = domCard(hintCardNum);
        var secondDiv = $('#div2')[0];
        var img = secondDiv.getElementsByTagName('IMG');
        if (img.length == 0) {
            secondDiv.appendChild(hintcard);
            alert('you fool, it\'s not a deadboard! here\'s your hint!');
        }
        numHints += 1;
        $('numHints').innerHTML = 'Number of hints used: ' + numHints;
             
    }
    else {
        //dealThree();
    }
}


//now need to generate all possible three-index combos

var clicked = [];
console.log(clicked);

function arraysEqual(a1,a2) {
    return JSON.stringify(a1) == JSON.stringify(a2);
}

function notClicked(cardnum){
    if (arraysEqual(convertCard(cardnum), clicked[0]) || arraysEqual(convertCard(cardnum), clicked[1])){
        return false;
    }
    return true;
}

function changeBorderStyle(card){
    var cardDom = getDomElement(card);
    cardDom.style.borderStyle === 'dotted' ? cardDom.style.borderStyle = 'solid' : cardDom.style.borderStyle = 'dotted';
}

function changeBorderColor(card, color1, color2){
    console.log(card);
    var cardDom = getDomElement(card);
    cardDom.style.borderColor === color1 ? (cardDom.style.borderColor = color2) : (cardDom.style.borderColor = color1);
    
}


function removeLastCard(clicked, cardnum){
    var converted = convertCard(cardnum);
    if (arraysEqual(converted, clicked[0])){
        clicked.splice(0,1);
    }
    else if (arraysEqual(converted, clicked[1])){
        clicked.splice(1,1);
    }
}

function addToClickedOrRemove(card){
    if (notClicked(card)){
        clicked.push(convertCard(card))
    }
    else {
        removeLastCard(clicked, card);
    }
}

function clickListener(card){
    //card is the cardnumber
    console.log(card);
    $('#' + String(card)).bind('click', function(click){
        var clickTarget = click.target;
        //same thing below
        //var card = Number(clickTarget.id);
        //console.log(cardnum);
        addToClickedOrRemove(card);
        if (clickTarget === undefined){
            console.log('clickListener function call, card undefined');
        }
        changeBorderColor(card, 'red', 'black');
        //click.target.style.borderColor = chooseNewBorderColor(click.target.style.borderColor);
        socket.emit('cardClick', {card: card, clicked: clicked});
        if (clicked.length === 3){
            threeClicks(clicked);
            clicked = [];
        }
    });
}

var test;

function allBordersBlack(){
    var imgs = $('IMG');
        forEach(imgs, function(img){
            img.style.borderColor = 'black';
        });

}

function threeClicks(cardsClicked){
    //console.log(cardsClicked);
    //if (cardsClicked.length === 3) {

    var isitaset = isset(cardsClicked);
    //console.log(isitaset); 
    //for all img in doc.body: set border = black
    var cards = cardsClicked.map(function(current){
        return convertCardBack(current);
    });
    cards.forEach(function(current){
        if (current === undefined){
            console.log('threeClicks function call, card undefined');
        }
        changeBorderColor(current, 'black', 'red');    
    });

    //var imgs = $('IMG');
    // forEach(imgs, function(img){
    //     img.style.borderColor = 'black';
    // });
    clicked = [];
    // if (!isitaset){   
    //     // cardsClicked = [];
    //     clicked = [];
    // }
    if (isitaset){
        socket.emit('set found', cardsClicked);
        setsFound += 1;
        $('#setsFoundSelf').text(String(setsFound));
        //test = cardsClicked;
        removeDeal(cards);
        //clicked = [];
        // var secondDiv = $('#div2')[0];
        // var img = secondDiv.getElementsByTagName('IMG');
        // if (img.length > 0) {   
        //     secondDiv.removeChild(img[0]);
    }
        
    //}
}




function addEventListeners(cards) {
    //console.log(clicked);

    if (cards === undefined){ 
        var cards = cardnumarray_numbers();
    }

    else {
        //console.log(cards);
    }
    console.log(cards);
    cards.forEach(function(current, index, array){
        clickListener(current);
    });
}

    
function reduce(combine, base, array) {
    forEach(array, function(element) {
        base = combine(base, element)
    })
    return base;
}




function convertCard(cardNum) {
    att3 = Math.floor(cardNum/27);
    att2 = Math.floor((cardNum - att3*27) / 9);
    att1 = Math.floor((cardNum - 27*att3 - 9*att2) / 3);
    att0 = Math.floor(cardNum - 27*att3 - 9*att2 - 3*att1);
    return [att0, att1, att2, att3]
    //return {'att0': att0, 'att1': att1, 'att2': att2, 'att3':att3}
}



function equalArray(arr1,arr2) {
    var res = 0;
    for (i=0; i<arr1.length; i++) {
        if (arr1[i] === arr2[i])
            res += 1
    }
    return res === arr1.length
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

function dealThree(cards) {
    console.log('deal three being called here');
    //debugger;
    console.log(cards);
    if (CARDCOUNT === 81){
        endGame();
        return false;
    }
    for (var i=0; i<3; i++) {
        //console.log(cards);
        var card = cards.shift();
        //console.log(allCards);
        var newCard = domCard(card);
        var firstDiv = $('#div1')[0];
        
        
        firstDiv.childNodes[i].appendChild(newCard);
        addEventListeners([(newCard.id)]);
    }
    realign();
    realign();
    CARDCOUNT += 3;
    checkDeadboardAndDeal();
    
}
//     if (allCards.length >= 3) {
//         theDeal()
//     }
//     console.log('line 353');
//     if (!isthereanyset() && allCards.length >= 3) {
//         console.log('it worked!!!')
//         theDeal()
//     }
//     realign();   
//     endGame();
// }


// function dealOne(parent, card) {
//     //console.log(allCards)
//     var randNum = card;
//     var newCard = domCard(randNum);
//     parent.appendChild(newCard);
//     //console.log(newCard);
//     addEventListeners([(newCard.id)]);


//     //addEventListeners()
// }

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

function endGame() {
    console.log('endgame function called');
    if (CARDCOUNT === 81 && !isthereanyset()){
        //var t = $('time').innerHTML;
        var setsSelf = Number($('#setsFoundSelf').text());
        var setsOpp = Number($('#setsFoundOpponent').text());
        var win = setsSelf > setsOpp ? ' won!' : ' lost!';
        alert('game over! You' + win);
    }
        
}

var setsFound = 0;

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
        console.log('9 or more cards on board');
        checkDeadboardAndDeal();
    }
}


function clearSet(clickDelay){
    var set = isthereanyset();
    var setCards = set.map(function(current){
        return cardnumarray_numbers()[current];
    });
    // setCards.forEach(function(current){
    //     clicked.push(current);
    //     socket.emit('cardClick', {card: current, clicked: clicked})
    // });
    clicked = [];
    
    setCardsDom = setCards.map(function(current){
        return $('#' + String(current))[0];
    });
    
    for (var i=0; i < 3; i += 1){
        setTimeout(function(){
            setCardsDom.shift().click();
        }, clickDelay * i);
    }
            
    
    // setCardsDom.forEach(function(current){
    //     current.click();
    //     //changeBorderColor(current, 'red', 'black')
    // });
    // var setCardsSetForm = setCards.map(function(current){
    //     return convertCard(current);
    // });
    // setTimeout(function(){
    //     socket.emit('set found', setCardsSetForm);
    //     removeDeal(setCardsSetForm);
    //     }, delay);
}


function playGameArtificial(setDelay, clearDelay){
    //if (CARDCOUNT < 81){
    var set = isthereanyset();
    if (!set){
        checkDeadboardAndDeal();
    }
    else {
        setTimeout(function(){
            clearSet(clearDelay);
        }, setDelay);
        
    }
    //}
}

function compPlays(setDelay, clearDelay){
    for (var i=0; i < 27; i += 1){
        var k = setTimeout(function(){
            playGameArtificial(setDelay, clearDelay);
        }, (setDelay + clearDelay * 3) * i + 1000);
    }
}


function shuffleBoardCards() {
    var cards = cardnumarray_numbers();
    $('#div1').html('');
    shuffleArray(cards);
    dealCards(cards, cards.length / 4, cards.length / 3);
}




