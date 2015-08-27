const Constants = require('../Constants');

class MimeService {
	constructor() { }
	getMimeType(file) {
		let fileNameParts = file.name.split(".");
		let extension = fileNameParts[fileNameParts.length - 1];
		return Constants.mimetypes[extension] || Constants.defaultMimeType;
	}
}

module.exports = MimeService;