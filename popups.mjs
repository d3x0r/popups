/*

style classes
    frameContainer - the outer frame
    frameCaption - the top caption of the frame
    frameContent - the container of the frame's future content.
    frameClose - style of the upper close Item.
    captionButton - this is a button appearin in the caption (close)
    

var popup = popups.create( "caption" );
popup.show();
popup.hide();
popup.caption = "New Caption";
popup.divContent  // insert frame content here

*/

//import {JSOX} from "jsox";
//import {JSOX} from "../../jsox/lib/jsox.mjs";
const utils = globalThis.utils || {
    ROUND_DOWN:1,
    ROUND_UP :2,
    ROUND_NATURAL:3,
    // --------- These need to go into utils or something
    to$(val,rounder) {
	if( "string" === typeof val ) val = utils.toD(val);
        function pad(val, n) {
            if( val.length < n) {
                val = '00000'.substr(0,n-val.length)+val;
            }
            return val;
        }
	let negate = false;
	if( val < 0 ) { val = -val; negate = true }
        var digits = Math.log10(val) - 2;
        var n;
        var r = '';
        var c = (val/100)|0;
        var cnts;
        if( cnts = val % 100 ) {
            if( rounder === 1 ) {
                if( val < 0 )
                    val -= 1;
                else   
                    val += 1;
            }else if( rounder === 2 ){
                if( val < 0 )
                    val += 1;
                    else
                    val -=1 ;
            }else if( rounder === 3 ) {
                if( val < 0 )
                    if( cnts >= 50 )
                        val -= 1;
                    else
                        val += 1;
                else
                    if( cnts >= 50 )
                        val += 1;
                    else
                        val -= 1;
            }
            else
                r = '.' + pad((val%100).toString(),2);
        }
        if( digits >= 3 ) {
            for( n = 0; n <= digits-3; n += 3) {
                r = "," + pad(((c%1000)|0).toString(),3) + r;
                c = (c / 1000)|0;
            }
        }
        r = (negate?"-":"")+'$' + (c%1000) + r;
        return r;
    },

    toD($) {
        if( "string" !== typeof $ )
            $ = $.toString();
	let negate = false;
        if( $[0] === '-' ) {
            $ = $.substr(1);
            negate = true;
	}
        if( $[0] === '$' )
            $ = $.substr(1);
        //   throw new Error( "NOT A DOLLAR AMOUNT" );
        var i = $.indexOf('.' );
        if( i >= 0 && $.length-i > 2 ) {
            var trunc = $.split(',' ).join('').split('.');
            trunc[trunc.length-1] = trunc[trunc.length-1].substr(0,2);
            return (negate?-1:1)*Number( trunc.join('') );

        } else if( i >= 0 && $.length-i == 3 )
            return (negate?-1:1)*Number( $.split(',' ).join('').split('.').join('') );
        else if( i >= 0 && $.length-i == 2 )
            return (negate?-1:1)*Number( $.split(',' ).join('').split('.').join('') ) * 10;
            return (negate?-1:1)*(Number( $.split(',' ).join('') ) * 100)|0;
    },

    toP(p) {
        if( "string" !== typeof p )
            p = p.toString();
        return p + "%";
    },
    fromP(p){
        p = p.split('%').join('');
        return Number(p);        
    }
}


const localStorage = globalThis.localStorage;


let unique = Date.now();
const globalMouseState = {
        activeFrame : null
    }
var popupTracker;

function addCaptionHandler( c, popup_ ) {
	var popup = popup_;
	if( !popup )
	 	popup = createPopup( null, {from:c} );


	var mouseState = {
		frame:popup.divFrame,
		x:0,y:0,
		dragging:false
	};
	if( popups.autoRaise && popup_ )
		popup_.divFrame.addEventListener( "mousedown", (evt)=>{
			popupTracker.raise( popup );
		} );

	function mouseHandler(c,state) {
		
		var added = false;
		function mouseMove(evt){
			const state = globalMouseState.activeFrame;
			if( state ) {
   	   	  		if( state.dragging ) {
					evt.preventDefault();
					var pRect = state.frame.getBoundingClientRect();
					//var x = evt.clientX - pRect.left;
					//var y = evt.clientY - pRect.top;
					var x = evt.x - pRect.left;
					var y = evt.y - pRect.top;
					state.frame.style.left =parseInt(state.frame.style.left) + (x-state.x);
					state.frame.style.top= parseInt(state.frame.style.top) +(y-state.y);
					if( state.frame.id ) {
						localStorage.setItem( state.frame.id + "/x", popup.divFrame.style.left );
						localStorage.setItem( state.frame.id + "/y", popup.divFrame.style.top );
					}
				}
   	   	  		if( state.sizing ) {
					evt.preventDefault();
					var pRect = state.frame.getBoundingClientRect();
					//var x = evt.clientX - pRect.left;
					//var y = evt.clientY - pRect.top;
					var x = evt.x - pRect.left;
					var y = evt.y - pRect.top;
					state.frame.style.left =parseInt(state.frame.style.left) + (x-state.x);
					state.frame.style.top= parseInt(state.frame.style.top) +(y-state.y);
					if( state.frame.id ) {
						localStorage.setItem( state.frame.id + "/x", popup.divFrame.style.left );
						localStorage.setItem( state.frame.id + "/y", popup.divFrame.style.top );
					}
				}
			}
		}
		function mouseDown(evt){
			if( evt.target !== c && evt.target.parentNode !=  c ) return;
			//evt.preventDefault();
                    if( !popup_.useMouse ) return;

			if( globalMouseState.activeFrame ) {
				return;
			}
			var pRect = state.frame.getBoundingClientRect();
			popupTracker.raise( popup );
			//state.x = evt.clientX-pRect.left;
			//state.y = evt.clientY-pRect.top;
			state.x = evt.x-pRect.left;
			state.y = evt.y-pRect.top;
			globalMouseState.activeFrame = state;
			state.dragging = true;
			if( !added ) {	
				added = true;
				document.body.addEventListener( "mousemove", mouseMove );
				document.body.addEventListener( "mouseup", mouseUp );
			}
		}
		function mouseUp(evt){
			evt.preventDefault();
                        globalMouseState.activeFrame = null;
			state.dragging = false;
			if( added ) {
				added = false;
				document.body.removeEventListener( "mousemove", mouseMove );
				document.body.removeEventListener( "mouseup", mouseUp );
			}
		}

		c.addEventListener( "mousedown", mouseDown );
		//c.addEventListener( "mouseup", mouseUp );
		//c.addEventListener( "mousemove", mouseMove );

		c.addEventListener( "touchstart", (evt)=>{
                    if( !popup_.useMouse ) return;
			var pRect = state.frame.getBoundingClientRect();
			popupTracker.raise( popup );
			//state.x = evt.clientX-pRect.left;
			//state.y = evt.clientY-pRect.top;
			if( evt.target === c ) {
				evt.preventDefault();
				state.x = evt.touches[0].clientX-pRect.left;
				state.y = evt.touches[0].clientY-pRect.top;
				state.dragging = true;
			}
			
		}, { passive:true } )
		c.addEventListener( "touchmove", (evt)=>{
                    if( !popup_.useMouse ) return;
			if( state.dragging ) {
				evt.preventDefault();
				const points = evt.touches;
				var pRect = state.frame.getBoundingClientRect();
				var x = points[0].clientX - pRect.left;
				var y = points[0].clientY - pRect.top;
				state.frame.style.left =parseInt(state.frame.style.left) + (x-state.x);
				state.frame.style.top= parseInt(state.frame.style.top) +(y-state.y);
				if( state.frame.id ) {
					localStorage.setItem( state.frame.id + "/x", popup.divFrame.style.left );
					localStorage.setItem( state.frame.id + "/y", popup.divFrame.style.top );
				}
			}
			
		}, { passive:true })
		c.addEventListener( "touchend", (evt)=>{
                    if( !popup_.useMouse ) return;
			//popupTracker.raise( popup );
			if( evt.target === c )  {
				evt.preventDefault();
				state.dragging = false;
			}
			
		}, { passive:true })

	}

	if( popups.defaultDrag ) {
		mouseHandler(c, mouseState );
		if( popup_ )
			mouseHandler(popup_.divFrame, mouseState );
	}

}

class ValueOfType {	
	#type = 0; // undefined
	constructor( type, value ) {
		this.#type = type;
		this.value = value;
	}
}

ValueOfType.Unset = 0;
ValueOfType.Number = 1;
ValueOfType.Dollar = 2;
ValueOfType.Percent = 3;
ValueOfType.String = 4;
ValueOfType.SSN = 5;
ValueOfType.Zip = 6;
ValueOfType.Date = 7;

Object.freeze( ValueOfType );

function initPopupTracker() {

	var tracker = {
		popups : [],
		raise( popup ) {
			var top = tracker.popups.length;
			var n;
			var from = Number(popup.divFrame.style.zIndex);
			if( from === top ) return;

			for( n = 0; n < tracker.popups.length; n++ ) {
				if( n == popup.index )
					popup.divFrame.style.zIndex = top;
				else {
					var thisZ = Number(tracker.popups[n].divFrame.style.zIndex);
					if( thisZ > from )
						tracker.popups[n].divFrame.style.zIndex = Number(tracker.popups[n].divFrame.style.zIndex) - 1;
				}
			}
		},
		find( id ) {
			return this.popups.find( popup=>popup.divFrame.id === id );
		},
		addPopup(popup) {
			popup.index = tracker.popups.length;
			popup.divFrame.style.zIndex = popup.index+1;
			tracker.popups.push( popup );
			popup.raise = function() {
				tracker.raise( popup)
			}
		}
	}
	return tracker;
}
popupTracker = initPopupTracker();

class Popup {
	popupEvents = {
		close : [],
		show : [],
	};
	divFrame = document.createElement( "div" );
	divCaption = document.createElement( "div" );
	divTitle = document.createElement( "span" );
        divContent = document.createElement( "div" );
        divClose = document.createElement( "div" );
	popup = this;
        // per frame mouse disable...
        useMouse = true;
        suffix = '';

	constructor(caption_,parent,opts) {
            	this.suffix = opts?.suffix ||'';
		const closeButton = opts?.enableClose || false;
		
		// make popup from control.
		const forContent = opts?.from;
                if( forContent ) {
                    this.divFrame = forContent;
                    this.divContent = null;
                    this.divCaption = null;
                    this.divClose = null;
                    this.divTitle = null;
                }else  {
        		this.divFrame.className = (parent?"formContainer":"frameContainer")+this.suffix;
                }
                if( opts?.id ) this.divFrame.id = opts.id;
		if( this.divFrame.id ) {
			this.divFrame.style.left = localStorage.getItem( this.divFrame.id + "/x" );
			this.divFrame.style.top = localStorage.getItem( this.divFrame.id + "/y" );						
		}
		else {
			this.divFrame.style.left= 0;
			this.divFrame.style.top= 0;
		}
                if( this.divCaption ) {
			if( caption_ && caption_ != "" ) {
				this.divFrame.appendChild( this.divCaption );
				this.divCaption.appendChild( this.divTitle );
				if( closeButton && this.divClose )
					this.divCaption.appendChild( this.divClose );
			}

			this.divCaption.className = "frameCaption"+this.suffix;
	                if( this.divCaption )
				addCaptionHandler( this.divCaption, this );
                }
		if( this.divContent ){
			this.divContent.className = "frameContent"+this.suffix;
			this.divFrame.appendChild( this.divContent );
                }

                if( this.divClose ) {
			this.divClose.className = "captionButton"+this.suffix +" closeButton"+this.suffix;
			this.divClose.addEventListener( "click", (evt)=>{
				this.hide();
			} );
		}

        	popupTracker.addPopup( this );


		this.caption = caption_;
		parent = (parent&&parent.divContent) || parent || document.body;

		if( !forContent )
			parent.appendChild( this.divFrame );

	}

