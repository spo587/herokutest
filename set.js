
function range(end) {
    var arr = [];
    for (var i=0; i<end; i++){
        arr.push(i);
    }
    return arr;

}


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

//shuffleArray(allCards)

var setDeckShuffled = function(){
    //returns an array of numbers 1-81 shuffled which will correspond to set cards
    return shuffleArray(range(81));
}


var firstTwelve = function(){
    var allCards = range(81);
    shuffleArray(allCards);
    return allCards.splice(0,12);
}

var nextThree = function(){
    return allCards.splice(0,3);
}

//exports.allCards = allCards;
exports.setDeckShuffled = setDeckShuffled;
exports.firstTwelve = firstTwelve;
exports.nextThree = nextThree;

