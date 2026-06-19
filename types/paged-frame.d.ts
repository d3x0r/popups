/**
 * @typedef {object} PagedFrameOptions
 * @property {boolean} [top]    Place handles along the top (default is side).
 * @property {string}  [suffix]
 * @property {{title:string,url?:string}[]} [pages] Pages to create at construction.
 */
export class PageFramePage {
    /** @param {PagedFrame | PageFramePage} frame */
    constructor(frame: PagedFrame | PageFramePage);
    content: HTMLDivElement;
    handle: HTMLDivElement;
    /** @type {PageFramePages|null} */
    pages: PageFramePages | null;
    hidden: boolean;
    /** @param {string} val */
    set tooltip(val: string);
    reset(): void;
    remove(): void;
    hide(): void;
    show(): void;
    /** @param {string} type @param {() => any} cbData */
    enableDrag(type: string, cbData: () => any): void;
    /** @param {string} type @param {(payload:{data:any,x:number,y:number,h:number,w:number,evt:DragEvent}) => void} cbDrop */
    enableDrop(type: string, cbDrop: (payload: {
        data: any;
        x: number;
        y: number;
        h: number;
        w: number;
        evt: DragEvent;
    }) => void): void;
    /** @param {PageFramePage} page */
    insertBeforePage(page: PageFramePage): void;
    /** @param {PageFramePage} page */
    activatePage(page: PageFramePage): void;
    activate(): this;
    deactivate(): void;
    get frame(): any;
    /** @param {string} text */
    set textContent(text: string);
    /** @param {HTMLElement} el */
    appendChild(el: HTMLElement): void;
    /** @param {PageFramePage} pf */
    removePage(pf: PageFramePage): void;
    /** @param {string} title @param {string} [url] */
    addPage(title: string, url?: string): PageFramePage;
    on(a: any, b: any): void;
    #private;
}
export class PageFramePages extends Array<any> {
    /** @param {PagedFrame | PageFramePage} frame @param {string} suffix */
    constructor(frame: PagedFrame | PageFramePage, suffix: string);
    handleContainer: HTMLDivElement;
    pageContainer: HTMLDivElement;
    remove(): void;
    #private;
}
export class PagedFrame extends Events {
    /**
     * @param {HTMLElement} parent
     * @param {PagedFrameOptions} [opts]
     */
    constructor(parent: HTMLElement, opts?: PagedFrameOptions);
    frame: HTMLDivElement;
    /** @type {PageFramePages|null} */
    pages: PageFramePages | null;
    /** @type {PageFramePage|null} */
    lastPage: PageFramePage | null;
    suffix: string;
    empty(): void;
    /** @param {string} title @param {string} [url] */
    addPage(title: string, url?: string): PageFramePage;
    /** @param {PageFramePage} page */
    activate(page: PageFramePage): void;
    #private;
}
export type PagedFrameOptions = {
    /**
     * Place handles along the top (default is side).
     */
    top?: boolean;
    suffix?: string;
    /**
     * Pages to create at construction.
     */
    pages?: {
        title: string;
        url?: string;
    }[];
};
import { Events } from "./core/events.js";
