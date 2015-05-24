function timer() {
    var t = new Date().getTime();
    var myVar = setInterval(function(){
        var toShow = String(Math.floor((new Date().getTime() - t)/1000));
        $('#time').text(toShow);
    },1000);
    return Math.floor((new Date().getTime() - t)/1000);
}


//this function creates a dom element for each card
function domCard(cardnum) {
    var cardsrc = './cards/' + String(cardnum) + '.JPG';
    //console.log(cardsrc);
    return dom('IMG', {src: cardsrc, id: cardnum, border: 5}) //click: printnum()}) //adding click to the properties just executes the function without click...wtf?
}


function getDomElement(cardNumber){
    return $('#' + String(cardNumber))[0];
}