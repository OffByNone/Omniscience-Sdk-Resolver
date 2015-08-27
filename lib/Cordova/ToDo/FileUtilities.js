
/* global Promise */
"use strict";

const Constants = require('../Constants');

class FileUtilities {
	constructor(mimeService, fileSystem) {
		this._fileSystem = fileSystem;
		this._mimeService = mimeService;

		//todo: this is all tech debt baby
		window.omniscience = window.omniscience || {};
		window.omniscience.FileUtilities = window.omniscience.FileUtilities || {};
		window.omniscience.FileUtilities._openedFiles = window.omniscience.FileUtilities._openedFiles || {};

		this._openedFiles = window.omniscience.FileUtilities._openedFiles;
	}
	readBytes(filePath) {
		return new Promise((resolve, reject) => {
			this._fileSystem.restoreEntry(this._openedFiles[filePath], (entry) => {
				entry.file(file => {
					var reader = new FileReader();

					reader.onerror = (err) => reject(err);
					reader.onloadend = (event) => resolve({ fileBytes: new Uint8Array(event.target.result), mimetype: this._mimeService.getMimeType(entry) });
					reader.readAsArrayBuffer(file);
				});
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