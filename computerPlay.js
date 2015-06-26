//i may need to rewrite some of these as well

function clearSet(clickDelay){
    var setCards = isthereanyset(SETLENGTH);
    // var setCards = set.map(function(current){
    //     return cardnumarray_numbers()[current];
    // });
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


