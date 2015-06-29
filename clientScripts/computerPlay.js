//i may need to rewrite some of these as well

function clearSet(){
    var set = SETBOARD.isThereASet();
    set.forEach(function(card){
        SETBOARD.registerClick(card);
    });
    // for (var i = 0; i < set.length; i++){
    //     setTimeout(function(){
    //         SETBOARD.registerClick(set[i]);
    //     }, delay * i);
    // }
}

function playGameArtificial(clearDelay){
    //if (CARDCOUNT < 81){
    setTimeout(clearSet, clearDelay);
}

function compPlays(clearDelay){
    for (var i=0; i < 27; i += 1){
        var k = setTimeout(function(){
            playGameArtificial(clearDelay);
        }, clearDelay * i + 1000);
    }
}


