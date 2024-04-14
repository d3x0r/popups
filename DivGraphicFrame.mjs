
import {Popup} from "./popups.mjs"

export class DivGraphicFrame extends Popup {
	static frames = [];

	frameFrame = null;
	leftWidth = 54;		
	topWidth = 54;
	rightWidth = 58;
	bottomWidth = 55;
	mouseSection = 0;
	draw = null;
	mouse = null;
	canvas = document.createElement( "canvas" )
		 ctx = null
		 w= 0
		 h = 0
		 x= 0
		 y = 0
		 sx = 0//leftWidth
		 sy = 0//topWidth
		 sw = 0//w - ( leftWidth+rightWidth )
		 sh = 0//h - ( topWidth+bottomWidth )
		 sizing = false
		 dragging = false
		 startX = 0
		 startY = 0

	controlGroup = document.createElement( "div" );

	controlGroupRows = [document.createElement( "div" ),document.createElement( "div" ),document.createElement( "div" )];

	controlSet = {
		ul : document.createElement( "div" ), 
		u : document.createElement( "div" ), 
		ur : document.createElement( "div" ),
		l : document.createElement( "div" ), 
		c : document.createElement( "div" ), 
		r : document.createElement( "div" ),
		bl : document.createElement( "div" ), 
		b : document.createElement( "div" ), 
		br : document.createElement( "div" ),
	}


