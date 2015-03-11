exports.boards = function (request, response) {
    response.send("Get Boards")
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
