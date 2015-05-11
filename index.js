
var set = require('./set');

var express = require('express');

var fs = require('fs');

var app = express();

app.get('/', function(req, res){
    var file = fs.createReadStream('./set.html');
    file.pipe(res);

});

var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});