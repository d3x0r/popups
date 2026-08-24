/**
 * @fileoverview SSN input. Constructor: `new SSNInput(form, input, value)`.
 *
 * NOTE: like ZIP, the original is mostly a copy of date input and sets
 * type="date"; preserved as-is.
 *
 * @param {HTMLElement} form
 * @param {object}      input
 * @param {string}      value
 */

import { findEnclosingPopup } from "../core/popup-walk.js";
import { registerControl } from "../core/registry.js";
import { strings } from "../core/strings.js";
import { suffixed } from "../core/suffix.js";

export class SSNInput {
	#input;
	#value;
	#initialValue;
	#binder;
	#control;

	constructor( form, input, value ) {
		this.#input = input;
		this.#value = value;

		const popup = findEnclosingPopup( form );
		const suffix = popup ? popup.suffix : '';
		this.#initialValue = input[value];

		const label = document.createElement( "SPAN" );
		label.className = suffixed( "text-label", suffix );
		// upstream bug preserved: text undefined.
		label.textContent = typeof text !== "undefined" ? text : "";

		const control = document.createElement( "INPUT" );
		control.className = suffixed( "textInputOption", suffix ) + " rightJustify";
		control.type = "date";

		control.value = input[value];
		control.addEventListener( "change", () => { input[value] = control.value; } );

		const binder = document.createElement( "div" );
		binder.className = suffixed( "fieldUnit", suffix );
		form.appendChild( binder );
		binder.appendChild( label );
		binder.appendChild( control );

		if( popup ) {
			popup.on( "accept", () => { this.#initialValue = control.value; } );
			popup.on( "reject", () => { control.value = this.#initialValue; } );
		}

		this.#binder = binder;
		this.#control = control;
	}

	get value()      { return this.#control.value; }
	set value( val ) { this.#control.value = val; }

	reset() {
		this.#input[this.#value] = this.#initialValue;
		this.#control.value = this.#initialValue;
	}
	changes() {
		if( this.#input[this.#value] !== this.#initialValue ) {
			// upstream bug preserved: text undefined.
			return ( typeof text !== "undefined" ? text : "" )
				+ strings.get( " changed from " )
				+ this.#initialValue
				+ strings.get( " to " )
				+ this.#input[this.#value];
		}
		return '';
	}
}

registerControl( "makeSSNInput", SSNInput );
