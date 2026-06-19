/**
 * @fileoverview Lightweight event emitter. Vendored copy of the original
 * popups.mjs Events class. TODO: migrate to sack.vfs/Events2 when a browser-
 * standalone build of it is published; not worth the dependency weight for
 * ~20 lines today.
 */
export class Events {
    /** @type {Object<string, Array<(arg:any)=>any>>} */
    events: {
        [x: string]: ((arg: any) => any)[];
    };
    /**
     * Triple-purpose method:
     *   on(event, fn)  → subscribe (fn is a function)
     *   on(event, arg) → dispatch  (arg is non-function value)
     *   on(event)      → probe; returns the listeners array if any
     * @param {string} event
     * @param {((arg:any)=>any) | any} [cb]
     * @returns {any[]|undefined}
     */
    on(event: string, cb?: ((arg: any) => any) | any): any[] | undefined;
}
