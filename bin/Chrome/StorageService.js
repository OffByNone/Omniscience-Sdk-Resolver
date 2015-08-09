/* global chrome */
"use strict";

module.exports = {
	get: function get(key) {
		return new Promise(function (resolve, reject) {
			if (typeof chrome.runtime.lastError === "undefined") chrome.storage.local.get(key, function (items) {
				return resolve(items);
			});else console.log(chrome.runtime.lastError.message);
		});
	},
	set: function set(key, value) {
		chrome.storage.local.set({ key: value });
	},
	remove: function remove(key) {
		chrome.storage.local.remove(key);
	}
};