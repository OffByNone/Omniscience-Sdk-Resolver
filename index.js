const FirefoxSdk = require('./lib/AddonSdk');

class SdkResolver {
	constructor() {

	}
	resolve() {
		return new FirefoxSdk();
	}
}

module.exports = SdkResolver;