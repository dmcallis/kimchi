var express = require('express');
var bodyParser = require('body-parser');
var requestlib = require('request');
var http = require('http');
var arangojs = require('arangojs');
var jsonQuery = require("json-query");
var app = express();

var KimchiBoardHost = "junykimvm8211.redmond.corp.microsoft.com"
var KimchiBoardPort = 8529
var KimchiDatabaseName = "KimchiDatabase";
var KimchiBoardPath = "/_db/" + KimchiDatabaseName + "/Apps/KimchiBoard"
var KimchiServerLocation = "http://" + KimchiBoardHost +  ":" + KimchiBoardPort
var KimchiBoardLocation = KimchiServerLocation + KimchiBoardPath;
var KimchiBoardCollection = "/Boards/Boards";
var KimchiBoardCollectioName = "Apps_KimchiBoard_Boards";
var KimchiListCollection = "/Lists/Lists";
var KimchiListCollectioName = "Apps_KimchiBoard_Lists";
var KimchiItemCollection = "/Items/Items";
var KimchiItemCollectioName = "Apps_KimchiBoard_Items";

var KimchiLovers = {
    '1395632274085932': 'dmcallis',
    '10153159462322329': 'mordonez',
    '931118926932530': 'jinhoj',
    '870720099651129': 'yongjkim',
    '10153859581274298': 'junykim'
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

function callbackHelperGetById(error, requestlibResponse, body, httpResponse, paramId, collectionName)
{
    var success = false;
	if (!error && requestlibResponse.statusCode == 200) {
		httpResponse.set("Content-type", "application/json");
    	httpResponse.send(body);
    	success = true;
    }
    if (!success)
    {
        httpResponse.status(400).send({ "Result": collectionName + " (Id " + paramId + ") not found" });
    }
}

function callbackHelperGetById2(error, requestlibResponse, body, httpRequest, httpResponse, collectionName)
{
    var success = false;
	var boardId = (typeof (httpRequest.params.id) == "undefined") ? null : httpRequest.params.id;
	var listId = (typeof (httpRequest.params.listid) == "undefined") ? null : httpRequest.params.listid;
	var itemId = (typeof (httpRequest.params.itemid) == "undefined") ? null : httpRequest.params.itemid;
	var paramString = "";
	if (!error && requestlibResponse.statusCode == 200)
	{
	    var collectionParsed = JSON.parse(body);
	    var resultJSON = collectionParsed;
    }
    if (itemId != null)
	{
		paramString = "ItemId[" + itemId + "] " + paramString;
	}
    
	if (listId != null)
	{
		paramString = "ListId[" + listId + "] " + paramString;
		if (itemId != null && collectionParsed != null)
		{
			if (collectionParsed["ListId"] != listId)
			{
				resultJSON = null;
			}
		}
	}
	
    if (boardId != null)
    {
		paramString = "BoardId[" + boardId + "] " + paramString;
		if ((itemId != null || listId != null) && collectionParsed != null)
		{
			if (collectionParsed["BoardId"] != boardId)
			{
				resultJSON = null;
			}
		}
    }

    if (resultJSON != null) {
    	httpResponse.set("Content-type", "application/json");
    	httpResponse.send(JSON.stringify(resultJSON));
    	success = true;
    }

	if (!success)
    {
        httpResponse.status(400).send({ "Result": collectionName + " ( " + paramString + ") not found" });
    }
}


function functionHelperUpdate(data, collectionPath, collectionKey)
{
	stringData = JSON.stringify(data);
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

        // TODO: Id or _key?
        var index = containsKey(collectionParsed, /* "Id" */ "_key", paramId);
        if (index > -1) {
        	functionHelperUpdate(jsonBody, collectionPath, collectionParsed[index]._key)
        	httpResponse.status(200).send({ "Result": collectionName + " (Id " + paramId + " _key " + collectionParsed[index]._key + ") is updated ", "Key": collectionParsed[index]._key });
        	success = true;
    	};
	}
    if (!success)
    {
        httpResponse.status(400).send({ "Result": collectionName + " (Id " + paramId + ") not found" });
    }
}

function callbackHelperAddObject(request, response, serverUrl, databaseName, collectionName)
{
    request.body['Owner'] = KimchiLovers[request.query.userid];
    request.body['CreatedDate'] = new Date().toLocaleString();
    request.body['ModifiedDate'] = new Date().toLocaleString();
    stringData = JSON.stringify(request.body);
	dbManager = new arangojs(serverUrl);
	dbManager.database(databaseName, function (err, kimchiDatabase){
		kimchiDatabase.collection(collectionName, false, function (err, gotCollection) {
		  if (err) {
		    console.log('error: %j', err);
		  } else {
		    console.log('Collection retrieved: %j',
		      gotCollection.name);
		  gotCollection.save(stringData, function (err, doc) {
	            if (err) {
	            	console.error(err);
	            	response.status(400).send({ "Result": "Failed to create new item for " + collectionName + ", Err " + err });

	            } else {
	                response.status(200).send({ "Result": "new item created for " + collectionName, "Key": doc._key });
		            console.log(doc._key);
		            console.log(doc);
		            doc._key; // the document's key
	            	}
		  		});
		  	}
		});
	})
}

