/* global chrome */
/* global Promise */
"use strict";

const UDP = require('./UDP');
const TCP = require('./TCP');
const IPResolver = require('./IPResolver');
const FileUtilities = require('./FileUtilities');
const windowUtils = require('sdk/window/utils'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/window_utils
const fileSystem = {
	createLocalFile: () => Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile), // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsILocalFile
	filePicker: () => Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker), // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIFilePicker
	mimeService: Cc["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Ci.nsIMIMEService),
	read: OS.File
};

module.exports.button = () => require('sdk/ui/button/action'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_toggle
module.exports.tabs = () => require('sdk/tabs'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/tabs

module.exports.FileUtilities = new FileUtilities(fileSystem, windowUtils);


module.exports.IPResolver = () => new IPResolver();
module.exports.udp = (sourcePort) => new UDP(chrome.sockets.udp, sourcePort); // https://developer.chrome.com/apps/sockets_udp
module.exports.createTCPSocket = () => new TCP(chrome.sockets.tcp, chrome.sockets.tcpServer); // https://developer.chrome.com/apps/sockets_tcp  https://developer.chrome.com/apps/sockets_tcpServer


module.exports.XMLHttpRequest = () => window.XMLHttpRequest;
module.exports.timers = () => window;
module.exports.url = () => window.URL;
module.exports.createDOMParser = () => window.DOMParser;
module.exports.storage = () => require('./Chrome/Storage'); // https://developer.chrome.com/extensions/storage
module.exports.notifications = () => require('./Chrome/Notifications'); // https://developer.chrome.com/extensions/notifications