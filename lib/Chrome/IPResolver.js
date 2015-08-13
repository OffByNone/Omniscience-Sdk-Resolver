/* global chrome */
"use strict";
const Constants = require('../Constants');

class IPResolver {
	constructor() { }

	resolveIPs() {
		return new Promise((resolve, reject) => {
			chrome.system.network.getNetworkInterfaces(interfaces => {
				interfaces.push("127.0.0.1");
				/* for IPv6 support see https://en.wikipedia.org/wiki/Simple_Service_Discovery_Protocol#Protocol_transport_and_addressing */
				resolve(interfaces
					.filter(({address}) => Constants.ipv4Regex.test(address))
					.map(({address}) => address));
			});
		});
	}
}

module.exports = IPResolver;