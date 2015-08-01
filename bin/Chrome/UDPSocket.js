/* global chrome */
/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var UDPSocket = (function () {
	function UDPSocket(udp) {
		_classCallCheck(this, UDPSocket);

		this._udp = udp;
		this._initialized = false;
		this._sendQueue = [];
	}

	_createClass(UDPSocket, [{
		key: "init",
		value: function init(localPort, localIP, multicastIP) {
			var _this = this;

			this._localPort = localPort || 0;
			this._localIP = localIP;
			this._multicastIP = multicastIP;

			this._udp.create({ bufferSize: Constants.socketBufferSize }, function (createInfo) {
				_this._socketId = createInfo.socketId;
				console.log(localIP + ":" + _this._localPort);
				_this._udp.bind(_this._socketId, localIP, _this._localPort, function (result) {
					console.log(result);
					if (result >= 0) {
						_this._udp.joinGroup(_this._socketId, _this._multicastIP, function () {
							_this._initialized = true;
							_this._sendQueue.forEach(function (queuedMessage) {
								return _this._udp.send(_this._socketId, queuedMessage.message.buffer, queuedMessage.destinationIP, queuedMessage.destinationPort, function () {});
							});
						});
					}
				});
			});
		}
	}, {
		key: "send",
		value: function send(destinationIP, destinationPort, message) {
			if (!this._initialized) this._sendQueue.push({ destinationIP: destinationIP, destinationPort: destinationPort, message: message });else this._udp.send(this._socketId, message.buffer, destinationIP, destinationPort, function () {});
		}
	}, {
		key: "close",
		value: function close() {
			var _this2 = this;

			this._udp.close(this._socketId, function () {
				return _this2._stopListeningEventHandler();
			});
		}
	}, {
		key: "listen",
		value: function listen() {}
	}, {
		key: "onStopListeningEvent",
		value: function onStopListeningEvent(callback) {
			this._stopListeningEventHandler = callback;
		}
	}, {
		key: "onPacketReceivedEvent",
		value: function onPacketReceivedEvent(callback) {
			var _this3 = this;

			this._udp.onReceive.addListener(function (info) {
				if (info.socketId == _this3._socketId) {
					var message = {
						data: info.data,
						fromAddr: {
							address: info.remoteAddress,
							port: info.remotePort
						}
					};
					callback(message);
				}
			});
		}
	}]);

	return UDPSocket;
})();

module.exports = UDPSocket;