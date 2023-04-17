//tsc popups.mjs --declaration --allowJs --emitDeclarationOnly --outDir .
export class GraphicFrame extends Popup {
    static frames: any[];
    constructor(opts: any);
    frameFrame: any;
    leftWidth: number;
    topWidth: number;
    rightWidth: number;
    bottomWidth: number;
    mouseSection: number;
    draw: any;
    mouse: any;
    canvas: HTMLCanvasElement;
    ctx: any;
    w: number;
    h: number;
    x: number;
    y: number;
    sx: number;
    sy: number;
    sw: number;
    sh: number;
    sizing: boolean;
    dragging: boolean;
    startX: number;
    startY: number;
    drawFrame(): void;
    setFrame(image: any): void;
    setWidth(w: any): void;
    setHeight(h: any): void;
    setDraw(cb: any): void;
    getMouse(x: any, y: any): {
        frame: boolean;
        x: any;
        y: any;
        section?: undefined;
    } | {
        frame: boolean;
        section: number;
        x: any;
        y: any;
    };
    isMouse(x: any, y: any): {
        frame: boolean;
        x: any;
        y: any;
        section?: undefined;
    } | {
        frame: boolean;
        section: number;
        x: any;
        y: any;
    };
}
export class AlertForm extends Popup {
    constructor(parent: any, opts: any);
    MsgDiv: HTMLDivElement;
    show(caption: any): void;
}
export default popups;
export class Popup {
    constructor(caption_: any, parent: any, opts: any);
    popupEvents: {
        close: any[];
        show: any[];
    };
    divFrame: HTMLDivElement;
    divCaption: HTMLDivElement;
    divTitle: HTMLSpanElement;
    divContent: HTMLDivElement;
    divClose: HTMLDivElement;
    popup: Popup;
    useMouse: boolean;
    suffix: string;
    set caption(arg: any);
    center(): void;
    over(e: any): void;
    on(event: any, cb: any): void;
    reset(): void;
    refresh(): void;
    reject(): void;
    accept(): void;
    hide(): void;
    show(...args: any[]): void;
    move(x: any, y: any): void;
    appendChild(e: any): any;
    remove(): void;
}
export namespace popups {
    export { Popup };
    export const defaultDrag: boolean;
    export let autoRaise: boolean;
    export { createPopup as create };
    export { createSimpleForm as simpleForm };
    export { createSimpleNotice as simpleNotice };
    export { createList };
    export { makeList };
    export { makeCheckbox };
    export { makeRadioChoice };
    export { makeLeftRadioChoice };
    export { makeNameInput };
    export { makeTextInput };
    export { makeSlider };
    export { makeTextField };
    export { makeButton };
    export { handleButtonEvents };
    export { makeChoiceInput };
    export { makeDateInput };
    export namespace strings {
        function get(s: any): any;
    }
    export { setClass };
    export { toggleClass };
    export { clearClass };
    export { createPopupMenu as createMenu };
    export { GraphicFrame };
    export { makeLoginForm };
    export { makeWindowManager };
    export { fillFromURL };
    export { utils };
    export { DataGrid };
    export { PagedFrame };
    export { ValueOfType };
    export { AlertForm };
    export { Alert };
    export function getParentPopup(id: any): any;
}
declare function createPopup(caption: any, parent: any, opts: any): Popup;
declare function createSimpleForm(title: any, question: any, defaultValue: any, ok: any, cancelCb: any): Popup;
declare function createSimpleNotice(title: any, question: any, ok: any, cancel: any): SimpleNotice;
declare function createList(parent: any, parentList: any, toString: any, opens: any): List;
declare function makeList(parent: any, toString: any, opts: any): List;
declare function makeCheckbox(form: any, o: any, field: any, text: any): {
    on(event: any, cb: any): void;
    checked: any;
    value: any;
    refresh(): void;
    reset(): void;
    disabled: any;
    changes(): any;
    readonly style: CSSStyleDeclaration;
};
declare function makeRadioChoice(form: any, o: any, field: any, text: any, groupName: any, left: any): {
    on(event: any, cb: any): void;
    checked: any;
    value: any;
    reset(): void;
    changes(): any;
    readonly style: CSSStyleDeclaration;
};
declare function makeLeftRadioChoice(form: any, o: any, field: any, text: any, groupName: any): {
    on(event: any, cb: any): void;
    checked: any;
    value: any;
    reset(): void;
    changes(): any;
    readonly style: CSSStyleDeclaration;
};
declare function makeNameInput(form: any, input: any, value: any, text: any): {
    value: string;
    reset(): void;
    changes(): any;
};
declare function makeTextInput(form: any, input: any, value: any, text: any, money: any, percent: any, number: any, suffix_: any): {
    on(event: any, param: any): void;
    readonly frame: HTMLDivElement;
    addEventListener(a: any, b: any): void;
    blur(): void;
    value: any;
    refresh(): void;
    reset(): void;
    changes(): any;
};
declare function makeSlider(form: any, o: any, field: any, text: any, f: any, g: any): {
    on(event: any, cb: any): void;
    value: any;
    reset(): void;
    changes(): any;
    readonly style: CSSStyleDeclaration;
};
declare function makeTextField(form: any, input: any, value: any, text: any, money: any, percent: any): {
    addEventListener(a: any, b: any): void;
    refresh(): void;
    value: any;
    reset(): void;
    divFrame: HTMLDivElement;
    changes(): any;
};
declare function makeButton(form: any, caption: any, onClick: any, options: any): {
    button: HTMLButtonElement;
    buttonInner: HTMLDivElement;
    show(): void;
    hide(): void;
    remove(): void;
    className: string;
    readonly style: CSSStyleDeclaration;
};
declare function handleButtonEvents(button: any, onClick: any): void;
declare function makeChoiceInput(form: any, input: any, value: any, choices: any, text: any, opts: any): {
    addEventListener(evt: any, cb: any): void;
    remove(): void;
    value: any;
    disabled: any;
    refresh(): void;
    reset(): void;
    changes(): any;
};
declare function makeDateInput(form: any, input: any, value: any, text: any): {
    addEventListener(a: any, b: any): void;
    value: any;
    hide(): void;
    show(): void;
    reset(): void;
    changes(): any;
};
declare function setClass(el: any, cn: any): void;
declare function toggleClass(el: any, cn: any): void;
declare function clearClass(el: any, cn: any): void;
declare function createPopupMenu(opts: any): {
    items: any[];
    lastShow: number;
    parent: any;
    subOpen: any;
    container: HTMLDivElement;
    board: any;
    suffix: string;
    separate(): void;
    addItem(text: any, cb: any): void;
    addMenu(text: any): any;
    hide(all: any): void;
    show(x: any, y: any, cb: any): void;
    reset(): void;
};
declare function makeLoginForm(doLogin: any, opts: any): Popup;
declare function makeWindowManager(): {
    close(): void;
};
declare function fillFromURL(popup: any, url: any): Promise<any>;
declare const utils: any;
declare class DataGrid extends Events {
    constructor(form: any, o: any, field: any, opts: any);
    get el(): any;
    get suffix(): string;
    reinit(): void;
    reset(): void;
    refresh(): void;
    fill(): void;
    addColumn(name: any, subField: any, className: any, type: any): void;
    swapRows(row1: any, row2: any): void;
    moveRowUp(row: any): void;
    moveRowDown(row: any): void;
    addRow(newRow: any): DataGridRow;
    deleteRow(rowData: any): void;
    remove(): void;
    #private;
}
declare class PagedFrame extends Events {
    constructor(parent: any, opts: any);
    frame: HTMLDivElement;
    pages: any;
    lastPage: any;
    suffix: string;
    addPage(title: any, url: any): PageFramePage;
    activate(page: any): void;
    #private;
}
declare class ValueOfType {
    constructor(type: any, value: any);
    value: any;
    #private;
}
declare namespace ValueOfType {
    const Unset: number;
    const Number: number;
    const Dollar: number;
    const Percent: number;
    const String: number;
    const SSN: number;
    const Zip: number;
    const Date: number;
}
declare function Alert(msg: any): void;
declare class SimpleNotice extends Popup {
    constructor(title: any, question: any, ok: any, cancel: any);
    textOutput: HTMLElement;
    setMessage: (msg: any) => void;
    okay: {
        button: HTMLButtonElement;
        buttonInner: HTMLDivElement;
        show(): void;
        hide(): void;
        remove(): void;
        className: string;
        readonly style: CSSStyleDeclaration;
    };
    show(caption: any, content: any): void;
    textContent: any;
    appendChild(e: any): void;
}
declare class List extends Events {
    constructor(parentDiv: any, parentList: any, toString: any, opens: any, opts: any);
    selected: any;
    groups: any[];
    itemOpens: boolean;
    opts: any;
    compare: (a: any, b: any) => number;
    toString: any;
    divTable: any;
    parentList: any;
    push(group: any, toString_: any, opens: any): {
        opens: boolean;
        group: any;
        item: HTMLElement;
        subItems: List;
        parent: any;
        text: any;
        hide(): void;
        show(): void;
    };
    enableOpen(item: any): void;
    enableDrag(type: any, item: any, key1: any, item2: any, key2: any): void;
    enableDrop(type: any, item: any, cbDrop: any): void;
    update(group: any): void;
    get items(): any[];
    reset(): void;
}
declare class Events {
    events: {};
    on(event: any, cb: any): any;
}
declare class DataGridRow {
    constructor(grid: any, threshold: any, newRow: any);
    rowData: any;
    el: any;
    addUpdates: any;
    cells: any[];
    newInput: {};
    get suffix(): any;
    remove(): void;
    refresh(): void;
    #private;
}
declare class PageFramePage {
    constructor(frame: any);
    content: HTMLDivElement;
    handle: HTMLDivElement;
    pages: any;
    reset(): void;
    remove(): void;
    enableDrag(type: any, cbData: any): void;
    enableDrop(type: any, cbDrop: any): void;
    insertBeforePage(page: any): void;
    activatePage(page: any): void;
    activate(): PageFramePage;
    deactivate(): void;
    get frame(): any;
    set textContent(arg: any);
    appendChild(el: any): void;
    removePage(pf: any): void;
    addPage(title: any, url: any): PageFramePage;
    on(a: any, b: any): void;
    #private;
}
