/**
 * @typedef {object} Utils
 * @property {number}                                ROUND_DOWN
 * @property {number}                                ROUND_UP
 * @property {number}                                ROUND_NATURAL
 * @property {(val:number|string, rounder?:number)=>string} to$    Format integer cents (×100) as currency string.
 * @property {(s:string|number)=>number}                    toD    Parse currency string → integer cents.
 * @property {(p:string|number)=>string}                    toP    Render as percent string.
 * @property {(p:string)=>number}                           fromP  Parse percent string → number.
 * @property {(container:Node|ShadowRoot, baseUrl?:string)=>void}                    preAddPopupStyles
 * @property {(container:any, styleUrl:string, baseUrl?:string)=>void}                addPopupStyles
 * @property {(container:Node, sheet:Node)=>void}                                     preAddStyleStyleSheet
 * @property {(container:Node, src:string, baseUrl?:string)=>void}                    preAddStyleStyleSrc
 * @property {(container:any, src:string, baseUrl?:string)=>Promise<void>}             addStyleSheetSrc
 * @property {string}                                                                  defaultStyle
 */
/** @type {Utils} */
export const utils: Utils;
export type Utils = {
    ROUND_DOWN: number;
    ROUND_UP: number;
    ROUND_NATURAL: number;
    /**
     * Format integer cents (×100) as currency string.
     */
    to$: (val: number | string, rounder?: number) => string;
    /**
     * Parse currency string → integer cents.
     */
    toD: (s: string | number) => number;
    /**
     * Render as percent string.
     */
    toP: (p: string | number) => string;
    /**
     * Parse percent string → number.
     */
    fromP: (p: string) => number;
    preAddPopupStyles: (container: Node | ShadowRoot, baseUrl?: string) => void;
    addPopupStyles: (container: any, styleUrl: string, baseUrl?: string) => void;
    preAddStyleStyleSheet: (container: Node, sheet: Node) => void;
    preAddStyleStyleSrc: (container: Node, src: string, baseUrl?: string) => void;
    addStyleSheetSrc: (container: any, src: string, baseUrl?: string) => Promise<void>;
    defaultStyle: string;
};
