var server_ip = "localhost";
var server_port = 8000;

var socket = new WebSocket("ws://" + server_ip + ":" + server_port);

var doc;

function Setup() {
	doc = document.getElementById("code");
}

socket.onmessage = function(data) {
	var dataStr = data.data.toString();
	console.log("Received packet from server");
	//console.log(data);
	dataStr = dataStr.replace(/(\r\n|\n|\r)/gm, "<br />");
	dataStr = dataStr.replace(/(\t)/gm, "&nbsp;&nbsp;&nbsp;&nbsp;");
	doc.innerHTML = dataStr;
}