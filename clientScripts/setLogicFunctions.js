
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
    //console.log(thirdCard);
    return new SetCard(thirdCard[0]*1 + thirdCard[1]*3 + thirdCard[2]*9 + thirdCard[3]*27);
    //console.log(ret.cardNumber);
    //return ret;
}

function isSuperSet(cardsCopy){
    //was having problems with the array being modified, so making a copy instead
    var cards = cardsCopy.map(function(card){
        return card;
    });
    var superSet = false;
    //console.log(cards);
    var twoCardSplits = generateTwoCardPairs(cards);

    twoCardSplits.forEach(function(twoCardSplit){
        //console.log(twoCardSplit);
        if (completeSet(twoCardSplit[0]).equals(completeSet(twoCardSplit[1]))){
            //console.log('superSet');
            superSet = cardsCopy;
            console.log(completeSet(twoCardSplit[0]));
        }
    });
    return superSet;
}


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

