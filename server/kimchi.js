var fs = require('fs');

function contains(key, value) {
    return true;
}

try {
    var data = fs.readFileSync("../website/samplejson/board.json", "UTF-8");
    var boards = JSON.parse(data);
}
catch (e) {
    console.log(e);
}

exports.boards = function (request, response) {
    response.set("Content-type", "application/json");
    response.send(JSON.stringify(boards));
};
 
exports.getBoard = function (request, response) {
    for (var i = 0; i < boards.length; i++) {
        if (boards[i].Id == request.params.id) {
            response.set("Content-type", "application/json");
            response.send(JSON.stringify(boards[i]));
            return;
        }
    }

    response.status(400).send("Board (Id: " + request.params.id + ") not found");
};

exports.addBoard = function (request, response) {
    var board = JSON.parse(request.body);
    response.status(200).send("Board created\nData: " + JSON.stringify(board));
};

exports.updateBoard = function (request, response) {
    for (var i = 0; i < boards.length; i++) {
        if (boards[i].Id == request.params.id) {
            response.status(200).send("Board updated\nData: " + JSON.stringify(board));
            return;
        }
    }

    response.status(400).send("Board (Id: " + request.params.id + ") not found");
};

exports.deleteBoard = function (request, response) {
    for (var i = 0; i < boards.length; i++) {
        if (boards[i].Id == request.params.id) {
            response.status(200).send("Board (Id: " + request.params.id + ") will be deleted by Jun Yong Kim in the near future. : )");
            return;
        }
    }

    response.status(400).send("Board (Id: " + request.params.id + ") not found");
};
