
var CARDCOUNT = 0;

function firstDeal(cards, SETLENGTH){
    console.log(cards.length);
    CARDCOUNT += cards.length;
    //console.log(SETLENGTH);
    //deal twelve cards to the board, in 3 groups of four
    dealCards(cards, 3, 12 / SETLENGTH);
    checkDeadboardAndDeal();
}


// function superSetFirstDeal(cards) {
//     dealCards(cards, 3, 3);
//     //addEventListeners();
//     checkDeadboardAndDeal();

// }

function cardnumarray() {
    return cardnumarray_numbers().map(function(current){
        return String(current);
    });
}

function makeIterator(array){
    var nextIndex = 0;
    
    return {
       next: function(){
           return nextIndex < array.length ?
               {value: array[nextIndex++], done: false} :
               {done: true};
       }
    }
}

var twelveCardIndices = generate_all_three_card_indices(12);
var nineCardIndices = generate_all_three_card_indices(9);
var fifteenCardIndices = generate_all_three_card_indices(15);
var eighteenCardIndices = generate_all_three_card_indices(18);
var sixCardIndices = generate_all_three_card_indices(6);

var INDICESSTORE = {6: sixCardIndices, 12: twelveCardIndices, 9: nineCardIndices, 15: fifteenCardIndices, 18: eighteenCardIndices};


var FACT = [];
function factorial (n) {
  if (n == 0 || n == 1)
    return 1;
  if (FACT[n] > 0)
    return FACT[n];
  return FACT[n] = factorial(n-1) * n;
}


