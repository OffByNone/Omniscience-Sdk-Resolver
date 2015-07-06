"use strict";

class SdkResolver {
	constructor() {

	}
	resolve() {
		return require('./Firefox/AddonSdk');
	}
}

module.exports = SdkResolver;