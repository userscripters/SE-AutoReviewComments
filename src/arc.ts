declare var StackExchange: {
    options: {
        user: { userId: string };
        site: {
            name?: string;
        };
    };
    helpers: {
        bindMovablePopups(): void;
    };
    ready(cbk: (...args: any[]) => any): void;
};

interface Window {
    [x: string]: unknown;
}

interface Document {
    getElementById<T extends HTMLElement>(elementId: string): T | null;
}

type PostType = "answer" | "question";

type Placement = readonly [insert: HTMLElement | null, place: HTMLElement];

type Locator<T extends HTMLElement = HTMLElement> = (where: T) => Placement;

type Actor = (...args: any[]) => any;

type ActionMap = Record<string, (p: HTMLElement, w: HTMLElement) => void>;

type PopupActionMap = Record<
    string,
    (popup: HTMLElement, postType: PostType) => void
>;

type Injector = (
    injected: HTMLElement,
    placed: HTMLElement,
    action: Actor
) => void;

type ViewMaker = {
    view?: HTMLElement;
    (popup: HTMLElement, id: string, postType: PostType): HTMLElement;
};

type WrapperPopupMaker = {
    popup?: HTMLElement;
    (target: HTMLInputElement, postType: PostType): HTMLElement;
};

type UserType =
    | "unregistered"
    | "registered"
    | "moderator"
    | "team_admin"
    | "does_not_exist";

type BadgeCounts = {
    bronze: number;
    silver: number;
    gold: number;
};

type UserInfo = {
    creation_date: number;
    is_employee: boolean;
    last_access_date: number;
    last_modified_date: number;
    reputation: number;
    reputation_change_day: number;
    reputation_change_month: number;
    reputation_change_quarter: number;
    reputation_change_week: number;
    reputation_change_year: number;
    user_id: number;
    display_name: string;
    website_url: string;
    profile_image: string;
    link: string;
    location: string;
    user_type: UserType;
    badge_counts: BadgeCounts;
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
    classes?: string[];
};

type CheckboxOptions = {
    checked?: boolean;
    classes?: string[];
};

type CommentInfo = { name: string; description: string; targets: string[] };

