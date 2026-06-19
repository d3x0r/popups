/**
 * Wire mouse + touch drag handlers on a caption element so the user can move
 * the popup. Also installs raise-on-click when `config.autoRaise` is enabled.
 * @param {HTMLElement}              c       Caption element.
 * @param {import("./popup.js").Popup|null} popup_  The popup that owns the caption.
 */
export function addCaptionHandler(c: HTMLElement, popup_: import("./popup.js").Popup | null): void;
/**
 * @typedef {object} MouseFrameState
 * @property {HTMLElement} frame
 * @property {number}      x
 * @property {number}      y
 * @property {boolean}     dragging
 * @property {boolean}     [sizing]
 */
/** @type {{ activeFrame: MouseFrameState | null }} */
export const globalMouseState: {
    activeFrame: MouseFrameState | null;
};
export const popupTracker: PopupTracker;
export type MouseFrameState = {
    frame: HTMLElement;
    x: number;
    y: number;
    dragging: boolean;
    sizing?: boolean;
};
declare class PopupTracker {
    /** @type {import("./popup.js").Popup[]} */
    popups: import("./popup.js").Popup[];
    /** @param {import("./popup.js").Popup} popup */
    raise(popup: import("./popup.js").Popup): void;
    find(id: any): import("./popup.js").Popup;
    addPopup(popup: any): void;
}
export {};
