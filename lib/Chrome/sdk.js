/* global chrome */
/* global Promise */
"use strict";

const UDP = require('./UDPSocket');
const TCP = require('./TCPSocket');
const IPResolverClass = require('./IPResolver');
const FileUtilitiesClass = require('./FileUtilities');
const UrlSdk = require("./UrlSdk");
//const windowUtils = require('sdk/window/utils'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/window_utils
//const fileSystem = {
//	createLocalFile: () => Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile), // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsILocalFile
//	filePicker: () => Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker), // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIFilePicker
//	mimeService: Cc["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Ci.nsIMIMEService),
//	read: OS.File
//};

//module.exports.FileUtilities = new FileUtilitiesClass(fileSystem, windowUtils);


module.exports.IPResolver = new IPResolverClass();
module.exports.createUDPSocket = () => new UDP(chrome.sockets.udp); // https://developer.chrome.com/apps/sockets_udp
module.exports.createTCPSocket = () => new TCP(chrome.sockets.tcp, chrome.sockets.tcpServer); // https://developer.chrome.com/apps/sockets_tcp  https://developer.chrome.com/apps/sockets_tcpServer


module.exports.XMLHttpRequest = () => window.XMLHttpRequest;
module.exports.timers = () => window;
module.exports.url = () => new UrlSdk(window.URL);
module.exports.createDomParser = () => new window.DOMParser();
module.exports.createStorageService = () => require('./StorageService'); // https://developer.chrome.com/extensions/storage
module.exports.notifications = () => require('./Notifications');