/**
 * @fileoverview Slider control. Constructor:
 * `new Slider(form, o, field, text, f?, g?)`.
 * `f` maps slider-value → bound value; `g` maps bound value → slider-value.
 */

import { findEnclosingPopup } from "../core/popup-walk.js";
import { registerControl } from "../core/registry.js";
import { setValue, getInputValue } from "../core/value-binding.js";
import { strings } from "../core/strings.js";
import { suffixed } from "../core/suffix.js";

export class Slider {
	#o;
	#field;
	#text;
	#initialValue;
	#binder;
	#input;
	#label;
	#valueSpan;
	#onChange = [];

	/**
	 * @param {HTMLElement}              form
	 * @param {object}                   o
	 * @param {string}                   field
	 * @param {string}                   text
	 * @param {((sliderVal:number)=>number)} [f]  Slider → bound transform.
	 * @param {((boundVal:number)=>number)}  [g]  Bound → slider transform.
	 */
	constructor( form, o, field, text, f, g ) {
		this.#o = o;
		this.#field = field;
		this.#text = text;

		const popup = findEnclosingPopup( form );

		if( f && "function" !== typeof f ) {
			console.log( "Slider: Function to transform value is not a function:", f );
			f = null;
		}
		if( g && "function" !== typeof g ) {
			console.log( "Slider: Function to transform from value to slider is not a function:", g );
			g = null;
		}
		const suffix = popup ? popup.suffix : '';
		this.#initialValue = getInputValue( o, field );

		const label = document.createElement( "SPAN" );
		label.textContent = text;

		const input = document.createElement( "INPUT" );
		input.setAttribute( "type", "range" );
		input.setAttribute( "min", 1 );
		input.setAttribute( "max", 1000 );
		input.className = suffixed( "valueSlider", suffix ) + " rightJustify";
		input.value = g ? g( getInputValue( o, field ) ) : getInputValue( o, field );

		const valueSpan = document.createElement( "SPAN" );
		valueSpan.textContent = getInputValue( o, field );
		valueSpan.className = suffixed( "field-unit-span", suffix );

		const binder = document.createElement( "div" );
		binder.className = suffixed( "field-unit", suffix );

		input.addEventListener( "input", () => {
			if( f ) setValue( null, o, field, f( input.value ), null );
			else    setValue( null, o, field, input.value, null );
			valueSpan.textContent = getInputValue( o, field );
			this.on( "change", this );
		} );

		form.appendChild( binder );
		binder.appendChild( label );
		binder.appendChild( input );
		binder.appendChild( valueSpan );

		binder.addEventListener( "mousedown", ( evt ) => {
			evt.stopPropagation();
		} );

		if( popup ) {
			popup.on( "accept", () => { this.#initialValue = input.value; } );
			popup.on( "reject", () => { input.value = this.#initialValue; } );
		}

		this.#binder = binder;
		this.#input = input;
		this.#label = label;
		this.#valueSpan = valueSpan;
	}

	get el()      { return this.#binder; }
	get control() { return this.#input; }
	get span()    { return this.#label; }

	on( event, cb ) {
		if( "function" === typeof cb ) {
			if( event === "change" ) this.#onChange.push( cb );
			this.#input.addEventListener( event, cb );
		} else {
			if( event === "change" ) this.#onChange.forEach( f => f( cb ) );
		}
	}

	// NOTE: preserved upstream bug — uses .checked on a range input.
	get value()      { return this.#input.checked; }
	set value( val ) {
		setValue( null, this.#o, this.#field, val, null );
		this.#input.checked = val;
		this.#onChange.forEach( cb => cb() );
	}

	reset() {
		setValue( null, this.#o, this.#field, this.#initialValue, null );
		this.#input.checked = this.#initialValue;
	}
	changes() {
		if( getInputValue( this.#o, this.#field ) !== this.#initialValue ) {
			return this.#text
				+ strings.get( " changed from " )
				+ this.#initialValue
				+ strings.get( " to " )
				+ getInputValue( this.#o, this.#field );
		}
		return '';
	}
	get style() { return this.#binder.style; }
}

registerControl( "makeSlider", Slider );
