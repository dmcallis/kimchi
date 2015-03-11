(function () {
  'use strict';
  var Foxx = require('org/arangodb/foxx'),
    ArangoError = require('org/arangodb').ArangoError,
    lists = require('repositories/Lists').Repository,
    List = require('models/List').Model,
    joi = require('joi'),
    _ = require('underscore'),
    controller,
    ListDescription = {
      type: joi.string().required().description(
        'The id of the List-Item'
      ),
      allowMultiple: false
    },
    Lists;

  controller = new Foxx.Controller(applicationContext);

  Lists = new lists(applicationContext.collection('Lists'), {
    model: List
  });

  /** Lists of all List
   *
   * This function simply returns the list of all List.
   */
  controller.get('/Lists', function (req, res) {
    res.json(_.map(Lists.all(), function (model) {
      return model.forClient();
    }));
  });

  /** Creates a new List
   *
   * Creates a new List-Item. The information has to be in the
   * requestBody.
   */
  controller.post('/Lists', function (req, res) {
    var list = req.params('list');
    res.json(Lists.save(list).forClient());
  }).bodyParam('list', {
    description: 'The List you want to create',
    type: List
  });

  /** Reads a List
   *
   * Reads a List-Item.
   */
  controller.get('/Lists/:id', function (req, res) {
    var id = req.params('id');
    res.json(Lists.byId(id).forClient());
  }).pathParam('id', ListDescription);

  /** Updates a List
   *
   * Changes a List-Item. The information has to be in the
   * requestBody.
   */
  controller.put('/Lists/:id', function (req, res) {
    var id = req.params('id'),
    list = req.params('list');
    res.json(Lists.replaceById(id, list));
  }).pathParam('id', ListDescription
  ).bodyParam('list', 'The List you want your old one to be replaced with', List);

  /** Removes a List
   *
   * Removes a List-Item.
   */
  controller.del('/Lists/:id', function (req, res) {
    var id = req.params('id');
    Lists.removeById(id);
    res.json({ success: true });
  }).pathParam('id', ListDescription
  ).errorResponse(ArangoError, 404, 'The document could not be found');
}());

