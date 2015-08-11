/* global Promise */
"use strict";

const Constants = require('../Constants');

class IPResolver {
	constructor(dnsService, udpProvider) {
		this._dnsService = dnsService;
		this._udpProvider = udpProvider;
	}
    resolveIPs() {
        let myName = this._dnsService.myHostName;
        let record = this._dnsService.resolve(myName, 0);
        let addresses = [];
        while (record.hasMore())
            addresses.push(record.getNextAddrAsString());

        if (!addresses.some(address => address === "127.0.0.1"))
            addresses.push("127.0.0.1");

        return new Promise((resolve, reject) => {
            if (addresses.length > 1)
                resolve(addresses.filter((address) => Constants.ipv4Regex.test(address)));
            else
                this._forceGetIPs(resolve);
        });
    }
    _forceGetIPs(resolve) {
        let udpSocket = this._udpProvider.create()

        udpSocket.onPacketReceivedEvent((socket, message) => { // See: https://bugzilla.mozilla.org/show_bug.cgi?id=952927
			socket.close();
			resolve([message.fromAddr.address, '127.0.0.1']);
		});
		udpSocket.init(-1, '0.0.0.0', Constants.IPResolverMulticast);

        udpSocket.send(Constants.IPResolverMulticast, udpSocket.localPort, Constants.forceGetIPMessage, Constants.forceGetIPMessage.length);
    }
}

module.exports = IPResolver;