	set caption(val) {
		if( this.divTitle )
			this.divTitle.textContent = val;
	}
	center() {
		var myRect = this.divFrame.getBoundingClientRect();
		var pageRect = this.divFrame.parentElement.getBoundingClientRect();
		this.divFrame.style.left = (pageRect.width-myRect.width)/2;
		this.divFrame.style.top = (pageRect.height-myRect.height)/2;
	}
	over( e ){
		var target = e.getBoundingClientRect();
		this.divFrame.style.left = target.left;
		this.divFrame.style.top = target.top;
	}
	on(event,cb) {
		if( cb && "function" === typeof cb )
			if( this.popupEvents[event] )
				this.popupEvents[event].push(cb);
			else
				this.popupEvents[event] = [cb];
		else {
			var cbList;
			if( cbList = this.popupEvents[event]  ) {
				cbList.forEach( cbEvent=>cbEvent( cb ));
			}
		}
	}
	reset() {
		this.on( "reset", true );
	}
	reject() {
		this.on( "reject", true );
	}
	accept() {
		this.on( "accept", true );
	}
	hide() {
		this.divFrame.style.display = "none";
	}
	show() {
		this.raise();
		this.divFrame.style.display = "";
		//popupTracker.raise( this );

		this.on( "show", true );
	}
	move(x,y) {
		this.divFrame.style.left = x+"%";
		this.divFrame.style.top = y+"%";
	}
	appendChild(e) {
		return (this.divContent||this.divFrame).appendChild(e)
	}
	remove() {
		this.divFrame.remove();
	}
}



function createPopup( caption, parent, opts ) {
	return new Popup(caption, parent, opts );
}

function createSimpleForm( title, question, defaultValue, ok, cancelCb ) {
	const popup = popups.create( title );
	popup.on( "show", ()=>{
		if( "function" === typeof defaultValue ){
			input.value = defaultValue();
		}
		else
			input.value = defaultValue;
		input.focus();
		input.select();
	})
	popup.on( "close", ()=>{
		// aborted...
		cancel && cancel();
	});

	var form = document.createElement( "form" );
	form.className = "frameForm";
	form.setAttribute( "action", "none" );
	form.addEventListener( "submit", (evt)=>{
		evt.preventDefault();
		popup.hide();
		ok && ok(input.value);
	} );	
	form.addEventListener( "reset", (evt)=>{
		evt.preventDefault();
		popup.hide();
	} );	

	var textOutput = document.createElement( "SPAN" );
	textOutput.textContent = question;
	var input = document.createElement( "INPUT" );
	input.className = "popupInputField";
	input.setAttribute( "size", 45 );
	input.value = defaultValue;

	var okay = document.createElement( "BUTTON" );
	okay.className = "popupOkay";
	okay.textContent = "Okay";
	okay.setAttribute( "name", "submit" );
	okay.addEventListener( "click", (evt)=>{
		evt.preventDefault();
		popup.hide();
		ok && ok( input.value );
	})

	var cancel = document.createElement( "BUTTON" );
	cancel.className = "popupCancel";
	cancel.textContent = "Cancel";
	cancel.setAttribute( "type", "reset" );
	cancel.addEventListener( "click", (evt)=>{
		evt.preventDefault();
		popup.hide();
		cancelCb && cancelCb( );
	})

	popup.divFrame.addEventListener( "keydown", (e)=>{
		if(e.keyCode==27){
			e.preventDefault();
			popup.hide();
			cancelCb && cancelCb( );
		}
	})
	popup.divContent.appendChild( form );
	form.appendChild( textOutput );
	form.appendChild( document.createElement( "br" ) );
	form.appendChild( input );
	form.appendChild( document.createElement( "br" ) );
	form.appendChild( document.createElement( "br" ) );
	form.appendChild( cancel );
	form.appendChild( okay );
	
	popup.center();
	popup.hide();
	return popup;
}

function handleButtonEvents( button, onClick ) {

        button.addEventListener( "keydown", (evt)=>{
		if( evt.key === "Enter" || evt.key === " " ) {
			evt.preventDefault();
			evt.stopPropagation();
	                onClick();
                }
	} );
	//var okay = document.createElement( "BUTTON" );
	//okay.className = "popupOkay"+suffix;
	//okay.textContent = caption;
	button.addEventListener( "click", (evt)=>{
		evt.preventDefault();
                onClick();
	})
	button.addEventListener( "touchstart", (evt)=>{
		evt.preventDefault();
		setClass( button, "pressed" );
		
	}, { passive:true })
	button.addEventListener( "touchend", (evt)=>{
		evt.preventDefault();
		clearClass( button, "pressed" );
                onClick();
		
	}, { passive:true })
	button.addEventListener( "mousedown", (evt)=>{
		evt.preventDefault();
		setClass( button, "pressed" );
		
	})
	button.addEventListener( "mouseup", (evt)=>{
		evt.preventDefault();
		clearClass( button, "pressed" );
		
	})
}

function makeButton( form, caption, onClick, options ) {

    const suffix = options?.suffix || (( form instanceof Popup )?form.suffix:'');

	var button = document.createElement( "div" );
	button.className = suffix?"button-"+suffix:"button";
	button.style.width = "max-content";
	var buttonInner = document.createElement( "div" );
	buttonInner.className = suffix?"buttonInner-"+suffix:"buttonInner";
	//buttonInner.style.width = "max-content";
	buttonInner.textContent = caption;
	button.buttonInner = buttonInner;
        button.appendChild(buttonInner);
	handleButtonEvents( button, onClick );
	form.appendChild( button );
	return {
		button,
		buttonInner,
		show() {
			button.style.display = "";

		},
		hide() {
			button.style.display = "none";
		},
		remove() {
			button.remove();
		},
		set className(val) {
			button.className = val;
		},
		get className() {
			return button.className;
		},
		get style() {
			return button.style;
		}
	}
      //  return button;

}

function createSimpleNotice( title, question, ok, cancel ) {
    return new SimpleNotice( title, question, ok, cancel );
}

class SimpleNotice extends Popup {
	//const popup = popups.create( title );

	textOutput = document.createElement( "SPAN" );

	constructor( title, question, ok, cancel ) {
		super( title, null, {suffix:"-notice"} );
		const popup = this;
	const form = document.createElement( "form" );
	{
		const	show_ = this.show.bind(this);

	this.show = function( caption, content ) {
		if( caption && content ) {
			this.divCaption.textContent = caption;
			this.textOutput.textContent = content;
		}
		else if( caption )
			this.textContent = caption;
		show_();
	}

	this.on( "show", ()=>{
		this.okay.button.focus();
	})
	this.on( "close", ()=>{
		// aborted...
		cancel && cancel();
	});

	form.className = "frameForm";
	form.setAttribute( "action", "none" );
	form.addEventListener( "submit", (evt)=>{
		evt.preventDefault();
		this.hide();
		//console.log( "SUBMIT?", input.value );
	} );	
	form.addEventListener( "reset", (evt)=>{
		evt.preventDefault();
		this.hide();
	} );	

	this.textOutput.className = "noticeText";
	this.textOutput.textContent = question;

	this.setMessage = (msg)=>{
		this.textOutput.textContent = msg;
	}
	



	this.divFrame.addEventListener( "keydown", (e)=>{
		if(e.keyCode==27){
			e.preventDefault();
			this.hide();
			ok && ok( );
		}
	})
	this.divContent.appendChild( form );
	form.appendChild( this.textOutput );
	form.appendChild( document.createElement( "br" ) );
	form.appendChild( document.createElement( "br" ) );
	//form.appendChild( this.okay.button );
	this.okay = makeButton( form, "Okay", ()=>{
		this.hide();
		ok && ok( );
	})
	
	this.okay.className += " notice";
	this.okay.button.children[0].className += " notice";

	if( cancel )  {
		let cbut = makeButton( form, "Cancel", ()=>{
			this.hide();
			cancel && cancel( );
		})
		cbut.className += " notice";
		cbut.button.children[0].className += " notice";
	}
	this.center();
	this.hide();
	//return this;
		}
	}
	appendChild( e ) {
		this.form.insertChild( e, this.okay );
	}
}



class List {
		 selected = null;
		 groups = [];
		 itemOpens = false;
    constructor( parentDiv, parentList, toString )
        {
            console.log( "List constructor could use the popup to get suffix..." );
		this.toString = toString
		this.divTable = parentDiv;
                this.parentList = parentList;
        }

		push(group, toString_, opens) {
			var itemList = this.divTable.childNodes;
			var nextItem = null;
			for( nextItem of itemList) {
				if( nextItem.textContent > this.toString(group) )
					break;
				nextItem = null;
			}
			
			var newLi = document.createElement( "LI" );
			newLi.className = "listItem"
			
			this.divTable.insertBefore( newLi, nextItem );//) appendChild( newLi );
			newLi.addEventListener( "click", (e)=>{
				e.preventDefault();
				if( this.selected )
					this.selected.classList.remove("selected");
				newLi.classList.add( "selected" );
				this.selected = newLi;
			})

			var newSubList = document.createElement( "UL");
			newSubList.className = "listSubList";
			if( this.parentList && this.parentList.parentItem )
				this.parentList.parentItem.enableOpen( this.parentList.thisItem );
			if( opens ) {
			//	this.enableOpen(newLi);
			}

			var treeLabel = document.createElement( "span" );
			treeLabel.textContent = this.toString(group);
			treeLabel.className = "listItemLabel";
			newLi.appendChild( treeLabel );

			//var newSubDiv = document.createElement( "DIV");
			newLi.appendChild( newSubList );
			//newSubList.appendChild( newSubDiv);
			var newRow;
			var subItems = createList( this, newSubList, toString_, true );
			this.groups.push( newRow={ opens : false, group:group, item: newLi, subItems:subItems
                        	, parent:this.parentList
                                , set text(s) {
                                	treeLabel.textContent = s;
                               	}
                        	, hide() {
                                	this.item.style.display = "none";
                                }
                        	, show() {
                                	this.item.style.display = "";
                                }
                        } );
			return newRow;
		}
		enableOpen(item) {
			if( item.opens) return;
			item.opens = true;
				var treeKnob = document.createElement( "span" );
				treeKnob.textContent = "-";
				treeKnob.className = "knobOpen";
				item.item.insertBefore( treeKnob, item.item.childNodes[0] );
				treeKnob.addEventListener( "click", (e)=>{
					e.preventDefault();
					if( treeKnob.className === "knobClosed"){
						treeKnob.className = "knobOpen";
						treeKnob.textContent = "-";
						item.subItems.items.forEach( sub=>{
							sub.item.style.display="";
						})
					}else{
						treeKnob.className = "knobClosed";
						treeKnob.textContent = "+";
						item.subItems.items.forEach( sub=>{
							sub.item.style.display="none";
						})

					}
				})
		}
		enableDrag(type,item,key1,item2,key2) {
			item.item.setAttribute( "draggable", true );
			item.item.addEventListener( "dragstart", (evt)=>{
				//if( evt.dataTransfer.getData("text/plain" ) )
				//	evt.preventDefault();
				if( item2 )
					evt.dataTransfer.setData( "text/" + type, item.group[key1]+","+item2.group[key2])
				else
					evt.dataTransfer.setData( "text/" + type, item.group[key1])
				evt.dataTransfer.setData("text/plain",  evt.dataTransfer.getData("text/plain" ) + JSON.stringify( {type:type,val1:item.group[key1],val2:item2 && item2.group[key2] } ) );
				console.log( "dragstart:", type );
				if( item )
					evt.dataTransfer.setData("text/item", item.group[key1] );
				if( item2 )
					evt.dataTransfer.setData("text/item2", item2.group[key2] );
			})
		}
		enableDrop( type, item, cbDrop ) {
			item.item.addEventListener( "dragover", (evt)=>{
				evt.preventDefault();
				evt.dataTransfer.dropEffect = "move";
				//console.log( "Dragover:", evt.dataTransfer.getData( "text/plain" ), evt );
			})
			item.item.addEventListener( "drop", (evt)=>{
				evt.preventDefault();
				var objType = evt.dataTransfer.getData( "text/plain" );
				if( "undefined" !== typeof JSOX ) {
				JSOX.begin( (event)=>{
					if( type === event.type ){
						console.log( "drop of:", evt.dataTransfer.getData( "text/plain" ) );
						//cbDrop( accruals.all.get( event.val1 ) );
					}
				} ).write( objType );
				}
			})
		}
		update(group) {
			var item = this.groups.find( group_=>group_.group === group );
			item.textContent = this.toString( group );
		}
		get items() {
			return this.groups;
		}
		reset() {
			while( this.divTable.childNodes.length )
				this.divTable.childNodes[0].remove();
		}
	}

