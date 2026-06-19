/**
 * @typedef {object} WindowManagerHandle
 * @property {() => void} close  Remove the manager from the page.
 */
/**
 * Construct the window manager. There is no per-call configuration today.
 * @returns {WindowManagerHandle}
 */
export function makeWindowManager(): WindowManagerHandle;
export type WindowManagerHandle = {
    /**
     * Remove the manager from the page.
     */
    close: () => void;
};
