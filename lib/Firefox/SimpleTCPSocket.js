/* global Promise */
"use strict";

class SimpleTCPSocket {
	constructor(timers, tcpSocketProvider, socketSender) {
		this.responseTimeout = 60000;
		this._timers = timers;
		this._tcpSocketProvider = tcpSocketProvider;
		this._socketSender = socketSender;
	}
	send(ip, port, data, waitForResponse) {
		return new Promise((resolve, reject) => {
			let socket = this._tcpSocketProvider.create().open(ip, port);
			socket.onopen(() => this._onopen(socket, data, waitForResponse, reject));
			socket.onerror((err) => reject(err));
			socket.ondata((dataReceived) => this._ondata(dataReceived, socket, resolve));
		});
	}
	ping(ip, port) {
		return new Promise((resolve, reject) => {
			/*todo: maybe add a timeout?*/
			let resolved = false;
			let socket = this._tcpSocketProvider.create().open(ip, port);
			socket.onopen(() => {
				resolved = true;
				resolve(true);
				socket.close();
			});
			socket.onerror((err) => {
				if (!resolved) resolve(false);
			});
		});
	}
	_onopen(socket, data, waitForResponse, reject) {
		this._socketSender.send(socket, data, waitForResponse);
		this._timers.setTimeout(() => {
			try {
				socket.close();
				reject('Device did not respond within ' + (this.responseTimeout / 1000) + ' seconds.');
			}
			catch (e) {
				/* todo: if the error is anything other than the socket is already closed, throw
				 * already closed, meaning we already got the response
				 * nothing to see here, move along
				 */
			}
		}, this.responseTimeout);
	}
	_ondata(dataReceived, socket, resolve) {
		/*todo: this will only work when the entire response fits into a single packet, need to loop over this and parse it like in the HttpRequestParser, only different*/
		socket.close();
		resolve(dataReceived);
	}
}

module.exports = SimpleTCPSocket;
