/* global chrome */
"use strict";

module.exports = {
	get: (key) => {
		return new Promise((resolve, reject) => {
			if (typeof chrome.runtime.lastError === "undefined")
				chrome.storage.local.get(key, (items) => resolve(items));
			else
				console.log(chrome.runtime.lastError.message);
		});
	},
	set: (key, value) => {
		chrome.storage.local.set({ key: value });
	},
	remove: (key) => {
		chrome.storage.local.remove(key);
	}
};