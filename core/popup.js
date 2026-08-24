/**
 * @fileoverview Popup — the core window class. Hosts a div-based draggable
 * frame by default. Pluggable hosts (e.g. <dialog>-backed modal) can be added
 * via opts.host later; the constructor branches on opts to keep the public
 * surface single-class.
 */

import { utils } from "./utils.js";
import { popupTracker, addCaptionHandler } from "./tracker.js";
import { suffixed } from "./suffix.js";

const localStorage = globalThis.localStorage;
/** @type {WeakMap<Element|ShadowRoot, Popup>} */
const popupMap = new WeakMap();

/**
 * Reverse lookup: given a frame element (or shadow root) return the Popup that
 * owns it. Used by controls to resolve their enclosing popup at construction.
 * @param {Element|ShadowRoot} el
 * @returns {Popup|undefined}
 */
export function getPopupFromElement( el ) {
	return popupMap.get( el );
}

/**
 * @typedef {object} PopupOptions
 * @property {string}       [suffix]       Appended to class names for theming variants.
 * @property {HTMLElement}  [from]         Adopt an existing element as the frame (skips creating one).
 * @property {boolean}      [contained]    Treat as embedded (formContainer) rather than free-floating (frameContainer).
 * @property {boolean}      [enableClose]  Show the close button.
 * @property {boolean}      [shadowFrame]  Wrap the frame in a shadow root.
 * @property {string}       [id]           Persist position to localStorage under this id.
 * @property {boolean}      [modal]        Render as a <dialog> in the top layer (showModal-backed). Drag is disabled.
 */

export class Popup {
	popupEvents = {
		close: [],
		show: [],
	};
	divContentParent_ = null;
	divShadow = null;
	divFrame_ = document.createElement( "div" );
	divCaption = document.createElement( "div" );
	divTitle = document.createElement( "span" );
	divContentParent_ = document.createElement( "div" );
	divContent_ = null;
	divClose = document.createElement( "div" );
	popup = this;
	useMouse = true;
	suffix = '';
	inFrame = false;
	/** True when the frame is a <dialog> opened via showModal(). */
	modal = false;

	set top( top ) {
		if( "number" === typeof top ) this.divFrame.style.top = ( top.toFixed( 2 ) + "vh" );
		else this.divFrame.style.top = top;
	}
	set left( left ) {
		if( "number" === typeof left ) this.divFrame.style.left = ( left.toFixed( 2 ) + "vw" );
		else this.divFrame.style.left = left;
	}
	set width( width ) {
		if( "number" === typeof width ) this.divFrame.style.width = ( width.toFixed( 2 ) + "vw" );
		else this.divFrame.style.width = width;
	}
	set height( left ) {
		if( "number" === typeof height ) this.divFrame.style.height = ( height.toFixed( 2 ) + "vh" );
		else this.divFrame.style.height = height;
	}

	get divContent() {
		return this.divContent_ || this.divContentParent_;
	}
	get divFrame() {
		return this.divFrameParent_ || this.divFrame_;
	}

	/**
	 * @param {string|null}                    caption_
	 * @param {HTMLElement|Popup|null}         [parent]   Parent element/popup (defaults to document.body).
	 * @param {PopupOptions}                   [opts]
	 */
	constructor( caption_, parent, opts ) {
		this.suffix = opts?.suffix || '';

		const forContent = opts?.from;
		if( forContent ) {
			this.divFrame_ = forContent;
			this.divContentParent_ = null;
			this.divCaption = null;
			this.divClose = null;
			this.divTitle = null;
		} else {
			this.inFrame = opts?.contained && ( parent && ( parent instanceof Popup ) );
			if( opts?.modal && !this.inFrame ) {
				// Replace the default div frame with a <dialog>. The default field
				// initializer already created a div; swap it out before anything
				// else references divFrame_.
				this.modal = true;
				this.divFrame_ = document.createElement( "dialog" );
				// Forward <dialog>'s native close event to our event system, so
				// existing `popup.on("close", ...)` handlers fire on showModal
				// dismissals (ESC, .close(), backdrop button forms).
				this.divFrame_.addEventListener( "close", () => {
					this.on( "hide", true );
					this.on( "close", true );
				} );
			}
			this.divFrame_.className = suffixed( this.inFrame ? "formContainer" : "frameContainer", this.suffix );
		}
		const closeButton = !this.inFrame && ( opts?.enableClose || opts?.modal || false );

		let useFrame = this.divFrame_;
		let fillFrame = this.divFrame_;
		if( opts && opts.shadowFrame ) {
			this.divShadow = document.createElement( "div" );
			this.divShadow.classRoot = "shadow-frame-container";
			this.divShadow.style.position = this.inFrame ? "absolute" : "relative";
			this.divShadow.style.left = "0px";
			this.divShadow.style.top = "0px";
			this.shadow = this.divShadow.attachShadow( { mode: "open" } );

			utils.preAddPopupStyles( this.shadow, import.meta.url );
			this.shadow.appendChild( this.divFrame );
			fillFrame = this.divFrame;
		}
		if( opts?.id ) useFrame.id = opts.id;

		// Skip explicit positioning for modal <dialog>s — the browser centers
		// them in the top layer, and setting left/top fights that. The position
		// persistence for non-modal popups (per opts.id) only makes sense for
		// draggable frames anyway.
		if( !this.modal ) {
			if( useFrame.id ) {
				useFrame.style.left = localStorage.getItem( useFrame.id + "/x" );
				useFrame.style.top  = localStorage.getItem( useFrame.id + "/y" );
			} else {
				useFrame.style.left = 0;
				useFrame.style.top  = 0;
			}
		}
		if( this.divCaption ) {
			if( caption_ && caption_ != "" ) {
				fillFrame.appendChild( this.divCaption );
				this.divCaption.appendChild( this.divTitle );
				if( closeButton && this.divClose )
					this.divCaption.appendChild( this.divClose );
			}
			this.divCaption.className = suffixed( this.inFrame ? "formCaption" : "frameCaption", this.suffix );
			if( !this.inFrame && !this.modal )
				addCaptionHandler( this.divCaption, this );
		}
		if( this.divContent ) {
			this.divContent.className = suffixed( this.inFrame ? "formContent" : "frameContent", this.suffix );
			fillFrame.appendChild( this.divContent );
		}

		if( this.divClose ) {
			this.divClose.className = suffixed( "captionButton", this.suffix ) + " " + suffixed( "closeButton", this.suffix );
			this.divClose.addEventListener( "click", () => {
				this.hide();
				this.on( "captionClose", true );
			} );
		}

		// Modal <dialog>s live in the top layer; z-order tracking is meaningless
		// for them. Skip the tracker (which would otherwise install popup.raise
		// and add the frame to the z-index shuffle).
		if( this.modal ) {
			this.raise = function() {};
		} else {
			popupTracker.addPopup( this );
		}
		if( this.divShadow ) popupMap.set( this.shadow, this );
		else                 popupMap.set( this.divFrame, this );

		this.caption = caption_;
		parent = ( parent && parent.divContent ) || parent || document.body;

		if( !forContent )
			if( this.divShadow ) parent.appendChild( this.divShadow );
			else                 parent.appendChild( useFrame );
	}

