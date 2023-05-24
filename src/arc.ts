type ToastTypes = "success" | "warning" | "danger";

interface Window {
    [x: string]: unknown;
}

interface Document {
    getElementById<T extends HTMLElement>(elementId: string): T | null;
}

type PostType = "answer" | "question";

type Placement = readonly [insert: HTMLElement | null, place: HTMLElement | null];

type Locator<T extends HTMLElement = HTMLElement> = (where: T) => Promise<Placement>;

declare enum Target {
    Closure = "C",
    CommentQuestion = "Q",
    CommentAnswer = "A",
    EditSummaryAnswer = "EA",
    EditSummaryQuestion = "EQ",
}

type Actor = (where: HTMLElement, target: Target) => Promise<void>;

type PopupActionMap = Record<
    string,
    (popup: HTMLElement, target: Target) => void
>;

type Injector = (
    where: HTMLElement,
    action: Actor
) => void;

type ViewMaker = {
    view?: HTMLElement;
    (popup: HTMLElement, id: string, target: Target): HTMLElement;
};

type WrapperPopupMaker = {
    popup?: HTMLElement;
    (target: Target): HTMLElement;
};

type opGetter = {
    op?: string;
    (refresh?: boolean): string;
};

type StackAPIBatchResponse<T> = {
    has_more: boolean;
    items: T[];
    quota_max: number;
    quota_remaining: number;
};

type SpanOptions = {
    classes?: string[];
    title?: string;
    unsafe?: boolean;
};

type TextAreaOptions = {
    label?: string;
    rows?: number;
    value?: string;
};

type TextInputOptions = {
    value?: string;
    title?: string;
    placeholder?: string;
    classes?: string[];
};

type StacksTextInputOptions = TextInputOptions & {
    iconClasses?: string[];
    inputClasses?: string[];
    label?: string;
};

type StacksToggleOptions = {
    state?: boolean,
    type?: "prefixed" | "postfixed";
};

type CheckboxOptions = {
    checked?: boolean;
    classes?: string[];
};

type ButtonOptions = {
    classes?: string[];
    id?: string;
};

type IconButtonOptions = {
    classes?: string[];
    url?: string;
};

type StoredComment = { id: string, name: string; description: string; targets: Target[]; };

type TimeAgo = "sec" | "min" | "hour" | "day";

type VarsReplacerOptions = {
    /** id of the logged in user */
    myId: string;
    /** username of the original poster */
    opName: string;
    /** current network site hostname */
    site: string;
    /** current network site display name */
    sitename: string;
};

