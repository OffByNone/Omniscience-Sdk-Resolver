"use strict";

//https://dxr.mozilla.org/mozilla-central/source/dom/network/interfaces/nsIDOMTCPSocket.idl

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TCPSocket = (function () {
	function TCPSocket(nativeTCPSocket) {
		_classCallCheck(this, TCPSocket);

		this._nativeTCPSocket = nativeTCPSocket;
	}

	_createClass(TCPSocket, [{
		key: "open",
		value: function open(host, port, options) {
			this.host = host;
			this.port = port;

			if (options && options.hasOwnProperty("binaryType")) this.binaryType = options.binaryType;else this.binaryType = "string";

			this.socket = this._nativeTCPSocket.open(host, port, options);

			return this;
		}
	}, {
		key: "listen",
		value: function listen(localPort, options, backlog) {
			this.port = localPort;

			if (options && options.hasOwnProperty("binaryType")) this.binaryType = options.binaryType;else this.binaryType = "string";

			this.socket = this._nativeTCPSocket.listen(localPort, options, backlog);

			return this;
		}
	}, {
		key: "close",
		value: function close() {
			this.socket.close();
		}
	}, {
		key: "isOpen",
		value: function isOpen() {
			return this.socket.readyState === "open";
		}
	}, {
		key: "send",
		value: function send(data, byteOffset, byteLength) {
			if (this.socket != null) {
				return this.socket.send(data, byteOffset, byteLength);
			} else new Error("Underlying socket is null.  Create a socket then try again.");
		}
	}, {
		key: "onerror",
		value: function onerror(callback) {
			if (this.socket != null) this.socket.onerror = callback;else new Error("Underlying socket is null.  Create a socket then try again.");
		}
	}, {
		key: "ondata",
		value: function ondata(callback) {
			if (this.socket != null) this.socket.ondata = function (event) {
				return callback(event.data);
			};else new Error("Underlying socket is null.  Create a socket then try again.");
		}
	}, {
		key: "onopen",
		value: function onopen(callback) {
			if (this.socket != null) this.socket.onopen = callback;else new Error("Underlying socket is null.  Create a socket then try again.");
		}
	}, {
		key: "onclose",
		value: function onclose(callback) {
			if (this.socket != null) this.socket.onclose = callback;else new Error("Underlying socket is null.  Create a socket then try again.");
		}
	}, {
		key: "ondrain",
		value: function ondrain(callback) {
			if (this.socket != null) this.socket.ondrain = callback;else new Error("Underlying socket is null.  Create a socket then try again.");
		}
	}, {
		key: "onconnect",
		value: function onconnect(callback) {
			if (this.socket != null) {
				this.socket.onconnect = function (incomingSocket) {
					var wrappedSocket = new TCPSocket();
					wrappedSocket.socket = incomingSocket;
					callback(wrappedSocket);
				};
			} else new Error("Underlying socket is null.  Create a socket then try again.");
		}
	}]);

	return TCPSocket;
})();

module.exports = TCPSocket;