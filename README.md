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

