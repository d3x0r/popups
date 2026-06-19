/**
 * @fileoverview WindowManager — a floating "start button" plus a window list,
 * intended to provide alt-tab style switching across multiple Popups.
 *
 * NOTE: the current implementation is a stub from the original; the panel is
 * created and dragged but the window listing isn't wired yet. Kept as its own
 * module so it can evolve independently.
 */

import { Popup } from "./core/popup.js";
import { addCaptionHandler } from "./core/tracker.js";

/**
 * @typedef {object} WindowManagerHandle
 * @property {() => void} close  Remove the manager from the page.
 */

/**
 * Construct the window manager. There is no per-call configuration today.
 * @returns {WindowManagerHandle}
 */
export function makeWindowManager() {
	const taskButton = document.createElement( "div" );
	taskButton.className = "taskManagerFloater";
	document.body.appendChild( taskButton );

	const taskPanel = document.createElement( "div" );
	const taskWindow = new Popup( null, null, { from: taskPanel } );
	taskWindow.className = "taskManagerPanel";
	taskWindow.hide();

	addCaptionHandler( taskButton, null );
	taskButton.addEventListener( "click", ( evt ) => {
		evt.preventDefault();
	} );

	return {
		close() {
			taskButton.remove();
			taskWindow.remove();
		},
	};
}