	set caption( val ) {
		if( this.divTitle )
			this.divTitle.textContent = val;
	}
	center() {
		if( this.inFrame ) return;
		const df = this.divFrame;
		const myRect = df.getBoundingClientRect();
		if( this.divShadow ) {
			if( window.innerWidth - myRect.width > 0 )
				this.divShadow.style.left = ( ( window.innerWidth - myRect.width ) / 2 ) + "px";
			else this.divShadow.style.left = 0;
			if( window.innerHeight - myRect.height > 0 )
				this.divShadow.style.top = ( ( window.innerHeight - myRect.height ) / 2 ) + "px";
			else this.divShadow.style.top = 0;
		} else {
			if( window.innerWidth - myRect.width > 0 )
				this.divFrame.style.left = ( ( window.innerWidth - myRect.width ) / 2 ) + "px";
			else this.divFrame.style.left = 0;
			if( window.innerHeight - myRect.height > 0 )
				this.divFrame.style.top = ( ( window.innerHeight - myRect.height ) / 2 ) + "px";
			else this.divFrame.style.top = 0;
		}
	}
	over( e ) {
		const target = e.getBoundingClientRect();
		this.divFrame.style.left = target.left;
		this.divFrame.style.top  = target.top;
	}
	on( event, cb ) {
		if( cb && "function" === typeof cb )
			if( this.popupEvents[event] )
				this.popupEvents[event].push( cb );
			else
				this.popupEvents[event] = [cb];
		else {
			const cbList = this.popupEvents[event];
			if( cbList ) cbList.forEach( cbEvent => cbEvent( cb ) );
		}
	}
	reset()   { this.on( "reset",   true ); }
	refresh() { this.on( "refresh", true ); }
	reject()  { this.on( "reject",  true ); }
	accept()  { this.on( "accept",  true ); }
	hide() {
		if( this.modal ) {
			// Route through the native close() — our `close` listener (wired in
			// the constructor) fires both "hide" and "close" for consistency.
			if( this.divFrame.open ) this.divFrame.close();
			else                     this.on( "hide", true );
			return;
		}
		this.divFrame.style.display = "none";
		this.on( "hide", true );
	}
	show() {
		if( this.modal ) {
			// Top layer handles ordering; no popupTracker.raise needed.
			if( !this.divFrame.open ) this.divFrame.showModal();
			this.on( "show", true );
			return;
		}
		this.raise();
		this.divFrame.style.display = "";
		this.on( "show", true );
	}
	move( x, y ) {
		this.divFrame.style.left = x + "vw";
		this.divFrame.style.top  = y + "vh";
	}
	appendChild( e ) {
		return ( this.divContent || this.divFrame ).appendChild( e );
	}
	remove() {
		this.divFrame.remove();
	}
}

/**
 * Factory wrapper for `new Popup(...)`.
 * @param {string|null}                    caption
 * @param {HTMLElement|Popup|null}         [parent]
 * @param {PopupOptions}                   [opts]
 * @returns {Popup}
 */
export function createPopup( caption, parent, opts ) {
	return new Popup( caption, parent, opts );
}