window.addEventListener("load", () => {
    if (typeof StackExchange !== "undefined") {
        StackExchange.ready?.(() => {

            /**
             * @summary measures real text width and returns the actual number of lines
             * @param text text to measure
             * @param font font shorthand property
            * @param lineWidth maximum line width (in pixels)
             */
            const getNumTextLines = (text: string, font: string, lineWidth: number): number => {
                const lines = text.split(/\r?\n/);

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                if (!context) {
                    console.debug("missing 2d canvas context");
                    return 1;
                }

                context.font = font;

                return lines.reduce((a, line) => {
                    const { width } = context.measureText(line);
                    const actualNumLines = Math.ceil(width / lineWidth);
                    return a + actualNumLines;
                }, 0);
            };

            /**
             * @summary centers the element
             * @param element element to center
             */
            const center = <T extends HTMLElement>(element: T): T => {
                const { style } = element;
                const update: Partial<CSSStyleDeclaration> = {
                    position: "fixed",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                };
                Object.assign(style, update);
                return element;
            };

            /**
             * @summary hides an element
             * @param element element to hide
             */
            const hide = (element: HTMLElement): void =>
                element.classList.add("d-none");

            /**
             * @summary shows an element
             * @param element element to show
             */
            const show = (element: HTMLElement): void =>
                element.classList.remove("d-none");

            /**
             * @summary empties a node
             * @param node node to empty
             */
            const empty = <T extends Node>(node: T): T => {
                while (node.firstChild) node.firstChild.remove();
                return node;
            };

            /**
             * @summary gets an array of element siblings
             * @param el element to start from
             * @param selector sibling selector
             */
            const siblings = <T extends Element[]>(
                el: HTMLElement,
                selector?: string
            ): T[number][] => {
                const found: T[number][] = [];
                let current: T[number] | null = el;
                while ((current = current.nextElementSibling))
                    found.push(current);
                return selector
                    ? found.filter((sib) => sib.matches(selector))
                    : found;
            };

            /**
             * @summary fades element to provided opacity
             * @param element element to fade
             * @param min minimum opacity
             * @param speed speed of change
             */
            const fadeTo = <T extends HTMLElement>(element: T, min: number, speed = 200): T => {
                const { style } = element;
                style.transitionProperty = "opacity";
                style.transitionDuration = `${speed.toFixed(0)}ms`;
                style.transitionTimingFunction = "linear";
                style.opacity = min.toFixed(2);
                return element;
            };

            /**
             * @summary fades out an element
             * @param el element to fade out
             * @param speed speed of change
             */
            const fadeOut = <T extends HTMLElement>(el: T, speed = 200): T =>
                fadeTo(el, 0, speed);

            /**
             * @summary Return "s" if the word should be pluralised
             * @param count amount
             */
            const pluralise = (count: number): string => (count === 1 ? "" : "s");

            /**
             * @summary finds and runs a handler from a hashmap
             * @param hashmap key -> val lookup
             * @param comparator comparator function
             */
            const runFromHashmap = <
                U extends Record<string, (...args: any[]) => any>
            >(
                hashmap: U,
                comparator: (key: keyof U) => boolean,
                ...params: Parameters<U[keyof U]>
            ): ReturnType<U[keyof U]> | void => {
                const hash = Object.keys(hashmap).find(comparator);
                return hash && hashmap[hash]?.(...params);
            };

            const storageMap: Record<string, Storage> = {
                GM_setValue: {
                    get length() {
                        return GM_listValues().length;
                    },
                    clear() {
                        const keys = GM_listValues();
                        return keys.forEach((key) => GM_deleteValue(key));
                    },
                    key(index) {
                        return GM_listValues()[index];
                    },
                    getItem(key) {
                        return GM_getValue(key);
                    },
                    setItem(key, val) {
                        return GM_setValue(key, val);
                    },
                    removeItem(key) {
                        return GM_deleteValue(key);
                    },
                },
            };

            //TODO: switch to configurable preference
            const [, storage] =
                Object.entries(storageMap).find(
                    ([key]) => typeof window[key] === "function"
                ) || [];

            class Store {
                static prefix = "{{PREFIX}}";

                static storage: Storage = storage || localStorage;

                /**
                 * @summary number of keys in storage
                 */
                static get numKeys() {
                    const {
                        storage: { length },
                    } = this;
                    return length;
                }

                /**
                 * @summary clears storage
                 * @param startsWith text the key must start with
                 */
                static clear(startsWith: string): void {
                    const { numKeys, prefix, storage } = this;

                    for (let i = numKeys - 1; i >= 0; i--) {
                        const key = storage.key(i)!;

                        if (key.startsWith(prefix + startsWith))
                            storage.removeItem(key);
                    }
                }

                /**
                 * @summary checks if storage has a matching key
                 * @param text text to match
                 */
                static hasMatching(text: string): boolean {
                    const { numKeys, prefix, storage } = this;

                    const expr = new RegExp(`${prefix}.*?${text}`);

                    for (let i = numKeys - 1; i >= 0; i--) {
                        const key = storage.key(i) || "";

                        if (expr.test(key)) {
                            return true;
                        }
                    }

                    return false;
                }

                /**
                 * @summary loads a value from storage
                 * @param key key to load
                 * @param def optional default
                 */
                static load<T>(key: string, def?: T): T {
                    const { prefix, storage } = this;
                    const val = storage.getItem(prefix + key);
                    return val ? typeof def === "string" ?
                        val : JSON.parse(val) :
                        def;
                }

                /**
                 * @summary saves a value to storage
                 * @param key key to save
                 * @param val value to save
                 */
                static save<T>(key: string, val: T): boolean {
                    try {
                        const { prefix, storage } = this;
                        storage.setItem(prefix + key, typeof val !== "string" ? JSON.stringify(val) : val);
                        return true;
                    } catch (error) {
                        debugLogger.log(`failed to save: ${error}`);
                        return false;
                    }
                }

                /**
                 * @summary toggles a value in storage
                 * @param key key to toggle the value of
                 */
                static toggle(key: string) {
                    return Store.save(key, !Store.load(key));
                }

                /**
                 * @summary removes a key from storage
                 * @param key key to remove
                 */
                static remove(key: string): void {
                    const { prefix, storage } = this;
                    return storage.removeItem(prefix + key);
                }
            }

            class Debugger {
                static prefix = "{{PREFIX}}";

                constructor(public on: boolean) { }

                log(msg: string | object, ...params: unknown[]) {
                    const { on } = this;
                    const pfx = Debugger.prefix.replace("-", "");
                    on &&
                        console.debug(
                            `${pfx}:\n\n${JSON.stringify(msg, null, 2)}`,
                            ...params
                        );
                }
            }

            const VERSION = "{{VERSION}}";
            const GITHUB_URL = "{{GITHUB_URL}}";
            const API_VER = "{{API_VER}}";
            const API_KEY = "{{API_KEY}}";
            const FILTER_UNSAFE = "{{FILTER_UNSAFE}}";

            const debugLogger = new Debugger(Store.load("debug", false));

            const site = window.location.hostname;

            const sitename = (StackExchange.options.site.name || "").replace(
                /\s?Stack Exchange/,
                ""
            ); //same for others ("Android Enthusiasts Stack Exchange", SR, and more);

            debugLogger.log({
                site,
                sitename,
                isScriptManager: !!storage,
            });

            // A regular expression to match the possible targets in a string.
            const allTgtMatcher = new RegExp(
                "\\[(E?[AQ]|C)(?:,(E?[AQ]|C))*\\]"
            );

            //itemprop distinguishes between the author and editor
            const userLinkSel =
                ".post-signature .user-details[itemprop=author] a";

            //selects all views except actions
            const viewsSel = ".main .view:not(:first-child)";

            /**
             * All the different "targets" a comment can be placed on.
             * The values are used as comment title prefixes to make it easy for the user to change them
             * by simply adding the prefix to their comment title.
             * @enum
             */
            enum Target {
                Closure = "C",
                CommentQuestion = "Q",
                CommentAnswer = "A",
                EditSummaryAnswer = "EA",
                EditSummaryQuestion = "EQ",
            }

            /**
             * @summary template for the anchor HTML
             */
            const htmllink = (url: string, label = url) =>
                `<a href="${url}" target="_blank">${label}</a>`;

            /**
             * @summary template for the <em> HTML
             */
            const htmlem = (text: TemplateStringsArray) => `<em>${text}</em>`;

            /**
             * @summary template for the <strong> HTML
             */
            const htmlstrong = (text: TemplateStringsArray) =>
                `<strong>${text}</strong>`;

            /**
             * @summary template for the <code> HTML
             */
            const htmlinlinecode = (text: TemplateStringsArray) =>
                `<code>${text}</code>`;

            //default comments
            const commentDefaults: StoredComment[] = [
                {
                    id: "default-0",
                    targets: [Target.CommentQuestion],
                    name: "More than one question asked",
                    description: `It is preferred if you can post separate questions instead of combining your questions into one. That way, it helps the people answering your question and also others hunting for at least one of your questions. Thanks!`,
                },
                {
                    id: "default-1",
                    targets: [Target.CommentQuestion],
                    name: "Duplicate Closure",
                    description: `This question will likely be closed as a duplicate soon. If the answers from the duplicates do not fully address your question, please edit it to include why and flag this for re-opening. Thanks!`,
                },
                {
                    id: "default-2",
                    targets: [Target.CommentAnswer],
                    name: "Answers just to say Thanks!",
                    description: `Please do not add "thanks" as answers. Invest some time in the site and you will gain sufficient [privileges](/privileges) to upvote answers you like, which is our way of saying thank you.`,
                },
                {
                    id: "default-3",
                    targets: [Target.CommentAnswer],
                    name: "Nothing but a URL (and isn't spam)",
                    description: `Whilst this may theoretically answer the question, [it would be preferable](https://meta.stackexchange.com/q/8259) to include the essential parts of the answer here, and provide the link for reference.`,
                },
                {
                    id: "default-4",
                    targets: [Target.CommentAnswer],
                    name: "Requests to OP for further information",
                    description: `This is really a comment, not an answer. With a bit more rep, [you will be able to post comments](/privileges/comment). For the moment, I have added the comment for you and flagging the post for deletion.`,
                },
                {
                    id: "default-5",
                    targets: [Target.CommentAnswer],
                    name: "OP using an answer for further information",
                    description: `Please use the *Post answer* button only for actual answers. You should modify your original question to add additional information.`,
                },
                {
                    id: "default-6",
                    targets: [Target.CommentAnswer],
                    name: "OP adding a new question as an answer",
                    description: `If you have another question, please ask it by clicking the [Ask Question](/questions/ask) button.`,
                },
                {
                    id: "default-7",
                    targets: [Target.CommentAnswer],
                    name: 'Another user adding a "Me too!"',
                    description: `If you have a *new* question, please ask it by clicking the [Ask Question](/questions/ask) button. If you have sufficient reputation, [you may upvote](/privileges/vote-up) the question. Alternatively, "star" it as a favorite, and you will be notified of any new answers.`,
                },
                {
                    id: "default-8",
                    targets: [Target.Closure],
                    name: "Too localized",
                    description: `This question appears to be off-topic because it is too localized.`,
                },
                {
                    id: "default-9",
                    targets: [Target.EditSummaryQuestion],
                    name: "Improper tagging",
                    description: `The tags you used are not appropriate for the question. Please review [What are tags, and how should I use them?](/help/tagging)`,
                },
            ];

            if (!Store.load("WelcomeMessage", ""))
                Store.save("WelcomeMessage", `Welcome to ${sitename}! `);

            /**
             * @summary injects ARC-specific CSS into the page
             */
            const addStyles = (): void => {
                const style = document.createElement("style");
                document.head.append(style);
                const { sheet } = style;
                if (!sheet) return; //TODO: add failure handling

                const arc = "auto-review-comments";

                const popupWidth = "690px";

                [
                    // fixes SE code setting inline width if we add a button after
                    // the "Save edits" button
                    `.inline-editor button[id^='submit-button'] {
                    width: unset !important;
                }`,
                    `.${arc}.popup{
                    z-index: 9999;
                    position:absolute;
                    top: calc(100vh / 3);
                    left: calc(50vw - ${popupWidth}/2);
                    display:block;
                    width:${popupWidth};
                    padding:15px 15px 10px;
                }`,
                    `.${arc}.popup .svg-icon.mute-text a {
                    color: var(--black-500);
                }`,
                    `.${arc}.popup .main .view {
                    padding: 1vh 1vw;
                }`,
                    `.${arc}.popup .close:hover {
                    cursor: pointer;
                }`,
                    `.${arc}.popup .main .userinfo{
                    padding:5px;
                    margin-bottom:7px;
                }`,
                    `.${arc}.popup .main .remoteurl {
                    display: block;
                    width: 100%;
                }`,
                    `.${arc}.popup .main .action-list{
                    max-height: 400px;
                }`,
                    `.${arc}.popup .main .action-list li{
                    padding:0;
                    transition:.1s
                }`,
                    `.${arc}.popup .main .action-list li:hover {
                    background-color: var(--black-075)
                }`,
                    `.${arc}.popup .main .action-list li label{
                    position:relative;
                    display:block;
                    padding:10px;
                }`,
                    `.${arc}.popup .main .action-list li label .action-name {
                    display: block;
                    margin-bottom: 3px;
                    cursor: default;
                    margin: 0 0 1vh 0;
                }`,
                    `.${arc}.popup .main .action-list li label .action-desc {
                    margin: 0;
                    padding: 0;
                    cursor: default;
                }`,
                    `.${arc}.popup .main .action-list li label .quick-insert{
                    display: none;
                    transition: .3s;
                }`,
                    `.${arc}.popup .main .action-list li:hover label .quick-insert{
                    display:block
                }`,
                    `.${arc}.popup .main .action-list li label .quick-insert:hover{
                    background-color:#222;
                    color:#fff
                }`,
                    `.${arc}.announcement strong:first-child {
                    display: block;
                }`,
                    `.${arc}.announcement{
                    padding:7px;
                    margin-bottom:10px;
                    background:orange;
                    font-size:15px;
                }`,
                    `.${arc}.announcement .notify-close{
                    display:block;
                    float:right;
                    margin:0 4px;
                    padding:0 4px;
                    border:2px solid black;
                    cursor:pointer;
                    line-height:17px;
                }`,
                    `.${arc}.announcement .notify-close a{
                    color:black;
                    text-decoration:none;
                    font-weight:bold;
                    font-size:16px;
                }`,
                    `.${arc}.popup code {
                    display: inline-block;
                    margin: 1px;
                    padding: 0px;
                    background: none;
                    border: 1px solid var(--black-200);
                    border-radius: 2px;
                    line-height: 1.5;
                }`,
                ].forEach((rule) => sheet.insertRule(rule));
            };

            /**
             * @summary helper function for creating text inputs
             * @param id input id (also sets the name)
             * @param options configuration options
             */
            const makeTextInput = (
                id: string,
                options: TextInputOptions = {}
            ): HTMLInputElement => {
                const {
                    value = "",
                    classes = [],
                    placeholder = "",
                    title,
                } = options;

                const input = document.createElement("input");
                input.classList.add(...classes);
                input.type = "text";
                input.id = input.name = id;
                input.placeholder = placeholder;
                input.value = value;

                if (title) input.title = title;
                return input;
            };

            /**
             * @summary helper function for creating checkboxes
             * @param id input id (also sets the name)
             * @param options configuration options
             */
            const makeCheckbox = (
                id: string,
                options: CheckboxOptions = {}
            ) => {
                const { checked = false, classes = [] } = options;

                const input = document.createElement("input");
                input.classList.add(...classes);
                input.type = "checkbox";
                input.id = input.name = id;
                input.checked = checked;
                return input;
            };

            /**
             * @summary creates an element by tag and class list
             * @param tag element's tag name
             * @param classes list of CSS class names
             */
            const el = <T extends keyof HTMLElementTagNameMap>(
                tag: T,
                ...classes: string[]
            ): HTMLElementTagNameMap[T] => {
                const el = document.createElement(tag);
                el.classList.add(...classes);
                return el;
            };


            /**
             * {@link https://stackoverflow.design/product/components/textarea/}
             *
             * @summary creates a Stacks textarea
             * @param id textarea id (also sets the name)
             * @param options textarea options
             */
            const makeStacksTextArea = (
                id: string,
                options: TextAreaOptions = {}
            ): [HTMLDivElement, HTMLTextAreaElement] => {
                const { label = "", rows = 1, value = "" } = options;

                const wrap = el("div", "d-flex", "fd-column", "gs4", "gsy");

                if (label) {
                    const lbl = el("label", "flex--item", "s-label");
                    lbl.htmlFor = id;
                    lbl.textContent = label;
                    wrap.append(lbl);
                }

                const area = el("textarea", "flex--item", "s-textarea");
                area.id = area.name = id;
                area.value = value;
                area.rows = rows;
                wrap.append(area);

                return [wrap, area];
            };

            /**
             * @summary helper function for making Stacks icons
             * @param icon icon class name
             * @param path icons path to set
             * @param classes list of classes to set
             */
            const makeStacksIcon = (
                icon: string,
                path: string,
                ...classes: string[]
            ): [SVGSVGElement, SVGPathElement] => {
                const NS = "http://www.w3.org/2000/svg";
                const svg = document.createElementNS(NS, "svg");
                svg.classList.add("svg-icon", icon, ...classes);
                svg.setAttribute("aria-hidden", "true");
                svg.setAttribute("width", "18");
                svg.setAttribute("height", "18");
                svg.setAttribute("viewBox", `0 0 18 18`);

                const d = document.createElementNS(NS, "path");
                d.setAttribute("d", path);

                svg.append(d);
                return [svg, d];
            };

            /**
             * {@link https://stackoverflow.design/product/components/inputs/#icons}
             *
             * @summary creates a Stacks text input with an icon
             * @param id input id (also sets the name)
             * @param icon icons class to set
             * @param path icon path to set
             * @param options text input options
             */
            const makeStacksIconInput = (
                id: string,
                icon: string,
                path: string,
                options: StacksTextInputOptions = {}
            ): [HTMLDivElement, HTMLInputElement] => {
                const {
                    label,
                    classes = [],
                    iconClasses = [],
                    inputClasses = [],
                    ...inputOptions
                } = options;

                const wrap = el("div", "ps-relative", ...classes);

                if (label) {
                    const lbl = el("label", "flex--item", "s-label");
                    lbl.htmlFor = id;
                    lbl.textContent = label;
                    wrap.append(lbl);
                }

                const input = makeTextInput(id, {
                    ...inputOptions,
                    classes: ["s-input", ...inputClasses],
                });

                const [iconSVG] = makeStacksIcon(
                    icon,
                    path,
                    "s-input-icon",
                    ...iconClasses
                );
                wrap.append(input, iconSVG);

                return [wrap, input];
            };

            /**
             * {@link https://stackoverflow.design/product/components/inputs/#input-fills}
             *
             * @summary creates a Stacks URL input
             * @param id input id (also sets the name)
             * @param schema URL schema (http://, https://, or custom)
             * @param options text input options
             */
            const makeStacksURLInput = (
                id: string,
                schema: string,
                options: StacksTextInputOptions = {}
            ): [HTMLDivElement, HTMLDivElement, HTMLDivElement, HTMLInputElement] => {
                const { label, ...inputOptions } = options;

                const wrap = el("div", "d-flex", "gs4", "gsy", "fd-column");

                if (label) {
                    const lbl = el("label", "flex--item", "s-label");
                    lbl.htmlFor = id;
                    lbl.textContent = label;
                    wrap.append(lbl);
                }

                const iwrap = el("div", "d-flex");

                const ischema = el(
                    "div",
                    "flex--item",
                    "s-input-fill",
                    "order-first"
                );
                ischema.textContent = schema;

                const iinput = el("div", "d-flex", "fl-grow1", "ps-relative");

                const input = makeTextInput(id, {
                    classes: ["flex--item", "s-input", "blr0"],
                    ...inputOptions,
                });

                iinput.append(input);
                iwrap.append(ischema, iinput);
                wrap.append(iwrap);
                return [wrap, iwrap, iinput, input];
            };

            /**
             * {@link https://stackoverflow.design/product/components/checkbox/}
             *
             * @summary creates a Stacks checkbox
             * @param id input id (also sets the name)
             * @param label checkbox label
             * @param state initial checkbox state
             */
            const makeStacksCheckbox = (
                id: string,
                label: string,
                state = false
            ): [HTMLFieldSetElement, HTMLInputElement] => {
                const fset = el("fieldset", "d-flex", "gs8");

                const iwrap = el("div", "flex--item");

                const lbl = el("label", "flex--item", "s-label", "fw-normal");
                lbl.htmlFor = id;
                lbl.textContent = label;

                const input = makeCheckbox(id, {
                    checked: state,
                    classes: ["s-checkbox"],
                });

                iwrap.append(input);
                fset.append(iwrap, lbl);
                return [fset, input];
            };

            /**
             * {@link https://stackoverflow.design/product/components/toggle-switch/}
             *
             * @summary creates a Stacks toggle
             * @param id input id (also sets the name)
             * @param label toggle label
             * @param options configuration options
             */
            const makeStacksToggle = (
                id: string,
                label: string,
                options: StacksToggleOptions = {},
            ): [HTMLDivElement, HTMLInputElement] => {
                const { state = false, type = "postfixed" } = options;

                const wrap = el("div", "d-flex", "ai-center", "gs8");

                const lbl = el("label", "flex--item", "s-label");
                lbl.htmlFor = id;
                lbl.textContent = label;

                const iwrap = el("div", "flex--item", "s-toggle-switch");

                const input = makeCheckbox(id, { checked: state });

                const lever = el("div", "s-toggle-switch--indicator");

                iwrap.append(input, lever);

                wrap.append(...(type === "postfixed" ? [lbl, iwrap] : [iwrap, lbl]));

                return [wrap, input];
            };

            /**
             * @summary makes a button
             * @param text text to display
             * @param title text for the hint
             * @param options configuration options
             */
            const makeButton = (
                text: string,
                title: string,
                options: ButtonOptions = {}
            ): HTMLButtonElement => {
                const { id, classes = [] } = options;

                const button = el("button", "s-btn", ...classes);
                button.innerHTML = text;

                if (id) button.id = id;
                if (title) button.title = title;

                return button;
            };

            /**
             * {@link https://stackoverflow.design/product/components/navigation}
             *
             * @summary makes a nav element
             * @param text text to display
             * @param title text for the hint
             * @param options configuration options
             */
            const makeNavItem = (
                text: string,
                title: string,
                options: { id: string; classes: string[]; }
            ): HTMLLIElement => {
                const { id, classes = [] } = options;

                const li = el("li");
                li.title = title;

                const button = el("button", "s-navigation--item", ...classes);
                button.setAttribute("role", "tab");
                button.setAttribute("aria-controls", id.replace("-tab", "-popup"));
                button.type = "button";
                button.innerHTML = text;
                button.id = id;

                li.append(button);

                return li;
            }

            /**
             * @summary makes an info button icon
             * @param icon icon class name
             * @param title link title
             * @param path icon path
             * @param options button creation options
             */
            const makeStacksIconButton = (
                icon: string,
                title: string,
                path: string,
                options: IconButtonOptions = {}
            ): SVGSVGElement => {
                const { url, classes = [] } = options;

                const NS = "http://www.w3.org/2000/svg";
                const [svg, d] = makeStacksIcon(icon, path, ...classes);

                const ttl = document.createElementNS(NS, "title");
                ttl.textContent = title;

                if (url) {
                    const anchor = document.createElementNS(NS, "a");
                    anchor.setAttribute("href", url);
                    anchor.setAttribute("target", "_blank");
                    anchor.append(ttl, d);
                    svg.append(anchor);
                    return svg;
                }

                svg.append(ttl);
                return svg;
            };

            /**
             * @summary extracts comment {@link Target}s from its name
             * @param name comment name
             */
            const getCommentTargetsFromName = (name: string): Target[] => {
                const targets: Target[] = [];

                // https://regex101.com/r/N2yroj/1
                const [, serialized] = /^\[([\w,]+?)\]\s+/i.exec(name) || [];

                if (!serialized) return targets;

                const mapped = serialized.split(",") as Target[];

                return [...targets, ...mapped];
            };

            /**
             * @summary removes comment {@link Target} from its name
             * @param name comment name
             */
            const trimCommentTargetFromName = (name: string): string => {
                // https://regex101.com/r/N2yroj/1
                return name.replace(/^\[([\w,]+?)\]\s+/, "");
            };

            /**
             * @summary switches currently selected tab highlighting
             * @param tabs list of tab buttons
             * @param active new active tab button
             */
            const updateCurrentTab = (tabs: HTMLElement[], active?: HTMLElement): void => {
                tabs.forEach(({ classList }) => classList.remove("is-selected"));
                active?.classList.add("is-selected");
            };

            /**
             * @summary hides the rest of the views and shows the current one
             * @param popup wrapper popup
             * @param viewsSel selector for views
             */
            const makeViewSwitcher =
                (popup: HTMLElement, viewsSel: string) => (view: HTMLElement): HTMLElement => {
                    document
                        .querySelectorAll<HTMLElement>(viewsSel)
                        .forEach(hide);
                    show(view);

                    const [currentId] = view.id.split("-");

                    const tabButtons = [...popup.querySelectorAll<HTMLElement>("[id$=-tab]")];
                    const currentTab = tabButtons.find((t) => t.id === `${currentId}-tab`);

                    updateCurrentTab(tabButtons, currentTab);

                    Store.save("CurrentView", view.id);
                    debugLogger.log(`switched to view: ${view.id}`);
                    return view;
                };

            /**
             * @summary makes tabs view
             * @param popup wrapper popup
             * @param id actions wrapper id

             */
            const makeTabsView: ViewMaker = (popup, id) => {
                if (makeTabsView.view) return makeTabsView.view;

                const wrap = el(
                    "div",
                    "view",
                    "d-flex",
                    "ai-center",
                    "jc-space-between"
                );
                wrap.id = id;
                wrap.setAttribute("data-se-draggable-target", "handle");

                // https://stackoverflow.design/product/components/navigation/#example
                const nav = el("ul", "s-navigation");
                nav.setAttribute("data-controller", "s-navigation-tablist");
                nav.setAttribute("role", "tablist");

                const navItems = [
                    makeNavItem(
                        "Search",
                        "search",
                        {
                            id: "search-tab",
                            classes: [ "popup-actions-search" ]
                        }
                    ),
                    makeNavItem(
                        "Import/export",
                        "import/export all comments",
                        {
                            id: "impexp-tab",
                            classes: [ "popup-actions-impexp" ]
                        }
                    ),
                    makeNavItem(
                        "Remote",
                        "setup remote source",
                        {
                            id: "remote-tab",
                            classes: [ "popup-actions-remote" ]
                        }
                    ),
                    makeNavItem(
                        "Welcome",
                        "configure welcome",
                        {
                            id: "welcome-tab",
                            classes: [ "popup-actions-welcome" ]
                        }
                    ),
                    makeNavItem(
                        "Settings",
                        "configure ARC",
                        {
                            id: "settings-tab",
                            classes: [ "popup-actions-settings" ]
                        }
                    ),
                ];

                nav.append(...navItems);

                const buttons = navItems.map(el => el?.firstElementChild as HTMLElement);
                buttons.forEach(element => {
                    element.addEventListener("click", ({ target }) => {
                        updateCurrentTab(
                            buttons,
                            target as HTMLElement
                        );
                    });
                });

                buttons[0].click(); // select the first tab

                const iconGroup = el(
                    "div",
                    "d-flex",
                    "flex--item",
                    "gs8",
                    "ba",
                    "bar-pill",
                    "bc-black-300"
                );
                const iconClasses = ["flex--item", "mute-text"];

                const seeBtn = makeStacksIconButton(
                    "iconEye",
                    "see through",
                    `M9.06 3C4 3 1 9 1 9s3 6 8.06 6C14 15 17 9 17 9s-3-6-7.94-6zM9
             13a4 4 0 110-8 4 4 0 0 1 0 8zm0-2a2 2 0 002-2 2 2 0 0 0-2-2 2
             2 0 0 0-2 2 2 2 0 0 0 2 2z`,
                    { classes: iconClasses }
                );

                seeBtn.addEventListener("mouseenter", () => {
                    fadeTo(popup, 0.4);
                    const main = seeBtn.closest<HTMLElement>(".main");
                    if (main) fadeOut(main);
                });

                seeBtn.addEventListener("mouseleave", () => {
                    fadeTo(popup, 1.0);
                    const main = seeBtn.closest<HTMLElement>(".main");
                    if (main) fadeTo(main, 1);
                });

                const info = makeStacksIconButton(
                    "iconInfo",
                    `see info about ARC (v${VERSION})`,
                    "M9 1a8 8 0 110 16A8 8 0 019 1zm1 13V8H8v6h2zm0-8V4H8v2h2z",
                    { url: GITHUB_URL, classes: iconClasses }
                );

                const closeWrap = el("div", "flex--item");

                const close = makeStacksIconButton(
                    "iconClear",
                    "Close popup",
                    "M15 4.41 13.59 3 9 7.59 4.41 3 3 4.41 7.59 9 3 13.59 4.41 15 9 10.41 13.59 15 15 13.59 10.41 9 15 4.41z",
                    { classes: ["mute-text", "close"] }
                );

                close.addEventListener("click", () => {
                    fadeOut(popup);
                    hide(popup);
                });

                const actionGroup = el(
                    "div",
                    "d-flex",
                    "gsx",
                    "gs16",
                    "ai-center",
                    "flex--item"
                );

                closeWrap.append(close);
                iconGroup.append(seeBtn, info);
                actionGroup.append(iconGroup, closeWrap);
                wrap.append(nav, actionGroup);

                return (makeTabsView.view = wrap);
            };

            /**
             * @summary makes popup settings view
             * @param popup wrapper popup
             * @param id actions wrapper id
             */
            const makeSettingsView: ViewMaker = (popup, id) => {
                if (makeSettingsView.view) return makeSettingsView.view;

                const parent = el("div", "view");
                parent.id = id;

                const view = el("div", "d-flex", "fd-column", "gs16");

                const generalWrap = el("div", "flex--item", "gsy", "gs24");
                const dangerWrap = el("div", "flex--item");

                const [descrToggle] = makeStacksToggle(
                    "toggleDescr",
                    "hide comment descriptions",
                    {
                        state: Store.load("hide-desc", false),
                        type: "prefixed"
                    }
                );

                const [debugToggle] = makeStacksToggle(
                    "toggleDebug",
                    "ARC debug mode",
                    {
                        state: Store.load("debug", false),
                        type: "prefixed"
                    }
                );

                const resetBtn = makeButton(
                    "reset custom comments",
                    "resets any saved custom comments",
                    {
                        classes: [
                            "popup-actions-reset",
                            "s-btn__outlined",
                            "s-btn__danger"
                        ]
                    }
                );

                generalWrap.append(descrToggle, debugToggle);
                dangerWrap.append(resetBtn);

                view.append(generalWrap, dangerWrap);

                popup.addEventListener("click", ({ target }) => {
                    runFromHashmap<PopupActionMap>(
                        {
                            ".popup-actions-reset": (p, t) => {
                                resetComments(commentDefaults);
                                updateComments(p, t);
                            },
                            "#toggleDebug": () => {
                                Store.toggle("debug");
                            },
                            "#toggleDescr": (p) =>
                                toggleDescriptionVisibility(
                                    p,
                                    Store.toggle("hide-desc")
                                ),
                        },
                        (key) => (target as HTMLElement).matches(key),
                        popup,
                        Store.load("post_target", Target.CommentQuestion)
                    );
                });

                parent.append(view);

                return (makeSettingsView.view = parent);
            };

            /**
             * @summary makes the search view
             * @param popup wrapper popup
             * @param id view id
             */
            const makeSearchView: ViewMaker = (popup, id) => {
                if (makeSearchView.view) return makeSearchView.view;

                const wrap = document.createElement("div");
                wrap.classList.add("view");
                wrap.id = id;

                const header = document.createElement("h2");
                header.innerHTML = "Which review comment to insert?";

                const uinfo = document.createElement("div");
                uinfo.classList.add("userinfo");
                uinfo.id = "userinfo";

                const [searchWrap, searchInput] = makeStacksIconInput(
                    "comment-search",
                    "iconSearch",
                    "m18 16.5-5.14-5.18h-.35a7 7 0 10-1.19 1.19v.35L16.5 18l1.5-1.5zM12 7A5 5 0 112 7a5 5 0 0110 0z",
                    {
                        placeholder: "filter the comments list",
                        classes: ["flex--item", "d-flex", "fd-column"],
                        iconClasses: ["s-input-icon__search", "flex--item"],
                        inputClasses: ["s-input__search"],
                    }
                );

                setupSearchHandlers(popup, searchInput);

                const actions = el(
                    "ul",
                    "action-list",
                    "overflow-y-scroll",
                    "d-flex",
                    "fd-column",
                    "mt16"
                );

                wrap.append(header, uinfo, searchWrap, actions);
                return (makeSearchView.view = wrap);
            };

            /**
             * @summary makes welcome view
             * @param popup wrapper popup
             * @param id view id
             * @param commentTarget parent post type
             */
            const makeWelcomeView: ViewMaker = (popup, id, commentTarget) => {
                if (makeWelcomeView.view) return makeWelcomeView.view;

                const parent = el("div", "view");
                parent.id = id;

                const view = el(
                    "div",
                    "d-flex",
                    "fd-column",
                    "gsy",
                    "gs16"
                );

                const [welcomeWrap, input] = makeStacksIconInput(
                    "customwelcome",
                    "iconSearch",
                    "m18 16.5-5.14-5.18h-.35a7 7 0 10-1.19 1.19v.35L16.5 18l1.5-1.5zM12 7A5 5 0 112 7a5 5 0 0110 0z",
                    {
                        value: Store.load("WelcomeMessage", ""),
                        title: '"Welcome" message (blank is none)',
                        label: "Greeting",
                        classes: [
                            "flex--item",
                            "d-flex",
                            "fd-column",
                            "gsy",
                            "gs4",
                        ],
                        iconClasses: ["s-input-icon__search", "flex--item"],
                        inputClasses: ["s-input__search"],
                    }
                );

                input.classList.add("flex--item");

                input.addEventListener("change", () => {
                    Store.save("WelcomeMessage", input.value);
                    updateComments(popup, commentTarget);
                });

                welcomeWrap.append(input);

                const actionsWrap = el("div", "flex--item", "d-flex", "gsx", "gs8");

                const actions: Node[] = [
                    makeButton(
                        "force",
                        "force",
                        {
                            classes: [
                                "welcome-force", "s-btn__primary",
                                "s-btn__filled",
                                "flex--item"
                            ]
                        }
                    ),
                    makeButton(
                        "cancel",
                        "cancel",
                        {
                            classes: [
                                "welcome-cancel",
                                "s-btn__danger",
                                "s-btn__outlined",
                                "flex--item"
                            ]
                        }
                    ),
                ];

                const viewSwitcher = makeViewSwitcher(popup, viewsSel);

                popup.addEventListener("click", ({ target }) => {
                    runFromHashmap<PopupActionMap>(
                        {
                            ".popup-actions-welcome": () => {
                                input.value ||= Store.load(
                                    "WelcomeMessage",
                                    ""
                                );
                            },
                            ".welcome-cancel": (p, t) =>
                                viewSwitcher(
                                    makeSearchView(p, "search-popup", t)
                                ),
                            ".welcome-force": (p, t) => {
                                Store.save("ShowGreeting", true);
                                updateComments(p, t);
                            },
                        },
                        (key) => (target as HTMLElement).matches(key),
                        popup,
                        Store.load("target", commentTarget)
                    );
                });

                actionsWrap.append(...actions);

                view.append(welcomeWrap, actionsWrap);
                parent.append(view);

                return (makeWelcomeView.view = parent);
            };

            /**
             * @summary updates import/export comment section
             * @param view import/export view
             */
            const updateImpExpComments = <T extends HTMLElement>(view: T): T => {
                const area = view.querySelector("textarea");
                if (!area) {
                    debugLogger.log("missing imp/exp textarea");
                    return view;
                }

                const loaded = loadComments();

                const content = loaded
                    .map(
                        ({ name, description, targets }) => {
                            const safeTargets = targets || getCommentTargetsFromName(name);
                            return `###[${safeTargets.join(",")}] ${name}\n${HTMLtoMarkdown(description)}`;
                        }
                    )
                    .join("\n\n");

                area.value = content;
                return view;
            };

            /**
             * @summary Show textarea in front of popup to import/export all comments (for other sites or for posting somewhere)
             * @param popup wrapper popup
             * @param id view id
             * @param postType parent post type
             */
            const makeImpExpView: ViewMaker = (popup, id, postType) => {
                if (makeImpExpView.view)
                    return updateImpExpComments(makeImpExpView.view);

                const parent = el("div", "view");
                parent.id = id;

                const view = el("div", "d-flex", "gs8", "gsy", "fd-column");
                // because it will include the textarea and the buttons:

                const [areaWrap, area] = makeStacksTextArea("impexp", {
                    label: "Comment source",
                    rows: 20
                });

                const handleChange = async () => {
                    importComments(area.value);
                    updateComments(popup, postType);
                };

                area.addEventListener("change", handleChange);

                const actionWrap = el("div", "actions", "flex--item");
                const buttonsWrap = el("div", "d-flex", "gs8", "gsx");

                const toJsonBtn = makeButton(
                    "JSON",
                    "Convert to JSON",
                    {
                        classes: [
                            "s-btn__primary",
                            "flex--item"
                        ]
                    }
                );

                const toMarkdownBtn = makeButton(
                    "Markdown",
                    "Go back to Markdown view",
                    {
                        classes: [
                            "s-btn__primary",
                            "flex--item",
                            "d-none"
                        ]
                    }
                );

                toMarkdownBtn.addEventListener("click", () => {
                    area.addEventListener("change", handleChange);
                    hide(toMarkdownBtn);
                    show(toJsonBtn);
                    show(cancelBtn);
                    updateImpExpComments(view);
                });

                const cancelBtn = makeButton(
                    "cancel",
                    "cancel import/export",
                    {
                        classes: [
                            "s-btn__danger",
                            "flex--item"
                        ]
                    }
                );

                const viewSwitcher = makeViewSwitcher(popup, viewsSel);
                cancelBtn.addEventListener("click", () =>
                    viewSwitcher(
                        makeSearchView(popup, "search-popup", postType)
                    )
                );

                buttonsWrap.append(toMarkdownBtn, toJsonBtn, cancelBtn);
                actionWrap.append(buttonsWrap);

                const flexItemTextareaWrapper = el("div", "flex--item");
                const flexItemActionWrap = el("div", "flex--item");

                flexItemTextareaWrapper.append(areaWrap);
                flexItemActionWrap.append(actionWrap);

                view.append(flexItemTextareaWrapper, flexItemActionWrap);

                toJsonBtn.addEventListener("click", () => {
                    const loaded = loadComments();
                    const content = JSON.stringify(loaded, null, 4);
                    area.value = content;

                    view.querySelector("textarea")?.classList.add("ff-mono"); // like a pre

                    hide(toJsonBtn);
                    hide(cancelBtn);
                    show(toMarkdownBtn);

                    // ensure we do not accidentally try to save JSON as comments
                    area.removeEventListener("change", handleChange);
                });

                parent.append(view);

                return (makeImpExpView.view = updateImpExpComments(parent));
            };

            /**
             * @summary prepend schema to URL
             * @param url target URL
             */
            const scheme = (url: string): string =>
                /^https?:\/\//.test(url) ? url : `https://${url}`;

            /**
             * @summary remove schema from URL
             * @param url target URL
             */
            const unscheme = (url: string): string => url.replace(/^https?:\/\//, "");

            /**
             * @summary updates remote URL
             * @param key store key for the remote URL
             * @param inputId id of the remote input
             */
            const updateRemoteURL = (key: string, inputId: string): boolean => {
                const input =
                    document.getElementById<HTMLInputElement>(inputId);
                if (!input) return false;

                input.value = unscheme(Store.load(key, ""));
                return true;
            };

            /**
             * @summary factory for remote change listeners
             * @param storeKey key to store URL under
             * @param input URL input to get value from
             */
            const makeOnRemoteChange =
                (storeKey: string, input: HTMLInputElement): EventListener =>
                    () => {
                        const { value } = input;
                        //unscheme -> scheme is for foolproofing
                        Store.save(storeKey, scheme(unscheme(value)));
                        input.value = unscheme(value);
                    };

            /**
             * @summary makes the remote view
             * @param popup wrapper popup
             * @param id view id
             * @param commentTarget comment {@link Target}
             */
            const makeRemoteView: ViewMaker = (popup, id, commentTarget) => {
                const storeKeyJSON = "remote_json";
                const storeKeyJSONauto = "remote_json_auto";

                const storeKeyJSONP = "RemoteUrl"; //TODO: move to config
                const storeKeyJSONPauto = "AutoRemote";

                if (makeRemoteView.view) {
                    const { view } = makeRemoteView;
                    //TODO: default id to store key
                    updateRemoteURL(storeKeyJSON, storeKeyJSON);
                    updateRemoteURL(storeKeyJSONP, storeKeyJSONP);
                    return view;
                }

                const wrap = el("div", "view");
                wrap.id = id;

                const initialScheme = "https://";
                const initialURL = unscheme(Store.load(storeKeyJSONP, ""));

                const inputWrap = el("div", "d-flex", "fd-column", "gs8");

                const [jsonWrap, , jsonIWrap, jsonInput] = makeStacksURLInput(
                    storeKeyJSON,
                    initialScheme,
                    {
                        label: "JSON source",
                        value: initialURL,
                    }
                );

                const [jsonpWrap, , jsonpIWrap, jsonpInput] =
                    makeStacksURLInput(storeKeyJSONP, initialScheme, {
                        label: "JSONP source",
                        value: initialURL,
                    });

                jsonInput.addEventListener(
                    "change",
                    makeOnRemoteChange(storeKeyJSON, jsonInput)
                );
                jsonpInput.addEventListener(
                    "change",
                    makeOnRemoteChange(storeKeyJSONP, jsonpInput)
                );

                const autoWrap = el("div", "float-left");

                const toggleText = "auto get";

                const [autoJSONwrap, autoJSONcbx] = makeStacksCheckbox(
                    storeKeyJSONauto,
                    toggleText,
                    Store.load(storeKeyJSONauto, false)
                );

                const [autoJSONPwrap, autoJSONPcbx] = makeStacksCheckbox(
                    storeKeyJSONPauto,
                    toggleText,
                    Store.load(storeKeyJSONPauto, false)
                );

                autoJSONcbx.addEventListener("change", () =>
                    Store.toggle(storeKeyJSONauto)
                );
                autoJSONPcbx.addEventListener("change", () =>
                    Store.toggle(storeKeyJSONPauto)
                );

                const getNowText = "get now";
                const commonBtnClasses = [
                    "s-btn__muted",
                    "s-btn__outlined",
                    "ml8",
                ];

                const getJSONbtn = makeButton(
                    getNowText,
                    "get JSON remote",
                    {
                        classes: [
                            "remote-json-get",
                            ...commonBtnClasses
                        ]
                    }
                );
                const getJSONPbtn = makeButton(
                    getNowText,
                    "get JSONP remote",
                    {
                        classes: [
                            "remote-jsonp-get",
                            ...commonBtnClasses
                        ]
                    }
                );

                popup.addEventListener("click", ({ target }) => {
                    runFromHashmap(
                        {
                            ".remote-json-get": async () => {
                                const url = jsonInput.value;
                                if (!url) {
                                    notify("JSON remote URL is not provided", "warning");
                                    return;
                                }

                                getJSONbtn.classList.add("is-loading");
                                await fetchFromRemote(scheme(url));
                                updateComments(popup, commentTarget);
                                getJSONbtn.classList.remove("is-loading");
                            },
                            ".remote-jsonp-get": async () => {
                                const url = jsonpInput.value;
                                if (!url) {
                                    notify("JSONP remote URL is not provided", "warning");
                                    return;
                                }

                                getJSONPbtn.classList.add("is-loading");
                                await fetchFromRemote(scheme(url), true);
                                updateComments(popup, commentTarget);
                                getJSONPbtn.classList.remove("is-loading");
                            },
                        },
                        (key) => (target as HTMLElement).matches(key)
                    );
                });

                inputWrap.append(jsonWrap, jsonpWrap);
                jsonWrap.append(autoJSONwrap);
                jsonpWrap.append(autoJSONPwrap);
                jsonIWrap.after(getJSONbtn);
                jsonpIWrap.after(getJSONPbtn);
                wrap.append(inputWrap, autoWrap);

                return (makeRemoteView.view = wrap);
            };

            /**
             * @summary inserts ARC comment into the comment box
             * @param html comment HTML
             * @param op original poster info
             */
            const insertComment = (
                html: string,
                op: string
            ): void => {
                const md = HTMLtoMarkdown(html)
                    .replace(/\[username\]/g, "") //TODO: get user info
                    .replace(/\[OP\]/g, op);

                const input = document.querySelector<HTMLTextAreaElement>("[data-arc=current]");
                if (!input) {
                    console.debug("missing comment box to insert to");
                    return;
                }

                input.value = md;
                input.focus(); //focus provokes character count test

                const hereTxt = "[type here]";
                const caret = md.indexOf(hereTxt);
                if (caret >= 0)
                    input.setSelectionRange(caret, caret + hereTxt.length);
            };

            /**
             * @summary creates the popup markup
             * @description memoizable popup maker
             * @param target initial post type
             */
            const makePopup: WrapperPopupMaker = (target) => {
                if (makePopup.popup) return makePopup.popup;

                const popup = el("div", "auto-review-comments", "popup");

                const main = el("div", "main");
                main.id = "main";

                const commentViewId = "search-popup";

                const viewsMap = [
                    ["tabs-popup", makeTabsView],
                    [commentViewId, makeSearchView],
                    ["remote-popup", makeRemoteView],
                    ["welcome-popup", makeWelcomeView],
                    ["impexp-popup", makeImpExpView],
                    ["settings-popup", makeSettingsView],
                ] as const;

                const initPostType = Store.load("post_target", target);
                debugLogger.log({ initPostType, target });

                const views = viewsMap.map(([id, maker]) => {
                    const view = maker(popup, id, initPostType);

                    if (id !== "tabs-popup") {
                        view.setAttribute("aria-controlledby", id.replace("-popup", "-tab"));
                    }

                    return view;
                });

                const visibleViews = 2;
                const hidden = views.slice(visibleViews);
                hidden.forEach(hide);

                main.append(...views);
                popup.append(main);

                setupCommentHandlers(popup, commentViewId);

                return (makePopup.popup = popup);
            };

            /**
             * @summary creates a <span> element
             * @param text text of the element
             * @param options configuration options
             */
            const span = (
                text: string,
                options: SpanOptions = {}
            ) => {
                const { classes = [], unsafe = false, title = "" } = options;

                const el = document.createElement("span");
                el.classList.add(...classes);
                unsafe ? (el.innerHTML = text) : (el.innerText = text);
                if (title) el.title = title;
                return el;
            };

            /**
             * @summary makes an auto comment option
             * @param id comment item id
             * @param name comment name
             * @param desc comment description
             */
            const makeCommentItem = (
                id: string,
                name: string,
                desc: string
            ): HTMLLIElement => {
                const li = el("li", "pr8");

                const reviewRadio = el("input");
                reviewRadio.id = `comment-${id}`;
                reviewRadio.type = "radio";
                reviewRadio.name = "commentreview";
                reviewRadio.hidden = true;

                const lbl = el("label", "d-flex", "fw-wrap", "jc-space-between");
                lbl.htmlFor = reviewRadio.id;

                const nameEl = el("span", "action-name", "flex--item12");
                nameEl.id = `name-${id}`;
                nameEl.innerHTML = name;

                const descEl = el("span", "action-desc", "flex--item11");
                descEl.id = `desc-${id}`;
                descEl.innerHTML = desc;

                const insertBtn = makeButton(
                    "↓",
                    "insert comment",
                    {
                        classes: [
                            "s-btn",
                            "s-btn__muted",
                            "s-btn__outlined",
                            "quick-insert"
                        ]
                    }
                )

                lbl.append(nameEl, descEl, insertBtn);
                li.append(reviewRadio, lbl);

                return li;
            };

            type TimeUnits = {
                [key in Partial<Intl.RelativeTimeFormatUnit>]: number;
            };
            const timeUnits = {
                // in seconds
                second: 1,
                get minute() {
                    return this.second * 60;
                },
                get hour() {
                    return this.minute * 60;
                },
                get day() {
                    return this.hour * 24;
                },
                get week() {
                    return this.day * 7;
                },
                get month() {
                    return this.day * 30;
                },
                get year() {
                    return this.month * 12;
                },
            } as TimeUnits;
            const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ];

            /**
             * @summmary Get the absolute date, inspired from friendlyTime, https://dev.stackoverflow.com/content/Js/full.en.js
             * @param epochSeconds Epoch seconds of the date to convert
             */
            const absoluteTime = (epochSeconds: number) => {
                const pad = (number: number) =>
                    number < 10 ? `0${number}` : number;
                const date = new Date(epochSeconds * 1000);
                const thisYear = new Date().getUTCFullYear();
                const thatDateShortYear = date
                    .getUTCFullYear()
                    .toString()
                    .substring(2);

                return (
                    [
                        months[date.getUTCMonth()],
                        date.getUTCDate(),
                        date.getUTCFullYear() !== thisYear
                            ? `'${thatDateShortYear}`
                            : "",
                        "at",
                        [
                            date.getUTCHours(),
                            ":",
                            pad(date.getUTCMinutes()),
                        ].join(""),
                    ].join(" ") || ""
                ); // e.g. Jan 23 at 3:19
            };

            /**
             * @summary Calculate and format datespan for "Last seen ..." and "joined ...",
             *          see prettyDate in SE's JS: https://dev.stackoverflow.com/content/Js/full.en.js
             * @param dateSeconds date to prettify (seconds since *nix epoch)
             */
            const prettifyDate = (dateSeconds: number) => {
                const diff = new Date().getTime() / 1000 - dateSeconds;
                if (isNaN(diff) || diff < 0) return "";

                const findFromObject = <T>(object: T) =>
                    Object.entries(object)
                        .sort(([a], [b]) => Number(a) - Number(b)) // should not depend on key order
                        .find(
                            ([timeUnitSecs]) => diff < Number(timeUnitSecs)
                        ) || [, ""];

                const divideByMap = {
                    // key: a time unit, value: the time unit before
                    [timeUnits.minute]: timeUnits.second,
                    [timeUnits.hour]: timeUnits.minute,
                    [timeUnits.day / 2]: timeUnits.hour,
                    [timeUnits.week]: timeUnits.day,
                };
                const [, divideBy] = findFromObject(divideByMap);

                const unitElapsed = Math.floor(diff / divideBy);
                const pluralS = pluralise(unitElapsed);
                const getTimeAgo = (type: TimeAgo) =>
                    `${unitElapsed} ${type}${pluralS} ago`;

                const stringsMap = {
                    [timeUnits.second * 2]: "just now",
                    [timeUnits.minute]: getTimeAgo("sec"), // less than a min           => ... secs ago
                    [timeUnits.hour]: getTimeAgo("min"), // less than an hour         => ... mins ago
                    [timeUnits.day / 2]: getTimeAgo("hour"), // less than 12 hours        => ... hours ago
                    [timeUnits.day]: "today", // during the last 12 hours  => today
                    [timeUnits.day * 2]: "yesterday", // "less than" 2 days        => yesterday
                    [timeUnits.week]: getTimeAgo("day"), // during the past week      => ... days ago
                };
                const [, relativeDateString] = findFromObject(stringsMap);

                return relativeDateString || absoluteTime(dateSeconds); // return absolute date if diff > 1 month
            };

            /**
             * @summary Format reputation string, https://stackoverflow.com/a/17633552
             * @param reputationNumber total rep points
             */
            const shortenReputationNumber = (reputationNumber: number) => {
                const ranges = [
                    { divider: 1e6, suffix: "m" },
                    { divider: 1e3, suffix: "k" },
                ];

                // https://chat.stackoverflow.com/transcript/message/52517093#52517093
                const range = ranges.find(
                    ({ divider }) => reputationNumber >= divider
                );
                const shortenedRep = range
                    ? (reputationNumber / range.divider).toFixed(1) + range.suffix
                    : reputationNumber.toString();

                return shortenedRep.replace('.0', ''); // 4.0k => 4k
            };

            /**
             * @summary Get the Id of the logged-in user
             * @param se global {@link StackExchange} object
             */
            const getLoggedInUserId = (se: typeof StackExchange): string =>
                se.options.user.userId?.toString() || "";

            /**
             * @summary shows a message
             * @param toastBody toast content
             * @param type type of toast
             */
            const notify = (toastBody: string, type: ToastTypes): void => {
                StackExchange.helpers.showToast(toastBody, { type });
            };

            /**
             * @summary gets user Id
             * @param tgt element to insert comment in
             */
            const getUserId = (tgt: HTMLElement): string => {
                const parent =
                    tgt.closest(".answer") || tgt.closest(".question");
                if (!parent) return "";

                const userLink =
                    parent.querySelector<HTMLAnchorElement>(userLinkSel);
                if (!userLink) return "";

                const { href } = userLink;
                const [, uid] = /users\/(\d+)\//.exec(href) || [];
                return uid || "";
            };

            /**
             * @summary checks if the user is new
             * @param creation_date {@link StackExchangeAPI.User.creation_date} timestamp
             * @param reputation {@link StackExchangeAPI.User.reputation} points
             */
            const isNewUser = (
                creation_date: number,
                reputation: number
            ): boolean => {
                return [
                    Date.now() / 1000 - creation_date < timeUnits.month,
                    reputation < 10
                ].some(Boolean);
            };

            /**
             * @summary get original poster username
             * @description memoizable getter for poster name
             * @param refresh should update data?
             */
            const getOP: opGetter = (refresh = false) => {
                if (getOP.op && !refresh) return getOP.op;

                const question = document.getElementById("question");
                if (!question) {
                    const review = document.querySelector(".js-review-editor")!;
                    const userLink = review.querySelector(".s-post-summary--meta .s-user-card--link");
                    return userLink?.textContent || "OP";
                }

                const userlink = question.querySelector(userLinkSel);
                if (userlink) return userlink.textContent || "OP";

                const deleted = question.querySelector(".owner .user-details");
                return (getOP.op = (deleted && deleted.innerHTML) || "OP");
            };

            /**
             * @summary properly capitalizes a word
             * @param text text to capitalize
             */
            const capitalize = (text: string): string =>
                text[0].toUpperCase() + text.slice(1).toLowerCase();

            /**
             * @summary wraps text into a <strong> element
             * @param text text to wrap
             */
            const b = (text: string): HTMLElement => {
                const strong = document.createElement("strong");
                strong.innerHTML = text;
                return strong;
            };

            /**
             * @summary Add font-weight: bold to passed element
             * @param element The element
             */
            const makeB = (element: HTMLElement): void =>
                element.classList.add("fw-bold");

            /**
             * @summary creates an <a> element
             * @param url resource URL
             * @param label anchor label
             */
            const link = (url: string, label = url): HTMLAnchorElement => {
                const a = document.createElement("a");
                a.href = url;
                a.target = "_blank";
                a.innerHTML = label;
                return a;
            };

            /**
             * @summary creates a text node
             * @param data node content
             */
            const text = (data: string): Text => document.createTextNode(data);

            /**
             * @summary adds user info to the UI
             * @param userInfo {@link StackExchangeAPI.User} object
             */
            const addUserInfo = (userInfo: StackExchangeAPI.User): void => {
                const container = document.getElementById("userinfo");
                if (!container) return;

                const {
                    user_id,
                    creation_date,
                    display_name,
                    last_access_date,
                    reputation,
                    user_type,
                } = userInfo;

                const newUserState = isNewUser(creation_date, reputation);

                Store.save("ShowGreeting", newUserState);

                if (newUserState) {
                    container
                        .querySelector(".action-desc")
                        ?.prepend(Store.load("WelcomeMessage", ""));
                }

                const userLink = link(`/users/${user_id}`, "");
                userLink.append(b(display_name));

                empty(container);

                const relativeTimeClass = "relativetime";
                const [prettyCreation, prettyLastSeen] = [
                    creation_date,
                    last_access_date,
                ].map((date) => {
                    const prettified = prettifyDate(date);

                    // SE automatically updates ".relativetime" spans every min
                    // see updateRelativeDates() in full.en.js
                    // spans need to have a title in the "YYYY-MM-DD HH:MM:SSZ" format
                    const isoString = new Date(date * 1000)
                        .toISOString()
                        .replace("T", " ")
                        .replace(/\.\d{3}/, "");
                    const dateSpan = span(prettified, {
                        classes: [relativeTimeClass],
                        unsafe: true,
                        title: isoString,
                    });
                    makeB(dateSpan);
                    return dateSpan;
                });

                container.append(
                    capitalize(user_type),
                    text(" user "),
                    userLink,
                    text(", joined "),
                    prettyCreation,
                    text(", last seen "),
                    prettyLastSeen,
                    text(", reputation "),
                    b(shortenReputationNumber(reputation))
                );
            };

            /**
             * @summary get basic user info from the API
             * @param userid id of the user
             */
            const getUserInfo = async (userid: string): Promise<StackExchangeAPI.User | null> => {
                const url = new URL(
                    `https://api.stackexchange.com/${API_VER}/users/${userid}`
                );
                url.search = new URLSearchParams({
                    site,
                    key: API_KEY,
                    filter: FILTER_UNSAFE,
                }).toString();

                const res = await fetch(url.toString());
                if (!res.ok) return null;

                const {
                    items: [userInfo],
                }: StackAPIBatchResponse<StackExchangeAPI.User> = await res.json();

                return userInfo;
            };

            /**
             * @summary makes a separator <span>
             */
            const makeSeparator = (): HTMLSpanElement => {
                const lsep = document.createElement("span");
                lsep.classList.add("lsep");
                lsep.innerHTML = " | ";
                return lsep;
            };

            /**
             * @summary checks if all arrays are of the same length
             * @param arrays list of arrays to check
             */
            const areSameLength = (...arrays: unknown[][]): boolean => {
                return new Set(arrays.map((a) => a.length)).size === 1;
            };

            /**
             * @summary imports comments given text
             * @param text comment text to parse
             */
            const importComments = (text: string): void => {
                const lines = text.split("\n");

                const names: string[] = [];
                const descs: string[] = [];
                const targets: Target[][] = [];

                lines.forEach((line) => {
                    const ln = line.trim();

                    if (ln.startsWith("#")) {
                        const name = ln.replace(/^#+/, "");
                        names.push(name);
                        targets.push(getCommentTargetsFromName(name));
                        return;
                    }

                    if (ln) return descs.push(tag(ln));
                });

                if (!areSameLength(names, descs, targets)) {
                    debugLogger.log({ names, descs, targets });

                    return notify(
                        "Failed to import: titles and descriptions do not match",
                        "danger"
                    );
                }

                const comments: StoredComment[] = names.map((name, idx) => {
                    return {
                        id: idx.toString(),
                        name: trimCommentTargetFromName(name),
                        description: descs[idx],
                        targets: getCommentTargetsFromName(name)
                    };
                });

                Store.save("comments", comments);
            };

            // From https://stackoverflow.com/a/12034334/259953
            const entityMapToHtml: Record<string, string> = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
            };

            const entityMapFromHtml: Record<string, string> = {
                "&amp;": "&",
                "&lt;": "<",
                "&gt;": ">",
            };

            /**
             * @summary escapes HTML entities
             * @param html HTML string to escape
             */
            const escapeHtml = (html: string): string => {
                // the expression needs to be context-aware not to escape inline code
                // https://regex101.com/r/Ht8zcJ/1
                return String(html).replace(/(?<!.*?`)[&<>](?!.*?`)/gm, (s) => entityMapToHtml[s]);
            };

            /**
             * @summary unescapes HTML entities
             * @param html HTML string to unescape
             */
            const unescapeHtml = (html: string): string =>
                Object.entries(entityMapFromHtml).reduce(
                    (acc, [k, v]) => acc.replace(new RegExp(k, "g"), v),
                    String(html)
                );

            /**
             * @summary changes HTML to Markdown
             * @param html HTML to Markdownify
             */
            const HTMLtoMarkdown = (html: string): string =>
                unescapeHtml(
                    html
                        .replace(/<a href="(.+?)".+?>(.+?)<\/a>/g, "[$2]($1)")
                        .replace(/<em>(.+?)<\/em>/g, "*$1*")
                        .replace(/<strong>(.+?)<\/strong>/g, "**$1**")
                        .replace(/<code>(.+?)<\/code>/g, "`$1`")
                );

            /**
             * @summary changes Markdown to HTML
             * @param markdown Markdown to convert
             */
            const markdownToHTML = (markdown: string): string => {
                const html = escapeHtml(markdown);

                const rules: [RegExp, string][] = [
                    // strong should match before italics to avoid overcomplicating the regex
                    // https://regex101.com/r/s72LF3/1
                    [/(?<!`.*?(?=.+`))([*_]{2})(.+?)\1/g, htmlstrong`$2`],
                    // it is imperative that italics are matched before links as _blank is very hard to exclude
                    // https://regex101.com/r/LvjLPz/1
                    [/(?<!`.*?(?=.+`))([*_])([^`*_]+?)\1(?![*_])/g, htmlem`$2`],
                    // convert paired backticks into <code> elements
                    [/`(.+?)`/g, htmlinlinecode`$1`],
                    [/\[([^\]]+)\]\((.+?)\)/g, htmllink("$2", "$1")],
                ];

                return rules.reduce(
                    (a, [expr, replacer]) => a.replace(expr, replacer),
                    html
                );
            };

            /**
             * @summary untags the comment text
             * @param text comment text to untag
             */
            const untag = (text: string): string =>
                text
                    .replace(/\$SITENAME\$/g, sitename)
                    .replace(/\$SITEURL\$/g, site)
                    .replace(/\$MYUSERID\$/g, getLoggedInUserId(StackExchange));

            /**
             * @summary tags the comment text
             * @param markdown Markdown text of the comment
             */
            const tag = (markdown: string): string => {
                const regname = new RegExp(sitename, "g");
                const regurl = new RegExp(`//${site}`, "g");
                const reguid = new RegExp(
                    `/${getLoggedInUserId(StackExchange)}[)]`,
                    "g"
                );
                return markdown
                    .replace(regname, "$SITENAME$")
                    .replace(regurl, "//$SITEURL$")
                    .replace(reguid, "/$MYUSERID$)");
            };

            /**
             * @summary finalizes the edit mode (save or cancel)
             * @param popup wrapper popup
             * @param commentElem comment item container
             * @param value comment text to display
             */
            const closeEditMode = (popup: HTMLElement, commentElem: HTMLElement, value: string): void => {
                empty(commentElem);
                commentElem.innerHTML = value;
                commentElem.closest("li")!.querySelector("input")!.disabled =
                    false;

                commentElem.dataset.mode = "insert";

                popup
                    .querySelectorAll<HTMLElement>(".quick-insert")
                    .forEach(show);
            };

            /**
             * @summary opens the comment edit mode
             * @param commentElem comment item container
             * @param popup wrapper popup
             */
            const openEditMode = (
                commentElem: HTMLElement,
                popup: HTMLElement
            ): void => {
                const {
                    id,
                    dataset,
                    dataset: { mode = "insert" },
                } = commentElem;

                if (mode === "edit") return;

                const commentId = id.replace("desc-", "");

                const comments = Store.load<StoredComment[]>("comments", []);
                const originalComment = comments.find((c) => c.id === commentId);
                if (!originalComment) {
                    debugLogger.log(`failed to find edited comment (${commentId})`);
                    return;
                }

                const { description } = originalComment;

                empty(commentElem);

                const replaceVars = makeVariableReplacer({
                    site,
                    sitename,
                    myId: getLoggedInUserId(StackExchange),
                    opName: getOP(),
                });

                const initialHTML = markdownToHTML(replaceVars(description));

                const preview = el("span", "d-inline-block", "p8");
                preview.innerHTML = initialHTML;

                const [areaWrap, area] = makeStacksTextArea(commentElem.id, { value: description });

                area.addEventListener("input", ({ target }) => {
                    const { value } = <HTMLTextAreaElement>target;
                    preview.innerHTML = markdownToHTML(replaceVars(value));
                });

                area.addEventListener("change", ({ target }) => {
                    const { value } = <HTMLTextAreaElement>target;

                    const updatedComment: StoredComment = {
                        ...originalComment,
                        description: value,
                    };

                    closeEditMode(popup, commentElem, replaceVars(saveComment(updatedComment)));
                });

                // Disable comment input while editing
                commentElem.closest("li")!.querySelector("input")!.disabled =
                    true;

                // Disable quick-insert while editing.
                popup
                    .querySelectorAll<HTMLElement>(".quick-insert")
                    .forEach(hide);

                // save/cancel links to add to textarea
                const actions = document.createElement("div");
                actions.classList.add("actions");

                const cancel = makeButton("cancel", "cancel edit");
                cancel.addEventListener("click", () => {
                    popup
                        .querySelectorAll<HTMLElement>(".quick-insert")
                        .forEach(show);
                    closeEditMode(popup, commentElem, initialHTML);
                });

                actions.append(cancel);
                commentElem.append(preview, areaWrap, actions);

                const { paddingLeft, paddingRight, font } = window.getComputedStyle(area);

                const areaHorizontalPadding = parseInt(paddingLeft) + parseInt(paddingRight);

                //650 is <ul> width 8 is <li> padding-right, 20 is <label> padding
                const lineWidth = 650 - 20 - 8 - areaHorizontalPadding;

                area.rows = getNumTextLines(description, font, lineWidth);

                area.addEventListener("input", () => {
                    const { value } = area;
                    area.rows = getNumTextLines(value, font, lineWidth);
                });

                dataset.mode = "edit";
            };

            /**
             * @summary interops with the original ARC
             * @param numComments number of comments to load
             */
            const originalARCinterop = (numComments: number): StoredComment[] => {
                debugLogger.log("original ARC interop called");

                const comments: StoredComment[] = [];

                for (let i = 0; i < numComments; i++) {
                    const name = Store.load<string>(`name-${i}`, "");
                    const desc = Store.load<string>(`desc-${i}`, "");

                    if (!name || !desc) continue;

                    comments.push({
                        id: i.toString(),
                        name: trimCommentTargetFromName(name),
                        description: HTMLtoMarkdown(desc),
                        targets: getCommentTargetsFromName(name)
                    });
                }

                const status = Store.save("comments", comments);
                if (status) {
                    // clean up after the original ARC if we succeeded
                    Store.clear("name-");
                    Store.clear("desc-");
                }

                return comments;
            };

            /**
             * @summary loads comments from storage
             */
            const loadComments = (): StoredComment[] => {
                if (Store.hasMatching("name-") || Store.hasMatching("desc-")) {
                    const numComments = Store.load<number>("commentcount", 0);
                    return originalARCinterop(numComments);
                }

                return Store.load<StoredComment[]>("comments", []);
            };

            /**
             * @summary removes all custom comments and replaces them with new ones
             * @param comments new comments to overwrite with
             */
            const resetComments = (comments: StoredComment[]) => {
                return Store.save("comments", comments);
            };

            /**
             * @summary saves comment Markdown
             * @param comment comment to store
             * @returns HTML text of the comment
             */
            const saveComment = (comment: StoredComment): string => {
                const { description, id } = comment;

                const toStore: StoredComment = {
                    ...comment,
                    description: tag(description)
                };

                const comments = Store.load<StoredComment[]>("comments", []);

                const commentIdx = comments.findIndex((c) => c.id === id);

                commentIdx === -1 ?
                    comments.push(toStore) :
                    comments.splice(commentIdx, 1, toStore);

                Store.save("comments", comments);

                return (
                    ((Store.load("ShowGreeting", false) &&
                        Store.load("WelcomeMessage", "")) ||
                        "") + untag(markdownToHTML(description))
                );
            };

            /**
             * @summary switches currently selected comment
             * @param popup wrapper popup
             * @param action comment item
             */
            const switchSelectedComment = (popup: HTMLElement, action: HTMLLIElement): void => {
                const acts = popup.querySelector(".action-list");
                acts?.querySelectorAll("li").forEach(({ classList }) =>
                    classList.remove("action-selected")
                );
                action.classList.add("action-selected");
            };

            /**
             * @summary makes the comment click handler (selecting comments)
             * @param popup wrapper popup
             */
            const makeCommentClickHandler =
                (popup: HTMLElement): EventListener =>
                    ({ target }) => {
                        const el = <HTMLElement>target;

                        if (!el.matches("input[type=radio]")) return;

                        const acts = popup.querySelector(".action-list")!;
                        acts.querySelectorAll("li").forEach(({ classList }) =>
                            classList.remove("action-selected")
                        );

                        if (Store.load("hide-desc", false)) {
                            popup
                                .querySelectorAll<HTMLElement>(".action-desc")
                                .forEach(hide);
                        }

                        const action = el.closest("li")!;
                        switchSelectedComment(popup, action);

                        const descr = action.querySelector<HTMLElement>(".action-desc")!;

                        show(descr);
                    };

            /**
             * @summary makes the comment quick insert handler
             * @param popup wrapper popup
             */
            const makeQuickInsertHandler =
                (popup: HTMLElement): EventListener =>
                    ({ target }) => {
                        const el = <HTMLElement>target;

                        if (!el.matches("label > .quick-insert")) return;

                        const action = el.closest("li");
                        const radio = action?.querySelector("input");
                        const descr = action?.querySelector(".action-desc");

                        if (!action || !radio || !descr)
                            return notify("Something went wrong", "danger");

                        switchSelectedComment(popup, action);
                        radio.checked = true;

                        insertComment(descr.innerHTML, getOP());
                    };

            /**
             * @summary sets up comment event listeners
             * @param popup wrapper popup
             * @param viewId comment view id
             */
            const setupCommentHandlers = (
                popup: HTMLElement,
                viewId: string,
            ): void => {
                popup.addEventListener("dblclick", ({ target }) => {
                    const el = <HTMLElement>target;
                    if (!el.matches(".action-desc")) return;
                    openEditMode(el, popup);
                });

                const insertHandler = makeQuickInsertHandler(popup);
                const selectHandler = makeCommentClickHandler(popup);

                popup.addEventListener("click", (event) => {
                    const currView = Store.load("CurrentView", "search-popup");
                    debugLogger.log({ currView, viewId });
                    if (currView !== viewId) return;
                    insertHandler(event);
                    selectHandler(event);
                });
            };

            /**
             * @summary replaces variables with dynamic substitutions
             * @param options configuration options
             */
            const makeVariableReplacer =
                (options: VarsReplacerOptions) =>
                    /**
                     * @param text text with user variables
                     */
                    (text: string): string => {
                        const { myId, opName, site, sitename } = options;

                        const rules: Record<string, string> = {
                            SITENAME: sitename,
                            SITEURL: site,
                            MYUSERID: myId,
                            OP: opName,
                        };

                        return Object.entries(rules).reduce(
                            (a, [expression, replacement]) =>
                                a.replace(
                                    new RegExp(`\\$${expression}\\$`, "g"),
                                    replacement
                                ),
                            text
                        );
                    };

            /**
             * @summary Checks if a given comment could be used together with a given post type
             * @param comment {@link StoredComment} to match
             * @param target {@link Target} to match
             */
            const isCommentValidForTarget = (comment: StoredComment, target: Target): boolean => {
                const { targets } = comment;
                return targets.includes(target);
            };

            /**
             * @summary updates comments in the UI
             * @param popup wrapper popup
             * @param target comment target type
             */
            const updateComments = (popup: HTMLElement, target: Target): void => {
                const comments = loadComments();
                if (!comments.length) {
                    resetComments(commentDefaults);
                    return updateComments(popup, target);
                }

                const ul = popup.querySelector(".action-list")!;
                empty(ul);

                const myId = getLoggedInUserId(StackExchange);
                const opName = getOP();

                const opts: VarsReplacerOptions = {
                    myId,
                    opName,
                    site,
                    sitename,
                };

                const replaceVars = makeVariableReplacer(opts);

                const greet = Store.load("ShowGreeting", false);
                const welcome = Store.load("WelcomeMessage", "");
                const greeting = greet ? `${replaceVars(welcome)} ` : "";

                debugLogger.log({
                    comments,
                    target,
                    greet,
                    welcome,
                    greeting,
                    ...opts,
                });

                const listItems = comments
                    .filter((comment) => isCommentValidForTarget(comment, target))
                    .map(({ name, id, description }) => {
                        const cname = name.replace(allTgtMatcher, "");

                        const desc = replaceVars(description).replace(/\$/g, "$$$");

                        return makeCommentItem(
                            id,
                            cname.replace(/\$/g, "$$$"),
                            markdownToHTML(greeting + desc)
                        );
                    });

                ul.append(...listItems);

                toggleDescriptionVisibility(popup);
            };

            /**
             * @summary matches a word in text
             * @param source text to search in
             * @param term word to match
             */
            const matchText = (source: string, term: string): boolean => {
                const strict = term.startsWith("\"") && term.endsWith("\"");
                return new RegExp(
                    strict ? `\\b${term.slice(1, -1)}\\b` : term, "gm"
                ).test(source);
            };

            /**
             * @summary filters comments based on text
             * @param popup wrapper popup
             * @param text text to match
             */
            const filterOn = (popup: HTMLElement, text: string): void => {
                const term = text.toLowerCase();

                const items =
                    popup.querySelectorAll<HTMLLIElement>(".action-list > li");

                if (!text) return items.forEach(show);

                items.forEach((item) => {
                    const name = item
                        .querySelector(".action-name")!
                        .innerHTML!.toLowerCase();
                    const desc = item
                        .querySelector(".action-desc")!
                        .innerHTML!.toLowerCase();

                    const shown = matchText(name, term) || matchText(desc, term);

                    shown ? show(item) : hide(item);
                });
            };

            /**
             * @summary sets up search event handlers
             * @param popup wrapper popup
             */
            const setupSearchHandlers = (
                popup: HTMLElement,
                searchInput: HTMLInputElement
            ): void => {
                const callback: EventListener = ({ target }) =>
                    setTimeout(() => {
                        const { value } = <HTMLInputElement>target;
                        filterOn(popup, value);
                    }, 100);

                searchInput.addEventListener("keydown", callback);
                searchInput.addEventListener("change", callback);
                searchInput.addEventListener("cut", callback);
                searchInput.addEventListener("paste", callback);
                searchInput.addEventListener("search", callback);
            };

            /**
             * @summary Adjust the descriptions so they show or hide based on the user's preference.
             * @param popup wrapper popup
             * @param hidden is hidden?
             */
            const toggleDescriptionVisibility = (
                popup: HTMLElement,
                hidden = Store.load("hide-desc", false)
            ): void => {
                popup
                    .querySelectorAll<HTMLElement>(
                        "li:not(.action-selected) .action-desc"
                    )
                    .forEach((d) => (hidden ? hide(d) : show(d)));
            };

            /**
             * @summary makes a JSONP request
             * @param url resource URL
             * @param callbackName JSONP callback name
             */
            const getJSONP = <T>(
                url: string,
                callbackName = "callback"
            ): Promise<T> =>
                new Promise((resolve, reject) => {
                    // if running from a manager, page is only accessible from unsafeWindow
                    const target =
                        typeof unsafeWindow !== "undefined"
                            ? unsafeWindow
                            : window;

                    const clean = (handler: (value: T) => void, value: T) => {
                        script.remove();
                        delete target[callbackName];
                        handler(value);
                    };

                    target[callbackName] = (json: T) => clean(resolve, json);

                    const script = document.createElement("script");
                    script.src = url;
                    script.async = true;

                    script.addEventListener("error", ({ error }) =>
                        clean(reject, error)
                    );

                    document.body.append(script);
                });

            /**
             * @summary makes a request for JSON data
             * @param url resource URL
             */
            const getJSON = async <T>(url: string): Promise<T> => {
                const res = await fetch(url);
                return res.json();
            };

            /**
             * @summary loads comments from a remote source
             * @param url remore URL to fetch from
             * @param isJSONP JSONP switch
             */
            const fetchFromRemote = async (url: string, isJSONP = false): Promise<void> => {
                debugLogger.log({ isJSONP });

                const fetcher = isJSONP ? getJSONP : getJSON;

                const remoteComments: Omit<StoredComment, "id">[] = await fetcher(url);
                const comments: StoredComment[] = remoteComments.map(
                    ({ description, name, targets }, i) => ({
                        description,
                        id: i.toString(),
                        name: trimCommentTargetFromName(name),
                        targets: targets || getCommentTargetsFromName(name)
                    })
                );

                Store.save("comments", comments);
            };

            /**
             * @summary shows the popup (prevents SE overrides)
             * @param popup wrapper popup
             */
            const showPopup = (popup: HTMLElement): void => {
                show(popup);
                fadeTo(popup, 1);
                const { style, classList } = popup;
                style.display = "";
                classList.remove("popup-closing", "popup-closed");
            };

            /**
             * @summary creates ARC modal and wires functionality
             * @param where element next to which the button is inserted
             * @param target comment {@link Target}
             */
            const autoLinkAction: Actor = async (
                where,
                target,
            ) => {
                Store.save("post_target", target);

                const popup = makePopup(target);

                if (!popup.isConnected) document.body.append(popup);

                showPopup(popup);

                const jsonURL = Store.load("RemoteUrl", "");
                const jsonpURL = Store.load("remote_json", "");

                //Auto-load from JSONP remote if enabled
                if (jsonpURL && Store.load("AutoRemote", false)) {
                    debugLogger.log(`autofetching JSONP remote`);
                    await fetchFromRemote(jsonpURL, true);
                }

                if (jsonURL && Store.load("remote_json_auto", false)) {
                    debugLogger.log(`autofetching JSON remote`);
                    await fetchFromRemote(jsonURL);
                }

                //Get user info and inject
                const userid = getUserId(where);

                if (userid) {
                    const uinfo = await getUserInfo(userid);
                    debugLogger.log({ userid, uinfo });
                    if (uinfo) addUserInfo(uinfo);
                }

                // addUserInfo sets new user state, so should happen before comments are updated
                updateComments(popup, target);

                center(popup);

                StackExchange.helpers.bindMovablePopups();
            };

            /**
             * @summary waits until an {@link Element} matching {@link selector} appears in DOM
             * @param selector selector to wait for
             * @param context {@link Element} to observe
             */
            const waitFor = <T extends Element>(
                selector: string,
                context: Element | Document = document
            ): Promise<T> => {
                return new Promise<T>((resolve) => {
                    const element = context.querySelector<T>(selector);
                    if (element) resolve(element);

                    const observer = new MutationObserver(() => {
                        const element = context.querySelector<T>(selector);
                        if (element) {
                            observer.disconnect();
                            resolve(element);
                        }
                    });

                    observer.observe(context, {
                        attributes: true,
                        childList: true,
                        subtree: true,
                    });
                });
            };

            /**
             * @summary observes {@link context} for changes
             * @param selector selector to match on changes
             * @param context {@link Element} to observe
             * @param callback function to call with {@link selector} match results
             */
            const observe = <T extends Element>(
                selector: string,
                context: Element,
                callback: (matched: T[]) => void
            ): void => {
                const observerCallback = () => {
                    const collection = context.querySelectorAll<T>(selector);
                    if (collection.length) callback([...collection]);
                };

                const observer = new MutationObserver(observerCallback);

                observer.observe(context, {
                    attributes: true,
                    childList: true,
                    subtree: true,
                });

                observerCallback();
            };

            /**
             * @summary Attach an "auto" link somewhere in the DOM. This link is going to trigger the iconic ARC behavior.
             * @param selector A selector for a DOM element which, when clicked, will invoke the locator.
             * @param locator A function that will search for both the DOM element, next to which the "auto" link
             *                will be placed and where the text selected from the popup will be inserted.
             *                This function will receive the triggerElement as the first argument when called and it
             *                should return an array with the two DOM elements in the expected order.
             * @param injector A function that will be called to actually inject the "auto" link into the DOM.
             *                 This function will receive the element that the locator found as the first argument when called.
             *                 It will receive the action function as the second argument, so it know what to invoke when the "auto" link is clicked.
             * @param actor A function that will be called when the injected "auto" link is clicked.
             */
            const addTriggerButton = async <T extends HTMLElement>(
                selector: string,
                locator: Locator<T>,
                injector: Injector,
                actor: Actor
            ): Promise<void> => {
                const content = document.getElementById("content");
                if (!content) {
                    debugLogger.log("missing main content");
                    return;
                }

                observe<T>(selector, content, (targets) => {
                    targets
                        .filter(({ dataset }) => dataset.arc !== "ready")
                        .forEach((target) => {

                            target.addEventListener("click", async () => {
                                const [injectNextTo, placeIn] = await locator(target);

                                debugLogger.log({ injectNextTo, placeIn });

                                if (!injectNextTo || !placeIn) return;

                                document
                                    .querySelectorAll<HTMLElement>("[data-arc=current]")
                                    .forEach((e) => delete e.dataset.arc);

                                placeIn.dataset.arc = "current";
                                return injector(injectNextTo, actor);
                            }, { once: true });

                            target.dataset.arc = "ready";
                        });
                });
            };

            /**
             * @description A locator for the help link next to the comment box under a post and the textarea for the comment.
             * @param where A DOM element, near which we're looking for the location where to inject our link.
             * @returns The DOM element next to which the link should be inserted and the element into which the comment should be placed.
             */
            const findCommentElements: Locator = async (where) => {
                const { id } = where.parentElement!;

                const divId = id.replace("-link", "");
                const div = document.getElementById(divId)!;

                const injectNextTo = await waitFor<HTMLElement>(".js-comment-form-layout button:last-of-type", div);

                const placeCommentIn = div.querySelector("textarea");
                return [injectNextTo, placeCommentIn];
            };

            /**
             * @summary A locator for the edit summary input box under a post while it is being edited.
             * @param where A DOM element, near which we're looking for the location where to inject our link.
             * @returns The DOM element next to which the link should be inserted and the element into which the comment should be placed.
             */
            const findEditSummaryElements: Locator = (where) => {
                const href = where.getAttribute("href") || "";
                const [, divid] = href.match(/posts\/(\d+)\/edit/) || [];

                return Promise.all([
                    waitFor<HTMLElement>(`#submit-button-${divid}`),
                    waitFor<HTMLElement>(`#edit-comment-${divid}`),
                ]);
            };

            /**
             * @summary A locator for the text area in which to put a custom off-topic closure reason in the closure dialog.
             * @param _where A DOM element, near which we're looking for the location where to inject our link.
             * @returns The DOM element next to which the link should be inserted and the element into which the comment should be placed.
             */
            const findClosureElements: Locator = async (_where) => {
                return Promise.all([
                    waitFor<HTMLElement>("#close-question-form .js-popup-submit"),
                    waitFor<HTMLElement>("#site-specific-comment textarea"),
                ]);
            };

            /**
             * @summary A locator for the edit summary you get in the "Help and Improvement" review queue.
             * @param _where A DOM element, near which we're looking for the location where to inject our link.
             * @returns The DOM element next to which the link should be inserted and the element into which the comment should be placed.
             */
            const findReviewQueueElements: Locator = async (_where) => {
                const injectTo = document.querySelector<HTMLElement>(".js-review-editor [id^='submit-button']");
                const placeIn = document.querySelector<HTMLElement>(".js-review-editor .js-post-edit-comment-field");
                return [injectTo, placeIn];
            };

            /**
             * @summary makes the "auto" button
             * @param callback {@link Actor} to call on button click
             * @param params {@link Actor} parameters
             */
            const makePopupOpenButton = (
                callback: Actor,
                ...params: Parameters<Actor>
            ): HTMLButtonElement => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.textContent = "ARC comment";
                btn.classList.add("comment-auto-link", "s-btn", "s-btn__primary");
                btn.addEventListener("click", () => callback(...params));
                return btn;
            };

            /**
             * @summary gets target type by post type
             * @param where The DOM element next to which we'll place the link.
             * @param clsMap post type to target map
             */
            const getTargetType = (
                where: HTMLElement,
                clsMap: [PostType, Target][]
            ): Target => {
                const parent =
                    where.closest(".answer") || where.closest(".question");

                if (!parent) {
                    return Target.CommentQuestion;
                }

                const { classList } = parent;

                const [, target] = clsMap.find(([c]) => classList.contains(c)) || [];

                return target || Target.CommentQuestion;
            };

            /**
             * @summary Inject the auto link next to the given DOM element.
             * @param where The DOM element next to which we'll place the link.
             * @param actor The function that will be called when the link is clicked.
             */
            const injectAutoLink: Injector = (where, actor) => {
                const existingAutoLinks = siblings(where, ".comment-auto-link");
                if (existingAutoLinks.length) return;

                const clsMap: [PostType, Target][] = [
                    ["answer", Target.CommentAnswer],
                    ["question", Target.CommentQuestion],
                ];

                const target = getTargetType(where, clsMap);

                const lsep = makeSeparator();
                const alink = makePopupOpenButton(actor, where, target);
                where.after(lsep, alink);
            };

            /**
             * @summary Inject the auto link next to the given DOM element.
             * @param where The DOM element next to which we'll place the link.
             * @param actor The function that will be called when the link is clicked.
             */
            const injectAutoLinkClosure: Injector = (where, actor) => {
                const existingAutoLinks = siblings(where, ".comment-auto-link");
                if (existingAutoLinks.length) return;

                const lsep = makeSeparator();
                const alink = makePopupOpenButton(
                    actor,
                    where,
                    Target.Closure
                );
                where.after(lsep, alink);
            };

            /**
             * @summary Inject hte auto link next to the "characters left" counter below the edit summary in the review queue.
             * @param where The DOM element next to which we'll place the link.
             * @param actor The function that will be called when the link is clicked.
             */
            const injectAutoLinkReviewQueue: Injector = (where, actor) => {
                const existingAutoLinks = siblings(where, ".comment-auto-link");
                if (existingAutoLinks.length) return;

                const clsMap: [PostType, Target][] = [
                    ["answer", Target.EditSummaryAnswer],
                    ["question", Target.EditSummaryQuestion],
                ];

                const target = getTargetType(where, clsMap);

                const lsep = makeSeparator();
                const alink = makePopupOpenButton(actor, where, target);
                alink.style.float = "right";

                where.after(lsep, alink);
            };

            /**
             * Inject the auto link next to the edit summary input box.
             * This will also slightly shrink the input box, so that the link will fit next to it.
             * @param where The DOM element next to which we'll place the link.
             * @param actor The function that will be called when the link is clicked.
             */
            const injectAutoLinkEdit: Injector = (where, actor) => {
                const existingAutoLinks = siblings(where, ".comment-auto-link");
                if (existingAutoLinks.length) return;

                const { style } = where;
                style.width = "510px";

                const overs = siblings<HTMLElement[]>(
                    where,
                    ".actual-edit-overlay"
                );
                overs.forEach(({ style }) => (style.width = "510px"));

                const clsMap: [PostType, Target][] = [
                    ["answer", Target.EditSummaryAnswer],
                    ["question", Target.EditSummaryQuestion],
                ];

                const target = getTargetType(where, clsMap);

                const lsep = makeSeparator();
                const alink = makePopupOpenButton(actor, where, target);
                where.after(lsep, alink);
            };

            addStyles();

            addTriggerButton(
                ".js-add-link",
                findCommentElements,
                injectAutoLink,
                autoLinkAction
            );

            addTriggerButton(
                ".js-edit-post",
                findEditSummaryElements,
                injectAutoLinkEdit,
                autoLinkAction
            );

            addTriggerButton(
                ".js-close-question-link",
                findClosureElements,
                injectAutoLinkClosure,
                autoLinkAction
            );

            addTriggerButton(
                ".js-review-submit",
                findReviewQueueElements,
                injectAutoLinkReviewQueue,
                autoLinkAction
            );
        });
    }
}, { once: true });
