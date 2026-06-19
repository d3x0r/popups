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
export function setValue(dgr: any, rowData: object, pathName: string | string[], val: any, type?: BindingType | null): void;
/**
 * Read the value at the dotted `pathName` from `rowData`. Returns the row
 * itself if pathName is empty. Empty string for missing leaf values.
 * @param {any}               rowData
 * @param {string | string[]} pathName
 * @returns {any}
 */
export function getInputValue(rowData: any, pathName: string | string[]): any;
/**
 * Convert a value according to a type hint. Currently a passthrough; reserved
 * for future type-driven coercion.
 * @param {any} value
 * @param {BindingType} [type]
 * @returns {any}
 */
export function convertValue(value: any, type?: BindingType): any;
export type BindingType = {
    money?: boolean;
    percent?: boolean;
    number?: boolean;
    /**
     * Data-grid setter hook.
     */
    toValue?: (dgr: any, rowData: any, val: any) => void;
};
