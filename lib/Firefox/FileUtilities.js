/* global Promise */
"use strict";

const Constants = require('../Constants');

class FileUtilities {
	constructor(fileSystem, windowUtilities, mimeService) {
		this._fileSystem = fileSystem;
		this._windowUtilities = windowUtilities;
		this._mimeService = mimeService;
	}
	create(fileInfo) {
        let file = this._fileSystem.createLocalFile();
        if (typeof fileInfo === "string")
            file.initWithPath(fileInfo);
        if (typeof fileInfo === "object")
            file.initWithFile(fileInfo);
        return file;
    }
	readBytes(filePath) {
		let file = this.create(filePath);
		return this._fileSystem.read(file.path)
			.then((fileBytes) => {
				let mimetype = this._mimeService.getMimeType(file);
				return { fileBytes, mimetype };
			});
	}
	openFileBrowser() {
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
                            type: this._mimeService.getMimeType(file)
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
}

module.exports = FileUtilities;