

function clearSet(delay){
    var set = SETBOARD.isThereASet();
    for (var i = 0; i < 3; i++){
        //SETBOARD.registerClick(set[i])
        setTimeout(
            (function(s){
                return function(){
                    SETBOARD.registerClick(s);
                }
            })(set[i]), delay);
        delay += delay;

    }
        
    // for (var i = 0; i < set.length; i++){
    //     setTimeout(function(){
    //         SETBOARD.registerClick(set[i]);
    //     }, delay * i);
    // }
}


function compPlays(delay){

    setInterval(function(){
        clearSet(delay)
    }, 4000);
}



