/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var IPResolver = (function () {
    function IPResolver(dnsService, udpProvider) {
        _classCallCheck(this, IPResolver);

        this._dnsService = dnsService;
        this._udpProvider = udpProvider;
    }

    _createClass(IPResolver, [{
        key: "resolveIPs",
        value: function resolveIPs() {
            var _this = this;

            var myName = this._dnsService.myHostName;
            var record = this._dnsService.resolve(myName, 0);
            var addresses = [];
            while (record.hasMore()) addresses.push(record.getNextAddrAsString());

            if (!addresses.some(function (address) {
                return address === "127.0.0.1";
            })) addresses.push("127.0.0.1");

            return new Promise(function (resolve, reject) {
                if (addresses.length > 1) resolve(addresses.filter(function (address) {
                    return Constants.ipv4Regex.test(address);
                }));else _this._forceGetIPs(resolve);
            });
        }
    }, {
        key: "_forceGetIPs",
        value: function _forceGetIPs(resolve) {
            var udpSocket = this._udpProvider.create();

            udpSocket.init(-1, "0.0.0.0", Constants.IPResolverMulticast);
            udpSocket.onPacketReceivedEvent(function (message) {
                // See: https://bugzilla.mozilla.org/show_bug.cgi?id=952927
                udpSocket.close();
                resolve([message.fromAddr.address, "127.0.0.1"]);
            });

            udpSocket.send(Constants.IPResolverMulticast, udpSocket.localPort, Constants.forceGetIPMessage);
        }
    }]);

    return IPResolver;
})();

module.exports = IPResolver;