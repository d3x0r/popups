/**
 * @fileoverview Popover-API-backed popup menu. Replaces the legacy
 * mouseCatcher z-index hack: each menu container is a `<div popover="...">`
 * in the browser's top layer with native light-dismiss and ESC handling.
 *
 * Submenus are DOM-nested inside their parent's container (even though
 * visually positioned elsewhere via fixed positioning). The popover stack
 * treats a child popover as belonging to its DOM-ancestor popover, so opening
 * a submenu does not close its parent — and clicking outside dismisses the
 * whole chain at once.
 *
 * Requires Popover API support (Chrome/Edge 114+, Firefox 125+, Safari 17+).
 *
 * Standalone factory: `popups.createMenu({...})`. Not registered as a
 * makeXxx control since menus aren't form-bound.
 */

import { suffixed } from "../core/suffix.js";

/* Gap between a parent menu and its submenu, and how far the submenu is lifted
   so the hovered item lines up with the submenu's first row. */
const SUB_GAP = 2;
const SUB_LIFT = 10;
/* Hover dwell before a submenu opens.  Without it, sweeping down a column of
   items strobes their submenus open and shut on the way past. */
const SUB_DELAY = 250;

/**
 * @typedef {object} PopupMenuOptions
 * @property {string}  [suffix]
 * @property {boolean} [keepOpen]  Use `popover="manual"` — no light-dismiss.
 *                                 Caller must invoke hide() explicitly.
 */

/**
 * @typedef {object} PopupMenu
 * @property {HTMLElement}                                    container
 * @property {(text:string, cb:()=>void)=>void}               addItem
 * @property {(text:string)=>PopupMenu}                       addMenu     Add a submenu (hover to open).
 * @property {() => void}                                     separate    Insert a separator.
 * @property {(x:number, y:number, cb?:(arg:any)=>void)=>void} show
 * @property {(all?:boolean)=>void}                            hide        If `all`, cascade-close up to root.
 * @property {() => void}                                      reset       Clear all entries.
 */

/**
 * @param {PopupMenuOptions} [opts]
 * @returns {PopupMenu}
 */
export function createPopupMenu( opts ) {
	const suffix = opts?.suffix || '';
	const keepOpen = opts?.keepOpen || false;

	const container = document.createElement( "div" );
	container.className = suffixed( "popup-menu", suffix );
	container.setAttribute( "popover", keepOpen ? "manual" : "auto" );
	// Positioned in JS via show(x,y); fixed so it floats wherever placed.
	container.style.position = "fixed";

	// Suppress right-click default menu on the popup itself.
	container.addEventListener( "contextmenu", ( evt ) => {
		evt.preventDefault();
		evt.stopPropagation();
	} );

	// Detached at first; show() puts it in the DOM. For root menus that's body,
	// for submenus that's the parent's container (set by addMenu below).
	document.body.appendChild( container );

	const menu = /** @type {PopupMenu & { parent: PopupMenu|null, subOpen: PopupMenu|null, items: PopupMenu[], cb: any, keepOpen: boolean, suffix: string }} */ ( {
		container,
		items: [],
		keepOpen,
		parent: null,
		subOpen: null,
		pending: 0,
		suffix,
		cb: null,

		/** Drop a submenu that was scheduled but has not opened yet. */
		cancelPending() {
			if( menu.pending ) { clearTimeout( menu.pending ); menu.pending = 0; }
		},

		separate() {
			const sep = document.createElement( "HR" );
			sep.className = suffixed( "popup-item-sep", suffix );
			container.appendChild( sep );
		},

		addItem( text, cb ) {
			const item = document.createElement( "A" );
			item.textContent = text;
			item.className = suffixed( "popup-item", suffix );
			container.appendChild( item );
			container.appendChild( document.createElement( "BR" ) );

			item.addEventListener( "click", () => {
				cb();
				if( !menu.keepOpen ) menu.hide( true );
			} );
			// Hovering another item closes any open submenu, and abandons one
			// that was only scheduled.
			item.addEventListener( "mouseover", () => {
				menu.cancelPending();
				if( menu.subOpen ) {
					menu.subOpen.hide();
					menu.subOpen = null;
				}
			} );
		},

		addMenu( text ) {
			const item = document.createElement( "A" );
			item.className = suffixed( "popup-item-menu", suffix );
			item.textContent = text;
			container.appendChild( item );
			container.appendChild( document.createElement( "BR" ) );

			const sub = createPopupMenu( { suffix } );
			sub.parent = menu;
			menu.items.push( sub );
			// Reparent into ours so the popover stack treats it as nested.
			container.appendChild( sub.container );

			/*
			 * Position from the PARENT's edge, not the pointer.
			 *
			 * The pointer has to be inside the item for this to fire at all, so
			 * evt.clientX is always within the parent -- opening at clientX+25
			 * put the submenu on top of its own parent, by an amount that
			 * depended on where the pointer happened to cross in (measured: 123px
			 * of overlap entering at the left edge, 0 entering at the right).
			 * At the third level it is always the bad case, because you arrive
			 * having moved rightward into the second menu from its left side.
			 *
			 * The vertical was already item-relative, which is why it always
			 * looked right.  So the pointer is not needed here at all.
			 */
			const open = () => {
				const pr = container.getBoundingClientRect();
				const ir = item.getBoundingClientRect();
				sub.show( pr.right + SUB_GAP, ir.top - SUB_LIFT, menu.cb );

				// Now that it is laid out, fold it back inside the viewport.
				const sr = sub.container.getBoundingClientRect();
				if( sr.right > window.innerWidth )
					sub.container.style.left =
						Math.max( 0, pr.left - sr.width - SUB_GAP ) + "px";
				if( sr.bottom > window.innerHeight )
					sub.container.style.top =
						Math.max( 0, window.innerHeight - sr.height ) + "px";

				menu.pending = 0;
				menu.subOpen = sub;
			};

			item.addEventListener( "mouseover", () => {
				menu.cancelPending();
				if( menu.subOpen === sub ) return;          // already showing
				if( menu.subOpen ) {
					menu.subOpen.hide();
					menu.subOpen = null;
				}
				menu.pending = setTimeout( open, SUB_DELAY );
			} );
			// Leaving before the dwell elapses abandons the open; once shown,
			// light-dismiss handles outside clicks, hovering a sibling closes us
			// via the addItem handler above, and ESC dismisses the whole chain.
			item.addEventListener( "mouseout", () => menu.cancelPending() );
			return sub;
		},

		show( x, y, cb ) {
			if( menu.parent ) menu.parent.subOpen = menu;
			menu.cb = cb;
			container.style.left = x + "px";
			container.style.top = y + "px";
			if( !container.matches( ":popover-open" ) ) {
				container.showPopover();
			}
		},

		hide( all ) {
			menu.cancelPending();
			// Cascade DOWN to subOpen without forwarding the `all` flag — that
			// flag is for cascading UP and would otherwise bounce back through
			// our parent and trigger infinite recursion.
			if( menu.subOpen ) {
				menu.subOpen.hide();
				menu.subOpen = null;
			}
			if( container.matches( ":popover-open" ) ) {
				container.hidePopover();
			}
			if( all && menu.parent ) menu.parent.hide( all );
		},

		reset() {
			menu.hide( true );
			while( container.firstChild ) container.firstChild.remove();
			menu.items.length = 0;
			menu.subOpen = null;
		},
	} );

	return menu;
}
