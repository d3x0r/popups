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
    /**
     * @param {DataGridRow} row
     * @param {DataGridColumn} cell
     */
    constructor(row: DataGridRow, cell: DataGridColumn);
    /** @type {((newRowData:any)=>void)|null} */
    clearNewRow: ((newRowData: any) => void) | null;
    /** @type {HTMLTableCellElement|null} */
    el: HTMLTableCellElement | null;
    canEdit: boolean;
    list: any;
    filled: boolean;
    options: any[];
    set row(val: any);
    get row(): any;
    get cell(): any;
    /** @param {HTMLElement} el */
    appendChild(el: HTMLElement): void;
    get value(): void;
    refresh(): any;
    #private;
}
export class DataGridTableCell extends DataGridCell {
}
export class DataGridTextCell extends DataGridCell {
}
export class DataGridCheckCell extends DataGridCell {
}
export class DataGridChoiceCell extends DataGridCell {
}
export class DataGridRow {
    /**
     * @param {DataGrid} grid
     * @param {any} threshold     The bound row data (or null for the sentinel "new row").
     * @param {HTMLTableRowElement} newRow
     * @param {any} initialValues Shallow snapshot for reset support.
     */
    constructor(grid: DataGrid, threshold: any, newRow: HTMLTableRowElement, initialValues: any);
    rowData: any;
    /** @type {HTMLTableRowElement|null} */
    el: HTMLTableRowElement | null;
    addUpdates: any;
    /** @type {DataGridCell[]} */
    cells: DataGridCell[];
    initialValues: any;
    newInput: {};
    get grid(): any;
    get suffix(): any;
    remove(): void;
    refresh(): void;
    #private;
}
export class DataGrid extends Events {
    /**
     * @param {HTMLElement} form
     * @param {object}      o      Object containing the array field.
     * @param {string}      field  Name of the bound array field on `o`.
     * @param {DataGridOptions} [opts]
     */
    constructor(form: HTMLElement, o: object, field: string, opts?: DataGridOptions);
    get el(): any;
    get control(): any;
    get span(): any;
    get rows(): any[];
    get suffix(): string;
    set tooltip(val: any);
    hide(): void;
    show(): void;
    reinit(): void;
    /**
     * Restore one row (or the entire grid) to the snapshot captured at construction.
     * @param {any} [row]
     */
    reset(row?: any): void;
    refresh(): void;
    /**
     * Snapshot a row's current values back into the initial-values store
     * (i.e. "accept" the row, so future resets restore to here).
     * @param {any} row
     */
    commit(row: any): void;
    empty(): void;
    fill(): void;
    /**
     * @param {string}             name
     * @param {string}             [subField]
     * @param {string}             [className]
     * @param {DataGridColumnType} [type]
     */
    addColumn(name: string, subField?: string, className?: string, type?: DataGridColumnType): void;
    /** @param {DataGridRow} row1 @param {DataGridRow} row2 */
    swapRows(row1: DataGridRow, row2: DataGridRow): void;
    /** @param {any} row */
    moveRowUp(row: any): void;
    /** @param {any} row */
    moveRowDown(row: any): void;
    /**
     * @param {any} newRow         Row data (null for the sentinel "new row").
     * @param {any} initialValue   Shallow snapshot.
     * @returns {DataGridRow}
     */
    addRow(newRow: any, initialValue: any): DataGridRow;
    /** @param {any} rowData */
    deleteRow(rowData: any): void;
    remove(): void;
    #private;
}
export type DataGridColumnType = {
    /**
     * Cell editable; defaults true.
     */
    edit?: boolean;
    /**
     * Render as currency.
     */
    money?: boolean;
    /**
     * Render as percent.
     */
    percent?: boolean;
    /**
     * Render as a Number.
     */
    number?: boolean;
    /**
     * Skip the sort indicator.
     */
    noSort?: boolean;
    /**
     * Dropdown choices.
     */
    options?: Array<{
        value: any;
        name: string;
        text?: string;
        className?: string;
    }>;
    /**
     * Button cell click handler.
     */
    click?: (row: DataGridRow) => void;
    /**
     * Custom display formatter (read-only).
     */
    toString?: (rowData: any) => string;
    custom?: {
        fill: (cell: DataGridCell) => void;
        refresh?: (cell: DataGridCell) => void;
        create?: (cell: DataGridCell) => void;
        sort?: (a: DataGridRow, b: DataGridRow) => number;
    };
    /**
     * Nested grid.
     */
    grid?: {
        columns: DataGridColumn[];
        onNewRow?: (initial: any) => any;
        newRow?: (row: any) => void;
        change?: (row: any) => void;
        field?: string;
    };
    /**
     * Fires when a cell value changes.
     */
    change?: (rowData: any, cells: DataGridCell[]) => void;
    /**
     * Default button caption.
     */
    text?: string;
    suffix?: string;
};
export type DataGridColumn = {
    /**
     * Header text.
     */
    name: string;
    /**
     * Path on row data to read/write.
     */
    field?: string;
    className?: string;
    type?: DataGridColumnType;
};
export type DataGridOptions = {
    columns?: DataGridColumn[];
    suffix?: string;
    /**
     * If false, suppress the trailing new-row.
     */
    edit?: boolean;
    noSort?: boolean;
    /**
     * Returns the new row data when the sentinel row is activated.
     */
    onNewRow?: (initial: any) => any;
    onCancel?: () => void;
};
import { Events } from "./core/events.js";
