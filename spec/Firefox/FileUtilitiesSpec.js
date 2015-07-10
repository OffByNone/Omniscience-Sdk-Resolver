require("babel/register");

const Constants = require("../../lib/Constants");
const FileUtilities = require("../../lib/Firefox/FileUtilities");

describe("FileUtilities", function () {
	var _sut;
	var _mockFileSystem;
	var _mockWindowUtilities;
	beforeEach(function () {
		_mockFileSystem = {};
		_mockWindowUtilities = {};
		_sut = new FileUtilities(_mockFileSystem, _mockWindowUtilities);
	});

	describe("create", function () {
		it("should call initWithPath then return the file when fileInfo is the path to the file", function () {
			//arrange
			var mockFile = jasmine.createSpyObj("mockFile", ["initWithPath"]);
			var fileInfo = "this is a type of string";

			_mockFileSystem.createLocalFile = jasmine.createSpy("mockCreateLocalFile").and.returnValue(mockFile);

			//act
			var actual = _sut.create(fileInfo);

			//assert
			expect(_mockFileSystem.createLocalFile).toHaveBeenCalledWith();
			expect(mockFile.initWithPath).toHaveBeenCalledWith(fileInfo);
			expect(actual).toBe(mockFile);
		});
		it("should call initWithFile then return the file when fileInfo the file object itself", function () {
			//arrange
			var mockFile = jasmine.createSpyObj("mockFile", ["initWithFile"]);
			var fileInfo = {};

			_mockFileSystem.createLocalFile = jasmine.createSpy("mockCreateLocalFile").and.returnValue(mockFile);

			//act
			var actual = _sut.create(fileInfo);

			//assert
			expect(_mockFileSystem.createLocalFile).toHaveBeenCalledWith();
			expect(mockFile.initWithFile).toHaveBeenCalledWith(fileInfo);
			expect(actual).toBe(mockFile);
		});
	});
	describe("readBytes", function () {
		it("should return filesystem.read", function () {
			//arrange
			var file = "file";
			var filePath = "path to file";
			_mockFileSystem.read = jasmine.createSpy("mockRead").and.returnValue(file);

			//act
			var actual = _sut.readBytes(filePath);

			//assert
			expect(actual).toBe(file);
			expect(_mockFileSystem.read).toHaveBeenCalledWith(filePath);
		});
	});
	describe("openFileBrowser", function () {
		it("should return a promise which resolves with the files chosen in the file browser", function () {
			//arrange
			var hasMoreElementsCalls = 0;
			var getNextCalls = 0;
			var createLocalFileCalls = 0;
			var mostRecentWindow = "a window";
			var file1 = { path: "path1", leafName: "leafName1", initWithFile: jasmine.createSpy("initWithFile") };
			var file2 = { path: "path2", leafName: "leafName2", initWithFile: jasmine.createSpy("initWithFile") };
			var file1Type = "file1Type";
			var file2Type = "file2Type";
			var mockFiles = jasmine.createSpyObj("mockFiles", ["hasMoreElements", "getNext"]);
			var mockFilePicker = jasmine.createSpyObj("mockFilePicker", ["init", "appendFilters", "open"]);
			mockFilePicker.files = mockFiles;

			_mockFileSystem.createLocalFile = jasmine.createSpy("createLocalFile").and.callFake(function () {
				createLocalFileCalls++;
				return createLocalFileCalls == 1 ? file1 : file2;
			});
			_mockFileSystem.getTypeFromFile = jasmine.createSpy("getTypeFromFile").and.callFake(function (file) {
				return file == file1 ? file1Type : file2Type;
			});
			_mockFileSystem.filePicker = jasmine.createSpy("filePicker").and.returnValue(mockFilePicker);
			_mockWindowUtilities.getMostRecentBrowserWindow = jasmine.createSpy("getMostRecentBrowserWindow").and.returnValue(mostRecentWindow);
			mockFiles.hasMoreElements.and.callFake(function () {
				hasMoreElementsCalls++;
				return hasMoreElementsCalls < 3;
			});
			mockFiles.getNext.and.callFake(function () {
				getNextCalls++;
				return getNextCalls == 1 ? file1 : file2;
			});

			//act
			_sut.openFileBrowser().then(function (actual) {
				expect(Array.isArray(actual)).toBeTruthy();
				expect(actual.length).toBe(2);

				expect(typeof actual[0]).toBe("object");
				expect(actual[0].path).toBe(file1.path);
				expect(actual[0].name).toBe(file1.leafName);
				expect(actual[0].type).toBe(file1Type);

				expect(typeof actual[1]).toBe("object");
				expect(actual[1].path).toBe(file2.path);
				expect(actual[1].name).toBe(file2.leafName);
				expect(actual[1].type).toBe(file2Type);
			});

			//assert
			expect(_mockWindowUtilities.getMostRecentBrowserWindow).toHaveBeenCalledWith();
			expect(_mockFileSystem.filePicker).toHaveBeenCalledWith();
			expect(mockFilePicker.init).toHaveBeenCalledWith(mostRecentWindow, Constants.addonSdk.filePicker.windowTitle, Constants.addonSdk.filePicker.modeOpenMultiple);
			expect(mockFilePicker.appendFilters).toHaveBeenCalledWith(Constants.addonSdk.filePicker.filterAll);
			expect(mockFilePicker.open).toHaveBeenCalledWith(jasmine.any(Function));

			//execute funciton from open
			mockFilePicker.open.calls.argsFor(0)[0](Constants.addonSdk.filePicker.returnOK);
		});
	});
	it("should reject the promise when open doesn't return ok", function () {
		//arrange
		var mostRecentWindow = "a window";
		var mockFilePicker = jasmine.createSpyObj("mockFilePicker", ["init", "appendFilters", "open"]);

		_mockFileSystem.filePicker = jasmine.createSpy("filePicker").and.returnValue(mockFilePicker);
		_mockWindowUtilities.getMostRecentBrowserWindow = jasmine.createSpy("getMostRecentBrowserWindow").and.returnValue(mostRecentWindow);

		//act/assert
		_sut.openFileBrowser().then(
			function () { fail("resolve should not have been called."); },
			function (reason) { expect(reason).toBe(Constants.addonSdk.filePicker.noFilesChosen); });
		mockFilePicker.open.calls.argsFor(0)[0](Constants.addonSdk.filePicker.noFilesChosen);
	});
	describe("getMimeType", function () {
		it("should return file type from file system", function () {
			//arrange
			var fileType = "fileType";
			var myFile = "myFile";
			_mockFileSystem.getTypeFromFile = jasmine.createSpy("getTypeFromFile").and.returnValue(fileType);

			//act
			var actual = _sut.getMimeType(myFile);

			//assert
			expect(_mockFileSystem.getTypeFromFile).toHaveBeenCalledWith(myFile);
			expect(actual).toBe(fileType);
		});
		it("should return default mime type when file system throws error", function () {
			//arrange
			var myFile = "myFile";
			_mockFileSystem.getTypeFromFile = jasmine.createSpy("getTypeFromFile").and.callFake(function () {
				throw new Error("File System Error!!!");
			});

			//act
			var actual = _sut.getMimeType(myFile);

			//assert
			expect(_mockFileSystem.getTypeFromFile).toHaveBeenCalledWith(myFile);
			expect(actual).toBe(Constants.defaultMimeType);
		});
	});
});