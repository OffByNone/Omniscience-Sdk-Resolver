"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StorageService = (function () {
	function StorageService(nativeStorage) {
		_classCallCheck(this, StorageService);

		this._nativeStorage = nativeStorage;
	}

	_createClass(StorageService, [{
		key: "get",
		value: function get(key) {
			var _this = this;

			return new Promise(function (resolve, reject) {
				resolve(_this._nativeStorage[key]);
			});
		}
	}, {
		key: "set",
		value: function set(key, value) {
			this._nativeStorage[key] = value;
		}
	}, {
		key: "remove",
		value: function remove(key) {
			delete this._nativeStorage[key];
		}
	}]);

	return StorageService;
})();

module.exports = StorageService;