/**
 * @fileoverview "Grab everything" bundle. Side-effect imports every control so
 * the legacy `popup.makeXxx(...)` and `popups.makeXxx(...)` calls all resolve.
 * Also re-exports the core entry so callers can do
 * `import "@d3x0r/popups/bundles/all.js"` as a single replacement for the
 * old default.
 *
 * Does NOT include SashPicker / makeLoginForm — those moved to
 * @d3x0r/user-database-remote/ui/common.
 */

// Side-effect: register makeXxx factories on Popup.prototype.
import "../controls/button.js";
import "../controls/checkbox.js";
import "../controls/radio.js";
import "../controls/slider.js";
import "../controls/text-input.js";
import "../controls/text-field.js";
import "../controls/name-input.js";
import "../controls/date-input.js";
import "../controls/zip-input.js";
import "../controls/ssn-input.js";
import "../controls/choice-input.js";

import { Button } from "../controls/button.js";
import { Checkbox }                   from "../controls/checkbox.js";
import { RadioChoice, LeftRadioChoice } from "../controls/radio.js";
import { Slider }                     from "../controls/slider.js";
import { TextInput }                  from "../controls/text-input.js";
import { TextField }                  from "../controls/text-field.js";
import { NameInput }                  from "../controls/name-input.js";
import { DateInput }                  from "../controls/date-input.js";
import { ZipInput }                   from "../controls/zip-input.js";
import { SSNInput }                   from "../controls/ssn-input.js";
import { ChoiceInput }                from "../controls/choice-input.js";
import { List, createList, makeList } from "../controls/list.js";
import { createPopupMenu }            from "../controls/menu.js";

import { createSimpleForm }                  from "../forms/simple-form.js";
import { SimpleNotice, createSimpleNotice }  from "../forms/simple-notice.js";
import { AlertForm, Alert }                  from "../forms/alert.js";

import { makeWindowManager }                from "../window-manager.js";
import {
	DataGrid, DataGridRow, DataGridCell,
	DataGridTableCell, DataGridTextCell, DataGridCheckCell, DataGridChoiceCell,
} from "../controls/data-grid.js";
import { PagedFrame, PageFramePage, PageFramePages } from "../controls/paged-frame.js";

import { popups } from "../popups.js";

// The side-effect imports above (controls/*.js) call registerControl, which
// installs each `popups.makeXxx` factory directly on the popups namespace.
// We just need to add the class names, forms, and widget references below.

Object.assign( popups, {
	// Control classes
	Button, Checkbox, RadioChoice, LeftRadioChoice, Slider,
	TextInput, TextField, NameInput, DateInput, ZipInput, SSNInput,
	ChoiceInput, List,
	// Forms
	SimpleNotice, AlertForm, Alert,
	// Bigger widgets
	DataGrid, DataGridRow, DataGridCell,
	DataGridTableCell, DataGridTextCell, DataGridCheckCell, DataGridChoiceCell,
	PagedFrame, PageFramePage, PageFramePages,
	// Helpers / factories
	createList, makeList,
	createMenu: createPopupMenu,
	simpleForm: createSimpleForm,
	simpleNotice: createSimpleNotice,
	makeWindowManager,
} );

export * from "../popups.js";
// the class-name suffix rule, so callers building their own element names
// match what the controls emit
export { suffixed, joinSuffix } from "../core/suffix.js";
export {
	Button, Checkbox, RadioChoice, LeftRadioChoice, Slider,
	TextInput, TextField, NameInput, DateInput, ZipInput, SSNInput,
	ChoiceInput, List,
	SimpleNotice, AlertForm, Alert,
	DataGrid, DataGridRow, DataGridCell,
	DataGridTableCell, DataGridTextCell, DataGridCheckCell, DataGridChoiceCell,
	PagedFrame, PageFramePage, PageFramePages,
	createList, makeList,
	createPopupMenu, createSimpleForm, createSimpleNotice,
	makeWindowManager,
};
