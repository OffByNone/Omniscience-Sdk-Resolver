/* global chrome */
/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var TCPSocket = (function () {
	function TCPSocket(tcp, tcpServer, ipResolver) {
		_classCallCheck(this, TCPSocket);

		this._tcp = tcp; //https://developer.chrome.com/apps/sockets_tcp
		this._tcpServer = tcpServer; //https://developer.chrome.com/apps/sockets_tcpServer
		this._ipResolver = ipResolver;
		this.binaryType = "arraybuffer";
	}

	_createClass(TCPSocket, [{
		key: "listen",
		value: function listen(localPort, options, backlog) {
			var _this = this;

			//HttpServer.js:23
			this.port = localPort;

			this._ipResolver.resolveIPs().then(function (addresses) {
				return addresses.forEach(function (address) {
					return _this._tcpServer.create({}, function (createInfo) {
						return _this._tcpServer.listen(createInfo.socketId, address, localPort);
					});
				});
			});

			return this;
		}
	}, {
		key: "onconnect",
		value: function onconnect(callback) {
			var _this2 = this;

			//HttpServer.js:27
			this._tcpServer.onAccept.addListener(function (info) {
				//info.clientSocketId is the id of the incoming socket and is of this.tcp also it is initially paused and must be unpaused
				_this2._tcp.getSockets(function (socketInfos) {
					_this2._tcp.setPaused(info.clientSocketId, false);
					var nativeSocketInfo = socketInfos.filter(function (socketInfo) {
						return socketInfo.socketId === info.clientSocketId;
					});
					var wrappedSocket = new TCPSocket(_this2._tcp, _this2._tcpServer);
					wrappedSocket.socketId = nativeSocketInfo.socketId;

					callback(wrappedSocket);
				});
			});
		}
	}, {
		key: "open",
		value: function open(host, port) {
			var _this3 = this;

			this.host = host;
			this.port = port;

			this._tcp.create(null, function (createInfo) {
				_this3.socketId = createInfo.socketId;
				_this3._tcp.connect(createInfo.socketId, host, port, _this3.onopen);
			});

			return this;
		}
	}, {
		key: "close",
		value: function close() {
			//there are two close methods, one for _tcp and one for _tcpServer.
			//wonder if i can always call them both or if either will do
			this._tcp.close(this.socketId);
			this._tcpServer.close(this.socketId);
		}
	}, {
		key: "isOpen",
		value: function isOpen() {
			//todo:this is async, and it needs to not look like it.
			//also check if the socketInfo object gets updated in realtime or if i need to call methods for each access to it.
			//i doubt it gets updated in real time
			return this._tcp.getInfo(this.socketId, function (socketInfo) {
				return socketInfo.connected;
			});
		}
	}, {
		key: "send",
		value: function send(data, byteOffset, byteLength) {
			//chrome.sockets.tcp.send(integer socketId, ArrayBuffer data, function callback)
			//chrome does not need the ondrain, as it sends the entire data the first time
			//update networking to take this into account
			this._tcp.send(this.socketId, data, function (sendInfo) {});
		}
	}, {
		key: "onerror",
		value: function onerror(callback) {
			this._onerror = callback;
		}
	}, {
		key: "ondata",
		value: function ondata(callback) {
			this._tcp.onReceive.addListener(function (info) {});
		}
	}, {
		key: "onopen",
		value: function onopen(callback) {
			this._onopen = callback;
		}
	}, {
		key: "onclose",
		value: function onclose(callback) {
			this._onclose = callback;
		}
	}]);

	return TCPSocket;
})();

module.exports = TCPSocket;