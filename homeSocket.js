exports.connectHomeSocket = function(io, visitCounter, gameStartedTracker){
    io.on('connection', function(socket){
        //console.log('homesocket event fired');  
        //socket.join('home room');
        //url the ping came from
        var route = socket.client.request.headers.referer;
        //get the extension
        var page = route.split('/')[route.split('/').length - 1];

        if (visitCounter[page]){
            visitCounter[page] += 1;
        }
        else if (page !== '') { //not the home page, ie
            visitCounter[page] = 1; 
            gameStartedTracker[page] = false;   
        }
        
        var data = {visitCounter: visitCounter, gameStartedTracker: gameStartedTracker};
 
        io.emit('player joined game', data);

        socket.on('disconnect', function(){
            var route = socket.client.request.headers.referer;
            var page = route.split('/')[route.split('/').length - 1];
            if (visitCounter[page]){
                visitCounter[page] = visitCounter[page] - 1;
                if (visitCounter[page] === 0){
                    gameStartedTracker[page] = false;
                }
            }
            io.emit('player left game', data);
        });
    });
}