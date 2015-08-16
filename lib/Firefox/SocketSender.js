"use strict";
const Constants = require('../Constants');

class SocketSender {
	constructor() { }

	send(socket, message, keepAlive) {
		return new Promise((resolve, reject) => {
			let offset = 0;
			let remainingBytes = socket.binaryType !== "string" ? message.byteLength : message.length;
			//bytelength is for files, length (binaryType string) is for matchstick commands
			//todo: see if matchstick commands can be sent using arraybuffer
			let sendNextPart = () => {
				let amountToSend = Math.min(remainingBytes, Constants.socketBufferSize);
				let bufferFull = false;
				if (amountToSend !== 0) {
					bufferFull = socket.send(message, offset, amountToSend);
					offset += amountToSend;
					remainingBytes -= amountToSend;

					if (remainingBytes > 0 && !bufferFull) sendNextPart();
				}

				if (remainingBytes === 0) {
					resolve();
					if (!keepAlive) socket.close(); //todo: make timer and add params to keep alive so we can time it out, once keep alive is over x
				}
			};

			socket.ondrain(sendNextPart);
			sendNextPart();
		});
	}
}

module.exports = SocketSender;