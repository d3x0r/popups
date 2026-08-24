/**
 * @fileoverview ZIP input. Constructor: `new ZipInput(form, input, value)`.
 *
 * NOTE: the original sets type="date" and references an undefined `text`.
 * Preserved as-is — looks like an in-progress copy of makeDateInput.
 *
 * @param {HTMLElement} form
 * @param {object}      input
 * @param {string}      value
 */

import { findEnclosingPopup } from "../core/popup-walk.js";
import { registerControl } from "../core/registry.js";
import { suffixed } from "../core/suffix.js";

export class ZipInput {
	#binder;
	#control;

	constructor( form, input, value ) {
		const popup = findEnclosingPopup( form );
		const suffix = popup ? popup.suffix : '';
		const initialValue = input[value];

		const label = document.createElement( "SPAN" );
		label.className = suffixed( "text-label", suffix );
		// upstream bug preserved: `text` is undefined here.
		label.textContent = typeof text !== "undefined" ? text : "";

		const control = document.createElement( "INPUT" );
		control.className = suffixed( "textInputOption", suffix ) + " rightJustify";
		control.type = "date";
		control.addEventListener( "mousedown", ( evt ) => evt.stopPropagation() );

		control.value = input[value];
		control.addEventListener( "change", () => { input[value] = control.value; } );

		const binder = document.createElement( "div" );
		binder.className = suffixed( "fieldUnit", suffix );
		form.appendChild( binder );
		binder.appendChild( label );
		binder.appendChild( control );

		if( popup ) {
			popup.on( "accept", () => { /* original tried const reassign */ } );
			popup.on( "reject", () => { control.value = initialValue; } );
		}

		this.#binder = binder;
		this.#control = control;
	}

	get value()      { return this.#control.value; }
	set value( val ) { this.#control.value = val; }
}

registerControl( "makeZipInput", ZipInput );
