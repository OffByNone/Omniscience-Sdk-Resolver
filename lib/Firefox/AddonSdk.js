/* global Promise */
"use strict";

const { Cc, Ci, Cu } = require('chrome'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/chrome.html
const { Services } = Cu.import("resource://gre/modules/Services.jsm"); // https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Services.jsm
const { OS } = Cu.import("resource://gre/modules/osfile.jsm"); // https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/OSFile.jsm

const UDP = require('./UDP');
const IPResolver = require('./IPResolver');
const FileUtilities = require('./FileUtilities');
const windowUtils = require('sdk/window/utils'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/window_utils
const fileSystem = {
	createLocalFile: () => Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile), // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsILocalFile
	filePicker: () => Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker), // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIFilePicker
	mimeService: Cc["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Ci.nsIMIMEService),
	read: OS.File
};

module.exports.createTCPSocket = () => Cc["@mozilla.org/tcp-socket;1"].createInstance(Ci.nsIDOMTCPSocket);
module.exports.createDomParser = () => Cc['@mozilla.org/xmlextras/domparser;1'].createInstance(Ci.nsIDOMParser); // https://developer.mozilla.org/en-US/docs/nsIDOMParser https://dxr.mozilla.org/mozilla-central/source/dom/base/nsIDOMParser.idl
module.exports.timers = () => require('sdk/timers'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers
module.exports.XMLHttpRequest = () => require('sdk/net/xhr').XMLHttpRequest; // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/net_xhr
module.exports.button = () => require('sdk/ui/button/action'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_toggle
module.exports.tabs = () => require('sdk/tabs'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/tabs
module.exports.notifications = () => require('sdk/notifications'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
module.exports.storage = () => require('sdk/simple-storage').storage; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-storage
module.exports.url = () => require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url

module.exports.FileUtilities = new FileUtilities(fileSystem, windowUtils);
module.exports.udp = new UDP(
	() => Cc['@mozilla.org/network/udp-socket;1'].createInstance(Ci.nsIUDPSocket), // http://dxr.mozilla.org/mozilla-central/source/netwerk/base/public/nsIUDPSocket.idl
	Services.scriptSecurityManager.getSystemPrincipal());
module.exports.IPResolver = new IPResolver(
	Cc["@mozilla.org/network/dns-service;1"].getService(Ci.nsIDNSService), // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIDNSService
	module.exports.udp);