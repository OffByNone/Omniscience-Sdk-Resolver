
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

		//todo: this is all tech debt baby
		window.omniscience = window.omniscience || {};
		window.omniscience.FileUtilities = window.omniscience.FileUtilities || {};
		window.omniscience.FileUtilities._openedFiles = window.omniscience.FileUtilities._openedFiles || {};

		this._openedFiles = window.omniscience.FileUtilities._openedFiles;
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
							return resolve(new Uint8Array(event.target.result), _this._mimeService.getMimeType(entry));
						};
						reader.readAsArrayBuffer(file);
					});
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