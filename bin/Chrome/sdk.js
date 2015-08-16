/* global chrome */
/* global Promise */
'use strict';

var UDP = require('./UDPSocket');
var TCP = require('./TCPSocket');
var UrlSdk = require('./UrlSdk');
var SimpleTCP = require('../SimpleTCP');
var IPResolver = require('./IPResolver');
var MimeService = require('./MimeService');
var SocketSender = require('./SocketSender');
var FileUtilities = require('./FileUtilities');
var SimpleUDPSocket = require('./SimpleUDPSocket');
var SimpleTCPSocket = require('./SimpleTCPSocket');

module.exports.chrome = {};
module.exports.chrome.TCP = chrome.sockets.tcp;
module.exports.chrome.TCPServer = chrome.sockets.tcpServer;

module.exports.createBase64Utils = function () {
	return { encode: function encode(convertMe) {
			return window.btoa(convertMe);
		}, decode: function decode(decodeMe) {
			window.atob(decodeMe);
		} };
};
module.exports.createDomParser = function () {
	return new window.DOMParser();
};
module.exports.createFileUtilities = function () {
	return new FileUtilities(new MimeService(), chrome.app.window.get('omniscience').contentWindow.chrome.fileSystem);
};
module.exports.createIPResolver = function () {
	return new IPResolver();
};
module.exports.createSimpleTCP = function () {
	return new SimpleTCP(new SimpleTCPSocket(window, chrome.sockets.tcp, chrome.runtime.lastError));
};
module.exports.createSocketSender = function () {
	return new SocketSender(chrome.sockets.tcp);
};
module.exports.createStorageService = function () {
	return require('./StorageService');
}; // https://developer.chrome.com/extensions/storage
module.exports.createTCPSocketProvidere = function () {
	return { create: new TCP(chrome.sockets.tcp, chrome.sockets.tcpServer) };
}; // https://developer.chrome.com/apps/sockets_tcp  https://developer.chrome.com/apps/sockets_tcpServer
module.exports.createUDPSocket = function () {
	return new SimpleUDPSocket({ create: function create() {
			return new UDP(chrome.sockets.udp, chrome.runtime.lastError);
		} });
}; // https://developer.chrome.com/apps/sockets_udp
module.exports.notifications = function () {
	return require('./Notifications');
};
module.exports.timers = function () {
	return window;
};
module.exports.url = function () {
	return new UrlSdk(window.URL);
};
module.exports.XMLHttpRequest = function () {
	return window.XMLHttpRequest;
};

module.exports.isFirefox = false;
module.exports.isChrome = true;

// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
	Array.from = (function () {
		var toStr = Object.prototype.toString;
		var isCallable = function isCallable(fn) {
			return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
		};
		var toInteger = function toInteger(value) {
			var number = Number(value);
			if (isNaN(number)) {
				return 0;
			}
			if (number === 0 || !isFinite(number)) {
				return number;
			}
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		var maxSafeInteger = Math.pow(2, 53) - 1;
		var toLength = function toLength(value) {
			var len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};

		// The length property of the from method is 1.
		return function from(arrayLike /*, mapFn, thisArg */) {
			// 1. Let C be the this value.
			var C = this;

			// 2. Let items be ToObject(arrayLike).
			var items = Object(arrayLike);

			// 3. ReturnIfAbrupt(items).
			if (arrayLike == null) {
				throw new TypeError('Array.from requires an array-like object - not null or undefined');
			}

			// 4. If mapfn is undefined, then let mapping be false.
			var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			var T;
			if (typeof mapFn !== 'undefined') {
				// 5. else
				// 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
				if (!isCallable(mapFn)) {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}

				// 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
				if (arguments.length > 2) {
					T = arguments[2];
				}
			}

			// 10. Let lenValue be Get(items, "length").
			// 11. Let len be ToLength(lenValue).
			var len = toLength(items.length);

			// 13. If IsConstructor(C) is true, then
			// 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
			// 14. a. Else, Let A be ArrayCreate(len).
			var A = isCallable(C) ? Object(new C(len)) : new Array(len);

			// 16. Let k be 0.
			var k = 0;
			// 17. Repeat, while k < len… (also steps a - h)
			var kValue;
			while (k < len) {
				kValue = items[k];
				if (mapFn) {
					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				} else {
					A[k] = kValue;
				}
				k += 1;
			}
			// 18. Let putStatus be Put(A, "length", len, true).
			A.length = len;
			// 20. Return A.
			return A;
		};
	})();
}