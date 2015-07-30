"use strict";

//https://dxr.mozilla.org/mozilla-central/source/dom/network/interfaces/nsIDOMTCPSocket.idl

class TCPSocket {
	constructor(nativeTCPSocket) {
		this._nativeTCPSocket = nativeTCPSocket;
	}
	open(host, port, options) {
		this.host = host;
		this.port = port;

		if (options && options.hasOwnProperty("binaryType"))
			this.binaryType = options.binaryType;
		else
			this.binaryType = "string";

		this.socket = this._nativeTCPSocket.open(host, port, options);

		return this;
	}
	listen(localPort, options, backlog) {
		this.port = localPort;

		if (options && options.hasOwnProperty("binaryType"))
			this.binaryType = options.binaryType;
		else
			this.binaryType = "string";

		this.socket = this._nativeTCPSocket.listen(localPort, options, backlog);

		return this;
	}

	close() {
		this.socket.close();
	}

	isOpen() {
		return this.socket.readyState === "open";
	}

	send(data, byteOffset, byteLength) {
		if (this.socket != null) {
			return this.socket.send(data, byteOffset, byteLength);
		}
		else
			new Error("Underlying socket is null.  Create a socket then try again.");
	}
	onerror(callback) {
		if (this.socket != null)
			this.socket.onerror = callback;
		else
			new Error("Underlying socket is null.  Create a socket then try again.");
	}
	ondata(callback) {
		if (this.socket != null)
			this.socket.ondata = (event) => callback(event.data);
		else
			new Error("Underlying socket is null.  Create a socket then try again.");
	}
	onopen(callback) {
		if (this.socket != null)
			this.socket.onopen = callback;
		else
			new Error("Underlying socket is null.  Create a socket then try again.");
	}
	onclose(callback) {
		if (this.socket != null)
			this.socket.onclose = callback;
		else
			new Error("Underlying socket is null.  Create a socket then try again.");
	}
	ondrain(callback) {
		if (this.socket != null)
			this.socket.ondrain = callback;
		else
			new Error("Underlying socket is null.  Create a socket then try again.");
	}
	onconnect(callback) {
		if (this.socket != null) {
			this.socket.onconnect = (incomingSocket) => {
				let wrappedSocket = new TCPSocket();
				wrappedSocket.socket = incomingSocket;
				callback(wrappedSocket);
			};
		}
		else
			new Error("Underlying socket is null.  Create a socket then try again.");
	}
}

module.exports = TCPSocket;