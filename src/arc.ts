type ToastTypes = "success" | "warning" | "danger";

interface Window {
    [x: string]: unknown;
}

interface Document {
    getElementById<T extends HTMLElement>(elementId: string): T | null;
}

type PostType = "answer" | "question";

type Placement = readonly [insert: HTMLElement | null, place: HTMLElement];

type Locator<T extends HTMLElement = HTMLElement> = (where: T) => Placement;

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

type TextInputOptions = {
    value?: string;
    title?: string;
    placeholder?: string;
    classes?: string[];
};

type StacksTextInputOptions = TextInputOptions & {
    label?: string;
    iconClasses?: string[];
    inputClasses?: string[];
};

type CheckboxOptions = {
    checked?: boolean;
    classes?: string[];
};

type IconButtonOptions = {
    url?: string;
    classes?: string[];
};

type CommentInfo = { name: string; description: string; targets: string[]; };

type StoredComment = { id: string, name: string; desc: string; };

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
             * @returns {number}
             */
            const getNumTextLines = (text: string, font: string, lineWidth: number) => {
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
             * @param {HTMLElement} element
             * @returns {HTMLElement}
             */
            const center = (element: HTMLElement) => {
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
             * @param {HTMLElement}
             * @returns {HTMLElement}
             */
            const hide = (element: HTMLElement) =>
                element.classList.add("d-none");

            /**
             * @summary shows an element
             * @param {HTMLElement}
             * @returns {HTMLElement}
             */
            const show = (element: HTMLElement) =>
                element.classList.remove("d-none");

            /**
             * @summary empties a node
             * @param {Node} node
             * @returns {Node}
             */
            const empty = (node: Node) => {
                while (node.firstChild) node.firstChild.remove();
                return node;
            };

            /**
             * @summary gets an array of element siblings
             * @param {HTMLElement} el
             * @param {string} selector
             * @returns {Element[]}
             */
            const siblings = <T extends Element[]>(
                el: HTMLElement,
                selector?: string
            ) => {
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
             * @param {HTMLElement} element
             * @param {number} min
             * @param {number} [speed]
             * @returns {HTMLElement}
             */
            const fadeTo = (element: HTMLElement, min: number, speed = 200) => {
                const { style } = element;
                style.transitionProperty = "opacity";
                style.transitionDuration = `${speed.toFixed(0)}ms`;
                style.transitionTimingFunction = "linear";
                style.opacity = min.toFixed(2);
                return element;
            };

            /**
             * @summary fades out an element
             * @param {HTMLElement} el
             * @param {number} [speed]
             * @returns {HTMLElement}
             */
            const fadeOut = (el: HTMLElement, speed = 200) =>
                fadeTo(el, 0, speed);

            /**
             * @summary Return "s" if the word should be pluralised
             * @param {number} count amount
             */
            const pluralise = (count: number) => (count === 1 ? "" : "s");

            /**
             * @summary finds and runs a handler from a hashmap
             * @param {Record<string, (...args: any[]) => any>} hashmap key -> val lookup
             * @param {(key: string) => boolean} comparator comparator function
             * @returns {any}
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

                static get numKeys() {
                    const {
                        storage: { length },
                    } = this;
                    return length;
                }

                /**
                 * @summary clears storage
                 * @param {string} startsWith
                 * @returns {void}
                 */
                static clear(startsWith: string): void {
                    const { numKeys, prefix, storage } = this;

                    for (let i = numKeys - 1; i >= 0; i--) {
                        const key = storage.key(i)!;

                        if (key.startsWith(prefix + startsWith))
                            storage.removeItem(key);
                    }
                }

                static load<T>(key: string, def?: T): T {
                    const { prefix, storage } = this;
                    const val = storage.getItem(prefix + key);
                    return val ? JSON.parse(val) : def;
                }

                static save<T>(key: string, val: T): void {
                    const { prefix, storage } = this;
                    storage.setItem(prefix + key, JSON.stringify(val));
                }

                static toggle(key: string) {
                    return Store.save(key, !Store.load(key));
                }

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
            const commentDefaults: CommentInfo[] = [
                {
                    targets: [Target.CommentQuestion],
                    name: "More than one question asked",
                    description: `It is preferred if you can post separate questions instead of combining your questions into one. That way, it helps the people answering your question and also others hunting for at least one of your questions. Thanks!`,
                },
                {
                    targets: [Target.CommentQuestion],
                    name: "Duplicate Closure",
                    description: `This question will likely be closed as a duplicate soon. If the answers from the duplicates do not fully address your question, please edit it to include why and flag this for re-opening. Thanks!`,
                },
                {
                    targets: [Target.CommentAnswer],
                    name: "Answers just to say Thanks!",
                    description: `Please do not add "thanks" as answers. Invest some time in the site and you will gain sufficient ${htmllink(
                        "/privileges",
                        "privileges"
                    )} to upvote answers you like, which is our way of saying thank you.`,
                },
                {
                    targets: [Target.CommentAnswer],
                    name: "Nothing but a URL (and isn't spam)",
                    description: `Whilst this may theoretically answer the question, ${htmllink(
                        "https://meta.stackexchange.com/q/8259",
                        "it would be preferable"
                    )} to include the essential parts of the answer here, and provide the link for reference.`,
                },
                {
                    targets: [Target.CommentAnswer],
                    name: "Requests to OP for further information",
                    description: `This is really a comment, not an answer. With a bit more rep, ${htmllink(
                        "/privileges/comment",
                        "you will be able to post comments"
                    )}. For the moment, I have added the comment for you and flagging the post for deletion.`,
                },
                {
                    targets: [Target.CommentAnswer],
                    name: "OP using an answer for further information",
                    description: `Please use the ${htmlem`Post answer`} button only for actual answers. You should modify your original question to add additional information.`,
                },
                {
                    targets: [Target.CommentAnswer],
                    name: "OP adding a new question as an answer",
                    description: `If you have another question, please ask it by clicking the ${htmllink(
                        "/questions/ask",
                        "Ask Question"
                    )} button.`,
                },
                {
                    targets: [Target.CommentAnswer],
                    name: 'Another user adding a "Me too!"',
                    description: `If you have a ${htmlem`new`} question, please ask it by clicking the ${htmllink(
                        "/questions/ask",
                        "Ask Question"
                    )} button. If you have sufficient reputation, ${htmllink(
                        "/privileges/vote-up",
                        "you may upvote"
                    )} the question. Alternatively, "star" it as a favorite, and you will be notified of any new answers.`,
                },
                {
                    targets: [Target.Closure],
                    name: "Too localized",
                    description: `This question appears to be off-topic because it is too localized.`,
                },
                {
                    targets: [Target.EditSummaryQuestion],
                    name: "Improper tagging",
                    description: `The tags you used are not appropriate for the question. Please review ${htmllink(
                        "/help/tagging",
                        "What are tags, and how should I use them?"
                    )}`,
                },
            ];

            if (!Store.load("WelcomeMessage"))
                Store.save("WelcomeMessage", `Welcome to ${sitename}! `);

            /**
             * @summary injects ARC-specific CSS into the page
             * @returns {void}
             */
            const addStyles = () => {
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
                    color: #888;
                    cursor: default;
                }`,
                    `.${arc}.popup .main .action-list li label .quick-insert{
                    display:none;
                    position:absolute;
                    top:0;
                    right:0;
                    height:100%;
                    margin:0;font-size:300%;
                    color:transparent;
                    border:0;
                    transition:.3s;
                    text-shadow:0 0 1px #fff;
                    cursor:pointer;
                    background-color:rgba(0,0,0,0.1);
                    background:rgba(0,0,0,0.1);
                    box-shadow:none;
                    -moz-box-shadow:none;
                    -webkit-box-shadow:none;
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
             * @param {string} id input id (also sets the name)
             * @param {TextInputOptions} [options]
             * @returns {HTMLInputElement}
             */
            const makeTextInput = (
                id: string,
                {
                    value = "",
                    classes = [],
                    placeholder = "",
                    title,
                }: TextInputOptions = {}
            ) => {
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
             * @param {string} id input id (also sets the name)
             * @param {CheckboxOptions} [options]
             * @returns {HTMLInputElement}
             */
            const makeCheckbox = (
                id: string,
                { checked = false, classes = [] }: CheckboxOptions = {}
            ) => {
                const input = document.createElement("input");
                input.classList.add(...classes);
                input.type = "checkbox";
                input.id = input.name = id;
                input.checked = checked;
                return input;
            };

            const el = <T extends keyof HTMLElementTagNameMap>(
                tag: T,
                ...classes: string[]
            ): HTMLElementTagNameMap[T] => {
                const el = document.createElement(tag);
                el.classList.add(...classes);
                return el;
            };

            type TextAreaOptions = {
                value?: string;
                rows?: number;
                label?: string;
            };

            /**
             * {@link https://stackoverflow.design/product/components/textarea/}
             *
             * @summary creates a Stacks textarea
             * @param {string} id textarea id (also sets the name)
             * @param {TextAreaOptions} options textarea options
             * @returns {[HTMLDivElement, HTMLTextAreaElement]}
             */
            const makeStacksTextArea = (
                id: string,
                { label = "", rows = 1, value = "" }: TextAreaOptions
            ) => {
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

                return [wrap, area] as const;
            };

            /**
             * @summary helper function for making Stacks icons
             * @param {string} icon icon class name
             * @param {string} path icons path to set
             * @param {...string} classes list of classes to set
             * @returns {[SVGSVGElement, SVGPathElement]}
             */
            const makeStacksIcon = (
                icon: string,
                path: string,
                ...classes: string[]
            ) => {
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
             * @param {string} id input id (also sets the name)
             * @param {string} icon icons class to set
             * @param {string} path icon path to set
             * @param {StacksTextInputOptions} [options] text input options
             * @returns {[HTMLDivElement, HTMLInputElement]}
             */
            const makeStacksIconInput = (
                id: string,
                icon: string,
                path: string,
                {
                    label,
                    classes = [],
                    iconClasses = [],
                    inputClasses = [],
                    ...inputOptions
                }: StacksTextInputOptions = {}
            ) => {
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

                return [wrap, input] as const;
            };

            /**
             * {@link https://stackoverflow.design/product/components/inputs/#input-fills}
             *
             * @summary creates a Stacks URL input
             * @param {string} id input id (also sets the name)
             * @param {string} schema URL schema (http://, https://, or custom)
             * @param {StacksTextInputOptions} [options] text input options
             * @returns {[HTMLDivElement, HTMLDivElement, HTMLDivElement, HTMLInputElement]}
             */
            const makeStacksURLInput = (
                id: string,
                schema: string,
                { label, ...inputOptions }: StacksTextInputOptions = {}
            ) => {
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
                return [wrap, iwrap, iinput, input] as const;
            };

            /**
             * {@link https://stackoverflow.design/product/components/checkbox/}
             *
             * @summary creates a Stacks checkbox
             * @param {string} id input id (also sets the name)
             * @param {string} label checkbox label
             * @param {boolean} [state] initial checkbox state
             * @returns {[HTMLDivElement, HTMLInputElement]}
             */
            const makeStacksCheckbox = (
                id: string,
                label: string,
                state = false
            ) => {
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
                return [fset, input] as const;
            };

            /**
             * {@link https://stackoverflow.design/product/components/toggle-switch/}
             *
             * @summary creates a Stacks toggle
             * @param {string} id input id (also sets the name)
             * @param {string} label toggle label
             * @param {boolean} [state] initial toggle state
             * @returns {[HTMLDivElement, HTMLInputElement]}
             */
            const makeStacksToggle = (
                id: string,
                label: string,
                state = false
            ) => {
                const wrap = el("div", "d-flex", "ai-center", "gs8");

                const lbl = el("label", "flex--item", "s-label");
                lbl.htmlFor = id;
                lbl.textContent = label;

                const iwrap = el("div", "flex--item", "s-toggle-switch");

                const input = makeCheckbox(id, { checked: state });

                const lever = el("div", "s-toggle-switch--indicator");

                iwrap.append(input, lever);
                wrap.append(lbl, iwrap);

                return [wrap, input] as const;
            };

            /**
             * @summary makes a button
             * @param {string} text
             * @param {string} title
             * @param {...string} classes
             * @returns {HTMLAnchorElement}
             */
            const makeButton = (
                text: string,
                title: string,
                ...classes: string[]
            ) => {
                const button = el("button", "s-btn", ...classes);
                button.innerHTML = text;
                if (title) button.title = title;
                return button;
            };

            /**
             * @summary makes an info button icon
             * @param {string} icon icon class name
             * @param {string} title link title
             * @param {string} path icon path
             * @param {IconButtonOptions} options button creation options
             * @returns {SVGSVGElement}
             */
            const makeStacksIconButton = (
                icon: string,
                title: string,
                path: string,
                { url, classes = [] }: IconButtonOptions
            ) => {
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
             * @summary hides the rest of the views and shows the current one
             * @param {string} viewsSel selector for views
             * @returns {(view:HTMLElement) => HTMLElement}
             */
            const makeViewSwitcher =
                (viewsSel: string) => (view: HTMLElement) => {
                    document
                        .querySelectorAll<HTMLElement>(viewsSel)
                        .forEach(hide);
                    show(view);
                    Store.save("CurrentView", view.id);
                    debugLogger.log(`switched to view: ${view.id}`);
                    return view;
                };

            /**
             * @summary makes tabs view
             * @param {HTMLElement} popup wrapper popup
             * @param {string} id actions wrapper id
             * @param {PostType} postType parent post type
             * @returns {HTMLElement}
             */
            const makeTabsView: ViewMaker = (popup, id, _postType) => {
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

                const tabGroup = el("div", "s-btn-group", "flex--item");

                const btnGroupClasses = ["s-btn__muted", "s-btn__outlined"];

                const buttons = [
                    makeButton(
                        "filter",
                        "filter",
                        ...btnGroupClasses,
                        "popup-actions-filter"
                    ),
                    makeButton(
                        "import/export",
                        "import/export all comments",
                        ...btnGroupClasses,
                        "popup-actions-impexp"
                    ),
                    makeButton(
                        "remote",
                        "setup remote source",
                        ...btnGroupClasses,
                        "popup-actions-remote"
                    ),
                    makeButton(
                        "welcome",
                        "configure welcome",
                        ...btnGroupClasses,
                        "popup-actions-welcome"
                    ),
                    makeButton(
                        "settings",
                        "configure ARC",
                        ...btnGroupClasses,
                        "popup-actions-settings"
                    ),
                ];

                tabGroup.append(...buttons);

                tabGroup.addEventListener("click", ({ target }) => {
                    buttons.forEach(({ classList }) =>
                        classList.remove("is-selected")
                    );
                    (target as HTMLElement).classList.add("is-selected");
                });

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
                    fadeOut(seeBtn.closest(".main")!);
                });

                seeBtn.addEventListener("mouseleave", () => {
                    fadeTo(popup, 1.0);
                    fadeTo(seeBtn.closest(".main")!, 1);
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
                wrap.append(tabGroup, actionGroup);

                return (makeTabsView.view = wrap);
            };

            /**
             * @summary makes popup settings view
             * @param popup wrapper popup
             * @param id actions wrapper id
             */
            const makeSettingsView: ViewMaker = (popup, id) => {
                if (makeSettingsView.view) return makeSettingsView.view;

                const view = el("div", "view", "d-flex", "fd-column", "gs16");
                view.id = id;

                const generalWrap = el("div", "flex--item");
                const dangerWrap = el("div", "flex--item");

                const [descrToggle] = makeStacksToggle(
                    "toggleDescr",
                    "hide comment descriptions",
                    Store.load("hide-desc", false)
                );

                const [debugToggle] = makeStacksToggle(
                    "toggleDebug",
                    "ARC debug mode",
                    Store.load("debug", false)
                );

                const resetBtn = makeButton(
                    "reset",
                    "reset any custom comments",
                    "popup-actions-reset",
                    "s-btn__outlined",
                    "s-btn__danger"
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

                return (makeSettingsView.view = view);
            };

            /**
             * @summary makes the search view
             * @param {HTMLElement} popup wrapper popup
             * @param {string} id view id
             * @returns {HTMLElement}
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

                const view = el(
                    "div",
                    "view",
                    "d-flex",
                    "fd-column",
                    "gsy",
                    "gs16"
                );
                view.id = id;

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
                        "welcome-force",
                        "s-btn__primary",
                        "s-btn__filled",
                        "flex--item"
                    ),
                    makeButton(
                        "cancel",
                        "cancel",
                        "welcome-cancel",
                        "s-btn__danger",
                        "s-btn__outlined",
                        "flex--item"
                    ),
                ];

                const viewSwitcher = makeViewSwitcher(viewsSel);

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
                return (makeWelcomeView.view = view);
            };

            /**
             * @summary updates import/export comment section
             * @param {HTMLElement} view import/export view
             * @returns {HTMLElement}
             */
            const updateImpExpComments = (view: HTMLElement) => {
                const area = view.querySelector("textarea")!;

                const numComments = Store.load<number>("commentcount");
                const loaded = loadComments(numComments);

                const content = loaded
                    .map(
                        ({ name, desc }) =>
                            `###${name}\n${HTMLtoMarkdown(desc)}`
                    )
                    .join("\n\n");

                area.value = content;
                return view;
            };

            /**
             * @summary Show textarea in front of popup to import/export all comments (for other sites or for posting somewhere)
             * @param {HTMLElement} popup wrapper popup
             * @param {string} id view id
             * @param {PostType} postType parent post type
             * @returns {HTMLElement}
             */
            const makeImpExpView: ViewMaker = (popup, id, postType) => {
                if (makeImpExpView.view)
                    return updateImpExpComments(makeImpExpView.view);

                const view = el("div", "view");
                view.id = id;
                // because it will include the textarea and the buttons:
                view.classList.add("d-flex", "gs8", "gsy", "fd-column");

                const [areaWrap, area] = makeStacksTextArea("impexp", {
                    label: "Comment source",
                    rows: 20
                });

                area.addEventListener("change", async () => {
                    importComments(area.value);
                    updateComments(popup, postType);
                });

                const actionWrap = el("div", "actions", "flex--item");
                const buttonsWrap = el("div", "d-flex", "gs8", "gsx");

                const toJsonBtn = makeButton(
                    "JSON",
                    "Convert to JSON",
                    "s-btn__primary",
                    "flex--item"
                );
                const cancelBtn = makeButton(
                    "cancel",
                    "cancel import/export",
                    "s-btn__danger",
                    "flex--item"
                );

                const viewSwitcher = makeViewSwitcher(viewsSel);
                cancelBtn.addEventListener("click", () =>
                    viewSwitcher(
                        makeSearchView(popup, "search-popup", postType)
                    )
                );

                buttonsWrap.append(toJsonBtn, cancelBtn);
                actionWrap.append(buttonsWrap);

                const flexItemTextareaWrapper = el("div", "flex--item");
                const flexItemActionWrap = el("div", "flex--item");

                flexItemTextareaWrapper.append(areaWrap);
                flexItemActionWrap.append(actionWrap);

                view.append(flexItemTextareaWrapper, flexItemActionWrap);

                toJsonBtn.addEventListener("click", () => {
                    const numComments = Store.load<number>("commentcount");

                    const loaded = loadComments(numComments);
                    const content = JSON.stringify(loaded, null, 4);
                    area.value = content;

                    view.querySelector("textarea")?.classList.add("ff-mono"); // like a pre
                    view.querySelector(".actions")?.remove();
                });

                return (makeImpExpView.view = updateImpExpComments(view));
            };

            /**
             * @summary prepend schema to URL
             * @param {string} url target URL
             * @returns {string}
             */
            const scheme = (url: string) =>
                /^https?:\/\//.test(url) ? url : `https://${url}`;

            /**
             * @summary remove schema from URL
             * @param {string} url target URL
             * @returns {string}
             */
            const unscheme = (url: string) => url.replace(/^https?:\/\//, "");

            /**
             * @summary updates remote URL
             * @param {string} key store key for the remote URL
             * @param {string} inputId id of the remote input
             * @returns {boolean}
             */
            const updateRemoteURL = (key: string, inputId: string) => {
                const input =
                    document.getElementById<HTMLInputElement>(inputId);
                if (!input) return false;

                input.value = unscheme(Store.load(key) || "");
                return true;
            };

            /**
             * @summary factory for remote change listeners
             * @param {string} storeKey key to store URL under
             * @param {HTMLInputElement} input URL input to get value from
             * @returns {EventListener}
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
                const initialURL = unscheme(Store.load(storeKeyJSONP) || "");

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
                    "remote-json-get",
                    ...commonBtnClasses
                );
                const getJSONPbtn = makeButton(
                    getNowText,
                    "get JSONP remote",
                    "remote-jsonp-get",
                    ...commonBtnClasses
                );

                popup.addEventListener("click", ({ target }) => {
                    runFromHashmap(
                        {
                            ".remote-json-get": async () => {
                                getJSONbtn.classList.add("is-loading");
                                await fetchFromRemote(scheme(jsonInput.value));
                                updateComments(popup, commentTarget);
                                getJSONbtn.classList.remove("is-loading");
                            },
                            ".remote-jsonp-get": async () => {
                                getJSONPbtn.classList.add("is-loading");
                                await fetchFromRemote(
                                    scheme(jsonpInput.value),
                                    true
                                );
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

                const viewSwitcher = makeViewSwitcher(viewsSel);

                popup.addEventListener("click", ({ target }) => {
                    runFromHashmap<PopupActionMap>(
                        {
                            ".popup-actions-welcome": (p, t) =>
                                viewSwitcher(
                                    makeWelcomeView(p, "welcome-popup", t)
                                ),
                            ".popup-actions-remote": (p, t) =>
                                viewSwitcher(
                                    makeRemoteView(p, "remote-popup", t)
                                ),
                            ".popup-actions-settings": (p, t) =>
                                viewSwitcher(
                                    makeSettingsView(p, "settings-popup", t)
                                ),
                            ".popup-actions-impexp": (p, t) =>
                                viewSwitcher(
                                    makeImpExpView(p, "impexp-popup", t)
                                ),
                            ".popup-actions-filter": (p, t) =>
                                viewSwitcher(
                                    makeSearchView(p, "search-popup", t)
                                ),
                        },
                        (sel) => (target as HTMLElement).matches(sel),
                        popup,
                        Store.load("post_target", Target.CommentQuestion)
                    );
                });

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

                const views = viewsMap.map(([id, maker]) =>
                    maker(popup, id, initPostType)
                );

                const visibleViews = 2;
                const hidden = views.slice(visibleViews);
                hidden.forEach(hide);

                main.append(...views);
                popup.append(main);

                setupCommentHandlers(popup, commentViewId);

                const view = views.find(({ id }) => id === commentViewId)!;
                makeViewSwitcher(viewsSel)(view);

                return (makePopup.popup = popup);
            };

            /**
             * @summary creates a <span> element
             * @param {string} text
             * @param {{ unsafe ?: boolean, classes ?: string[] }} options
             */
            const span = (
                text: string,
                { classes = [] as string[], unsafe = false, title = "" }
            ) => {
                const el = document.createElement("span");
                el.classList.add(...classes);
                unsafe ? (el.innerHTML = text) : (el.innerText = text);
                if (title) el.title = title;
                return el;
            };

            /**
             * @summary makes an auto comment option
             * @param {string} id
             * @param {string} name
             * @param {string} desc
             * @returns {HTMLElement}
             */
            const makeCommentItem = (
                id: string,
                name: string,
                desc: string
            ) => {
                const li = el("li", "pr8");

                const reviewRadio = el("input");
                reviewRadio.id = `comment-${id}`;
                reviewRadio.type = "radio";
                reviewRadio.name = "commentreview";
                reviewRadio.hidden = true;

                const lbl = el("label");
                lbl.htmlFor = reviewRadio.id;

                const nameEl = el("span", "action-name");
                nameEl.id = `name-${id}`;
                nameEl.innerHTML = name;

                const descEl = el("span", "action-desc");
                descEl.id = `desc-${id}`;
                descEl.innerHTML = desc;

                const insertBtn = el("button", "quick-insert");
                insertBtn.innerHTML = "↓";
                insertBtn.title = "Insert now";

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
             * @param {number} epochSeconds Epoch seconds of the date to convert
             * @returns {string}
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
             * @param {number} date
             * @returns {string}
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
             * @param {number} reputationNumber
             * @returns {string}
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
             * @param {typeof StackExchage} se
             * @returns {string}
             */
            const getLoggedInUserId = (se: typeof StackExchange) =>
                se.options.user.userId?.toString() || "";

            /**
             * @summary shows a message
             * @param {string} toastBody
             * @param {ToastTypes} type
             * @returns {void}
             */
            const notify = (toastBody: string, type: ToastTypes) => {
                StackExchange.helpers.showToast(toastBody, { type });
            };

            /**
             * @summary gets user Id
             * @param {HTMLInputElement} tgt element to insert comment in
             * @returns {string}
             */
            const getUserId = (tgt: HTMLElement) => {
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
            ) => {
                return [
                    Date.now() / 1000 - creation_date < timeUnits.month,
                    reputation < 10
                ].some(Boolean);
            }

            /**
             * @summary get original poster username
             * @description memoizable getter for poster name
             * @param {boolean} [refresh]
             * @returns {string}
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
             * @param {string} str
             * @returns {string}
             */
            const capitalize = (str: string) =>
                str[0].toUpperCase() + str.slice(1).toLowerCase();

            /**
             * @summary wraps text into a <strong> element
             * @param {string} text
             * @returns {HTMLElement}
             */
            const b = (text: string) => {
                const strong = document.createElement("strong");
                strong.innerHTML = text;
                return strong;
            };

            /**
             * @summary Add font-weight: bold to passed element
             * @param {HTMLElement} element The element
             * @returns {void}
             */
            const makeB = (element: HTMLElement) =>
                element.classList.add("fw-bold");

            /**
             * @summary creates an <a> element
             * @param {string} url
             * @param {string} [label]
             * @returns {HTMLAnchorElement}
             */
            const link = (url: string, label = url) => {
                const a = document.createElement("a");
                a.href = url;
                a.target = "_blank";
                a.innerHTML = label;
                return a;
            };

            /**
             * @summary creates a text node
             * @param {string} data
             * @returns {Text}
             */
            const text = (data: string) => document.createTextNode(data);

            /**
             * @summary adds user info to the UI
             * @param userInfo
             */
            const addUserInfo = ({
                user_id,
                creation_date,
                display_name,
                last_access_date,
                reputation,
                user_type,
            }: StackExchangeAPI.User) => {
                const container = document.getElementById("userinfo");
                if (!container) return;

                const newUserState = isNewUser(creation_date, reputation);

                Store.save("ShowGreeting", newUserState);

                if (newUserState) {
                    container
                        .querySelector(".action-desc")
                        ?.prepend(Store.load("WelcomeMessage") || "");
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
             * @returns {HTMLSpanElement}
             */
            const makeSeparator = () => {
                const lsep = document.createElement("span");
                lsep.classList.add("lsep");
                lsep.innerHTML = " | ";
                return lsep;
            };

            /**
             * @summary imports comments given text
             * @param {HTMLElement} popup parent popup
             * @param {string} text comment text to parse
             * @returns {void}
             */
            const importComments = (text: string) => {
                Store.clear("name-");
                Store.clear("desc-");

                const lines = text.split("\n");

                const names: string[] = [];
                const descs: string[] = [];

                lines.forEach((line) => {
                    const ln = line.trim();

                    if (ln.startsWith("#"))
                        return names.push(ln.replace(/^#+/g, ""));

                    if (ln) return descs.push(tag(markdownToHTML(ln)));
                });

                const { length: numNames } = names;
                const { length: numDescs } = descs;

                debugLogger.log({ numNames, numDescs });

                if (numNames !== numDescs)
                    return notify(
                        "Failed to import: titles and descriptions do not match",
                        "danger"
                    );

                names.forEach((name, idx) => {
                    Store.save(`name-${idx}`, name);
                    Store.save(`desc-${idx}`, descs[idx]);
                });

                Store.save("commentcount", numNames);
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
             * @param {string} html
             * @returns {string}
             */
            const unescapeHtml = (html: string) =>
                Object.entries(entityMapFromHtml).reduce(
                    (acc, [k, v]) => acc.replace(new RegExp(k, "g"), v),
                    String(html)
                );

            /**
             * @summary changes HTML to Markdown
             * @param {string} html
             * @returns {string}
             */
            const HTMLtoMarkdown = (html: string) =>
                unescapeHtml(
                    html
                        .replace(/<a href="(.+?)".+?>(.+?)<\/a>/g, "[$2]($1)")
                        .replace(/<em>(.+?)<\/em>/g, "*$1*")
                        .replace(/<strong>(.+?)<\/strong>/g, "**$1**")
                );

            /**
             * @summary changes Markdown to HTML
             * @param markdown Markdown to convert
             */
            const markdownToHTML = (markdown: string): string => {
                const html = escapeHtml(markdown);

                const rules: [RegExp, string][] = [
                    // code should match before any conversion is done to preserve text
                    [/`(.+?)`/g, htmlinlinecode`$1`],
                    //strong should match before italics to avoid overcomplicating the regex
                    [/([*_]{2})(.+?)\1/g, htmlstrong`$2`],
                    //it is imperative that italics are matched before links as _blank is very hard to exclude
                    [/([*_])([^`*_]+?)\1(?![*_])/g, htmlem`$2`],
                    [/\[([^\]]+)\]\((.+?)\)/g, htmllink("$2", "$1")],
                ];

                return rules.reduce(
                    (a, [expr, replacer]) => a.replace(expr, replacer),
                    html
                );
            };

            /**
             * @summary untags the comment text
             * @param {string} text
             * @returns {string}
             */
            const untag = (text: string) =>
                text
                    .replace(/\$SITENAME\$/g, sitename)
                    .replace(/\$SITEURL\$/g, site)
                    .replace(/\$MYUSERID\$/g, getLoggedInUserId(StackExchange));

            /**
             * @summary tags the comment text
             * @param {string} html
             * @returns {string}
             */
            const tag = (html: string) => {
                const regname = new RegExp(sitename, "g");
                const regurl = new RegExp(`//${site}`, "g");
                const reguid = new RegExp(
                    `/${getLoggedInUserId(StackExchange)}[)]`,
                    "g"
                );
                return html
                    .replace(regname, "$SITENAME$")
                    .replace(regurl, "//$SITEURL$")
                    .replace(reguid, "/$MYUSERID$)");
            };

            /**
             * @summary Save textarea contents, replace element html with new edited content
             * @param {string} id
             * @param {string} value
             * @returns {string}
             */
            const saveComment = (id: string, value: string) => {
                const html = markdownToHTML(value);
                Store.save(id, tag(html));
                return (
                    ((Store.load("ShowGreeting") &&
                        Store.load("WelcomeMessage")) ||
                        "") + untag(html)
                );
            };

            /**
             * @summary finalizes the edit mode (save or cancel)
             * @param {HTMLElement} commentElem
             * @returns {void}
             */
            const closeEditMode = (commentElem: HTMLElement, value: string) => {
                const { dataset } = commentElem;
                empty(commentElem);
                commentElem.innerHTML = value;
                commentElem.closest("li")!.querySelector("input")!.disabled =
                    false;
                dataset.mode = "insert";
            };

            /**
             * @summary opens the comment edit mode
             * @param {HTMLElement} commentElem
             * @param {HTMLElement} popup
             * @returns {void}
             */
            const openEditMode = (
                commentElem: HTMLElement,
                popup: HTMLElement
            ) => {
                const {
                    id,
                    dataset,
                    dataset: { mode = "insert" },
                } = commentElem;

                if (mode === "edit") return;

                const desc = HTMLtoMarkdown(Store.load<string>(id));

                empty(commentElem);

                const replaceVars = makeVariableReplacer({
                    site,
                    sitename,
                    myId: getLoggedInUserId(StackExchange),
                    opName: getOP(),
                });

                const initialHTML = markdownToHTML(replaceVars(desc));

                const preview = el("span", "d-inline-block", "p8");
                preview.innerHTML = initialHTML;

                const [areaWrap, area] = makeStacksTextArea(commentElem.id, { value: desc });

                area.addEventListener("input", ({ target }) => {
                    const { value } = <HTMLTextAreaElement>target;
                    preview.innerHTML = markdownToHTML(replaceVars(value));
                });

                area.addEventListener("change", ({ target }) => {
                    const { id, value } = <HTMLTextAreaElement>target;
                    closeEditMode(commentElem, replaceVars(saveComment(id, value)));
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
                    closeEditMode(commentElem, initialHTML);
                });

                actions.append(cancel);
                commentElem.append(preview, areaWrap, actions);

                const { paddingLeft, paddingRight, font } = window.getComputedStyle(area);

                const areaHorizontalPadding = parseInt(paddingLeft) + parseInt(paddingRight);

                //650 is <ul> width 8 is <li> padding-right, 20 is <label> padding
                const lineWidth = 650 - 20 - 8 - areaHorizontalPadding;

                area.rows = getNumTextLines(desc, font, lineWidth);

                area.addEventListener("input", () => {
                    const { value } = area;
                    area.rows = getNumTextLines(value, font, lineWidth);
                });

                dataset.mode = "edit";
            };

            /**
             * @summary Empty all custom comments from storage and rewrite to ui
             * @param {CommentInfo[]} comments new comments to overwrite with
             * @returns {void}
             */
            const resetComments = (comments: CommentInfo[]) => {
                Store.clear("name-");
                Store.clear("desc-");
                comments.forEach(({ description, name, targets }, index) => {
                    const prefix = targets ? `[${targets.join(",")}] ` : "";
                    Store.save(`name-${index}`, prefix + name);
                    Store.save(`desc-${index}`, description);
                });
                Store.save("commentcount", commentDefaults.length);
            };

            /**
             * TODO: rework once moved to config object
             * @summary loads comments from storage
             * @param {number} numComments
             * @returns {StoredComment[]}
             */
            const loadComments = (numComments: number) => {
                const comments: StoredComment[] = [];
                for (let i = 0; i < numComments; i++) {
                    const name = Store.load<string>(`name-${i}`);
                    const desc = Store.load<string>(`desc-${i}`);
                    comments.push({ id: i.toString(), name, desc });
                }
                return comments;
            };

            /**
             * @summary switches currently selected comment
             * @param {HTMLElement} popup wrapper popup
             * @param {HTMLLIElement} action comment item
             * @returns {void}
             */
            const switchSelectedComment = (popup: HTMLElement, action: HTMLLIElement) => {
                const acts = popup.querySelector(".action-list");
                acts?.querySelectorAll("li").forEach(({ classList }) =>
                    classList.remove("action-selected")
                );
                action.classList.add("action-selected");
            };

            /**
             * @summary makes the comment click handler (selecting comments)
             * @param {HTMLElement} popup wrapper popup
             * @returns {EventListener}
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

                        if (Store.load("hide-desc")) {
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
                    const currView = Store.load("CurrentView");
                    debugLogger.log({ currView, viewId });
                    if (currView !== viewId) return;
                    insertHandler(event);
                    selectHandler(event);
                });
            };

            /**
             * @summary replaces variables with dynamic substitutions
             * @param {VarsReplacerOptions} options
             */
            const makeVariableReplacer =
                ({ myId, opName, site, sitename }: VarsReplacerOptions) =>
                    /**
                     * @param {string} text text with user variables
                     * @returns {string}
                     */
                    (text: string) => {
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
             * @summary updates comments in the UI
             * @param popup wrapper popup
             * @param target comment target type
             */
            const updateComments = (popup: HTMLElement, target: Target) => {
                const numComments = Store.load<number>("commentcount");

                if (!numComments) resetComments(commentDefaults);

                const ul = popup.querySelector(".action-list")!;

                empty(ul);

                const comments = loadComments(numComments);

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
                    .filter(({ name }) => isCommentValidForTarget(name, target))
                    .map(({ name, id, desc }) => {
                        const cname = name.replace(allTgtMatcher, "");

                        const description = replaceVars(desc).replace(
                            /\$/g,
                            "$$$"
                        );

                        return makeCommentItem(
                            id,
                            cname.replace(/\$/g, "$$$"),
                            markdownToHTML(greeting + description)
                        );
                    });

                ul.append(...listItems);

                toggleDescriptionVisibility(popup);
            };

            /**
             * @summary Checks if a given comment could be used together with a given post type.
             * @param text The comment content itself.
             * @param target {@link Target} to match.
             */
            const isCommentValidForTarget = (text: string, target: Target) => {
                const [, matched] = text.match(allTgtMatcher) || [];
                return matched === target;
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
             * @param {HTMLElement} popup wrapper popup
             * @returns {void}
             */
            const setupSearchHandlers = (
                popup: HTMLElement,
                searchInput: HTMLInputElement
            ) => {
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
             * @param {HTMLElement} popup
             * @param {boolean} [hidden]
             * @returns {void}
             */
            const toggleDescriptionVisibility = (
                popup: HTMLElement,
                hidden = Store.load("hide-desc")
            ) => {
                popup
                    .querySelectorAll<HTMLElement>(
                        "li:not(.action-selected) .action-desc"
                    )
                    .forEach((d) => (hidden ? hide(d) : show(d)));
            };

            /**
             * @summary makes a JSONP request
             * @param {string} url resource URL
             * @param {string} [callbackName] JSONP callback name
             * @returns {Promise<object>} response
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
             * @param {string} url resource URL
             * @returns {Promise<object>} response
             */
            const getJSON = async <T>(url: string): Promise<T> => {
                const res = await fetch(url);
                return res.json();
            };

            /**
             * @summary loads comments from a remote source
             * @param url remore URL to fetch from
             * @param [isJSONP] JSONP switch
             */
            const fetchFromRemote = async (url: string, isJSONP = false): Promise<void> => {
                debugLogger.log({ isJSONP });

                const fetcher = isJSONP ? getJSONP : getJSON;

                const comments: CommentInfo[] = await fetcher(url);

                Store.save("commentcount", comments.length);
                Store.clear("name-");
                Store.clear("desc-");
                comments.forEach(({ name, description }, i) => {
                    Store.save(`name-${i}`, name);
                    Store.save(`desc-${i}`, tag(description));
                });
            };

            /**
             * @summary shows the popup (prevents SE overrides)
             * @param {HTMLElement} popup
             * @returns {void}
             */
            const showPopup = (popup: HTMLElement) => {
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

                //Auto-load from JSONP remote if enabled
                if (Store.load("AutoRemote")) {
                    debugLogger.log(`autofetching JSONP remote`);
                    await fetchFromRemote(Store.load("RemoteUrl"), true);
                }

                if (Store.load("remote_json_auto")) {
                    debugLogger.log(`autofetching JSON remote`);
                    await fetchFromRemote(Store.load("remote_json"));
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
             * @summary Attach an "auto" link somewhere in the DOM. This link is going to trigger the iconic ARC behavior.
             * @param {string} selector A selector for a DOM element which, when clicked, will invoke the locator.
             * @param {Locator} locator A function that will search for both the DOM element, next to which the "auto" link
             *                           will be placed and where the text selected from the popup will be inserted.
             *                           This function will receive the triggerElement as the first argument when called and it
             *                           should return an array with the two DOM elements in the expected order.
             * @param {Injector} injector A function that will be called to actually inject the "auto" link into the DOM.
             *                            This function will receive the element that the locator found as the first argument when called.
             *                            It will receive the action function as the second argument, so it know what to invoke when the "auto" link is clicked.
             * @param {Actor} actor A function that will be called when the injected "auto" link is clicked.
             */
            function addTriggerButton<T extends HTMLElement>(
                selector: string,
                locator: Locator<T>,
                injector: Injector,
                actor: Actor
            ) {
                const maxTries = 20;

                /**
                 * @summary The internal injector invokes the locator to find an element in relation to the trigger element and then invokes the injector on it.
                 * @param {HTMLElement} trigger The element that triggered the mechanism.
                 * @param {number} [retry=0] How often this operation was already retried. 20 retries will be performed in 50ms intervals.
                 * @private
                 */
                const _injector = (trigger: T, retry: number) => {
                    if (maxTries <= retry) return;

                    const [injectNextTo, placeIn] = locator(trigger);

                    if (injectNextTo) {
                        placeIn.dataset.arc = "current";
                        return injector(injectNextTo, actor);
                    }

                    // We didn't find it? Try again in 50ms.
                    setTimeout(() => _injector(trigger, retry + 1), 50);
                };

                const content = document.getElementById("content")!;
                content.addEventListener("click", ({ target }) => {
                    if (!(<HTMLElement>target).matches(selector)) return;
                    _injector(<T>target, 0);
                });
            }

            /**
             * @description A locator for the help link next to the comment box under a post and the textarea for the comment.
             * @param {HTMLElement} where A DOM element, near which we're looking for the location where to inject our link.
             * @returns {Placement} The DOM element next to which the link should be inserted and the element into which the
             *                     comment should be placed.
             */
            const findCommentElements = ({
                parentElement,
            }: HTMLElement): Placement => {
                const { id } = parentElement!;

                const divId = id.replace("-link", "");

                const div = document.getElementById(divId)!;

                const injectNextTo = div.querySelector<HTMLElement>(
                    ".js-comment-form-layout button:last-of-type"
                )!;
                const placeCommentIn = div.querySelector("textarea")!;
                return [injectNextTo, placeCommentIn];
            };

            /**
             * @summary A locator for the edit summary input box under a post while it is being edited.
             * @param {HTMLAnchorElement} where A DOM element, near which we're looking for the location where to inject our link.
             * @returns {Placement} The DOM element next to which the link should be inserted and the element into which the comment should be placed.
             */
            const findEditSummaryElements = (where: HTMLAnchorElement): Placement => {
                const { href } = where;
                const [, divid] = href.match(/posts\/(\d+)\/edit/) || [];
                const injectTo = document.getElementById(`submit-button-${divid}`)!;
                const placeIn = document.getElementById(`edit-comment-${divid}`)!;
                return [injectTo, placeIn];
            };

            /**
             * @summary A locator for the text area in which to put a custom off-topic closure reason in the closure dialog.
             * @param {HTMLElement} where A DOM element, near which we're looking for the location where to inject our link.
             * @returns {Placement} The DOM element next to which the link should be inserted and the element into which the
             *                     comment should be placed.
             */
            const findClosureElements = (_where: HTMLElement): Placement => {
                const injectTo = document.querySelector<HTMLElement>("#close-question-form .js-popup-submit")!;
                const placeIn = document.querySelector<HTMLElement>("#site-specific-comment textarea")!;
                return [injectTo, placeIn];
            };

            /**
             * @summary A locator for the edit summary you get in the "Help and Improvement" review queue.
             * @param {HTMLElement} [_where] A DOM element, near which we're looking for the location where to inject our link.
             * @returns {Placement} The DOM element next to which the link should be inserted and the element into which the
             *                     comment should be placed.
             */
            const findReviewQueueElements = (_where?: HTMLElement): Placement => {
                const injectTo = document.querySelector<HTMLElement>(".js-review-editor [id^='submit-button']")!;
                const placeIn = document.querySelector<HTMLElement>(".js-review-editor .js-post-edit-comment-field")!;
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
