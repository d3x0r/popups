/**
 * @fileoverview Walk up the DOM from a control's parent form to find the
 * enclosing Popup. Used by every data-bound control to inherit suffix/state.
 */

import { Popup, getPopupFromElement } from "./popup.js";

/**
 * @param {HTMLElement|null} el
 * @returns {Popup|null}
 */
export function findEnclosingPopup( el ) {
	let cur = el;
	let popup = null;
	while( cur && !(
		( popup = cur ) instanceof Popup ||
		( popup = getPopupFromElement( cur ) ) instanceof Popup
	) ) cur = cur.parentNode;
	return popup instanceof Popup ? popup : null;
}
