exports.connectHomeSocket = function(io, visitCounter, gameStartedTracker){
    io.on('connection', function(socket){
        var route = socket.client.request.headers.referer;
        var page = route.split('/')[route.split('/').length - 1];
        if (visitCounter[page]){
            visitCounter[page] += 1;
        }
        else if (page !== '') {
            //console.log('this step');
            visitCounter[page] = 1; 
            gameStartedTracker[page] = false;   
        }
        //console.log(visitCounter);
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
            //console.log(visitCounter);
            io.emit('player left game', data);
        });
    });
}