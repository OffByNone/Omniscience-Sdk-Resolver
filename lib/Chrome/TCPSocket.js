/* global chrome */
/* global Promise */
"use strict";

const Constants = require('../Constants');

class TCPSocket {
	constructor(tcp, tcpServer, ipResolver) {
		this._tcp = tcp; //https://developer.chrome.com/apps/sockets_tcp
		this._tcpServer = tcpServer; //https://developer.chrome.com/apps/sockets_tcpServer
		this._ipResolver = ipResolver;
		this.binaryType = "arraybuffer";
	}

	listen(localPort, options, backlog) { //HttpServer.js:23
		this.port = localPort;

		this._ipResolver.resolveIPs().then(addresses =>
			addresses.forEach(address =>
				this._tcpServer.create({}, (createInfo) =>
					this._tcpServer.listen(createInfo.socketId, address, localPort))));

		return this;
	}

	onconnect(callback) { //HttpServer.js:27
		this._tcpServer.onAccept.addListener((info) => {
			//info.clientSocketId is the id of the incoming socket and is of this.tcp also it is initially paused and must be unpaused
			this._tcp.getSockets((socketInfos) => {
				this._tcp.setPaused(info.clientSocketId, false);
				let nativeSocketInfo = socketInfos.filter(socketInfo => socketInfo.socketId === info.clientSocketId);
				let wrappedSocket = new TCPSocket(this._tcp, this._tcpServer);
				wrappedSocket.socketId = nativeSocketInfo.socketId;

				callback(wrappedSocket);
			});
		});
	}

	open(host, port) {
		this.host = host;
		this.port = port;

		this._tcp.create(null, (createInfo) => {
			this.socketId = createInfo.socketId;
			this._tcp.connect(createInfo.socketId, host, port, this.onopen);
		});

		return this;
	}

	close() {
		//there are two close methods, one for _tcp and one for _tcpServer.
		//wonder if i can always call them both or if either will do
		this._tcp.close(this.socketId);
		this._tcpServer.close(this.socketId);
	}

	isOpen() {
		//todo:this is async, and it needs to not look like it.
		//also check if the socketInfo object gets updated in realtime or if i need to call methods for each access to it.
		//i doubt it gets updated in real time
		return this._tcp.getInfo(this.socketId, (socketInfo) => socketInfo.connected);
	}

	send(data, byteOffset, byteLength) {
		//chrome.sockets.tcp.send(integer socketId, ArrayBuffer data, function callback)
		//chrome does not need the ondrain, as it sends the entire data the first time
		//update networking to take this into account
		this._tcp.send(this.socketId, data, (sendInfo) => {

		});
	}
	onerror(callback) {
		this._onerror = callback;
	}
	ondata(callback) {
		this._tcp.onReceive.addListener((info) => {
			
		});
	}
	onopen(callback) {
		this._onopen = callback;
	}
	onclose(callback) {
		this._onclose = callback;
	}
}

module.exports = TCPSocket;