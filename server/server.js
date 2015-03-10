var http = require("http"),
  fs = require("fs");

http.createServer(function(request, response) {
  fs.readFile("./index.html", "binary", function(err, file) {
    if (err) {
      response.writeHead(500, {"Content-type" : "text/plain"});
      response.end(err + "\n");
      return;
    }
    response.writeHead(200, {"Content-type" : "text/plain"});
    response.end(file, "binary");
  });
}).listen(8080);