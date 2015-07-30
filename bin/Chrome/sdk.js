/* global chrome */
/* global Promise */
'use strict';

var UDP = require('./UDP');
var TCP = require('./TCP');
var IPResolver = require('./IPResolver');
var FileUtilities = require('./FileUtilities');
var windowUtils = require('sdk/window/utils'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/window_utils
var fileSystem = {
	createLocalFile: function createLocalFile() {
		return Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
	}, // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsILocalFile
	filePicker: function filePicker() {
		return Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
	}, // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIFilePicker
	mimeService: Cc['@mozilla.org/uriloader/external-helper-app-service;1'].getService(Ci.nsIMIMEService),
	read: OS.File
};

module.exports.button = function () {
	return require('sdk/ui/button/action');
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_toggle
module.exports.tabs = function () {
	return require('sdk/tabs');
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/tabs

module.exports.FileUtilities = new FileUtilities(fileSystem, windowUtils);

module.exports.IPResolver = function () {
	return new IPResolver();
};
module.exports.udp = function (sourcePort) {
	return new UDP(chrome.sockets.udp, sourcePort);
}; // https://developer.chrome.com/apps/sockets_udp
module.exports.createTCPSocket = function () {
	return new TCP(chrome.sockets.tcp, chrome.sockets.tcpServer);
}; // https://developer.chrome.com/apps/sockets_tcp  https://developer.chrome.com/apps/sockets_tcpServer

module.exports.XMLHttpRequest = function () {
	return window.XMLHttpRequest;
};
module.exports.timers = function () {
	return window;
};
module.exports.url = function () {
	return window.URL;
};
module.exports.createDOMParser = function () {
	return window.DOMParser;
};
module.exports.storage = function () {
	return require('./Chrome/Storage');
}; // https://developer.chrome.com/extensions/storage
module.exports.notifications = function () {
	return require('./Chrome/Notifications');
}; // https://developer.chrome.com/extensions/notifications