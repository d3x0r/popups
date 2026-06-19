/**
 * Resolve a URL string against `location` if it's not absolute.
 * @param {string} url
 * @returns {URL}
 */
export function makeURL(url: string): URL;
/**
 * @typedef {object} FillFromURLOptions
 * @property {string} [origin]           Prefix to inject before non-absolute `src`/`href`/`from` paths in the loaded HTML.
 * @property {boolean} [noDefaultStyle]  Skip injecting the default popup stylesheet into the shadow root.
 * @property {boolean} [addScriptsToBody] Re-host cloned `<script>` tags on `document.body` instead of in-place.
 */
/**
 * Load HTML from `url` into the popup/element's shadow root, rewriting any
 * `<script>` tags so they execute and any `<link>` tags so they resolve.
 * @param {Popup | HTMLElement} popup
 * @param {string} url
 * @param {FillFromURLOptions} [opts]
 * @returns {Promise<ShadowRoot>}
 */
export function fillFromURL(popup: Popup | HTMLElement, url: string, opts?: FillFromURLOptions): Promise<ShadowRoot>;
/**
 * @type {Map<string, ShadowRoot>}
 * Map from generated script-id → the shadow root that owns it. Used by
 * consumers (`getFilledParent`) to find the host shadow for a script.
 */
export const filledControls: Map<string, ShadowRoot>;
/**
 * @typedef {string[] & { remove: (id: string) => void }} ScriptPendingList
 */
/** @type {ScriptPendingList} */
export const scriptPending: ScriptPendingList;
/** @type {{ id: string, cb: () => void }[]} */
export const scriptWaiting: {
    id: string;
    cb: () => void;
}[];
export type FillFromURLOptions = {
    /**
     * Prefix to inject before non-absolute `src`/`href`/`from` paths in the loaded HTML.
     */
    origin?: string;
    /**
     * Skip injecting the default popup stylesheet into the shadow root.
     */
    noDefaultStyle?: boolean;
    /**
     * Re-host cloned `<script>` tags on `document.body` instead of in-place.
     */
    addScriptsToBody?: boolean;
};
export type ScriptPendingList = string[] & {
    remove: (id: string) => void;
};
import { Popup } from "./popup.js";
