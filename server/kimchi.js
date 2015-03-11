var fs = require('fs')

exports.boards = function (request, response) {
    try {
        var data = fs.readFileSync("../website/samplejson/board.json", "UTF-8")
        response.send(data)
    }
    catch(e) { console.log(e) }
};
 
exports.getBoard = function(request, response) {
    response.send("Get Board: " + request.params.id)
};

exports.addBoard = function (request, response) {
    response.send("Add Board: " + request.body)
};

exports.updateBoard = function (request, response) {
    response.send("Update Board: " + request.params.id)
};

exports.deleteBoard = function (request, response) {
    response.send("Delete Board: " + request.params.id)
};
