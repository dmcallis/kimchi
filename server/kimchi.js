var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser')
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

var paramId;
var collectionName;
var responseCallback;
function callbackHelperGetById(error, requestlibResponse, body, httpResponse, paramId, collectionName)
{
    var success = false;
	if (!error && requestlibResponse.statusCode == 200) {
        var collectionParsed = JSON.parse(body);
        var index = containsKey(collectionParsed, "Id", paramId);
        if (index > -1) {
        	httpResponse.set("Content-type", "application/json");
        	httpResponse.status(200).send(JSON.stringify(collectionParsed[index]));
            success = true
        }
    }
    if (!success)
    {
    	httpResponse.status(400).send(collectionName + " (Id: " + paramId + ") not found");
    }
}

function callbackHelperRemoveById(error, requestlibResponse, body, httpResponse, paramId, collectionUrl, collectionName)
{
    var success = false;
	if (!error && requestlibResponse.statusCode == 200) {
        var collectionParsed = JSON.parse(body);
        var index = containsKey(collectionParsed, "Id", paramId);
        if (index > -1) {
        	requestlib.del(collectionUrl + "/" + collectionParsed[index]._key, function (err, requestlibResponse2, body) {
	        		if (!err && requestlibResponse2.statusCode == 200)
	        		{
	        		    console.log("Delete Success");
	        		}
	        		else
	        		{
	        			console.log(err);
	        		}
	        	});
	        		
	        	httpResponse.status(200).send(collectionName + " (Id: " + paramId + " _key: " + collectionParsed[index]._key + ") is deleted ");
	            success = true;
    	};
	}
    if (!success)
    {
    	httpResponse.status(400).send(collectionName + " (Id: " + paramId + ") not found");
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
	requestlib.get(KimchiBoardLocation + KimchiBoardCollection).pipe(response);
};
 
exports.getBoard = function (request, response) {
	var paramId = request.params.id;
	var collectionName = "Board";
	var collectionUrl = KimchiBoardLocation + KimchiBoardCollection;
	requestlib(collectionUrl, function (error, requestlibResponse, body) {
		callbackHelperGetById(error, requestlibResponse, body, response, paramId, collectionName)
	});
};

exports.addBoard = function (request, response) {
	request.body.pipe(requestlib.post(KimchiBoardLocation + KimchiBoardCollection, function (err, requestlibResponse, body) {
		if (!error && requestlibResponse.statusCode == 200)
		{
		    response.status(200).send("Board created\nData: " + JSON.stringify(request.body));
		}
	}	
	))
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
	var paramId = request.params.id;
	var collectionName = "Board";
	var collectionUrl = KimchiBoardLocation + KimchiBoardCollection;
	requestlib(collectionUrl, function (error, requestlibResponse, body) {
		callbackHelperRemoveById(error, requestlibResponse, body, response, paramId, collectionUrl, collectionName)
	});
};

/* List REST API */

exports.lists = function (request, response) {
	requestlib.get(KimchiBoardLocation + KimchiListCollection).pipe(response);
};

exports.getList = function (request, response) {
	var paramId = request.params.listid;
	var collectionName = "List";
	var collectionUrl = KimchiBoardLocation + KimchiListCollection;
	requestlib(collectionUrl, function (error, requestlibResponse, body) {
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
	var paramId = request.params.listid;
	var collectionName = "List";
	var collectionUrl = KimchiBoardLocation + KimchiListCollection;	
	requestlib(KimchiBoardLocation + KimchiListCollection, function (error, requestlibResponse, body) {
		callbackHelperRemoveById(error, requestlibResponse, body, response, paramId, collectionUrl, collectionName)
	});
};

/* Item REST API */

exports.items = function (request, response) {
	requestlib.get(KimchiBoardLocation + KimchiItemCollection).pipe(response);
};

exports.getItem = function (request, response) {
	var paramId = request.params.itemid;
	var collectionName = "Item";
	var collectionUrl = KimchiBoardLocation + KimchiItemCollection;		
	requestlib(collectionUrl, function (error, requestlibResponse, body) {
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
	var paramId = request.params.itemid;
	var collectionName = "Item";
	var collectionUrl = KimchiBoardLocation + KimchiItemCollection;		
	requestlib(collectionUrl, function (error, requestlibResponse, body) {
		callbackHelperRemoveById(error, requestlibResponse, body, response, paramId, collectionUrl, collectionName)
	});
};