function createList( parent, parentList, toString, opens ) {
     return new List( parent, parentList, toString, opens );
}

function makeCheckbox( form, o, field, text ) 
{
	let initialValue = o[field];
        const suffix = ( form instanceof Popup )?form.suffix:'';
	var textCountIncrement = document.createElement( "SPAN" );
	textCountIncrement.className = "field-unit-span";
	textCountIncrement.textContent = text;
	var inputCountIncrement = document.createElement( "INPUT" );
	inputCountIncrement.setAttribute( "type", "checkbox");
	inputCountIncrement.className = "checkOption"+suffix + " rightJustify";
	inputCountIncrement.checked = o[field];
	//textDefault.
	var onChange = [];
	var binder = document.createElement( "div" );
	binder.className = "fieldUnit"+suffix;
	binder.addEventListener( "click", (e)=>{ 
		if( e.target===inputCountIncrement) return; e.preventDefault(); inputCountIncrement.checked = !inputCountIncrement.checked; })
	inputCountIncrement.addEventListener( "change", (e)=>{ 
		 o[field] = inputCountIncrement.checked; })
	form.appendChild(binder );
	binder.appendChild( textCountIncrement );
	binder.appendChild( inputCountIncrement );
	//form.appendChild( document.createElement( "br" ) );
	if( form instanceof Popup ) {
		form.on( "accept", ()=>{
			initialValue = inputCountIncrement.checked;
		} );
		form.on( "reject", ()=>{
			inputCountIncrement.checked = initialValue;
		} );
	}
        binder.addEventListener( "mousedown", (evt)=>{
                evt.stopPropagation();
        })

	return {
		on(event,cb){
			if( event === "change" ) onChange.push(cb);
			inputCountIncrement.addEventListener(event,cb);
		},
		get checked() {
			return inputCountIncrement.checked;
		},
		set checked(val) {
			inputCountIncrement.checked = val;
		},
		get value() { return inputCountIncrement.checked; },
		set value(val) { 
			o[field] = val;
			inputCountIncrement.checked = val;
			onChange.forEach( cb=>cb());
		 }
                ,
                reset(){
                    o[field] = initialValue;
                    inputCountIncrement.checked = initialValue;
                },
                changes() {
                    if( o[field] !== initialValue ) {
                        return text
                            + popups.strings.get( " changed from " )
                            + initialValue
                            + popups.strings.get( " to " )
                            + o[field];
                    }
                    return '';
				},
		get style() {
			return binder.style;
		}
	}
}

function makeLeftRadioChoice( form, o, field, text, groupName ) 
{
	return makeRadioChoice( form,o,field,text,groupName, true );
}

function makeRadioChoice( form, o, field, text, groupName, left ) 
{
	let initialValue = o[field];
        const suffix = ( form instanceof Popup )?form.suffix:'';
	var textOption = document.createElement( "SPAN" );
	if( left ) 
		textOption.className = "radio-text"+suffix + " rightJustify";
	else
		textOption.className = "radio-text"+suffix;
	textOption.textContent = text;
	var option = document.createElement( "INPUT" );
	option.setAttribute( "type", "radio");
	option.setAttribute( "name", groupName );		
	if( left )
		option.className = "radioOption"+suffix;
	else
		option.className = "radioOption"+suffix + " rightJustify";
	option.checked = o[field];
	//textDefault.
	var onChange = [];
	var binder = document.createElement( "div" );
	binder.className = "fieldUnit"+suffix;
	binder.addEventListener( "click", (e)=>{ 
		if( e.target===option) return; e.preventDefault(); option.checked = !option.checked; })
	option.addEventListener( "change", (e)=>{ 
		 o[field] = option.checked; })
	form.appendChild(binder );
	if( left ) {
		binder.appendChild( option );
		binder.appendChild( textOption );
	}else {
		binder.appendChild( textOption );
		binder.appendChild( option );
	}
	//form.appendChild( document.createElement( "br" ) );

        binder.addEventListener( "mousedown", (evt)=>{
                evt.stopPropagation();
        })

	return {
		on(event,cb){
			if( event === "change" ) onChange.push(cb);
			option.addEventListener(event,cb);
		},
		get checked() {
			return option.checked;
		},
		set checked(val) {
			option.checked = val;
		},
		get value() { return option.checked; },
		set value(val) { 
			o[field] = val;
			option.checked = val;
			onChange.forEach( cb=>cb());
		 }
                ,
                reset(){
                    o[field] = initialValue;
                    option.checked = initialValue;
                },
                changes() {
                    if( o[field] !== initialValue ) {
                        return text
                            + popups.strings.get( " changed from " )
                            + initialValue
                            + popups.strings.get( " to " )
                            + o[field];
                    }
                    return '';
				},
		get style() {
			return binder.style;
		}
	}
}

function makeSlider( form, o, field, text, f, g ) 
{
	if( f && "function" !== typeof f ) {
		console.log( "makeSlider: Function to transform value is not a function:", f  );
		f = null;
	}
	if( g && "function" !== typeof g ) {
		console.log( "makeSlider: Function to transform from value to slider is not a function:", f  );
		g = null;
	}
        const suffix = ( form instanceof Popup )?form.suffix:'';
	let initialValue = o[field];
	const textCountIncrement = document.createElement( "SPAN" );
	textCountIncrement.textContent = text;
	const inputCountIncrement = document.createElement( "INPUT" );
	inputCountIncrement.setAttribute( "type", "range");
	inputCountIncrement.setAttribute( "min", 1);
	inputCountIncrement.setAttribute( "max", 1000);
	inputCountIncrement.className = "valueSlider"+suffix + " rightJustify";
	inputCountIncrement.value = g?g(o[field]):o[field];

	const valueCountIncrement = document.createElement( "SPAN" );
	valueCountIncrement.textContent = o[field];
	valueCountIncrement.className = "field-unit-span"+suffix;
	//textDefault.
	const onChange = [];
	const binder = document.createElement( "div" );
	binder.className = "field-unit"+suffix;
	//binder.addEventListener( "click", (e)=>{ 
	//	if( e.target===inputCountIncrement) return; e.preventDefault(); inputCountIncrement.checked = !inputCountIncrement.checked; })
	inputCountIncrement.addEventListener( "input", (e)=>{ 
		if(f)  o[field] = f(inputCountIncrement.value); 
		else o[field] = inputCountIncrement.value; 
		valueCountIncrement.textContent = o[field];
		control.on( "change", control );
		//if( form instanceof Popup ) form.on("update", control );	
	})

	form.appendChild(binder );
	binder.appendChild( textCountIncrement );
	binder.appendChild( inputCountIncrement );
	binder.appendChild( valueCountIncrement );

        binder.addEventListener( "mousedown", (evt)=>{
                evt.stopPropagation();
        })

	if( form instanceof Popup ) {
		form.on( "accept", ()=>{
			initialValue = inputCountIncrement.value;
		} );
		form.on( "reject", ()=>{
			inputCountIncrement.value = initialValue;
		} );
	}

	//form.appendChild( document.createElement( "br" ) );
	const control = {
		on(event,cb){
			if( "function" === typeof cb ) {
				if( event === "change" ) onChange.push(cb);
				inputCountIncrement.addEventListener(event,cb);
			}else {
				if( event === "change" ) onChange.forEach( f=>f(cb) );
			}
		},
		get value() { return inputCountIncrement.checked; },
		set value(val) { 
			o[field] = val;
			inputCountIncrement.checked = val;
			onChange.forEach( cb=>cb());
		 }
                ,
                reset(){
                    o[field] = initialValue;
                    inputCountIncrement.checked = initialValue;
                },
                changes() {
                    if( o[field] !== initialValue ) {
                        return text
                            + popups.strings.get( " changed from " )
                            + initialValue
                            + popups.strings.get( " to " )
                            + o[field];
                    }
                    return '';
				},
		get style() {
			return binder.style;
		}
	}
	return control;
}

function makeTextInput( form, input, value, text, money, percent, number, suffix_ ){
	const initialValue = input[value];
        const suffix = ( form instanceof Popup )?form.suffix:(suffix_||'');

	var textMinmum = document.createElement( "SPAN" );
	textMinmum.textContent = text;
	var inputControl = document.createElement( "INPUT" );
	inputControl.className = "textInputOption"+suffix +" rightJustify";
        //inputControl.addEventListener( "mousedown", (evt)=>evt.stopPropagation() );
        inputControl.addEventListener( "click", (evt)=>inputControl.select() );
	//textDefault.

	if( form instanceof Popup ) {
		form.on( "accept", ()=>{
			initialValue = inputCountIncrement.value;
		} );
		form.on( "reject", ()=>{
			inputCountIncrement.value = initialValue;
		} );
	}

	function setValue() {
		if( money ) {
			inputControl.value = utils.to$(input[value]);
			inputControl.addEventListener( "change", (e)=>{
				var val = utils.toD(inputControl.value);
				input[value] = val;
				inputControl.value = utils.to$(val);
				result.on( "change", result );
			})
		} else if( percent ) {
			inputControl.value = utils.toP(input[value]);
			inputControl.addEventListener( "change", (e)=>{
				var val = utils.fromP(inputControl.value);
				input[value] = val;
				inputControl.value = utils.toP(val);
				result.on( "change", result );
			})
		} else if( number ) {
			inputControl.value = input[value];
			inputControl.addEventListener( "change", (e)=>{
				var val = Number(inputControl.value);
				input[value] = val;
				inputControl.textContent = val;
				result.on( "change", result );
			})
		}else {
			inputControl.value = input[value];
			inputControl.addEventListener( "input", (e)=>{
			} );
			inputControl.addEventListener( "input", (e)=>{
				var val = inputControl.value;
				input[value] = val;
				result.on( "change", result );
			})
		}
	}
	setValue();

	var binder = document.createElement( "div" );
	binder.className = "fieldUnit"+suffix;
	form.appendChild(binder );
	binder.appendChild( textMinmum );
	binder.appendChild( inputControl );

        binder.addEventListener( "mousedown", (evt)=>{
                evt.stopPropagation();
        })

	if( form instanceof Popup ) {
		form.on( "accept", ()=>{
			initialValue = inputControl.value;
		} );
		form.on( "reject", ()=>{
			inputControl.value = initialValue;
		} );
	}

	const events = {};

	const result = {
		on( event, param ) {
			if( "function" === typeof param ) {
				events[event] = param;
			} else {
				if( event in events )
				events[event](param);
			}
		},
		get frame() {
			return binder;
		},
		get frame() {
			return binder;
		},
            	addEventListener(a,b) { return inputControl.addEventListener(a,b) },
		blur() { inputControl.blur() },
		get value () {
			if( money )
				return utils.toD(inputControl.value);
			if( percent ) 
				return utils.fromP(inputControl.value);
			if( number ) 
				return Number(inputControl.value);
			return inputControl.value;
		},
		set value (val) {
			if( money )
				inputControl.value = utils.to$(val);
			else if( percent )
				inputControl.value = utils.toP(val);
			else if( number )
				inputControl.value = val;
			else
				inputControl.value = val;			
		},
                reset(){
                    input[value] = initialValue;
                    setValue();
                },
                changes() {
                    if( input[value] !== initialValue ) {
                        return text
                            + popups.strings.get( " changed from " )
                            + initialValue
                            + popups.strings.get( " to " )
                            + input[value];
                    }
                    return '';
                }
	}
	return result;
}


