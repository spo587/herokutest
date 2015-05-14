
function range(end) {
    var arr = [];
    for (var i=0; i<end; i++){
        arr.push(i);
    }
    return arr;

}

var allCards = range(81) //can we do this better?

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

shuffleArray(allCards)

var firstTwelve = function(){
    return allCards.splice(0,12);
}

var nextThree = function(){
    return allCards.splice(0,3);
}

exports.allCards = allCards;
exports.firstTwelve = firstTwelve;
exports.nextThree = nextThree;

