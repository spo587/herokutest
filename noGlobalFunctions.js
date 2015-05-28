

//var SETLENGTH = 4;







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

function allBordersSolid(){
    var imgs = $('IMG');
    forEach(imgs, function(img){
        img.style.borderStyle = 'solid';
    });
}








// function makeTwoCardSplits(cards){
//     var splits = [];
//     return splits.concat([[[cards[0], cards[1]], [cards[2], cards[3]]]]).concat([[[cards[0], cards[2]], [cards[1], cards[3]]]]).concat([[[cards[0], cards[3]], [cards[1], cards[2]]]])
    
// }






function highlight(card){
    //console.log('highlight called');
    //var card = $('#' + String(cardNumber))[0];
    if (card === undefined){
        console.log('highlight function call, card undefined');
    }
    changeBorderColor(card, 'red', 'black');
}