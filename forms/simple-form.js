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
 * @param {object} [opts]  Passed to the Popup. `modal` DEFAULTS TO TRUE: this is
 *                         a blocking question, and rendering it as a <dialog>
 *                         via showModal() puts it in the top layer, clear of
 *                         any canvas or overlay the host page has painted.
 *                         Pass `{ modal: false }` to opt out.
 *                         `near: {x,y}` opens it beside that point instead of
 *                         centred -- a form is usually a follow-up to something
 *                         the user just clicked, and appearing there keeps the
 *                         two connected.
 * @returns {Popup}
 */
export function createSimpleForm( title, question, defaultValue, ok, cancelCb, opts ) {
	const popupOpts = Object.assign( {}, opts );
	if( popupOpts.modal === undefined ) popupOpts.modal = true;
	const popup = new Popup( title, null, popupOpts );

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

	/*
	 * Placement happens on show, not here: in the constructor the frame has no
	 * layout yet, so its measured size is 0x0 and any placement computed from
	 * it is wrong. (center() now guards against exactly that.)
	 */
	popup.on( "show", () => {
		const near = opts && opts.near;
		if( near ) popup.placeNear( near.x, near.y );
		else popup.center();
	} );

	popup.hide();
	return popup;
}
