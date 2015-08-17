/* global chrome */
/* global Promise */
"use strict";

const Constants = require('../Constants');

class SimpleUDPSocket {
	constructor(udpSocketProvider) {
		this._udpSocketProvider = udpSocketProvider;

		this._initialized = false;
		this._sendQueue = [];

		this.localPort;
		this.localIP;
		this.multicastIP;
		this.udpSocket;
	}
	init(localPort, localIP, multicastIP) {
		this.udpSocket = this._udpSocketProvider.create();

		this.udpSocket.create({ bufferSize: Constants.socketBufferSize })
			.then(() => {
				return this.udpSocket.setMulticastLoopbackMode(true);
			})
			.then((result) => {
				if (result < 0) throw new Error("setting multicast loopback mode failed with error code: " + result);
				return this.udpSocket.bind(localIP, localPort);
			})
			.then((result) => {
				if (result < 0) throw new Error("binding udp socket failed with error code: " + result);
				return this.udpSocket.getInfo();
			})
			.then((socketInfo) => {
				this.localPort = socketInfo.localPort;
				this.localIP = socketInfo.localAddress;
				this.multicastIP = multicastIP;
				return this.udpSocket.joinGroup(this.multicastIP);
			})
			.then(() => {
				this._initialized = true;
				this._sendQueue.forEach((queuedMessage) =>
					this.udpSocket.send(queuedMessage.message.buffer, queuedMessage.destinationIP, queuedMessage.destinationPort));
			});
	}
	send(destinationIP, destinationPort, message) {
		if (!this._initialized)
			this._sendQueue.push({ destinationIP, destinationPort, message });
		else
			this.udpSocket.send(message.buffer, destinationIP, destinationPort);
	}
	close() {
		this.udpSocket.close().then(() => {
			if (typeof this._stopListeningEventHandler === "function")
				this._stopListeningEventHandler();
		});
	}
	onStopListeningEvent(callback) {
		this._stopListeningEventHandler = callback;
	}
	onPacketReceivedEvent(callback) {
		this.udpSocket.onReceive(callback);
	}
}


module.exports = SimpleUDPSocket;