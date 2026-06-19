/**
 * @fileoverview Loads HTML fragments from a URL into a Popup (or any element)
 * via a shadow root, rewrites embedded `<script>` nodes so they execute, and
 * tracks pending scripts so callers can wait for fully-loaded forms.
 *
 * The injected scripts call `window.d3x0r.popups.scriptPending.remove(rootId)`
 * when they finish, so `scriptPending` must be reachable on the global popups
 * namespace at runtime. `bundles/all.js` wires that up.
 */

import { Popup } from "./popup.js";
import { utils } from "./utils.js";

/**
 * @typedef {string[] & { remove: (id: string) => void }} ScriptPendingList
 */

/**
 * Shared singleton state. If a prior load already installed `window.d3x0r.popups`
 * with these fields, reuse them — otherwise create fresh instances. This is
 * what makes `popups.scriptPending.remove(rootId)` from an injected `<script>`
 * resolve to the same array that fillFromURL pushed to, even when the page and
 * the injected script were loaded from different copies of this module.
 */
const shared = ( typeof window !== "undefined" && window.d3x0r && window.d3x0r.popups ) || null;

/** Monotonically-increasing id for generated `<script>` tags. */
let unique = Date.now();

/**
 * @type {Map<string, ShadowRoot>}
 * Map from generated script-id → the shadow root that owns it. Used by
 * consumers (`getFilledParent`) to find the host shadow for a script.
 */
export const filledControls = shared?.filledControls ?? new Map();

/** @type {{ id: string, cb: () => void }[]} */
export const scriptWaiting = shared?.scriptWaiting ?? [];

/** @type {ScriptPendingList} */
export const scriptPending = /** @type {ScriptPendingList} */ (
	shared?.scriptPending ?? ( () => {
		const arr = /** @type {ScriptPendingList} */ ( [] );
		arr.remove = ( n ) => {
			const id = arr.indexOf( n );
			scriptWaiting.forEach( ( wait, index ) => {
				if( wait.id === id ) wait.cb();
				scriptWaiting.splice( index, 1 );
			} );
			if( id >= 0 ) arr.splice( id, 1 );
		};
		return arr;
	} )()
);

/**
 * Resolve a URL string against `location` if it's not absolute.
 * @param {string} url
 * @returns {URL}
 */
export function makeURL( url ) {
	try {
		return new URL( url );
	} catch( err ) {
		return new URL( url, location );
	}
}

/**
 * @typedef {object} FillFromURLOptions
 * @property {string} [origin]           Prefix to inject before non-absolute `src`/`href`/`from` paths in the loaded HTML.
 * @property {boolean} [noDefaultStyle]  Skip injecting the default popup stylesheet into the shadow root.
 * @property {boolean} [addScriptsToBody] Re-host cloned `<script>` tags on `document.body` instead of in-place.
 */

/**
 * Load HTML from `url` into the popup/element's shadow root, rewriting any
 * `<script>` tags so they execute and any `<link>` tags so they resolve.
 * @param {Popup | HTMLElement} popup
 * @param {string} url
 * @param {FillFromURLOptions} [opts]
 * @returns {Promise<ShadowRoot>}
 */
export function fillFromURL( popup, url, opts ) {
	opts = opts || {};
	// Duck-typed unwrap. `instanceof Popup` fails when `popup` was constructed
	// by a different module-graph load (singleton namespace, but distinct class
	// identity per load). Match by shape instead: any object with divContent or
	// divFrame is treated as a Popup-like for unwrapping; anything else
	// (Element, ShadowRoot) is used directly.
	const isPopupLike = popup && typeof popup.attachShadow !== "function"
		&& ( popup.divContent || popup.divFrame );
	const control = isPopupLike ? ( popup.divContent || popup.divFrame ) : popup;
	const shadow = control.attachShadow( { mode: "open" } );
	if( isPopupLike ) {
		popup.divContentParent_ = popup.divContent_;
		popup.divContent_ = shadow;
	}
	const base = new URL( url, location.href );
	const pathIndex = base.pathname.lastIndexOf( "/" );
	base.pathname = base.pathname.substring( 0, pathIndex );
	const here = new URL( location );
	const herePathIndex = here.pathname.lastIndexOf( "/" );
	here.pathname = here.pathname.substring( 0, herePathIndex + 1 );

	return fetch( url ).then( response => response.text().then( ( text ) => {
		if( opts.origin ) {
			let n = 0;
			while( n < text.length ) {
				const k = text.indexOf( "from \"", n );
				const j = text.indexOf( "href=", n );
				const i = text.indexOf( "src=", n );
				if( i < 0 && j < 0 && k < 0 ) break;
				if( ( i < 0 && j < 0 ) || ( k >= 0 && ( i < 0 || k < i ) && ( j < 0 || k < j ) ) )
					n = k + 6;
				else if( i < 0 || ( j >= 0 && j < i ) )
					n = j + 6;
				else
					n = i + 5;
				if( text[n] !== '/' || text[n] == '.' )
					text = text.substring( 0, n ) + opts.origin + text.substring( n );
			}
		}
		shadow.innerHTML = text;
		if( !opts.noDefaultStyle ) utils.preAddPopupStyles( shadow );
		nodeScriptReplace( shadow, opts.addScriptsToBody );
		return shadow;
	} ) );

	/**
	 * @param {Node} node
	 * @param {boolean} [addScriptsToBody]
	 * @param {Node[]} [replaced]
	 */
	function nodeScriptReplace( node, addScriptsToBody, replaced ) {
		const replaced_ = replaced || [];
		if( node.tagName === "LINK" ) {
			if( node.href.includes( base.href ) ) {
				const u = new URL( node.href.substring( base.length ), base.href );
				node.href = u.href;
			}
		} else if( nodeScriptIs( node ) === true ) {
			const clone = nodeScriptClone( node );
			replaced_.push( clone );
			if( addScriptsToBody ) {
				document.body.appendChild( clone );
				node.remove();
			} else {
				node.parentNode.replaceChild( clone, node );
			}
			return clone;
		} else {
			let i = -1;
			const children = node.childNodes;
			while( ++i < children.length ) {
				replaced_.push( nodeScriptReplace( children[i], addScriptsToBody, replaced_ ) );
			}
		}
		return node;
	}

	/** @param {HTMLScriptElement} node */
	function nodeScriptClone( node ) {
		const script = document.createElement( "script" );
		script.text = node.innerHTML;
		let i = -1;
		const attrs = node.attributes;
		while( ++i < attrs.length ) {
			const attr = attrs[i];
			script.setAttribute( attr.name, attr.value );
		}
		script.id = "Unique" + ( unique++ );
		filledControls.set( script.id, shadow );
		if( script.textContent && script.textContent.length ) {
			scriptPending.push( script.id );
			script.textContent = "const rootId='" + script.id + "';"
				+ script.textContent
				+ ";window.d3x0r.popups.scriptPending.remove( rootId );";
		}
		return script;
	}

	/** @param {Node} node */
	function nodeScriptIs( node ) {
		return node.tagName === 'SCRIPT' && node.type != "importmap";
	}
}
