//var boardsurl = 'http://junykimvm8211.redmond.corp.microsoft.com:8529/_db/KimchiDatabase/Apps/KimchiBoard/Boards/Boards'
var boardsurl = 'http://127.0.0.1:8529/_db/KimchiDatabase/Apps/KimchiBoard/Boards/Boards'
//TestRequest()
//TestRequestById()
//TestRemove()

//TestAddBoard2()
//TestAddBoard()

TestLinq()
function TestLinq()
{
	var jsonQuery = require("json-query");
	var fs = require('fs');
    data = fs.readFileSync("./Website/samplejson/list.json", "UTF-8");
    console.log(data);
    data = fs.readFileSync("./Playground/test.json", "UTF-8");
    console.log(data);
    var collectionParsed = JSON.parse(data);
    var result = jsonQuery('[BoardId=1]', {data: collectionParsed})
    console.log(result.value);
    var result2 = jsonQuery('[ListId=0]', {data: result.references})
    console.log(result2.value);
}



function TestAddBoard()
{
    var arangojs = require('arangojs');
	var fs = require('fs');
    data = fs.readFileSync("./Playground/test.json", "UTF-8");
    console.log(data);

	dbManager = new arangojs(url= 'http://junykimvm8211.redmond.corp.microsoft.com:8529', databaseName= 'KimchiDatabase');
	dbManager.database('KimchiDatabase', function (err, kimchiDatabase){
		kimchiDatabase.collection("Apps_KimchiBoard_Boards", false, function (err, gotCollection) {
				  if (err) {
				    console.log('error: %j', err);
				  } else {
				    console.log('Collection retrieved: %j', 
				      gotCollection.name);
				  gotCollection.save(data, function (err, doc) {
			            if (err) {console.error(err);}
			            else
			            	{
				            console.log(doc._key);
				            console.log(doc);
				            doc._key; // the document's key 
			            	}
				  }
	
						  )
				  }
				});
	})
	return
	
	var requestlib = require('request');
	var fs = require('fs');
	var http = require('http')	
    data = fs.readFileSync("./Playground/test.json", "UTF-8");
    console.log(data);
    database = new arangojs 
    
/*   fs.createReadStream('./Playground/test.json', "UTF-8").pipe(requestlib.put(boardsurl+'/3553081455', function (err, requestlibResponse, body) {
		if (!err && requestlibResponse.statusCode == 200)
		{
		    console.log(body);
		}
		else
		{
			//console.log(err);
			console.log(err);
		}
    }));
    
    return 
*/    
    var jsonData = JSON.parse(data)
	
	var headers = {
			  'Content-Type': 'application/json',
			  'Content-Length': data.length
			};

	var options = {
	  host: '127.0.0.1',
	  port: 8529,
	  path: '/_db/KimchiDatabase/Apps/KimchiBoard/Boards/Boards',
	  method: 'POST',
	  headers: headers
	};

	var req = http.request(options, function(res) {
		  res.setEncoding('utf-8');
		  var responseString = '';
		  res.on('data', function(data) {
		    responseString += data;
		  });

		  res.on('end', function() {
		    var resultObject = JSON.parse(responseString);
		  });
		});

		req.on('error', function(e) {
		  // TODO: handle error.
			console.log(e)
		});

	req.write(data);
	req.end();
}

function TestUpdateBoardNotWorking()
{
	var requestlib = require('request');
	var fs = require('fs');
	var http = require('http')	
    data = fs.readFileSync("./Playground/test.json", "UTF-8");
    console.log(data);
    requestlib(
		    { method: 'PUT'
		    , preambleCRLF: true
		    , postambleCRLF: true
		    , uri: boardsurl + '/3553081455'
		    , encoding: 'utf8'
		    , multipart:
		      [ { 'content-type': 'application/json'
		        ,  body: JSON.stringify(data)
		        }
		      ]
		    }
		  , function (error, response, body) {
		      if(response.statusCode == 201){
		        console.log('document saved')
		        console.log(body)
		      } else {
		        console.log('error: '+ response.statusCode)
		        console.log(response)
		        console.log(body)
		      }
		    }
		  );
}

function TestUpdateBoardWorks()
{
	var requestlib = require('request');
	var fs = require('fs');
	var http = require('http')	
    data = fs.readFileSync("./Playground/test.json", "UTF-8");
    console.log(data);
/*   fs.createReadStream('./Playground/test.json', "UTF-8").pipe(requestlib.put(boardsurl+'/3553081455', function (err, requestlibResponse, body) {
		if (!err && requestlibResponse.statusCode == 200)
		{
		    console.log(body);
		}
		else
		{
			//console.log(err);
			console.log(err);
		}
    }));
    
    return 
*/    
    var jsonData = JSON.parse(data)
	
	var headers = {
			  'Content-Type': 'application/json',
			  'Content-Length': data.length
			};

	var options = {
	  host: '127.0.0.1',
	  port: 8529,
	  path: '/_db/KimchiDatabase/Apps/KimchiBoard/Boards/Boards/3553081455',
	  method: 'PUT',
	  headers: headers
	};

	var req = http.request(options, function(res) {
		  res.setEncoding('utf-8');
		  var responseString = '';
		  res.on('data', function(data) {
		    responseString += data;
		  });

		  res.on('end', function() {
		    var resultObject = JSON.parse(responseString);
		  });
		});

		req.on('error', function(e) {
		  // TODO: handle error.
			console.log(e)
		});

	req.write(data);
	req.end();
}


