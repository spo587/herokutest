//helper functions for arrays and creating dom objects

function equalArray(arr1,arr2) {
    var res = 0;
    for (i=0; i<arr1.length; i++) {
        if (arr1[i] === arr2[i])
            res += 1
    }
    return res === arr1.length
}

function arraysEqual(a1,a2) {
    return JSON.stringify(a1) == JSON.stringify(a2);
}


function reduce(combine, base, array) {
    forEach(array, function(element) {
        base = combine(base, element)
    })
    return base;
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

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// Get the size of an object
//var size = Object.size(myArray);

function forEachIn(object, func) {
    for (var property in object) {
        if (object.hasOwnProperty(property))
            func(property, object[property]);
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
    ////console.log(child);
    var child = arguments[i];
    if (typeof child === "string"){
      child = document.createTextNode(child);
    node.appendChild(child);
    }
  }
  return node;
}

function arraysSameElements(arr1, arr2){
    var answers = [];
    arr1.forEach(function(c){
        if (arr2.indexOf(c) != -1){ //arr2 also contains c
            answers.push(true);
        }
        else {
            answers.push(false);
            //console.log(c);
        }
    });
    return answers.indexOf(false) === -1;
}
