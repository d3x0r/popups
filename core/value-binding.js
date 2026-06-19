/**
 * @fileoverview Path-based getter/setter used by all data-bound controls.
 * Lifted from popups.mjs (setValue/getInputValue/convertValue) and decoupled
 * from the popups namespace by importing utils directly.
 */

import { utils } from "./utils.js";

/**
 * @typedef {object} BindingType
 * @property {boolean} [money]
 * @property {boolean} [percent]
 * @property {boolean} [number]
 * @property {(dgr:any, rowData:any, val:any) => void} [toValue]  Data-grid setter hook.
 */

/**
 * Write `val` into `rowData` at the dotted `pathName`. When `dgr` is provided
 * along with a type that has a `toValue`, that hook is invoked instead.
 * @param {any}                  dgr        Data-grid row, or null.
 * @param {object}               rowData
 * @param {string | string[]}    pathName
 * @param {any}                  val
 * @param {BindingType | null}   [type]
 */
export function setValue( dgr, rowData, pathName, val, type ) {
	if( type ) {
		if( type.money )        val = utils.toD( val );
		else if( type.percent ) val = utils.fromP( val );
		else if( type.number )  val = Number( val );
	}

	if( dgr && type && type.toValue ) {
		type.toValue( dgr, rowData, val );
	} else {
		const path = ( "string" === typeof pathName ) ? pathName.split( '.' ) : pathName;
		let obj = rowData;
		let p = 0;
		while( p < path.length - 1 ) {
			if( !( path[p] in obj ) ) obj[path[p]] = {};
			obj = obj[path[p]];
			p++;
		}
		obj[path[p]] = val;
	}
}

/**
 * Read the value at the dotted `pathName` from `rowData`. Returns the row
 * itself if pathName is empty. Empty string for missing leaf values.
 * @param {any}               rowData
 * @param {string | string[]} pathName
 * @returns {any}
 */
export function getInputValue( rowData, pathName ) {
	if( !pathName ) return rowData;
	const path = ( "string" === typeof pathName ) ? pathName.split( '.' ) : pathName;
	if( !path ) return undefined;
	let obj = rowData;
	let p = 0;
	while( p < path.length - 1 ) {
		if( !obj ) return null;
		obj = obj[path[p]];
		p++;
	}
	if( !obj ) return null;
	const val = obj[path[p]];
	if( val === undefined ) return "";
	return val;
}

/**
 * Convert a value according to a type hint. Currently a passthrough; reserved
 * for future type-driven coercion.
 * @param {any} value
 * @param {BindingType} [type]
 * @returns {any}
 */
export function convertValue( value, type ) {
	return value;
}
