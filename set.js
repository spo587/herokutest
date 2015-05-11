
//helper functions for later (since not using jQuery)
function $(id) {
    return document.getElementById(id)
}


function forEachIn(object, func) {
    for (var property in object) {
        if (object.hasOwnProperty(property))
            func(property, object[property])
    }
}

function forEach(arr, func) {
    for (var i=0; i<arr.length; i++)
        func(arr[i])
}


function range(end) {
    var arr = []
    for (var i=0; i<end; i++)
        arr.push(i)
    return arr

}


function timer() {
    var t = new Date().getTime();
    var myVar=setInterval(function(){
        $('time').innerHTML = Math.floor((new Date().getTime() - t)/1000)
    },1000);
    return Math.floor((new Date().getTime() - t)/1000);

}

function setNodeAttribute(node, attribute, value) {
  if (attribute == "class")
    node.className = value;
  else if (attribute == "checked")
    node.defaultChecked = value;
  else if (attribute == "for")
    node.htmlFor = value;
  else if (attribute == "style")
    node.style.cssText = value;
  else
    node.setAttribute(attribute, value);
}



function dom(name, attributes) {
  var node = document.createElement(name);
  if (attributes) {
    forEachIn(attributes, function(name, value) {
      setNodeAttribute(node, name, value);
    });
  }
  for (var i = 2; i < arguments.length; i++) {
    var child = arguments[i];
    if (typeof child == "string")
      child = document.createTextNode(child);
    node.appendChild(child);
  }
  return node;
}



