

class SdkResolver {
	constructor() {

	}
	resolve() {
		return require('./AddonSdk');
	}
}

module.exports = SdkResolver;