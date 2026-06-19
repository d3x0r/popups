/**
 * @typedef {object} ButtonOptions
 * @property {string} [suffix]
 */
/**
 * Wire press/release/keyboard handlers onto an existing button element so it
 * fires `onClick` consistently across mouse, touch, Enter, and Space.
 * @param {HTMLElement}   button
 * @param {() => void}    onClick
 */
export function handleButtonEvents(button: HTMLElement, onClick: () => void): void;
export class Button {
    /**
     * @param {HTMLElement}   form     Container the button is appended to.
     * @param {string}        caption
     * @param {() => void}    onClick
     * @param {ButtonOptions} [options]
     */
    constructor(form: HTMLElement, caption: string, onClick: () => void, options?: ButtonOptions);
    get el(): HTMLButtonElement;
    get control(): HTMLButtonElement;
    get span(): HTMLDivElement;
    get button(): HTMLButtonElement;
    get buttonInner(): HTMLDivElement;
    show(): void;
    hide(): void;
    remove(): void;
    set className(val: string);
    get className(): string;
    get style(): CSSStyleDeclaration;
    set tooltip(val: any);
    #private;
}
export type ButtonOptions = {
    suffix?: string;
};
