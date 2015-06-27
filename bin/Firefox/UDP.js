"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UDP = (function () {
    function UDP(udpSocketProvider, scriptSecurityManager) {
        _classCallCheck(this, UDP);

        this._udpSocketProvider = udpSocketProvider;
        this._scriptSecurityManager = scriptSecurityManager;
    }

    _createClass(UDP, [{
        key: "createUDPSocket",
        value: function createUDPSocket(sourcePort) {
            var socket = this._udpSocketProvider();
            socket.init(sourcePort || -1, false, this._scriptSecurityManager);
            return socket;
        }
    }]);

    return UDP;
})();

module.exports = UDP;