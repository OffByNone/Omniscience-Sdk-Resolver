/* global chrome */
/* global Promise */
"use strict";

const Constants = require('../Constants');

class UDPSocket {
	constructor(chromeUdp) {
		this._chromeUdp = chromeUdp;
		this.socketId;
	}
	create(properties) {
		return new Promise((resolve, reject) => {
			this._chromeUdp.create(properties, (createInfo) => {
				this.socketId = createInfo.socketId;
				resolve(createInfo.socketId);
			});
		});
	}
	bind(localAddress, localPort) {
		return new Promise((resolve, reject) => {
			this._chromeUdp.bind(this.socketId, localAddress, localPort || 0, (result) => {
				if (result < 0) reject(result);
				else resolve(result);
			});
		});
	}
	send(data, remoteAddress, remotePort) {
		return new Promise((resolve, reject) => {
			this._chromeUdp.send(this.socketId, data, remoteAddress, remotePort, (sendInfo) => {
				if (sendInfo.resultCode < 0) reject(sendInfo.resultCode);
				else resolve(sendInfo.resultCode, sendInfo.bytesSent);
			});
		});
	}
	close() {
		return new Promise((resolve, reject) => {
			this._chromeUdp.close(this.socketId, () => {
				resolve();
			});
		});
	}
	joinGroup(groupAddress) {
		return new Promise((resolve, reject) => {
			this._chromeUdp.joinGroup(this.socketId, groupAddress, (result) => {
				if (result < 0) reject(result);
				else resolve(result);
			});
		});
	}
	setMulticastLoopbackMode(enabled) {
		return new Promise((resolve, reject) => {
			this._chromeUdp.setMulticastLoopbackMode(this.socketId, enabled, (result) => {
				resolve(result);
			});
		});
	}
	getInfo() {
		return new Promise((resolve, reject) => {
			this._chromeUdp.getInfo(this.socketId, (socketInfo) => {
				resolve(socketInfo);
			});
		});
	}
	onReceive(callback) {
		this._chromeUdp.onReceive.addListener((info) => {
			if (this.socketId !== info.socketId) return;
			var message = {
				data: info.data,
				fromAddr: {
					address: info.remoteAddress,
					port: info.remotePort
				}
			};
			callback(message);
		});
	}
	onReceiveError(callback) {
		this._chromeUdp.onReceiveError.addListener((info) => {
			if (this.socketId !== info.socketId) return;
			callback(info.socketId, info.resultCode);
		});
	}
}


module.exports = UDPSocket;