function makeTextField( form, input, value, text, money, percent ){
	let initialValue = input[value];

        const suffix = ( form instanceof Popup )?form.suffix:'';
	var textMinmum = document.createElement( "SPAN" );
	textMinmum.textContent = text;
	var inputControl = document.createElement( "SPAN" );
	inputControl.className = "text-field"+suffix+" rightJustify";
        inputControl.addEventListener( "mousedown", (evt)=>evt.stopPropagation() );
	//textDefault.
	function setValue() {
		if( money ) {
			inputControl.textContent = utils.to$(input[value]);
			inputControl.addEventListener( "change", (e)=>{
				var val = utils.toD(inputControl.value);
				input[value] = inputControl.textContent = utils.to$(val);
			})
		} else if( percent ) {
			inputControl.textContent = utils.toP(input[value]);
			inputControl.addEventListener( "change", (e)=>{
				var val = utils.fromP(inputControl.value);
				input[value] = inputControl.textContent = utils.toP(val);
			})
		}else {
			inputControl.textContent = input[value];
			inputControl.addEventListener( "input", (e)=>{
				var val = inputControl.value;
							input[value] = val;
			})
		}
	}
	setValue();

	var binder = document.createElement( "div" );
	binder.className = "fieldUnit"+suffix;
	form.appendChild(binder );
	binder.appendChild( textMinmum );
	binder.appendChild( inputControl );

	if( form instanceof Popup ) {
		form.on( "accept", ()=>{
			initialValue = inputControl.textContent;
		} );
		form.on( "reject", ()=>{
			inputControl.textContent = initialValue;
		} );
	}

	return {
            	addEventListener(a,b) { return inputControl.addEventListener(a,b) },
		refresh() {
			 initialValue = input[value];
			 setValue();
			
		},
		get value () {
			if( money )
				return utils.toD(inputControl.textContent);
			if( percent ) 
				return utils.fromP(inputControl.textContent);
			return inputControl.textContent;
		},
		set value (val) {
			if( money )
				inputControl.textContent = utils.to$(val);
			else if( percent )
				inputControl.textContent = utils.toP(val);
			else
				inputControl.textContent = val;			
		},
                reset(){
                    input[value] = initialValue;
                    setValue();
                },
		divFrame : binder,
                changes() {
                    if( input[value] !== initialValue ) {
                        return text
                            + popups.strings.get( " changed from " )
                            + initialValue
                            + popups.strings.get( " to " )
                            + input[value];
                    }
                    return '';
                }
	}
}

function makeNameInput( form, input, value, text ){
	const initialValue = input[value];
        const suffix = ( form instanceof Popup )?form.suffix:'';
	var binder;
	const textLabel = document.createElement( "SPAN" );
	textLabel.textContent = text;

	const textOutput = document.createElement( "SPAN" );
	textOutput.textContent = input[value];

	const buttonRename = document.createElement( "Button" );
	buttonRename.textContent = popups.strings.get("(rename)");
	buttonRename.className="buttonOption"+suffix+" rightJustify";
        buttonRename.addEventListener("click", (evt)=>{
		evt.preventDefault();
                //title, question, defaultValue, ok, cancelCb
		const newName = createSimpleForm( popups.strings.get("Change Name")
                                                 , popups.strings.get("Enter new name")
                                                 , input[value]
                                                 , (v)=>{
                                                 	input[value] = v;
							textOutput.textContent = v;
                                                 }
                                                 );
                newName.show();
	} );

	binder = document.createElement( "div" );
	binder.className = "fieldUnit"+suffix;
	form.appendChild(binder );
	binder.appendChild( textLabel );
	binder.appendChild( textOutput );
	binder.appendChild( buttonRename );

	if( form instanceof Popup ) {
		form.on( "accept", ()=>{
			initialValue = textOutput.textContent;
		} );
		form.on( "reject", ()=>{
			textOutput.textContent = initialValue;
		} );
	}

	//binder.appendChild( document.createElement( "br" ) );
	return {
		get value() {
			return textOutput.textContent;
		}		,
		set value(val) {
			textOutput.textContent = val;
		},
                reset(){
                    input[value] = initialValue;
                    textLabel.textContent = initialValue;
                },
                changes() {
                    if( input[value] !== initialValue ) {
                        return text
                            + popups.strings.get( " changed from " )
                            + initialValue
                            + popups.strings.get( " to " )
                            + input[value];
                    }
                    return '';
                }
	}
}

	function toggleClass( el, cn )  {
		if( el.className.includes(cn) )  {
			el.className = el.className.split( " " ).reduce( (a,el)=> ( el !== cn )?(a.push(el),a):a, [] ).join(' ');
		}else {
			el.className += " " + cn;
		}
	}
	function clearClass( el, cn )  {
		if( el.className.includes(cn) )  {
			el.className = el.className.split( " " ).reduce( (a,el)=> ( el !== cn )?(a.push(el),a):a, [] ).join(' ');
		}else {
		}
	}
	function setClass( el, cn )  {
		if( el.className.includes(cn) )  {
		}else {
			el.className += " " + cn;
		}
	}

function makeDateInput( form, input, value, text ){
        const suffix = ( form instanceof Popup )?form.suffix:'';
	const initialValue = input[value];
	var textMinmum = document.createElement( "SPAN" );
	textMinmum.textContent = text;
	var inputControl = document.createElement( "INPUT" );
	inputControl.className = "textInputOption"+suffix+" rightJustify";
        inputControl.type = "date"; // returns date at midnight UTC not local.
        inputControl.addEventListener( "mousedown", (evt)=>{
		evt.stopPropagation() // halt on this control
        } );

	//textDefault.
	if( input[value] instanceof Date ) {
		inputControl.valueAsDate = input[value];
        }else
		inputControl.value = input[value];
        inputControl.addEventListener( "change",(evt)=>{
		console.log( "Date type:", inputControl.value, new Date( inputControl.value ) );
		input[value] = new Date( inputControl.value );
                // convert to wall clock?  What if browser isn't in birth locale?
                //input[value].setMinutes( input[value].getTimezoneOffset());
	} );

	var binder = document.createElement( "div" );
	binder.className = "fieldUnit"+suffix;
	form.appendChild(binder );
	binder.appendChild( textMinmum );
	binder.appendChild( inputControl );

	if( form instanceof Popup ) {
		form.on( "accept", ()=>{
			initialValue = inputControl.value;
		} );
		form.on( "reject", ()=>{
			inputControl.value = initialValue;
		} );
	}

	return {
            	addEventListener(a,b) { return inputControl.addEventListener(a,b) },
		get value () {
			return inputControl.value;
		},
		set value (val) {
                    	//input[value] = val;
			inputControl.value = val;
		}
        	, hide() {
                	this.item.style.display = "none";
                }
        	, show() {
                	this.item.style.display = "";
                }
                , reset(){
                    input[value] = initialValue;
                    inputControl.valueAsDate = initialValue;
                }
                , changes() {
                    if( input[value] !== initialValue ) {
                        return text
                            + popups.strings.get( " changed from " )
                            + initialValue
                            + popups.strings.get( " to " )
                            + input[value];
                    }
                    return '';
                }
	}
}

function makeZipInput( form, input, value ){

        const suffix = ( form instanceof Popup )?form.suffix:'';
	const initialValue = input[value];
	var textMinmum = document.createElement( "SPAN" );
	textMinmum.textContent = text;
	var inputControl = document.createElement( "INPUT" );
	inputControl.className = "textInputOption"+suffix+" rightJustify";
        inputControl.type = "date";
        inputControl.addEventListener( "mousedown", (evt)=>evt.stopPropagation() );

	//textDefault.
	inputControl.value = input[value];
        inputControl.addEventListener( "change",(evt)=>{
		input[value] = inputControl.value;
	} );

	var binder = document.createElement( "div" );
	binder.className = "fieldUnit"+suffix;
	form.appendChild(binder );
	binder.appendChild( textMinmum );
	binder.appendChild( inputControl );

	if( form instanceof Popup ) {
		form.on( "accept", ()=>{
			initialValue = inputControl.value;
		} );
		form.on( "reject", ()=>{
			inputControl.value = initialValue;
		} );
	}

	return {
		get value () {
			return inputControl.value;
		},
		set value (val) {
			inputControl.value = val;
		}
	}
}

function makeSSNInput( form, input, value ){

        const suffix = ( form instanceof Popup )?form.suffix:'';
	const initialValue = input[value];
	var textMinmum = document.createElement( "SPAN" );
	textMinmum.textContent = text;
	var inputControl = document.createElement( "INPUT" );
	inputControl.className = "textInputOption"+suffix+" rightJustify";
        inputControl.type = "date";

	//textDefault.
	inputControl.value = input[value];
        inputControl.addEventListener( "change",(evt)=>{
		input[value] = inputControl.value;
	} );

	var binder = document.createElement( "div" );
	binder.className = "fieldUnit"+suffix;
	form.appendChild(binder );
	binder.appendChild( textMinmum );
	binder.appendChild( inputControl );

	if( form instanceof Popup ) {
		form.on( "accept", ()=>{
			initialValue = inputControl.value;
		} );
		form.on( "reject", ()=>{
			inputControl.value = initialValue;
		} );
	}

	return {
		get value () {
			return inputControl.value;
		},
		set value (val) {
			inputControl.value = val;
		},
                reset(){
                    input[value] = initialValue;
                    inputControl.value = initialValue;
                },
                changes() {
                    if( input[value] !== initialValue ) {
                        return text
                            + popups.strings.get( " changed from " )
                            + initialValue
                            + popups.strings.get( " to " )
                            + input[value];
                    }
                    return '';
                }
	}
}

// --------------- Dropdown choice list ---------------------------
function makeChoiceInput( form, input, value, choices, text ){
        const suffix = ( form instanceof Popup )?form.suffix:'';
	const initialValue = input[value];

	var textMinmum = document.createElement( "SPAN" );
	textMinmum.textContent = text;
	var inputControl = document.createElement( "SELECT" );
	inputControl.className = "selectInput"+suffix+" rightJustify";
        inputControl.addEventListener( "mousedown", (evt)=>evt.stopPropagation() );

        for( let choice of choices ) {
            	const option = document.createElement( "option" );
                option.text = choice;
                if( choice === input[value] ) {
	           inputControl.selectedIndex = inputControl.options.length-1;
                }
		inputControl.add( option );
        }
	//textDefault.
	inputControl.value = input[value];
        inputControl.addEventListener( "change",(evt)=>{
		const idx = inputControl.selectedIndex;
		if( idx >= 0 ) {
			console.log( "Value in select is :", inputControl.options[idx].text );
			input[value] = inputControl.options[idx].text;
                }
	} );

	var binder = document.createElement( "div" );
	binder.className = "fieldUnit"+suffix;
	form.appendChild(binder );
	binder.appendChild( textMinmum );
	binder.appendChild( inputControl );

	if( form instanceof Popup ) {
		form.on( "accept", ()=>{
			initialValue = inputControl.value;
		} );
		form.on( "reject", ()=>{
			inputControl.value = initialValue;
		} );
	}


	return {
		get value () {
			return inputControl.value;
		},
		set value (val) {
			inputControl.value = val;
		},
                reset(){
                    input[value] = initialValue;
                    inputControl.value = initialValue;
                },
                changes() {
                    if( input[value] !== initialValue ) {
                        return text
                            + popups.strings.get( " changed from " )
                            + initialValue
                            + popups.strings.get( " to " )
                            + input[value];
                    }
                    return '';
                }
	}
}



