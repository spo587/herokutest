exports.connectHomeSocket = function(io, visitCounter, gameStartedTracker){
    io.on('connection', function(socket){
        var route = socket.client.request.headers.referer;
        var page = route.split('/')[route.split('/').length - 1];
        if (visitCounter[page]){
            visitCounter[page] += 1;
            console.log(visitCounter);
        }
        else if (page !== '') {
            //console.log('this step');
            visitCounter[page] = 1; 
            gameStartedTracker[page] = false;   
        }
        console.log(visitCounter);
        var data = {visitCounter: visitCounter, gameStartedTracker: gameStartedTracker};
        console.log('emitting new player');
        io.emit('player joined game', data);
        // socket.on('allPlayers', function(data){
        //     forE
        // })
        socket.on('disconnect', function(){
            var route = socket.client.request.headers.referer;
            var page = route.split('/')[route.split('/').length - 1];
            if (visitCounter[page]){
                visitCounter[page] = visitCounter[page] - 1;
                if (visitCounter[page] === 0){
                    gameStartedTracker[page] = false;
                }
            }
            console.log(visitCounter);
            console.log('emitting leaving player');
            io.emit('player left game', data);
        });
    });
}