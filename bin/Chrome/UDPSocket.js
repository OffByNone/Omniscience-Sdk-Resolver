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
	}

	_createClass(UDPSocket, [{
		key: "init",
		value: function init(sourcePort) {
			var _this = this;

			this._port = sourcePort;
			this._udp.create({ bufferSize: Constants.socketBufferSize }, function (createInfo) {
				_this._socketId = createInfo.socketId;
				console.log(createInfo);
			});
		}
	}, {
		key: "bind",
		value: function bind(ipAddress) {
			this._ipAddress = ipAddress;
			console.log(this._socketId);
			this._udp.bind(this._socketId, ipAddress, this._port || 0);
		}
	}, {
		key: "send",
		value: function send(destinationIP, destinationPort, message) {
			this._udp.send(this._socketId, message, destinationIP, destinationPort);
		}
	}, {
		key: "close",
		value: function close() {
			this._udp.close(this._socketId, this._stopListeningEventHandler);
		}
	}, {
		key: "listen",
		value: function listen() {}
	}, {
		key: "joinMulticast",
		value: function joinMulticast(multicastIP) {
			this._udp.joinGroup(this._socketId, multicastIP);
		}
	}, {
		key: "leaveMulticast",
		value: function leaveMulticast(multicastIP) {
			this._udp.leaveGroup(this._socketId, multicastIP);
		}
	}, {
		key: "onStopListeningEvent",
		value: function onStopListeningEvent(callback) {
			this._stopListeningEventHandler = callback;
		}
	}, {
		key: "onPacketReceivedEvent",
		value: function onPacketReceivedEvent(callback) {
			var _this2 = this;

			this._udp.onReceive.addListener(function (info) {
				if (info.socketId == _this2._socketId) {
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