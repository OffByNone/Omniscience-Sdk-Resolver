/* global chrome */
"use strict";

module.exports = {
	get: function get(key) {
		return chrome.storage.local.get(key);
	},
	set: function set(key, value) {
		chrome.storage.local.set({ key: value });
	},
	remove: function remove(key) {
		chrome.storage.local.remove(key);
	}
};