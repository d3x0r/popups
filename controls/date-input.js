/**
 * @fileoverview Date input. Constructor:
 * `new DateInput(form, input, value, text)`.
 */

import { findEnclosingPopup } from "../core/popup-walk.js";
import { registerControl } from "../core/registry.js";
import { strings } from "../core/strings.js";
import { suffixed } from "../core/suffix.js";

export class DateInput {
	#input;
	#value;
	#text;
	// NOTE: original declared initialValue as `const` but assigned in popup
	// accept handlers; preserved-bug-wise the assignments would throw. Kept
	// as a mutable field so the popup wiring matches intent.
	#initialValue;
	#binder;
	#control;
	#label;

	/**
	 * @param {HTMLElement} form
	 * @param {object}      input
	 * @param {string}      value
	 * @param {string}      text
	 */
	constructor( form, input, value, text ) {
		this.#input = input;
		this.#value = value;
		this.#text = text;

		const popup = findEnclosingPopup( form );
		const suffix = popup ? popup.suffix : '';
		this.#initialValue = input[value];

		const label = document.createElement( "SPAN" );
		label.className = suffixed( "text-label", suffix );
		label.textContent = text;

		const control = document.createElement( "INPUT" );
		control.className = suffixed( "textInputOption", suffix ) + " rightJustify";
		control.type = "date";
		control.addEventListener( "mousedown", ( evt ) => evt.stopPropagation() );

		if( input[value] instanceof Date ) {
			control.valueAsDate = input[value];
		} else {
			control.value = input[value];
		}
		control.addEventListener( "change", () => {
			input[value] = new Date( control.value );
		} );

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
		this.#label = label;
	}

	addEventListener( a, b ) { return this.#control.addEventListener( a, b ); }

	get value()      { return this.#control.value; }
	set value( val ) { this.#control.value = val; }

	hide() { this.#binder.style.display = "none"; }
	show() { this.#binder.style.display = ""; }

	reset() {
		this.#input[this.#value] = this.#initialValue;
		this.#control.valueAsDate = this.#initialValue;
	}
	changes() {
		if( this.#input[this.#value] !== this.#initialValue ) {
			return this.#text
				+ strings.get( " changed from " )
				+ this.#initialValue
				+ strings.get( " to " )
				+ this.#input[this.#value];
		}
		return '';
	}
}

registerControl( "makeDateInput", DateInput );
