/* global chrome */
/* global Promise */
"use strict";

const Constants = require('../Constants');

class UDPSocket {
	constructor(udp) {
		this._udp = udp;
		this._initialized = false;
		this._sendQueue = [];
	}
	init(localPort, localIP, multicastIP) {
		this._localPort = localPort || 0;
		this._localIP = localIP;
		this._multicastIP = multicastIP;

		this._udp.create({ bufferSize: Constants.socketBufferSize }, (createInfo) => {
			this._socketId = createInfo.socketId;
			console.log(localIP + ":" + this._localPort);
			this._udp.bind(this._socketId, localIP, this._localPort, (result) => {
				console.log(result);
				if (result >= 0) {
					this._udp.joinGroup(this._socketId, this._multicastIP, () => {
						this._initialized = true;
						this._sendQueue.forEach((queuedMessage) =>
							this._udp.send(this._socketId, queuedMessage.message.buffer, queuedMessage.destinationIP, queuedMessage.destinationPort, () => { }));
					});
				}
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
		this._udp.close(this._socketId, () => this._stopListeningEventHandler());
	}
	listen() { }
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