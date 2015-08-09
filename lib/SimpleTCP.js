/* global Promise */
"use strict";

class SimpleTCP {
	constructor(simpleTCPSocket) {
		this._simpleTCPSocket = simpleTCPSocket;
	}
	send(ip, port, data, waitForResponse) {
		return this._simpleTCPSocket.send(ip, port, data, waitForResponse);
	}
	ping(ip, port) {
		return this._simpleTCPSocket.ping(ip, port);
	}
}

module.exports = SimpleTCP;
