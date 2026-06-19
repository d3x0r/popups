/**
 * @fileoverview Editable data grid. Bundles DataGrid (the table widget),
 * DataGridRow, and DataGridCell + its (currently empty) subclasses. Bound to
 * an array field on a parent object; supports sort/move/delete and a sentinel
 * "new row" at the bottom that materializes a row when the user starts typing.
 */

import { Events } from "../core/events.js";
import { findEnclosingPopup } from "../core/popup-walk.js";
import { setValue, getInputValue, convertValue } from "../core/value-binding.js";
import { utils } from "../core/utils.js";
import { Button } from "./button.js";

/**
 * @typedef {object} DataGridColumnType
 * @property {boolean}  [edit]      Cell editable; defaults true.
 * @property {boolean}  [money]     Render as currency.
 * @property {boolean}  [percent]   Render as percent.
 * @property {boolean}  [number]    Render as a Number.
 * @property {boolean}  [noSort]    Skip the sort indicator.
 * @property {Array<{value:any,name:string,text?:string,className?:string}>} [options]  Dropdown choices.
 * @property {(row:DataGridRow)=>void} [click]   Button cell click handler.
 * @property {(rowData:any)=>string}   [toString] Custom display formatter (read-only).
 * @property {{ fill:(cell:DataGridCell)=>void, refresh?:(cell:DataGridCell)=>void, create?:(cell:DataGridCell)=>void, sort?:(a:DataGridRow,b:DataGridRow)=>number }} [custom]
 * @property {{ columns: DataGridColumn[], onNewRow?:(initial:any)=>any, newRow?:(row:any)=>void, change?:(row:any)=>void, field?:string }} [grid]  Nested grid.
 * @property {(rowData:any, cells:DataGridCell[])=>void} [change]  Fires when a cell value changes.
 * @property {string}  [text]      Default button caption.
 * @property {string}  [suffix]
 */

/**
 * @typedef {object} DataGridColumn
 * @property {string}              name        Header text.
 * @property {string}              [field]     Path on row data to read/write.
 * @property {string}              [className]
 * @property {DataGridColumnType}  [type]
 */

/**
 * @typedef {object} DataGridOptions
 * @property {DataGridColumn[]}    [columns]
 * @property {string}              [suffix]
 * @property {boolean}             [edit]      If false, suppress the trailing new-row.
 * @property {boolean}             [noSort]
 * @property {(initial:any)=>any}  [onNewRow]  Returns the new row data when the sentinel row is activated.
 * @property {() => void}          [onCancel]
 */

export class DataGridCell {
	#cell = null;
	#row = null;
	/** @type {((newRowData:any)=>void)|null} */
	clearNewRow = null;
	/** @type {HTMLTableCellElement|null} */
	el = null;

	/**
	 * @param {DataGridRow} row
	 * @param {DataGridColumn} cell
	 */
	constructor( row, cell ) {
		this.#cell = cell;
		this.#row = row;
		this.canEdit = ( cell.type && "edit" in cell.type ) ? cell.type.edit : true;
		this.el = row.el.insertCell();
		this.list = null;
		this.filled = false;
		this.options = [];
		this.el.className = row.suffix + cell.className;
		if( cell?.type?.custom ) {
			cell.type.custom.fill( this );
		}
	}

