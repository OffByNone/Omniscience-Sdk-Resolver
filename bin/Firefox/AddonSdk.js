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

var UDPSocket = require("./UDPSocket");
var TCPSocket = require("./TCPSocket");
var SimpleTCP = require("../SimpleTCP");
var IPResolver = require("./IPResolver");
var MimeService = require("./MimeService");
var SocketSender = require("./SocketSender");
var FileUtilities = require("./FileUtilities");
var StorageService = require("./StorageService");
var SimpleTCPSocket = require("./SimpleTCPSocket");

var nativeStorage = require("sdk/simple-storage").storage;
var windowUtils = require("sdk/window/utils"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/window_utils
var fileSystem = {
	createLocalFile: function createLocalFile() {
		return Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
	}, // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsILocalFile
	filePicker: function filePicker() {
		return Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
	}, // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIFilePicker
	getTypeFromFile: Cc["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Ci.nsIMIMEService).getTypeFromFile,
	read: OS.File.read
};

module.exports.firefox = {};
module.exports.firefox.tabs = function () {
	return require("sdk/tabs");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/tabs
module.exports.firefox.button = function () {
	return require("sdk/ui/button/action");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_toggle
module.exports.firefox.getNativeWindowMenu = function () {
	return Services.wm.getMostRecentWindow("navigator:browser").NativeWindow.menu;
}; //for firefox for android

module.exports.createBase64Utils = function () {
	return require("sdk/base64");
}; //https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/base64
module.exports.createDomParser = function () {
	return Cc["@mozilla.org/xmlextras/domparser;1"].createInstance(Ci.nsIDOMParser);
}; // https://developer.mozilla.org/en-US/docs/nsIDOMParser https://dxr.mozilla.org/mozilla-central/source/dom/base/nsIDOMParser.idl
module.exports.createFileUtilities = function () {
	return new FileUtilities(fileSystem, windowUtils, new MimeService(Cc["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Ci.nsIMIMEService)));
};
module.exports.createIPResolver = function () {
	return new IPResolver(Cc["@mozilla.org/network/dns-service;1"].getService(Ci.nsIDNSService), { create: function create() {
			return module.exports.createUDPSocket();
		} });
}; // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIDNSService
module.exports.createSimpleTCP = function () {
	return new SimpleTCP(new SimpleTCPSocket(module.exports.timers(), module.exports.createTCPSocketProvider(), new SocketSender()));
};
module.exports.createSocketSender = function () {
	return new SocketSender();
};
module.exports.createStorageService = function () {
	return new StorageService(nativeStorage);
};
module.exports.createTCPSocketProvider = function () {
	return { create: function create() {
			return new TCPSocket(Cc["@mozilla.org/tcp-socket;1"].createInstance(Ci.nsIDOMTCPSocket));
		} };
};
module.exports.createUDPSocket = function () {
	return new UDPSocket(Cc["@mozilla.org/network/udp-socket;1"].createInstance(Ci.nsIUDPSocket), Services.scriptSecurityManager.getSystemPrincipal());
};
module.exports.notifications = function () {
	return require("sdk/notifications");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
module.exports.timers = function () {
	return require("sdk/timers");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers
module.exports.url = function () {
	return require("sdk/url");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url
module.exports.XMLHttpRequest = function () {
	return require("sdk/net/xhr").XMLHttpRequest;
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/net_xhr

module.exports.isFirefox = true;
module.exports.isChrome = false;