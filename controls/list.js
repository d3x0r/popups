/**
 * @fileoverview List / tree control. Already a class in the original; ported
 * with the same constructor signature:
 * `new List(parentDiv, parentList, toString, opens, opts)`.
 */

/**
 * @typedef {object} ListOptions
 * @property {string}                                     [suffix]
 * @property {boolean}                                    [setsContent]  toString() writes into the label element.
 * @property {(a:any, b:any) => number}                   [compare]      Custom sort when setsContent is true.
 * @property {boolean}                                    [opens]
 */

/**
 * @typedef {object} ListRow
 * @property {boolean}     opens
 * @property {any}         group
 * @property {HTMLElement} item
 * @property {List}        subItems
 * @property {HTMLElement} parent
 */

import { Events } from "../core/events.js";
import { findEnclosingPopup } from "../core/popup-walk.js";
import { suffixed, joinSuffix } from "../core/suffix.js";

export class List extends Events {
	selected = null;
	groups = [];
	itemOpens = false;
	opts = null;
	compare = ( a, b ) => 1;

	/**
	 * @param {HTMLElement|List}                  parentDiv
	 * @param {HTMLElement|null}                  parentList   Reuse this UL/DIV; pass null to create one.
	 * @param {(group:any, label?:HTMLElement)=>string|void} toString  Render a group as text (or fill a label if setsContent).
	 * @param {boolean}                           [opens]
	 * @param {ListOptions}                       [opts]
	 */
	constructor( parentDiv, parentList, toString, opens, opts ) {
		const popup = findEnclosingPopup( parentDiv );
		super();
		this.opts = opts || {};
		this.opts.suffix = joinSuffix( popup ? popup.suffix : "", this.opts.suffix );
		this.toString = toString;
		this.itemOpens = opens || false;

		if( !parentList ) {
			parentList = document.createElement( "div" );
			parentList.className = suffixed( "list-container", this.opts.suffix );
			parentDiv.appendChild( parentList );
		}
		this.divTable = parentList;
		this.parentList = parentList;
		if( opts && opts.compare ) this.compare = opts.compare;
	}

	push( group, toString_, opens ) {
		let nextItem = null;
		if( this.parentList ) {
			const itemList = this.parentList.childNodes;
			for( nextItem of itemList ) {
				if( !this.opts.setsContent ) {
					if( nextItem.textContent > this.toString( group ) ) break;
				} else {
					if( this.compare( nextItem.group, group ) ) break;
				}
				nextItem = null;
			}
		}
		const newLi = document.createElement( "LI" );
		newLi.className = suffixed( "listItem", this.opts.suffix );
		this.divTable.insertBefore( newLi, nextItem );
		newLi.addEventListener( "click", ( e ) => {
			e.preventDefault();
			if( this.selected ) this.selected.classList.remove( "selected" );
			newLi.classList.add( "selected" );
			this.selected = newLi;
			this.on( "select", group );
		} );

		const newSubList = document.createElement( "UL" );
		newSubList.className = suffixed( "listSubList", this.opts.suffix );
		if( this.parentList && this.parentList.parentItem )
			this.parentList.parentItem.enableOpen( this.parentList.thisItem );

		const treeLabel = document.createElement( "span" );
		treeLabel.className = suffixed( "listItemLabel", this.opts.suffix );
		newLi.appendChild( treeLabel );

		if( this.opts.setsContent ) {
			for( const child of treeLabel.childNodes ) child.remove();
			this.toString( treeLabel, group );
		} else {
			treeLabel.textContent = this.toString( group );
		}

		newLi.appendChild( newSubList );
		newLi.group = group;
		const subItems = new List( this, newSubList, toString_, true );
		const newRow = {
			opens: false,
			group,
			item: newLi,
			subItems,
			parent: this.parentList,
			set text( s ) { treeLabel.textContent = s; },
			hide()   { this.item.style.display = "none"; },
			show()   { this.item.style.display = ""; },
			remove() { this.item.remove(); },
		};
		this.groups.push( newRow );
		return newRow;
	}

