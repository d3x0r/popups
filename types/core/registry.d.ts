/**
 * @template {new(...args: any[]) => any} T
 * @param {string} name  Legacy factory name (e.g. "makeCheckbox").
 * @param {T} Ctor       Control class.
 * @returns {T}
 */
export function registerControl<T extends new (...args: any[]) => any>(name: string, Ctor: T): T;
/**
 * @param {string} name
 * @returns {(new(...args: any[]) => any) | undefined}
 */
export function getControl(name: string): (new (...args: any[]) => any) | undefined;
/** @returns {string[]} */
export function listControls(): string[];
