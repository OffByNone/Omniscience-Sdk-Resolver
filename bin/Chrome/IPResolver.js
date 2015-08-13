/* global chrome */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var IPResolver = (function () {
	function IPResolver() {
		_classCallCheck(this, IPResolver);
	}

	_createClass(IPResolver, [{
		key: "resolveIPs",
		value: function resolveIPs() {
			return new Promise(function (resolve, reject) {
				chrome.system.network.getNetworkInterfaces(function (interfaces) {
					interfaces.push("127.0.0.1");
					/* for IPv6 support see https://en.wikipedia.org/wiki/Simple_Service_Discovery_Protocol#Protocol_transport_and_addressing */
					resolve(interfaces.filter(function (_ref) {
						var address = _ref.address;
						return Constants.ipv4Regex.test(address);
					}).map(function (_ref2) {
						var address = _ref2.address;
						return address;
					}));
				});
			});
		}
	}]);

	return IPResolver;
})();

module.exports = IPResolver;