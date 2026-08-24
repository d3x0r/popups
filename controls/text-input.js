/**
 * @fileoverview Text input. Constructor:
 * `new TextInput(form, input, value, text, money, percent, number, suffix_, area)`.
 *
 * Pass exactly one of `money` / `percent` / `number` for formatted modes;
 * otherwise the field is a plain text/textarea.
 */

import { findEnclosingPopup } from "../core/popup-walk.js";
import { registerControl } from "../core/registry.js";
import { setValue, getInputValue } from "../core/value-binding.js";
import { utils } from "../core/utils.js";
import { strings } from "../core/strings.js";
import { suffixed } from "../core/suffix.js";

export class TextInput {
	#input;
	#value;
	#text;
	#money;
	#percent;
	#number;
	#initialValue;
	#binder;
	#control;
	#label;
	#events = {};

	/**
	 * @param {HTMLElement} form
	 * @param {object}      input     Bound object.
	 * @param {string}      value     Field name on `input`.
	 * @param {string}      text      Label.
	 * @param {boolean}     [money]   Format as currency.
	 * @param {boolean}     [percent] Format as percent.
	 * @param {boolean}     [number]  Constrain to numeric input.
	 * @param {string}      [suffix_] Extra class-name suffix.
	 * @param {boolean}     [area]    Use <textarea> instead of <input>.
	 */
	constructor( form, input, value, text, money, percent, number, suffix_, area ) {
		this.#input = input;
		this.#value = value;
		this.#text = text;
		this.#money = money;
		this.#percent = percent;
		this.#number = number;

		const popup = findEnclosingPopup( form );
		this.#initialValue = getInputValue( input, value );
		const suffix = ( popup ? popup.suffix : "" ) + ( suffix_ || '' );

		const label = document.createElement( "SPAN" );
		label.className = suffixed( "text-label", suffix );
		label.textContent = text;

		const control = area
			? document.createElement( "TEXTAREA" )
			: document.createElement( "INPUT" );
		control.className = suffixed( "textInputOption", suffix ) + " rightJustify";
		control.addEventListener( "click", () => control.select() );
		if( number ) {
			control.setAttribute( "pattern", "[0-9]*" );
			control.setAttribute( "inputmode", "numeric" );
			control.setAttribute( "size", "10" );
		}

		if( popup ) {
			popup.on( "refresh", () => {
				this.#initialValue = control.value = getInputValue( input, value );
			} );
			popup.on( "reset", () => { control.value = this.#initialValue; } );
			popup.on( "accept", () => { this.#initialValue = control.value; } );
			popup.on( "reject", () => { control.value = this.#initialValue; } );
		}

		const setFieldValue = () => {
			const val = getInputValue( input, value );
			if( money )        control.value = utils.to$( val );
			else if( percent ) control.value = utils.toP( val );
			else if( number )  control.value = Number( val );
			else               control.value = val;
		};
		const addValueEvents = () => {
			if( money ) {
				control.addEventListener( "change", () => {
					const val = utils.toD( control.value );
					setValue( null, input, value, val, null );
					control.value = utils.to$( val );
					this.on( "change", this );
				} );
			} else if( percent ) {
				control.addEventListener( "change", () => {
					const val = utils.fromP( control.value );
					setValue( null, input, value, val, null );
					control.value = utils.toP( val );
					this.on( "change", this );
				} );
			} else if( number ) {
				control.addEventListener( "change", () => {
					const val = Number( control.value );
					setValue( null, input, value, val, null );
					control.textContent = val;
					this.on( "change", this );
				} );
			} else {
				control.addEventListener( "input", () => {} );
				control.addEventListener( "input", () => {
					const val = control.value;
					setValue( null, input, value, val, null );
					this.on( "change", this );
				} );
			}
		};
		setFieldValue();
		addValueEvents();

		const binder = document.createElement( "div" );
		binder.className = suffixed( "fieldUnit", suffix );
		form.appendChild( binder );
		binder.appendChild( label );
		binder.appendChild( control );

		binder.addEventListener( "mousedown", ( evt ) => evt.stopPropagation() );

		this.#binder = binder;
		this.#control = control;
		this.#label = label;
		this._setFieldValue = setFieldValue;
	}

	get el()      { return this.#binder; }
	get control() { return this.#control; }
	get span()    { return this.#label; }
	get frame()   { return this.#binder; }

	addEventListener( a, b ) { return this.#control.addEventListener( a, b ); }
	blur()                   { this.#control.blur(); }

	on( event, param ) {
		if( "function" === typeof param ) {
			this.#events[event] = param;
		} else {
			if( event in this.#events ) this.#events[event]( param );
		}
	}

	get value() {
		if( this.#money )   return utils.toD( this.#control.value );
		if( this.#percent ) return utils.fromP( this.#control.value );
		if( this.#number )  return Number( this.#control.value );
		return this.#control.value;
	}
	set value( val ) {
		if( this.#money )        this.#control.value = utils.to$( val );
		else if( this.#percent ) this.#control.value = utils.toP( val );
		else                     this.#control.value = val;
	}

	refresh() {
		this.#initialValue = getInputValue( this.#input, this.#value );
		this._setFieldValue();
	}
	reset() {
		setValue( null, this.#input, this.#value, this.#initialValue, null );
		this._setFieldValue();
	}
	changes() {
		const newVal = getInputValue( this.#input, this.#value );
		if( newVal !== this.#initialValue ) {
			return this.#text
				+ strings.get( " changed from " )
				+ this.#initialValue
				+ strings.get( " to " )
				+ newVal;
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

registerControl( "makeTextInput", TextInput );
