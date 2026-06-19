/**
 * @fileoverview Mutable runtime configuration. The popups entry re-exports
 * these so existing `popups.defaultDrag = false` style assignments keep working.
 */

/**
 * @typedef {object} PopupsConfig
 * @property {boolean} defaultDrag  Enable caption drag-to-move on Popups by default.
 * @property {boolean} autoRaise    Raise a Popup to the top when its frame is clicked.
 */

/** @type {PopupsConfig} */
export const config = {
	defaultDrag: true,
	autoRaise: true,
};
