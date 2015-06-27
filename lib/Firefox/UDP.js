"use strict";

class UDP {
	constructor(udpSocketProvider, scriptSecurityManager) {
		this._udpSocketProvider = udpSocketProvider;
		this._scriptSecurityManager = scriptSecurityManager;
	}
    createUDPSocket (sourcePort){
        let socket = this._udpSocketProvider();
        socket.init(sourcePort || -1, false, this._scriptSecurityManager);
        return socket;
    }
}

module.exports = UDP;