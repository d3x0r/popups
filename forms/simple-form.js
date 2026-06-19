/**
 * @fileoverview Single-input ok/cancel form. Wraps a Popup with a textarea
 * and Okay/Cancel buttons.
 */

import { Popup } from "../core/popup.js";

/**
 * @param {string}   title         Popup title.
 * @param {string}   question      Prompt text shown above the input.
 * @param {string | (() => string)} defaultValue Initial value or a getter (re-invoked each show).
 * @param {(value: string) => void} [ok]       Submit callback.
 * @param {() => void}             [cancelCb] Cancel callback.
 * @returns {Popup}
 */
export function createSimpleForm( title, question, defaultValue, ok, cancelCb ) {
	const popup = new Popup( title );

	const form = document.createElement( "form" );
	form.className = "frameForm";
	form.setAttribute( "action", "none" );

	const textOutput = document.createElement( "SPAN" );
	textOutput.textContent = question;
	const input = document.createElement( "textarea" );
	input.className = "popupInputField";
	input.setAttribute( "size", 45 );
	input.value = "function" === typeof defaultValue ? defaultValue() : defaultValue;

	form.addEventListener( "submit", ( evt ) => {
		evt.preventDefault();
		popup.hide();
		ok && ok( input.value );
	} );
	form.addEventListener( "reset", ( evt ) => {
		evt.preventDefault();
		popup.hide();
	} );

	const okay = document.createElement( "BUTTON" );
	okay.className = "popupOkay";
	okay.textContent = "Okay";
	okay.setAttribute( "name", "submit" );
	okay.addEventListener( "click", ( evt ) => {
		evt.preventDefault();
		popup.hide();
		ok && ok( input.value );
	} );

	const cancel = document.createElement( "BUTTON" );
	cancel.className = "popupCancel";
	cancel.textContent = "Cancel";
	cancel.setAttribute( "type", "reset" );
	cancel.addEventListener( "click", ( evt ) => {
		evt.preventDefault();
		popup.hide();
		cancelCb && cancelCb();
	} );

	popup.on( "show", () => {
		input.value = "function" === typeof defaultValue ? defaultValue() : defaultValue;
		input.focus();
		input.select();
	} );
	popup.on( "close", () => { cancelCb && cancelCb(); } );

	popup.divFrame.addEventListener( "keydown", ( e ) => {
		if( e.keyCode == 27 ) {
			e.preventDefault();
			popup.hide();
			cancelCb && cancelCb();
		}
	} );

	popup.divContent.appendChild( form );
	form.appendChild( textOutput );
	form.appendChild( document.createElement( "br" ) );
	form.appendChild( input );
	form.appendChild( document.createElement( "br" ) );
	form.appendChild( document.createElement( "br" ) );
	form.appendChild( cancel );
	form.appendChild( okay );

	popup.center();
	popup.hide();
	return popup;
}
