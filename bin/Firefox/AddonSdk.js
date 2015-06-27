/* global Promise */
"use strict";

var _require = require("chrome");

var Cc = _require.Cc;
var Ci = _require.Ci;
var Cu = _require.Cu;
// https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/chrome.html

var _Cu$import = Cu["import"]("resource://gre/modules/Services.jsm");

var Services = _Cu$import.Services;
// https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Services.jsm

var _Cu$import2 = Cu["import"]("resource://gre/modules/osfile.jsm");

var OS = _Cu$import2.OS;
// https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/OSFile.jsm

var UDP = require("./UDP");
var IPResolver = require("./IPResolver");
var FileUtilities = require("./FileUtilities");
var windowUtils = require("sdk/window/utils"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/window_utils
var fileSystem = {
	createLocalFile: function createLocalFile() {
		return Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
	}, // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsILocalFile
	filePicker: function filePicker() {
		return Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
	}, // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIFilePicker
	mimeService: Cc["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Ci.nsIMIMEService),
	read: OS.File
};

module.exports.createTCPSocket = function () {
	return Cc["@mozilla.org/tcp-socket;1"].createInstance(Ci.nsIDOMTCPSocket);
};
module.exports.createDomParser = function () {
	return Cc["@mozilla.org/xmlextras/domparser;1"].createInstance(Ci.nsIDOMParser);
}; // https://developer.mozilla.org/en-US/docs/nsIDOMParser https://dxr.mozilla.org/mozilla-central/source/dom/base/nsIDOMParser.idl
module.exports.timers = function () {
	return require("sdk/timers");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers
module.exports.XMLHttpRequest = function () {
	return require("sdk/net/xhr").XMLHttpRequest;
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/net_xhr
module.exports.button = function () {
	return require("sdk/ui/button/action");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_toggle
module.exports.tabs = function () {
	return require("sdk/tabs");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/tabs
module.exports.notifications = function () {
	return require("sdk/notifications");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
module.exports.storage = function () {
	return require("sdk/simple-storage").storage;
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-storage
module.exports.url = function () {
	return require("sdk/url");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url

module.exports.FileUtilities = new FileUtilities(fileSystem, windowUtils);
module.exports.udp = new UDP(function () {
	return Cc["@mozilla.org/network/udp-socket;1"].createInstance(Ci.nsIUDPSocket);
}, // http://dxr.mozilla.org/mozilla-central/source/netwerk/base/public/nsIUDPSocket.idl
Services.scriptSecurityManager.getSystemPrincipal());
module.exports.IPResolver = new IPResolver(Cc["@mozilla.org/network/dns-service;1"].getService(Ci.nsIDNSService), // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIDNSService
module.exports.udp);