

var CARDCOUNT = 0;




function firstDeal(cards){
    //deal twelve cards to the board, in 3 groups of four
    dealCards(cards, 3, 4);
    checkDeadboardAndDeal();
    CARDCOUNT += 12;
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





var twelveCardIndices = generate_all_three_card_indices(12);
var nineCardIndices = generate_all_three_card_indices(9);
var fifteenCardIndices = generate_all_three_card_indices(15);
var eighteenCardIndices = generate_all_three_card_indices(18);
var sixCardIndices = generate_all_three_card_indices(6);

var INDICESSTORE = {6: sixCardIndices, 12: twelveCardIndices, 9: nineCardIndices, 15: fifteenCardIndices, 18: eighteenCardIndices};

function isthereanyset() {

    var numCards = cardnumarray_numbers().length;
    if (numCards % 3 === 0){
        var all_indices = INDICESSTORE[numCards];
    }
    else {
        console.log('overlapping sets or something funny happened');
        var all_indices = generate_all_three_card_indices(numCards);
    }
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

// function deadBoard() {
//     //for hint function
//     if (isthereanyset()) {
//         var indices = isthereanyset()

//         function choose(choices) {
//             var index = Math.floor(Math.random() * choices.length);
//             return choices[index];
//         }
//         hintCardPosition = choose(indices);
//         console.log(hintCardPosition);
//         hintCardNum = cardnumarray()[hintCardPosition];
//         console.log(hintCardNum);
//         hintcard = domCard(hintCardNum);
//         var secondDiv = $('#div2')[0];
//         var img = secondDiv.getElementsByTagName('IMG');
//         if (img.length == 0) {
//             secondDiv.appendChild(hintcard);
//             alert('you fool, it\'s not a deadboard! here\'s your hint!');
//         }
//         numHints += 1;
//         $('numHints').innerHTML = 'Number of hints used: ' + numHints;
             
//     }
//     else {
//         //dealThree();
//     }
// }


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

function clickListener(card){
    //card is the cardnumber
    //console.log(card);
    $('#' + String(card)).bind('click', function(click){
        if (clicked.length === 0){
            setFound = false;
            socket.emit('firstCardClick', {card: card, clicked: clicked});
            findSet = setTimeout(setFoundOrNot, 2000);
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
        
        if (clicked.length === 3){
            //allBordersBlack
            threeClicks(clicked);
            clicked = [];
        }
    });
}

var test;


function threeClicks(cards){
    //console.log(cardsClicked);
    //if (cardsClicked.length === 3) {
    var cardsSetForm = cards.map(function(current){
        return convertCard(current);
    })
    var isitaset = isset(cardsSetForm);
    //console.log(isitaset); 
    //for all img in doc.body: set border = black
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
        setFound = true;
        //console.log('set registered');
        console.log(setFound);
        clearTimeout(findSet);
        socket.emit('set found', {cards: cards, playerName: nickname});
        //setsFound += 1;
        //$('#' + nickname).text(nickname + '\'s sets: ' + String(setsFound));
        
        //test = cardsClicked;
        //removeDeal(cards);
        //addToSetsOnScreen(cards, 'self');
        //clicked = [];
        // var secondDiv = $('#div2')[0];
        // var img = secondDiv.getElementsByTagName('IMG');
        // if (img.length > 0) {   
        //     secondDiv.removeChild(img[0]);
    }
        
    //}
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
        //addEventListeners([(newCard.id)]);
        clickListenersOff();
        addEventListeners();
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



function endGame() {
    console.log('endgame function called');
    if (CARDCOUNT === 81 && !isthereanyset()){
        //var t = $('time').innerHTML;
        var t = $('#time').text();
        var setsSelf = Number($('#setsFoundSelf').text());
        var setsOpp = Number($('#setsFoundOpponent').text());
        var win = setsSelf > setsOpp ? ' won!' : ' lost!';
        alert('game over! You' + win + 'game time: ' + t);
        var data = {t: t, player1: playerName, player2: opponentName};
        socket.emit('game data', data)
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




