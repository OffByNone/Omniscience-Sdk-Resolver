/* global chrome */
"use strict";

module.exports = {
	notify: (options) => {
		let cordovaOptions = {
			title: options.title,
			text: options.text,
			icon: options.iconURL
		};
		window.cordova.plugins.notification.local.schedule(cordovaOptions);
	}
};