/**
 * @fileoverview Notice popup with Okay (and optional Cancel) buttons.
 */

import { Popup } from "../core/popup.js";
import { Button } from "../controls/button.js";
import { suffixed, joinSuffix } from "../core/suffix.js";

/**
 * @typedef {object} SimpleNoticeOptions
 * @property {HTMLElement|Popup} [parent]
 * @property {string}            [suffix]
 */

export class SimpleNotice extends Popup {
	textOutput = document.createElement( "SPAN" );

	/**
	 * @param {string}                       title
	 * @param {string}                       question
	 * @param {() => void}                   [ok]      Invoked on Okay or Escape.
	 * @param {() => void}                   [cancel]  If supplied, a Cancel button is shown.
	 * @param {SimpleNoticeOptions}          [opts]
	 */
	constructor( title, question, ok, cancel, opts ) {
		opts = opts || { parent: null, suffix: null };
		const metaOpts = Object.assign( {}, opts );
		metaOpts.suffix = ( metaOpts.suffix || "" ) + "-notice";
		super( title, opts.parent || null, metaOpts );

		const form = document.createElement( "form" );

		this.on( "show", () => { this.okay.button.focus(); } );
		this.on( "close", () => { cancel && cancel(); } );

		form.className = suffixed( "frameForm", joinSuffix( opts?.suffix, "notice" ) );
		form.setAttribute( "action", "none" );
		form.addEventListener( "submit", ( evt ) => { evt.preventDefault(); this.hide(); } );
		form.addEventListener( "reset",  ( evt ) => { evt.preventDefault(); this.hide(); } );

		this.textOutput.className = "noticeText" + ( opts?.suffix ? opts.suffix : "" ) + "-notice";
		this.textOutput.textContent = question;

		this.setMessage = ( msg ) => { this.textOutput.textContent = msg; };

		this.divFrame.addEventListener( "keydown", ( e ) => {
			if( e.keyCode == 27 ) {
				e.preventDefault();
				this.hide();
				ok && ok();
			}
		} );
		this.divContent.appendChild( form );
		form.appendChild( this.textOutput );
		form.appendChild( document.createElement( "br" ) );
		form.appendChild( document.createElement( "br" ) );

		this.okay = new Button( form, "Okay", () => { this.hide(); ok && ok(); } );
		this.okay.className += ( opts?.suffix ? opts.suffix : "" ) + " notice";
		this.okay.button.children[0].className += ( opts?.suffix ? opts.suffix : "" ) + " notice";

		if( cancel ) {
			const cbut = new Button( form, "Cancel", () => { this.hide(); cancel && cancel(); } );
			cbut.className += ( opts?.suffix ? opts.suffix : "" ) + " notice";
			cbut.button.children[0].className += ( opts?.suffix ? opts.suffix : "" ) + " notice";
		}

		this.center();
		this.hide();
	}

	/**
	 * @param {string} [caption]  Optional new caption.
	 * @param {string} [content]  Optional new body text (only used if caption is also provided).
	 */
	show( caption, content ) {
		if( caption && content ) {
			this.divCaption.textContent = caption;
			this.textOutput.textContent = content;
		} else if( caption ) {
			this.textContent = caption;
		}
		super.show();
	}

	/** @param {HTMLElement} e */
	appendChild( e ) {
		this.form.insertChild( e, this.okay );
	}
}

/**
 * @param {string} title
 * @param {string} question
 * @param {() => void} [ok]
 * @param {() => void} [cancel]
 * @param {SimpleNoticeOptions} [opts]
 * @returns {SimpleNotice}
 */
export function createSimpleNotice( title, question, ok, cancel, opts ) {
	return new SimpleNotice( title, question, ok, cancel, opts );
}
