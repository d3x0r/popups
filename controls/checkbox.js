/**
 * @fileoverview Checkbox control. Constructor matches the original factory:
 * `makeCheckbox(form, o, field, text, opts)`. Importing this file registers
 * `popup.makeCheckbox(...)` and `popup.Checkbox` on Popup.prototype.
 */

import { Popup, getPopupFromElement } from "../core/popup.js";
import { registerControl } from "../core/registry.js";
import { setValue, getInputValue } from "../core/value-binding.js";
import { strings } from "../core/strings.js";
import { suffixed, joinSuffix } from "../core/suffix.js";

/**
 * @typedef {object} CheckboxOptions
 * @property {Popup}  [form]   Explicit owning popup (overrides DOM walk).
 * @property {string} [suffix]
 */

export class Checkbox {
	#o;
	#field;
	#text;
	#initialValue;
	#binder;
	#input;
	#label;
	#onChange = [];

	/**
	 * @param {HTMLElement}     form
	 * @param {object}          o      Object containing the bound field.
	 * @param {string}          field  Dotted path on `o`.
	 * @param {string}          text   Label text.
	 * @param {CheckboxOptions} [opts]
	 */
	constructor( form, o, field, text, opts ) {
		this.#o = o;
		this.#field = field;
		this.#text = text;

		// Walk up the DOM to find an enclosing Popup, either as a direct
		// instance or via the popupMap WeakMap. Matches original behavior.
		let in_form = form;
		let in_popup = null;
		while( in_form && !(
			( in_popup = in_form ) instanceof Popup ||
			( in_popup = getPopupFromElement( in_form ) ) instanceof Popup
		) ) in_form = in_form.parentNode;

		opts = opts || {};
		this.#initialValue = getInputValue( o, field );
		const popupForm = opts.form || in_popup;
		const suffix = joinSuffix( popupForm ? popupForm.suffix : '', opts.suffix );
		const id = "checkbox_" + Math.random();

		const label = document.createElement( "label" );
		label.htmlFor = id;
		label.className = "field-unit-span";
		label.textContent = text;

		const input = document.createElement( "INPUT" );
		input.id = id;
		input.setAttribute( "type", "checkbox" );
		input.className = suffixed( "checkOption", suffix ) + " rightJustify";
		input.checked = this.#initialValue;

		const binder = document.createElement( "div" );
		binder.className = suffixed( "fieldUnit", suffix );
		binder.addEventListener( "click", ( e ) => {
			if( e.target === input ) return;
			e.preventDefault();
			o[field] = input.checked = !input.checked;
			this.#onChange.forEach( cb => cb() );
		} );
		input.addEventListener( "change", () => {
			setValue( null, o, field, input.checked, null );
		} );
		label.addEventListener( "click", ( e ) => {
			if( e.target === input ) return;
			e.preventDefault();
			setValue( null, o, field, !input.checked );
			this.#onChange.forEach( cb => cb() );
		} );
		form.appendChild( binder );
		binder.appendChild( label );
		binder.appendChild( input );

		if( popupForm ) {
			popupForm.on( "refresh", () => {
				this.#initialValue = input.checked = getInputValue( o, field );
			} );
			popupForm.on( "reset", () => {
				setValue( o, field, input.checked = this.#initialValue );
			} );
			popupForm.on( "accept", () => {
				this.#initialValue = input.checked;
			} );
			popupForm.on( "reject", () => {
				input.checked = this.#initialValue;
			} );
		}
		binder.addEventListener( "mousedown", ( evt ) => {
			evt.stopPropagation();
		} );

		this.#binder = binder;
		this.#input = input;
		this.#label = label;
	}

	get el()      { return this.#binder; }
	get control() { return this.#input; }
	get span()    { return this.#label; }

	on( event, cb ) {
		if( event === "change" ) this.#onChange.push( cb );
		this.#input.addEventListener( event, cb );
	}

	get checked()      { return this.#input.checked; }
	set checked( val ) { this.#input.checked = val; }

	get value()      { return this.#input.checked; }
	set value( val ) {
		setValue( this.#o, this.#field, val );
		this.#input.checked = val;
		this.#onChange.forEach( cb => cb() );
	}

	refresh() {
		this.#initialValue = getInputValue( this.#o, this.#field );
		this.#input.checked = this.#initialValue;
	}
	reset() {
		setValue( this.#o, this.#field, this.#initialValue );
		this.#input.checked = this.#initialValue;
	}

	get disabled()      { return this.#input.disabled; }
	set disabled( val ) { this.#input.disabled = val; }

	changes() {
		const newval = getInputValue( this.#o, this.#field );
		if( newval !== this.#initialValue ) {
			return this.#text
				+ strings.get( " changed from " )
				+ this.#initialValue
				+ strings.get( " to " )
				+ newval;
		}
		return '';
	}

	get style() { return this.#binder.style; }

	set tooltip( val ) {
		const tooltip = document.createElement( "span" );
		tooltip.className = "tooltip-text";
		tooltip.textContent = val;
		this.#binder.appendChild( tooltip );
		this.#binder.classList.add( "has-tooltip" );
	}
}

registerControl( "makeCheckbox", Checkbox );
