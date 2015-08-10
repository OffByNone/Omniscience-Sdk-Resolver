"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var MimeService = (function () {
	function MimeService() {
		_classCallCheck(this, MimeService);
	}

	_createClass(MimeService, [{
		key: "getMimeType",
		value: function getMimeType(file) {
			var fileNameParts = file.name.split(".");
			var extension = fileNameParts[fileNameParts.length - 1];
			return Constants.mimetypes[extension] || Constants.defaultMimeType;
		}
	}]);

	return MimeService;
})();

module.exports = MimeService;