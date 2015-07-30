"use strict";

class UDPSocket {
	constructor(nativeSocket, scriptSecurityManager) {
		this._nativeSocket = nativeSocket; // http://dxr.mozilla.org/mozilla-central/source/netwerk/base/public/nsIUDPSocket.idl
		this._scriptSecurityManager = scriptSecurityManager;
	}
	init(sourcePort) {
		this._nativeSocket.init(sourcePort || -1, false, this._scriptSecurityManager);
	}
	listen() {
		this._nativeSocket.asyncListen(this);
	}
	send(destinationIP, destinationPort, message) {
		this._nativeSocket.send(destinationIP, destinationPort, message, message.length);
	}
	close() {
		this._nativeSocket.close();
	}
	joinMulticast(multicastIP, myIP) {
		this._nativeSocket.joinMulticast(multicastIP, myIP);
	}
	leaveMulticast(multicastIP, myIP) {
		this._nativeSocket.leaveMulticast(multicastIP, myIP);
	}
	bind(ipAddress) {
		this._ipAddress = ipAddress;
		this._nativeSocket.multicastInterface = ipAddress;
	}
	onStopListening(socket, status) {
		this._stopListeningEventHandler(status);
	}
	onPacketReceived(socket, message) { // See: https://bugzilla.mozilla.org/show_bug.cgi?id=952927
		this._packetReceivedEventHandler(message);
	}
	onStopListeningEvent(callback) {
		this._stopListeningEventHandler = callback;
	}
	onPacketReceivedEvent(callback) {
		this._packetReceivedEventHandler = callback;
	}
}


module.exports = UDPSocket;