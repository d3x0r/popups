/**
 * @fileoverview Tagged value carrying a formatting hint for text-input
 * controls.
 */

export class ValueOfType {
	static Unset = 0;
	static Number = 1;
	static Dollar = 2;
	static Percent = 3;
	static String = 4;
	static SSN = 5;
	static Zip = 6;
	static Date = 7;
	#type = 0;
	/**
	 * @param {number} type   One of ValueOfType.Unset/Number/Dollar/Percent/String/SSN/Zip/Date.
	 * @param {any}    value
	 */
	constructor( type, value ) {
		this.#type = type;
		this.value = value;
	}
}

Object.freeze( ValueOfType );