function callbackHelperRemoveById(error, requestlibResponse, body, httpResponse, paramId, collectionUrl, collectionName)
{
    var success = false;
	if (!error && requestlibResponse.statusCode == 200) {
        var collectionParsed = JSON.parse(body);

        // TODO: Id or _key?
        var index = containsKey(collectionParsed, /*"Id"*/ "_key", paramId);
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

        	httpResponse.status(200).send({ "Result": collectionName + " (Id " + paramId + " _key " + collectionParsed[index]._key + ") is deleted", "Key": collectionParsed[index]._key });
	            success = true;
    	};
	}
    if (!success)
    {
        httpResponse.status(400).send({ "Result": collectionName + " (Id " + paramId + ") not found" });
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
	var collectionName = KimchiBoardCollectioName;
	var collectionUrl = KimchiBoardLocation + KimchiBoardCollection;
	var objectUrl = collectionUrl + '/' + paramId;
	requestlib(objectUrl, function (error, requestlibResponse, body) {
		callbackHelperGetById2(error, requestlibResponse, body, request, response, collectionName)
	});
};

exports.addBoard = function (request, response) {
	var serverUrl = KimchiServerLocation;
	var databaseName = KimchiDatabaseName;
	var collectionName = KimchiBoardCollectioName;
	callbackHelperAddObject(request, response, serverUrl, databaseName, collectionName);
};

exports.updateBoard = function (request, response) {
	var paramId = request.params.id;
	var collectionName = KimchiBoardCollectioName;
	var collectionPath = KimchiBoardPath + KimchiBoardCollection
	var collectionUrl = KimchiBoardLocation + KimchiBoardCollection;
	requestlib(collectionUrl, function (error, requestlibResponse, body) {
		callbackHelperUpdateById(error, requestlibResponse, body, response, paramId, collectionPath, collectionName, request.body)
	});
};

exports.deleteBoard = function (request, response) {
	var paramId = request.params.id;
	var collectionName = KimchiBoardCollectioName;
	var collectionUrl = KimchiBoardLocation + KimchiBoardCollection;
	requestlib(collectionUrl, function (error, requestlibResponse, body) {
		callbackHelperRemoveById(error, requestlibResponse, body, response, paramId, collectionUrl, collectionName)
	});
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
	var collectionName = KimchiListCollectioName;
	var collectionUrl = KimchiBoardLocation + KimchiListCollection;
	var objectUrl = collectionUrl + '/' + paramId;
	requestlib(objectUrl, function (error, requestlibResponse, body) {
		callbackHelperGetById2(error, requestlibResponse, body, request, response, collectionName)
	});
};

exports.addList = function (request, response) {
	var serverUrl = KimchiServerLocation;
	var databaseName = KimchiDatabaseName;
	var collectionName = KimchiListCollectioName;

	request.body['BoardId'] = request.params.id;
	callbackHelperAddObject(request, response, serverUrl, databaseName, collectionName);
};

exports.updateList = function (request, response) {
	var paramId = request.params.listid;
	var collectionName = KimchiListCollectioName;
	var collectionPath = KimchiBoardPath + KimchiListCollection
	var collectionUrl = KimchiBoardLocation + KimchiListCollection;
	requestlib(collectionUrl, function (error, requestlibResponse, body) {
		callbackHelperUpdateById(error, requestlibResponse, body, response, paramId, collectionPath, collectionName, request.body)
	});
};

exports.deleteList = function (request, response) {
	var paramId = request.params.listid;
	var collectionName = KimchiListCollectioName;
	var collectionUrl = KimchiBoardLocation + KimchiListCollection;
	requestlib(KimchiBoardLocation + KimchiListCollection, function (error, requestlibResponse, body) {
		callbackHelperRemoveById(error, requestlibResponse, body, response, paramId, collectionUrl, collectionName)
	});
};

/* Item REST API */

exports.items = function (request, response) {
	//requestlib.get(KimchiBoardLocation + KimchiItemCollection).pipe(response);
    requestlib.get(KimchiBoardLocation + KimchiItemCollection, function (err, arangoResponse) {
        var itemData = JSON.parse(arangoResponse.body);
        response.set("Content-type", "application/json");
        if (typeof (request.params.listid) == "undefined") {
            response.send(JSON.stringify(itemData));
        }
        else {
            var filteredData = listData.filter(function (item) {
                if (item.ListId == request.params.listid) {
                    return true
                } else {
                    return false;
                }
            });
            response.send(JSON.stringify(filteredData));
        }
    });
};

exports.getItem = function (request, response) {
	var paramId = request.params.itemid;
	var collectionName = KimchiItemCollectioName;
	var collectionUrl = KimchiBoardLocation + KimchiItemCollection;
	var objectUrl = collectionUrl + '/' + paramId;
	requestlib(objectUrl, function (error, requestlibResponse, body) {
		callbackHelperGetById2(error, requestlibResponse, body, request, response, collectionName);
	});
};

exports.addItem = function (request, response) {
	var serverUrl = KimchiServerLocation;
	var databaseName = KimchiDatabaseName;
	var collectionName = KimchiItemCollectioName;

	request.body['ListId'] = request.params.listid;
	callbackHelperAddObject(request, response, serverUrl, databaseName, collectionName);
};

exports.updateItem = function (request, response) {
	var paramId = request.params.itemid;
	var collectionName = KimchiItemCollectioName;
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

exports.updateItemOrder = function (request, response)
{
	var orderedItems = request.body.orderedItems;
	console.log('updating order of items for list to:');
	console.log(orderedItems);
}