function TestUpdateBoard2()
{
	var requestlib = require('request');
	var fs = require('fs');
    var data;
    data = fs.readFileSync("./Playground/test.json", "UTF-8");
    console.log(data)
    requestlib.put(boardsurl+'/3553081455', data, function (err, requestlibResponse, body) {
		if (!err && requestlibResponse.statusCode == 200)
		{
		    console.log("Board updated\nData: " + body);
		}
		else
		{
			//console.log(err);
			console.log(err);
		}
	})
}


function TestAddBoard2()
{
	var requestlib = require('request');
	var fs = require('fs');
	var http = require('http')
	fs.createReadStream('./website/samplejson/board.json').pipe(requestlib.put(boardsurl))
	
	data = fs.readFileSync("./website/samplejson/board.json", "UTF-8");
	//console.log(data);
	var jsonData = JSON.parse(data)
	
	var headers = {
			  'Content-Type': 'application/json',
			  'Content-Length': jsonData.length
			};

	var options = {
	  host: '127.0.0.1',
	  port: 8529,
	  path: '/_db/KimchiDatabase/Apps/KimchiBoard/Boards/Boards',
	  method: 'POST',
	  headers: headers
	};

	var req = http.request(options, function(res) {
		  res.setEncoding('utf-8');

		  var responseString = '';

		  res.on('data', function(data) {
		    responseString += data;
		  });

		  res.on('end', function() {
		    var resultObject = JSON.parse(responseString);
		  });
		});

		req.on('error', function(e) {
		  // TODO: handle error.
			console.log("hey failed")
		});

	req.write(data);
	req.end();
	return
	
//    console.log(data);
//	fs.createReadStream("./website/samplejson/board.json").pipe(requestlib.post(boardsurl, function (err, requestlibResponse, body) {
	headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
	requestlib.post(boardsurl, data, function (err, requestlibResponse, body) {
		if (!err && requestlibResponse.statusCode == 200)
		{
		    console.log("Board created\nData: " + body);
		}
		else
		{
			//console.log(err);
			console.log(requestlibResponse.statusCode);
		}
	});
	
    return 
	fs.createReadStream("./website/samplejson/board.json", "UTF-8").pipe(requestlib.post(boardsurl, function (err, requestlibResponse, body) {
		if (!err && requestlibResponse.statusCode == 200)
		{
		    console.log("Board created\nData: " + body);
		}
		else
		{
			//console.log(err);
			console.log(requestlibResponse.statusCode);
		}
	}));
}


function TestAddBoardNotWorking()
{
	var requestlib = require('request');
	var fs = require('fs');
	fs.createReadStream("./website/samplejson/board.json", "UTF-8").pipe(requestlib.post(boardsurl, function (err, requestlibResponse, body) {
		if (!err && requestlibResponse.statusCode == 200)
		{
		    console.log("Board created\nData: " + body);
		}
		else
		{
			//console.log(err);
			console.log(requestlibResponse.statusCode);
		}
	}))
}

function TestRemove()
{
	var requestlib = require('request');
	var fs = require('fs');
	requestlib.del(boardsurl + "/10563588853", function (err, requestlibResponse, body) {
		if (!err && requestlibResponse.statusCode == 200)
		{
		    console.log("Delete Success");
		}
		else
		{
			//console.log(err);
			console.log(requestlibResponse.statusCode);
		}
	});
}



function TestRequestById()
{
var request = require('request');
var async = require("async")
var paramId = 0
request(boardsurl, function (error, reqResponse, body) {
    if (!error && reqResponse.statusCode == 200) {
//        console.log(body); // Print Body
        var boardsCollection = JSON.parse(body);
        var index = containsKey(boardsCollection, "Id", paramId);
        if (index > -1) {
            console.log(JSON.stringify(boardsCollection[index]));
        }
        else {
            colsole.log("Board (Id: " + paramId + ") not found");
        }
    }    
})
}

function TestRequest()
{
	var request = require('request');
	var async = require("async")
	var bodyGet
	request(boardsurl, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        console.log(body); // Print the google web page.
	        bodyGet = body
	    }
	});

//var response = request.get('http://junykimvm8211.redmond.corp.microsoft.com:8529/_db/KimchiDatabase/Apps/KimchiBoard/Boards/Boards');
//if (response.response.statusCode == 200)
//	{
	
//	}
//var bodyJSON = JSON.parse(response.body);
//console.log(bodyJSON);
}

function TestRequest2()
{
var querystring = require('querystring');
var https = require('https');

var optionsget = {
	    host : '127.0.0.1', 
	    port : 8529,
	    path : '/_db/KimchiDatabase/Apps/KimchiBoard/Boards/Boards',
	    method : 'GET'
	};

var reqGet = https.request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
  console.log("headers: ", res.headers);


    res.on('data', function(d) {
        console.info('GET result:\n');
        process.stdout.write(d);
        console.info('\n\nCall completed');
    });

});

reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});

}


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

