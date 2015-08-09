"use strict";

class UDPSocket {
	constructor(nativeSocket, scriptSecurityManager) {
		this._nativeSocket = nativeSocket; // https://dxr.mozilla.org/comm-central/source/mozilla/netwerk/base/nsIUDPSocket.idl
		this._scriptSecurityManager = scriptSecurityManager;
	}
	init(localPort, localIP, multicastIP) {
		this.localIP = localIP;
		this.localPort = localPort;
		this.multicastIP = multicastIP;

		this._nativeSocket.init(localPort || -1, false, this._scriptSecurityManager, true);
		this._nativeSocket.multicastInterface = localIP;
		this._nativeSocket.joinMulticast(multicastIP, localIP);
		this._nativeSocket.asyncListen(this);
	}
	send(destinationIP, destinationPort, message) { this._nativeSocket.send(destinationIP, destinationPort, message, message.length); }
	close() { this._nativeSocket.close(); }
	leaveMulticast(multicastIP, myIP) { this._nativeSocket.leaveMulticast(multicastIP, myIP); }
	onStopListening(socket, status) {
		if (typeof this._stopListeningEventHandler === "function")
			this._stopListeningEventHandler(status);
	}
	onPacketReceived(socket, message) { // See: https://bugzilla.mozilla.org/show_bug.cgi?id=952927
		if (typeof this._packetReceivedEventHandler === "function")
			this._packetReceivedEventHandler(message);
	}
	onStopListeningEvent(callback) { this._stopListeningEventHandler = callback; }
	onPacketReceivedEvent(callback) { this._packetReceivedEventHandler = callback; }
}


module.exports = UDPSocket;