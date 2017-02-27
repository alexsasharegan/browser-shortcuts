(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"@alexsasharegan/keycodes":2,"component-emitter":3}],2:[function(require,module,exports){
(function ( exports, global ) {
	'use strict';
	
	const numToStrMap = {
		0: 'ZERO',
		1: 'ONE',
		2: 'TWO',
		3: 'THREE',
		4: 'FOUR',
		5: 'FIVE',
		6: 'SIX',
		7: 'SEVEN',
		8: 'EIGHT',
		9: 'NINE',
	};
	
	const NAMES = {
		BACKSPACE: 8,
		TAB: 9,
		CLEAR: 12,
		RETURN: 13,
		ENTER: 13,
		SHIFT: 16,
		CONTROL: 17,
		ALT: 18,
		OPTION: 18,
		PAUSE_BREAK: 19,
		CAPS_LOCK: 20,
		ESCAPE: 27,
		SPACE_BAR: 32,
		PAGE_UP: 33,
		PAGE_DOWN: 34,
		END: 35,
		HOME: 36,
		LEFT_ARROW: 37,
		UP_ARROW: 38,
		RIGHT_ARROW: 39,
		DOWN_ARROW: 40,
		INSERT: 45,
		DELETE: 46,
		COMMAND: [ 91, 93, 224 ],
		COMMAND_LEFT: [ 91, 224 ],
		WINDOWS: [ 91, 224 ],
		COMMAND_RIGHT: [ 93, 224 ],
		WINDOWS_MENU: [ 93, 224 ],
		NUMPAD_ASTERISK: 106,
		NUMPAD_PLUS: 107,
		NUMPAD_DASH: 109,
		NUMPAD_MINUS: 109,
		NUMPAD_HYPHEN: 109,
		NUMPAD_PERIOD: 110,
		NUMPAD_FORWARD_SLASH: 111,
		NUM_LOCK: 144,
		SCROLL_LOCK: 145,
		MY_COMPUTER: 182,
		MY_CALCULATOR: 183,
		SEMICOLON: 186,
		EQUALS: 187,
		COMMA: 188,
		DASH: 189,
		MINUS: 189,
		HYPHEN: 189,
		PERIOD: 190,
		FORWARD_SLASH: 191,
		BACKTICK: 192,
		LEFT_BRACKET: 219,
		BACKSLASH: 220,
		RIGHT_BRACKET: 221,
		APOSTROPHE: 222
	};
	
	/***************************** Dynamic Allocation *****************************/
	
	// letters
	for ( let i = 65; i < 91; i++ ) NAMES[ String.fromCharCode( i ) ] = i;
	
	// function keys
	for ( let i = 1; i <= 19; i++ ) NAMES[ `F${i}` ] = i + 111;
	
	// numbers
	for ( let i = 0; i <= 9; i++ ) NAMES[ numToStrMap[ i ] ] = i + 48;
	
	// numeric keypad keys
	for ( let i = 0; i <= 9; i++ ) NAMES[ `NUMPAD_${numToStrMap[ i ]}` ] = i + 96;
	
	// reverse mapping
	const CODES = {};
	for ( let name in NAMES ) {
		let code = NAMES[ name ];
		
		if ( Array.isArray( code ) ) code.forEach( codeVal => CODES[ codeVal ] = name );
		else CODES[ code ] = name;
	}
	
	function getCodeFromName( search ) {
		const RE = /\s+/g;
		let name = String( search ).toUpperCase();
		if ( RE.test( name ) ) name = name.replace( RE, '_' );
		
		return NAMES[ name ];
	}
	
	function keycode( search, returnAsCode = false ) {
		// Normalize from event object
		if ( search && typeof search === 'object' ) {
			let hasKeyCode = search.which || search.keyCode || search.charCode;
			if ( hasKeyCode ) search = hasKeyCode;
		}
		
		// Number codes
		if ( typeof search === 'number' ) return returnAsCode ? search : CODES[ search ];
		
		return getCodeFromName( search );
	};
	
	function is( key, search ) {
		let target = typeof key === 'number' ? key : getCodeFromName( key );
		
		return (
			search
				? keycode( search, true ) === target
				: curriedSearch => target === keycode( curriedSearch, true )
		);
	}
	
	keycode.is    = is;
	keycode.names = NAMES;
	keycode.codes = CODES;
	
	if ( exports ) module.exports = keycode;
	else if ( global ) global.keycode = keycode;
	
	return keycode;
}(
	typeof module === "object" && typeof module.exports === "object"
	, typeof window !== "undefined" ? window : null
));

},{}],3:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}]},{},[1]);
