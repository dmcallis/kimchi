var express = require('express');
var kimchi = require('./kimchi');
var app = express();
  
app.use('/', '/../website');
app.use(express.static(__dirname + '/../website/'));

app.get('/boards', kimchi.boards);
app.post('/boards', kimchi.addBoard);
app.get('/boards/:id', kimchi.getBoard);
app.put('/boards/:id', kimchi.updateBoard);
app.delete('/boards/:id', kimchi.deleteBoard);

app.listen(8080);


