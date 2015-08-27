/* global chrome */
/* global Promise */
"use strict";

const UDP = require('../Chrome/UDPSocket');
const TCP = require('../Chrome/TCPSocket');
const SimpleTCP = require('../SimpleTCP');
const IPResolver = require('../Chrome/IPResolver');
const MimeService = require('../Shared/MimeService');
const SocketSender = require('../Chrome/SocketSender');
//const FileUtilities = require('./FileUtilities');
const SimpleUDPSocket = require('../Chrome/SimpleUDPSocket');
const SimpleTCPSocket = require('../Chrome/SimpleTCPSocket');
const Common = require('../Shared/sdk');

module.exports.createBase64Utils = Common.createBase64Utils;
module.exports.createDomParser = Common.createDomParser;
//module.exports.createFileUtilities = () => new FileUtilities(new MimeService(), chrome.app.window.get('omniscience').contentWindow.chrome.fileSystem);
module.exports.createIPResolver = () => new IPResolver();
module.exports.createSimpleTCP = () => new SimpleTCP(new SimpleTCPSocket(window, chrome.sockets.tcp, chrome.runtime.lastError));
module.exports.createSocketSender = () => new SocketSender(chrome.sockets.tcp);
module.exports.createStorageService = () => require('./StorageService');
module.exports.createTCPSocketProvidere = () => { return { create: new TCP(chrome.sockets.tcp, chrome.sockets.tcpServer) }; };
module.exports.createUDPSocket = () => new SimpleUDPSocket({ create: () => new UDP(chrome.sockets.udp, chrome.runtime.lastError) });
module.exports.notifications = () => require('./Notifications'); // https://github.com/katzer/cordova-plugin-local-notifications
module.exports.timers = Common.timers;
module.exports.url = Common.url;
module.exports.XMLHttpRequest = Common.XMLHttpRequest;


module.exports.isFirefox = false;
module.exports.isChrome = false;
module.exports.isCordova = true;