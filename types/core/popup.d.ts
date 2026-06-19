/**
 * Reverse lookup: given a frame element (or shadow root) return the Popup that
 * owns it. Used by controls to resolve their enclosing popup at construction.
 * @param {Element|ShadowRoot} el
 * @returns {Popup|undefined}
 */
export function getPopupFromElement(el: Element | ShadowRoot): Popup | undefined;
/**
 * Factory wrapper for `new Popup(...)`.
 * @param {string|null}                    caption
 * @param {HTMLElement|Popup|null}         [parent]
 * @param {PopupOptions}                   [opts]
 * @returns {Popup}
 */
export function createPopup(caption: string | null, parent?: HTMLElement | Popup | null, opts?: PopupOptions): Popup;
/**
 * @typedef {object} PopupOptions
 * @property {string}       [suffix]       Appended to class names for theming variants.
 * @property {HTMLElement}  [from]         Adopt an existing element as the frame (skips creating one).
 * @property {boolean}      [contained]    Treat as embedded (formContainer) rather than free-floating (frameContainer).
 * @property {boolean}      [enableClose]  Show the close button.
 * @property {boolean}      [shadowFrame]  Wrap the frame in a shadow root.
 * @property {string}       [id]           Persist position to localStorage under this id.
 */
export class Popup {
    /**
     * @param {string|null}                    caption_
     * @param {HTMLElement|Popup|null}         [parent]   Parent element/popup (defaults to document.body).
     * @param {PopupOptions}                   [opts]
     */
    constructor(caption_: string | null, parent?: HTMLElement | Popup | null, opts?: PopupOptions);
    popupEvents: {
        close: any[];
        show: any[];
    };
    divContentParent_: any;
    divShadow: any;
    divFrame_: HTMLDivElement;
    divCaption: HTMLDivElement;
    divTitle: HTMLSpanElement;
    divContent_: any;
    divClose: HTMLDivElement;
    popup: this;
    useMouse: boolean;
    suffix: string;
    inFrame: boolean;
    set top(top: any);
    set left(left: any);
    set width(width: any);
    set height(left: any);
    get divContent(): any;
    get divFrame(): any;
    shadow: any;
    set caption(val: any);
    center(): void;
    over(e: any): void;
    on(event: any, cb: any): void;
    reset(): void;
    refresh(): void;
    reject(): void;
    accept(): void;
    hide(): void;
    show(): void;
    move(x: any, y: any): void;
    appendChild(e: any): any;
    remove(): void;
}
export type PopupOptions = {
    /**
     * Appended to class names for theming variants.
     */
    suffix?: string;
    /**
     * Adopt an existing element as the frame (skips creating one).
     */
    from?: HTMLElement;
    /**
     * Treat as embedded (formContainer) rather than free-floating (frameContainer).
     */
    contained?: boolean;
    /**
     * Show the close button.
     */
    enableClose?: boolean;
    /**
     * Wrap the frame in a shadow root.
     */
    shadowFrame?: boolean;
    /**
     * Persist position to localStorage under this id.
     */
    id?: string;
};
