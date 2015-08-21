"use strict";
const Constants = require('../Constants');

class SocketSender {
	constructor(chromeTCP) {
		this._chromeTCP = chromeTCP;
	}

	send(socketId, data, keepAlive) {
		//todo: look into chrome.sockets.tcp.setKeepAlive -- I think it is for the client not the server
		return new Promise((resolve, reject) => {
			this._chromeTCP.send(socketId, data, (resultCode, bytesSent) => {
				//todo: i have a sneaking suspicion that the bytesSent is going to be either the buffer size
				//or file size whichever is smaller and I am going to have to loop like I do in FF
				resolve();
				if (!keepAlive)
					this._chromeTCP.close(socketId, null);
			});
		});
	}
}

module.exports = SocketSender;