var ArangoDataBase = require('arangojs');
var ArangoServerLocation = "http://junykimvm8211.redmond.corp.microsoft.com:8529";
var KimchiDatabaseName = "KimchiDatabase";
var KimchiBoardCollectionName = "Apps_KimchiBoard_Boards";
var KimchiListCollectionName = "Apps_KimchiBoard_Lists";
var KimchiItemCollectionName = "Apps_KimchiBoard_Items";

dbManager = new ArangoDataBase(ArangoServerLocation);
dbManager.database(KimchiDatabaseName, true, function(err, newdb) {
  if (err) {
    console.log('Failed to create database: %j', err);
  } else {
    console.log('Got Database: %j', newdb.name);
    mydb = newdb;
  }
});

mydb.collection(KimchiBoardCollectionName, true,
		  function (err, newCollection) {
	  if (err) {
	    console.log('error: %j', err);
	  } else {
	    console.log('Collection created: %j', 
	      newCollection.name);
	    collection = newCollection;
	  }
	});

mydb.collection(KimchiListCollectionName, true,
		  function (err, newCollection) {
	  if (err) {
	    console.log('error: %j', err);
	  } else {
	    console.log('Collection created: %j', 
	      newCollection.name);
	    collection = newCollection;
	  }
	});

mydb.collection(KimchiItemCollectionName, true,
		  function (err, newCollection) {
	  if (err) {
	    console.log('error: %j', err);
	  } else {
	    console.log('Collection created: %j', 
	      newCollection.name);
	    collection = newCollection;
	  }
	});

