(function ( exports, global ) {
	'use strict';
	
	const keycode = require( '@alexsasharegan/keycodes' );
	const Emitter = require( 'component-emitter' );
	
	const keydown = '__keydown';
	const keyup   = '__keyup';
	
	class Shortcuts extends Emitter {
		
		constructor( node = window ) {
			super();
			
			this.handleKeyDown = this.handleKeyDown.bind( this );
			this.handleKeyUp   = this.handleKeyUp.bind( this );
			
			this._keyMap    = {};
			this._shortcuts = {};
			
			this.on( keydown, this.handleShortcuts );
			
			Shortcuts.addEvents( node, {
				keydown: this.handleKeyDown,
				keyup: this.handleKeyUp,
			} );
		}
		
		handleKeyDown( event ) {
			event.preventDefault();
			const code = keycode( event, true );
			
			this._keyMap[ code ] = keycode( code );
			this.emit( keydown, event );
		}
		
		handleKeyUp( event ) {
			event.preventDefault();
			const code = keycode( event, true );
			
			delete this._keyMap[ code ];
			this.emit( keyup, event );
		}
		
		handleShortcuts( event ) {
			Object.keys( this._shortcuts )
			      .forEach( shortcut => {
				      const sequence = this._shortcuts[ shortcut ];
				      let shouldFire = true;
				
				      for ( let i = 0; i < sequence.length; i++ ) {
					      if ( !this.testKeyDown( sequence[ i ] ) ) {
						      shouldFire = false;
						      break;
					      }
				      }
				
				      // TODO: dev logging
				      console.log( { shouldFire, keymap: this._keyMap } );
				
				      if ( shouldFire ) this.emit( shortcut, event );
			      } );
		}
		
		createShortcut( name, keys ) {
			// normalize input & transform to keycodes
			this._shortcuts[ name ] = (
				Array.isArray( keys ) ? keys : keys.split( '+' )
			).map( key => keycode( key, true ) );
			
			return this;
		}
		
		testKeyDown( code ) {
			if ( Array.isArray( code ) ) {
				for ( let i = 0; i < code.length; i++ ) {
					let valid = !!this._keyMap[ code[ i ] ];
					if ( valid ) return valid;
				}
				
				return false;
			} else {
				return !!this._keyMap[ code ];
			}
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
		
		static addEventOnce( node, event, callback ) {
			function fnOnce() {
				Shortcuts.removeEvent( node, event, fnOnce );
				
				return callback.apply( this, arguments );
			}
			
			Shortcuts.addEvent( node, event, fnOnce );
		}
		
		static removeEvent( node, event, callback ) {
			node.removeEventListener( event, callback, false );
		}
	}
	
	// TODO: for testing, expose globally
	window.Shortcuts = Shortcuts;
	
	if ( exports ) module.exports = Shortcuts;
	else if ( global ) global.Shortcuts = Shortcuts;
	
	return Shortcuts;
}(
	typeof module === "object" && typeof module.exports === "object"
	, typeof window !== "undefined" ? window : null
));