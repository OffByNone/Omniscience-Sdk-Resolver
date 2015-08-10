const Constants = require('../Constants');


class MimeService {
	constructor(nativeMimeService) {
		this._nativeMimeService = nativeMimeService;
	}
	getMimeType(file) {
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
        }
        catch (e) {
            return Constants.defaultMimeType;
        }
    }
}

module.exports = MimeService;