# browser-shortcuts


## Installation

#### NPM
```sh
npm i @alexsasharegan/browser-shortcuts
```

#### Yarn

```sh
yarn add @alexsasharegan/browser-shortcuts
```

## Example

```js
const Shortcuts = require('@alexsasharegan/browser-shortcuts');

// instantiation registers the internal keydown/keyup listeners
const shortcuts = new Shortcuts(node = window);

shortcuts.createShortcut('save','command+s') // creates a "save" event that listens for command + s
         .createShortcut('test',['shift+t', 'control+t']) // creates a "test" event with multiple sequences
         .on('test',() => console.log('Event fired: test'))
         .on('save',() => console.log('Event fired: save'));

// removes internal event listeners, but maintains shortcut listeners
shortcuts.pauseListening();
// re-adds internal event listeners
shortcuts.resumeListening();

// remove internal event listeners & shortcut listeners
shortcuts.destroy();
```


#### Key Names (case insensitive)
```json
{
  "BACKSPACE": 8,
  "TAB": 9,
  "CLEAR": 12,
  "RETURN": 13,
  "ENTER": 13,
  "SHIFT": 16,
  "CONTROL": 17,
  "ALT": 18,
  "OPTION": 18,
  "PAUSE_BREAK": 19,
  "CAPS_LOCK": 20,
  "ESCAPE": 27,
  "SPACE_BAR": 32,
  "PAGE_UP": 33,
  "PAGE_DOWN": 34,
  "END": 35,
  "HOME": 36,
  "LEFT_ARROW": 37,
  "UP_ARROW": 38,
  "RIGHT_ARROW": 39,
  "DOWN_ARROW": 40,
  "INSERT": 45,
  "DELETE": 46,
  "COMMAND": [
    91,
    93,
    224
  ],
  "COMMAND_LEFT": [
    91,
    224
  ],
  "WINDOWS": [
    91,
    224
  ],
  "COMMAND_RIGHT": [
    93,
    224
  ],
  "WINDOWS_MENU": [
    93,
    224
  ],
  "NUMPAD_ASTERISK": 106,
  "NUMPAD_PLUS": 107,
  "NUMPAD_DASH": 109,
  "NUMPAD_MINUS": 109,
  "NUMPAD_HYPHEN": 109,
  "NUMPAD_PERIOD": 110,
  "NUMPAD_FORWARD_SLASH": 111,
  "NUM_LOCK": 144,
  "SCROLL_LOCK": 145,
  "MY_COMPUTER": 182,
  "MY_CALCULATOR": 183,
  "SEMICOLON": 186,
  "EQUALS": 187,
  "COMMA": 188,
  "DASH": 189,
  "MINUS": 189,
  "HYPHEN": 189,
  "PERIOD": 190,
  "FORWARD_SLASH": 191,
  "BACKTICK": 192,
  "LEFT_BRACKET": 219,
  "BACKSLASH": 220,
  "RIGHT_BRACKET": 221,
  "APOSTROPHE": 222,
  "A": 65,
  "B": 66,
  "C": 67,
  "D": 68,
  "E": 69,
  "F": 70,
  "G": 71,
  "H": 72,
  "I": 73,
  "J": 74,
  "K": 75,
  "L": 76,
  "M": 77,
  "N": 78,
  "O": 79,
  "P": 80,
  "Q": 81,
  "R": 82,
  "S": 83,
  "T": 84,
  "U": 85,
  "V": 86,
  "W": 87,
  "X": 88,
  "Y": 89,
  "Z": 90,
  "F1": 112,
  "F2": 113,
  "F3": 114,
  "F4": 115,
  "F5": 116,
  "F6": 117,
  "F7": 118,
  "F8": 119,
  "F9": 120,
  "F10": 121,
  "F11": 122,
  "F12": 123,
  "F13": 124,
  "F14": 125,
  "F15": 126,
  "F16": 127,
  "F17": 128,
  "F18": 129,
  "F19": 130,
  "ZERO": 48,
  "ONE": 49,
  "TWO": 50,
  "THREE": 51,
  "FOUR": 52,
  "FIVE": 53,
  "SIX": 54,
  "SEVEN": 55,
  "EIGHT": 56,
  "NINE": 57,
  "NUMPAD_ZERO": 96,
  "NUMPAD_ONE": 97,
  "NUMPAD_TWO": 98,
  "NUMPAD_THREE": 99,
  "NUMPAD_FOUR": 100,
  "NUMPAD_FIVE": 101,
  "NUMPAD_SIX": 102,
  "NUMPAD_SEVEN": 103,
  "NUMPAD_EIGHT": 104,
  "NUMPAD_NINE": 105
}
```