//--------------------------- Quick Popup Menu System ------------------------------


let mouseCatcher = null;

function initMouseCatcher() {
	if( mouseCatcher ) return;
	mouseCatcher = document.createElement( "div" );
	document.body.appendChild( mouseCatcher )
	mouseCatcher.addEventListener( "contextmenu", (evt)=>{ evt.preventDefault(); evt.stopPropagation();return false; } );
	mouseCatcher.className = "mouseCatcher";
	let topMenu;

	mouseCatcher.addEventListener( "click", (evt)=>{
		mouseCatcher.style.visibility = "hidden";
		if( topMenu )
			topMenu.hide( true );
	} );

}


function createPopupMenu( opts ) {
	const suffix = opts?.suffix||'';
	let keepShow = false;

	function menuCloser() {
		if( menu.lastShow ) {
			if( keepShow ) {
				menu.lastShow = 0;
				keepShow = false;
				return;
			}
			const now = Date.now();
			if( ( now - menu.lastShow ) > 500 )  {
				menu.lastShow = 0; // reset this, otherwise hide will just schedule this timer
				if( menu.subOpen ) menu.subOpen.hide();
				menu.hide();
			}
			if( menu.lastShow )
				setTimeout( menuCloser, 500 - ( now - menu.lastShow ) );
		}
	}

	const menu = {
		items: [],
		lastShow : 0,
		parent : null,
		subOpen : null,
		container : document.createElement( "div" ),
		board : null,
                suffix : '',
		separate( ) {
			var newItem = document.createElement( "HR" );
			menu.container.appendChild( newItem );
                },

		addItem( text, cb ) {
				var newItem = document.createElement( "A" );
				var newItemBR = document.createElement( "BR" );
				newItem.textContent = text;
				menu.container.appendChild( newItem );
				menu.container.appendChild( newItemBR );
				newItem.className = "popupItem"+menu.suffix;
				newItem.addEventListener( "click", (evt)=>{
				       cb();
				       //console.log( "Item is clicked.", evt.target.value );
				       this.hide( true );
				} );
				newItem.addEventListener( "mouseover", (evt)=>{
					if( menu.subOpen ) {
						menu.subOpen.hide();
						menu.subOpen = null;
					}
					keepShow = true;
				} );
		},
		addMenu( text ) {
				var newItem = document.createElement( "A" );
				var newItemBR = document.createElement( "BR" );
				newItem.textContent = text;
				this.container.appendChild( newItem );
				this.container.appendChild( newItemBR );
				const value = createPopupMenu();
				{
					value.parent = this;
                                       	this.items.push( value );
					newItem.addEventListener( "mouseover", (evt)=>{
						var r = newItem.getBoundingClientRect();
						keepShow = true;
						console.log( "Item hover show that.", evt.clientX, evt.clientY );

						value.show( evt.clientX + 25, r.top - 10, menu.cb );
						menu.subOpen = value;
					} );
					newItem.addEventListener( "mouseout", (evt)=>{
						var r = newItem.getBoundingClientRect();
						console.log( "Item is clicked show that.",  evt.clientX, r.top );
						if( evt.toElement !== newItem.container )		
							value.hide();
					} );
					newItem.addEventListener( "mousemove", (evt)=>{
						if( this.subOpen )
                                                	this.subOpen.lastShow = Date.now();
					} );
				}
				return value;
		},
		hide( all ) {
			if( menu.lastShow ) return menuCloser();			
			this.container.style.visibility = "hidden";
                        const sub = this.subOpen;
                        if( sub ) {
                                this.subOpen = null;
                        	sub.hide( all );
                        }

			if( this.parent && this.parent.subOpen ) {
				if( all ) {
                                	// close from here up
					this.parent.hide( all );
                                }
			} else {
				mouseCatcher.style.visibility = "hide"
			}
		},
		show( x, y, cb ) {
                    	if( this.parent )
	                    	this.parent.subOpen = this;
			menu.lastShow = Date.now();
			//this.board = board;
			menu.cb = cb;
			mouseCatcher.style.visibility = "visible"
			this.container.style.visibility = "inherit";
			this.container.style.left = x;
			this.container.style.top = y;
		},
		reset() {
			this.hide(true);
			let  n;
			while( n = menu.container.childNodes[0] ){
				n.remove();
			}
			//console.log( "hide everything?" );	
		}
	};

	if( !mouseCatcher ) initMouseCatcher();
	mouseCatcher.appendChild( menu.container );
	menu.container.className = "popup"+suffix;
	menu.container.style.zIndex = 50;
	menu.hide(); 
	//document.body.appendChild( menu.container );
	return menu;
}


export class GraphicFrame extends Popup {

