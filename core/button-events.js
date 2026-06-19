/**
 * @fileoverview handleButtonEvents — wire a uniform press/release/keyboard
 * activation experience onto an existing element. Pulled out of
 * controls/button.js so the core entry can expose it without dragging in
 * Button-class registration side effects.
 */

/**
 * @param {HTMLElement}   button
 * @param {() => void}    onClick
 */
export function handleButtonEvents( button, onClick ) {
	let pressed = false;
	let pressed_ = false;
	button.addEventListener( "keydown", ( evt ) => {
		if( evt.key === "Enter" || evt.key === " " ) {
			evt.preventDefault();
			evt.stopPropagation();
			onClick();
		}
	} );
	button.addEventListener( "click", ( evt ) => {
		evt.preventDefault();
		evt.stopPropagation();
		onClick();
	} );
	button.addEventListener( "touchstart", ( evt ) => {
		evt.preventDefault();
		pressed = true;
		pressed_ = true;
		button.classList.add( "pressed" );
	}, { passive: false } );
	button.addEventListener( "touchend", ( evt ) => {
		evt.preventDefault();
		pressed = false;
		pressed_ = false;
		button.classList.remove( "pressed" );
		onClick();
	}, { passive: false } );
	button.addEventListener( "mousedown", ( evt ) => {
		evt.preventDefault();
		pressed = true;
		button.classList.add( "pressed" );
	} );
	button.addEventListener( "mouseup", ( evt ) => {
		evt.preventDefault();
		pressed = false;
		button.classList.remove( "pressed" );
	} );
	button.addEventListener( "mouseout", () => {
		pressed_ = pressed;
		pressed = false;
		button.classList.remove( "pressed" );
	} );
	button.addEventListener( "mousemove", ( evt ) => {
		if( pressed_ && !pressed ) {
			if( evt.buttons ) {
				button.classList.add( "pressed" );
				pressed = true;
			} else pressed_ = false;
		}
	} );
}
