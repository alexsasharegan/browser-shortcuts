'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (exports, global) {
	'use strict';

	var keycode = require('@alexsasharegan/keycodes');
	var Emitter = require('component-emitter');

	var keydown = '__keydown';
	var keyup = '__keyup';

	var Shortcuts = function (_Emitter) {
		_inherits(Shortcuts, _Emitter);

		function Shortcuts() {
			var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

			_classCallCheck(this, Shortcuts);

			var _this = _possibleConstructorReturn(this, (Shortcuts.__proto__ || Object.getPrototypeOf(Shortcuts)).call(this));

			_this.handleKeyDown = _this.handleKeyDown.bind(_this);
			_this.handleKeyUp = _this.handleKeyUp.bind(_this);

			_this._keyMap = {};
			_this._shortcuts = {};

			_this.on(keydown, _this.handleShortcuts);

			Shortcuts.addEvents(node, {
				keydown: _this.handleKeyDown,
				keyup: _this.handleKeyUp
			});
			return _this;
		}

		_createClass(Shortcuts, [{
			key: 'handleKeyDown',
			value: function handleKeyDown(event) {
				event.preventDefault();
				var code = keycode(event, true);

				this._keyMap[code] = keycode(code);
				this.emit(keydown, event);
			}
		}, {
			key: 'handleKeyUp',
			value: function handleKeyUp(event) {
				event.preventDefault();
				var code = keycode(event, true);

				delete this._keyMap[code];
				this.emit(keyup, event);
			}
		}, {
			key: 'handleShortcuts',
			value: function handleShortcuts(event) {
				var _this2 = this;

				Object.keys(this._shortcuts).forEach(function (shortcut) {
					var sequence = _this2._shortcuts[shortcut];
					var shouldFire = true;

					for (var i = 0; i < sequence.length; i++) {
						if (!_this2.testKeyDown(sequence[i])) {
							shouldFire = false;
							break;
						}
					}

					// TODO: dev logging
					console.log({ shouldFire: shouldFire, keymap: _this2._keyMap });

					if (shouldFire) _this2.emit(shortcut, event);
				});
			}
		}, {
			key: 'createShortcut',
			value: function createShortcut(name, keys) {
				// normalize input & transform to keycodes
				this._shortcuts[name] = (Array.isArray(keys) ? keys : keys.split('+')).map(function (key) {
					return keycode(key, true);
				});

				return this;
			}
		}, {
			key: 'testKeyDown',
			value: function testKeyDown(code) {
				if (Array.isArray(code)) {
					for (var i = 0; i < code.length; i++) {
						var valid = !!this._keyMap[code[i]];
						if (valid) return valid;
					}

					return false;
				} else {
					return !!this._keyMap[code];
				}
			}
		}], [{
			key: 'addEvent',
			value: function addEvent(node, event, callback) {
				if (node.addEventListener) {
					node.addEventListener(String(event).toLowerCase(), callback, false);
				} else {
					node.attachEvent('on' + String(event).toLowerCase(), callback);
				}
			}
		}, {
			key: 'addEvents',
			value: function addEvents(node) {
				var eventMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

				var _loop = function _loop(event) {
					var handlers = eventMap[event];

					if (typeof handlers === 'function') {
						Shortcuts.addEvent(node, event, handlers);
					} else {
						handlers.forEach(function (handler) {
							return Shortcuts.addEvent(node, event, handler);
						});
					}
				};

				for (var event in eventMap) {
					_loop(event);
				}
			}
		}, {
			key: 'addEventOnce',
			value: function addEventOnce(node, event, callback) {
				function fnOnce() {
					Shortcuts.removeEvent(node, event, fnOnce);

					return callback.apply(this, arguments);
				}

				Shortcuts.addEvent(node, event, fnOnce);
			}
		}, {
			key: 'removeEvent',
			value: function removeEvent(node, event, callback) {
				node.removeEventListener(event, callback, false);
			}
		}]);

		return Shortcuts;
	}(Emitter);

	// TODO: for testing, expose globally


	window.Shortcuts = Shortcuts;

	if (exports) module.exports = Shortcuts;else if (global) global.Shortcuts = Shortcuts;

	return Shortcuts;
})((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === "object" && _typeof(module.exports) === "object", typeof window !== "undefined" ? window : null);