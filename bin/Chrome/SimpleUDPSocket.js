/* global chrome */
/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var SimpleUDPSocket = (function () {
	function SimpleUDPSocket(udpSocketProvider) {
		_classCallCheck(this, SimpleUDPSocket);

		this._udpSocketProvider = udpSocketProvider;

		this._initialized = false;
		this._sendQueue = [];

		this.localPort;
		this.localIP;
		this.multicastIP;
		this.udpSocket;
	}

	_createClass(SimpleUDPSocket, [{
		key: "init",
		value: function init(localPort, localIP, multicastIP) {
			var _this = this;

			this.udpSocket = this._udpSocketProvider.create();

			this.udpSocket.create({ bufferSize: Constants.socketBufferSize }).then(function () {
				return _this.udpSocket.setMulticastLoopbackMode(true);
			}).then(function (result) {
				if (result < 0) throw new Error("setting multicast loopback mode failed with error code: " + result);
				return _this.udpSocket.bind(localIP, localPort);
			}).then(function (result) {
				if (result < 0) throw new Error("binding udp socket failed with error code: " + result);
				return _this.udpSocket.getInfo();
			}).then(function (socketInfo) {
				_this.localPort = socketInfo.localPort;
				_this.localIP = socketInfo.localAddress;
				_this.multicastIP = multicastIP;
				return _this.udpSocket.joinGroup(_this.multicastIP);
			}).then(function () {
				_this._initialized = true;
				_this._sendQueue.forEach(function (queuedMessage) {
					return _this.udpSocket.send(queuedMessage.message.buffer, queuedMessage.destinationIP, queuedMessage.destinationPort);
				});
			});
		}
	}, {
		key: "send",
		value: function send(destinationIP, destinationPort, message) {
			if (!this._initialized) this._sendQueue.push({ destinationIP: destinationIP, destinationPort: destinationPort, message: message });else this.udpSocket.send(message.buffer, destinationIP, destinationPort);
		}
	}, {
		key: "close",
		value: function close() {
			var _this2 = this;

			this.udpSocket.close().then(function () {
				if (typeof _this2._stopListeningEventHandler === "function") _this2._stopListeningEventHandler();
			});
		}
	}, {
		key: "onStopListeningEvent",
		value: function onStopListeningEvent(callback) {
			this._stopListeningEventHandler = callback;
		}
	}, {
		key: "onPacketReceivedEvent",
		value: function onPacketReceivedEvent(callback) {
			this.udpSocket.onReceive(callback);
		}
	}]);

	return SimpleUDPSocket;
})();

module.exports = SimpleUDPSocket;