	get row()      { return this.#row; }
	set row( val ) { this.#row = val; }
	get cell()     { return this.#cell; }

	/** @param {HTMLElement} el */
	appendChild( el ) { this.el.appendChild( el ); }

	get value() {
		// NOTE: original is missing a `return`; preserved.
		getInputValue( this.#row.rowData, this.#cell.field );
	}

	refresh() {
		const rowData = this.#row.rowData;
		if( !rowData ) return;
		if( this.#cell.type && this.#cell.type.grid ) return this.list.refresh();
		if( this.#cell.type && this.#cell.type.hasOwnProperty( "toString" ) ) {
			this.el.textContent = this.#cell.type.toString( rowData );
		} else if( this.#cell.type && this.#cell.type.custom ) {
			if( "refresh" in this.#cell.type.custom )
				this.#cell.type.custom.refresh( this );
		} else if( this.#cell.type && this.#cell.type.options ) {
			const val = getInputValue( rowData, this.cell.field );
			const optidx = this.options.findIndex( op => op.val.value === val );
			this.list.selectedIndex = optidx;
			const i = this.list.selectedIndex;
			if( i >= 0 ) {
				if( this.options[i].val.className )
					this.list.className = this.options[i].val.className;
			}
		} else if( this.#cell.type && this.#cell.type.money ) {
			this.el.textContent = utils.to$( getInputValue( rowData, this.#cell.field ) );
		} else if( this.#cell.type && this.#cell.type.percent ) {
			this.el.textContent = utils.toP( getInputValue( rowData, this.#cell.field ) );
		} else {
			this.el.textContent = getInputValue( rowData, this.#cell.field );
		}
	}
}

// Subclass placeholders (kept for instanceof checks elsewhere; original
// had no body for any of them).
export class DataGridTableCell  extends DataGridCell {}
export class DataGridTextCell   extends DataGridCell {}
export class DataGridCheckCell  extends DataGridCell {}
export class DataGridChoiceCell extends DataGridCell {}

export class DataGridRow {
	rowData = null;
	/** @type {HTMLTableRowElement|null} */
	el = null;
	addUpdates = null;
	/** @type {DataGridCell[]} */
	cells = [];
	#dataGrid = null;
	initialValues = null;
	newInput = {};

	/**
	 * @param {DataGrid} grid
	 * @param {any} threshold     The bound row data (or null for the sentinel "new row").
	 * @param {HTMLTableRowElement} newRow
	 * @param {any} initialValues Shallow snapshot for reset support.
	 */
	constructor( grid, threshold, newRow, initialValues ) {
		this.#dataGrid = grid;
		this.el = newRow;
		this.rowData = threshold;
		this.initialValues = initialValues;
	}

	get grid()   { return this.#dataGrid; }
	get suffix() { return this.#dataGrid.suffix; }

	remove() { this.el.remove(); }

	refresh() {
		this.cells.forEach( cell => { if( !cell.canEdit ) cell.refresh(); } );
	}
}

export class DataGrid extends Events {
	#initialValue = undefined;
	#initialValues = undefined;
	#suffix = '';
	#obj = null;
	#field = null;
	#table = null;
	#tableContainer = null;
	#header = null;
	#opts = null;
	#cells = [];
	#rows = [];
	#newRowIndex = 0;
	#subFields = null;
	#newRowCallback = ( () => ( {} ) );
	#sort = { prior: null };

	get el()      { return this.#tableContainer; }
	get control() { return this.#table; }
	get span()    { return null; }
	get rows()    { return this.#rows; }
	get suffix()  { return this.#suffix; }

	set tooltip( val ) {
		const tooltip = document.createElement( "span" );
		tooltip.className = "tooltip-text";
		tooltip.textContent = val;
		this.#tableContainer.appendChild( tooltip );
		this.#tableContainer.classList.add( "has-tooltip" );
	}

	hide() { this.#tableContainer.style.display = "none"; }
	show() { this.#tableContainer.style.display = ""; }

	/**
	 * @param {HTMLElement} form
	 * @param {object}      o      Object containing the array field.
	 * @param {string}      field  Name of the bound array field on `o`.
	 * @param {DataGridOptions} [opts]
	 */
	constructor( form, o, field, opts ) {
		super();
		const popup = findEnclosingPopup( form );

		this.#field = field;
		this.#opts = opts || {};
		this.#subFields = ( opts?.columns ) || [];
		this.#obj = o;
		const cancel = opts?.onCancel;

		const currentValue = getInputValue( o, field );
		this.#initialValue = currentValue ? currentValue.map( o => o ) : [];
		this.#initialValues = currentValue ? currentValue.map( ( o ) => {
			const obj = {};
			this.#subFields.forEach( col => {
				if( col.field )
					setValue( null, obj, col.field, getInputValue( o, col.field ), {} );
			} );
			return obj;
		} ) : [];

		this.#suffix = opts?.suffix || '';
		if( opts?.onNewRow ) this.#newRowCallback = opts.onNewRow;

		if( popup ) {
			popup.on( "apply",  () => {} );
			popup.on( "show",   () => {} );
			popup.on( "close",  () => { cancel && cancel(); } );
			popup.on( "cancel", () => { cancel && cancel(); } );
		}

		this.#tableContainer = document.createElement( "div" );
		this.#tableContainer.className = "data-grid-container" + this.#suffix;

		this.#table = document.createElement( "table" );
		this.#table.className = "data-grid-table" + this.#suffix;

		this.#header = this.#table.insertRow();
		this.#header.className = "data-grid-header-row" + this.#suffix;

		form.appendChild( this.#tableContainer );
		this.#tableContainer.appendChild( this.#table );

		this.#subFields.forEach( col => {
			if( col.type && col.type.grid ) col.type.noSort = true;
			this.addColumn( col.name, col.field, col.className, col.type );
		} );

		this.fill();
	}

	reinit() {
		const o = this.#obj;
		const field = this.#field;
		this.#initialValue = getInputValue( o, field ).map( o => o );
		this.#initialValues = getInputValue( o, field ).map( ( o ) => {
			const obj = {};
			this.#subFields.forEach( col => {
				if( col.field )
					setValue( null, obj, col.field, getInputValue( o, col.field ), col.type );
			} );
			return obj;
		} );
		this.fill();
	}

	/**
	 * Restore one row (or the entire grid) to the snapshot captured at construction.
	 * @param {any} [row]
	 */
	reset( row ) {
		const data = this.#obj[this.#field]; data.length = 0;
		for( const v of this.#initialValue ) data.push( v );
		for( let v = 0; v < this.#initialValues.length; v++ ) {
			const o = data[v];
			if( row && o !== row ) continue;
			const val = this.#initialValues[v];
			this.#subFields.forEach( ( field, idx ) => {
				if( field.field )
					setValue( null, o, field.field, getInputValue( val, field.field ) );
				if( row ) {
					const cell = this.#rows[v].cells[idx];
					cell.refresh();
				}
			} );
		}
		if( !row ) this.fill();
	}

	refresh() {
		const rows = getInputValue( this.#obj, this.#field );
		for( let v = 0; v < rows.length; v++ ) {
			const dataRow = this.#rows[v];
			dataRow.cells.forEach( cell => { if( !cell.canEdit ) cell.refresh(); } );
		}
	}

	/**
	 * Snapshot a row's current values back into the initial-values store
	 * (i.e. "accept" the row, so future resets restore to here).
	 * @param {any} row
	 */
	commit( row ) {
		for( let v = 0; v < this.#rows.length; v++ ) {
			const dataRow = this.#rows[v];
			if( dataRow.rowData === row ) {
				const iv = this.#initialValues[v];
				dataRow.cells.forEach( cell => {
					if( cell.cell.field )
						setValue( null, iv, cell.cell.field, getInputValue( row, cell.cell.field ) );
				} );
			}
		}
	}

	empty() {
		for( const row of this.#rows ) row.el.remove();
		this.#rows.length = 0;
		this.#newRowIndex = 0;
	}

	fill() {
		this.empty();
		this.#initialValue.forEach( ( row, idx ) => {
			this.addRow( row, this.#initialValues[idx] );
		} );
		if( !( "edit" in this.#opts ) || this.#opts.edit )
			this.addRow( null, null );
	}

	/**
	 * @param {string}             name
	 * @param {string}             [subField]
	 * @param {string}             [className]
	 * @param {DataGridColumnType} [type]
	 */
	addColumn( name, subField, className, type ) {
		const cell = this.#header.insertCell();
		const cellText = document.createElement( 'span' );
		const sortText = ( !this.#opts.noSort && ( !type || !type.noSort ) )
			? document.createElement( 'span' ) : null;
		cell.appendChild( cellText );
		if( sortText ) cell.appendChild( sortText );

		cellText.textContent = name;
		cellText.className = "data-grid-header-text" + this.#suffix;
		if( sortText ) {
			sortText.className = "data-grid-header-sort" + this.#suffix;
			sortText.textContent = '▬';
		}

		const cellDef = { el: cell, cellText, sortText, sort: false, idx: this.#cells.length, name, field: subField, className, type };
		const this_ = this;

		if( this.#cells.length ) {
			if( sortText ) sortText.style.visibility = "hidden";
		} else {
			this.#sort.prior = cellDef;
		}
		this.#cells.push( cellDef );

		if( sortText ) onClick( cellDef );

		function onClick( header ) {
			header.el.addEventListener( "click", () => {
				if( this_.#sort.prior.sortText ) {
					if( this_.#sort.prior ) {
						if( this_.#sort.prior === cellDef ) {
							this_.#sort.prior.sort = !this_.#sort.prior.sort;
							this_.#sort.prior.sortText.textContent = this_.#sort.prior.sort ? '▼' : '▲';
						} else {
							this_.#sort.prior.sortText.textContent = '▼';
							this_.#sort.prior.sortText.style.visibility = "hidden";
							this_.#sort.prior = cellDef;
							cellDef.sort = true;
							this_.#sort.prior.sortText.textContent = '▼';
						}
					} else {
						this_.#sort.prior = cellDef;
						cellDef.sort = true;
						this_.#sort.prior.sortText.textContent = '▼';
					}
					this_.#sort.prior.sortText.style.visibility = '';
				}
				if( header.type.grid ) {
					// nosort path
				} else if( header.type.custom ) {
					if( header.type.custom.sort ) {
						this_.#rows.sort( header.type.custom.sort );
						for( const row of this_.#rows ) row.el.remove();
						for( const row of this_.#rows ) this_.#table.appendChild( row.el );
					}
				} else if( header.type.options ) {
					this_.#rows.sort( ( a, b ) => {
						if( !a.rowData ) return 1;
						if( !b.rowData ) return -1;
						const opts = header.type.options;
						const aval = getInputValue( a.rowData, a.cells[header.idx].cell.field );
						const bval = getInputValue( b.rowData, b.cells[header.idx].cell.field );
						const aopt = opts.find( opt => opt.value == aval ).name;
						const bopt = opts.find( opt => opt.value == bval ).name;
						if( aopt > bopt ) return cellDef.sort ? 1 : -1;
						if( aopt < bopt ) return cellDef.sort ? -1 : 1;
						return 0;
					} );
					for( const row of this_.#rows ) row.el.remove();
					for( const row of this_.#rows ) this_.#table.appendChild( row.el );
				} else {
					this_.#rows.sort( ( a, b ) => {
						if( !a.rowData ) return 1;
						if( !b.rowData ) return -1;
						const av = a.cells[header.idx].el.textContent;
						const bv = b.cells[header.idx].el.textContent;
						if( av > bv ) return cellDef.sort ? 1 : -1;
						if( av < bv ) return cellDef.sort ? -1 : 1;
						return 0;
					} );
					for( const row of this_.#rows ) row.el.remove();
					for( const row of this_.#rows ) this_.#table.appendChild( row.el );
				}
			} );
		}
	}

	/** @param {DataGridRow} row1 @param {DataGridRow} row2 */
	swapRows( row1, row2 ) {
		let r1 = -1; let r2 = 0; let r = 0;
		for( ; r1 < 0 && r2 < 0 && r < this.#rows.length; r++ ) {
			const chk = this.#rows[r];
			if( chk === row1 ) { r1 = r; continue; }
			if( chk === row2 ) { r2 = r; continue; }
		}
		const save = this.#rows[r1];
		this.#rows[r1] = this.#rows[r2];
		this.#rows[r2] = save;
		const p1 = this.#rows[r1].el.priorSibling;
		this.#rows[r1].remove();
		this.#rows[r2].before( this.#rows[r1].el );
		this.#rows[r2].remove();
		if( !p1 ) this.#rows[r1].parentNode.prepend( this.#rows[r2].el );
		else      p1.after( this.#rows[r2] );
	}

	/** @param {any} row */
	moveRowUp( row ) {
		let prior = null; let after = null; let r = 0;
		for( ; r < this.#rows.length; r++ ) {
			const chk = this.#rows[r];
			if( after ) { after = chk; break; }
			if( chk.rowData === row ) { after = chk; continue; }
			prior = chk;
		}
		r--;
		if( r ) {
			const save = this.#rows[r];
			this.#rows[r] = this.#rows[r - 1];
			this.#rows[r - 1] = save;
			const saveData = this.#obj[this.#field][r];
			this.#obj[this.#field][r] = this.#obj[this.#field][r - 1];
			this.#obj[this.#field][r - 1] = saveData;
			save.el.remove();
			prior.el.before( save.el );
		}
	}

	/** @param {any} row */
	moveRowDown( row ) {
		let after = null; let r = 0;
		for( ; r < this.#rows.length; r++ ) {
			const chk = this.#rows[r];
			if( after ) { after = chk; break; }
			if( chk.rowData === row ) { after = chk; continue; }
		}
		if( after ) {
			if( r === this.#newRowIndex ) return;
			r--;
			const save = this.#rows[r];
			this.#rows[r] = this.#rows[r + 1];
			this.#rows[r + 1] = save;
			const saveData = this.#obj[this.#field][r];
			this.#obj[this.#field][r] = this.#obj[this.#field][r + 1];
			this.#obj[this.#field][r + 1] = saveData;
			save.el.remove();
			after.el.after( save.el );
		}
	}

	/**
	 * @param {any} newRow         Row data (null for the sentinel "new row").
	 * @param {any} initialValue   Shallow snapshot.
	 * @returns {DataGridRow}
	 */
	addRow( newRow, initialValue ) {
		function setCaret( el, cell, ofs ) {
			if( cell.cell.type?.options ) {
				cell.list.selectedIndex = 0;
			} else {
				el.classList.add( "editing" );
				function isTextNodeAndContentNoEmpty( node ) {
					return ( ( node.nodeType == Node.ELEMENT_NODE ) || ( node.nodeType == Node.TEXT_NODE ) )
						&& node.textContent.trim().length > 0;
				}
				const range = document.createRange();
				const sel = window.getSelection();
				let lastKnownIndex = -1;
				for( let i = 0; i < el.childNodes.length; i++ ) {
					if( isTextNodeAndContentNoEmpty( el.childNodes[i] ) ) lastKnownIndex = i;
				}
				if( lastKnownIndex !== -1 ) {
					const row = el.childNodes[lastKnownIndex];
					const col = row.textContent.length;
					range.setStart( row, col + ofs );
					range.collapse( true );
					sel.removeAllRanges();
					sel.addRange( range );
				}
			}
		}

		function selAll( el, cell ) {
			if( !cell.canEdit ) return;
			if( cell.cell?.type?.options ) return;
			el.classList.add( "editing" );
			function isTextNodeAndContentNoEmpty( node ) {
				return node.nodeType == Node.TEXT_NODE && node.textContent.trim().length > 0;
			}
			const range = document.createRange();
			const sel = window.getSelection();
			let lastKnownIndex = -1;
			for( let i = 0; i < el.childNodes.length; i++ ) {
				if( isTextNodeAndContentNoEmpty( el.childNodes[i] ) ) lastKnownIndex = i;
			}
			if( lastKnownIndex !== -1 ) {
				const row = el.childNodes[lastKnownIndex];
				const col = row.textContent.length;
				range.setStart( row, 0 );
				range.setEnd( row, col );
				sel.removeAllRanges();
				sel.addRange( range );
			}
		}

		const newTableRow = this.#table.insertRow( newRow ? this.#newRowIndex + 1 : -1 );
		newTableRow.className = "data-grid-row" + this.#suffix;
		const row = new DataGridRow( this, newRow, newTableRow, initialValue );
		if( newRow ) {
			this.#rows.splice( this.#newRowIndex, 0, row );
			this.#newRowIndex = this.#rows.length
				+ ( ( this.#rows.length && !this.#rows[this.#rows.length - 1].rowData ) ? -1 : 0 );
		} else {
			this.#rows.push( row );
		}
		const this_ = this;

		this.#cells.forEach( cell => {
			const newCell = new DataGridCell( row, cell );

			if( cell.type && cell.type.click ) {
				newCell.canEdit = false;
				if( row.rowData ) {
					const text = cell.field
						? getInputValue( row.rowData, cell.field )
						: ( cell.type?.text ? cell.type?.text : "X" );
					newCell.el = new Button( newCell.el, text, () => cell.type.click( row ),
						{ suffix: newCell.el.className + ( cell.type.suffix || "" ) } );
				} else {
					newCell.clearNewRow = ( newrow ) => {
						const text = cell.field
							? getInputValue( newrow, cell.field )
							: ( cell.type?.text ? cell.type?.text : "X" );
						newCell.el = new Button( newCell.el, text, () => cell.type.click( row ),
							{ suffix: newCell.el.className + ( cell.type.suffix || "" ) } );
					};
				}
			} else if( cell.type && cell.type.hasOwnProperty( "toString" ) ) {
				newCell.canEdit = false;
			} else if( cell.type && cell.type?.custom ) {
				// custom.create/fill paths intentionally inert in original
			} else if( cell.type && cell.type?.options ) {
				newCell.list = document.createElement( "select" );
				newCell.el.appendChild( newCell.list );
				if( !newCell.canEdit ) newCell.list.disabled = true;
				cell.newInput = onEdit( cell, newCell, newRow, row );
			} else if( cell.type && cell.type.grid ) {
				if( newRow ) {
					newCell.list = new DataGrid( newCell.el, newRow, cell.field, {
						columns: cell.type.grid.columns,
						onNewRow( initialValue ) {
							if( cell.type.grid.onNewRow ) return cell.type.grid.onNewRow( initialValue );
							return row;
						},
					} );
					newCell.list.on( "newRow", ( r ) => { cell.type.grid.newRow( r ); } );
					if( cell.type.grid.change )
						newCell.list.on( "change", ( r ) => { cell.type.grid.change( r ); } );
				}
			} else {
				newCell.el.textContent = "";
				newCell.el.setAttribute( "contenteditable", newCell.canEdit );
				cell.newInput = onEdit( cell, newCell, newRow, row );
			}
			if( cell.field ) newCell.refresh();
			row.cells.push( newCell );
		} );

		function onEdit( cell, newCell, rowData, row ) {
			const c = newCell.el;

			async function newInput( evt ) {
				if( !newCell.options.length ) {
					if( newCell.list ) {
						fillOptions( newCell );
					} else {
						newCell.clearNewRow = ( newrow ) => {
							rowData = newrow;
							addUpdate( cell, newCell );
							fillOptions( newCell );
						};
					}

					if( !rowData ) {
						const r = this_.#newRowCallback( this_.#initialValue );
						row.rowData = rowData = await r;
						const shallowClone = o => {
							const obj = {};
							this_.#subFields.forEach( col => {
								if( col.field )
									setValue( null, obj, col.field, getInputValue( o, col.field ), {} );
							} );
							return obj;
						};
						const initialVals = shallowClone( rowData );
						this_.#initialValues.push( initialVals );
						row.initialValues = initialVals;
						this_.#obj[this_.#field].push( rowData );
						for( const col of row.cells ) {
							if( col.clearNewRow ) col.clearNewRow( row.rowData );
						}
						addUpdate( cell, newCell );
						this_.addRow( null );
					}
					this_.on( "newRow", { row, rowData } );
					setCaret( evt.target, newCell, ( cell.type && cell.type.percent ) ? -1 : 0 );
				}
			}

			function fillOptions( newCell ) {
				const cell = newCell.cell;
				if( !newCell.filled ) {
					if( cell.type?.options ) {
						newCell.filled = true;
						const currentValue = getInputValue( rowData, cell.field );
						cell.type.options.forEach( op => {
							const opt = { el: document.createElement( "option" ), val: op };
							opt.el.className = op.className;
							opt.el.textContent = op.text || op.name;
							opt.el.addEventListener( "select", () => {
								setValue( row, rowData, cell.field, op.value, cell.type );
							} );
							newCell.list.appendChild( opt.el );
							newCell.options.push( opt );
							if( op.value === currentValue ) newCell.list.selectedIndex = newCell.options.length - 1;
						} );
					}
					if( newCell.list ) {
						newCell.list.addEventListener( "change", ( evt ) => {
							const i = evt.target.selectedIndex;
							if( i >= 0 ) {
								const val = convertValue( newCell.options[i].val.value, cell.type );
								setValue( row, rowData, cell.field, val, cell.type );
								if( newCell.options[i].val.className )
									newCell.list.className = newCell.options[i].val.className;
								if( cell.type.change ) cell.type.change( row.rowData, row.cells );
								this_.on( "change", { row, rowData } );
							}
						} );
					}
				}
			}

			if( !rowData ) {
				newCell.clearNewRow = ( newrow ) => {
					rowData = newrow;
					addUpdate( cell, newCell );
					fillOptions( newCell );
				};
				c.addEventListener( "input", newInput );
				c.addEventListener( "click", newInput );
			} else {
				addUpdate( cell, newCell );
				fillOptions( newCell );
			}
			row.addUpdates = addUpdate;

			return ( t ) => {
				this_.#subFields.forEach( ( key, id ) => {
					const upd = this_.#cells[id].upd;
					if( upd.money )        c.textContent = utils.to$( getInputValue( rowData, upd.field ) );
					else if( upd.percent ) c.textContent = utils.toP( getInputValue( rowData, upd.field ) );
					else                   c.textContent = getInputValue( rowData, upd.field );
				} );
			};

			function addUpdate( cell_header, newCell ) {
				const c = newCell.el;
				const field = cell_header.field;
				const type = cell_header.type;
				if( type && type.grid ) {
					newCell.list = new DataGrid( newCell.el, row.rowData, type.grid.field, {
						columns: type.grid.columns,
					} );
				} else if( newCell.list ) {
					fillOptions( newCell );
				} else {
					if( c.canEdit && c.textContent !== "" ) {
						setValue( row, rowData, field, c.textContent, type );
					}
					newCell.refresh();
				}

				c.removeEventListener( "input", newInput );
				c.removeEventListener( "click", newInput );

				c.addEventListener( "focus", ( evt ) => {
					c.classList.add( "editing" );
					selAll( evt.target, newCell );
				} );
				c.addEventListener( "blur", () => {
					c.classList.remove( "editing" );
					setValue( row, rowData, field, c.textContent, type );
					if( type && type.money ) {
						c.textContent = utils.to$( getInputValue( rowData, cell_header.field ) );
					} else if( type && type.percent ) {
						c.textContent = utils.toP( getInputValue( rowData, cell_header.field ) );
					}
					if( type && type.change
						&& getInputValue( row.initialValues, cell_header.field )
							!== getInputValue( rowData, cell_header.field ) ) {
						type.change( row.rowData, row.cells );
					}
				} );
			}
		}

		return row;
	}

	/** @param {any} rowData */
	deleteRow( rowData ) {
		if( !this.#rows.find( ( row, idx ) => {
			if( row.rowData === rowData ) {
				this.#newRowIndex--;
				this.#initialValue.splice( idx, 1 );
				this.#rows.splice( idx, 1 );
				row.remove();
				return true;
			}
			return false;
		} ) ) console.log( "Row doesn't exist in the grid to delete...", rowData );
	}

	remove() { this.#tableContainer.remove(); }
}