//this function creates a dom element for each card
function domCard(cardnum) {
    var cardsrc = 'cards/' + String(cardnum) + '.JPG'
    return dom('IMG', {src: cardsrc, id: cardnum, border: 5}) //click: printnum()}) //adding click to the properties just executes the function without click...wtf?
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


function dealtwelve() {
    //deal twelve cards to the board, in 3 groups of four
    for (var j=0; j<3; j++) {
        newp = dom('P',null);
        var firstDiv = $('div1');
        firstDiv.appendChild(newp)
        for (var i=0; i<4; i++) {
            
            var randNum = allCards.pop()
            var card = domCard(randNum);
            newp.appendChild(card);
            //console.log(card.id)
        
        }

    }
    
    addEventListeners()
    checkDeadboardAndDeal()
}

function checkDeadboardAndDeal() {
    if (!isthereanyset())
        dealThree()
}

function dealNine() {
    for (var j=0; j<3; j++) {
        newp = dom('P',null);
        var firstDiv = $('div1');
        firstDiv.appendChild(newp)
        for (var i=0; i<3; i++) {
            
            var randNum = allCards.pop()
            var card = domCard(randNum);
            newp.appendChild(card);
            //console.log(card.id)
        
        }

    }

    addEventListeners()
    checkDeadboardAndDeal()

}


function cardnumarray() {
    //an array of cards on the board, by number 1-81, but as strings
    var cardnums = []
    var elements = document.body.getElementsByTagName('IMG')
    for (var i=0; i<elements.length; i++)
        cardnums.push(elements[i].id)
    //console.log(cardnums)
    return cardnums
}

function cardnumarray_numbers() {
    //same as above but trying to use actual numbers, not strings
    var cardnums = [];
    var firstDiv = $('div1');
    var elements = firstDiv.getElementsByTagName('IMG')
    for (var i=0; i<elements.length; i++)
        cardnums.push(Number(elements[i].id))
    //  console.log(cardnums)
    return cardnums

}

function three_cards_a_set(three_indices) {
    //three_indices some sort of object of length 3
    var cards = cardnumarray_numbers()
    var testarr = []
    for (var i = 0; i<3; i++)
        testarr.push(convertCard(cards[three_indices[i]]))
    return isset(testarr)

}

function generate_all_three_card_indices(){
    var cards = cardnumarray_numbers()
    var num = cards.length
    var all_indices = []
        for (var i = 0; i<num-2; i++) {
            for (var j = i+1; j< num-1; j++){
                for (var k=j+1; k<num; k++) {
                    all_indices.push([i,j,k])
                }
            }
        }
    return all_indices
}

function isthereanyset() {
    //generates one hint now because of the early return statement
    var ret = 0
    var all_indices = generate_all_three_card_indices()
    //for (var i = 0; i<array_of_all_three_index_triples.length; i++) {
    for (var i = 0; i<all_indices.length; i++) {
        if (three_cards_a_set(all_indices[i])) {
            

            return all_indices[i]

        }
    }
    return false
    //dealThree()
}

var numHints = 0;

function deadBoard() {
    if (isthereanyset()) {
        var indices = isthereanyset()

        function choose(choices) {
            var index = Math.floor(Math.random() * choices.length);
            return choices[index];
        }
        hintCardPosition = choose(indices);
        console.log(hintCardPosition)

        console.log(hintCardPosition)
        hintCardNum = cardnumarray()[hintCardPosition]
        console.log(hintCardNum)
        hintcard = domCard(hintCardNum)
        var secondDiv = $('div2');
        var img = secondDiv.getElementsByTagName('IMG');
        if (img.length == 0) {
            secondDiv.appendChild(hintcard);
            alert('you fool, it\'s not a deadboard! here\'s your hint!');
        }
        numHints += 1;
        $('numHints').innerHTML = 'Number of hints used: ' + numHints;
             
    }
    else dealThree()
}


//now need to generate all possible three-index combos

var clicked = []
console.log(clicked)

function addEventListeners(cards) {
    console.log(clicked)

    if (cards == undefined) 
        var cards = cardnumarray()

    else
        console.log(cards)
    for (var i=0; i<cards.length; i++) {
        var num = Number(cards[i]);
        console.log(num)
        $(num).addEventListener('click',function(click){
            var cardnum = Number(click.target.id);
            console.log(cardnum);
            if (cardnum == convertCardBack(clicked[0])) {
                console.log('successfully setting clicked to empty??');
                clicked.shift();
                console.log(clicked)
            }
            else if (cardnum == convertCardBack(clicked[1])) {
                clicked.pop()
                console.log(clicked)
            }
            else if (cardnum != clicked[0] && cardnum != clicked[1])
                clicked.push(convertCard(cardnum));
            if (!click.target.style.borderColor || click.target.style.borderColor == 'black')
                click.target.style.borderColor = 'green';
            else
                click.target.style.borderColor = 'black'
            if (clicked.length == 3) {
                threeClicks(clicked);
                clicked = [];
            }
        });
    }
    function threeClicks(cardsClicked) {
        if (cardsClicked.length == 3) {

                // if (result.length == 3) {
            console.log(cardsClicked)
            //removeDeal(result)
            var isitaset = isset(cardsClicked)
            console.log(isitaset); 
            //for all img in doc.body: set border = black
            var imgs = document.body.getElementsByTagName('IMG')
            forEach(imgs,function(img){img.style.borderColor = 'black'})
            if (!isitaset)   
                cardsClicked = [];
            else {
                console.log(cardsClicked);
                removeDeal(cardsClicked);
                result = [];
                var secondDiv = $('div2')
                var img = secondDiv.getElementsByTagName('IMG');
                if (img.length > 0) {
                    
                    secondDiv.removeChild(img[0])
                }

            }

        }
    } 
}

    
function reduce(combine, base, array) {
    forEach(array, function(element) {
        base = combine(base, element)
    })
    return base
}




function convertCard(cardNum) {
    att3 = Math.floor(cardNum/27);
    att2 = Math.floor((cardNum - att3*27) / 9);
    att1 = Math.floor((cardNum - 27*att3 - 9*att2) / 3);
    att0 = Math.floor(cardNum - 27*att3 - 9*att2 - 3*att1);
    return [att0, att1, att2, att3]
    //return {'att0': att0, 'att1': att1, 'att2': att2, 'att3':att3}
}



function equalArray(arr1,arr2) {
    var res = 0
    for (i=0; i<arr1.length; i++) {
        if (arr1[i] == arr2[i])
            res += 1
    }
    return res == arr1.length

}
function isset(cards) {
    //console.log(cards)
    if (equalArray(cards[0], cards[1]))
        return false
    

    ans=0
    for (var j=0; j<4; j++) {
        testarray = []
        forEach(cards, function(card) {testarray.push(card[j])})
        //console.log(testarray)
        if (reduce(function(a,b){return a + b},0,testarray)%3 == 0)
            ans +=1
    }
    //console.log(cards)
    return ans == 4    

}

function removeElement(node) {
  if (node.parentNode)
    node.parentNode.removeChild(node);
}

function convertCardBack(cardArray) {
    if (cardArray == undefined) {
        return undefined
    }
    return cardArray[0]*1 + cardArray[1]*3 + cardArray[2]*9 + cardArray[3]*27
}

function dealThree() {
    console.log(allCards)
    function theDeal() {
        for (var i=0; i<3; i++) {

            var randNum = allCards.pop();
            console.log(allCards)
            var newCard = domCard(randNum);
            var firstDiv = $('div1')
            
            
            firstDiv.childNodes[i+1].appendChild(newCard)
            addEventListeners([(newCard.id)])
            console.log(allCards)
        }
    }
    if (allCards.length >= 3) {
        theDeal()
    }
    console.log('line 353')
    if (!isthereanyset() && allCards.length >= 3) {
        console.log('it worked!!!')
        theDeal()
    }
    realign()   
    endGame()
}


function dealOne(parent) {
    //console.log(allCards)
    var randNum = allCards.pop()
    var newCard = domCard(randNum)
    parent.appendChild(newCard)
    console.log(newCard)
    addEventListeners([(newCard.id)])


    //addEventListeners()
}

function realign() {
    var firstDiv = $('div1')
    var lines = firstDiv.getElementsByTagName('P')
    var arr = []
    forEach(lines,function(a){arr.push(a.childNodes.length)});
    var longLine = arr.indexOf(Math.max(arr[0],arr[1],arr[2]));
    var shortLine = arr.indexOf(Math.min(arr[0],arr[1],arr[2]));
    if (longLine != shortLine) {
        var cardToMove = lines[longLine].lastChild;
        lines[shortLine].appendChild(cardToMove)
    }


}

function endGame() {
    if (allCards.length == 0 && !isthereanyset()){
        var t = $('time').innerHTML;
        alert('game over! Your time is ' + String(t) + ' seconds')
    }
        
}

var setsFound = 0

function removeDeal(cards) {
    setsFound += 1
    $('setsFound').innerHTML = 'Sets found so far: ' + setsFound

    //console.log('cards  ', cards)
    var setcards = []
    for (var i=0; i<3; i++) {
        //arr.push(cards[i]['att0']*1+cards[i]['att1']*3+cards[i]['att2']*9+cards[i]['att3']*27)
        setcards.push(convertCardBack(cards[i]))
        //console.log('setcards array ', setcards)
    }
    endGame()
    //console.log(setcards)
    for (var j=0; j<3; j++) {
        var par = document.getElementById(setcards[j]).parentNode 
 
        par.removeChild(document.getElementById(setcards[j]))

        var firstDiv = $('div1')
        var imgs = firstDiv.getElementsByTagName('IMG')
        if (imgs.length < 12 && allCards.length > 0)
            dealOne(par)
        } 
    realign()
    console.log('about to check for deadboard')
    checkDeadboardAndDeal()
    endGame()      
}

function startgame() {
    dealtwelve()
    
}

function shuffleBoardCards() {
    var cards = $('div1').getElementsByTagName('IMG');
    $('div1').innerHTML = ''
}

    // var longlines = 0
    // for (var i=0; i<3; i++) {
    //     if (pars[i].childNodes.length < 4) {
    //         var min = pars[i].childNodes.length
    //         var shortline = i
    //     }
    //     else if (pars[i].childNodes.length > 4) {
    //         var longline = i
    //         longlines += 1
    //     }
    // }
    // console.log(longlines)
    // console.log(longline)
    // console.log(shortline)
    // if (longlines == 1) {
    //     cardToMove = pars[longline].lastChild
    //     pars[shortline].appendChild(cardToMove)
    // }
    // else if (longlines == 2) {
    //     var longline1;
    //     var longline2;
    //     (shortline == 0) ? longline1 = 1 : longline1 = 0;
    //     (shortline != 2) ? longline2 = 2 : longline2 = 1;
    //     console.log(longline1);
    //     console.log(longline2);
    //     var cardtoMove1 = pars[longline1].lastChild;
    //     var cardtoMove2 = pars[longline2].lastChild;
    //     pars[shortline].appendChild(cardtoMove1);
    //     pars[shortline].appendChild(cardtoMove2);
     
    // }


