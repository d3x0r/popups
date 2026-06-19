/**
 * @fileoverview Tiny i18n shim. Replace `strings.get` to localize. Kept as
 * its own module so controls can import it without pulling the whole popups
 * namespace.
 */
/** @typedef {{ get: (s: string) => string }} StringsTable */
/** @type {StringsTable} */
export const strings: StringsTable;
export type StringsTable = {
    get: (s: string) => string;
};
