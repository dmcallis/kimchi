function TestRequest()
{
var request = require('request');
var async = require("async")
var bodyGet
request('http://junykimvm8211.redmond.corp.microsoft.com:8529/_db/KimchiDatabase/Apps/KimchiBoard/Items/Items', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body); // Print the google web page.
        bodyGet = body
    }    
})

var response = request.get('http://junykimvm8211.redmond.corp.microsoft.com:8529/_db/KimchiDatabase/Apps/KimchiBoard/Boards/Boards');
if (response.response.statusCode == 200)
	{
	
	}
//var bodyJSON = JSON.parse(response.body);
//console.log(bodyJSON);
}

TestRequest()

function TestRequest2()
{
var querystring = require('querystring');
var https = require('https');

var optionsget = {
	    host : 'junykimvm8211.redmond.corp.microsoft.com', 
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