	sliceImage( image ) {
		
		const canvas = document.createElement( "canvas" );
		const ctx = canvas.getContext( "2d" );
		
		const {leftWidth,topWidth,rightWidth,bottomWidth} = this;


		//------------ corners ------------------
		let s;
		canvas.width = leftWidth;
		canvas.height =  topWidth;
		ctx.clearRect( 0, 0, canvas.width, canvas.height );
		ctx.drawImage( image, 0, 0 );
		const ul_corner = canvas.toDataURL( "png" );
		s = this.controlSet.ul.style;
		s.backgroundImage = "url('"+ul_corner+"')";
		s.position = "absolute";
		s.left = 0;
		s.top = 0;
		s.width = leftWidth;
		s.height = topWidth;


		//ctx.drawImage(frameFrame, 0, 0, leftWidth, topWidth, 0, 0, leftWidth, topWidth );
		

		canvas.width = rightWidth;
		canvas.height =  topWidth;
		ctx.clearRect( 0, 0, canvas.width, canvas.height );
		ctx.drawImage( image, -image.width+rightWidth, 0 );
		const ur_corner = canvas.toDataURL( "png" );
		s = this.controlSet.ur.style;
		s.backgroundImage = "url('"+ur_corner+"')";
		s.position = "absolute";
		s.right = 0;
		s.top = 0;
		s.width = rightWidth;
		s.height = topWidth;


		//ctx.drawImage(frameFrame, frameFrame.width-rightWidth, 0, leftWidth, topWidth, frame.canvas.width-rightWidth, 0, leftWidth, topWidth );


		canvas.width = leftWidth;
		canvas.height =  topWidth;
		ctx.clearRect( 0, 0, canvas.width, canvas.height );
		ctx.drawImage( image, 0, -image.height+bottomWidth );
		const bl_corner = canvas.toDataURL( "png" );
		s = this.controlSet.bl.style;
		s.backgroundImage = "url('"+bl_corner+"')";
		s.position = "absolute";
		s.left = 0;
		s.bottom = 0;
		s.width = leftWidth;
		s.height = bottomWidth;


		//ctx.drawImage(frameFrame, 0, src.height-bottomWidth, leftWidth, topWidth, 0, frame.canvas.height - bottomWidth, leftWidth, bottomWidth );

		canvas.width = rightWidth;
		canvas.height =  bottomWidth;
		ctx.clearRect( 0, 0, canvas.width, canvas.height );
		ctx.drawImage( image, -image.width+rightWidth, -image.height+bottomWidth );
		const br_corner = canvas.toDataURL( "png" );
		s = this.controlSet.br.style;
		s.backgroundImage = "url('"+br_corner+"')";
		s.position = "absolute";
		s.right = 0;
		s.bottom = 0;
		s.width = rightWidth;
		s.height = bottomWidth;


		//ctx.drawImage(frameFrame, frameFrame.width-rightWidth, src.height-bottomWidth, rightWidth, bottomWidth
		//	, frame.canvas.width-rightWidth, frame.canvas.height - bottomWidth, rightWidth, bottomWidth );

		canvas.width = image.width-(leftWidth+rightWidth);
		canvas.height =  topWidth;
		ctx.clearRect( 0, 0, canvas.width, canvas.height );
		ctx.drawImage( image, -leftWidth, 0 );
		const u_corner = canvas.toDataURL( "png" );
		s = this.controlSet.u.style;
		s.backgroundImage = "url('"+u_corner+"')";
		s.backgroundSize="100% 100%";
		s.position = "absolute";
		s.left = leftWidth;
		s.top = 0;
		s.right = rightWidth;
		s.height = canvas.height;


		// top-bottom
		//ctx.drawImage(frameFrame, leftWidth, 0
		//	, src.width-(leftWidth+rightWidth), topWidth
		//	, leftWidth, 0, frame.canvas.width-(leftWidth+rightWidth), topWidth );


		canvas.width = image.width-(leftWidth+rightWidth);
		canvas.height =  bottomWidth;
		ctx.clearRect( 0, 0, canvas.width, canvas.height );
		ctx.drawImage( image, -leftWidth, -image.height+bottomWidth );
		const b_corner = canvas.toDataURL( "png" );
		s = this.controlSet.b.style;
		s.backgroundImage = "url('"+b_corner+"')";
		s.backgroundSize="100% 100%";
		s.position = "absolute";
		s.left = leftWidth;
		s.bottom = 0;
		s.right = rightWidth;
		s.height = canvas.height;

		//ctx.drawImage(frameFrame, leftWidth, src.height-bottomWidth
		//	, src.width-(leftWidth+rightWidth), bottomWidth
		//	, leftWidth, frame.canvas.height-bottomWidth
		//	, frame.canvas.width-(leftWidth+rightWidth), bottomWidth );

		canvas.width = leftWidth;
		canvas.height =  image.height - topWidth - bottomWidth;
		ctx.clearRect( 0, 0, canvas.width, canvas.height );
		ctx.drawImage( image, 0, -topWidth );
		const l_corner = canvas.toDataURL( "png" );
		s = this.controlSet.l.style;
		s.backgroundImage = "url('"+l_corner+"')";
		s.backgroundSize="100% 100%";
		s.position = "absolute";
		s.left = 0;
		s.top = topWidth;
		s.width = leftWidth;
		s.bottom = bottomWidth;

		// left-right
		//ctx.drawImage(frameFrame, 0, topWidth
		//	, leftWidth, src.height-(topWidth+bottomWidth)
		//	, 0, topWidth
		//	, leftWidth, frame.canvas.height-(topWidth+bottomWidth) );

		canvas.width = rightWidth;
		canvas.height =  image.height - topWidth - bottomWidth;
		ctx.clearRect( 0, 0, canvas.width, canvas.height );
		ctx.drawImage( image, -image.width+ rightWidth, -topWidth );
		const r_corner = canvas.toDataURL( "png" );
		s = this.controlSet.r.style;
		s.backgroundImage = "url('"+r_corner+"')";
		s.backgroundSize="100% 100%";
		s.position = "absolute";
		s.right = 0;
		s.top = topWidth;
		s.bottom = bottomWidth;
		s.width = canvas.width;

		//ctx.drawImage(frameFrame, src.width - rightWidth, topWidth
		//	, rightWidth, src.height-(topWidth+bottomWidth)
		//	, frame.canvas.width - rightWidth, topWidth
		//	, rightWidth, frame.canvas.height-(topWidth+bottomWidth) );

		canvas.width = image.width - leftWidth - rightWidth;;
		canvas.height =  image.height - topWidth - bottomWidth;
		ctx.clearRect( 0, 0, canvas.width, canvas.height );
		ctx.drawImage( image, -leftWidth, -topWidth );
		const c_corner = canvas.toDataURL( "png" );
		s = this.controlSet.c.style;
		s.backgroundImage = "url('"+c_corner+"')";
		s.backgroundSize="100% 100%";
		s.position = "absolute";
		s.left = leftWidth;
		s.top = topWidth;
		s.right = rightWidth;
		s.bottom = bottomWidth;


		//ctx.drawImage(frameFrame
		//	, leftWidth, topWidth, src.width-(leftWidth+rightWidth), src.height-(topWidth+bottomWidth)
		//	, leftWidth, topWidth, frame.canvas.width-(leftWidth+rightWidth), frame.canvas.height-(topWidth+bottomWidth) );


		
	}

