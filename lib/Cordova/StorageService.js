"use strict";

module.exports = {
	get: (key) => {
		return new Promise((resolve, reject) => {
			resolve(window.localStorage.getItem(key));
		});
	},
	set: (key, value) => {
		window.localStorage.setItem(key, value);
	},
	remove: (key) => {
		window.localStorage.removeItem(key);
	}
};