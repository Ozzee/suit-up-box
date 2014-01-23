// A small back-end for the Suit-Up-Box
// Based heavily on the cloud9 boilerplate

var http = require('http');
var path = require('path');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');

// Create a new webserver with websockets
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];
var clients = [];

io.on('connection', function (socket) {
    
    // Send all the messages stored in the cache
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    // Push the new socket into the array
    sockets.push(socket);

    // Remove socket from sockets on disconnect
    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('message', function (msg) {
      console.log(msg);
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

// Broadcast message to all clients
function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

// Start listening
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