StackExchange.ready(() => {
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
    const hide = (element: HTMLElement) => {
        const { style } = element;
        style.display = "none";
        return element;
    };

    /**
     * @summary shows an element
     * @param {HTMLElement}
     * @returns {HTMLElement}
     */
    const show = (element: HTMLElement) => {
        const { style } = element;
        style.display = "";
        return element;
    };

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
        while ((current = current.nextElementSibling)) found.push(current);
        return selector ? found.filter((sib) => sib.matches(selector)) : found;
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
    const fadeOut = (el: HTMLElement, speed = 200) => fadeTo(el, 0, speed);

    /**
     * @summary finds and runs a handler from a hashmap
     * @param {Record<string, (...args: any[]) => any>} hashmap key -> val lookup
     * @param {(key: string) => boolean} comparator comparator function
     * @returns {any}
     */
    const runFromHashmap = <U extends Record<string, (...args: any[]) => any>>(
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

        constructor(public on: boolean) {}

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

    const debugLogger = new Debugger(Store.load("debug"));

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
    const allTgtMatcher = new RegExp("\\[(E?[AQ]|C)(?:,(E?[AQ]|C))*\\]");

    //itemprop distinguishes between the author and editor
    const userLinkSel = ".post-signature .user-details[itemprop=author] a";

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
    const htmlem = (text: string) => `<em>${text}</em>`;

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
            description: `Please use the ${htmlem(
                "Post answer"
            )} button only for actual answers. You should modify your original question to add additional information.`,
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
            description: `If you have a ${htmlem(
                "new"
            )} question, please ask it by clicking the ${htmllink(
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

    const weekday_name = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const minute = 60;
    const hour = 3600;
    const day = 86400;
    const sixdays = 518400;
    const week = 604800;
    const month = 2592000;
    const year = 31536000;

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

        [
            `.${arc}.popup{
                    position:absolute;
                    display:block;
                    width:690px;
                    padding:15px 15px 10px;
                }`,
            `.${arc}.popup .svg-icon.mute-text a {
                    color: var(--black-500);
                }`,
            `.${arc}.popup>div>textarea{
                    width:100%;
                    height:442px;
                }`,
            `.${arc}.popup .view textarea {
                    resize: vertical;
                }`,
            `.${arc}.popup .main{
                    overflow:hidden
                }`,
            `.${arc}.popup .main .view {
                    overflow: auto;
                    padding: 1vh 1vw;
                }`,
            `.${arc}.popup .main .userinfo{
                    padding:5px;
                    margin-bottom:7px;
                }`,
            `.${arc}.popup .main .remoteurl, .${arc}.popup .main .customwelcome {
                    display: block;
                    width: 100%;
                }`,
            `.${arc}.popup .main .action-list{
                    margin:0 0 7px 0 !important;
                    overflow-y:scroll;
                    max-height: 400px;
                }`,
            `.${arc}.popup .main .action-list li{
                    width:100%;
                    padding:0;
                    transition:.1s
                }`,
            `.${arc}.popup .main .action-list li:hover{
                    background-color:#f2f2f2
                }`,
            `.${arc}.popup .main .action-list li.action-selected:hover{
                    background-color:#e6e6e6
                }`,
            `.${arc}.popup .main .action-list li label{
                    position:relative;
                    display:block;
                    padding:10px;
                }`,
            `.${arc}.popup .main .action-list li label .action-name{
                    display:block;
                    margin-bottom:3px;
                    cursor:default;
                }`,
            `.${arc}.popup .main .action-list li label .action-desc{
                    margin:0;
                    color:#888;
                    cursor:default;
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
            `.${arc}.popup .main .popup-submit{
                    float:none;
                    margin:0 0 5px 0;
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
            `.${arc}.popup .main .searchfilter{
                    width:100%;
                    box-sizing:border-box;
                    display:block
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
        { value = "", classes = [] }: TextInputOptions = {}
    ) => {
        const input = document.createElement("input");
        input.classList.add(...classes);
        input.type = "text";
        input.id = input.name = id;
        input.value = value;
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
        { label = "", value = "" }: TextAreaOptions
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
        wrap.append(area);

        return [wrap, area] as const;
    };

    /**
     * {@link https://stackoverflow.design/product/components/inputs/#input-fills}
     *
     * @summary creates a Stacks URL input
     * @param {string} id input id (also sets the name)
     * @param {string} schema URL schema (http://, https://, or custom)
     * @param {string} label input label
     * @param {string} [value] input value
     * @returns {[HTMLDivElement, HTMLDivElement, HTMLDivElement, HTMLInputElement]}
     */
    const makeStacksURLInput = (
        id: string,
        schema: string,
        label: string,
        value?: string
    ) => {
        const wrap = el("div", "d-flex", "gs4", "gsy", "fd-column");

        const lbl = el("label", "flex--item", "s-label");
        lbl.htmlFor = id;
        lbl.textContent = label;

        const iwrap = el("div", "d-flex");

        const ischema = el("div", "flex--item", "s-input-fill", "order-first");
        ischema.textContent = schema;

        const iinput = el("div", "d-flex", "fl-grow1", "ps-relative");

        const input = makeTextInput(id, {
            value,
            classes: ["flex--item", "s-input", "blr0"],
        });

        iinput.append(input);
        iwrap.append(ischema, iinput);
        wrap.append(lbl, iwrap);
        return [wrap, iwrap, iinput, input] as const;
    };

    /**
     * {@link https://stackoverflow.design/product/components/checkbox/}
     *
     * @summary creates a Stacks checkbox
     * @param {string} label checkbox label
     * @param {boolean} [state] initial checkbox state
     * @returns {[HTMLDivElement, HTMLInputElement]}
     */
    const makeStacksCheckbox = (id: string, label: string, state = false) => {
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
     * @summary makes a button
     * @param {string} text
     * @param {string} title
     * @param {...string} classes
     * @returns {HTMLAnchorElement}
     */
    const makeButton = (text: string, title: string, ...classes: string[]) => {
        const button = el("button", "s-btn", ...classes);
        button.innerHTML = text;
        button.title = title;
        return button;
    };

    /**
     * @summary creates the popup close button
     * @param {string} id id to give to the element
     * @returns {HTMLElement}
     */
    const makeCloseBtn = (id: string) => {
        const close = document.createElement("div");
        close.classList.add("popup-close");
        close.id = id;

        const btn = makeButton("×", "close this popup (or hit Esc)");

        close.append(btn);
        return close;
    };

    /**
     * @summary makes an info button icon
     * @param {string} url info URL
     * @param {string} title link title
     * @param {...string} classes classes to apply
     * @returns {SVGSVGElement}
     */
    const makeInfoButton = (
        url: string,
        title: string,
        ...classes: string[]
    ) => {
        const NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(NS, "svg");
        svg.classList.add("svg-icon", "iconInfo", ...classes);
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("width", "18");
        svg.setAttribute("height", "18");
        svg.setAttribute("viewBox", `0 0 18 18`);

        const anchor = document.createElementNS(NS, "a");
        anchor.setAttribute("href", url);
        anchor.setAttribute("target", "_blank");

        const ttl = document.createElementNS(NS, "title");
        ttl.textContent = title;

        const path = document.createElementNS(NS, "path");
        path.setAttribute(
            "d",
            "M9 1a8 8 0 110 16A8 8 0 019 1zm1 13V8H8v6h2zm0-8V4H8v2h2z"
        );

        anchor.append(ttl, path);
        svg.append(anchor);
        return svg;
    };

    /**
     * @summary makes comment submit button
     * @param {string} id
     * @returns {HTMLElement}
     */
    const makeSubmitButton = (id: string) => {
        const submitBtn = document.createElement("input");
        submitBtn.classList.add("popup-submit");
        submitBtn.type = "button";
        submitBtn.value = "Insert";
        submitBtn.id = id;
        return submitBtn;
    };

    /**
     * @summary hides the rest of the views and shows the current one
     * @param {string} viewsSel selector for views
     * @returns {(view:HTMLElement) => HTMLElement}
     */
    const makeViewSwitcher = (viewsSel: string) => (view: HTMLElement) => {
        document.querySelectorAll<HTMLElement>(viewsSel).forEach(hide);
        show(view);
        Store.save("CurrentView", view.id);
        return view;
    };

    /**
     * @summary makes tabs view
     * @param {HTMLElement} popup wrapper popup
     * @param {string} id actions wrapper id
     * @param {PostType} postType parent post type
     * @returns {HTMLElement}
     */
    const makeTabsView: ViewMaker = (_popup, id, _postType) => {
        if (makeTabsView.view) return makeTabsView.view;

        const wrap = el(
            "div",
            "view",
            "d-flex",
            "ai-center",
            "jc-space-between"
        );
        wrap.id = id;

        const btnGroup = el("div", "s-btn-group", "flex--item");

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
                "use this to import/export all comments",
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
        ];

        btnGroup.append(...buttons);

        btnGroup.addEventListener("click", ({ target }) => {
            buttons.forEach(({ classList }) => classList.remove("is-selected"));
            (target as HTMLElement).classList.add("is-selected");
        });

        const info = makeInfoButton(
            GITHUB_URL,
            `see info about this popup (v${VERSION})`,
            "flex--item",
            "mute-text"
        );

        wrap.append(btnGroup, info);

        return (makeTabsView.view = wrap);
    };

    /**
     * @summary makes popup action view
     * @param {HTMLElement} popup wrapper popup
     * @param {string} id actions wrapper id
     * @returns {HTMLElement}
     */
    const makeActionsView: ViewMaker = (popup, id) => {
        if (makeActionsView.view) return makeActionsView.view;

        const wrap = document.createElement("div");
        wrap.classList.add("view");
        wrap.id = id;

        const actionsWrap = document.createElement("div");
        actionsWrap.classList.add("float-left", "actions");

        const submitWrap = document.createElement("div");
        submitWrap.classList.add("float-right");

        const submitBtn = makeSubmitButton(`${Store.prefix}-submit`);
        disable(submitBtn);

        submitWrap.append(submitBtn);

        const seeBtn = makeButton(
            "see-through",
            "see through",
            "popup-actions-see"
        );

        seeBtn.addEventListener("mouseenter", () => {
            fadeTo(popup, 0.4);
            fadeOut(seeBtn.closest(".main")!);
        });

        seeBtn.addEventListener("mouseleave", () => {
            fadeTo(popup, 1.0);
            fadeTo(seeBtn.closest(".main")!, 1);
        });

        const resetBtn = makeButton(
            "reset",
            "reset any custom comments",
            "popup-actions-reset"
        );

        const descrBtn = makeButton(
            "show/hide desc",
            "use this to hide/show all comments",
            "popup-actions-toggledesc"
        );

        const actionsList = [seeBtn, resetBtn, descrBtn];

        actionsWrap.append(...actionsList);
        wrap.append(actionsWrap, submitWrap);
        return (makeActionsView.view = wrap);
    };

    /**
     * @summary makes the search view
     * @param {HTMLElement} popup wrapper popup
     * @param {string} id view id
     * @returns {HTMLElement}
     */
    const makeSearchView: ViewMaker = (_popup, id) => {
        if (makeSearchView.view) return makeSearchView.view;

        const wrap = document.createElement("div");
        wrap.classList.add("view");
        wrap.id = id;

        const header = document.createElement("h2");
        header.classList.add("handle");
        header.innerHTML = "Which review comment to insert?";

        const uinfo = document.createElement("div");
        uinfo.classList.add("userinfo");
        uinfo.id = "userinfo";

        const searchWrap = document.createElement("div");
        searchWrap.classList.add("searchbox");

        const search = document.createElement("input");
        search.classList.add("searchfilter");
        search.type = "search";
        search.placeholder = "filter the comments list";

        searchWrap.append(search);

        const actions = document.createElement("ul");
        actions.classList.add("action-list");

        wrap.append(header, uinfo, searchWrap, actions);
        return (makeSearchView.view = wrap);
    };

    /**
     * @summary makes welcome view
     * @param {HTMLElement} popup wrapper popup
     * @param {string} id view id
     * @param {PostType} postType parent post type
     * @returns {HTMLElement}
     */
    const makeWelcomeView: ViewMaker = (popup, id, postType) => {
        if (makeWelcomeView.view) return makeWelcomeView.view;

        const wrap = document.createElement("div");
        wrap.classList.add("view");
        wrap.id = id;

        const text = document.createTextNode(
            'Setup the "welcome" message (blank is none):'
        );

        const welcomeWrap = document.createElement("div");

        const input = makeTextInput("customwelcome", {
            classes: ["customwelcome"],
        });

        input.addEventListener("change", () =>
            Store.save("WelcomeMessage", input.value)
        );

        welcomeWrap.append(input);

        const actionsWrap = el("div", "float-right");

        const actions: Node[] = [
            makeButton("force", "force", "welcome-force"),
            makeSeparator(),
            makeButton("cancel", "cancel", "welcome-cancel"),
        ];

        const viewSwitcher = makeViewSwitcher(viewsSel);

        popup.addEventListener("click", ({ target }) => {
            runFromHashmap<ActionMap>(
                {
                    ".popup-actions-welcome": (_p, w) => {
                        input.value ||= Store.load("WelcomeMessage");
                        show(w);
                    },
                    ".welcome-cancel": (p) =>
                        viewSwitcher(
                            makeSearchView(p, "search-popup", postType)
                        ),
                    ".welcome-force": () => {
                        Store.save("ShowGreeting", true);
                        updateComments(popup, postType);
                    },
                },
                (key) => (target as HTMLElement).matches(key),
                popup,
                wrap
            );
        });

        actionsWrap.append(...actions);

        wrap.append(text, welcomeWrap, actionsWrap);
        return (makeWelcomeView.view = wrap);
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
            .map(({ name, desc }) => `###${name}\n${HTMLtoMarkdown(desc)}`)
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

        const actionWrap = el("div", "actions");

        const [areaWrap, area] = makeStacksTextArea("impexp", {
            label: "Comment source",
        });

        area.addEventListener("change", async () => {
            doImport(area.value);
            updateComments(popup, postType);
        });

        const jsonpBtn = makeButton(
            "JSONP",
            "JSONP",
            "s-btn__outlined",
            "jsonp"
        );

        const cancelBtn = makeButton(
            "cancel",
            "cancel import/export",
            "s-btn__danger",
            "cancel"
        );

        const viewSwitcher = makeViewSwitcher(viewsSel);

        cancelBtn.addEventListener("click", () =>
            viewSwitcher(makeSearchView(popup, "search-popup", postType))
        );

        actionWrap.append(jsonpBtn, cancelBtn);

        view.append(areaWrap, actionWrap);

        const cbk = "callback";
        jsonpBtn.addEventListener("click", () => {
            const numComments = Store.load<number>("commentcount");

            const loaded = loadComments(numComments);
            const content = loaded
                .map((comment) => JSON.stringify(comment))
                .join(",\n");

            area.value = `${cbk}([\n${content}\n])`;

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
        const input = document.getElementById<HTMLInputElement>(inputId);
        if (!input) return false;

        input.value = unscheme(Store.load(key));
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
     * @param {HTMLElement} popup wrapper popup
     * @param {string} id view id
     * @param {PostType} postType parent post type
     * @returns {HTMLElement}
     */
    const makeRemoteView: ViewMaker = (popup, id, postType) => {
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
        const initialURL = unscheme(Store.load(storeKeyJSONP));

        const inputWrap = el("div", "d-flex", "fd-column", "gs8");

        const [jsonWrap, , jsonIWrap, jsonInput] = makeStacksURLInput(
            storeKeyJSON,
            initialScheme,
            "JSON source",
            initialURL
        );

        const [jsonpWrap, , jsonpIWrap, jsonpInput] = makeStacksURLInput(
            storeKeyJSONP,
            initialScheme,
            "JSONP source",
            initialURL
        );

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
        const commonBtnClasses = ["s-btn__muted", "s-btn__outlined", "ml8"];

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
                        updateComments(popup, postType);
                        getJSONbtn.classList.remove("is-loading");
                    },
                    ".remote-jsonp-get": async () => {
                        getJSONPbtn.classList.add("is-loading");
                        await fetchFromRemote(scheme(jsonpInput.value), true);
                        updateComments(popup, postType);
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
     * @param {HTMLInputElement} input comment input
     * @param {string} html comment HTML
     * @param {string} op original poster info
     * @returns {void}
     */
    const insertComment = (
        input: HTMLInputElement,
        html: string,
        op: string
    ) => {
        const md = HTMLtoMarkdown(html)
            .replace(/\[username\]/g, "") //TODO: get user info
            .replace(/\[OP\]/g, op);

        input.value = md;
        input.focus(); //focus provokes character count test

        const hereTxt = "[type here]";
        const caret = md.indexOf(hereTxt);
        if (caret >= 0) input.setSelectionRange(caret, caret + hereTxt.length);
    };

    /**
     * @summary creates the popup markup
     * @description memoizable popup maker
     * @param {HTMLInputElement} input target comment input
     * @param {PostType} postType
     * @returns {HTMLElement}
     */
    const makePopup: WrapperPopupMaker = (input, postType) => {
        if (makePopup.popup) return makePopup.popup;

        const popup = document.createElement("div");
        popup.classList.add("auto-review-comments", "popup");

        const close = makeCloseBtn("close");
        close.addEventListener("click", () => {
            fadeOut(popup);
            hide(popup);
        });

        const main = document.createElement("div");
        main.classList.add("main");
        main.id = "main";

        const viewSwitcher = makeViewSwitcher(viewsSel);

        popup.addEventListener("click", ({ target }) => {
            runFromHashmap<PopupActionMap>(
                {
                    ".popup-actions-welcome": (p, t) =>
                        viewSwitcher(makeWelcomeView(p, "welcome-popup", t)),
                    ".popup-actions-remote": (p, t) =>
                        viewSwitcher(makeRemoteView(p, "remote-popup", t)),
                    ".popup-actions-impexp": (p, t) =>
                        viewSwitcher(makeImpExpView(p, "impexp-popup", t)),
                    ".popup-actions-filter": (p) =>
                        viewSwitcher(
                            makeSearchView(p, "search-popup", postType)
                        ),
                    ".popup-actions-reset": (p, t) => {
                        resetComments(commentDefaults);
                        updateComments(p, t);
                    },

                    ".popup-actions-toggledesc": (p) => {
                        const newVisibility = !Store.load("hide-desc");
                        Store.save("hide-desc", newVisibility);
                        toggleDescriptionVisibility(p, newVisibility);
                    },

                    ".popup-submit": (p) => {
                        const selected = p.querySelector(".action-selected");
                        const descr = selected?.querySelector(".action-desc");

                        if (!descr || !selected)
                            return notify(
                                p,
                                "Nothing selected",
                                "please select a comment"
                            );

                        const op = getOP();

                        debugLogger.log({ op });

                        insertComment(input, descr.innerHTML, op);
                        fadeOut(p);
                        hide(p);
                    },
                },
                (sel) => (target as HTMLElement).matches(sel),
                popup,
                postType
            );
        });

        const commentViewId = "search-popup";

        const viewsMap = [
            ["tabs-popup", makeTabsView],
            [commentViewId, makeSearchView],
            ["remote-popup", makeRemoteView],
            ["welcome-popup", makeWelcomeView],
            ["impexp-popup", makeImpExpView],
            ["popup-actions", makeActionsView],
        ] as const;

        const views = viewsMap.map(([id, maker]) => maker(popup, id, postType));

        const hidden = views.slice(1, -1);
        hidden.forEach(hide);

        main.append(...views);
        popup.append(close, main);

        setupCommentHandlers(popup, commentViewId);
        setupSearchHandlers(popup);

        makeViewSwitcher(viewsSel)(views[0]);

        return (makePopup.popup = popup);
    };

    /**
     * @summary creates a <span> element
     * @param {string} text
     * @param {{ unsafe ?: boolean, classes ?: string[] }} options
     */
    const span = (text: string, { classes = [], unsafe = false }) => {
        const el = document.createElement("span");
        el.classList.add(...classes);
        unsafe ? (el.innerHTML = text) : (el.innerText = text);
        return el;
    };

    /**
     * @summary makes a notification announcement
     * @param {string} title
     * @param {string} message
     * @param  {boolean} [unsafe]
     * @returns {HTMLElement}
     */
    const makeAnnouncement = (
        title: string,
        message: string,
        unsafe = false
    ) => {
        const wrap = document.createElement("div");
        wrap.classList.add("auto-review-comments", "announcement");
        wrap.id = "announcement";

        const close = document.createElement("span");
        close.classList.add("notify-close");

        const dismissal = makeButton("x", "dismiss this notification");

        close.append(dismissal);

        const txt = unsafe ? span(message, { unsafe }) : text(message);

        wrap.append(b(title), txt, close);
        return wrap;
    };

    /**
     * @summary makes an auto comment option
     * @param {string} id
     * @param {string} name
     * @param {string} desc
     * @returns {HTMLElement}
     */
    const makeOption = (id: string, name: string, desc: string) => {
        const li = document.createElement("li");

        const reviewRadio = document.createElement("input");
        reviewRadio.id = `comment-${id}`;
        reviewRadio.type = "radio";
        reviewRadio.name = "commentreview";
        reviewRadio.hidden = true;

        const lbl = document.createElement("label");
        lbl.htmlFor = reviewRadio.id;

        const nameEl = document.createElement("span");
        nameEl.classList.add("action-name");
        nameEl.id = `name-${id}`;
        nameEl.innerHTML = name;

        const descEl = document.createElement("span");
        descEl.classList.add("action-desc");
        descEl.id = `desc-${id}`;
        descEl.innerHTML = desc;

        const insertBtn = document.createElement("button");
        insertBtn.classList.add("quick-insert");
        insertBtn.innerHTML = "↓";
        insertBtn.title = "Insert now";

        lbl.append(nameEl, descEl, insertBtn);
        li.append(reviewRadio, lbl);

        return li;
    };

    /**
     * TODO: do something with this Cthulhu
     * @summary Calculate and format datespan for "Member since/for"
     * @param {number} date
     */
    function datespan(date: number) {
        var now = Date.now() / 1000;
        var then = new Date(date * 1000);
        var today = new Date().setHours(0, 0, 0) / 1000;
        var nowseconds = now - today;
        var elapsedSeconds = now - date;
        var strout = "";
        if (elapsedSeconds < nowseconds) strout = "since today";
        else if (elapsedSeconds < day + nowseconds) strout = "since yesterday";
        else if (elapsedSeconds < sixdays)
            strout = "since " + weekday_name[then.getDay()];
        else if (elapsedSeconds > year) {
            strout = "for " + Math.round(elapsedSeconds / year) + " years";
            if (elapsedSeconds % year > month)
                strout +=
                    ", " +
                    Math.round((elapsedSeconds % year) / month) +
                    " months";
        } else if (elapsedSeconds > month) {
            strout = "for " + Math.round(elapsedSeconds / month) + " months";
            if (elapsedSeconds % month > week)
                strout +=
                    ", " +
                    Math.round((elapsedSeconds % month) / week) +
                    " weeks";
        } else {
            strout = "for " + Math.round(elapsedSeconds / week) + " weeks";
        }
        return strout;
    }

    /**
     * TODO: and about this Cthulhu
     * @summary Calculate and format datespan for "Last seen"
     * @param {number} date
     * @returns {string}
     */
    function lastseen(date: number) {
        var now = Date.now() / 1000;
        var today = new Date().setHours(0, 0, 0) / 1000;
        var nowseconds = now - today;
        var elapsedSeconds = now - date;
        if (elapsedSeconds < minute)
            return Math.round(elapsedSeconds) + " seconds ago";
        if (elapsedSeconds < hour)
            return Math.round(elapsedSeconds / minute) + " minutes ago";
        if (elapsedSeconds < nowseconds)
            return Math.round(elapsedSeconds / hour) + " hours ago";
        if (elapsedSeconds < day + nowseconds) return "yesterday";
        var then = new Date(date * 1000);
        if (elapsedSeconds < sixdays)
            return "on " + weekday_name[then.getDay()];
        return then.toDateString();
    }

    /**
     * TODO: and about this one (how many Cthulhu are there?)
     * @summary Format reputation string
     * @param {number} r
     * @returns {string}
     */
    function repNumber(r: number) {
        if (r < 1e4) return r.toString();
        else if (r < 1e5) {
            var d = Math.floor(Math.round(r / 100) / 10);
            r = Math.round((r - d * 1e3) / 100);
            return d + (r > 0 ? "." + r : "") + "k";
        } else return Math.round(r / 1e3) + "k";
    }

    /**
     * @summary Get the Id of the logged-in user
     * @param {typeof StackExchage} se
     * @returns {string}
     */
    const getLoggedInUserId = (se: typeof StackExchange) =>
        se.options.user.userId || "";

    /**
     * @summary shows a message
     * @param {HTMLElement} popup
     * @param {string} title
     * @param {string} body
     * @param {Function} [callback]
     * @returns {void}
     */
    const notify = (
        popup: HTMLElement,
        title: string,
        body: string,
        callback?: () => void
    ) => {
        const message = makeAnnouncement(title, body, true);

        message.addEventListener("click", ({ target }) => {
            if (!(<HTMLElement>target).matches(".notify-close a")) return;
            fadeOut(message);
            message.remove();
            typeof callback === "function" && callback();
        });

        popup.prepend(message);
        return message;
    };

    /**
     * @summary gets user Id
     * @param {HTMLInputElement} tgt element to insert comment in
     * @returns {string}
     */
    const getUserId = (tgt: HTMLInputElement) => {
        const parent = tgt.closest(".answer") || tgt.closest(".question");
        if (!parent) return "";

        const userLink = parent.querySelector<HTMLAnchorElement>(userLinkSel);
        if (!userLink) return "";

        const { href } = userLink;
        const [, uid] = /users\/(\d+)\//.exec(href) || [];
        return uid || "";
    };

    /**
     * @summary checks if the user is new
     * @param {number} date
     * @returns {boolean}
     */
    const isNewUser = (date: number) => Date.now() / 1000 - date < week;

    /**
     * @summary get original poster username
     * @description memoizable getter for poster name
     * @param {boolean} [refresh]
     * @returns {string}
     */
    const getOP: opGetter = (refresh = false) => {
        if (getOP.op && !refresh) return getOP.op;

        const question = document.getElementById("question")!;

        const userlink = question.querySelector(userLinkSel);

        if (userlink) return userlink.innerHTML || "";

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
     * @param {UserInfo} userInfo
     * @returns {void}
     */
    const addUserInfo = ({
        user_id,
        creation_date,
        display_name,
        last_access_date,
        reputation,
        user_type,
    }: UserInfo) => {
        const container = document.getElementById("userinfo");
        if (!container) return;

        if (isNewUser(creation_date)) {
            Store.save("ShowGreeting", true);
            container
                .querySelector(".action-desc")
                ?.prepend(Store.load("WelcomeMessage") || "");
        }

        const userLink = link(`/users/${user_id}`, "");
        userLink.append(b(display_name));

        empty(container);

        container.append(
            capitalize(user_type),
            text(" user "),
            userLink,
            text(", member "),
            b(datespan(creation_date)),
            text(", last seen "),
            b(lastseen(last_access_date)),
            text(", reputation "),
            b(repNumber(reputation))
        );
    };

    /**
     * @summary get basic user info from the API
     * @param {string} userid
     * @returns {Promise<UserInfo|null>}
     */
    const getUserInfo = async (userid: string) => {
        const url = new URL(
            `https://api.stackexchange.com/${API_VER}/users/${userid}`
        );
        url.search = new URLSearchParams({
            site,
            key: API_KEY,
            unsafe: FILTER_UNSAFE,
        }).toString();

        const res = await fetch(url.toString());
        if (!res.ok) return null;

        const {
            items: [userInfo],
        }: StackAPIBatchResponse<UserInfo> = await res.json();

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

    //Import complete text into comments
    function doImport(text: string) {
        //clear out any existing stuff
        Store.clear("name-");
        Store.clear("desc-");
        const arr = text.split("\n");
        let nameIndex = 0;
        let descIndex = 0;
        arr.forEach((untrimmed) => {
            const line = untrimmed.trim();

            //TODO: rework

            if (line.indexOf("#") == 0) {
                var name = line.replace(/^#+/g, "");
                Store.save("name-" + nameIndex, name);
                nameIndex++;
            }

            if (line.length > 0) {
                var desc = markdownToHTML(line);
                Store.save("desc-" + descIndex, tag(desc));
                descIndex++;
            }
        });

        //This is de-normalised, but I don't care.
        Store.save("commentcount", Math.min(nameIndex, descIndex));
    }

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
     * @param {string} html
     * @returns {string}
     */
    const escapeHtml = (html: string) =>
        String(html).replace(/[&<>]/g, (s) => entityMapToHtml[s]);

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
     * @param {string} markdown
     * @returns {string}
     */
    const markdownToHTML = (markdown: string) =>
        escapeHtml(markdown)
            .replace(/\[([^\]]+)\]\((.+?)\)/g, htmllink("$2", "$1"))
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*([^`]+?)\*/g, htmlem("$1"));

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

    type MaybeBtn = string | HTMLButtonElement | HTMLInputElement;

    /**
     * @summary disables an element
     * @param {MaybeBtn} elOrQuery
     */
    const disable = (elOrQuery: MaybeBtn) =>
        ((typeof elOrQuery === "string"
            ? document.querySelector<HTMLButtonElement>(elOrQuery)!
            : elOrQuery
        ).disabled = true);

    /**
     * @summary enables an element
     * @param {MaybeBtn} elOrQuery
     */
    const enable = (elOrQuery: MaybeBtn) =>
        ((typeof elOrQuery === "string"
            ? document.querySelector<HTMLButtonElement>(elOrQuery)!
            : elOrQuery
        ).disabled = false);

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
            ((Store.load("ShowGreeting") && Store.load("WelcomeMessage")) ||
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
        commentElem.closest("li")!.querySelector("input")!.disabled = false;
        enable(`#${Store.prefix}-submit`);
        dataset.mode = "insert";
    };

    /**
     * @summary opens the comment edit mode
     * @param {HTMLElement} commentElem
     * @param {HTMLElement} popup
     * @returns {void}
     */
    const openEditMode = (commentElem: HTMLElement, popup: HTMLElement) => {
        const {
            innerHTML: backup,
            dataset,
            dataset: { mode = "insert" },
        } = commentElem;

        if (mode === "edit") return;

        // remove greeting before editing
        const html = tag(backup.replace(Store.load("WelcomeMessage", ""), ""));

        debugLogger.log({ backup, html });

        empty(commentElem);

        const preview = document.createElement("span");
        preview.classList.add("d-inline-block", "p8"); //TODO: config
        preview.innerHTML = html;

        const [areaWrap, area] = makeStacksTextArea(commentElem.id, {
            value: HTMLtoMarkdown(html),
        });

        area.addEventListener("input", ({ target }) => {
            const { value } = <HTMLTextAreaElement>target;
            preview.innerHTML = markdownToHTML(untag(value));
        });

        area.addEventListener("change", ({ target }) => {
            const { id, value } = <HTMLTextAreaElement>target;
            closeEditMode(commentElem, saveComment(id, value));
        });

        // Disable comment input while editing
        commentElem.closest("li")!.querySelector("input")!.disabled = true;

        // Disable quick-insert while editing.
        popup.querySelectorAll<HTMLElement>(".quick-insert").forEach(hide);

        // Disable insert while editing.
        disable(`#${Store.prefix}-submit`);

        // save/cancel links to add to textarea
        const actions = document.createElement("div");
        actions.classList.add("actions");

        const cancel = makeButton("cancel", "cancel edit");
        cancel.addEventListener("click", () => {
            popup.querySelectorAll<HTMLElement>(".quick-insert").forEach(show);
            closeEditMode(commentElem, backup);
        });

        actions.append(cancel);
        commentElem.append(preview, areaWrap, actions);

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
     * @returns {{ name: string; desc: string }[]}
     */
    const loadComments = (numComments: number) => {
        const comments: { name: string; desc: string }[] = [];
        for (let i = 0; i < numComments; i++) {
            const name = Store.load<string>(`name-${i}`);
            const desc = Store.load<string>(`desc-${i}`);
            comments.push({ name, desc });
        }
        return comments;
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
            const { classList } = action;
            classList.add("action-selected");

            const descr = action.querySelector<HTMLElement>(".action-desc")!;

            show(descr);
            enable(`#${Store.prefix}-submit`);
        };

    /**
     * @summary makes the comment quick insert handler
     * @param {HTMLElement} popup wrapper popup
     * @returns {EventListener}
     */
    const makeQuickInsertHandler =
        (popup: HTMLElement): EventListener =>
        ({ target }) => {
            const el = <HTMLElement>target;

            if (!el.matches("label > .quick-insert")) return;

            const action = el.closest("li");
            const radio = action?.querySelector("input");

            if (!action || !radio)
                return notify(popup, "Problem", "something went wrong");

            action.classList.add("action-selected");

            radio.checked = true;

            document.getElementById(`${Store.prefix}-submit`)?.click();
        };

    /**
     * @summary sets up comment event listeners
     * @param {HTMLElement} popup wrapper popup
     * @param {string} viewId comment view id
     * @returns {void}
     */
    const setupCommentHandlers = (popup: HTMLElement, viewId: string) => {
        const currView = Store.load("CurrentView");

        popup.addEventListener("dblclick", ({ target }) => {
            const el = <HTMLElement>target;
            if (!el.matches(".action-desc")) return;
            openEditMode(el, popup);
        });

        const insertHandler = makeQuickInsertHandler(popup);
        const selectHandler = makeCommentClickHandler(popup);

        popup.addEventListener("click", (event) => {
            debugLogger.log({ currView, viewId });
            if (currView !== viewId) return;
            insertHandler(event);
            selectHandler(event);
        });

        popup.addEventListener("keyup", (event) => {
            if (event.code !== "Enter") return;
            event.preventDefault();
            document.getElementById(`${Store.prefix}-submit`)?.click();
        });
    };

    /**
     * @summary updates comments in the UI
     * @param {HTMLElement} popup wrapper popup
     * @param {PostType} postType parent post type
     * @returns {void}
     */
    const updateComments = (popup: HTMLElement, postType: PostType) => {
        const numComments = Store.load<number>("commentcount");

        if (!numComments) resetComments(commentDefaults);

        const ul = popup.querySelector(".action-list")!;

        empty(ul);

        const comments = loadComments(numComments);

        const greet = Store.load("ShowGreeting", false);
        const welcome = Store.load("WelcomeMessage", "");
        const greeting = greet ? welcome : "";

        const userId = getLoggedInUserId(StackExchange);

        debugLogger.log({
            comments,
            postType,
            greet,
            welcome,
            greeting,
            userId,
        });

        const listItems = comments
            .filter(({ name }) => isCommentValidForType(name, postType))
            .map(({ name, desc }, i) => {
                const cname = name.replace(allTgtMatcher, "");

                const description = desc
                    .replace(/\$SITENAME\$/g, sitename)
                    .replace(/\$SITEURL\$/g, site)
                    .replace(/\$MYUSERID\$/g, userId)
                    .replace(/\$/g, "$$$");

                return makeOption(
                    i.toString(),
                    cname.replace(/\$/g, "$$$"),
                    greeting + description
                );
            });

        ul.append(...listItems);

        toggleDescriptionVisibility(popup);
    };

    /**
     * @summary Checks if a given comment could be used together with a given post type.
     * @param {string} text The comment content itself.
     * @param {PostType} postType The type of post the comment could be placed on.
     * @return {boolean} true if the comment is valid for the type of post; false otherwise.
     */
    const isCommentValidForType = (text: string, postType: PostType) => {
        const [, matched] = text.match(allTgtMatcher) || [];
        return matched === postType;
    };

    /**
     * @summary filters comments based on text
     * @param {HTMLElement} popup wrapper popup
     * @param {string} text text to match
     * @returns {void}
     */
    const filterOn = (popup: HTMLElement, text: string) => {
        const words = text
            .toLowerCase()
            .split(/\s+/)
            .filter(({ length }) => length);

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

            const shown = words.some(
                (w) => name.includes(w) || desc.includes(w)
            );

            shown ? show(item) : hide(item);
        });
    };

    /**
     * @summary sets up search event handlers
     * @param {HTMLElement} popup wrapper popup
     * @returns {void}
     */
    const setupSearchHandlers = (popup: HTMLElement) => {
        const filterSel = ".searchfilter";

        const sbox = popup.querySelector<HTMLElement>(".searchbox")!;

        const stext = sbox.querySelector<HTMLInputElement>(filterSel);
        if (!stext) return debugLogger.log(`missing filter: ${filterSel}`);

        const callback: EventListener = ({ target }) =>
            setTimeout(() => {
                const { value } = <HTMLInputElement>target;
                filterOn(popup, value);
            }, 100);

        stext.addEventListener("keydown", callback);
        stext.addEventListener("change", callback);
        stext.addEventListener("cut", callback);
        stext.addEventListener("paste", callback);
        stext.addEventListener("search", callback);
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
    const getJSONP = <T>(url: string, callbackName = "callback"): Promise<T> =>
        new Promise((resolve, reject) => {
            // if running from a manager, page is only accessible from unsafeWindow
            const target =
                typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

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
     * @param {string} url remore URL to fetch from
     * @param {boolean} [isJSONP] JSONP switch
     * @returns {Promise<void>}
     */
    const fetchFromRemote = async (url: string, isJSONP = false) => {
        debugLogger.log({ isJSONP });

        const fetcher = isJSONP ? getJSONP : getJSON;

        const comments: CommentInfo[] = await fetcher(url);

        Store.save("commentcount", comments.length);
        Store.clear("name-");
        Store.clear("desc-");
        comments.forEach(({ name, description }, i) => {
            Store.save(`name-${i}`, name);
            Store.save(`desc-${i}`, tag(markdownToHTML(description)));
        });
    };

    /**
     * @summary shows the popup (prevents SE overrides)
     * @param {HTMLElement} popup
     * @returns {void}
     */
    const showPopup = (popup: HTMLElement) => {
        fadeTo(popup, 1);
        const { style, classList } = popup;
        style.display = "";
        classList.remove("popup-closing", "popup-closed");
    };

    /**
     * @summary creates ARC modal and wires functionality
     * @param {HTMLInputElement} target
     * @param {PostType} postType
     * @returns {Promise<void>}
     */
    const autoLinkAction = async (
        target: HTMLInputElement,
        postType: PostType
    ) => {
        const popup = makePopup(target, postType);

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

        updateComments(popup, postType);

        center(popup);

        StackExchange.helpers.bindMovablePopups();

        //Get user info and inject
        const userid = getUserId(target);

        if (userid) {
            const uinfo = await getUserInfo(userid);
            debugLogger.log({ userid, uinfo });
            if (uinfo) addUserInfo(uinfo);
        }
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

            if (injectNextTo) return injector(injectNextTo, placeIn, actor);

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
    const findCommentElements = ({ parentElement }: HTMLElement): Placement => {
        const { id } = parentElement!;

        const divId = id.replace("-link", "");

        const div = document.getElementById(divId)!;

        const injectNextTo = div.querySelector<HTMLElement>(
            ".js-comment-help-link"
        )!;
        const placeCommentIn = div.querySelector("textarea")!;
        return [injectNextTo, placeCommentIn];
    };

    /**
     * @summary A locator for the edit summary input box under a post while it is being edited.
     * @param {HTMLAnchorElement} where A DOM element, near which we're looking for the location where to inject our link.
     * @returns {Placement} The DOM element next to which the link should be inserted and the element into which the comment should be placed.
     */
    const findEditSummaryElements = ({
        href,
    }: HTMLAnchorElement): Placement => {
        const [, divid] = href.match(/posts\/(\d+)\/edit/) || [];

        const { nextElementSibling } = document.getElementById(
            `post-editor-${divid}`
        )!;

        const placeIn =
            nextElementSibling!.querySelector<HTMLElement>(".edit-comment")!;

        return [placeIn, placeIn];
    };

    /**
     * @summary A locator for the text area in which to put a custom off-topic closure reason in the closure dialog.
     * @param {HTMLElement} where A DOM element, near which we're looking for the location where to inject our link.
     * @returns {Placement} The DOM element next to which the link should be inserted and the element into which the
     *                     comment should be placed.
     */
    const findClosureElements = (_where: HTMLElement): Placement => {
        //TODO: why where is not used?
        const injectTo = document.querySelector<HTMLElement>(
            ".close-as-off-topic-pane textarea"
        )!;
        return [injectTo, injectTo];
    };

    /**
     * @summary A locator for the edit summary you get in the "Help and Improvement" review queue.
     * @param {HTMLElement} where A DOM element, near which we're looking for the location where to inject our link.
     * @returns {Placement} The DOM element next to which the link should be inserted and the element into which the
     *                     comment should be placed.
     */
    const findReviewQueueElements = (_where: HTMLElement): Placement => {
        const injectTo = document.querySelector<HTMLElement>(".text-counter")!;
        const placeIn = document.querySelector<HTMLElement>(".edit-comment")!;
        return [injectTo, placeIn];
    };

    /**
     * @summary makes the "auto" button
     * @param {Actor} what The function that will be called when the link is clicked.
     * @param {HTMLElement} next The DOM element next to which we'll place the link.
     * @param {HTMLElement} where The DOM element into which the comment should be placed.
     * @returns {HTMLAnchorElement}
     */
    const makePopupOpenButton = (
        callback: Actor,
        next: Parameters<Actor>[0],
        where: Parameters<Actor>[1]
    ) => {
        const alink = document.createElement("a");
        alink.classList.add("comment-auto-link");
        alink.innerHTML = "auto";
        alink.addEventListener("click", (ev) => {
            ev.preventDefault();
            callback(next, where);
        });
        return alink;
    };

    /**
     * @summary gets target type by post type
     * @param {HTMLElement} where The DOM element next to which we'll place the link.
     * @param {[PostType, string][]} clsMap post type to target map
     * @returns {string}
     */
    const getTargetType = (
        where: HTMLElement,
        clsMap: [PostType, string][]
    ) => {
        const parent = where.closest(".answer") || where.closest(".question");
        if (!parent) return Target.CommentQuestion;

        const { classList } = parent;

        //if not found, we have a problem
        const [, tgt] = clsMap.find(([c]) => classList.contains(c)) || [];
        return tgt;
    };

    /**
     * @summary Inject the auto link next to the given DOM element.
     * @param {HTMLElement} where The DOM element next to which we'll place the link.
     * @param {HTMLElement} placeCommentIn The DOM element into which the comment should be placed.
     * @param {Actor} actor The function that will be called when the link is clicked.
     * @returns {void}
     */
    const injectAutoLink = (
        where: HTMLElement,
        placeCommentIn: HTMLElement,
        actor: Actor
    ) => {
        const existingAutoLinks = siblings(where, ".comment-auto-link");
        if (existingAutoLinks.length) return;

        const clsMap: [PostType, string][] = [
            ["answer", Target.CommentAnswer],
            ["question", Target.CommentQuestion],
        ];
        const tgt = getTargetType(where, clsMap);

        const lsep = makeSeparator();
        const alink = makePopupOpenButton(actor, placeCommentIn, tgt);
        where.after(lsep, alink);
    };

    /**
     * @summary Inject the auto link next to the given DOM element.
     * @param {HTMLElement} where The DOM element next to which we'll place the link.
     * @param {HTMLElement} placeCommentIn The DOM element into which the comment should be placed.
     * @param {Actor} actor The function that will be called when the link is clicked.
     * @returns {void}
     */
    const injectAutoLinkClosure = (
        where: HTMLElement,
        placeCommentIn: HTMLElement,
        actor: Actor
    ) => {
        const existingAutoLinks = siblings(where, ".comment-auto-link");
        if (existingAutoLinks.length) return;

        const lsep = makeSeparator();
        const alink = makePopupOpenButton(
            actor,
            placeCommentIn,
            Target.Closure
        );
        where.after(lsep, alink);
    };

    /**
     * @summary Inject hte auto link next to the "characters left" counter below the edit summary in the review queue.
     * @param {HTMLElement} where The DOM element next to which we'll place the link.
     * @param {HTMLElement} placeCommentIn The DOM element into which the comment should be placed.
     * @param {Actor} actor The function that will be called when the link is clicked.
     * @returns {void}
     */
    const injectAutoLinkReviewQueue = (
        where: HTMLElement,
        placeCommentIn: HTMLElement,
        actor: Actor
    ) => {
        const existingAutoLinks = siblings(where, ".comment-auto-link");
        if (existingAutoLinks.length) return;

        const lsep = makeSeparator();
        const alink = makePopupOpenButton(
            actor,
            placeCommentIn,
            Target.EditSummaryQuestion
        );
        alink.style.float = "right";

        where.after(lsep, alink);
    };

    /**
     * Inject the auto link next to the edit summary input box.
     * This will also slightly shrink the input box, so that the link will fit next to it.
     * @param {HTMLElement} where The DOM element next to which we'll place the link.
     * @param {HTMLElement} placeIn The DOM element into which the comment should be placed.
     * @param {Actor} actor The function that will be called when the link is clicked.
     * @returns {void}
     */
    const injectAutoLinkEdit = (
        where: HTMLElement,
        placeIn: HTMLElement,
        actor: Actor
    ) => {
        const existingAutoLinks = siblings(where, ".comment-auto-link");
        if (existingAutoLinks.length) return;

        const { style } = where;
        style.width = "510px";

        const overs = siblings<HTMLElement[]>(where, ".actual-edit-overlay");
        overs.forEach(({ style }) => (style.width = "510px"));

        const clsMap: [PostType, string][] = [
            ["answer", Target.EditSummaryAnswer],
            ["question", Target.EditSummaryQuestion],
        ];
        const tgt = getTargetType(where, clsMap);

        const lsep = makeSeparator();
        const alink = makePopupOpenButton(actor, placeIn, tgt);
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
        ".edit-post",
        findEditSummaryElements,
        injectAutoLinkEdit,
        autoLinkAction
    );

    addTriggerButton(
        ".close-question-link",
        findClosureElements,
        injectAutoLinkClosure,
        autoLinkAction
    );

    addTriggerButton(
        ".review-actions input:first-child",
        findReviewQueueElements,
        injectAutoLinkReviewQueue,
        autoLinkAction
    );
});
