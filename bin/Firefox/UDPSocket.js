"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UDPSocket = (function () {
	function UDPSocket(nativeSocket, scriptSecurityManager) {
		_classCallCheck(this, UDPSocket);

		this._nativeSocket = nativeSocket; // http://dxr.mozilla.org/mozilla-central/source/netwerk/base/public/nsIUDPSocket.idl
		this._scriptSecurityManager = scriptSecurityManager;
	}

	_createClass(UDPSocket, [{
		key: "init",
		value: function init(sourcePort) {
			this._nativeSocket.init(sourcePort || -1, false, this._scriptSecurityManager);
		}
	}, {
		key: "listen",
		value: function listen() {
			this._nativeSocket.asyncListen(this);
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
		key: "joinMulticast",
		value: function joinMulticast(multicastIP, myIP) {
			this._nativeSocket.joinMulticast(multicastIP, myIP);
		}
	}, {
		key: "leaveMulticast",
		value: function leaveMulticast(multicastIP, myIP) {
			this._nativeSocket.leaveMulticast(multicastIP, myIP);
		}
	}, {
		key: "bind",
		value: function bind(ipAddress) {
			this._ipAddress = ipAddress;
			this._nativeSocket.multicastInterface = ipAddress;
		}
	}, {
		key: "onStopListening",
		value: function onStopListening(socket, status) {
			this._stopListeningEventHandler(status);
		}
	}, {
		key: "onPacketReceived",
		value: function onPacketReceived(socket, message) {
			// See: https://bugzilla.mozilla.org/show_bug.cgi?id=952927
			this._packetReceivedEventHandler(message);
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