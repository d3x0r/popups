# popups
HTML Quick Popup dialog library

## Usage

```

import {popups,Popup} from "popups.mjs";

var popup = popups.create( "caption" );

// show a dialog
popup.show();

// hide a ialog
popup.hide();

// set a new caption
popup.caption = "New Caption";

// this is the content of the frame (inner content div)
popup.divContent  // insert frame content here

// this is the frame of the frame (outer div)
popup.divFrame // insert frame content here


popup.appendChild( createElement( "canvas" ) ); // add something to draw into on the form.

```


Generally popups work like VERY simple GUI widgets...
some of the popups.makeButton sort of methods return just a simple html element.

## Utility interface

The `popups` object that is exports is a namespace that contains functions that are generally useful for working with forms; there are
canned sort of common higher level controls that have a label and a value associated with them; or quick stylable button.

|popups methods| arguments/type  | description |
|----|---|---|
|	defaultDrag | true | option toggle whether to enable mouse dragging on frames |
|	autoRaise | true |  option to toggle whether clicks on frames auto raise them to top |
|	create | (caption [, parent])  | create a new blank popup with specified caption ; if caption is an empty string, no title caption is shown.  |
|	simpleForm | (title, question, defaultValue, ok, cancelCb )  | create a simple yesno form with a title, and a string question; and a text input field for user input  |
|	simpleNotice | ( title, question, ok, cancel )  |  Create just a popup notice with Ok, and optional Cancel button.   |
|        list | (parentList,toString) | Creates a list with a specified tostring method for elements.   |
|        makeCheckbox | (form, o, text, field )  |  make a checkmark button, which is bound to object 'o' and member 'field'.  The title is shown next to the checkbox.  |
|        makeNameInput | (form, o, text, field ) | make a static text display, with a button to click to edit the text   |
 |       makeTextInput |(form,o,field,text, money, percent) |  make a text input with a lable next to it   |
|        makeTextField |(form,o,field,text, money, percent)  | make a text display with a label next to it (like input but readonly)   |
 |       makeButton | (parentElement,text, callback) | adds a button; is 2 divs nested and styled.  Callback is called when the button is clicked/touched. |
