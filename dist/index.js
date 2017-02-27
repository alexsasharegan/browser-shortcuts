'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (exports, global) {
	'use strict';

	var keycode = require('@alexsasharegan/keycodes');
	var Emitter = require('component-emitter');

	var Shortcuts = function (_Emitter) {
		_inherits(Shortcuts, _Emitter);

		function Shortcuts() {
			var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

			_classCallCheck(this, Shortcuts);

			var _this = _possibleConstructorReturn(this, (Shortcuts.__proto__ || Object.getPrototypeOf(Shortcuts)).call(this));

			_this.handleKeyDown = _this.handleKeyDown.bind(_this);
			_this.handleKeyUp = _this.handleKeyUp.bind(_this);

			_this._isListening = false;
			_this._modKeys = [91, 93, 224];
			_this._keyMap = {};
			_this._shortcuts = {};
			_this._internalMap = {
				keydown: '__keydown',
				keyup: '__keyup'
			};
			_this._eventMap = {
				node: node,
				events: {
					keydown: _this.handleKeyDown,
					keyup: _this.handleKeyUp
				}
			};

			_this.on(_this._internalMap.keydown, _this.handleShortcuts);
			Shortcuts.addEvents(node, _this._eventMap.events);
			_this._isListening = true;
			return _this;
		}

		_createClass(Shortcuts, [{
			key: 'handleKeyDown',
			value: function handleKeyDown(event) {
				event.preventDefault();
				var code = keycode(event, true);

				this._keyMap[code] = keycode(code);
				this.emit(this._internalMap.keydown, event);

				if (event.metaKey && !~this._modKeys.indexOf(code)) {
					this.handleKeyUp(event);
				}
			}
		}, {
			key: 'handleKeyUp',
			value: function handleKeyUp(event) {
				event.preventDefault();
				var code = keycode(event, true);

				delete this._keyMap[code];
				this.emit(this._internalMap.keyup, event);
			}
		}, {
			key: 'handleShortcuts',
			value: function handleShortcuts(event) {
				var _this2 = this;

				Object.keys(this._shortcuts).forEach(function (shortcut) {
					// at a named shortcut, we have an array of possible key sequences
					// inside each sequence is an array of keycodes
					// each keycode can itself be an array because the same key can appear at multiple codes
					var sequences = _this2._shortcuts[shortcut];
					var shouldEmit = false;

					// loop through each shortcut sequence
					for (var i = 0; i < sequences.length; i++) {
						var sequence = sequences[i];
						var thisSequenceTriggers = true;

						// loop through the keycodes in the sequence
						// and test that each key is pressed
						for (var j = 0; j < sequence.length; j++) {
							// fail fast if a key is not detected
							if (!_this2.testKeyCode(sequence[j])) {
								thisSequenceTriggers = false;
								break;
							}
						}

						// quit looping as soon as a sequence is satisfied
						if (thisSequenceTriggers) {
							shouldEmit = true;
							break;
						}
					}

					// TODO: dev logging
					console.log({ shouldEmit: shouldEmit, keymap: _this2._keyMap, listeners: _this2.listeners(shortcut) });

					if (shouldEmit) _this2.emit(shortcut, event);
				});
			}
		}, {
			key: 'createShortcut',
			value: function createShortcut(name, keys) {
				var _this3 = this;

				if (Array.isArray(keys)) {
					keys.forEach(function (key) {
						return _this3.createShortcut(name, key);
					});
					return this;
				}
				// normalize input & transform to keycodes
				var shortcuts = this._shortcuts[name] || [];
				this._shortcuts[name] = [].concat(_toConsumableArray(shortcuts), [keys.split('+').map(function (key) {
					return keycode(key.trim(), true);
				})]);

				return this;
			}
		}, {
			key: 'testKeyCode',
			value: function testKeyCode(code) {
				if (Array.isArray(code)) {
					// a code can be an array when there are multiple codes possible to trigger the same key
					// should return true upon the first match in the active key map
					for (var i = 0; i < code.length; i++) {
						if (!!this._keyMap[code[i]]) return true;
					} // all tested values not found on the map, return false
					return false;
				} else {
					return !!this._keyMap[code];
				}
			}
		}, {
			key: 'pauseListening',
			value: function pauseListening() {
				if (this._isListening) {
					Shortcuts.removeEvents(this._eventMap.node, this._eventMap.events);
					this._isListening = false;
				}

				return this;
			}
		}, {
			key: 'resumeListening',
			value: function resumeListening() {
				if (!this._isListening) {
					Shortcuts.addEvents(this._eventMap.node, this._eventMap.events);
					this._isListening = true;
				}

				return this;
			}
		}, {
			key: 'destroy',
			value: function destroy() {
				this.off();
				Shortcuts.removeEvents(this._eventMap.node, this._eventMap.events);
				this._isListening = false;

				return this;
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
			key: 'removeEvents',
			value: function removeEvents(node) {
				var eventMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

				var _loop2 = function _loop2(event) {
					var handlers = eventMap[event];

					if (typeof handlers === 'function') {
						Shortcuts.removeEvent(node, event, handlers);
					} else {
						handlers.forEach(function (handler) {
							return Shortcuts.removeEvent(node, event, handler);
						});
					}
				};

				for (var event in eventMap) {
					_loop2(event);
				}
			}
		}, {
			key: 'removeEvent',
			value: function removeEvent(node, event, callback) {
				node.removeEventListener(event, callback, false);
			}
		}]);

		return Shortcuts;
	}(Emitter);

	if (exports) module.exports = Shortcuts;else if (global) global.Shortcuts = Shortcuts;

	return Shortcuts;
})((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === "object" && _typeof(module.exports) === "object", typeof window !== "undefined" ? window : null);