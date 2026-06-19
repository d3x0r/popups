/**
 * @fileoverview Control registry. Each control module is a side-effect import
 * that calls `registerControl(name, ControlClass)`. The class's constructor
 * takes the same arguments as the original makeXxx factory functions.
 *
 * Registration installs `popups.<name>(...args)` as a factory on the popups
 * namespace — matching the original popups.mjs API exactly. Nothing is
 * installed on Popup.prototype; calls go through the namespace, not the
 * instance.
 *
 * The target namespace is set by popups.js via setRegistrationTarget(), with
 * a fallback to `window.d3x0r.popups` for late-loaded controls. The
 * "previously installed by us" tracking is stored on the namespace itself
 * (singleton-shared) so cross-load re-registration works without spurious
 * collision throws.
 */

/** @type {object|null} */
let registrationTarget = null;

/** @type {Array<{ name: string, Ctor: any }>} */
const pendingRegistrations = [];

/** Per-load convenience cache for getControl/listControls. */
const registered = new Map();

/** Internal key on the popups namespace tracking names we installed. */
const INSTALLED_KEY = "__registeredControls";

/**
 * Wire the popups namespace that should receive `popups.<name>` factory
 * entries. Called by popups.js once the namespace exists. Drains any
 * registrations that arrived before this point (control modules whose
 * top-level imports executed before popups.js finished initializing).
 * @param {object} ns
 */
export function setRegistrationTarget( ns ) {
	registrationTarget = ns;
	for( const { name, Ctor } of pendingRegistrations ) {
		install( name, Ctor, ns );
	}
	pendingRegistrations.length = 0;
}

function resolveTarget() {
	if( registrationTarget ) return registrationTarget;
	if( typeof window !== "undefined" && window.d3x0r && window.d3x0r.popups )
		return window.d3x0r.popups;
	return null;
}

/**
 * @param {string} name
 * @param {any}    Ctor
 * @param {object} target
 */
function install( name, Ctor, target ) {
	/** @type {Set<string>} */
	let installed = target[INSTALLED_KEY];
	if( !installed ) {
		installed = new Set();
		Object.defineProperty( target, INSTALLED_KEY, {
			value: installed, enumerable: false, configurable: false, writable: false,
		} );
	}
	if( !installed.has( name ) && name in target ) {
		throw new Error( `registerControl: "${name}" collides with popups.${name}` );
	}
	target[name] = ( ...args ) => new Ctor( ...args );
	installed.add( name );
}

/**
 * @template {new(...args: any[]) => any} T
 * @param {string} name  Factory name (e.g. "makeCheckbox").
 * @param {T} Ctor       Control class.
 * @returns {T}
 * @throws  If `name` would clobber a namespace member we didn't install
 *          ourselves (deferred until the namespace is available).
 */
export function registerControl( name, Ctor ) {
	registered.set( name, Ctor );
	const target = resolveTarget();
	if( !target ) {
		pendingRegistrations.push( { name, Ctor } );
		return Ctor;
	}
	install( name, Ctor, target );
	return Ctor;
}

/**
 * @param {string} name
 * @returns {(new(...args: any[]) => any) | undefined}
 */
export function getControl( name ) {
	return registered.get( name );
}

/** @returns {string[]} */
export function listControls() {
	return Array.from( registered.keys() );
}
