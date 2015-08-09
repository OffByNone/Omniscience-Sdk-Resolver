'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SdkResolver = (function () {
	function SdkResolver() {
		_classCallCheck(this, SdkResolver);
	}

	_createClass(SdkResolver, [{
		key: 'resolve',
		value: function resolve() {
			var sdk = undefined;
			if (typeof window === 'undefined') sdk = require('./Firefox/AddonSdk');else sdk = require('./Chrome/sdk');
			return sdk;
		}
	}]);

	return SdkResolver;
})();

module.exports = SdkResolver;