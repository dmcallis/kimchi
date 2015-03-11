(function () {
  'use strict';
  var Foxx = require('org/arangodb/foxx'),
    ArangoError = require('org/arangodb').ArangoError,
    items = require('repositories/Items').Repository,
    Item = require('models/Item').Model,
    joi = require('joi'),
    _ = require('underscore'),
    controller,
    ItemDescription = {
      type: joi.string().required().description(
        'The id of the Item-Item'
      ),
      allowMultiple: false
    },
    Items;

  controller = new Foxx.Controller(applicationContext);

  Items = new items(applicationContext.collection('Items'), {
    model: Item
  });

  /** Lists of all Item
   *
   * This function simply returns the list of all Item.
   */
  controller.get('/Items', function (req, res) {
    res.json(_.map(Items.all(), function (model) {
      return model.forClient();
    }));
  });

  /** Creates a new Item
   *
   * Creates a new Item-Item. The information has to be in the
   * requestBody.
   */
  controller.post('/Items', function (req, res) {
    var item = req.params('item');
    res.json(Items.save(item).forClient());
  }).bodyParam('item', {
    description: 'The Item you want to create',
    type: Item
  });

  /** Reads a Item
   *
   * Reads a Item-Item.
   */
  controller.get('/Items/:id', function (req, res) {
    var id = req.params('id');
    res.json(Items.byId(id).forClient());
  }).pathParam('id', ItemDescription);

  /** Updates a Item
   *
   * Changes a Item-Item. The information has to be in the
   * requestBody.
   */
  controller.put('/Items/:id', function (req, res) {
    var id = req.params('id'),
    item = req.params('item');
    res.json(Items.replaceById(id, item));
  }).pathParam('id', ItemDescription
  ).bodyParam('item', 'The Item you want your old one to be replaced with', Item);

  /** Removes a Item
   *
   * Removes a Item-Item.
   */
  controller.del('/Items/:id', function (req, res) {
    var id = req.params('id');
    Items.removeById(id);
    res.json({ success: true });
  }).pathParam('id', ItemDescription
  ).errorResponse(ArangoError, 404, 'The document could not be found');
}());

