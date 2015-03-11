var express = require('express');
var bodyParser = require('body-parser')
var kimchi = require('./kimchi');
var app = express();
  
app.use('/', '/../website');
app.use(express.static(__dirname + '/../website/'));
app.use(bodyParser.json());

app.get('/boards', kimchi.boards);
app.post('/boards', kimchi.addBoard);
app.get('/boards/:id', kimchi.getBoard);
app.put('/boards/:id', kimchi.updateBoard);
app.delete('/boards/:id', kimchi.deleteBoard);

app.get('/boards/:id/lists', kimchi.lists);
app.post('/boards/:id/lists', kimchi.addList);
app.get('/boards/:id/lists/:listid', kimchi.getList);
app.put('/boards/:id/lists/:listid', kimchi.updateList);
app.delete('/boards/:id/lists/:listid', kimchi.deleteList);

app.listen(8080);
console.log('Kimchi server running at http://127.0.0.1:8080/...');

