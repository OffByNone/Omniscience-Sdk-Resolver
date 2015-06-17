

class SdkResolver {
	constructor() {

	}
	resolve() {
		var FirefoxSdk = require('./AddonSdk');
		return new FirefoxSdk();
	}
}

module.exports = SdkResolver;