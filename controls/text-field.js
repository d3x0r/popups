/**
 * @fileoverview Read-mostly text field (display value + minimal edit).
 * Constructor: `new TextField(form, input, value, text, money, percent, area)`.
 */

import { findEnclosingPopup } from "../core/popup-walk.js";
import { registerControl } from "../core/registry.js";
import { setValue, getInputValue } from "../core/value-binding.js";
import { utils } from "../core/utils.js";
import { strings } from "../core/strings.js";
import { suffixed } from "../core/suffix.js";

export class TextField {
	#input;
	#value;
	#text;
	#money;
	#percent;
	#initialValue;
	#binder;
	#control;
	#label;

	/**
	 * @param {HTMLElement} form
	 * @param {object}      input
	 * @param {string}      value
	 * @param {string}      text
	 * @param {boolean}     [money]
	 * @param {boolean}     [percent]
	 * @param {boolean}     [area]
	 */
	constructor( form, input, value, text, money, percent, area ) {
		this.#input = input;
		this.#value = value;
		this.#text = text;
		this.#money = money;
		this.#percent = percent;

		this.#initialValue = getInputValue( input, value );
		const popup = findEnclosingPopup( form );
		const suffix = popup ? popup.suffix : '';

		// NOTE: original used createEleemnt (sic) for TEXTAREA branch; preserved
		// since no live caller appears to exercise area=true here.
		const label = area
			? document.createElement( "TEXTAREA" )
			: document.createElement( "SPAN" );
		label.className = suffixed( "text-label", suffix );
		label.textContent = text;

		const control = document.createElement( "SPAN" );
		control.className = suffixed( "text-field", suffix ) + " rightJustify";
		control.addEventListener( "mousedown", ( evt ) => evt.stopPropagation() );

		const setFieldValue = () => {
			const val = getInputValue( input, value );
			if( money ) {
				control.textContent = utils.to$( val );
				control.addEventListener( "change", () => {
					const v = utils.toD( control.value );
					input[value] = control.textContent = utils.to$( v );
				} );
			} else if( percent ) {
				control.textContent = utils.toP( val );
				control.addEventListener( "change", () => {
					const v = utils.fromP( control.value );
					setValue( null, input, value, control.textContent = utils.toP( v ), null );
				} );
			} else {
				control.textContent = getInputValue( input, value );
				control.addEventListener( "input", () => {
					setValue( null, input, value, control.value, null );
				} );
			}
		};
		setFieldValue();

		const binder = document.createElement( "div" );
		binder.className = suffixed( "fieldUnit", suffix );
		form.appendChild( binder );
		binder.appendChild( label );
		binder.appendChild( control );

		if( popup ) {
			popup.on( "refresh", () => {
				this.#initialValue = getInputValue( input, value );
				setFieldValue();
			} );
			popup.on( "accept", () => { this.#initialValue = control.textContent; } );
			popup.on( "reject", () => { control.textContent = this.#initialValue; } );
		}

		this.#binder = binder;
		this.#control = control;
		this.#label = label;
		this._setFieldValue = setFieldValue;
	}

	get textLabel() { return this.#label; }
	get divFrame()  { return this.#binder; }

	addEventListener( a, b ) { return this.#control.addEventListener( a, b ); }

	refresh() {
		this.#initialValue = getInputValue( this.#input, this.#value );
		this._setFieldValue();
	}

	get value() {
		if( this.#money )   return utils.toD( this.#control.textContent );
		if( this.#percent ) return utils.fromP( this.#control.textContent );
		return this.#control.textContent;
	}
	set value( val ) {
		if( this.#money )        this.#control.textContent = utils.to$( val );
		else if( this.#percent ) this.#control.textContent = utils.toP( val );
		else                     this.#control.textContent = val;
	}

	reset() {
		setValue( null, this.#input, this.#value, this.#initialValue, { money: this.#money, percent: this.#percent } );
		this._setFieldValue();
	}
	changes() {
		const val = getInputValue( this.#input, this.#value );
		if( val !== this.#initialValue ) {
			return this.#text
				+ strings.get( " changed from " )
				+ this.#initialValue
				+ strings.get( " to " )
				+ val;
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

registerControl( "makeTextField", TextField );
