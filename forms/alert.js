/**
 * @fileoverview Click-anywhere alert popup. Renders an overlay catcher behind
 * the popup so any click dismisses it (unless `noClick` is set).
 */

import { Popup } from "../core/popup.js";

/**
 * @typedef {object} AlertFormOptions
 * @property {string}        [suffix]
 * @property {boolean}       [noClick]   Disable dismiss-on-click.
 * @property {() => void}    [onClick]   Custom click handler invoked in addition to dismiss.
 */

export class AlertForm extends Popup {
	MsgDiv = document.createElement( "div" );
	catcher = document.createElement( "div" );

	/**
	 * @param {HTMLElement|Popup} [parent]
	 * @param {AlertFormOptions}  [opts]
	 */
	constructor( parent, opts ) {
		const suffix = ( opts?.suffix ? opts?.suffix : "" ) + "-alert";
		const catcher = document.createElement( "div" );
		catcher.classList.add( "alert-catcher" );
		const placer = document.createElement( "div" );
		placer.classList.add( "frameContainer" + suffix, "alert-form" );
		const content = document.createElement( "div" );
		content.classList.add( "frameContent" + suffix, "alert-content" );
		catcher.appendChild( placer );
		placer.appendChild( content );
		super( null, parent, { from: placer, suffix } );

		this.MsgDiv.className = "alert-message";
		this.MsgDiv.setAttribute( "tabIndex", 0 );
		content.appendChild( this.MsgDiv );
		this.catcher = catcher;
		this.MsgDiv.className += " alert-content";
		content.appendChild( this.MsgDiv );

		if( !opts || !opts.noClick ) {
			this.divFrame.addEventListener( "click", () => { this.hide(); } );
			this.catcher.addEventListener(  "click", () => { this.hide(); } );
		}
		if( opts && opts.onClick ) {
			this.divFrame.addEventListener( "click", () => { opts.onClick(); } );
			this.catcher.addEventListener(  "click", () => { opts.onClick(); } );
		}
		( parent || document.body ).appendChild( this.catcher );
	}

	remove() {
		super.remove();
		this.catcher.remove();
	}

	/** @param {string} [caption] */
	show( caption ) {
		if( "string" === typeof caption ) this.caption = caption;
		this.catcher.style.display = "";
		this.raise();
		super.show();
		this.divFrame.focus();
		this.center();
	}

	hide() {
		this.catcher.style.display = "none";
		this.divFrame.style.display = "none";
		this.on( "close", this );
	}

	/** @param {string} val */
	set caption( val ) {
		if( this.MsgDiv ) this.MsgDiv.innerHTML = val;
	}
}

/** @type {AlertForm|null} */
let alertForm = null;

/**
 * Show the singleton alert with the given message. Creates the AlertForm on
 * first use.
 * @param {string} msg
 * @returns {AlertForm}
 */
export function Alert( msg ) {
	if( !alertForm ) alertForm = new AlertForm();
	alertForm.caption = msg;
	alertForm.show();
	return alertForm;
}
