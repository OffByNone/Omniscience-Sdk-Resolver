/* global chrome */
"use strict";
const Constants = require('../Constants');

class IPResolver {
	constructor() { }

	resolveIPs() {
		return new Promise((resolve, reject) => {
			chrome.system.network.getNetworkInterfaces(interfaces =>
				resolve(interfaces.map(interfaced => interfaced.address)));
		});
	}
}

module.exports = IPResolver;