	constructor (opts) {
    	super(null,null);
		this.useMouse = false;

		const appCanvas = this.divFrame;

		this.divFrame.style.position = "relative";
		this.divFrame.appendChild( this.controlGroup );
		this.controlGroup.appendChild( this.controlGroupRows[0] );		
		this.controlGroupRows[0].appendChild( this.controlSet.ul );
		this.controlGroupRows[0].appendChild( this.controlSet.u );
		this.controlGroupRows[0].appendChild( this.controlSet.ur );

		this.controlGroup.appendChild( this.controlGroupRows[1] );		
		this.controlGroupRows[1].appendChild( this.controlSet.l );
		this.controlGroupRows[1].appendChild( this.controlSet.c );
		this.controlGroupRows[1].appendChild( this.controlSet.r );

		this.controlGroup.appendChild( this.controlGroupRows[2] );		
		this.controlGroupRows[2].appendChild( this.controlSet.bl );
		this.controlGroupRows[2].appendChild( this.controlSet.b );
		this.controlGroupRows[2].appendChild( this.controlSet.br );


		//this.draw = _draw;
		//this.mouse = _mouse;
	
		var rect = appCanvas.getBoundingClientRect();
		//appCanvas.style.width = rect.right-rect.left;//window.innerWidth;
		//appCanvas.style.height = rect.bottom-rect.top;//window.innerHeight;
		var appSizing;
		var usingSection;
		var appDragging;

		this.divContent.style.left = opts.image.left;
		this.divContent.style.top = opts.image.top;
		this.divContent.style.zIndex = 3;
		this.divContent.style.position = "absolute";	


		//-----------------------------------------------------------------------
		this.sx = opts.image.left;//this.leftWidth;
		this.sy = opts.image.top;//this.topWidth;
		this.setWidth( opts.width );
		this.setHeight( opts.height );
		this.setFrame( opts.image.url );
		this.divFrame.className = "graphic-frame-container";

		//this.divContent.remove();
		//this.frame.canvas.appendChild( this.divContent );
		
		//this.frame.ctx.font = defaultFont1;
		//frame.ctx.fillRect( 0,0,100,100 );
		//appCtx.fillRect( 0,0,100,100 );



		//appCanvas.addEventListener( "mousemove", mouseMove );
		//appCanvas.addEventListener( "mouseup", mouseUp );
		//appCanvas.addEventListener( "mousedown", mouseDown );
		document.body.addEventListener( "mousemove", mouseMove );
		document.body.addEventListener( "mouseup", mouseUp );
		document.body.addEventListener( "mousedown", mouseDown );


		var prior_buttons;
		const _MK_LBUTTON = 1;
		const _MK_RBUTTON = 2;
		const _MK_MBUTTON = 4;
		var zz = 0;
		const this_ = this;
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
				//console.log( "Drag:", m );
				this_.divFrame.style.left = (appDragging.x += m.x - appDragging.startX);
				this_.divFrame.style.top = (appDragging.y += m.y - appDragging.startY);
			}

			if( ( onFrame = appSizing && ( ( wasMouse = appSizing.getMouse( cx, cy ) ), wasMouse.section = usingSection, appSizing ) ) 
			|| ( onFrame = (wasMouse = this_.isMouse( cx, cy ) )&&this_) ) {
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
							onFrame.divFrame.style.left = (onFrame.x += wasMouse.x - onFrame.startX);
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
						onFrame.divFrame.style.top = (onFrame.y += wasMouse.y - onFrame.startY);
					} else if( appDragging && !( b & _MK_LBUTTON ) && (prior_buttons & _MK_LBUTTON ) ) {
						appDragging = null;
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
						onFrame.divFrame.style.left = (onFrame.x += wasMouse.x - onFrame.startX);
						onFrame.divFrame.style.top = (onFrame.y += wasMouse.y - onFrame.startY);
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
						onFrame.divFrame.style.top = (onFrame.y += wasMouse.y - onFrame.startY);
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
						onFrame.divFrame.style.left = (onFrame.x += wasMouse.x - onFrame.startX);
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
			}

			if( !appSizing && !appDragging ) {
					document.body.removeEventListener( "mousemove", mouseMove );
			}

			if( wasMouse && !wasMouse.section && onFrame ) {
				//onFrame.mouse(
			}

			{ // LEFT BTUTTON
				if( ( b & _MK_LBUTTON ) && !(prior_buttons & _MK_LBUTTON ) ) {
					document.body.addEventListener( "mousemove", mouseMove );

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
			//console.log( "Event at:", evt.target );
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




	}

	setFrame( image ) {
		var img = document.createElement( "IMG" );
		img.src=image;
		const this_ = this;
		img.onload = function() {
			this_.frameFrame = img;
			console.log( "have image loaded?" );

			this_.sliceImage(img)
			
		}
	}
	setWidth( w ) {

		this.divFrame.style.width = this.w = w;
		this.sw = this.w - (this.leftWidth+this.rightWidth);
		const cs = window.getComputedStyle( this.divContent, null );

		const p = parseInt(cs.padding, 10);
		const m = parseInt(cs.margin, 10);
		this.divContent.style.width = ( this.canvas.style.width = this.canvas.width = this.w ) - (this.leftWidth+this.rightWidth+ 2*(p+m));
		
		//this.drawFrame();
	}
	setHeight( h ) {

		this.divFrame.style.height = this.h = h;
		this.sh = this.h - (this.topWidth+this.bottomWidth);
		this.divContent.style.height = (this.canvas.style.height = this.canvas.height = this.h)  - (this.topWidth+this.bottomWidth+ 16+10);
//		this.drawFrame();

	}
	setDraw( cb ) { draw = cb }
	getMouse( x, y ) {
		var sx, sy, tx, ty, farx = false, fary = false;
		const {leftWidth,topWidth,rightWidth,bottomWidth} = this;
	
		ty=y;
		if( (tx=x) > leftWidth && (ty) > topWidth ) {
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
	isMouse( x, y ) {
		var sx, sy, tx, ty, farx = false, fary = false;
		const {leftWidth,topWidth,rightWidth,bottomWidth} = this;
		

		if( x > 0 && y > 0 && x < (0+this.w) && y < (this.h) ) {
			ty=y;
			if( (tx=x) > leftWidth && (ty) > topWidth ) {
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


}