|	setClass| (element.class) | Set a class in className |
|	toggleClass| (element,class) | if a class is in a class, remove it, else add it |
|	clearClass| (element,class) | remove a class from className |
| createMenu | () | returns a menu object which is a popup menu |
|   |  |     |
| DataGrid | (parent, o, field, options) | Create a data grid view for the specified array; binds controls directly to the array; cancel will reset the content. |
| PagedFrame | (parent, options ) | Create a paged form (pages get added with a tab that when the tab is selected the content in the frame is shown. |
|   |  |     |
| Alert | (string) | Show a generic singleton alert banner; hide() is available, if multiple show(newString) happen, the banner remains up, and just updates the text content |
| AlertForm | () | This is the form used by Alert, it extends `Popup()`, and just has simple single-touch/any click to clear.  |
| Popup | (...) | Same as the exported Popup symbol |

## Popup class

This popup class is a standard high level contain that is the general abstraction for forms.

|Method| arguments | return | description |
|-----|-----|-----|-----|
|(contructor)| (title,parent,opts) | A new Popup object | Parameters to the constructor are optional.  The first parameter may be a string which is the default name to show on the title bar of the Popup frame.  The second parameter is a HTML Element or Popup to use as a parent (uses `.appendChild( divFrame )` to add itself ot the parent.  The third option parmeter is described below. |
|show | () | undefined | shows a hidden popup in its current position |
| center | () | undefined | A popup needs to be attached to a page, and visible (have a layout applied), then this can calculate where to position the form to center it on the visible page.|
|hide | () | undefined | hides a popup.  (sets display:none on the top level control) |
| caption | -setter- | undefined | set the current text of the popup caption.  (The text of popup.divTitle)|
| over | (element) | undefined | positions the frame aligned to the top left of the specified HTML element `element` |
| on | (event,cb) | undefined | register a handler for events on the popup.  Events are described later. |
| reset | () | undefined | issue reset event on popup |
| reject | () | undefined | issue reject event on popup |
| accept | () | undefined | issue accept event on popup |
| move | (x,y) | undefined | uses the specified x and y floating point numbers as percentages to set top and left to. |
| appendChild | (element) | this.appendChild's result| Ads a HTML element to this form's content area |
| remove | () | undefined | remove all elements from the page. |

### Popup Constructor Options 

|Name| type| default | Description |
|----|----|----|
|suffix| string | "" | Specifies a suffix to apply to elements created in this form.  The `popups` utility methods use this when created on a Popup form instead of just an HTML element. |
|enableClose | boolean | false | Enables showing a close button in the title bar frame.  Clicking the button automatically `hide()`s the popup an dissues a `close` event. |
| from | HTML Element | null | if from is specified, then the specified element is used for the popup `divFrame`, and all other `div*` elements are set to null. |

### Popup Registered Events 

The event function `on()` can be used to define user events, which are generated for the user by the user.

Passing `on(event name, function)` registers an additional function handler for the event.  Functions are executed in the order they were added to handle the event.

Using `on( event name, non-function)` will call the event handler associated with the specified event name, and pass the argument supplied as data to the registered callback.

These are only loosely implemented...

|Event Name| Data | Description |
|----|----|----|
|reset |true   |  when the popup's reset method is run, which resets any changes to current values to their `initialValue` (more later). | 
|accept | true  |  Issued when the changes in a form are meant to be saved to real states; (save changes) | 
|cancel | true  | Issued when changes should be ignored; and the form is closed; |
|show| true  |  Issued when a popup has been told to show itself; Forms that extend Popup should just override the `show()` method... | 
|close | true | some forms generate a close event. |


### Object members

A Popup instance exposes these data members to be able to work with internals of the popup.

|name | type | description |
|----|-----|-----|
|divFrame | HTML Element | This is the control the popup uses as the overall container for all internal elements.|
|divCaption | HTML Element | This is the frame of the caption area on the dialog; may be used to contain other button-type elements. |
|divTitle | HTML Element | This is the text span of the title text in the caption. |
|divContent | HTML Element | This is the element that contains all of the form's content.  The Popup method `appendChild()` appends children to this element. |
|divClose | HTML Element | This is the close button in the caption area container. |
|useMouse | boolean | Can be used to disable mouse drag move on the popup. |


### Popup Example

``` js
class MyForm extends Popup {
	constructor(parent) {
		super( "My Form Name", parent );
	}
}

// create a new MyForm parented to the document's body element...
const form = new MyForm( document.body );

```


### Lists

Drag and drop nested items in lists.  This is a list container, allows adding items.

The list items may have click callback events.

The list provides callbacks for item call events? Also for adding/removing items by drag and drop operations?


### Data Grid View

This shows a data grid (table) with column headers; it shows a list of records in an array.  It may be able to add/remove elements from the array it has been passed; this complicates the accept/reject option.

### Menu

This handles a rectangular popup menu (drop list) of items.  When it shows the dialog, it puts an invisible cover-all div on the page such that any mouse event outside of the popup is captured by the popup; making these modal.

Often this sort of menu is triggered by a user right-clicking or control-clicking on a surface, and if another root menu is shown, others should already have gone away.

```
const menu = popups.createMenu();
menu.addItem( "text", ()=>{
	/* called when item is selected */
} );

menu.separate();

const subMenu = menu.addMenu( "Menu Entry Text" );
```

### ata Grid


## Changelog
- 1.0.109 (in progress)
- 1.0.108
  - fix negative currency formatting.
  - allow 'id' option to allow recovering saved window positions.
- 1.0.107
  - expose internals of notice form better.
- 1.0.106 
  - modify makeButton; results with a object with a more interface more similar to popups.
  - some fixes for refreshing text fields.
- 1.0.105
  - Expose Alert, and AlertForm.
  - some misc updates
- 1.0.104
  - ?? (Please review) 
- 1.0.103
  - fixed tracking mouse events to specific controls (avoid being so leaky with events)
  - Added just popup alert form.
- 1.0.102
  - added remove function on more popups.
  - Improved popup sub-menu closing, put it behind a timer, which allows enough time to move over the menu from the selection before closing.
- 1.0.101 
  - Revised popup menu interface, removed constants, used separate initializer methods; make popup trigger per item instead of per-show.
