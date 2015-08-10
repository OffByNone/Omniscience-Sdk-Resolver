'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Constants = require('../Constants');

var MimeService = (function () {
				function MimeService(nativeMimeService) {
								_classCallCheck(this, MimeService);

								this._nativeMimeService = nativeMimeService;
				}

				_createClass(MimeService, [{
								key: 'getMimeType',
								value: function getMimeType(file) {
												/*
             * From Mozilla
            * Gets a content-type for the given file, by
            * asking the global MIME service for a content-type, and finally by failing
            * over to application/octet-stream.
            *
            * @param file : nsIFile
            * the nsIFile for which to get a file type
            * @returns string
            * the best content-type which can be determined for the file
            */
												try {
																return this._nativeMimeService.getTypeFromFile(file);
												} catch (e) {
																return Constants.defaultMimeType;
												}
								}
				}]);

				return MimeService;
})();

module.exports = MimeService;