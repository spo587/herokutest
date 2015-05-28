var clicked = [];

function addEventListeners(cards, SETLENGTH) {
    if (SETLENGTH === undefined){
        console.log('no set length passed');
        SETLENGTH = 3;
    }
    if (cards === undefined){ 
        var cards = cardnumarray_numbers();
    }

    else {
    }
    cards.forEach(function(current, index, array){
        clickListener(current, SETLENGTH);
    });
}

function clickListener(card, SETLENGTH){
    if (SETLENGTH === undefined){
        SETLENGTH = 3;
    }
    $('#' + String(card)).bind('click', function(click){
        if (clicked.length === 0){
            //this is ugly...setfound is a global variable on the local page
            setFound = false;
            socket.emit('firstCardClick', {card: card, clicked: clicked});
            findSet = setTimeout(setFoundOrNot, 600 * SETLENGTH);
        }
        if (clicked.length === 1){
            socket.emit('secondCardClick', {card: card, clicked: clicked});
        }
        var clickTarget = click.target;
        addToClicked(card);
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

function addToClicked(card){
    if (clicked.indexOf(card) === -1){
        clicked.push(card);
    }
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



function checkClicks(cards, SETLENGTH){
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
        clearTimeout(findSet);
        socket.emit('set found', {cards: cards, playerName: NICKNAME});
    }
}

