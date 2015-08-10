
/* global Promise */
"use strict";

const Constants = require('../Constants');

class FileUtilities {
	constructor(mimeService) {
		this._fileSystem = chrome.app.window.get('omniscience').contentWindow.chrome.fileSystem;
		this._mimeService = mimeService;
		this._openedFiles = {};
	}
	readBytes(filePath) {
		return new Promise((resolve, reject) => {
			this._fileSystem.restoreEntry(this._openedFiles[filePath], (entry) => {
				entry.file(file => {
					var reader = new FileReader();

					reader.onerror = (err) => reject(err);
					reader.onloadend = (event) => resolve(event.target.result);
					reader.readAsArrayBuffer(file);
				});
				resolve(entry, this._mimeService(entry.name));
			});
		});
	}
	openFileBrowser() {
		return new Promise((resolve, reject) => {
			this._fileSystem.chooseEntry({
				type: Constants.chromeSdk.filePicker.open,
				/*accepts: [Constants.chromeSdk.filePicker.filterAll],*/
				acceptsMultiple: true
			},
				(fileEntries) => {
					let files = [];
					fileEntries.forEach((file, index) => {
						this._fileSystem.getDisplayPath(file, (filePath) => {
							let fileInfo = {
								path: filePath,
								name: file.name,
								type: this._mimeService.getMimeType(file)
							};
							files.push(fileInfo);

							let fileId = this._fileSystem.retainEntry(file);
							this._openedFiles[filePath] = fileId;

							if (index === fileEntries.length - 1)
								resolve(files);//final time through loop resolve the promise
						});
					});
				});
		});
	}
}

module.exports = FileUtilities;