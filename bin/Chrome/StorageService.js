/* global chrome */
"use strict";

module.exports = {
	get: function get(key) {
		return chrome.storage.sync.get(key);
	},
	set: function set(key, value) {
		chrome.storage.sync.set({ key: value });
	},
	remove: function remove(key) {
		chrome.storage.sync.remove(key);
	}
};