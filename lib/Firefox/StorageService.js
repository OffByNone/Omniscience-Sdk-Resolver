"use strict";

class StorageService {
	constructor(nativeStorage) {
		this._nativeStorage = nativeStorage;
	}
	get(key) {
		return new Promise((resolve, reject) => {
			resolve(this._nativeStorage[key]);
		});
	}
	set(key, value) {
		this._nativeStorage[key] = value;
	}
	remove(key) {
		delete this._nativeStorage[key];
	}
}

module.exports = StorageService;