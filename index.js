
var set = require('./set');

var express = require('express');

var fs = require('fs');

var app = express();

app.get('/set', function(req, res){
    var file = fs.createReadStream('./set.html');
    file.pipe(res);

}).listen(8080)