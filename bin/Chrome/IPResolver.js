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
			//based on http://stackoverflow.com/questions/18572365/get-local-ip-of-a-device-in-chrome-extension
			return new Promise(function (resolve, reject) {
				var addresses = ["127.0.0.1"];

				var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

				var peerConnection = new RTCPeerConnection({
					// Don't specify any stun/turn servers, otherwise you will
					// also find your public IP addresses.
					iceServers: []
				});
				// Add a media line, this is needed to activate candidate gathering.
				peerConnection.createDataChannel("");

				// onicecandidate is triggered whenever a candidate has been found.
				peerConnection.onicecandidate = function (event) {
					if (!event.candidate) return resolve(addresses); // Candidate gathering completed.

					var ip = /^candidate:.+ (\S+) \d+ typ/.exec(event.candidate.candidate)[1];
					if (addresses.indexOf(ip) == -1 && Constants.ipv4Regex.test(ip)) // avoid duplicate entries (tcp/udp)
						addresses.push(ip);
				};
				peerConnection.createOffer(function (sdp) {
					peerConnection.setLocalDescription(sdp);
				}, function (err) {});
			});
		}
	}]);

	return IPResolver;
})();

module.exports = IPResolver;
/*todo: something useful here*/