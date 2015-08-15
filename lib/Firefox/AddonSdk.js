/* global Promise */
"use strict";

const { Cc, Ci, Cu } = require('chrome'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/chrome.html
const { Services } = Cu.import("resource://gre/modules/Services.jsm"); // https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Services.jsm
const { OS } = Cu.import("resource://gre/modules/osfile.jsm"); // https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/OSFile.jsm

const UDPSocket = require('./UDPSocket');
const TCPSocket = require('./TCPSocket');
const SimpleTCP = require('../SimpleTCP');
const IPResolver = require('./IPResolver');
const MimeService = require('./MimeService');
const SocketSender = require('./SocketSender');
const FileUtilities = require('./FileUtilities');
const StorageService = require('./StorageService');
const SimpleTCPSocket = require('./SimpleTCPSocket');

const nativeStorage = require('sdk/simple-storage').storage;
const windowUtils = require('sdk/window/utils'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/window_utils
const fileSystem = {
	createLocalFile: () => Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile), // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsILocalFile
	filePicker: () => Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker), // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIFilePicker
	getTypeFromFile: Cc["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Ci.nsIMIMEService).getTypeFromFile,
	read: OS.File.read
};


module.exports.firefox = {};
module.exports.firefox.tabs = () => require('sdk/tabs'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/tabs
module.exports.firefox.button = () => require('sdk/ui/button/action'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_toggle
module.exports.firefox.getNativeWindowMenu = () => Services.wm.getMostRecentWindow('navigator:browser').NativeWindow.menu; //for firefox for android


module.exports.createBase64Utils = () => require("sdk/base64"); //https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/base64
module.exports.createDomParser = () => Cc['@mozilla.org/xmlextras/domparser;1'].createInstance(Ci.nsIDOMParser); // https://developer.mozilla.org/en-US/docs/nsIDOMParser https://dxr.mozilla.org/mozilla-central/source/dom/base/nsIDOMParser.idl
module.exports.createFileUtilities = () => new FileUtilities(fileSystem, windowUtils, new MimeService(Cc["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Ci.nsIMIMEService)));
module.exports.createIPResolver = () => new IPResolver(Cc["@mozilla.org/network/dns-service;1"].getService(Ci.nsIDNSService), { create: () => module.exports.createUDPSocket() }); // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIDNSService
module.exports.createSimpleTCP = () => new SimpleTCP(new SimpleTCPSocket(module.exports.timers(), module.exports.createTCPSocketProvider(), new SocketSender()));
module.exports.createSocketSender = () => new SocketSender();
module.exports.createStorageService = () => new StorageService(nativeStorage);
module.exports.createTCPSocketProvider = () => { return { create: () => new TCPSocket(Cc["@mozilla.org/tcp-socket;1"].createInstance(Ci.nsIDOMTCPSocket)) }; };
module.exports.createUDPSocket = () => new UDPSocket(Cc['@mozilla.org/network/udp-socket;1'].createInstance(Ci.nsIUDPSocket), Services.scriptSecurityManager.getSystemPrincipal());
module.exports.notifications = () => require('sdk/notifications'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
module.exports.timers = () => require('sdk/timers'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers
module.exports.url = () => require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url
module.exports.XMLHttpRequest = () => require('sdk/net/xhr').XMLHttpRequest; // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/net_xhr


module.exports.isFirefox = true;
module.exports.isChrome = false;