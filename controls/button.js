/**
 * @fileoverview Button control. Constructor:
 * `new Button(form, caption, onClick, options)`.
 * Also exports `handleButtonEvents` for callers that supply their own element.
 */

import { findEnclosingPopup } from "../core/popup-walk.js";
import { registerControl } from "../core/registry.js";
import { handleButtonEvents } from "../core/button-events.js";

// Re-export for existing imports `from "../controls/button.js"`.
export { handleButtonEvents };

/**
 * @typedef {object} ButtonOptions
 * @property {string} [suffix]
 */

export class Button {
	#button;
	#inner;
	/**
	 * @param {HTMLElement}   form     Container the button is appended to.
	 * @param {string}        caption
	 * @param {() => void}    onClick
	 * @param {ButtonOptions} [options]
	 */
	constructor( form, caption, onClick, options ) {
		const popup = findEnclosingPopup( form );
		const suffix = ( popup ? popup.suffix || "" : "" ) + ( options?.suffix || "" );

		const button = document.createElement( "button" );
		button.className = "button" + suffix;
		const inner = document.createElement( "div" );
		inner.className = "buttonInner" + suffix;
		inner.textContent = caption;
		button.buttonInner = inner;
		button.appendChild( inner );
		handleButtonEvents( button, onClick );
		form.appendChild( button );

		this.#button = button;
		this.#inner = inner;
	}

	get el()          { return this.#button; }
	get control()     { return this.#button; }
	get span()        { return this.#inner; }
	get button()      { return this.#button; }
	get buttonInner() { return this.#inner; }

	show()   { this.#button.style.display = ""; }
	hide()   { this.#button.style.display = "none"; }
	remove() { this.#button.remove(); }

	get className()      { return this.#button.className; }
	set className( val ) { this.#button.className = val; }
	get style()          { return this.#button.style; }

	set tooltip( val ) {
		const tooltip = document.createElement( "span" );
		tooltip.className = "tooltip-text";
		tooltip.textContent = val;
		this.#button.appendChild( tooltip );
		this.#button.classList.add( "has-tooltip" );
	}
}

registerControl( "makeButton", Button );
