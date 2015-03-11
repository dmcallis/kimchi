var fs = require('fs');

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

exports.boards = function (request, response) {
    response.set("Content-type", "application/json");
    response.send(JSON.stringify(boards));
};
 
exports.getBoard = function (request, response) {
    var index = containsKey(boards, "Id", request.params.id);
    if (index > -1) {
        response.set("Content-type", "application/json");
        response.send(JSON.stringify(boards[index]));
    }
    else {
        response.status(400).send("Board (Id: " + request.params.id + ") not found");
    }
};

exports.addBoard = function (request, response) {
    var board = JSON.parse(request.body);
    response.status(200).send("Board created\nData: " + JSON.stringify(board));
};

exports.updateBoard = function (request, response) {
    var index = containsKey(boards, "Id", request.params.id);
    if (index > -1) {
        response.status(200).send("Board updated\nData: " + JSON.stringify(board));
    }
    else {
        response.status(400).send("Board (Id: " + request.params.id + ") not found");
    }
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
