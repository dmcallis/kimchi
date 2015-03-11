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

var request = require('request');
request('http://junykimvm8211.redmond.corp.microsoft.com:8529/_db/KimchiDatabase/Apps/KimchiBoard/Boards/Boards', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body) // Print the google web page.
     }
})