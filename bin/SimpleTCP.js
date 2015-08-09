/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SimpleTCP = (function () {
	function SimpleTCP(simpleTCPSocket) {
		_classCallCheck(this, SimpleTCP);

		this._simpleTCPSocket = simpleTCPSocket;
	}

	_createClass(SimpleTCP, [{
		key: "send",
		value: function send(ip, port, data, waitForResponse) {
			return this._simpleTCPSocket.send(ip, port, data, waitForResponse);
		}
	}, {
		key: "ping",
		value: function ping(ip, port) {
			return this._simpleTCPSocket.ping(ip, port);
		}
	}]);

	return SimpleTCP;
})();

module.exports = SimpleTCP;