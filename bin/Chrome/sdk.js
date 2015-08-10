/* global chrome */
/* global Promise */
'use strict';

var UDP = require('./UDPSocket');
var TCP = require('./TCPSocket');
var SimpleTCPSocket = require('./SimpleTCPSocket');
var SimpleTCP = require('../SimpleTCP');
var SocketSender = require('./SocketSender');

var FileUtilities = require('./FileUtilities');
var MimeService = require('./MimeService');
var IPResolver = require('./IPResolver');
var UrlSdk = require('./UrlSdk');

module.exports.createIPResolver = function () {
  return new IPResolver();
};
module.exports.createFileUtilities = function () {
  return new FileUtilities(new MimeService());
};

module.exports.createSocketSender = function () {
  return new SocketSender(chrome.sockets.tcp);
};
module.exports.createUDPSocket = function () {
  return new UDP(chrome.sockets.udp, chrome.runtime.lastError);
}; // https://developer.chrome.com/apps/sockets_udp
module.exports.createTCPSocket = function () {
  return new TCP(chrome.sockets.tcp, chrome.sockets.tcpServer);
}; // https://developer.chrome.com/apps/sockets_tcp  https://developer.chrome.com/apps/sockets_tcpServer
module.exports.createSimpleTCP = function () {
  return new SimpleTCP(new SimpleTCPSocket(window, chrome.sockets.tcp, chrome.runtime.lastError));
};

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

module.exports.isFirefox = false;
module.exports.isChrome = true;

module.exports.chromeTCP = chrome.sockets.tcp;
module.exports.chromeTCPServer = chrome.sockets.tcpServer;
module.exports.chromeFileSystem = chrome.fileSystem;