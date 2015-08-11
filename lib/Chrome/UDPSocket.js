/* global chrome */
/* global Promise */
"use strict";

const Constants = require('../Constants');

class UDPSocket {
	constructor(udp, lastError) {
		this._udp = udp;
		this._lastError = lastError;

		this._initialized = false;
		this._sendQueue = [];
	}
	init(localPort, localIP, multicastIP) {
		this.localPort = localPort || 0;
		this.localIP = localIP;
		this.multicastIP = multicastIP;

		this._udp.create({ bufferSize: Constants.socketBufferSize }, (createInfo) => {
			this._socketId = createInfo.socketId;
			this._udp.bind(this._socketId, localIP, this.localPort, (result) => {
				if (result < 0) {
					/* console.log(this._lastError.message);*/
					return;
				}

				this._udp.joinGroup(this._socketId, this.multicastIP, () => {
					this._initialized = true;
					this._sendQueue.forEach((queuedMessage) =>
						this._udp.send(this._socketId, queuedMessage.message.buffer, queuedMessage.destinationIP, queuedMessage.destinationPort, () => { }));
				});
			});
		});
	}
	send(destinationIP, destinationPort, message) {
		if (!this._initialized)
			this._sendQueue.push({ destinationIP, destinationPort, message });
		else
			this._udp.send(this._socketId, message.buffer, destinationIP, destinationPort, () => { });
	}
	close() {
		this._udp.close(this._socketId, () => {
			if (typeof this._stopListeningEventHandler === "function")
				this._stopListeningEventHandler();
		});
	}
	onStopListeningEvent(callback) {
		this._stopListeningEventHandler = callback;
	}
	onPacketReceivedEvent(callback) {
		this._udp.onReceive.addListener((info) => {
			if (info.socketId == this._socketId) {
				var message = {
					data: info.data,
					fromAddr: {
						address: info.remoteAddress,
						port: info.remotePort
					}
				};
				callback(message);
			}
		});
	}
}


module.exports = UDPSocket;