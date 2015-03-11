var express = require('express');
var app = express();

app.use('/', '/../website')
app.use(express.static(__dirname + '/../website/'))

app.listen(8080);