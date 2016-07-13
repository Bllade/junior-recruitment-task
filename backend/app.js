"use strict";

/**
 * Libraries and frameworks
 */
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var path = require('path');

var fs = require("fs");
var file = "mydb.db";
var exists = fs.existsSync(file);

/**
 * Check if DB file exists
 */
if(!exists) {
  fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

app.use(express.static(path.resolve(__dirname + '/../' + 'frontend')));


/**
 * Start server on port 3000
 */
server.listen(3000, function () {
  console.log('App listening on port 3000!');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + 'index.html'));
});

/**
 * This function saves recived data to DB
 * @param {value} data from textbox
 */
var saveData = function (value) {
	db.serialize(function() {

		db.run("CREATE TABLE if not exists to_do (id INTEGER PRIMARY KEY AUTOINCREMENT, checked INTEGER, value TEXT)");
		var stmt = db.prepare("INSERT INTO to_do(checked,value) VALUES(?,?)");
		stmt.run(0, value);

		stmt.finalize();
	});
}

/**
 * This function delete row from db
 * @param {value} ID of row
 */
var deleteData = function (value) {
	db.serialize(function() {
		db.run("DELETE from to_do where ID = " + value);
	});
}

/**
 * This function update row. Change state between checked/unchecked
 * @param {value} value of textbox and ID of clicked row
 */
var updateData = function (value) {
	db.serialize(function() {
		db.run("UPDATE to_do SET checked = "+ value.checked +" WHERE ID = " + value.id);
	});
}

io.on('connection', function (socket) {
	/**
	* Load list from DB
	*/
	db.serialize(function() {
		db.each("SELECT * FROM to_do", function(err, row) {
			socket.emit('reciveList', {row: row});
		});
	});

	/**
	* Find last added element, and send it to table
	*/

	var findLast = function () {
		db.serialize(function() {
			db.all("SELECT * FROM to_do order by rowid desc limit 1",function(err,rows){
				socket.emit('add', {value: rows[0]});
			});
		});
	}

	/**
	* Listen to save event
	*/

	socket.on('save',function(data) {
		saveData(data.value);
		findLast();
	});

	/**
	* Listen to delete event
	*/

	socket.on('delete',function(data) {
		deleteData(data.id);
	});

	/**
	* Listen to update event
	*/

	socket.on('update',function(data) {
		updateData(data);
	});
});


