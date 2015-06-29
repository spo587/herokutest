//so the cards come in two forms: numbers 0-80 and also in 'setform', meaning an array of four numbers,
//each entry in the array being 0-3, corresponding to one of the characteristics.


Object.prototype.getDomElement = function(num){
    return $('#' + String(num));
}

Object.prototype.changeBorderStyle = function(){
    var cardDom = this.getDomElement(this.cardNumber)[0];
    cardDom.style.borderStyle === 'dotted' ? cardDom.style.borderStyle = 'solid' : cardDom.style.borderStyle = 'dotted';
}

Object.prototype.setBorderStyle  = function(style){
    var cardDom = this.getDomElement(this.cardNumber)[0];
    console.log(cardDom);
    cardDom.style.borderStyle = style;
}

function SetCard(cardNum){
    this.cardNumber = cardNum;
    this.setBoard = null;
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
    this.changeBorderColor =  function(color){//, color1, color2){
        var cardDom = this.getDomElement(this.cardNumber)[0];
        cardDom.style.borderColor = color; //== color1 ? (cardDom.style.borderColor = color2) : (cardDom.style.borderColor = color1);
        
    }
    this.clickListenerOn = false;
    this.addSetBoard = function(board){
        this.setBoard = board;
    }
    this.addClickListener = function(){
        if (this.clickListenerOn === true){
            console.log('card already activated');
            return false;
        }
        else if (this.clickListenerOn === false) {
            this.clickListenerOn = true;
            var dc = this.getDomElement(this.cardNumber);
            var setBoardObj = this.setBoard;
            var card = this;
            dc.bind('click', function(click){
                setBoardObj.registerClick(card);
            });
        }
    }
    this.clickListenerOff = function(){
        var dc = this.getDomElement(this.cardNumber);
        dc.unbind('click');
        this.clickListenerOn = false;
    }

}


function isSetEitherType(cards){
    if (cards.length === 3){
        return isset(cards);
    }
    else if (cards.length === 4){
        return isSuperSet(cards);
    }
}

function isset(cards) {
    var cards = cards.map(function(card){
        //return convertCard(card);
        return card.setAttributes();
    });
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

