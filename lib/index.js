"use strict";

class SdkResolver {
	constructor() {

	}
	resolve() {
		return require('./Chrome/sdk.js');
	}
}

module.exports = SdkResolver;