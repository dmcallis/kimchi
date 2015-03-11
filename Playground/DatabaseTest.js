var ArangoDataBase = require('arangojs');
var ArangoServerLocation = "http://127.0.0.1:8529";
var KimchiDatabaseName = "KimchiDatabase";
var KimchiBoardCollectionName = "KimchiBoards";
var KimchiListCollectionName = "KimchiLists";
var KimhiItemCollectionName = "KimchiItems"

// Test section
function SetupTestData(serverLocation, databaseName, CollectionName)
{
	var NameOfCollection = CollectionName
	var newCollectionn = null
	dbManager = new ArangoDataBase(ArangoServerLocation);
	dbManager.database(KimchiDatabaseName, true, function(err, newdb) {
	  if (err) {
	    console.log('Failed to create database: %j', err);
	  } else {
	    console.log('Got Database: %j', newdb.name);
	    newdb.collection(NameOfCollection, true,
				  function (err, newCollection) {
			  if (err) {
			    console.log('error: %j', err);
			  } else {
			    console.log('Collection created: %j', 
			      newCollection.name);
			    newCollectionn = newCollection;
			  }
			});
	  }
	});
	
	var namee = newCollectionn.Name
}

SetupTestData(ArangoServerLocation, KimchiDatabaseName, KimchiBoardCollectionName)