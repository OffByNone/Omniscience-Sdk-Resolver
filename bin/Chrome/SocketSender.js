"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var SocketSender = (function () {
	function SocketSender(chromeTCP) {
		_classCallCheck(this, SocketSender);

		this._chromeTCP = chromeTCP;
	}

	_createClass(SocketSender, [{
		key: "send",
		value: function send(socketId, data, keepAlive) {
			var _this = this;

			//todo: look into chrome.sockets.tcp.setKeepAlive -- I think it is for the client not the server
			return new Promise(function (resolve, reject) {
				_this._chromeTCP.send(socketId, data, function (resultCode, bytesSent) {
					//todo: i have a sneaking suspicion that the bytesSent is going to be either the buffer size
					//or file size whichever is smaller and I am going to have to loop like I do in FF
					resolve();
					if (!keepAlive) _this._chromeTCP.close(socketId, null);
				});
			});
		}
	}]);

	return SocketSender;
})();

module.exports = SocketSender;