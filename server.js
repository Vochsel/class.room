// -- Libraries
var ipLib = require('ip');

var express = require('express');

// -- Global Variables
var SERVER_IP = ipLib.address();

// -- Server Variables
var WebClients = [];
var Broadcaster;

// ============== Express Server ============== //
var webServerPort = 8000;
var app = express();
var webServer = app.listen(webServerPort, function() {
	var host = SERVER_IP;
	var port = webServerPort;

	console.log("Started Web Server at: http://%s:%s", host, port);
});

app.use(express.static('public'));
app.use(express.static('common'));

// =============== INET Server ================ //
var net = require('net');
var inetPort = 5000;
var inetServer = net.createServer(function(sublime_socket) {
	//Client from sublime package has joined
	sublime_socket.on('data', function(data) {
		//console.log("Net Server recieved data: " + data.toString());
		console.log("Net Server recieved data");
		console.log("Sending data to Web Clients");
		for(var i = 0; i < WebClients.length; ++i)
		{
			WebClients[i].send(data.toString());
		}
	});
});
inetServer.listen(inetPort);

// On Server listening
inetServer.on('listening', function() {
	console.log("Started Net Server at: http://%s:%s", SERVER_IP, inetPort);
})

// On new connection
inetServer.on('connection', function() {
	console.log("Net Server recieved new connection");
});

// On closed connection
inetServer.on('close', function() {
	console.log("Net Server lost a connection");
});

// ============ Web Socket Server ============= //
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer( { server : webServer });

wss.on('listening', function() {
	console.log("Started WSS Server at: http://%s:%s", SERVER_IP, webServerPort);
})

wss.on('connection', function(client_socket) {
	//Client from webpage has joined
	console.log("WS  Server received new connection");
	var idx = WebClients.length;
	WebClients.push(client_socket);

	client_socket.on('close', function() {
		WebClients.splice(idx, 1);
	})
});

