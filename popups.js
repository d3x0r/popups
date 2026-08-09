/**
 * @fileoverview New entry point. Includes the core (Popup, utils, registry)
 * plus the platform-level helpers that need to be on `window.d3x0r.popups2`
 * even when no individual controls are imported — fillFromURL and the
 * pending-script bookkeeping that injected scripts call back into.
 *
 * Does NOT auto-register any controls. For the legacy "everything" surface,
 * import `@d3x0r/popups2/bundles/all.js` or side-effect-import individual
 * controls:
 *
 *   import { Popup } from "@d3x0r/popups2";
 *   import "@d3x0r/popups2/controls/checkbox.js";
 *   import "@d3x0r/popups2/controls/text-input.js";
 */

import { Popup, createPopup, getPopupFromElement } from "./core/popup.js";
import { Events } from "./core/events.js";
import { ValueOfType } from "./core/value-of-type.js";
import { utils } from "./core/utils.js";
import { config } from "./core/config.js";
import { popupTracker } from "./core/tracker.js";
import {
	registerControl, getControl, listControls, setRegistrationTarget,
} from "./core/registry.js";
import { strings } from "./core/strings.js";
import { handleButtonEvents } from "./core/button-events.js";
import {
	fillFromURL, makeURL,
	filledControls, scriptPending, scriptWaiting,
} from "./core/fill-from-url.js";

export {
	Popup,
	createPopup,
	getPopupFromElement,
	Events,
	ValueOfType,
	utils,
	config,
	popupTracker,
	strings,
	registerControl,
	getControl,
	listControls,
	handleButtonEvents,
	fillFromURL,
	makeURL,
	filledControls,
	scriptPending,
	scriptWaiting,
};

/**
 * Legacy namespace object. Mirrors the shape of the old `popups` export so
 * existing call sites (popups.create, popups.utils, popups.defaultDrag = ...,
 * popups.fillFromURL, popups.getFilledParent, etc.) keep working. Control
 * factories (popups.makeCheckbox etc.) are populated by each controls/*.js
 * module when imported.
 *
 * Singleton: if `window.d3x0r.popups2` already exists (because this module was
 * loaded from a different URL or by a separately-injected `<script>`), the
 * existing object is re-exported here so both loads share one namespace —
 * including `scriptPending`, which `fillFromURL`'s injected scripts call back
 * into via `window.d3x0r.popups2.scriptPending.remove(rootId)`.
 */
const existing = ( typeof window !== "undefined" && window.d3x0r && window.d3x0r.popups2 ) || null;

const localPopups = {
	Popup,
	create: createPopup,
	utils,
	ValueOfType,

	// Mutable config — proxied to the shared config object so writes from old
	// code (`popups.defaultDrag = false`) reach the live setting used by core.
	get defaultDrag()    { return config.defaultDrag; },
	set defaultDrag( v ) { config.defaultDrag = v; },
	get autoRaise()      { return config.autoRaise; },
	set autoRaise( v )   { config.autoRaise = v; },

	strings,
	setClass()    { console.trace( "Set class no longer supported." ); },
	toggleClass() { console.trace( "toggle class no longer supported." ); },
	clearClass()  { console.trace( "Clear class no longer supported." ); },

	registerControl,
	getControl,
	listControls,

	// Platform helpers — present on the core namespace because injected scripts
	// from fillFromURL reference them via window.d3x0r.popups2.*, and external
	// callers (webSocketClient.js etc.) use handleButtonEvents as a util.
	handleButtonEvents,
	fillFromURL,
	makeURL,
	scriptPending,
	scriptWaiting,
	filledControls,

	/** @param {string} id @returns {ShadowRoot | undefined} */
	getFilledParent( id ) { return filledControls.get( id ); },
	/** @param {string} id @returns {boolean} */
	isScriptRunning( id ) { return scriptPending.indexOf( id ) >= 0; },
	/** @param {string} id @param {() => void} cb */
	onScriptDone( id, cb ) { scriptWaiting.push( { id, cb } ); },
};

export const popups = existing || localPopups;
export default popups;

if( typeof window !== "undefined" ) {
	if( !( "d3x0r" in window ) )             window.d3x0r = { popups2: popups };
	else if( !( "popups2" in window.d3x0r ) ) window.d3x0r.popups2 = popups;
}

// Now that the namespace exists, any subsequent `registerControl(name, Ctor)`
// from controls/*.js side-effect imports will install `popups[name]` directly.
setRegistrationTarget( popups );