function isthereanyset(SETLENGTH) {

    var numCards = cardnumarray_numbers().length;
    //if (numCards % 3 === 0){
        //use iterator here? does that save any time / memory?
    var all_indices = makeIterator(makeSubsets(range(numCards), SETLENGTH));
    var len = factorial(numCards) / (factorial(numCards - SETLENGTH) * factorial(SETLENGTH)) 
    //var all_indices = makeSubsets(range(numCards), SETLENGTH);
    //var all_indices = INDICESSTORE[numCards];
    //}
    // else {
    //     console.log('overlapping sets or something funny happened');
    //     var all_indices = generate_all_three_card_indices(numCards);
    // }
    
    for (var i = 0; i < len; i += 1){
        //console.log(all_indices.next().value)
        var cardBoardIndices = all_indices.next().value;
        //console.log(cardBoardIndices);

        var cards = convertToCards(cardBoardIndices);
        // var cardsSetForm = cards.map(function(card){
        //     return convertCard(card);
        // });
        if (isSetEitherType(cards)){
            console.log(cardBoardIndices);
            return cards;
        }
    }
        // if (three_cards_a_set(cardBoardIndices)){
        //     return next;
        // }
    //}
    // for (var i = 0; i < all_indices.length; i++) {
    //     var cardBoardIndices = all_indices[i];
    //     var cards = convertToCards(cardBoardIndices);
    //     var cardsSetForm = cards.map(function(card){
    //         return convertCard(card);
    //     });
    //     if (isSetEitherType(cardsSetForm)){
    //         return cardBoardIndices;
    //     }
    //     // if (three_cards_a_set(all_indices[i])) {
    //     //     return all_indices[i];
    //     // }
    // }
    return false;
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


function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function hintCard(){
    socket.emit('hintcard called');
    console.log('this function called');
}

function displayHint() {
    //for hint function
    
    if (!isthereanyset(SETLENGTH)){
        console.log('error!!! no set detected but board didnt auto-deal more cards');
    }
    else {
        var indices = isthereanyset(SETLENGTH);
        var hintCardPosition = 0;
        //console.log(hintCardPosition);
        var hintCardNum = cardnumarray_numbers()[hintCardPosition];
        //console.log(hintCardNum);
        var hintcard = domCard(hintCardNum);
        var secondDiv = $('#hint-card-position')[0];
        if (secondDiv.children.length > 0){
            takeAway(secondDiv.children[0]);
        }
        secondDiv.appendChild(hintcard);
            //alert('you fool, it\'s not a deadboard! here\'s your hint!');
        //$('numHints').innerHTML = 'Number of hints used: ' + numHints;
             
    }

}


//now need to generate all possible three-index combos

var clicked = [];




// function removeLastCard(clicked, cardnum){
//     var converted = convertCard(cardnum);
//     if (arraysEqual(converted, clicked[0])){
//         clicked.splice(0,1);
//     }
//     else if (arraysEqual(converted, clicked[1])){
//         clicked.splice(1,1);
//     }
// }

function addToClicked(card){
    if (clicked.indexOf(card) === -1){
        clicked.push(card);
    }
    //console.log(clicked);
    // if (notClicked(card)){
    //     clicked.push(convertCard(card))
    // }
    // else {
    //     removeLastCard(clicked, card);
    // }
}

var setFound;
var findSet;

function setFoundOrNot(){
    if (setFound === false){
        clicked = [];
        allBordersBlack();
        //setsFound = setsFound - 1;
        //$('#' + nickname).text(nickname + '\'s sets: ' + String(setsFound));
        socket.emit('falsey', nickname);
    }
    //socket.emit('clickBanExpiring')
    //console.log(setFound);
}

function clickListener(card, SETLENGTH){
    if (SETLENGTH === undefined){
        SETLENGTH = 3;

    }
    $('#' + String(card)).bind('click', function(click){
        if (clicked.length === 0){
            setFound = false;
            socket.emit('firstCardClick', {card: card, clicked: clicked});
            findSet = setTimeout(setFoundOrNot, 600 * SETLENGTH);
        }
        if (clicked.length === 1){
            socket.emit('secondCardClick', {card: card, clicked: clicked});
        }
        var clickTarget = click.target;
        //same thing below
        //var card = Number(clickTarget.id);
        //console.log(cardnum);
        addToClicked(card);
        //console.log(clicked);
        if (clickTarget === undefined){
            console.log('clickListener function call, card undefined');
        }
        changeBorderColor(card, 'red', 'black');
        //click.target.style.borderColor = chooseNewBorderColor(click.target.style.borderColor);
        
        if (clicked.length === SETLENGTH){
            //allBordersBlack
            checkClicks(clicked, SETLENGTH);
            clicked = [];
        }
    });
}


function checkClicks(cards, SETLENGTH){
    console.log(cards);
    // var cardsSetForm = cards.map(function(current){
    //     return convertCard(current);
    // });
    var isitaset = isSetEitherType(cards);
    console.log(cards);
    console.log(isitaset);

    cards.forEach(function(current){
        if (current === undefined){
            console.log('checkClicks function call, card undefined');
        }
        changeBorderColor(current, 'black', 'red');    
    });

    clicked = [];
    console.log(cards);
    if (isitaset){
        setFound = true;
        //console.log('set registered');
        console.log(setFound);
        clearTimeout(findSet);
        console.log(cards);
        socket.emit('set found', {cards: cards, playerName: nickname});
    }
}


    
function getRowLengths(div){
    var firstRow = div.childNodes[0].childNodes.length;
    var secondRow = div.childNodes[1].childNodes.length;
    var thirdRow = div.childNodes[2].childNodes.length;
    return {0: firstRow, 1: secondRow, 2: thirdRow};
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


function dealThree(cards) {
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



function endGame() {
    console.log('endgame function called');
    if (CARDCOUNT === 81 && !isthereanyset(SETLENGTH)){
        //var t = $('time').innerHTML;
        var t = $('#time').text();
        socket.emit('game over', t);
        // var win = setsSelf > setsOpp ? ' won!' : ' lost!';
        // alert('game over! You' + win + ' game time: ' + t);
        // var data = {t: t, player1: playerName, player2: opponentName};
        // socket.emit('game data', data)
    }
        
}

var setsFound = 0;



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


function clearSet(clickDelay){
    var set = isthereanyset(SETLENGTH);
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
}

function playGameArtificial(setDelay, clearDelay){
    //if (CARDCOUNT < 81){
    var set = isthereanyset(SETLENGTH);
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




