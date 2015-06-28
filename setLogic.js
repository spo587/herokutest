//so the cards come in two forms: numbers 0-80 and also in 'setform', meaning an array of four numbers,
//each entry in the array being 0-3, corresponding to one of the characteristics.


function SetCard(cardNum){
    this.setAttributes = function(){
        att3 = Math.floor(cardNum/27);
        att2 = Math.floor((cardNum - att3 * 27) / 9);
        att1 = Math.floor((cardNum - 27 * att3 - 9 * att2) / 3);
        att0 = Math.floor(cardNum - 27 * att3 - 9 * att2 - 3 * att1);
        return [att0, att1, att2, att3];
    }
    this.cardNum = function(){
        return cardNum;
    }  
    this.domCard = function(){
        var cardsrc = './cards/' + String(cardNum) + '.JPG';
        //console.log(cardsrc);
        return dom('IMG', {src: cardsrc, id: cardNum, border: 5});
    }
    this.getDomElement = function(){
        return $('#' + String(cardNum))[0];
    }
    this.changeBorderStyle = function(){
        var cardDom = this.getDomElement();
        cardDom.style.borderStyle === 'dotted' ? cardDom.style.borderStyle = 'solid' : cardDom.style.borderStyle = 'dotted';
    }
    this.changeBorderColor =  function(){//, color1, color2){
        var cardDom = this.getDomElement();
        cardDom.style.borderColor = 'red'; //== color1 ? (cardDom.style.borderColor = color2) : (cardDom.style.borderColor = color1);
        
    }
}


// function convertCard(cardNum) {
//     //convert card from integer form to set form, ie, the array of four attributes
//     att3 = Math.floor(cardNum/27);
//     att2 = Math.floor((cardNum - att3 * 27) / 9);
//     att1 = Math.floor((cardNum - 27 * att3 - 9 * att2) / 3);
//     att0 = Math.floor(cardNum - 27 * att3 - 9 * att2 - 3 * att1);
//     return [att0, att1, att2, att3];
//     //return {'att0': att0, 'att1': att1, 'att2': att2, 'att3':att3}
// }


function isSetEitherType(cards){
    if (cards.length === 3){
        var cardsSetForm = cards.map(function(card){
            //return convertCard(card);
            return card.setAttributes();
        });
        return isset(cardsSetForm);
    }
    else if (cards.length === 4){
        return isSuperSet(cards);
    }
}

function isset(cards) {
    //cards here are input each in 'setform', that is, as arrays, not integers 0-80
    if (equalArray(cards[0], cards[1])){
        return false;
    }
    var ans = 0;
    for (var j = 0; j < 4; j++) {
        var testarray = [];
        forEach(cards, function(card) {
            testarray.push(card[j])
        });
        if (reduce(function(a,b){
            return a + b
        }, 0, testarray) % 3 === 0){
            ans += 1;
        }
    }
    //console.log(cards)
    return ans === 4;    
}

function completeSet(twoCards){
    //for superset....takes two integer cards as input and returns the integer
    //of the third card that makes them into a set
    //console.log(twoCards);
    var cardsSetForm = twoCards.map(function(card){
        return card.setAttributes();
    });
    var thirdCard = [];
    var thirdAttribute;
    for (var i = 0; i < 4; i += 1){
        thirdAttribute = cardsSetForm[0][i] === cardsSetForm[1][i] ? cardsSetForm[0][i] : 
        3 - (cardsSetForm[0][i] + cardsSetForm[1][i]);
        thirdCard.push(thirdAttribute);

    }
    return thirdCard.cardNum();

}

function isSuperSet(cardsCopy){
    //was having problems with the array being modified, so making a copy instead
    var cards = cardsCopy.map(function(card){
        return card;
    });
    var twoCardSplits = generateTwoCardPairs(cards);
    var superSet = false;
    twoCardSplits.forEach(function(twoCardSplit){
        //console.log(twoCardSplit);
        if (completeSet(twoCardSplit[0]) === completeSet(twoCardSplit[1])){
            //console.log('superSet');
            superSet = true;
        }
    });
    return superSet;
}


// function convertCardBack(cardArray) {
//     //convert from set form to integer form
//     if (cardArray === undefined) {
//         return undefined;
//     }
//     return cardArray[0]*1 + cardArray[1]*3 + cardArray[2]*9 + cardArray[3]*27
// }



//rewrite
// function three_cards_a_set(three_indices) {
//     //three_indices is an array of BOARD indices
//     var cards = cardnumarray_numbers();
//     var testarr = [];
//     for (var i = 0; i<3; i++){
//         //console.log(three_indices[i]);
//         //try {
//         testarr.push(convertCard(cards[three_indices[i]]));
//         //}
//         // finally {
//         //     console.log(three_indices);
//         //     console.log(three_indices[i]);
//         //     console.log(i);
//         //     console.log(testarr);
//         //     console.log(convertCard(cards[three_indices[i]]));
//         // }
//     }
//     return isset(testarr);
// }