	enableOpen( item ) {
		if( item.opens ) return;
		item.opens = true;
		const treeKnob = document.createElement( "span" );
		treeKnob.textContent = "-";
		treeKnob.className = suffixed( "list-item-knob", this.opts.suffix ) + " knobOpen";
		item.item.insertBefore( treeKnob, item.item.childNodes[0] );
		treeKnob.addEventListener( "click", ( e ) => {
			e.preventDefault();
			if( treeKnob.classList.contains( "knobClosed" ) ) {
				treeKnob.classList.remove( "knobClosed" );
				treeKnob.classList.add( "knobOpen" );
				treeKnob.textContent = "-";
				item.subItems.items.forEach( sub => { sub.item.style.display = ""; } );
			} else {
				treeKnob.classList.add( "knobClosed" );
				treeKnob.classList.remove( "knobOpen" );
				treeKnob.textContent = "+";
				item.subItems.items.forEach( sub => { sub.item.style.display = "none"; } );
			}
		} );
	}

	enableDrag( type, item, key1, item2, key2 ) {
		item.item.setAttribute( "draggable", true );
		item.item.addEventListener( "dragstart", ( evt ) => {
			if( item2 )
				evt.dataTransfer.setData( "text/" + type, item.group[key1] + "," + item2.group[key2] );
			else
				evt.dataTransfer.setData( "text/" + type, item.group[key1] );
			evt.dataTransfer.setData(
				"text/plain",
				evt.dataTransfer.getData( "text/plain" ) + JSON.stringify( {
					type, val1: item.group[key1], val2: item2 && item2.group[key2],
				} ),
			);
			if( item )  evt.dataTransfer.setData( "text/item",  item.group[key1] );
			if( item2 ) evt.dataTransfer.setData( "text/item2", item2.group[key2] );
		} );
	}

	enableDrop( type, item, cbDrop ) {
		item.item.addEventListener( "dragover", ( evt ) => {
			evt.preventDefault();
			evt.dataTransfer.dropEffect = "move";
		} );
		item.item.addEventListener( "drop", ( evt ) => {
			evt.preventDefault();
			const objType = evt.dataTransfer.getData( "text/plain" );
			if( "undefined" !== typeof JSOX ) {
				JSOX.begin( ( event ) => {
					if( type === event.type ) {
						console.log( "drop of:", evt.dataTransfer.getData( "text/plain" ) );
					}
				} ).write( objType );
			}
		} );
	}

	update( group ) {
		const item = this.groups.find( g => g.group === group );
		if( this.opts.setsContent ) {
			for( const child of item.item.childNodes ) child.remove();
			this.toString( item, group );
		} else {
			item.textContent = this.toString( group );
		}
	}

	get items() { return this.groups; }

	reset() {
		while( this.divTable.childNodes.length )
			this.divTable.childNodes[0].remove();
	}
}

/**
 * @param {HTMLElement|List}  parent
 * @param {HTMLElement|null}  parentList
 * @param {(group:any, label?:HTMLElement)=>string|void} toString
 * @param {boolean}           [opens]
 * @param {ListOptions}       [opts]
 * @returns {List}
 */
export function createList( parent, parentList, toString, opens, opts ) {
	return new List( parent, parentList, toString, opens, opts );
}

/**
 * Convenience constructor: creates a fresh UL inside `parent` and returns a
 * List bound to it.
 * @param {HTMLElement}                                  parent
 * @param {(group:any, label?:HTMLElement)=>string|void} toString
 * @param {ListOptions}                                  [opts]
 * @returns {List}
 */
export function makeList( parent, toString, opts ) {
	const newSubList = document.createElement( "UL" );
	newSubList.className = suffixed( "list", opts?.suffix );
	parent.appendChild( newSubList );
	return new List( newSubList, newSubList, toString, opts?.opens, opts );
}
