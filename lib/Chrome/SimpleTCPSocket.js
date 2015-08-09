/* global Promise */
"use strict";

class SimpleTCPSocket {
	constructor(timers, chromeTCP, lastError) {
		this.responseTimeout = 60000;
		this._timers = timers;
		this._chromeTCP = chromeTCP;
		this._lastError = lastError;
	}
	send(ip, port, data, waitForResponse) {
		return new Promise((resolve, reject) => {
			/*todo: maybe add a timeout?*/
			this._chromeTCP.create({ name: `send@${ip}:${port}` }, ({socketId}) => {
				let mySocketId = socketId;
				this._chromeTCP.connect(socketId, ip, parseInt(port,10), (resultCode) => {
					if (resultCode < 0)
						reject(this._lastError.message);

					/* todo: there is likely a better way to do the onReceive and onReceiveError
					 * since they are fired for all TCP from this app, if they could be put
					 * in a place to only be bound once it would be likely better
					 */
					this._chromeTCP.onReceiveError.addListener(({socketId, data}) => {
						if (socketId !== mySocketId) return;

						resolve(data);
						this._chromeTCP.close(socketId);
					});
					this._chromeTCP.onReceive.addListener(({socketId, resultCode}) => {
						if (socketId !== mySocketId) return;

						reject(this._lastError.message);
						this._chromeTCP.close(socketId);
					});

					this._chromeTCP.send(mySocketId, data, ({resultCode, bytesSent}) => {
						if (resultCode < 0)
							reject(this._lastError.message);
						if (!waitForResponse)
							this._chromeTCP.close(mySocketId);
						else {
							this._timers.setTimeout(() => {
								this._chromeTCP.close(mySocketId);
								reject('Device did not respond within ' + (this.responseTimeout / 1000) + ' seconds.');
							}, this.responseTimeout);
						}
					});
				});
			})
		});
	}
	ping(ip, port) {
		return new Promise((resolve, reject) => {
			/*todo: maybe add a timeout?*/
			this._chromeTCP.create({ name: `ping@${ip}:${port}` }, ({socketId}) => {
				this._chromeTCP.connect(socketId, ip, parseInt(port,10), (resultCode) => {
					resolve(resultCode >= 0);
					this._chromeTCP.close(socketId);
				});
			})
		});
	}
}

module.exports = SimpleTCPSocket;
