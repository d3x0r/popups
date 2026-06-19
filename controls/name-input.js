/**
 * @fileoverview Read-only name with a (rename) button that pops a SimpleForm.
 * Constructor: `new NameInput(form, input, value, text)`.
 */

import { findEnclosingPopup } from "../core/popup-walk.js";
import { registerControl } from "../core/registry.js";
import { setValue, getInputValue } from "../core/value-binding.js";
import { strings } from "../core/strings.js";
import { createSimpleForm } from "../forms/simple-form.js";

export class NameInput {
	#input;
	#value;
	#text;
	#initialValue;
	#textOutput;
	#textLabel;
	#binder;

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
		this.#initialValue = getInputValue( input, value );
		const suffix = popup ? popup.suffix : '';

		const textLabel = document.createElement( "SPAN" );
		textLabel.className = "text-label" + suffix;
		textLabel.textContent = text;

		const textOutput = document.createElement( "SPAN" );
		textOutput.className = "text-value" + suffix;
		textOutput.textContent = input[value];

		const buttonRename = document.createElement( "Button" );
		buttonRename.textContent = strings.get( "(rename)" );
		buttonRename.className = "buttonOption" + suffix + " rightJustify";
		buttonRename.addEventListener( "click", ( evt ) => {
			evt.preventDefault();
			const newName = createSimpleForm(
				strings.get( "Change Name" ),
				strings.get( "Enter new name" ),
				getInputValue( input, value ),
				( v ) => {
					setValue( null, input, value, v, null );
					textOutput.textContent = v;
				},
			);
			newName.show();
		} );

		const binder = document.createElement( "div" );
		binder.className = "fieldUnit" + suffix;
		form.appendChild( binder );
		binder.appendChild( textLabel );
		binder.appendChild( textOutput );
		binder.appendChild( buttonRename );

		if( popup ) {
			popup.on( "refresh", () => {
				this.#initialValue = textOutput.textContent = getInputValue( input, value );
			} );
			popup.on( "reset", () => {
				textOutput.textContent = input[value] = this.#initialValue;
			} );
			popup.on( "accept", () => { this.#initialValue = textOutput.textContent; } );
			popup.on( "reject", () => { textOutput.textContent = this.#initialValue; } );
		}

		this.#textOutput = textOutput;
		this.#textLabel = textLabel;
		this.#binder = binder;
	}

	get value()      { return this.#textOutput.textContent; }
	set value( val ) { this.#textOutput.textContent = val; }

	reset() {
		this.#input[this.#value] = this.#initialValue;
		this.#textLabel.textContent = this.#initialValue;
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
	set tooltip( val ) {
		const tooltip = document.createElement( "span" );
		tooltip.className = "tooltip-text";
		tooltip.textContent = val;
		this.#binder.appendChild( tooltip );
		this.#binder.classList.add( "has-tooltip" );
	}
}

registerControl( "makeNameInput", NameInput );
