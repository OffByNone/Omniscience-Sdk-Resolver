/* global chrome */
/* global Promise */
"use strict";

const UDP = require('./UDPSocket');
const TCP = require('./TCPSocket');
const SimpleTCPSocket = require('./SimpleTCPSocket');
const SimpleTCP = require('../SimpleTCP');
const SocketSender = require('./SocketSender');

const FileUtilities = require('./FileUtilities');
const MimeService = require('./MimeService');
const IPResolver = require('./IPResolver');
const UrlSdk = require("./UrlSdk");

module.exports.createIPResolver = () => new IPResolver();
module.exports.createFileUtilities = () => new FileUtilities(new MimeService());

module.exports.createSocketSender = () => new SocketSender(chrome.sockets.tcp);
module.exports.createUDPSocket = () => new UDP(chrome.sockets.udp, chrome.runtime.lastError); // https://developer.chrome.com/apps/sockets_udp
module.exports.createTCPSocket = () => new TCP(chrome.sockets.tcp, chrome.sockets.tcpServer); // https://developer.chrome.com/apps/sockets_tcp  https://developer.chrome.com/apps/sockets_tcpServer
module.exports.createSimpleTCP = () => new SimpleTCP(new SimpleTCPSocket(window, chrome.sockets.tcp, chrome.runtime.lastError));

module.exports.XMLHttpRequest = () => window.XMLHttpRequest;
module.exports.timers = () => window;
module.exports.url = () => new UrlSdk(window.URL);
module.exports.createDomParser = () => new window.DOMParser();
module.exports.createStorageService = () => require('./StorageService'); // https://developer.chrome.com/extensions/storage
module.exports.notifications = () => require('./Notifications');

module.exports.isFirefox = false;
module.exports.isChrome = true;

module.exports.chromeTCP = chrome.sockets.tcp;
module.exports.chromeTCPServer = chrome.sockets.tcpServer;
module.exports.chromeFileSystem = chrome.fileSystem;