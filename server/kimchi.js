var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser')
var requestlib = require('request');
var app = express();

var KimchiBoardLocation = "http://junykimvm8211.redmond.corp.microsoft.com:8529/_db/KimchiDatabase/Apps/KimchiBoard";
var KimchiDatabaseName = "KimchiDatabase";
var KimchiBoardCollection = "/Boards/Boards";
var KimchiListCollection = "/Lists/Lists";
var KimchiItemCollection = "/Items/Items"
	
app.use(bodyParser.json());

function containsKey(collection, key, value) {
    var index = -1;
    try {
        for (var i = 0; i < collection.length; i++) {
            var item = collection[i];
            if (item[key] == value) {
                index = i;
            }
        }
    }
    catch (e) {
        console.log(e);
    }

    return index;
}

try {
    var data;
    data = fs.readFileSync("../website/samplejson/board.json", "UTF-8");
    var boards = JSON.parse(data);
    data = fs.readFileSync("../website/samplejson/list.json", "UTF-8");
    var lists = JSON.parse(data);
    data = fs.readFileSync("../website/samplejson/item.json", "UTF-8");
    var items = JSON.parse(data);
}
catch (e) {
    console.log(e);
}

/* Board REST API */

exports.boards = function (request, response) {
	requestlib.get(KimchiBoardLocation + KimchiBoardCollection).pipe(response);
};
 
exports.getBoard = function (request, response) {
    var index = containsKey(boards, "Id", request.params.id);
    if (index > -1) {
        response.set("Content-type", "application/json");
        response.send(JSON.stringify(boards[index]));
    }
    else {
        response.status(400).send("Board (Id: " + request.params.id + ") not found");
    }
};

exports.addBoard = function (request, response) {
    response.status(200).send("Board created\nData: " + JSON.stringify(request.body));
};

exports.updateBoard = function (request, response) {
    var index = containsKey(boards, "Id", request.params.id);
    if (index > -1) {
        response.status(200).send("Board updated\nData: " + JSON.stringify(boards[index]));
    }
    else {
        response.status(400).send("Board (Id: " + request.params.id + ") not found");
    }
};

exports.deleteBoard = function (request, response) {
    var index = containsKey(boards, "Id", request.params.id);
    if (index > -1) {
        response.status(200).send("Board (Id: " + request.params.id + ") will be deleted by Jun Yong Kim in the near future. : )");
    }
    else {
        response.status(400).send("Board (Id: " + request.params.id + ") not found");
    }
};

/* List REST API */

exports.lists = function (request, response) {
	requestlib.get(KimchiBoardLocation + KimchiListCollection).pipe(response);
};

exports.getList = function (request, response) {
    var index = containsKey(lists, "Id", request.params.listid);
    if (index > -1) {
        response.set("Content-type", "application/json");
        response.send(JSON.stringify(lists[index]));
    }
    else {
        response.status(400).send("List (Id: " + request.params.listid + ") not found");
    }
};

exports.addList = function (request, response) {
    response.status(200).send("List created\nData: " + JSON.stringify(request.body));
};

exports.updateList = function (request, response) {
    var index = containsKey(lists, "Id", request.params.listid);
    if (index > -1) {
        response.status(200).send("List updated\nData: " + JSON.stringify(lists[index]));
    }
    else {
        response.status(400).send("List (Id: " + request.params.listid + ") not found");
    }
};

exports.deleteList = function (request, response) {
    var index = containsKey(lists, "Id", request.params.listid);
    if (index > -1) {
        response.status(200).send("List (Id: " + request.params.listid + ") will be deleted by Jun Yong Kim in the near future. : )");
    }
    else {
        response.status(400).send("List (Id: " + request.params.listid + ") not found");
    }
};

/* Item REST API */

exports.items = function (request, response) {
	requestlib.get(KimchiBoardLocation + KimchiItemCollection).pipe(response);
};

exports.getItem = function (request, response) {
    var index = containsKey(items, "Id", request.params.itemid);
    if (index > -1) {
        response.set("Content-type", "application/json");
        response.send(JSON.stringify(items[index]));
    }
    else {
        response.status(400).send("Item (Id: " + request.params.itemid + ") not found");
    }
};

exports.addItem = function (request, response) {
    response.status(200).send("Item created\nData: " + JSON.stringify(request.body));
};

exports.updateItem = function (request, response) {
    var index = containsKey(items, "Id", request.params.itemid);
    if (index > -1) {
        response.status(200).send("Item updated\nData: " + JSON.stringify(items[index]));
    }
    else {
        response.status(400).send("Item (Id: " + request.params.itemid + ") not found");
    }
};

exports.deleteItem = function (request, response) {
    var index = containsKey(items, "Id", request.params.itemid);
    if (index > -1) {
        response.status(200).send("Item (Id: " + request.params.itemid + ") will be deleted by Jun Yong Kim in the near future. : )");
    }
    else {
        response.status(400).send("Item (Id: " + request.params.itemid + ") not found");
    }
};
