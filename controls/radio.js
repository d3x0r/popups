/**
 * @fileoverview Radio choice. Constructor:
 * `new RadioChoice(form, o, field, text, groupName, left?)`. Registers both
 * makeRadioChoice and makeLeftRadioChoice.
 */

import { findEnclosingPopup } from "../core/popup-walk.js";
import { registerControl } from "../core/registry.js";
import { setValue, getInputValue } from "../core/value-binding.js";
import { strings } from "../core/strings.js";

export class RadioChoice {
	#o;
	#field;
	#text;
	#initialValue;
	#binder;
	#input;
	#label;
	#onChange = [];

	/**
	 * @param {HTMLElement} form
	 * @param {object}      o
	 * @param {string}      field
	 * @param {string}      text       Label.
	 * @param {string}      groupName  Radio group `name` attribute.
	 * @param {boolean}     [left]     If true, label is placed to the right of the radio.
	 */
	constructor( form, o, field, text, groupName, left ) {
		this.#o = o;
		this.#field = field;
		this.#text = text;

		findEnclosingPopup( form ); // matches original; result unused except suffix below
		this.#initialValue = getInputValue( o, field );
		const popup = findEnclosingPopup( form );
		const suffix = ( popup ? popup.suffix : '' ); // original only used form-instanceof check

		const label = document.createElement( "SPAN" );
		label.className = "radio-text" + suffix + ( left ? " rightJustify" : "" );
		label.textContent = text;

		const option = document.createElement( "INPUT" );
		option.setAttribute( "type", "radio" );
		option.setAttribute( "name", groupName );
		option.className = "radioOption" + suffix + ( left ? "" : " rightJustify" );
		option.checked = getInputValue( o, field );

		const binder = document.createElement( "div" );
		binder.className = "fieldUnit" + suffix;
		binder.addEventListener( "click", ( e ) => {
			if( e.target === option ) return;
			e.preventDefault();
			if( !option.checked ) {
				option.checked = !option.checked;
				setValue( null, o, field, option.checked, null );
			}
		} );
		binder.addEventListener( "change", () => {
			setValue( null, o, field, option.checked, null );
		} );
		form.appendChild( binder );
		if( left ) {
			binder.appendChild( option );
			binder.appendChild( label );
		} else {
			binder.appendChild( label );
			binder.appendChild( option );
		}

		this.#binder = binder;
		this.#input = option;
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
	get value()        { return this.#input.checked; }
	set value( val ) {
		// NOTE: preserved upstream bug — uses option.checked instead of val.
		setValue( null, this.#o, this.#field, this.#input.checked );
		this.#input.checked = val;
		this.#onChange.forEach( cb => cb() );
	}

	reset() {
		// NOTE: original referenced `col.type` which was undefined; preserved as null.
		setValue( null, this.#o, this.#field, this.#initialValue, null );
		this.#input.checked = this.#initialValue;
	}
	changes() {
		if( this.#o[this.#field] !== this.#initialValue ) {
			return this.#text
				+ strings.get( " changed from " )
				+ this.#initialValue
				+ strings.get( " to " )
				+ getInputValue( this.#o, this.#field );
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

export class LeftRadioChoice extends RadioChoice {
	constructor( form, o, field, text, groupName ) {
		super( form, o, field, text, groupName, true );
	}
}

registerControl( "makeRadioChoice", RadioChoice );
registerControl( "makeLeftRadioChoice", LeftRadioChoice );
