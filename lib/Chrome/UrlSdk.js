class UrlSdk {
	constructor(windowUrl) {
		this._windowUrl = windowUrl;
	}
	isValidURI(path) {
		try {
			new (this._windowUrl(path));
			return true;
		}
		catch (e) {
			return false;
		}
	}
	URL(source, base) {
		if (base)
			return new window.URL(source, base);
		else
			return new window.URL(source);
	}
}

module.exports = UrlSdk;