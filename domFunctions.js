function timer() {
    var t = new Date().getTime();
    var myVar = setInterval(function(){
        var toShow = String(Math.floor((new Date().getTime() - t)/1000));
        $('#time').text(toShow);
    }, 1000);
    return Math.floor((new Date().getTime() - t)/1000);
}


//this function creates a dom element for each card
// function domCard(cardnum) {
//     var cardsrc = './cards/' + String(cardnum) + '.JPG';
//     //console.log(cardsrc);
//     return dom('IMG', {src: cardsrc, id: cardnum, border: 5}); //click: printnum()}) //adding click to the properties just executes the function without click...wtf?
// }


// function getDomElement(cardNumber){
//     return $('#' + String(cardNumber))[0];
// }


// function changeBorderStyle(card){
//     var cardDom = getDomElement(card);
//     cardDom.style.borderStyle === 'dotted' ? cardDom.style.borderStyle = 'solid' : cardDom.style.borderStyle = 'dotted';
// }

// function changeBorderColor(card){//, color1, color2){
//     var cardDom = getDomElement(card);
//     cardDom.style.borderColor = 'red'; //== color1 ? (cardDom.style.borderColor = color2) : (cardDom.style.borderColor = color1);
    
// }

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


function highlight(card){
    if (card === undefined){
        console.log('highlight function call, card undefined');
    }
    changeBorderColor(card, 'red', 'black');
}


