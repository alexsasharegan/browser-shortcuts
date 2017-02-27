(function ( exports, global ) {
	'use strict';
	
	const keycode = require( '@alexsasharegan/keycodes' );
	const Emitter = require( 'component-emitter' );
	
	class Shortcuts extends Emitter {
		
		constructor( node = window ) {
			super();
			
			this.handleKeyDown = this.handleKeyDown.bind( this );
			this.handleKeyUp   = this.handleKeyUp.bind( this );
			
			this._isListening = false;
			this._modKeys     = [ 91, 93, 224 ];
			this._keyMap      = {};
			this._shortcuts   = {};
			this._internalMap = {
				keydown: '__keydown',
				keyup: '__keyup',
			};
			this._eventMap    = {
				node,
				events: {
					keydown: this.handleKeyDown,
					keyup: this.handleKeyUp,
				}
			};
			
			this.on( this._internalMap.keydown, this.handleShortcuts );
			Shortcuts.addEvents( node, this._eventMap.events );
			this._isListening = true;
		}
		
		handleKeyDown( event ) {
			event.preventDefault();
			const code = keycode( event, true );
			
			this._keyMap[ code ] = keycode( code );
			this.emit( this._internalMap.keydown, event );
			
			if ( event.metaKey && !~this._modKeys.indexOf( code ) ) {
				this.handleKeyUp( event );
			}
		}
		
		handleKeyUp( event ) {
			event.preventDefault();
			const code = keycode( event, true );
			
			delete this._keyMap[ code ];
			this.emit( this._internalMap.keyup, event );
		}
		
		handleShortcuts( event ) {
			Object.keys( this._shortcuts )
			      .forEach( shortcut => {
				      // at a named shortcut, we have an array of possible key sequences
				      // inside each sequence is an array of keycodes
				      // each keycode can itself be an array because the same key can appear at multiple codes
				      const sequences = this._shortcuts[ shortcut ];
				      let shouldEmit  = false;
				
				      // loop through each shortcut sequence
				      for ( let i = 0; i < sequences.length; i++ ) {
					      let sequence             = sequences[ i ];
					      let thisSequenceTriggers = true;
					
					      // loop through the keycodes in the sequence
					      // and test that each key is pressed
					      for ( let j = 0; j < sequence.length; j++ ) {
						      // fail fast if a key is not detected
						      if ( !this.testKeyCode( sequence[ j ] ) ) {
							      thisSequenceTriggers = false;
							      break;
						      }
					      }
					
					      // quit looping as soon as a sequence is satisfied
					      if ( thisSequenceTriggers ) {
						      shouldEmit = true;
						      break;
					      }
				      }
				
				      // TODO: dev logging
				      console.log( { shouldEmit, keymap: this._keyMap, listeners: this.listeners( shortcut ), } );
				
				      if ( shouldEmit ) this.emit( shortcut, event );
			      } );
		}
		
		createShortcut( name, keys ) {
			if ( Array.isArray( keys ) ) {
				keys.forEach( key => this.createShortcut( name, key ) );
				return this;
			}
			// normalize input & transform to keycodes
			const shortcuts         = this._shortcuts[ name ] || [];
			this._shortcuts[ name ] = [
				...shortcuts,
				keys.split( '+' ).map( key => keycode( key.trim(), true ) )
			];
			
			return this;
		}
		
		testKeyCode( code ) {
			if ( Array.isArray( code ) ) {
				// a code can be an array when there are multiple codes possible to trigger the same key
				// should return true upon the first match in the active key map
				for ( let i = 0; i < code.length; i++ ) if ( !!this._keyMap[ code[ i ] ] ) return true;
				
				// all tested values not found on the map, return false
				return false;
			} else {
				return !!this._keyMap[ code ];
			}
		}
		
		pauseListening() {
			if ( this._isListening ) {
				Shortcuts.removeEvents( this._eventMap.node, this._eventMap.events );
				this._isListening = false;
			}
			
			return this;
		}
		
		resumeListening() {
			if ( !this._isListening ) {
				Shortcuts.addEvents( this._eventMap.node, this._eventMap.events );
				this._isListening = true;
			}
			
			return this;
		}
		
		destroy() {
			this.off();
			Shortcuts.removeEvents( this._eventMap.node, this._eventMap.events );
			this._isListening = false;
			
			return this;
		}
		
		static addEvent( node, event, callback ) {
			if ( node.addEventListener ) {
				node.addEventListener( String( event ).toLowerCase(), callback, false );
			} else {
				node.attachEvent( `on${String( event ).toLowerCase()}`, callback );
			}
		}
		
		static addEvents( node, eventMap = {} ) {
			for ( let event in eventMap ) {
				const handlers = eventMap[ event ];
				
				if ( typeof handlers === 'function' ) {
					Shortcuts.addEvent( node, event, handlers );
				} else {
					handlers.forEach( handler => Shortcuts.addEvent( node, event, handler ) );
				}
			}
		}
		
		static removeEvents( node, eventMap = {} ) {
			for ( let event in eventMap ) {
				const handlers = eventMap[ event ];
				
				if ( typeof handlers === 'function' ) {
					Shortcuts.removeEvent( node, event, handlers );
				} else {
					handlers.forEach( handler => Shortcuts.removeEvent( node, event, handler ) );
				}
			}
		}
		
		static removeEvent( node, event, callback ) {
			node.removeEventListener( event, callback, false );
		}
	}
	
	if ( exports ) module.exports = Shortcuts;
	else if ( global ) global.Shortcuts = Shortcuts;
	
	return Shortcuts;
}(
	typeof module === "object" && typeof module.exports === "object"
	, typeof window !== "undefined" ? window : null
));