    constructor () {
    	//const defaultFont1 = "20px Arial";
        super(null,null);

        const appCanvas = this.divContent;

var rect = appCanvas.getBoundingClientRect();
appCanvas.width = rect.right-rect.left;//window.innerWidth;
appCanvas.height = rect.bottom-rect.top;//window.innerHeight;
var appSizing;
var usingSection;
var appDragging;


appCanvas.addEventListener( "mousemove", mouseMove );
appCanvas.addEventListener( "mouseup", mouseUp );
appCanvas.addEventListener( "mousedown", mouseDown );

var frames = [];

var prior_buttons;
const _MK_LBUTTON = 1;
const _MK_RBUTTON = 2;
const _MK_MBUTTON = 4;

	var zz = 0;
function drawScreen() {
	appCtx.clearRect(0,0,appCanvas.width,appCanvas.height);
	frames.forEach( frame=>{
		appCtx.drawImage( frame.canvas, frame.x, frame.y );//, frame.width, frame.height, frame.w, frame.h, frame.width, frame.height );
	} );
}

function mouse( x,y,b ) {
	const rect = appCanvas.getBoundingClientRect();
	const w = rect.right-rect.left;//window.innerWidth;
	const h = rect.bottom-rect.top;//window.innerHeight;
	const cx = (((x-rect.left)));
	const cy = (((y-rect.top)));
	const px = (((x-rect.left)-(w/2.0))) * 2;
	const py = (((rect.bottom-y)-(h/2.0))) * 2;
      

	//console.log( "mouse:",cx, cy, b );
	var wasMouse;
	var onFrame;
	if( appDragging ) {
		var m = appDragging.getMouse( cx, cy );
		appDragging.x += m.x - appDragging.startX;
		appDragging.y += m.y - appDragging.startY;
	}

	if( ( onFrame = appSizing && ( ( wasMouse = appSizing.getMouse( cx, cy ) ), wasMouse.section = usingSection, appSizing ) ) 
	  || ( onFrame = frames.find( frame=>wasMouse=frame.isMouse( cx, cy ) ) ) ) {
		//console.log( "frameMouse:", wasMouse, x,y, b, prior_buttons );
		
		switch( wasMouse.section ) {
		default: 
	                if( ( b & _MK_LBUTTON ) && !(prior_buttons & _MK_LBUTTON ) ) {
				appDragging = onFrame;
				onFrame.startX = wasMouse.x;
				onFrame.startY = wasMouse.y;
			}
	                else if( !( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
				appDragging = null;
			}
			//console.log( "Section not found:", wasMouse.section );
			break;
		case 1:
	                if( ( b & _MK_LBUTTON ) && !(prior_buttons & _MK_LBUTTON ) ) {
				appSizing = onFrame;
				usingSection = wasMouse.section;
				onFrame.startX = wasMouse.x;
				onFrame.startY = wasMouse.y;
			} else if( appSizing && !( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
				// last left.
				appSizing = null;
	                } else if( appSizing && ( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
					onFrame.setWidth( onFrame.w - ( wasMouse.x - onFrame.startX ) );
					onFrame.x += wasMouse.x - onFrame.startX;
			}
			break;
		case 2: // right side, center
	                if( ( b & _MK_LBUTTON ) && !(prior_buttons & _MK_LBUTTON ) ) {
				appSizing = onFrame;
				usingSection = wasMouse.section;
				onFrame.startX = wasMouse.x;
				onFrame.startY = wasMouse.y;
			} else if( appSizing && !( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
				appSizing = null;
	                } else if( appSizing && ( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
				onFrame.setWidth( onFrame.w + ( wasMouse.x - onFrame.startX ) );
				onFrame.startX = wasMouse.x;
			}
			break;
		case 4:
	                if( ( b & _MK_LBUTTON ) && !(prior_buttons & _MK_LBUTTON ) ) {
				appSizing = onFrame;
				usingSection = wasMouse.section;
				onFrame.startX = wasMouse.x;
				onFrame.startY = wasMouse.y;
			} else if( appSizing && !( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
				// last left.
				appSizing = null;
	                } else if( appSizing && ( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
				onFrame.setHeight( onFrame.h - (wasMouse.y - onFrame.startY) );
				onFrame.y += wasMouse.y - onFrame.startY;
			}
			break;
		case 8:
	                if( ( b & _MK_LBUTTON ) && !(prior_buttons & _MK_LBUTTON ) ) {
				appSizing = onFrame;
				usingSection = wasMouse.section;
				onFrame.startX = wasMouse.x;
				onFrame.startY = wasMouse.y;
			} else if( appSizing && !( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
				// last left.
				appSizing = null;
	                } else if( appSizing && ( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
				onFrame.setHeight( onFrame.h + (wasMouse.y - onFrame.startY) );
				onFrame.startY = wasMouse.y;
			}
			break;
		case 1+4: // top left
	                if( ( b & _MK_LBUTTON ) && !(prior_buttons & _MK_LBUTTON ) ) {
				appSizing = onFrame;
				usingSection = wasMouse.section;
				onFrame.startX = wasMouse.x;
				onFrame.startY = wasMouse.y;
			} else if( appSizing && !( b & _MK_LBUTTON ) && !(prior_buttons & _MK_LBUTTON ) ) {
				appSizing = null;
	                } else if( appSizing && ( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
				// last left.
				onFrame.setWidth( onFrame.w - ( wasMouse.x - onFrame.startX ) );
				onFrame.setHeight( onFrame.h - (wasMouse.y - onFrame.startY ) );
				onFrame.x += wasMouse.x - onFrame.startX;
				onFrame.y += wasMouse.y - onFrame.startY;
			}
			break;
		case 2 + 4: // right side, upper corner
	                if( ( b & _MK_LBUTTON ) && !(prior_buttons & _MK_LBUTTON ) ) {
				appSizing = onFrame;
				usingSection = wasMouse.section;
				onFrame.startX = wasMouse.x;
				onFrame.startY = wasMouse.y;
			} else if( appSizing && !( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
				appSizing = null;
	                } else if( appSizing && ( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
				onFrame.setWidth( onFrame.w + ( wasMouse.x - onFrame.startX ) );
				onFrame.startX = wasMouse.x;

				onFrame.setHeight( onFrame.h - ( wasMouse.y - onFrame.startY ) );
				onFrame.y += wasMouse.y - onFrame.startY;
			}
			break;

		case 1+8: // top left
	                if( ( b & _MK_LBUTTON ) && !(prior_buttons & _MK_LBUTTON ) ) {
				appSizing = onFrame;
				usingSection = wasMouse.section;
				onFrame.startX = wasMouse.x;
				onFrame.startY = wasMouse.y;
			} else if( appSizing && !( b & _MK_LBUTTON ) && !(prior_buttons & _MK_LBUTTON ) ) {
				appSizing = null;
	                } else if( appSizing && ( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
				// last left.
				onFrame.setWidth( onFrame.w - ( wasMouse.x - onFrame.startX ) );
				onFrame.setHeight( onFrame.h + wasMouse.y - onFrame.startY );
				onFrame.x += wasMouse.x - onFrame.startX;
				onFrame.startY = wasMouse.y;
			}
			break;
		case 2 + 8: // right side, upper corner
	                if( ( b & _MK_LBUTTON ) && !(prior_buttons & _MK_LBUTTON ) ) {
				appSizing = onFrame;
				usingSection = wasMouse.section;
				onFrame.startX = wasMouse.x;
				onFrame.startY = wasMouse.y;
			} else if( appSizing && !( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
				appSizing = null;
	                } else if( appSizing && ( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
				onFrame.setWidth( onFrame.w + ( wasMouse.x - onFrame.startX ) );
				onFrame.startX = wasMouse.x;
				onFrame.setHeight( onFrame.h + (wasMouse.y - onFrame.startY) );
				onFrame.startY = wasMouse.y;
			}
			break;
		}
		drawScreen();
	}

	if( !wasMouse.section && onFrame ) {
		//onFrame.mouse(
	}

	{ // LEFT BTUTTON
                if( ( b & _MK_LBUTTON ) && !(prior_buttons & _MK_LBUTTON ) ) {
			// start left.
		}
                else if( ( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
			// drag left.
		}
                else if( !( b & _MK_LBUTTON ) && !(prior_buttons & _MK_LBUTTON ) ) {
			// last left.
		}

	}

	prior_buttons = b;
}

var _buttons = 0;
function mouseMove( evt ) {
	evt.preventDefault();
	mouse( evt.clientX, evt.clientY, _buttons );
}
function mouseUp( evt ) {
	evt.preventDefault();
	_buttons = evt.buttons;
	mouse( evt.clientX, evt.clientY, _buttons );
}
function mouseDown( evt ) {
	evt.preventDefault();
	_buttons = evt.buttons;
	mouse( evt.clientX, evt.clientY, _buttons );
}



//-----------------------------------------------------------------------

function makeFrame( w, h, _mouse, _draw ) {
	var frameFrame;
	var leftWidth = 54;		
	var topWidth = 54;
	var rightWidth = 58;
	var bottomWidth = 55;
	var mouseSection = 0;
	var draw = _draw;
	var mouse = _mouse;
	var frame = { canvas : document.createElement( "canvas" )
		, ctx : null
		, w: w
		, h : h
		, x: 0
		, y : 0
		, sx : leftWidth
		, sy : topWidth
		, sw : w - ( leftWidth+rightWidth )
		, sh : h - ( topWidth+bottomWidth )
		, sizing : false
		, dragging : false
		, startX : 0
		, startY : 0
		, write() {
			appContext.drawImage( this.canvas, this.x, this.y );	
		}
		, setFrame( image ) {
			var img = document.createElement( "IMG" );
			img.src=image;
			img.onload = function() {
				frameFrame = img;
				console.log( "have image loaded?" );
				drawFrame();
			}
		}
		, setWidth( w ) {
			this.w = w;
			this.sw = this.w - (leftWidth+rightWidth);
			this.canvas.width = this.w;
			drawFrame();
		}
		, setHeight( h ) {
			this.h = h;
			this.sh = this.h - (topWidth+bottomWidth);
			this.canvas.height = this.h;
			drawFrame();
		}
		, setDraw( cb ) { draw = cb }
		, getMouse( x, y ) {
			var sx, sy, tx, ty, farx = false, fary = false;

			ty=y-this.y;
			if( (tx=x-this.x) > leftWidth && (ty) > topWidth ) {
				sx=tx-leftWidth;
				sy=ty-topWidth;
				if( (true,tx) < ( this.w - (leftWidth+rightWidth) )  && (true,ty) < ( this.h - (topWidth+bottomWidth) ) ) {
					return { frame:false, x:tx, y:ty };
				}
			}
			var section = 0;
			if( tx < leftWidth )
				section += 1;
			else if( tx > this.w - leftWidth )
				section += 2;

			if( ty < topWidth )
				section += 4;
			else if( ty > this.h - topWidth )
				section += 8;

			return { frame:true, section:section, x:tx, y:ty };
		}
		, isMouse( x, y ) {
			var sx, sy, tx, ty, farx = false, fary = false;
			

			if( x > this.x && y > this.y && x < (this.x+this.w) && y < (this.y+this.h) ) {
				ty=y-this.y;
				if( (tx=x-this.x) > leftWidth && (ty) > topWidth ) {
					sx=tx-leftWidth;
					sy=ty-topWidth;
					if( (true,tx) < ( this.w - (leftWidth+rightWidth) )  && (true,ty) < ( this.h - (topWidth+bottomWidth) ) ) {
						return { frame:false, x:tx, y:ty };
					}
				}
				var section = 0;
				if( tx < leftWidth )
					section += 1;
				else if( tx > this.w - leftWidth )
					section += 2;

				if( ty < topWidth )
					section += 4;
				else if( ty > this.h - topWidth )
					section += 8;

				return { frame:true, section:section, x:tx, y:ty };
			}
			return null;
		}
	};
	frames.push( frame );
	frame.canvas.width = w;
	frame.canvas.height = h;
	
	frame.ctx = frame.canvas.getContext( "2d" );
	frame.ctx.font = defaultFont1;
	//frame.ctx.fillRect( 0,0,100,100 );
	//appCtx.fillRect( 0,0,100,100 );

	function drawFrame() {
		if( !frameFrame )  return;
		var src = frameFrame;
		var ctx = frame.ctx;
		var outCtx = appCtx;//frame.ctx;
		//------------ corners ------------------

		ctx.drawImage(frameFrame, 0, 0, leftWidth, topWidth, 0, 0, leftWidth, topWidth );
		
		ctx.drawImage(frameFrame, frameFrame.width-rightWidth, 0, leftWidth, topWidth, frame.canvas.width-rightWidth, 0, leftWidth, topWidth );

		ctx.drawImage(frameFrame, 0, src.height-bottomWidth, leftWidth, topWidth, 0, frame.canvas.height - bottomWidth, leftWidth, bottomWidth );

		ctx.drawImage(frameFrame, frameFrame.width-rightWidth, src.height-bottomWidth, rightWidth, bottomWidth
			, frame.canvas.width-rightWidth, frame.canvas.height - bottomWidth, rightWidth, bottomWidth );

		// top-bottom
		ctx.drawImage(frameFrame, leftWidth, 0
			, src.width-(leftWidth+rightWidth), topWidth
			, leftWidth, 0, frame.canvas.width-(leftWidth+rightWidth), topWidth );

		ctx.drawImage(frameFrame, leftWidth, src.height-bottomWidth
			, src.width-(leftWidth+rightWidth), bottomWidth
			, leftWidth, frame.canvas.height-bottomWidth
			, frame.canvas.width-(leftWidth+rightWidth), bottomWidth );

		// left-right
		ctx.drawImage(frameFrame, 0, topWidth
			, leftWidth, src.height-(topWidth+bottomWidth)
			, 0, topWidth
			, leftWidth, frame.canvas.height-(topWidth+bottomWidth) );

		ctx.drawImage(frameFrame, src.width - rightWidth, topWidth
			, rightWidth, src.height-(topWidth+bottomWidth)
			, frame.canvas.width - rightWidth, topWidth
			, rightWidth, frame.canvas.height-(topWidth+bottomWidth) );

		ctx.drawImage(frameFrame
			, leftWidth, topWidth, src.width-(leftWidth+rightWidth), src.height-(topWidth+bottomWidth)
			, leftWidth, topWidth, frame.canvas.width-(leftWidth+rightWidth), frame.canvas.height-(topWidth+bottomWidth) );


		renderLabel(ctx, "LABEL", 50, 75 );
		
		outCtx.drawImage( frame.canvas, frame.x, frame.y );//, frame.width, frame.height, frame.w, frame.h, frame.width, frame.height );
	
		if( draw )
			draw();
//		appCtx.drawImage( frameFrame, 0, 0 );
	}
}


	}
}



/*
 //-------------------------------------------------------------

function makeApp() {
	var widgets = makeFrame( 200, 500 );
	var tools = makeFrame( 800, 600 );
	tools.x = widgets.w;
	widgets.setFrame( "WindowFrame-LightWoodFilled.png" );

	tools.setFrame( "WindowFrame-LightWoodFilled.png" );

	makeNameTray();
}

*/


//-----------------------------------------------------------------

export class AlertForm extends Popup {

	constructor(parent) {
		super( null, parent, {suffix:"-alert"} );
		const this_ = this;
		this.divContent.setAttribute( "tabIndex", 0 )
		this.divContent.className += " alert-content";
		this.divFrame.addEventListener( "click", ()=>{
			this_.hide();
		})
	}

	show(caption) {
		if( "string" === typeof caption  ) this.caption = caption;
		this.raise();
		super.show();
		this.divFrame.focus();
		this.center();
	}
	hide() {           
		this.divFrame.style.display = "none";
	}
	set caption( val ) {
		//console.log( "This should be caption set:", val );
		this.divContent.innerHTML = val;
	}

}

var alertForm = null;//initAlertForm();
//alertForm.hide();

function Alert(msg) {
	if( !alertForm ) alertForm = new AlertForm();
	alertForm.caption = msg;
	alertForm.show();
}

class SashPicker extends Popup{
	choices = [];
	sashModule = null;
	promise = null;
	constructor( opts ) {
		super( "Please select login role", null, {enableClose: false } );
		const form = opts?.useSashForm || "pickSashForm.html";
		import( opts?.sashScript || "pickSashForm.js" ).then( (sashModule)=>{
			this.sashModule = sashModule;
			sashModule.setForm( pickSashForm );
		} ).catch( (err)=>{
			console.log( "Sash form resulted with an error?" );
		} );

	        this.hide();

		fillFromURL( this, form ).then( ()=>{
			this.center();
			this.on( "load", this );
		} ).catch( (err)=>{
			if( this.promise ) this.promise.rej( "Choice selection form failed to load." );
			
		} );
		this.on( "ok", ()=>{
			if( this.sashModule ) {
				const choice = this.sashModule.getChoice();
				if( this.promise ) this.promise.res( choice );
			}else
				if( this.promise ) this.promise.res( choices[0] );				
			this.hide();
		} );
		this.on( "cancel", ()=>{
			if( this.promise ) this.promise.rej( "Choice canceled by user." );
			this.hide();
		} );

	}
	
	show( choices ) {
		this.reset();
		this.choices = choices;
		if( this.sashModule )
			for( let choice of choices ) {
				this.sashModule.addChoice( choice );
			}
		super.show();
	}
}


// login form as a class would be a better implementation.
function makeLoginForm( doLogin, opts  ) {
	var loginForm = createPopup( "Connecting", opts?.parent, {enableClose:false} );
	var pickSashForm = null;

	let createMode =false;
	let isGuestLogin = false;
	const form = opts?.useForm || "loginForm.html";
	
	let wsClient = opts?.wsLoginClient;

       	loginForm.connect = function() {
            	loginForm.caption = "Login Ready...";
        }

       	loginForm.disconnect = function() {
            	loginForm.caption = "Connecting...";
		loginForm.show();
        }
	loginForm.login = function() {     	
		if( doLogin ) doLogin( wsClient );
	};

	loginForm.pickSash = function(choices) {
		const p = { p:null, res:null, rej:null };
		p.p = new Promise( (res,rej)=>{p.res =res;p.rej=rej} );
		if( !pickSashform ) {
			pickSashForm = new SashPicker( opts );
			pickSashForm.on( "load", (form)=>{
				fillChoices();
			} );
		} else {
			fillChoices();
		}

		function fillChoices() {		
			pickSashForm.show( choices, p )
		}
		return p.p;
	};
	loginForm.Alert = Alert;
        loginForm.setClient = function(wsClient_) {
		wsClient = wsClient_;
	};
        loginForm.hide();

	fillFromURL( loginForm, form ).then( ()=>{
		if( wsClient ) {
			wsClient.loginForm = loginForm;
			if( wsClient.connected ) {
				// already connected; connect event would not have fired
				loginForm.caption = "Login Ready";
				// sometimes it is already connected...
			}
			wsClient.bindControls( loginForm );
			loginForm.center();
		}
	} );

	if( !wsClient )
		loginForm.show();
	

	return loginForm;
}


function makeWindowManager() {
	const taskButton = document.createElement( "div" );
	taskButton.className = "taskManagerFloater";
	document.body.appendChild( taskButton );
	const taskPanel = document.createElement( "div" );
	const taskWindow = new Popup( null, null, { from:taskPanel} );
	taskWindow.className = "taskManagerPanel";
	taskWindow.hide();


	addCaptionHandler( taskButton, null );
        taskButton.addEventListener( "click", (evt)=>{
    		evt.preventDefault();
                // if was not dragging?
                //alert( "CLICK!" );
	} );
	//addDragEvent( taskButton ); // add support for click-drag like caption handler....

        return {
            close() {
                console.log( "this should remove this whole construct from the page" );
            }
        }
}

const filledControls = new Map();

function fillFromURL(popup, url) {
	//const urlPath =  url.split( "/");
    const control = (((popup instanceof Popup)&&(popup.divContent||popup.divFrame))||popup);
    return fetch(url).then(response => {
	return response.text().then( (text)=>{
                control.innerHTML = text;
		nodeScriptReplace(control);
		return popup;
	} );
       })


	function nodeScriptReplace(node) {
                if ( nodeScriptIs(node) === true ) {
                        node.parentNode.replaceChild( nodeScriptClone(node) , node );
                }
                else {
                        var i = -1, children = node.childNodes;
                        while ( ++i < children.length ) {
                              nodeScriptReplace( children[i] );
                        }
                }

        	return node;
	}
	function nodeScriptClone(node){
		var script  = document.createElement("script");
		script.text = node.innerHTML;

		var i = -1, attrs = node.attributes, attr;
		while ( ++i < attrs.length ) {
				script.setAttribute( (attr = attrs[i]).name, attr.value );
		}
		/*
		if( script.src ) {
			const protoPath=script.src.split( "://" );
			const path = protoPath[1].split('/' );
		}
		*/
		script.id = "Unique"+(unique++);
		filledControls.set( script.id, popup );
		if( script.textContent && script.textContent.length ) {
			script.textContent = "const rootId='"+script.id+"';" +script.textContent;
		}
		return script;
	}

	function nodeScriptIs(node) {
        	return node.tagName === 'SCRIPT';
	}

}


class DataGridCell {
}

class DataGridTableCell extends DataGridCell {
}


class DataGridTextCell extends DataGridCell {
}

class DataGridCheckCell extends DataGridCell {
}

class DataGridChoiceCell extends DataGridCell {
}

class DataGridRow {

	rowData = null;
	el = null;   // table row element
	addUpdates=null;
	cells=[];
	#dataGrid = null;
	newInput= {
		// update
	};

	constructor( grid, threshold, newRow ) {
		this.#dataGrid = grid;
		this.el = newRow;
		this.rowData = threshold;

	}


/*	
		const row = {
			threshold:threshold,
			el: newRow,
			addUpdates:null,
			cells:cells,
			newInput: {
				update(t){
					["threshold","primary_percent","secondary_percent","tertiary_percent", "kitty", "house"].forEach( (key,id)=>{
				    	const c = cells[id].cell;
					const upd = cells[id].upd;
				    	// update current value.
					if( !upd ) row.addUpdates( t );
					else {
				    	if( upd.money )
						c.textContent = popups.utils.to$( t[upd.f] );
					else if( upd.percent )
						c.textContent = popups.utils.toP( t[upd.f] );
					else
						c.textContent = t[upd.f];
					}
					} );
				},
				
			},

			
		}
		thresholdRows.push(row );
*/
}

class DataGrid {

	#initialValue = undefined;
	#initialValues = undefined;
	#suffix = '';
	#obj = null;
	#field = null;
	#table = null;
	#header = null;
	#opts = null;
	#cells = [];
	#rows = [];

	#subFields = null;
	#newRowCallback= (()=>({}));
/*

	const dg = new DataGrid(form, {rows:[]}, "rows", { columns : [{name: "Threshold Value", field:"threshold", className:"threshold-value" }  );
								    .{name:"Primary Percent", field:"primary", className:"threshold-primary" } ] 
							} );
	dg.addColumn( name, field, classname );

	input.thresholds.forEach( t=>{
		addRow( thresholdTable, thresholdRows, t );
	} );
	addRow( thresholdTable, thresholdRows, null );

*/

	constructor( form, o, field, opts ) 
	{
		this.#field= field;
		this.#opts = opts || {};
		this.#subFields = (opts?.columns) || [];
		this.#obj = o;
		const cancel = opts?.onCancel;
		
		//this.#initialValue = o[field];
		// keep a copy of the original array with original member addresses...
		this.#initialValue = o[field].map(o=>o);

		// keep the original valuess... with a shallow deep copy  (deep shallow?)
		this.#initialValues = o[field].map(o=>{
			const obj = {};
			this.#subFields.forEach( col=>obj[col.field] = o[col.field] );
			return obj;
		});
		
	        
                this.#suffix = opts?.suffix || (( form instanceof Popup )?form.suffix:'');
		
		if( opts?.onNewRow ) this.#newRowCallback = opts.onNewRow;
                
		const thresholdRows = ()=>this.#obj[this.#field];
	        
		if( form instanceof Popup ) {
			form.on( "apply", function() {
			} )

		/*
		popup.refresh = function() {
			['name','everyTally','housePercent','startingValue'].forEach( key=>{
				controls[key].value = input[key];
			});
	        
			for( let threshold of input.thresholds ) {
				addRow( thresholdTable, thresholdRows, threshold );
			}
	        
			for( let inp of input.inputs ) {
				for( let form of l.inputForms ){
					if( form.id === inp.accrual_input_group_id ){
						form.glist.subItems.update( input );
					}
				}
			}
	        
			for( let activity of input.activities ){
				for( let form of l.activities ){
					if( form.activity === activity ){
						form.jlist.subItems.update( input );
					}
				}
			}
			
		}
		*/
			form.on( "show", ()=>{
		//	input.value = defaultValue;
//	//		input.focus();
//	//		input.select();
			})

			form.on( "close", ()=>{
			// aborted...
				cancel && cancel();
			});
			form.on( "cancel", ()=>{
			// aborted...
				cancel && cancel();
			});
	        }
	        
		this.#table = document.createElement( "table" );
		this.#table.className = "data-grid-table"+ this.#suffix;
	        
		this.#header = this.#table.insertRow();
		this.#header.className = "data-grid-header-row"+ this.#suffix;

		form.appendChild( this.#table );
	        
		this.#subFields.forEach( col=>{
			this.addColumn( col.name, col.field, col.className, col.type );
		} );

		this.fill();
	}

	reinit() {
		const o = this.#obj;
		const field = this.#field;
		//this.#initialValue = o[field];
		// keep a copy of the original array with original member addresses...
		this.#initialValue = o[field].map(o=>o);

		// keep the original valuess... with a shallow deep copy  (deep shallow?)
		this.#initialValues = o[field].map(o=>{
			const obj = {};
			this.#subFields.forEach( col=>obj[col.field] = o[col.field] );
			return obj;
		});
		this.fill();
	}

	reset() {
		// this copies internal initial values to current object
		const data = this.#obj[this.#field]; data.length = 0;
		for( let v of this.#initialValue ) data.push(v);
		for( let v=0; v < this.#initialValues.length; v++  ) {
			const o = data[v];
			const v = this.#initialValues[v];
			this.subFields.forEach( field=>{
				o[field.field] = v[field.field];
			} );
		}
		// fill removes all old data before including new data.
		this.fill();
	}

	refresh() {
	}

	fill() {
		// empty existing table.
		while( this.#rows.length ) {
			const row = this.#rows[0];
			this.#rows.splice( 0, 1 );
			row.el.remove();
		}
		
		this.#initialValue.forEach( row=>{
			this.addRow( row );
		} );
		/// plus one blank row to create a new entry.
		this.addRow( null );

	}

	addColumn( name, subField, className, type ) {
		const cell = this.#header.insertCell();
		cell.textContent = name;//"Threshold Value";
		const cellDef = {el:cell, idx:this.#cells.length, name:name, field:subField, className, type } ;
		this.#cells.push( cellDef );
		const this_ = this;
		

		onClick( cellDef );

		function onClick( header ) {
			header.el.addEventListener( "click", click );
			function click( evt ) {
				console.log( "Cell clicked?", header.el );
				if( header.type.list ) {
					
				}else {
					this_.#rows.sort( (a,b)=>{		
						if( !a.rowData ) return 1;
						if( !b.rowData ) return -1;
						if( a.cells[header.idx].el.textContent > b.cells[header.idx].el.textContent )
							return 1;
						if( a.cells[header.idx].el.textContent < b.cells[header.idx].el.textContent )
							return -1;
						return 0;
					} )
					for( let row of this_.#rows )
						row.el.remove();
					for( let row of this_.#rows )
						this_.#table.appendChild( row.el )
				}
			}
		}


	}

	swapRows( row1, row2 ) {
		// somehow swap..
	}

	moveRowUp( row ) {
	}

	moveRowDown( row ) {
	}

	addRow(newRow) {

		

		function setCaret(el,cell,ofs) {
			if( cell.cell.type.options ) {
				//const select = cell.list.selectedIndex;
				cell.list.selectedIndex = 0;
			} else {

				function isTextNodeAndContentNoEmpty(node) {
					return ((node.nodeType == Node.ELEMENT_NODE ) || ( node.nodeType == Node.TEXT_NODE ) )&& node.textContent.trim().length > 0
				}
				let range = document.createRange(),
				      sel = window.getSelection(),
			        
				lastKnownIndex = -1;
				for (let i = 0; i < el.childNodes.length; i++) {
				    if (isTextNodeAndContentNoEmpty(el.childNodes[i])) {
				      lastKnownIndex = i;
				    }
				  }
				  if (lastKnownIndex === -1) {
				    throw new Error('Could not find valid text content');
				  }
				  let row = el.childNodes[lastKnownIndex],
				      col = row.textContent.length;
				  range.setStart(row, col+ofs);
				  range.collapse(true);
				  sel.removeAllRanges();
				  sel.addRange(range);
			}
			  //el.focus();
		}
	        
	        
		function selAll(el, cell) {
			if( !cell.canEdit ) return;
			if( cell.cell.type.options ) {
				return;
			}
			function isTextNodeAndContentNoEmpty(node) {
			  return node.nodeType == Node.TEXT_NODE && node.textContent.trim().length > 0
			}
	        
			let range = document.createRange(),
			sel = window.getSelection(),
			lastKnownIndex = -1;
			for (let i = 0; i < el.childNodes.length; i++) {
				if (isTextNodeAndContentNoEmpty(el.childNodes[i])) {
				  lastKnownIndex = i;
				}
			}
			if (lastKnownIndex === -1) {
				throw new Error('Could not find valid text content');
			}
			let row = el.childNodes[lastKnownIndex],
			    col = row.textContent.length;
			range.setStart(row, 0);
			range.setEnd(row, col);
			//range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);
			//el.focus();
		}
	
	
		// this is the body of addRow... 
		{
	        
			const newTableRow = this.#table.insertRow();
	        newTableRow.className = "data-grid-row" + this.#suffix;
			const row = new DataGridRow( this, newRow, newTableRow );
	        
			this.#rows.push( row );
			const this_ = this;
	        
			this.#cells.forEach( cell=>{
	        
				const newCell = {
					cell:cell,
					canEdit : ( ("edit" in cell.type) ? !cell.type.edit : true ),
					el:newTableRow.insertCell(),
					list : null,
					filled : false,
					options : []
				};
				
				newCell.el.className = cell.className + this.#suffix;
				if( cell.type.click ) {
					newCell.el = makeButton( newCell.el, "X", cell.type.click, {suffix:newCell.el.className} );
				}
				else if( cell.type.options ) {
					newCell.list = document.createElement( "select" );
					newCell.el.appendChild( newCell.list );
					cell.newInput = onEdit( cell, newCell, newRow, row );
				}else {
					newCell.el.textContent = "";//cell.;
					newCell.el.setAttribute("contenteditable",newCell.canEdit );
					cell.newInput = onEdit( cell, newCell, newRow, row );
				}
				row.cells.push( newCell );
				// on update; does the right thing for edit boxes and listboxes
				
			} )
	        

			function onEdit( cell, newCell, rowData, row ) {

				const c = newCell.el;

			    	function newInput(evt) {
			    		if( !row.rowData ) {
			    		    // if( cell.type.money )
						//evt.target.textContent += "00";
						if( newCell.list ) {
							fillOptions( newCell );

						}
					    row.rowData = rowData = this_.#newRowCallback(this_.#initialValue);
	        
					    addUpdate( cell, newCell );
					    this_.addRow( null );
						//evt.target.
						
					    setCaret( evt.target, newCell, cell.type.percent?-1:0 );
						//evt.target.setSelectionRange(evt.target.textContent.length, -1);
	        
					}
				}
				function fillOptions(newCell) {
					const cell = newCell.cell;
					
					if( !newCell.filled )  {
						if( cell.type.options ) {
							const opts = cell.type.options;
							if( rowData ) {
								newCell.filled = true;
								opts.forEach( op=>{
									const opt = { el:document.createElement( "option" ),
										val:op };
									opt.el.textContent = op.name;
									opt.el.value = op.value;

									opt.el.addEventListener( "select", ()=>{
										rowData[cell.field] = op.value;
										console.log( "Option selected in context is for:", op );
									} );
									newCell.list.appendChild( opt.el );
									newCell.options.push( opt );
								} );
								rowData[cell.field] = opts[0].value;
							}
						}
						if( newCell.list )
							newCell.list.addEventListener( "change", (evt)=>{ 
								const i = evt.target.selectedIndex; if( i > 0 ) {
									rowData[cell.field] = newCell.options[i].val.value;
								}
							} );
					}
				}
				if( !rowData ) {
					c.addEventListener( "input", newInput );
					c.addEventListener( "click", newInput );
				} else {
					addUpdate( cell, newCell );
					fillOptions( newCell );
				}
				row.addUpdates = addUpdate;
	        
				return  (t)=>{
						this.#subFields.forEach( (key,id)=>{

					    	//const c = this.#cells[id].cell;
					    	const upd = this.#cells[id].upd;
	        
					    	// update current value.
					    	if( upd.money )
							c.textContent = popups.utils.to$( rowData[upd.field] );
						else if( upd.percent )
							c.textContent = popups.utils.toP( rowData[upd.field] );
						else
							c.textContent = rowData[upd.field];
						} );
					};

				function addUpdates( rowData ) {
					if( !row.rowData )	row.rowData = rowData;
					
	        		this_.#cells.forEach( (cell,idx)=>addUpdate( cell, row.cells[idx] ) );
				}

					function addUpdate( cell_header, newCell ) {
						const c = newCell.el;
						const field = cell_header.field;
						const type = cell_header.type;
	        
						if( newCell.list ) {
							fillOptions( newCell );
						} else {

					     	   	// update current value.
							if( c.textContent  !== "" ) {
								
					     	   		if( type.money ) {
									const val = popups.utils.toD( c.textContent );
									c.textContent = popups.utils.to$( val );
								} else if( type.percent ) {
									const val = popups.utils.fromP( c.textContent );
									c.textContent = popups.utils.toP( val );
								}
							} else {
					     	   		if( type.money )
									c.textContent = popups.utils.to$( rowData[cell_header.field] );
								else if( type.percent )
									c.textContent = popups.utils.toP( rowData[cell_header.field] );
								else
									c.textContent = rowData[field];
							}
						}
	        
						c.removeEventListener( "input", newInput );
						c.removeEventListener( "click", newInput );
						
						c.addEventListener( "focus", (evt)=>{
							if( type.percent ) {
								selAll( evt.target, newCell );
							}else
								selAll( evt.target, newCell );
						} );
						c.addEventListener( "blur", (evt)=>{
					    		if( type.money ) {
						    		rowData[field] = popups.utils.toD( c.textContent );
						    		c.textContent = popups.utils.to$( rowData[cell_header.field] );
							}
					    		else if( type.percent ) {
						    		rowData[field] = popups.utils.fromP( c.textContent );
						    		c.textContent = popups.utils.toP( rowData[cell_header.field] );
							}
							else
						    		rowData[field] = c.textContent;
					    	} );
					}
				//}
			}
			return row;
		}
	}

}


/* 

Generic Paged Frame ... along the top or side are navigation controls...

*/

class PageFramePage {
	content = document.createElement( 'div' );
	handle = document.createElement( 'div' );
	pages = null;
	#frame = null;
	#page = null;
	constructor(frame ) {
		if( frame instanceof PagedFrame ) {
			this.#frame = frame;

			this.content.className = 'page-frame-page-container'+frame.suffix;
			this.handle.className = 'page-frame-page-handle'+frame.suffix;
			frame.pages.handleContainer.appendChild( this.handle );
			frame.pages.pageContainer.appendChild( this.content );
			this.handle.addEventListener( "click", (evt)=>{
				this.#frame.activate( this );
			} );
			this.content.style.display = "none";
			frame.pages.push( this );

		} else {
			this.#page = frame;

			this.content.className = 'page-frame-page-page-container'+frame.suffix;
			this.handle.className = 'page-frame-page-page-handle'+frame.suffix;

			frame.pages.handleContainer.appendChild( this.handle );
			frame.pages.pageContainer.appendChild( this.content );

			this.handle.addEventListener( "click", (evt)=>{
				this.activate();
				//this.frame.activate( this );
			} );
			this.content.style.display = "none";
			frame.pages.push( this );
		}
	}

	activate() {
		this.handle.classList.add( "pressed" );
		this.content.style.display="";
		if( this.pages ) {
			this.pages.handleContainer.style.display = "";
		}
		return this;
	}

	deactivate() {
		this.handle.classList.remove( "pressed" );
		this.content.style.display="none";
		if( this.pages ) {
			this.pages.handleContainer.style.display = "none";
		}
		
	}

	get frame() {
		if( this.#frame ) return this.#frame; 
		return this.#page.frame;
	}
	set textContent( text ) {
		this.handle.textContent = text;
	}
	
	appendChild( el ) {
        	this.content.appendChild( el );
	}

	addPage(title, url) {
		if( !this.pages ) {
			if( this.#frame ) 
				this.pages = new PageFramePages( this, this.#frame.suffix );
			else 
				this.pages = new PageFramePages( this, this.frame.suffix );
			this.pages.handleContainer.style.display = "none";
		}
		const pf = new PageFramePage( this );
		pf.textContent = title;
		if( url )
			fillFromURL( pf.content, url );
		return pf;	
	}


}

class PageFramePages extends Array {
	handleContainer = document.createElement( 'div' );
	pageContainer = document.createElement( 'div' );
	
	#frame = null;
	#page = null;
	constructor( frame, suffix ) {
	        super();
		if( frame instanceof PagedFrame ) {
			this.#frame = frame;
			this.handleContainer.className = 'page-frame-handle-container' + suffix;
			this.pageContainer.className = 'page-frame-page-frame' + suffix;
			frame.frame.appendChild( this.handleContainer );
			frame.frame.appendChild( this.pageContainer );
		}else if( frame instanceof PageFramePage ) {
			this.#page = frame;
			this.handleContainer.className = 'page-frame-page-handle-container' + suffix;
			this.pageContainer.className = 'page-frame-page-page-frame' + suffix;
			frame.frame.pages.handleContainer.appendChild( this.handleContainer );
			frame.content.appendChild( this.pageContainer );
		}
	}
}


class  PagedFrame {

	frame = document.createElement( 'div' );

        pages = null;
	
	#oldPage = null;
        suffix = '';
	constructor( parent, opts ) {
		opts = opts || {};
		const alignTop = ( opts.top ) ;
		const pageDefs =  opts.pages;

		this.suffix = (alignTop?"-top":"") + ((opts?.suffix)?'-'+opts.suffix:'');


		this.frame.className = 'page-frame' + this.suffix;
				
		this.pages = new PageFramePages( this, this.suffix );

       		if( pageDefs )
			for( let pageDef of pageDefs ) {
				this.addPage( pageDef.title, pageDef.url );
			}
		if( this.pages.length)
		this.activate( this.pages[0] );
		parent.appendChild( this.frame );
	}


	addPage(title, url) {
			const pf = new PageFramePage( this );
			pf.textContent = title;
			if( url )
				fillFromURL( pf.content, url );
			return pf;				
	       }


	activate( page ) {
		if( this.#oldPage ) {
			this.#oldPage.deactivate();
		}
		this.#oldPage = page.activate();
	}

}


export {Popup};

const popups = {
	Popup:Popup,
	defaultDrag : true,
	autoRaise : true,
	create : createPopup,
	simpleForm : createSimpleForm,
	simpleNotice : createSimpleNotice,
        makeList : createList,
        makeCheckbox : makeCheckbox,
        makeRadioChoice : makeRadioChoice,
        makeLeftRadioChoice : makeLeftRadioChoice,
        makeNameInput : makeNameInput,  // form, object, field, text; popup to rename
        makeTextInput : makeTextInput,  // form, object, field, text
        makeSlider : makeSlider,  // form, object, field, text
        makeTextField : makeTextField,
        makeButton : makeButton,
	handleButtonEvents : handleButtonEvents, // expose just the button handler of makeButton
        makeChoiceInput : makeChoiceInput,// form, object, field, choiceArray, text
        makeDateInput : makeDateInput,  // form, object, field, text
	strings : { get(s) { return s } },
	setClass: setClass,
	toggleClass: toggleClass,
	clearClass:clearClass,
	createMenu : createPopupMenu,
        makeLoginForm: makeLoginForm,
        makeWindowManager : makeWindowManager,
        fillFromURL : fillFromURL,
	utils : utils, // expose formatting utility functions.
	DataGrid,
	PagedFrame,
	ValueOfType,  // carry formatting information with value
	AlertForm:AlertForm,
	Alert,
	getParentPopup( id ) {
		return filledControls.get( id );
	}
}

export {popups};

export default popups;