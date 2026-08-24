/**
 * @fileoverview One place that decides how a suffix joins a class name.
 *
 * Every control used to build its own names by plain concatenation
 * (`"listItem" + suffix`), while a few spots inserted a separator
 * (`"list-" + suffix`). The result was that `.listItem-winner-select` — the
 * obvious thing to write in a stylesheet — never matched anything, and callers
 * were pushed into prefix selectors like `[class^="buttonverify-"]`, which then
 * collide with unrelated suffixes ("verify-accept" vs "verify-button").
 *
 * The rule: no suffix adds nothing; a suffix already starting with `-` is taken
 * as-is; anything else gets a `-` in front.
 */

/**
 * Join a class-name base and a suffix.
 * @param {string} base - class name without any suffix, e.g. "listItem".
 * @param {string} [suffix] - the variant, with or without a leading "-".
 * @returns {string} the class name to use.
 */
export function suffixed( base, suffix ) {
	if( !suffix ) return base || "";
	if( !base ) return suffix;
	return base + ( suffix.startsWith( "-" )?"":"-" ) + suffix;
}

/**
 * Combine two suffixes - a popup's and a control's - into one. Same rule, so
 * nesting cannot produce the run-together names ("game-selectorgame-select")
 * that plain concatenation gave.
 * @param {string} [outer]
 * @param {string} [inner]
 * @returns {string}
 */
export function joinSuffix( outer, inner ) {
	if( !outer ) return inner || "";
	if( !inner ) return outer;
	return suffixed( outer, inner );
}
