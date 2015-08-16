/* global chrome */
/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var UDPSocket = (function () {
	function UDPSocket(chromeUdp) {
		_classCallCheck(this, UDPSocket);

		this._chromeUdp = chromeUdp;
		this.socketId;
	}

	_createClass(UDPSocket, [{
		key: "create",
		value: function create(properties) {
			var _this = this;

			return new Promise(function (resolve, reject) {
				_this._chromeUdp.create(properties, function (createInfo) {
					_this.socketId = createInfo.socketId;
					resolve(createInfo.socketId);
				});
			});
		}
	}, {
		key: "bind",
		value: function bind(localAddress, localPort) {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				_this2._chromeUdp.bind(_this2.socketId, localAddress, localPort || 0, function (result) {
					if (result < 0) reject(result);else resolve(result);
				});
			});
		}
	}, {
		key: "send",
		value: function send(data, remoteAddress, remotePort) {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				_this3._chromeUdp.send(_this3.socketId, data, remoteAddress, remotePort, function (sendInfo) {
					if (sendInfo.resultCode < 0) reject(sendInfo.resultCode);else resolve(sendInfo.resultCode, sendInfo.bytesSent);
				});
			});
		}
	}, {
		key: "close",
		value: function close() {
			var _this4 = this;

			return new Promise(function (resolve, reject) {
				_this4._chromeUdp.close(_this4.socketId, function () {
					resolve();
				});
			});
		}
	}, {
		key: "joinGroup",
		value: function joinGroup(groupAddress) {
			var _this5 = this;

			return new Promise(function (resolve, reject) {
				_this5._chromeUdp.joinGroup(_this5.socketId, groupAddress, function (result) {
					if (result < 0) reject(result);else resolve(result);
				});
			});
		}
	}, {
		key: "setMulticastLoopbackMode",
		value: function setMulticastLoopbackMode(enabled) {
			var _this6 = this;

			return new Promise(function (resolve, reject) {
				_this6._chromeUdp.setMulticastLoopbackMode(_this6.socketId, enabled, function (result) {
					resolve(result);
				});
			});
		}
	}, {
		key: "getInfo",
		value: function getInfo() {
			var _this7 = this;

			return new Promise(function (resolve, reject) {
				_this7._chromeUdp.getInfo(_this7.socketId, function (socketInfo) {
					resolve(socketInfo);
				});
			});
		}
	}, {
		key: "onReceive",
		value: function onReceive(callback) {
			var _this8 = this;

			this._chromeUdp.onReceive.addListener(function (info) {
				if (_this8.socketId !== info.socketId) return;
				var message = {
					data: info.data,
					fromAddr: {
						address: info.remoteAddress,
						port: info.remotePort
					}
				};
				callback(message);
			});
		}
	}, {
		key: "onReceiveError",
		value: function onReceiveError(callback) {
			var _this9 = this;

			this._chromeUdp.onReceiveError.addListener(function (info) {
				if (_this9.socketId !== info.socketId) return;
				callback(info.socketId, info.resultCode);
			});
		}
	}]);

	return UDPSocket;
})();

module.exports = UDPSocket;