export namespace popups {
    export { Popup };
    export { createPopup as create };
    export { utils };
    export { ValueOfType };
    export let defaultDrag: boolean;
    export let autoRaise: boolean;
    export { strings };
    export function setClass(): void;
    export function toggleClass(): void;
    export function clearClass(): void;
    export { registerControl };
    export { getControl };
    export { listControls };
}
export default popups;
import { Popup } from "./core/popup.js";
import { createPopup } from "./core/popup.js";
import { getPopupFromElement } from "./core/popup.js";
import { Events } from "./core/events.js";
import { ValueOfType } from "./core/value-of-type.js";
import { utils } from "./core/utils.js";
import { config } from "./core/config.js";
import { popupTracker } from "./core/tracker.js";
import { strings } from "./core/strings.js";
import { registerControl } from "./core/registry.js";
import { getControl } from "./core/registry.js";
import { listControls } from "./core/registry.js";
export { Popup, createPopup, getPopupFromElement, Events, ValueOfType, utils, config, popupTracker, strings, registerControl, getControl, listControls };
