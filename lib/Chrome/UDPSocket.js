/* global chrome */
/* global Promise */
"use strict";

const Constants = require('../Constants');

class UDPSocket {
	constructor(udp) {
		this._udp = udp;
	}
	init(sourcePort) {
		this._port = sourcePort;
		this._udp.create({ bufferSize: Constants.socketBufferSize }, (createInfo) => {
			this._socketId = createInfo.socketId;
		});
	}
	bind(ipAddress) {
		this._ipAddress = ipAddress;
		this._udp.bind(this._socketId, ipAddress, this._port || 0);
	}
	send(destinationIP, destinationPort, message) {
		this._udp.send(this._socketId, message, destinationIP, destinationPort);
	}
	close() {
		this._udp.close(this._socketId, this._stopListeningEventHandler);
	}
	listen() {	}
	joinMulticast(multicastIP, networkInterface) {
		this._udp.joinGroup(this._socketId, multicastIP);
	}
	leaveMulticast(multicastIP, networkInterface) {
		this._udp.leaveGroup(this._socketId, multicastIP);
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