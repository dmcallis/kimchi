(function () {
  'use strict';
  var db = require("org/arangodb").db;

  
  db._drop("Boards");
  
  db._drop("Lists");
  
  db._drop("Items");
  
}());
