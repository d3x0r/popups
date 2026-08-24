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
		suffix,
		cb: null,

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
			// Hovering another item closes any open submenu.
			item.addEventListener( "mouseover", () => {
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

			item.addEventListener( "mouseover", ( evt ) => {
				const r = item.getBoundingClientRect();
				sub.show( evt.clientX + 25, r.top - 10, menu.cb );
				menu.subOpen = sub;
			} );
			// No mouseout/timer dance — light-dismiss handles outside clicks,
			// hovering a sibling item closes us via the addItem handler above,
			// and ESC dismisses the whole chain. This matches OS menu UX.
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
