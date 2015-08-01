"use strict";
const Constants = require('../Constants');

class IPResolver {
	constructor() { }

	resolveIPs() {
		//based on http://stackoverflow.com/questions/18572365/get-local-ip-of-a-device-in-chrome-extension
		return new Promise((resolve, reject) => {
			var addresses = ["127.0.0.1"];

			var RTCPeerConnection = window.RTCPeerConnection ||
				window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

			var peerConnection = new RTCPeerConnection({
				// Don't specify any stun/turn servers, otherwise you will
				// also find your public IP addresses.
				iceServers: []
			});
			// Add a media line, this is needed to activate candidate gathering.
			peerConnection.createDataChannel('');

			// onicecandidate is triggered whenever a candidate has been found.
			peerConnection.onicecandidate = (event) => {
				if (!event.candidate) return resolve(addresses); // Candidate gathering completed.

				var ip = /^candidate:.+ (\S+) \d+ typ/.exec(event.candidate.candidate)[1];
				if (addresses.indexOf(ip) == -1 && Constants.ipv4Regex.test(ip)) // avoid duplicate entries (tcp/udp)
					addresses.push(ip);
			};
			peerConnection.createOffer((sdp) => {
				peerConnection.setLocalDescription(sdp);
			}, (err) => {/*todo: something useful here*/ });
		});
	}
}

module.exports = IPResolver;