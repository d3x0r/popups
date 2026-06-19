/**
 * @fileoverview Formatting + stylesheet-insertion helpers. Pulled verbatim
 * from popups.mjs except: the Popup-instance check in addPopupStyles and
 * addStyleSheetSrc is now duck-typed (divFrame/divShadow) to avoid a circular
 * import on Popup.
 */

/** Path-resolved URL to the default popup stylesheet. */
let defaultStyle = ( new URL( "../dark-styles.css", import.meta.url ) ).href;

/** @param {any} o */
function isPopupLike( o ) {
	return o && ( o.divShadow || o.divFrame );
}

/**
 * @typedef {object} Utils
 * @property {number}                                ROUND_DOWN
 * @property {number}                                ROUND_UP
 * @property {number}                                ROUND_NATURAL
 * @property {(val:number|string, rounder?:number)=>string} to$    Format integer cents (×100) as currency string.
 * @property {(s:string|number)=>number}                    toD    Parse currency string → integer cents.
 * @property {(p:string|number)=>string}                    toP    Render as percent string.
 * @property {(p:string)=>number}                           fromP  Parse percent string → number.
 * @property {(container:Node|ShadowRoot, baseUrl?:string)=>void}                    preAddPopupStyles
 * @property {(container:any, styleUrl:string, baseUrl?:string)=>void}                addPopupStyles
 * @property {(container:Node, sheet:Node)=>void}                                     preAddStyleStyleSheet
 * @property {(container:Node, src:string, baseUrl?:string)=>void}                    preAddStyleStyleSrc
 * @property {(container:any, src:string, baseUrl?:string)=>Promise<void>}             addStyleSheetSrc
 * @property {string}                                                                  defaultStyle
 */

/** @type {Utils} */
export const utils = {
	ROUND_DOWN: 1,
	ROUND_UP: 2,
	ROUND_NATURAL: 3,

	to$( val, rounder ) {
		if( "string" === typeof val ) val = utils.toD( val );
		function pad( val, n ) {
			if( val.length < n ) {
				val = '00000'.substr( 0, n - val.length ) + val;
			}
			return val;
		}
		let negate = false;
		if( val < 0 ) { val = -val; negate = true; }
		var digits = Math.log10( val ) - 2;
		var n;
		var r = '';
		var c = ( val / 100 ) | 0;
		var cnts;
		if( cnts = val % 100 ) {
			if( rounder === 1 ) {
				if( val < 0 ) val -= 1;
				else          val += 1;
			} else if( rounder === 2 ) {
				if( val < 0 ) val += 1;
				else          val -= 1;
			} else if( rounder === 3 ) {
				if( val < 0 )
					if( cnts >= 50 ) val -= 1;
					else             val += 1;
				else
					if( cnts >= 50 ) val += 1;
					else             val -= 1;
			}
			else
				r = '.' + pad( ( val % 100 ).toString(), 2 );
		}
		if( digits >= 3 ) {
			for( n = 0; n <= digits - 3; n += 3 ) {
				r = "," + pad( ( ( c % 1000 ) | 0 ).toString(), 3 ) + r;
				c = ( c / 1000 ) | 0;
			}
		}
		r = ( negate ? "-" : "" ) + '$' + ( c % 1000 ) + r;
		return r;
	},

	toD( $ ) {
		if( "string" !== typeof $ )
			$ = $.toString();
		let negate = false;
		if( $[0] === '-' ) { $ = $.substr( 1 ); negate = true; }
		if( $[0] === '$' )
			$ = $.substr( 1 );
		var i = $.indexOf( '.' );
		if( i >= 0 && $.length - i > 2 ) {
			var trunc = $.split( ',' ).join( '' ).split( '.' );
			trunc[trunc.length - 1] = trunc[trunc.length - 1].substr( 0, 2 );
			return ( negate ? -1 : 1 ) * Number( trunc.join( '' ) );
		} else if( i >= 0 && $.length - i == 3 )
			return ( negate ? -1 : 1 ) * Number( $.split( ',' ).join( '' ).split( '.' ).join( '' ) );
		else if( i >= 0 && $.length - i == 2 )
			return ( negate ? -1 : 1 ) * Number( $.split( ',' ).join( '' ).split( '.' ).join( '' ) ) * 10;
		return ( negate ? -1 : 1 ) * ( Number( $.split( ',' ).join( '' ) ) * 100 ) | 0;
	},

	toP( p ) {
		if( "string" !== typeof p )
			p = p.toString();
		return p + "%";
	},
	fromP( p ) {
		p = p.split( '%' ).join( '' );
		return Number( p );
	},

	preAddPopupStyles( container, baseUrl ) {
		const style = document.createElement( "link" );
		style.rel = "stylesheet";
		if( baseUrl && baseUrl.startsWith( "file://" ) ) {
			// no-op for file:// — kept for parity with original
		} else {
			style.href = new URL( defaultStyle, baseUrl || location.href ).href;
			container.insertBefore( style, container.childNodes[0] || null );
		}
	},

	addPopupStyles( container, styleUrl, baseUrl ) {
		if( isPopupLike( container ) ) {
			if( container.divShadow ) container = container.divShadow;
			else container = container.divFrame;
		}
		if( container.shadowRoot ) container = container.shadowRoot;
		const style = document.createElement( "link" );
		style.rel = "stylesheet";
		style.href = new URL( styleUrl, baseUrl || null ).href;
		let before = container.firstChild;
		while( before && before.tagName === "LINK" ) before = before.nextSibling;
		container.insertBefore( style, before );
	},

	preAddStyleSheet: null,
	preAddStyleStyleSheet( container, sheet ) {
		container.insertBefore( sheet, container.childNodes[0] || null );
	},

	preAddStyleSrc: null,
	preAddStyleStyleSrc( container, src, baseUrl ) {
		const style = document.createElement( "link" );
		style.rel = "stylesheet";
		style.href = baseUrl ? new URL( src, baseUrl ) : src;
		container.insertBefore( style, container.childNodes[0] || null );
	},

	addStyleSheet( container, src ) {
		let lastOwner;
		for( let style of container.styleSheets ) {
			lastOwner = style.ownerNode;
		}
		if( lastOwner )
			lastOwner.parentNode.insertBefore( src, lastOwner.nextSibling );
	},

	addStyleSheetSrc( container, src, baseUrl ) {
		return new Promise( ( res, rej ) => {
			const style = document.createElement( "link" );
			style.rel = "stylesheet";
			style.href = baseUrl ? new URL( src, baseUrl ) : src;
			let lastOwner = null;
			style.onload = () => { res(); };
			if( isPopupLike( container ) ) {
				if( container.divShadow ) container = container.divShadow.shadowRoot;
			}
			if( container.styleSheets )
				for( let style of container.styleSheets ) {
					lastOwner = style.ownerNode;
				}
			if( lastOwner )
				lastOwner.parentNode.insertBefore( style, lastOwner.nextSibling );
			else {
				let child = container.firstChild;
				while( child && child.nodeName === "LINK" ) child = child.nextSibling;
				if( !child ) container.appendChild( style );
				else        container.insertBefore( style, child );
			}
		} );
	},

	get defaultStyle() { return defaultStyle; },
	set defaultStyle( val ) { defaultStyle = val; },
};

utils.preAddStyleSheet = utils.preAddStyleStyleSheet;
utils.preAddStyleSrc = utils.preAddStyleStyleSrc;
