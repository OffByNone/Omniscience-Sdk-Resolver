require("babel/register");

const Constants = require("../../lib/Constants");
const IPResolver = require("../../lib/Firefox/IPResolver");

describe("IPResolver", function () {
	var _sut;
	var _mockDnsService;
	var _mockUDP;
	beforeEach(function () {
		_mockDnsService = {};
		_mockUDP = {};
		_sut = new IPResolver(_mockDnsService, _mockUDP);
	});

	describe("resolveIPs", function () {
		it("should return a promise which resolves with the result of the dnsService when the dnsService returns more than just localhost", function () {
			//arrange
			var myHostName = "myHostName";
			var mockRecord = jasmine.createSpyObj("mockRecord", ["hasMore", "getNextAddrAsString"]);
			var calls = 0;
			mockRecord.hasMore.and.callFake(function () {
				calls++;
				return calls < 3;
			});

			mockRecord.getNextAddrAsString.and.returnValue("127.0.0.1");

			_mockDnsService.myHostName = myHostName;
			_mockDnsService.resolve = jasmine.createSpy("resolve").and.returnValue(mockRecord);

			//act
			_sut.resolveIPs().then(function (actual) {
				//assert
				expect(_mockDnsService.resolve).toHaveBeenCalledWith(myHostName, 0);
				expect(mockRecord.getNextAddrAsString.calls.count()).toBe(2);
				expect(mockRecord.hasMore.calls.count()).toBe(3);
				expect(actual.length).toBe(2);
				expect(actual[0]).toBe("127.0.0.1");
				expect(actual[1]).toBe("127.0.0.1");
			});
		});
		it("should filter out any address that is not IPv4, and add localhost when it is not in the list", function () {
			//arrange
			var myHostName = "myHostName";
			var mockRecord = jasmine.createSpyObj("mockRecord", ["hasMore", "getNextAddrAsString"]);
			var calls = 0;
			mockRecord.hasMore.and.callFake(function () {
				calls++;
				return calls < 3;
			});

			mockRecord.getNextAddrAsString.and.callFake(function () {
				return calls < 2 ? "not an IPv4 address" : "192.168.185.45";
			});

			_mockDnsService.myHostName = myHostName;
			_mockDnsService.resolve = jasmine.createSpy("resolve").and.returnValue(mockRecord);

			//act
			_sut.resolveIPs().then(function (actual) {
				//assert
				expect(_mockDnsService.resolve).toHaveBeenCalledWith(myHostName, 0);
				expect(mockRecord.getNextAddrAsString.calls.count()).toBe(2);
				expect(mockRecord.hasMore.calls.count()).toBe(3);
				expect(actual.length).toBe(2);
				expect(actual[0]).toBe("192.168.185.45");
				expect(actual[1]).toBe("127.0.0.1");
			});
		});
		it("should use the forceGetIP when dnsService only finds localhost", function () {
			//arrange
			var myHostName = "myHostName";
			var mockRecord = jasmine.createSpyObj("mockRecord", ["hasMore"]);
			var messageAddress = "messageAddress";
			var message = { fromAddr: { address: messageAddress } };
			mockRecord.hasMore.and.returnValue(false);

			var mockUDPSocket = jasmine.createSpyObj("mockUDPSocket", ["joinMulticast", "asyncListen", "send", "port"]);

			mockUDPSocket.asyncListen.and.callFake(function (packetReceivedObj) {
				var mockSocket = jasmine.createSpyObj("mockSocket", ["close"]);
				packetReceivedObj.onPacketReceived(mockSocket, message);

				expect(mockSocket.close).toHaveBeenCalledWith();

			});

			_mockUDP.createUDPSocket = jasmine.createSpy("mockCreateUDPSocket").and.returnValue(mockUDPSocket);
			_mockDnsService.myHostName = myHostName;
			_mockDnsService.resolve = jasmine.createSpy("resolve").and.returnValue(mockRecord);

			//act
			_sut.resolveIPs().then(function (actual) {
				//assert
				expect(_mockUDP.createUDPSocket).toHaveBeenCalledWith();
				expect(mockUDPSocket.joinMulticast).toHaveBeenCalledWith(Constants.IPResolverMulticast);
				expect(mockUDPSocket.asyncListen).toHaveBeenCalledWith({ onPacketReceived: jasmine.any(Function) });

				expect(actual.length).toBe(2)
				expect(actual[0]).toBe(messageAddress);
				expect(actual[1]).toBe('127.0.0.1');
				expect(mockUDPSocket.send).toHaveBeenCalledWith(Constants.IPResolverMulticast, mockUDPSocket.port, Constants.forceGetIPMessage, Constants.forceGetIPMessage.length);
			});
		});

	});
});