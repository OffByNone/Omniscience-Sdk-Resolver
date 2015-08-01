/* global chrome */
/* global Promise */
'use strict';

var UDP = require('./UDPSocket');
var TCP = require('./TCPSocket');
var IPResolverClass = require('./IPResolver');
var FileUtilitiesClass = require('./FileUtilities');
var UrlSdk = require('./UrlSdk');
//const windowUtils = require('sdk/window/utils'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/window_utils
//const fileSystem = {
//	createLocalFile: () => Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile), // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsILocalFile
//	filePicker: () => Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker), // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIFilePicker
//	mimeService: Cc["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Ci.nsIMIMEService),
//	read: OS.File
//};

//module.exports.FileUtilities = new FileUtilitiesClass(fileSystem, windowUtils);

module.exports.IPResolver = new IPResolverClass();
module.exports.createUDPSocket = function () {
  return new UDP(chrome.sockets.udp);
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
  return new UrlSdk(window.URL);
};
module.exports.createDomParser = function () {
  return new window.DOMParser();
};
module.exports.createStorageService = function () {
  return require('./StorageService');
}; // https://developer.chrome.com/extensions/storage
module.exports.notifications = function () {
  return require('./Notifications');
};