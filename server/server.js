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

app.get('/lists', kimchi.lists);
app.post('/lists', kimchi.addList);
app.get('/lists/:listid', kimchi.getList);
app.put('/lists/:listid', kimchi.updateList);
app.delete('/lists/:listid', kimchi.deleteList);

app.get('/boards/:id/lists/:listid/items', kimchi.items);
app.post('/boards/:id/lists/:listid/items', kimchi.addItem);
app.get('/boards/:id/lists/:listid/items/:itemid', kimchi.getItem);
app.put('/boards/:id/lists/:listid/items/:itemid', kimchi.updateItem);
app.delete('/boards/:id/lists/:listid/items/:itemid', kimchi.deleteItem);

app.get('/lists/:listid/items', kimchi.items);
app.post('/lists/:listid/items', kimchi.addItem);
app.get('/lists/:listid/items/:itemid', kimchi.getItem);
app.put('/lists/:listid/items/:itemid', kimchi.updateItem);
app.delete('/lists/:listid/items/:itemid', kimchi.deleteItem);

app.listen(8080);
console.log('Kimchi server running at http://127.0.0.1:8080/...');

