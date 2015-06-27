/* global Promise */
"use strict";

const Constants = require('../Constants');

class FileUtilities {
	constructor(fileSystem, windowUtilities) {
		this._fileSystem = fileSystem;
		this._windowUtilities = windowUtilities;
	}
	create (fileInfo) {
        let file = this._fileSystem.createLocalFile();
        if (typeof fileInfo === "string")
            file.initWithPath(fileInfo);
        if (typeof fileInfo === "object")
            file.initWithFile(fileInfo);
        return file;
    }
	readBytes (filePath) {
		return this._fileSystem.read(filePath);
	}
	openFileBrowser () {
        return new Promise((resolve, reject) => {
            let filePicker = this._fileSystem.filePicker();
            filePicker.init(this._windowUtilities.getMostRecentBrowserWindow(), Constants.addonSdk.filePicker.windowTitle, Constants.addonSdk.filePicker.modeOpenMultiple);
            filePicker.appendFilters(Constants.addonSdk.filePicker.filterAll);

            filePicker.open((result) => {
				if (result === Constants.addonSdk.filePicker.returnOK) {
                    let filePickerFiles = filePicker.files;
                    let files = [];
                    while (filePickerFiles.hasMoreElements()) {
                        let file = this.create(filePickerFiles.getNext());
                        let fileInfo = {
                            path: file.path,
                            name: file.leafName,
                            type: this.getMimeType(file)
                        };

                        files.push(fileInfo);
                    }
                    resolve(files);
                }
				else
					reject(Constants.addonSdk.filePicker.noFilesChosen);
            });
        });
    }
	getMimeType (file) {
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
        }
        catch (e) {
            return Constants.defaultMimeType;
        }
    }
}

module.exports = FileUtilities;