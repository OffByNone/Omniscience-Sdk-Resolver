
/* global Promise */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Constants = require('../Constants');

var FileUtilities = (function () {
	function FileUtilities(mimeService) {
		_classCallCheck(this, FileUtilities);

		this._fileSystem = chrome.app.window.get('omniscience').contentWindow.chrome.fileSystem;
		this._mimeService = mimeService;
		this._openedFiles = {};
	}

	_createClass(FileUtilities, [{
		key: 'readBytes',
		value: function readBytes(filePath) {
			var _this = this;

			return new Promise(function (resolve, reject) {
				_this._fileSystem.restoreEntry(_this._openedFiles[filePath], function (entry) {
					entry.file(function (file) {
						var reader = new FileReader();

						reader.onerror = function (err) {
							return reject(err);
						};
						reader.onloadend = function (event) {
							return resolve(event.target.result);
						};
						reader.readAsArrayBuffer(file);
					});
					resolve(entry, _this._mimeService(entry.name));
				});
			});
		}
	}, {
		key: 'openFileBrowser',
		value: function openFileBrowser() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				_this2._fileSystem.chooseEntry({
					type: Constants.chromeSdk.filePicker.open,
					/*accepts: [Constants.chromeSdk.filePicker.filterAll],*/
					acceptsMultiple: true
				}, function (fileEntries) {
					var files = [];
					fileEntries.forEach(function (file, index) {
						_this2._fileSystem.getDisplayPath(file, function (filePath) {
							var fileInfo = {
								path: filePath,
								name: file.name,
								type: _this2._mimeService.getMimeType(file)
							};
							files.push(fileInfo);

							var fileId = _this2._fileSystem.retainEntry(file);
							_this2._openedFiles[filePath] = fileId;

							if (index === fileEntries.length - 1) resolve(files); //final time through loop resolve the promise
						});
					});
				});
			});
		}
	}]);

	return FileUtilities;
})();

module.exports = FileUtilities;