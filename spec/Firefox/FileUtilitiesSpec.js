require("babel/register");

const Constants = require("../../lib/Constants");
const FileUtilities = require("../../lib/Firefox/FileUtilities");

describe("FileUtilities", function () {
	var _sut;
	var _mockFileSystem;
	var _mockWindowUtilities;
	var _mockMimeService;
	beforeEach(function () {
		_mockFileSystem = {};
		_mockWindowUtilities = {};
		_mockMimeService = {};
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
});