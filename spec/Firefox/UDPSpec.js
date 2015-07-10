require("babel/register");

const Constants = require("../../lib/Constants");
const UDP = require("../../lib/Firefox/UDP");

describe("UDP", function () {
	var _sut;
	var _mockScriptSecurityManager;
	var _mockUDPSocketProvider;
	beforeEach(function () {
		_mockScriptSecurityManager = jasmine.createSpy("_mockScriptSecurityManager");
		_mockUDPSocketProvider = jasmine.createSpy("_mockUDPSocketProvider");
		_sut = new UDP(_mockUDPSocketProvider, _mockScriptSecurityManager);
	});

	describe("createUDPSocket", function () {
		it("should return a new UDP socket with random source port when sourcePort is not provided", function () {
			//arrange
			var mockSocket = jasmine.createSpyObj("mockSocket", ["init"]);
			_mockUDPSocketProvider.and.returnValue(mockSocket);

			//act
			var actual = _sut.createUDPSocket();

			//assert
			expect(_mockUDPSocketProvider).toHaveBeenCalledWith();
			expect(mockSocket.init).toHaveBeenCalledWith(-1, false, _mockScriptSecurityManager);
			expect(actual).toBe(mockSocket);
		});
		it("should return a new UDP socket with specified source port when sourcePort is provided", function () {
			//arrange
			var mockSocket = jasmine.createSpyObj("mockSocket", ["init"]);
			_mockUDPSocketProvider.and.returnValue(mockSocket);
			var sourcePort = "19765";

			//act
			var actual = _sut.createUDPSocket(sourcePort);

			//assert
			expect(_mockUDPSocketProvider).toHaveBeenCalledWith();
			expect(mockSocket.init).toHaveBeenCalledWith(sourcePort, false, _mockScriptSecurityManager);
			expect(actual).toBe(mockSocket);
		});
	});
});