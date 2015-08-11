"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UrlSdk = (function () {
	function UrlSdk(windowUrl) {
		_classCallCheck(this, UrlSdk);

		this._windowUrl = windowUrl;
	}

	_createClass(UrlSdk, [{
		key: "isValidURI",
		value: function isValidURI(path) {
			try {
				if (path instanceof URL) return true;
				new (this._windowUrl(path))();
				return true;
			} catch (e) {
				return false;
			}
		}
	}, {
		key: "URL",
		value: function URL(source, base) {
			if (base) return new window.URL(source, base);else return new window.URL(source);
		}
	}]);

	return UrlSdk;
})();

module.exports = UrlSdk;