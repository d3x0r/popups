/**
 * @fileoverview Tagged value carrying a formatting hint for text-input
 * controls.
 */
export class ValueOfType {
    static Unset: number;
    static Number: number;
    static Dollar: number;
    static Percent: number;
    static String: number;
    static SSN: number;
    static Zip: number;
    static Date: number;
    /**
     * @param {number} type   One of ValueOfType.Unset/Number/Dollar/Percent/String/SSN/Zip/Date.
     * @param {any}    value
     */
    constructor(type: number, value: any);
    value: any;
    #private;
}
