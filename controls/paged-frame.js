/**
 * @fileoverview Generic paged frame — tab-style container with handles
 * (clickable tabs) and pages. Supports nesting (a page can itself host pages).
 * Bundles PagedFrame, PageFramePages, and PageFramePage.
 */

import { Events } from "../core/events.js";
import { fillFromURL } from "../core/fill-from-url.js";
import { suffixed, joinSuffix } from "../core/suffix.js";

/**
 * @typedef {object} PagedFrameOptions
 * @property {boolean} [top]    Place handles along the top (default is side).
 * @property {string}  [suffix]
 * @property {{title:string,url?:string}[]} [pages] Pages to create at construction.
 */

export class PageFramePage {
	content = document.createElement( 'div' );
	handle = document.createElement( 'div' );
	/** @type {PageFramePages|null} */
	pages = null;
	/** @type {PagedFrame|null} */
	#frame = null;
	/** @type {PageFramePage|null} */
	#page = null;
	hidden = false;

	/** @param {PagedFrame | PageFramePage} frame */
	constructor( frame ) {
		if( frame instanceof PagedFrame ) {
			this.#frame = frame;
			this.content.className = suffixed( 'page-frame-page-container', frame.suffix );
			this.handle.className  = suffixed( 'page-frame-page-handle', frame.suffix );
			frame.pages.handleContainer.appendChild( this.handle );
			frame.pages.pageContainer.appendChild( this.content );
			this.handle.addEventListener( "click", () => { this.#frame.activate( this ); } );
			this.content.style.display = "none";
			frame.pages.push( this );
		} else {
			this.#page = frame;
			this.content.className = suffixed( 'page-frame-page-page-container', frame.suffix );
			this.handle.className  = suffixed( 'page-frame-page-page-handle', frame.suffix );
			frame.pages.handleContainer.appendChild( this.handle );
			frame.pages.pageContainer.appendChild( this.content );
			this.handle.addEventListener( "click", ( evt ) => {
				if( this.#page && this.#page.pages.lastPage )
					this.#page.pages.lastPage.deactivate();
				if( this.handle.classList.contains( "pressed" ) ) this.deactivate();
				else                                              this.activate();
				evt.stopPropagation();
			} );
			this.content.style.display = "none";
			frame.pages.push( this );
		}
	}

	/** @param {string} val */
	set tooltip( val ) {
		const tooltip = document.createElement( "span" );
		tooltip.className = "tooltip-text";
		tooltip.textContent = val;
		this.handle.appendChild( tooltip );
		this.handle.classList.add( "has-tooltip" );
	}

	reset() {
		if( this.pages ) for( const page of this.pages ) page.remove();
	}

	remove() {
		this.content.remove();
		this.handle.remove();
		if( this.#page ) {
			const id = this.#page.pages.find( page => page === this );
			if( id >= 0 ) this.#page.pages.splice( id, 1 );
		}
		if( this.#frame ) {
			const id = this.#frame.pages.find( page => page === this );
			if( id >= 0 ) this.#frame.pages.splice( id, 1 );
		}
	}

	hide() {
		this.content.style.display = "none";
		this.handle.style.display  = "none";
		this.hidden = true;
	}
	show() {
		this.content.style.display = "";
		this.handle.style.display  = "";
		this.hidden = false;
	}

	/** @param {string} type @param {() => any} cbData */
	enableDrag( type, cbData ) {
		this.handle.setAttribute( "draggable", true );
		this.handle.addEventListener( "dragstart", ( evt ) => {
			this.handle.classList.add( "drag-over" );
			evt.dataTransfer.setData( "text/plain", JSON.stringify( { type, data: cbData() } ) );
		} );
	}

	/** @param {string} type @param {(payload:{data:any,x:number,y:number,h:number,w:number,evt:DragEvent}) => void} cbDrop */
	enableDrop( type, cbDrop ) {
		this.handle.addEventListener( "dragover", ( evt ) => {
			evt.preventDefault();
			evt.dataTransfer.dropEffect = "move";
			this.handle.classList.add( "drag-over" );
		} );
		this.handle.addEventListener( "dragleave", ( evt ) => {
			evt.preventDefault();
			this.handle.classList.remove( "drag-over" );
		} );
		this.handle.addEventListener( "drop", ( evt ) => {
			evt.preventDefault();
			const event = JSON.parse( evt.dataTransfer.getData( "text/plain" ) );
			if( type === event.type ) {
				const dropIn = this.handle.getBoundingClientRect();
				cbDrop( {
					data: event.data,
					x: evt.clientX - dropIn.x, y: evt.clientY - dropIn.y,
					h: dropIn.height, w: dropIn.width,
					evt,
				} );
			}
			this.handle.classList.remove( "drag-over" );
		} );
	}

	/** @param {PageFramePage} page */
	insertBeforePage( page ) {
		this.handle.remove();
		this.handle.insertBefore( page.handle );
	}

	/** @param {PageFramePage} page */
	activatePage( page ) {
		if( this.pages.lastPage ) this.pages.lastPage.deactivate();
		this.pages.lastPage = page.activate();
	}

	activate() {
		this.handle.classList.add( "pressed" );
		this.content.style.display = "";
		if( this.pages ) this.pages.handleContainer.style.display = "";
		if( this.#page && this.#page.pages ) {
			this.#page.pages.lastPage = this;
			this.frame.on( "activate", this );
		}
		if( this.#frame ) this.#frame.on( "activate", this );
		return this;
	}

	deactivate() {
		this.handle.classList.remove( "pressed" );
		this.content.style.display = "none";
		if( this.#page && this.#page.pages ) this.#page.pages.lastPage = null;
		if( this.pages ) this.pages.handleContainer.style.display = "none";
		this.frame.on( "deactivate", this );
	}

	get frame() {
		if( this.#frame ) return this.#frame;
		return this.#page.frame;
	}

	/** @param {string} text */
	set textContent( text ) { this.handle.textContent = text; }

	/** @param {HTMLElement} el */
	appendChild( el ) { this.content.appendChild( el ); }

	/** @param {PageFramePage} pf */
	removePage( pf ) { pf.remove(); }

	/** @param {string} title @param {string} [url] */
	addPage( title, url ) {
		if( !this.pages ) {
			if( this.#frame ) this.pages = new PageFramePages( this, this.#frame.suffix );
			else              this.pages = new PageFramePages( this, this.frame.suffix );
			this.pages.handleContainer.style.display = "none";
		}
		const pf = new PageFramePage( this );
		pf.textContent = title;
		if( url ) fillFromURL( pf.content, url );
		return pf;
	}

	on( a, b ) { this.frame.on( a, b ); }
}

export class PageFramePages extends Array {
	handleContainer = document.createElement( 'div' );
	pageContainer   = document.createElement( 'div' );
	#frame = null;
	#page = null;

	/** @param {PagedFrame | PageFramePage} frame @param {string} suffix */
	constructor( frame, suffix ) {
		super();
		if( frame instanceof PagedFrame ) {
			this.#frame = frame;
			this.handleContainer.className = suffixed( 'page-frame-handle-container', suffix );
			this.pageContainer.className   = suffixed( 'page-frame-page-frame', suffix );
			frame.frame.appendChild( this.handleContainer );
			frame.frame.appendChild( this.pageContainer );
		} else if( frame instanceof PageFramePage ) {
			this.#page = frame;
			this.handleContainer.className = suffixed( 'page-frame-page-handle-container', suffix );
			this.pageContainer.className   = suffixed( 'page-frame-page-page-frame', suffix );
			frame.handle.appendChild( this.handleContainer );
			frame.content.appendChild( this.pageContainer );
		}
	}

	remove() {
		this.handleContainer.remove();
		this.pageContainer.remove();
	}
}

export class PagedFrame extends Events {
	frame = document.createElement( 'div' );
	/** @type {PageFramePages|null} */
	pages = null;
	/** @type {PageFramePage|null} */
	lastPage = null;
	#oldPage = null;
	suffix = '';

	/**
	 * @param {HTMLElement} parent
	 * @param {PagedFrameOptions} [opts]
	 */
	constructor( parent, opts ) {
		super();
		opts = opts || {};
		const alignTop = opts.top;
		const pageDefs = opts.pages;

		this.suffix = joinSuffix( alignTop ? "top" : "", opts?.suffix );
		this.frame.className = suffixed( 'page-frame', this.suffix );
		this.pages = new PageFramePages( this, this.suffix );

		if( pageDefs ) for( const pageDef of pageDefs ) this.addPage( pageDef.title, pageDef.url );
		if( this.pages.length ) this.activate( this.pages[0] );
		parent.appendChild( this.frame );
	}

	empty() {
		this.pages.forEach( page => { page.remove(); } );
		this.pages.length = 0;
		this.lastPage = null;
		this.#oldPage = null;
	}

	/** @param {string} title @param {string} [url] */
	addPage( title, url ) {
		const pf = new PageFramePage( this );
		pf.textContent = title;
		if( url ) fillFromURL( pf.content, url );
		return pf;
	}

	/** @param {PageFramePage} page */
	activate( page ) {
		if( this.#oldPage ) this.#oldPage.deactivate();
		this.#oldPage = page.activate();
	}
}
