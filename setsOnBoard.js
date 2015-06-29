var setFound;
var findSet;




function isthereanyset(SETLENGTH) {

    var numCards = cardnumarray_numbers().length;
        //use iterator here? does that save any time / memory?
    var all_indices = makeIterator(makeSubsets(range(numCards), SETLENGTH));
    var len = factorial(numCards) / (factorial(numCards - SETLENGTH) * factorial(SETLENGTH)) 

    for (var i = 0; i < len; i += 1){
        var cardBoardIndices = all_indices.next().value;

        var cards = convertToCards(cardBoardIndices);

        if (isSetEitherType(cards)){
            console.log(cardBoardIndices);
            return cards;
        }
    }

    return false;
}


function cardnumarray_numbers() {
    //gives the card numbers for the cards currently on the board.
    var div = $('#div1')[0];
    var elements = div.getElementsByTagName('IMG');
    var cardnums = [];
    for (var i=0; i<elements.length; i++){
        cardnums.push(Number(elements[i].id));
    }
    return cardnums;
}

function convertToCards(cardBoardIndices){

    var cardsOnBoard = cardnumarray_numbers();
    //console.log(cardsOnBoard);
    var arr = [];
    for (var i = 0; i<cardBoardIndices.length; i+=1){
        if (cardBoardIndices[i] === undefined){
            console.log('wtf');
        }
        arr.push(cardsOnBoard[cardBoardIndices[i]]);
    }
    return arr;
}


//currently deprecated....need to rewrite
// function allSets(){
//     var numCards = cardnumarray_numbers().length;
//     var all_indices = INDICESSTORE[numCards];
//     var all = [];
//     all_indices.forEach(function(current){
//         if (three_cards_a_set(current)){
//             all.push(current);
//         }
//     });
//     return all;
// }


function makeIterator(array){
    var nextIndex = 0;
    
    return {
       next: function(){
           return nextIndex < array.length ?
               {value: array[nextIndex++], done: false} :
               {done: true};
       }
    }
}


var FACT = [];
function factorial (n) {
  if (n == 0 || n == 1)
    return 1;
  if (FACT[n] > 0)
    return FACT[n];
  return FACT[n] = factorial(n-1) * n;
}


function makeSubsets(input, size){
    var results = [], result, mask, total = Math.pow(2, input.length);
    for(mask = 0; mask < total; mask++){
        result = [];
        i = input.length - 1; 
        do{
            if( (mask & (1 << i)) !== 0){
                result.push(input[i]);
            }
        }while(i--);
        if( result.length === size){
            results.push(result);
        }
    }

    return results;
}


//for supersets
function generateTwoCardPairs(fourCards){
    //ugly, oh well
    //build an array of three array, each of which is two arrays of two
    var allPairs = []; 
    for (var i=0; i<3; i+=1){
        var s = [];
        var s1 = fourCards.slice(0,2);
        var s2 = fourCards.slice(2,4);
        s.push(s1);
        s.push(s2);
        allPairs.push(s);

        fourCards = fourCards.concat(fourCards.splice(1,1))
    }
    return allPairs;
}


