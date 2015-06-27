/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var FileUtilities = (function () {
    function FileUtilities(fileSystem, windowUtilities) {
        _classCallCheck(this, FileUtilities);

        this._fileSystem = fileSystem;
        this._windowUtilities = windowUtilities;
    }

    _createClass(FileUtilities, [{
        key: "create",
        value: function create(fileInfo) {
            var file = this._fileSystem.createLocalFile();
            if (typeof fileInfo === "string") file.initWithPath(fileInfo);
            if (typeof fileInfo === "object") file.initWithFile(fileInfo);
            return file;
        }
    }, {
        key: "readBytes",
        value: function readBytes(filePath) {
            return this._fileSystem.read(filePath);
        }
    }, {
        key: "openFileBrowser",
        value: function openFileBrowser() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var filePicker = _this._fileSystem.filePicker();
                filePicker.init(_this._windowUtilities.getMostRecentBrowserWindow(), Constants.addonSdk.filePicker.windowTitle, Constants.addonSdk.filePicker.modeOpenMultiple);
                filePicker.appendFilters(Constants.addonSdk.filePicker.filterAll);

                filePicker.open(function (result) {
                    if (result === Constants.addonSdk.filePicker.returnOK) {
                        var filePickerFiles = filePicker.files;
                        var files = [];
                        while (filePickerFiles.hasMoreElements()) {
                            var file = _this.create(filePickerFiles.getNext());
                            var fileInfo = {
                                path: file.path,
                                name: file.leafName,
                                type: _this.getMimeType(file)
                            };

                            files.push(fileInfo);
                        }
                        resolve(files);
                    } else reject(Constants.addonSdk.filePicker.noFilesChosen);
                });
            });
        }
    }, {
        key: "getMimeType",
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
                return this._fileSystem.getTypeFromFile(file);
            } catch (e) {
                return Constants.defaultMimeType;
            }
        }
    }]);

    return FileUtilities;
})();

module.exports = FileUtilities;