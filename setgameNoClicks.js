


function removeDeal(cards) {
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



//iterators....fancy





function setFoundOrNot(){
    if (setFound === false){
        clicked = [];
        allBordersBlack();
        socket.emit('falsey', NICKNAME);
    }

}



    
function getRowLengths(div){
    var firstRow = div.childNodes[0].childNodes.length;
    var secondRow = div.childNodes[1].childNodes.length;
    var thirdRow = div.childNodes[2].childNodes.length;
    return {0: firstRow, 1: secondRow, 2: thirdRow};
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






var numHints = 0;


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


//dont think i need these to load anymore
// var twelveCardIndices = generate_all_three_card_indices(12);
// var nineCardIndices = generate_all_three_card_indices(9);
// var fifteenCardIndices = generate_all_three_card_indices(15);
// var eighteenCardIndices = generate_all_three_card_indices(18);
// var sixCardIndices = generate_all_three_card_indices(6);

// var INDICESSTORE = {6: sixCardIndices, 12: twelveCardIndices, 9: nineCardIndices, 15: fifteenCardIndices, 18: eighteenCardIndices};





