"use strict";

class SdkResolver {
	constructor() {

	}
	resolve() {
		let sdk;
		if (typeof window === 'undefined')
			sdk = require('./Firefox/AddonSdk');
		else
			sdk = require('./Chrome/sdk');

		return sdk;
	}
}

module.exports = SdkResolver;