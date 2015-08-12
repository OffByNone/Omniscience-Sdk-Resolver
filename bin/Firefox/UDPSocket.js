"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UDPSocket = (function () {
	function UDPSocket(nativeSocket, scriptSecurityManager) {
		_classCallCheck(this, UDPSocket);

		this._nativeSocket = nativeSocket; // https://dxr.mozilla.org/comm-central/source/mozilla/netwerk/base/nsIUDPSocket.idl
		this._scriptSecurityManager = scriptSecurityManager;
	}

	_createClass(UDPSocket, [{
		key: "init",
		value: function init(localPort, localIP, multicastIP) {
			this.localIP = localIP;
			this.multicastIP = multicastIP;

			this._nativeSocket.init(localPort || -1, false, this._scriptSecurityManager, true);
			this._nativeSocket.multicastInterface = localIP;
			this._nativeSocket.joinMulticast(multicastIP, localIP);
			this._nativeSocket.asyncListen(this);

			this.localPort = this._nativeSocket.port;
		}
	}, {
		key: "send",
		value: function send(destinationIP, destinationPort, message) {
			this._nativeSocket.send(destinationIP, destinationPort, message, message.length);
		}
	}, {
		key: "close",
		value: function close() {
			this._nativeSocket.close();
		}
	}, {
		key: "leaveMulticast",
		value: function leaveMulticast(multicastIP, myIP) {
			this._nativeSocket.leaveMulticast(multicastIP, myIP);
		}
	}, {
		key: "onStopListening",
		value: function onStopListening(socket, status) {
			if (typeof this._stopListeningEventHandler === "function") this._stopListeningEventHandler(status);
		}
	}, {
		key: "onPacketReceived",
		value: function onPacketReceived(socket, message) {
			// See: https://bugzilla.mozilla.org/show_bug.cgi?id=952927
			if (typeof this._packetReceivedEventHandler === "function") this._packetReceivedEventHandler(message);
		}
	}, {
		key: "onStopListeningEvent",
		value: function onStopListeningEvent(callback) {
			this._stopListeningEventHandler = callback;
		}
	}, {
		key: "onPacketReceivedEvent",
		value: function onPacketReceivedEvent(callback) {
			this._packetReceivedEventHandler = callback;
		}
	}]);

	return UDPSocket;
})();

module.exports = UDPSocket;