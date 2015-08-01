/* global chrome */
"use strict";

module.exports = {
	get: (key) => {
		return chrome.storage.local.get(key);
	},
	set: (key, value) => {
		chrome.storage.local.set({ key: value });
	},
	remove: (key) => {
		chrome.storage.local.remove(key);
	}
};