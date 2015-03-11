(function () {
  'use strict';
  var Foxx = require('org/arangodb/foxx'),
    ArangoError = require('org/arangodb').ArangoError,
    boards = require('repositories/Boards').Repository,
    Board = require('models/Board').Model,
    joi = require('joi'),
    _ = require('underscore'),
    controller,
    BoardDescription = {
      type: joi.string().required().description(
        'The id of the Board-Item'
      ),
      allowMultiple: false
    },
    Boards;

  controller = new Foxx.Controller(applicationContext);

  Boards = new boards(applicationContext.collection('Boards'), {
    model: Board
  });

  /** Lists of all Board
   *
   * This function simply returns the list of all Board.
   */
  controller.get('/Boards', function (req, res) {
    res.json(_.map(Boards.all(), function (model) {
      return model.forClient();
    }));
  });

  /** Creates a new Board
   *
   * Creates a new Board-Item. The information has to be in the
   * requestBody.
   */
  controller.post('/Boards', function (req, res) {
    var board = req.params('board');
    res.json(Boards.save(board).forClient());
  }).bodyParam('board', {
    description: 'The Board you want to create',
    type: Board
  });

  /** Reads a Board
   *
   * Reads a Board-Item.
   */
  controller.get('/Boards/:id', function (req, res) {
    var id = req.params('id');
    res.json(Boards.byId(id).forClient());
  }).pathParam('id', BoardDescription);

  /** Updates a Board
   *
   * Changes a Board-Item. The information has to be in the
   * requestBody.
   */
  controller.put('/Boards/:id', function (req, res) {
    var id = req.params('id'),
    board = req.params('board');
    res.json(Boards.replaceById(id, board));
  }).pathParam('id', BoardDescription
  ).bodyParam('board', 'The Board you want your old one to be replaced with', Board);

  /** Removes a Board
   *
   * Removes a Board-Item.
   */
  controller.del('/Boards/:id', function (req, res) {
    var id = req.params('id');
    Boards.removeById(id);
    res.json({ success: true });
  }).pathParam('id', BoardDescription
  ).errorResponse(ArangoError, 404, 'The document could not be found');
}());

