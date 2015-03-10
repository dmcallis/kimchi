var http = require("http"),
  fs = require("fs");

http.createServer(function(request, response) {
  fs.readFile("./../website/index.html", function(err, file) {
    if (err) {
      response.writeHead(500, {"Content-type" : "text/plain"});
      response.end(err + "\n");
      return;
    }
    response.writeHead(200, {"Content-type" : "text/html"});
    response.write(file);
    response.end();
  });
}).listen(8080);