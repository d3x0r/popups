/**
 * @fileoverview Popup z-order tracker and the caption drag/resize handler.
 * Singleton.
 */

import { config } from "./config.js";

const localStorage = globalThis.localStorage;

/**
 * @typedef {object} MouseFrameState
 * @property {HTMLElement} frame
 * @property {number}      x
 * @property {number}      y
 * @property {boolean}     dragging
 * @property {boolean}     [sizing]
 */

/** @type {{ activeFrame: MouseFrameState | null }} */
export const globalMouseState = { activeFrame: null };

class PopupTracker {
	/** @type {import("./popup.js").Popup[]} */
	popups = [];
	/** @param {import("./popup.js").Popup} popup */
	raise( popup ) {
		const top = this.popups.length;
		const from = Number( popup.divFrame.style.zIndex );
		if( from === top ) return;
		for( let n = 0; n < this.popups.length; n++ ) {
			if( n == popup.index )
				popup.divFrame.style.zIndex = top;
			else {
				const thisZ = Number( this.popups[n].divFrame.style.zIndex );
				if( thisZ > from )
					this.popups[n].divFrame.style.zIndex = Number( this.popups[n].divFrame.style.zIndex ) - 1;
			}
		}
	}
	find( id ) {
		return this.popups.find( popup => popup.divFrame.id === id );
	}
	addPopup( popup ) {
		popup.index = this.popups.length;
		if( popup.divCaption ) {
			popup.divFrame.style.zIndex = popup.index + 1;
			this.popups.push( popup );
			popup.raise = () => { this.raise( popup ); };
		} else popup.raise = function() {};
	}
}

export const popupTracker = new PopupTracker();

/**
 * Wire mouse + touch drag handlers on a caption element so the user can move
 * the popup. Also installs raise-on-click when `config.autoRaise` is enabled.
 * @param {HTMLElement}              c       Caption element.
 * @param {import("./popup.js").Popup|null} popup_  The popup that owns the caption.
 */
export function addCaptionHandler( c, popup_ ) {
	let popup = popup_;
	// NOTE: original fell back to `createPopup(null,{from:c})` here when popup_
	// was missing, but no current call site exercises that path. Keeping the
	// guarded behavior would re-introduce a circular dep on Popup; if it ever
	// matters, callers can construct the wrapper popup themselves.
	if( !popup ) return;

	const mouseState = {
		frame: popup.divFrame,
		x: 0, y: 0,
		dragging: false,
	};
	if( config.autoRaise && popup_ )
		popup_.divFrame.addEventListener( "mousedown", () => {
			popupTracker.raise( popup );
		} );

	function mouseHandler( c, state ) {
		let added = false;
		function mouseMove( evt ) {
			const state = globalMouseState.activeFrame;
			if( state ) {
				if( state.dragging ) {
					evt.preventDefault();
					const pRect = state.frame.getBoundingClientRect();
					const x = evt.x - pRect.left;
					const y = evt.y - pRect.top;
					state.frame.style.left = parseInt( state.frame.style.left ) + ( x - state.x );
					state.frame.style.top  = parseInt( state.frame.style.top  ) + ( y - state.y );
					if( state.frame.id ) {
						localStorage.setItem( state.frame.id + "/x", popup.divFrame.style.left );
						localStorage.setItem( state.frame.id + "/y", popup.divFrame.style.top );
					}
				}
				if( state.sizing ) {
					evt.preventDefault();
					const pRect = state.frame.getBoundingClientRect();
					const x = evt.x - pRect.left;
					const y = evt.y - pRect.top;
					state.frame.style.left = parseInt( state.frame.style.left ) + ( x - state.x );
					state.frame.style.top  = parseInt( state.frame.style.top  ) + ( y - state.y );
					if( state.frame.id ) {
						localStorage.setItem( state.frame.id + "/x", popup.divFrame.style.left );
						localStorage.setItem( state.frame.id + "/y", popup.divFrame.style.top );
					}
				}
			}
		}
		function mouseDown( evt ) {
			if( evt.target !== c && evt.target.parentNode !== c ) return;
			const realTarget = evt.composedPath()[0];
			if( realTarget !== c && realTarget.parentNode !== c ) return;
			if( !popup_.useMouse ) return;
			if( globalMouseState.activeFrame ) return;
			const pRect = state.frame.getBoundingClientRect();
			popupTracker.raise( popup );
			state.x = evt.x - pRect.left;
			state.y = evt.y - pRect.top;
			globalMouseState.activeFrame = state;
			state.dragging = true;
			if( !added ) {
				added = true;
				document.body.addEventListener( "mousemove", mouseMove );
				document.body.addEventListener( "mouseup", mouseUp );
			}
		}
		function mouseUp( evt ) {
			evt.preventDefault();
			globalMouseState.activeFrame = null;
			state.dragging = false;
			if( added ) {
				added = false;
				document.body.removeEventListener( "mousemove", mouseMove );
				document.body.removeEventListener( "mouseup", mouseUp );
			}
		}

		c.addEventListener( "mousedown", mouseDown );

		c.addEventListener( "touchstart", ( evt ) => {
			if( !popup_.useMouse ) return;
			const pRect = state.frame.getBoundingClientRect();
			popupTracker.raise( popup );
			if( evt.target === c ) {
				evt.preventDefault();
				state.x = evt.touches[0].clientX - pRect.left;
				state.y = evt.touches[0].clientY - pRect.top;
				state.dragging = true;
			}
		}, { passive: true } );
		c.addEventListener( "touchmove", ( evt ) => {
			if( !popup_.useMouse ) return;
			if( state.dragging ) {
				evt.preventDefault();
				const points = evt.touches;
				const pRect = state.frame.getBoundingClientRect();
				const x = points[0].clientX - pRect.left;
				const y = points[0].clientY - pRect.top;
				state.frame.style.left = parseInt( state.frame.style.left ) + ( x - state.x );
				state.frame.style.top  = parseInt( state.frame.style.top  ) + ( y - state.y );
				if( state.frame.id ) {
					localStorage.setItem( state.frame.id + "/x", popup.divFrame.style.left );
					localStorage.setItem( state.frame.id + "/y", popup.divFrame.style.top );
				}
			}
		}, { passive: true } );
		c.addEventListener( "touchend", ( evt ) => {
			if( !popup_.useMouse ) return;
			if( evt.target === c ) {
				evt.preventDefault();
				state.dragging = false;
			}
		}, { passive: true } );
	}

	if( config.defaultDrag ) {
		mouseHandler( c, mouseState );
		if( popup_ )
			mouseHandler( popup_.divFrame, mouseState );
	}
}
