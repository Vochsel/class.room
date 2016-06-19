var server_ip = "localhost";
var server_port = 8000;

var socket = new WebSocket("ws://" + server_ip + ":" + server_port);

var editor;

var docs = {};

var currentTab = "";
var tabs = document.getElementById("file_nav");

function addTab(file) {
	file_nav.innerHTML += "<li onclick='changeTab(`" + file.name + "`)'>" + file.name + "</li>";
	docs[file.name] = {lang: file.lang, contents: file.contents};
	changeTab(file.name);
}

function changeTab(name) {
	currentTab = name;
	editor.setOption("mode", docs[currentTab].lang);
	editor.setValue(docs[currentTab].contents);
}

function editTab(name, newContents) {
	docs[name].contents = newContents;
}

function updateTab() {
	editor.setOption("mode", docs[currentTab].lang);
	editor.setValue(docs[currentTab].contents);	
}

function Setup() {
	//doc = document.getElementById("code"); 
	editor = CodeMirror.fromTextArea(document.getElementById("code"), {
	  lineNumbers: true,
	  mode: "text/html",
	  matchBrackets: true,
	  readOnly: true,
	  indentUnit:5
	});
	editor.setSize(1150, 600);
}

socket.onmessage = function(data) {
	var dataStr = data.data.toString();
	var dataObj = JSON.parse(dataStr); 
	console.log("Received packet from server. File: " + dataObj.lang);  
	
	dataObj.file.lang = dataObj.lang;
	
	if(docs[dataObj.file.name] == undefined)
		addTab(dataObj.file);
	else
		editTab(dataObj.file.name, dataObj.file.contents);
	updateTab();
}