var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var requestlib = require('request');
var http = require('http')	
var app = express();

var KimchiBoardHost = "junykimvm8211.redmond.corp.microsoft.com"
var KimchiBoardPort = 8529
var KimchiDatabaseName = "KimchiDatabase";
var KimchiBoardPath = "/_db/" + KimchiDatabaseName + "/Apps/KimchiBoard"
var KimchiBoardLocation = "http://" + KimchiBoardHost +  ":" + KimchiBoardPort + KimchiBoardPath;
var KimchiBoardCollection = "/Boards/Boards";
var KimchiListCollection = "/Lists/Lists";
var KimchiItemCollection = "/Items/Items";

var KimchiLovers = {
    '1395632274085932': 'dmcallis',
    '10153159462322329': 'mordonez',
    '931118926932530': 'jinhoj',
    '870720099651129': 'yongjkim'
}

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

var paramId;
var collectionName;
var responseCallback
function callbackHelperGetById(error, requestlibResponse, body, response, paramId, collectionName)
{
    var success = false;
	if (!error && requestlibResponse.statusCode == 200) {
        var collectionParsed = JSON.parse(body);
        var index = containsKey(collectionParsed, "Id", paramId);
        if (index > -1) {
        	response.set("Content-type", "application/json");
        	response.send(JSON.stringify(collectionParsed[index]));
            success = true
        }
    }
    if (!success)
    {
    	response.status(400).send(collectionName + " (Id: " + paramId + ") not found");
    }
}

function functionHelperUpdate(data, collectionPath, collectionKey)
{	
//	console.log(data);
//	console.log(collectionPath);
//	console.log(collectionKey);
	stringData = JSON.stringify(data);
//	console.log(stringData)
	var headers = {
			  'Content-Type': 'application/json',
			  'Content-Length': stringData.length
			};

	var options = {
	  host: KimchiBoardHost,
	  port: KimchiBoardPort,
	  path: collectionPath + "/" + collectionKey, // '/_db/KimchiDatabase/Apps/KimchiBoard/Boards/Boards/3553081455',
	  method: 'PUT',
	  headers: headers
	};

//	console.log(options)
	var req = http.request(options);
	req.on('error', function(e) {
			console.log(e)
		});

	req.write(stringData);
	req.end();
//	console.log(req);
}

function callbackHelperUpdateById(error, requestlibResponse, body, httpResponse, paramId, collectionPath, collectionName, jsonBody)
{
    var success = false;
	if (!error && requestlibResponse.statusCode == 200) {
        var collectionParsed = JSON.parse(body);
        var index = containsKey(collectionParsed, "Id", paramId);
        if (index > -1) {
        	functionHelperUpdate(jsonBody, collectionPath, collectionParsed[index]._key)
        	httpResponse.status(200).send(collectionName + " (Id: " + paramId + " _key: " + collectionParsed[index]._key + ") is updated ");
        	success = true
    	};
	}
    if (!success)
    {
    	httpResponse.status(400).send(collectionName + " (Id: " + paramId + ") not found");
    }
}
/* Board REST API */

exports.boards = function (request, response) {
    requestlib.get(KimchiBoardLocation + KimchiBoardCollection, function (err, arangoResponse) {
        var boardData = JSON.parse(arangoResponse.body);
        response.set("Content-type", "application/json");
        if (typeof (request.query.userid) == "undefined") {
            response.send(JSON.stringify(boardData));
        }
        else {
            var filteredData = boardData.filter(function (board) {
                if (board.Owner == KimchiLovers[request.query.userid]) {
                    return true
                } else {
                    return false;
                }
            });
            response.send(JSON.stringify(filteredData));
        }
    });
};
 
exports.getBoard = function (request, response) {
	var paramId = request.params.id;
	var collectionName = "Board";
	requestlib(KimchiBoardLocation + KimchiBoardCollection, function (error, requestlibResponse, body) {
		callbackHelperGetById(error, requestlibResponse, body, response, paramId, collectionName)
	});
};

exports.addBoard = function (request, response) {
    response.status(200).send("Board created\nData: " + JSON.stringify(request.body));
};

exports.updateBoard = function (request, response) {
	var paramId = request.params.id;
	var collectionName = "Board";
	var collectionPath = KimchiBoardPath + KimchiBoardCollection
	var collectionUrl = KimchiBoardLocation + KimchiBoardCollection;
	requestlib(collectionUrl, function (error, requestlibResponse, body) {
		callbackHelperUpdateById(error, requestlibResponse, body, response, paramId, collectionPath, collectionName, request.body)
	});
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
    requestlib.get(KimchiBoardLocation + KimchiListCollection, function (err, arangoResponse) {
        var listData = JSON.parse(arangoResponse.body);
        response.set("Content-type", "application/json");
        if (typeof (request.params.id) == "undefined") {
            response.send(JSON.stringify(listData));
        }
        else {
            var filteredData = listData.filter(function (list) {
                if (list.BoardId == request.params.id) {
                    return true
                } else {
                    return false;
                }
            });
            response.send(JSON.stringify(filteredData));
        }
    });
};

exports.getList = function (request, response) {
	var paramId = request.params.listid;
	var collectionName = "List";
	requestlib(KimchiBoardLocation + KimchiListCollection, function (error, requestlibResponse, body) {
		callbackHelperGetById(error, requestlibResponse, body, response, paramId, collectionName)
	});
};

exports.addList = function (request, response) {
    response.status(200).send("List created\nData: " + JSON.stringify(request.body));
};

exports.updateList = function (request, response) {
	var paramId = request.params.listid;
	var collectionName = "List";
	var collectionPath = KimchiBoardPath + KimchiListCollection
	var collectionUrl = KimchiBoardLocation + KimchiListCollection;
	requestlib(collectionUrl, function (error, requestlibResponse, body) {
		callbackHelperUpdateById(error, requestlibResponse, body, response, paramId, collectionPath, collectionName, request.body)
	});
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
	var paramId = request.params.itemid;
	var collectionName = "Item";
	requestlib(KimchiBoardLocation + KimchiItemCollection, function (error, requestlibResponse, body) {
		callbackHelperGetById(error, requestlibResponse, body, response, paramId, collectionName)
	});
};

exports.addItem = function (request, response) {
    response.status(200).send("Item created\nData: " + JSON.stringify(request.body));
};

exports.updateItem = function (request, response) {
	var paramId = request.params.itemid;
	var collectionName = "Item";
	var collectionPath = KimchiBoardPath + KimchiItemCollection
	var collectionUrl = KimchiBoardLocation + KimchiItemCollection;
	requestlib(collectionUrl, function (error, requestlibResponse, body) {
		callbackHelperUpdateById(error, requestlibResponse, body, response, paramId, collectionPath, collectionName, request.body)
	});
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
