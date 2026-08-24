/**
 * @fileoverview Dropdown choice list. Constructor:
 * `new ChoiceInput(form, input, value, choices, text, opts)`.
 */

/**
 * @typedef {object} ChoiceInputOptions
 * @property {string}                          [suffix]
 * @property {boolean}                         [useIndex]  Bind selected index instead of value.
 * @property {(selectedIndex:number) => void}  [change]    Fired on user selection.
 */

/**
 * @typedef {string | {text: string, value: any, className?: string, type?: object}} Choice
 */

import { findEnclosingPopup } from "../core/popup-walk.js";
import { registerControl } from "../core/registry.js";
import { setValue, getInputValue } from "../core/value-binding.js";
import { strings } from "../core/strings.js";
import { suffixed } from "../core/suffix.js";

export class ChoiceInput {
	#input;
	#value;
	#text;
	#opts;
	#initialValue;
	#binder;
	#control;
	#label;
	#options = [];

	/**
	 * @param {HTMLElement}        form
	 * @param {object}             input
	 * @param {string}             value
	 * @param {Choice[]}           choices
	 * @param {string}             text
	 * @param {ChoiceInputOptions} [opts]
	 */
	constructor( form, input, value, choices, text, opts ) {
		this.#input = input;
		this.#value = value;
		this.#text = text;
		this.#opts = opts;

		const popup = findEnclosingPopup( form );
		const suffix = ( popup ? popup.suffix : '' ) + ( ( opts && opts.suffix ) ? opts.suffix : "" );
		this.#initialValue = getInputValue( input, value );

		const label = document.createElement( "label" );
		const id = "choicebox_" + Math.random();
		label.htmlFor = id;
		label.className = suffixed( "choice-label", suffix );
		label.textContent = text;

		const control = document.createElement( "SELECT" );
		control.id = id;
		control.className = suffixed( "selectInput", suffix ) + " rightJustify";
		control.addEventListener( "mousedown", ( evt ) => evt.stopPropagation() );

		const currentValue = getInputValue( input, value );
		for( let choice of choices ) {
			const option = document.createElement( "option" );
			if( "string" === typeof choice ) {
				option.text = choice;
				option.value = choice;
				choice = { text: choice, value: choice, type: {} };
			} else {
				option.text = choice.text;
				option.value = choice.value;
			}
			this.#options.push( { option, choice } );
			control.add( option );
			if( choice.value === currentValue ) {
				control.selectedIndex = control.options.length - 1;
			}
		}

		const getValue = () => {
			const idx = control.selectedIndex;
			if( idx >= 0 ) {
				if( opts?.useIndex ) return idx;
				return this.#options[idx].choice.value;
			}
		};

		control.addEventListener( "change", () => {
			const opt = this.#options[control.selectedIndex];
			setValue( null, input, value, getValue(), opt.type );
			if( opts && opts.change ) opts.change( control.selectedIndex );
		} );

		const binder = document.createElement( "div" );
		binder.className = suffixed( "fieldUnit", suffix );
		form.appendChild( binder );
		binder.appendChild( label );
		binder.appendChild( control );

		if( popup ) {
			popup.on( "refresh", () => { this.#initialValue = control.value = input[value]; } );
			popup.on( "reset",   () => { input[value] = control.value = this.#initialValue; } );
			popup.on( "accept",  () => { this.#initialValue = control.value; } );
			popup.on( "reject",  () => { control.value = this.#initialValue; } );
		}

		this.#binder = binder;
		this.#control = control;
		this.#label = label;
		this._getValue = getValue;
	}

	get el()      { return this.#binder; }
	get control() { return this.#control; }
	get span()    { return this.#label; }

	on()                     {}
	addEventListener( e, c ) { return this.#control.addEventListener( e, c ); }
	remove()                 { this.#control.remove(); }

	get value() { return this._getValue(); }
	set value( val ) {
		const index = this.#options.findIndex( opt => opt.choice.value === val );
		if( index >= 0 ) this.#control.selectedIndex = index;
	}

	get disabled()      { return this.#control.disabled; }
	set disabled( val ) { this.#control.disabled = val; }

	refresh() {
		this.#initialValue = getInputValue( this.#input, this.#value );
		this.#control.value = this.#initialValue;
	}
	reset() {
		setValue( null, this.#input, this.#value, this.#initialValue, { number: true } );
		this.#control.value = this.#initialValue;
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

	addOption( choice ) {
		const option = document.createElement( "option" );
		if( "string" === typeof choice ) {
			option.text = choice;
			option.value = choice;
			choice = { text: choice, value: choice, type: {} };
		} else {
			option.text = choice.text;
			option.value = choice.value;
		}
		this.#options.push( { option, choice } );
		if( choice.value === this.#input[this.#value] ) {
			this.#control.selectedIndex = this.#control.options.length - 1;
		}
		this.#control.add( option );
	}
	setChoices( choices ) {
		this.#options.length = 0;
		this.#control.innerHTML = "";
		for( const choice of choices ) this.addOption( choice );
	}
}

registerControl( "makeChoiceInput", ChoiceInput );
