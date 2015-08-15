/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SimpleTCPSocket = (function () {
	function SimpleTCPSocket(timers, chromeTCP, lastError) {
		_classCallCheck(this, SimpleTCPSocket);

		this.responseTimeout = 60000;
		this._timers = timers;
		this._chromeTCP = chromeTCP;
		this._lastError = lastError;
	}

	_createClass(SimpleTCPSocket, [{
		key: 'send',
		value: function send(ip, port, data, waitForResponse) {
			var _this = this;

			return new Promise(function (resolve, reject) {
				/*todo: maybe add a timeout?*/
				_this._chromeTCP.create({ name: 'send@' + ip + ':' + port }, function (_ref) {
					var socketId = _ref.socketId;

					var mySocketId = socketId;
					_this._chromeTCP.connect(socketId, ip, parseInt(port, 10), function (resultCode) {
						if (resultCode < 0) reject(_this._lastError.message);

						/* todo: there is likely a better way to do the onReceive and onReceiveError
       * since they are fired for all TCP from this app, if they could be put
       * in a place to only be bound once it would be likely better
       */
						_this._chromeTCP.onReceiveError.addListener(function (_ref2) {
							var socketId = _ref2.socketId;
							var data = _ref2.data;

							if (socketId !== mySocketId) return;

							resolve(data);
							_this._chromeTCP.close(socketId);
						});
						_this._chromeTCP.onReceive.addListener(function (_ref3) {
							var socketId = _ref3.socketId;
							var resultCode = _ref3.resultCode;

							if (socketId !== mySocketId) return;

							reject(_this._lastError.message);
							_this._chromeTCP.close(socketId);
						});

						_this._chromeTCP.send(mySocketId, data, function (_ref4) {
							var resultCode = _ref4.resultCode;
							var bytesSent = _ref4.bytesSent;

							if (resultCode < 0) reject(_this._lastError.message);
							if (!waitForResponse) _this._chromeTCP.close(mySocketId);else {
								_this._timers.setTimeout(function () {
									_this._chromeTCP.close(mySocketId);
									reject('Device did not respond within ' + _this.responseTimeout / 1000 + ' seconds.');
								}, _this.responseTimeout);
							}
						});
					});
				});
			});
		}
	}, {
		key: 'ping',
		value: function ping(ip, port) {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				/*todo: maybe add a timeout?*/
				_this2._chromeTCP.create({ name: 'ping@' + ip + ':' + port }, function (_ref5) {
					var socketId = _ref5.socketId;

					_this2._chromeTCP.connect(socketId, ip, parseInt(port, 10), function (resultCode) {
						resolve(resultCode >= 0);
						_this2._chromeTCP.close(socketId);
					});
				});
			});
		}
	}]);

	return SimpleTCPSocket;
})();

module.exports = SimpleTCPSocket;