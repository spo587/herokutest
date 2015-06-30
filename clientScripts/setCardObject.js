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
    //console.log(cardDom);
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
        ////console.log(cardsrc);
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
            //console.log('card already activated');
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
    this.equals = function(otherCard){
        return this.cardNumber === otherCard.cardNumber;
    }
    this.getBoardPosition = function(){
        if (this.setBoard === null){
            //console.log('card doesnt have a board');
        }
        var setBoard = this.setBoard;
        return setBoard.getCardIndex(this);
    }

}


