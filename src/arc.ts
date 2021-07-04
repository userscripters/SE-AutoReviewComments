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
    VersionChecked: boolean;
    ARC_AutoUpdate: Function;
}

declare var CheckForNewVersion: ((...args: any[]) => any) | undefined;

type PostType = "answer" | "question";

type Placement = readonly [insert: HTMLElement | null, place: HTMLElement];

type Locator<T extends HTMLElement = HTMLElement> = (where: T) => Placement;

type Notifier = (newVersion: string, oldVersion: string) => void;

type Actor = (...args: any[]) => any;

type Injector = (
    injected: HTMLElement,
    placed: HTMLElement,
    action: Actor
) => void;

type WrapperPopupMaker = {
    popup?: HTMLElement;
    (target: HTMLInputElement, postType: PostType): HTMLElement;
};

type ActionsViewMaker = {
    view?: HTMLElement;
    (popup: HTMLElement, id: string): HTMLElement;
};

type SearchViewMaker = {
    view?: HTMLElement;
    (id: string): HTMLElement;
};

type WelcomeViewMaker = {
    view?: HTMLElement;
    (popup: HTMLElement, id: string, postType: PostType): HTMLElement;
};

type RemoteViewMaker = {
    view?: HTMLElement;
    (popup: HTMLElement, id: string, postType: PostType): HTMLElement;
};

type ImpExpViewMaker = {
    view?: HTMLElement;
    (popup: HTMLElement, id: string, postType: PostType): HTMLElement;
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
     * @summary promise-based delay
     * @param {number} delay
     * @returns {Promise<void>}
     */
    const delay = async (delay: number) =>
        new Promise((res) => setTimeout(res, delay));

    /**
     * @summary fades element to provided opacity
     * @param {HTMLElement} element
     * @param {number} min
     * @param {number} [speed]
     *
     * @returns {Promise<HTMLElement>}
     */
    const fadeTo = async (
        element: HTMLElement & { fades?: boolean },
        min: number,
        speed = 200
    ) => {
        if (element.fades) return element;
        element.fades = true;

        const { style } = element;
        style.opacity = style.opacity || "1";
        const steps = Math.ceil(speed / 16);

        const step = (+style.opacity - min) / steps;
        const up = step < 0;

        for (let i = 0; i < steps; i++) {
            const newOpacity = +style.opacity - step;
            style.opacity = newOpacity.toFixed(4);
            if (up ? newOpacity >= min : newOpacity <= min) break;
            await delay(16);
        }

        delete element.fades;
        return element;
    };

    /**
     * @summary fades out an element
     * @param {HTMLElement} el
     * @param {number} [speed]
     */
    const fadeOut = (el: HTMLElement, speed = 200) => fadeTo(el, 0, speed);

    class Store {
        static prefix = "{{PREFIX}}";

        static storage = localStorage;

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
            const val = storage[prefix + key];
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
    const RAW_URL = "{{RAW_URL}}";
    const GITHUB_URL = "{{GITHUB_URL}}";
    const STACKAPPS_URL = "{{STACKAPPS_URL}}";
    const API_VER = "{{API_VER}}";
    const API_KEY = "{{API_KEY}}";
    const FILTER_UNSAFE = "{{FILTER_UNSAFE}}";

    const debugLogger = new Debugger(Store.load("debug"));

    const site = window.location.hostname;

    const sitename = (StackExchange.options.site.name || "").replace(
        /\s?Stack Exchange/,
        ""
    ); //same for others ("Android Enthusiasts Stack Exchange", SR, and more);

    // A regular expression to match the possible targets in a string.
    const allTgtMatcher = new RegExp("\\[(E?[AQ]|C)(?:,(E?[AQ]|C))*\\]");

    //itemprop distinguishes between the author and editor
    const userLinkSel = ".post-signature .user-details[itemprop=author] a";

    //selects all views except actions
    const viewsSel = ".main .view:not(:last-child)";

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
    const commentDefaults = [
        {
            Target: [Target.CommentQuestion],
            Name: "More than one question asked",
            Description: `It is preferred if you can post separate questions instead of combining your questions into one. That way, it helps the people answering your question and also others hunting for at least one of your questions. Thanks!`,
        },
        {
            Target: [Target.CommentQuestion],
            Name: "Duplicate Closure",
            Description: `This question will likely be closed as a duplicate soon. If the answers from the duplicates do not fully address your question, please edit it to include why and flag this for re-opening. Thanks!`,
        },
        {
            Target: [Target.CommentAnswer],
            Name: "Answers just to say Thanks!",
            Description: `Please do not add "thanks" as answers. Invest some time in the site and you will gain sufficient ${htmllink(
                "/privileges",
                "privileges"
            )} to upvote answers you like, which is our way of saying thank you.`,
        },
        {
            Target: [Target.CommentAnswer],
            Name: "Nothing but a URL (and isn't spam)",
            Description: `Whilst this may theoretically answer the question, ${htmllink(
                "https://meta.stackexchange.com/q/8259",
                "it would be preferable"
            )} to include the essential parts of the answer here, and provide the link for reference.`,
        },
        {
            Target: [Target.CommentAnswer],
            Name: "Requests to OP for further information",
            Description: `This is really a comment, not an answer. With a bit more rep, ${htmllink(
                "/privileges/comment",
                "you will be able to post comments"
            )}. For the moment, I have added the comment for you and flagging the post for deletion.`,
        },
        {
            Target: [Target.CommentAnswer],
            Name: "OP using an answer for further information",
            Description: `Please use the ${htmlem(
                "Post answer"
            )} button only for actual answers. You should modify your original question to add additional information.`,
        },
        {
            Target: [Target.CommentAnswer],
            Name: "OP adding a new question as an answer",
            Description: `If you have another question, please ask it by clicking the ${htmllink(
                "/questions/ask",
                "Ask Question"
            )} button.`,
        },
        {
            Target: [Target.CommentAnswer],
            Name: 'Another user adding a "Me too!"',
            Description: `If you have a ${htmlem(
                "new"
            )} question, please ask it by clicking the ${htmllink(
                "/questions/ask",
                "Ask Question"
            )} button. If you have sufficient reputation, ${htmllink(
                "/privileges/vote-up",
                "you may upvot"
            )} the question. Alternatively, "star" it as a favorite, and you will be notified of any new answers.`,
        },
        {
            Target: [Target.Closure],
            Name: "Too localized",
            Description: `This question appears to be off-topic because it is too localized.`,
        },
        {
            Target: [Target.EditSummaryQuestion],
            Name: "Improper tagging",
            Description: `The tags you used are not appropriate for the question. Please review ${htmllink(
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

    // Self Updating Userscript, see https://gist.github.com/Benjol/874058
    if (typeof window.ARC_AutoUpdate === "function")
        return window.ARC_AutoUpdate(VERSION);

    if (!Store.load("WelcomeMessage"))
        Store.save("WelcomeMessage", `Welcome to ${sitename}! `);

    /**
     * @summary checks if a given version is newer
     * @param {string} newVer new semantic version
     * @param {string} curVer current semantic version
     * @returns {boolean}
     */
    const isNewer = (newVer: string, curVer: string) => {
        const np = newVer.split(".").map(Number);
        const cp = curVer.split(".").map(Number);
        return np.some(
            (v, idx) =>
                v > cp[idx] &&
                np.slice(0, idx).every((v, i) => i === idx || v >= cp[i])
        );
    };

    /**
     * @summary if has never version, download
     * @param {Notifier} notifier
     * @returns {void}
     */
    const updateCheck = (notifier: Notifier) => {
        window.ARC_AutoUpdate = (newver: string) => {
            if (isNewer(newver, VERSION)) notifier(newver, RAW_URL);
        };

        const script = document.createElement("script");
        script.src = RAW_URL;

        document.head.append(script);
    };

    /**
     * @description Check to see if a new version has become available since last check
     * - only checks once a day
     * - does not check for first time visitors, shows them a welcome message instead
     * - called at the end of the main script if function exists
     * @param {HTMLElement} popup
     */
    const checkForNewVersion = (popup: HTMLElement) => {
        const today = new Date().setHours(0, 0, 0, 0);
        const LastUpdateCheckDay = Store.load("LastUpdateCheckDay");

        if (!LastUpdateCheckDay) {
            //first time visitor
            notify(
                popup,
                "Please read this!",
                `Thank you for installing the userscript.
                    Please note that you can edit the texts inline by double-clicking them.
                    For other options, please see the README <a href="${GITHUB_URL}" target="_blank">here</a>.`
            );
        } else if (LastUpdateCheckDay != today) {
            updateCheck((newVersion: string, installURL: string) => {
                if (newVersion == Store.load("LastVersionAcknowledged")) return;

                notify(
                    popup,
                    "New Version!",
                    `A new version (${newVersion}) of the <a href="${STACKAPPS_URL}">AutoReviewComments</a> userscript is now available, see the <a href="${GITHUB_URL}/releases">release notes</a> for details or <a href="${installURL}">click here</a> to install now.`,
                    () => Store.save("LastVersionAcknowledged", newVersion)
                );
            });
        }

        Store.save("LastUpdateCheckDay", today);
    };

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
            `.${arc}.popup .throbber{
                    display:none
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
                    overflow-y:auto;
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
            `.${arc}.popup .actions,.auto-review-comments.popup .main .actions{
                    margin:6px
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
     * @summary makes a button
     * @param {string} text
     * @param {string} title
     * @param {...string} classes
     * @returns {HTMLAnchorElement}
     */
    const makeButton = (text: string, title: string, ...classes: string[]) => {
        const cancelBtn = document.createElement("a");
        cancelBtn.classList.add(...classes);
        cancelBtn.innerHTML = text;
        cancelBtn.title = title;
        return cancelBtn;
    };

    /**
     * @summary makes a link button
     * @param {string} url
     * @param {string} text
     * @param {string} title
     * @param {...string} classes
     * @returns {HTMLAnchorElement}
     */
    const makeLinkButton = (
        url: string,
        text: string,
        title: string,
        ...classes: string[]
    ) => {
        const btn = makeButton(text, title, ...classes);
        btn.href = url;
        btn.target = "_blank";
        return btn;
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
     * @summary makes an image element
     * @param {string} id
     * @param {string} src
     * @param {...string} classes
     * @returns {HTMLImageElement}
     */
    const makeImage = (id: string, src: string, ...classes: string[]) => {
        const img = document.createElement("img");
        img.classList.add(...classes);
        img.src = src;
        img.id = id;
        return img;
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
     * @param {HTMLElement} view current view
     * @returns {HTMLElement}
     */
    const switchToView = (view: HTMLElement) => {
        document.querySelectorAll<HTMLElement>(viewsSel).forEach(hide);
        show(view);
        Store.save("CurrentView", view.id);
        return view;
    };

    /**
     * @summary makes popup action view
     * @param {HTMLElement} popup wrapper popup
     * @param {string} id actions wrapper id
     * @returns {HTMLElement}
     */
    const makeActionsView: ActionsViewMaker = (popup, id) => {
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

        const helpBtn = makeLinkButton(
            GITHUB_URL,
            "info",
            `see info about this popup (v${VERSION})`,
            "popup-actions-help"
        );

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

        const filterBtn = makeButton(
            "filter",
            "filter",
            "popup-actions-filter"
        );

        const resetBtn = makeButton(
            "reset",
            "reset any custom comments",
            "popup-actions-reset"
        );

        const importBtn = makeButton(
            "import/export",
            "use this to import/export all comments",
            "popup-actions-impexp"
        );

        const descrBtn = makeButton(
            "show/hide desc",
            "use this to hide/show all comments",
            "popup-actions-toggledesc"
        );

        const remoteBtn = makeButton(
            "remote",
            "setup remote source",
            "popup-actions-remote"
        );

        const dotsImg = makeImage(
            "throbber2",
            "https://sstatic.net/img/progress-dots.gif", //TODO: make config
            "throbber"
        );

        const welcomeBtn = makeButton(
            "welcome",
            "configure welcome",
            "popup-actions-welcome"
        );

        const sep = makeSeparator();

        const actionsList = [
            helpBtn,
            sep.cloneNode(),
            seeBtn,
            sep.cloneNode(),
            filterBtn,
            sep.cloneNode(),
            resetBtn,
            sep.cloneNode(),
            importBtn,
            sep.cloneNode(),
            descrBtn,
            sep.cloneNode(),
            remoteBtn,
            dotsImg,
            sep.cloneNode(),
            welcomeBtn,
        ];

        actionsWrap.append(...actionsList);
        wrap.append(actionsWrap, submitWrap);
        return wrap;
    };

    /**
     * @summary makes the search view
     * @param {string} id view id
     * @returns {HTMLElement}
     */
    const makeSearchView: SearchViewMaker = (id) => {
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
    const makeWelcomeView: WelcomeViewMaker = (popup, id, postType) => {
        if (makeWelcomeView.view) return makeWelcomeView.view;

        const wrap = document.createElement("div");
        wrap.classList.add("view");
        wrap.id = id;

        const text = document.createTextNode(
            'Setup the "welcome" message (blank is none):'
        );

        const welcomeWrap = document.createElement("div");

        const input = document.createElement("input");
        input.classList.add("customwelcome");
        input.type = "text";
        input.id = "customwelcome";

        input.addEventListener("change", () =>
            Store.save("WelcomeMessage", input.value)
        );

        welcomeWrap.append(input);

        const actionsWrap = document.createElement("div");
        actionsWrap.classList.add("float-right");

        const actions: Node[] = [
            makeButton("force", "force", "welcome-force"),
            makeSeparator(),
            makeButton("cancel", "cancel", "welcome-cancel"),
        ];

        popup.addEventListener("click", ({ target }) => {
            const el = <HTMLElement>target;

            const actionMap: Record<
                string,
                (p: HTMLElement, w: HTMLElement) => void
            > = {
                ".popup-actions-welcome": (_p, w) => {
                    input.value ||= Store.load("WelcomeMessage");
                    show(w);
                },
                ".welcome-cancel": () =>
                    switchToView(makeSearchView("search-popup")),
                ".welcome-force": () => {
                    Store.save("ShowGreeting", true);
                    updateComments(popup, postType);
                },
            };

            const [, action] =
                Object.entries(actionMap).find(([key]) => el.matches(key)) ||
                [];

            if (!action) return debugLogger.log({ target });

            action(popup, wrap);
        });

        actionsWrap.append(...actions);

        wrap.append(text, welcomeWrap, actionsWrap);
        return (makeWelcomeView.view = wrap);
    };

    /**
     * @summary Show textarea in front of popup to import/export all comments (for other sites or for posting somewhere)
     * @param {HTMLElement} popup wrapper popup
     * @param {string} id view id
     * @param {PostType} postType parent post type
     * @returns {HTMLElement}
     */
    const makeImpExpView: ImpExpViewMaker = (popup, id, postType) => {
        if (makeImpExpView.view) return makeImpExpView.view;

        const wrap = document.createElement("div");
        wrap.classList.add("view");
        wrap.id = id;

        const actionWrap = document.createElement("div");
        actionWrap.classList.add("actions");

        const txtArea = document.createElement("textarea");

        txtArea.addEventListener("change", async () => {
            doImport(txtArea.value);
            updateComments(popup, postType);
        });

        const jsonpBtn = makeButton("JSONP", "JSONP", "jsonp");

        const cancelBtn = makeButton(
            "cancel",
            "cancel import/export",
            "cancel"
        );

        cancelBtn.addEventListener("click", () =>
            switchToView(makeSearchView("search-popup"))
        );

        actionWrap.append(jsonpBtn, makeSeparator(), cancelBtn);

        wrap.append(txtArea, actionWrap);

        const numComments = Store.load<number>("commentcount");
        const loaded = loadComments(numComments);

        const content = loaded
            .map(({ name, desc }) => `###${name}\n${HTMLtoMarkdown(desc)}`)
            .join("\n\n");

        txtArea.value = content;

        const cbk = "callback";
        jsonpBtn.addEventListener("click", () => {
            const numComments = Store.load<number>("commentcount");

            const loaded = loadComments(numComments);
            const content = loaded
                .map((comment) => JSON.stringify(comment))
                .join(",\n");

            txtArea.value = `${cbk}([\n${content}\n])`;

            wrap.querySelector(".actions")?.remove();
        });

        return (makeImpExpView.view = wrap);
    };

    /**
     * @summary makes the remote view
     * @param {HTMLElement} popup wrapper popup
     * @param {string} id view id
     * @param {PostType} postType parent post type
     * @returns {HTMLElement}
     */
    const makeRemoteView: RemoteViewMaker = (popup, id, postType) => {
        if (makeRemoteView.view) return makeRemoteView.view;

        const wrap = document.createElement("div");
        wrap.classList.add("view");
        wrap.id = id;

        const text = document.createTextNode(
            "Remote source of comments (use import/export to create JSONP)"
        );

        const remoteInput = document.createElement("input");
        remoteInput.classList.add("remoteurl");
        remoteInput.type = "text";
        remoteInput.id = "remoteurl";

        remoteInput.addEventListener("change", () => {
            Store.save("RemoteUrl", remoteInput.value);
        });

        const image = makeImage(
            "throbber1",
            "https://sstatic.net/img/progress-dots.gif",
            "throbber"
        );

        const autoWrap = document.createElement("div");
        autoWrap.classList.add("float-left");

        const autoInput = document.createElement("input");
        autoInput.type = "checkbox";
        autoInput.id = "remoteauto";
        autoInput.checked = Store.load("AutoRemote");

        autoInput.addEventListener("change", () => {
            Store.save("AutoRemote", autoInput.checked);
        });

        const autoLabel = document.createElement("label");
        autoLabel.title = "get from remote on every page refresh";
        autoLabel.htmlFor = autoInput.id;
        autoLabel.textContent = "auto-get";

        autoWrap.append(autoInput, autoLabel);

        const actionsWrap = document.createElement("div");
        actionsWrap.classList.add("float-right");

        const actions: Node[] = [
            makeButton("get now", "get remote", "remote-get"),
            makeSeparator(),
            makeButton("cancel", "cancel remote", "remote-cancel"),
        ];

        popup.addEventListener("click", ({ target }) => {
            const el = <HTMLElement>target;

            const actionMap = {
                ".popup-actions-remote": () => {
                    remoteInput.value &&= Store.load("RemoteUrl");
                    autoInput.checked = Store.load("AutoRemote", false);
                },
                ".remote-cancel": () =>
                    switchToView(makeSearchView("search-popup")),
                ".remote-get": () => {
                    show(image);
                    loadFromRemote(
                        remoteInput.value,
                        () => {
                            updateComments(popup, postType);
                            hide(image);
                        },
                        ({ message }: Error) =>
                            notify(popup, "Problem", message)
                    );
                },
            };

            const [, action] =
                Object.entries(actionMap).find(([key]) => el.matches(key)) ||
                [];

            if (!action) return debugLogger.log({ el, wrap });

            action();
        });

        actionsWrap.append(...actions);

        wrap.append(text, remoteInput, image, autoWrap, actionsWrap);

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

        popup.addEventListener("click", ({ target }) => {
            const actionMap: Record<
                string,
                (popup: HTMLElement, postType: PostType) => void
            > = {
                ".popup-actions-welcome": (p, t) =>
                    switchToView(makeWelcomeView(p, "welcome-popup", t)),
                ".popup-actions-remote": (p, t) =>
                    switchToView(makeRemoteView(p, "remote-popup", t)),
                ".popup-actions-impexp": (p, t) =>
                    switchToView(makeImpExpView(p, "impexp-popup", t)),
                ".popup-actions-filter": () =>
                    switchToView(makeSearchView("search-popup")),
                ".popup-actions-reset": (p, t) => {
                    resetComments();
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

                    debugLogger.log({ selected, descr });

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
            };

            const [, action] =
                Object.entries(actionMap).find(([selector]) =>
                    (<HTMLElement>target).matches(selector)
                ) || [];

            if (!action) return debugLogger.log({ target, postType });

            action(popup, postType);
        });

        const commentViewId = "search-popup";

        const views: HTMLElement[] = [
            makeSearchView(commentViewId),
            makeRemoteView(popup, "remote-popup", postType),
            makeWelcomeView(popup, "welcome-popup", postType),
            makeImpExpView(popup, "impexp-popup", postType),
            makeActionsView(popup, "popup-actions"),
        ];

        const hidden = views.slice(1, -1);
        hidden.forEach(hide);

        main.append(...views);
        popup.append(close, main);

        setupCommentHandlers(popup, commentViewId);
        setupSearchHandlers(popup, ".popup-actions-filter");
        switchToView(views[0]);

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
     * @returns {string}
     */
    const getLoggedInUserId = () => {
        const { options: { user: { userId } = {} } = {} } = StackExchange;
        return userId || "";
    };

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
        const { href } = parent.querySelector<HTMLAnchorElement>(userLinkSel)!;
        const [, uid] = href.match(/users\/(\d+)\//) || [];
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
     * @param {HTMLElement} container
     * @returns {void}
     */
    const addUserInfo = (container: HTMLElement, userInfo: UserInfo) => {
        const {
            user_id,
            creation_date,
            display_name,
            last_access_date,
            reputation,
            user_type,
        } = userInfo;

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
                .replace(/<a href="(.+?)">(.+?)<\/a>/g, "[$2]($1)")
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
            .replace(/\[([^\]]+)\]\((.+?)\)/g, '<a href="$2">$1</a>')
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*([^`]+?)\*/g, "<em>$1</em>");

    /**
     * @summary untags the comment text
     * @param {string} text
     * @returns {string}
     */
    const untag = (text: string) =>
        text
            .replace(/\$SITENAME\$/g, sitename)
            .replace(/\$SITEURL\$/g, site)
            .replace(/\$MYUSERID\$/g, getLoggedInUserId());

    /**
     * @summary tags the comment text
     * @param {string} html
     * @returns {string}
     */
    const tag = (html: string) => {
        const regname = new RegExp(sitename, "g");
        const regurl = new RegExp(`//${site}`, "g");
        const reguid = new RegExp(`/${getLoggedInUserId()}[)]`, "g");
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
     * @summary Replace contents of element with a textarea (containing markdown of contents), and save/cancel buttons
     * @param {HTMLElement} el
     * @param {HTMLElement} popup
     * @returns {void}
     */
    const openEditMode = (el: HTMLElement, popup: HTMLElement) => {
        const { innerHTML: backup } = el;

        //remove greeting before editing
        const html = tag(backup.replace(Store.load("WelcomeMessage", ""), ""));

        debugLogger.log({ backup, html });

        if (html.indexOf("<textarea") > -1) return; //don't want to create a new textarea inside this one!

        const area = document.createElement("textarea");
        area.value = HTMLtoMarkdown(html);

        // Disable quick-insert while editing.
        popup.querySelectorAll<HTMLElement>(".quick-insert").forEach(hide);

        // Disable insert while editing.
        disable(`#${Store.prefix}-submit`);

        area.addEventListener("change", ({ target }) => {
            const { id, value } = <HTMLTextAreaElement>target;
            el.innerHTML = saveComment(id, value);
            enable(`#${Store.prefix}-submit`);
        });

        //save/cancel links to add to textarea
        const actions = document.createElement("div");
        actions.classList.add("actions");

        const cancel = makeButton("cancel", "cancel edit");
        cancel.addEventListener("click", () => {
            popup.querySelectorAll<HTMLElement>(".quick-insert").forEach(show);
            el.innerHTML = backup;
            area.remove();
            actions.remove();
        });

        actions.append(cancel);
        el.append(area, actions);
    };

    /**
     * @summary Empty all custom comments from storage and rewrite to ui
     * @returns {void}
     */
    const resetComments = () => {
        Store.clear("name-");
        Store.clear("desc-");
        commentDefaults.forEach(({ Description, Name, Target }, index) => {
            const prefix = Target ? `[${Target.join(",")}] ` : "";
            Store.save("name-" + index, prefix + Name);
            Store.save("desc-" + index, Description);
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
            const name = Store.load<string>("name-" + i);
            const desc = Store.load<string>("desc-" + i);
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

            debugLogger.log({ acts, action, descr });

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

            debugLogger.log({ action, radio });

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
            debugLogger.log({ currView, viewId, event });
            if (currView !== viewId) return;
            insertHandler(event);
            selectHandler(event);
        });

        popup.addEventListener("keyup", (event) => {
            if (event.code !== "Enter" || currView !== viewId) return;
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

        if (!numComments) resetComments();

        const ul = popup.querySelector(".action-list")!;

        empty(ul);

        const comments = loadComments(numComments);

        const greet = Store.load("ShowGreeting", false);
        const welcome = Store.load("WelcomeMessage", "");
        const greeting = greet ? welcome : "";

        const userId = getLoggedInUserId();

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
     * @param {string} filterSel filter button selector
     * @returns {void}
     */
    const setupSearchHandlers = (popup: HTMLElement, filterSel: string) => {
        const sbox = popup.querySelector<HTMLElement>(".searchbox")!;
        const stext = sbox.querySelector<HTMLInputElement>(".searchfilter")!;
        const kicker = popup.querySelector(filterSel)!;
        const storageKey = "showFilter";

        const showHideFilter = () => {
            const shown = Store.load(storageKey, false);

            if (shown) {
                show(sbox);
                stext.focus();
            } else {
                hide(sbox);
                stext.innerHTML = "";
                filterOn(popup, "");
            }

            Store.save(storageKey, shown);
        };

        showHideFilter();

        kicker.addEventListener("click", () => {
            Store.toggle(storageKey);
            showHideFilter();
            return false;
        });

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
     * @returns {Promise<object>} response
     */
    const getJSONP = <T>(url: string): Promise<T> =>
        new Promise((resolve, reject) => {
            const cbkName = `jsonp-${Date.now()}`;

            const uri = new URL(url);
            uri.searchParams.append("callback", cbkName);

            const script = document.createElement("script");
            script.src = uri.toString();
            script.async = true;

            window[cbkName] = (json: T) => {
                script.remove();
                delete window[cbkName];
                resolve(json);
            };

            script.addEventListener("error", ({ error }) => {
                script.remove();
                delete window[cbkName];
                reject(error);
            });

            document.body.append(script);
        });

    type CommentInfo = { name: string; description: string };

    //TODO: test out the change
    //customise welcome
    //reverse compatible!
    const loadFromRemote = async (
        url: string,
        success: (...args: any[]) => any,
        error: (err: Error) => unknown
    ) => {
        try {
            const data = await getJSONP<CommentInfo[]>(url);

            debugLogger.log({ data });

            Store.save("commentcount", data.length);
            Store.clear("name-");
            Store.clear("desc-");
            data.forEach(({ name, description }, i) => {
                Store.save("name-" + i, name);
                Store.save("desc-" + i, markdownToHTML(description));
            });
            success();
        } catch (err) {
            error(err);
        }
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
        debugLogger.log({ target, postType });

        const popup = makePopup(target, postType);

        if (!popup.isConnected) document.body.append(popup);

        showPopup(popup);

        //TODO: if popup is created only once, listeners should be setup only once
        [updateComments].forEach((initiator) => initiator(popup, postType));

        //Auto-load from remote if required
        if (!window.VersionChecked && Store.load("AutoRemote") == "true") {
            var throbber = document.getElementById("throbber2")!;
            show(throbber);
            loadFromRemote(
                Store.load("RemoteUrl"),
                () => {
                    updateComments(popup, postType);
                    hide(throbber);
                },
                ({ message }: Error) => notify(popup, "Problem", message)
            );
        }

        center(popup);

        StackExchange.helpers.bindMovablePopups();

        //Get user info and inject
        const userid = getUserId(target);

        const userInfoEl = document.getElementById("userinfo")!;

        const uinfo = await getUserInfo(userid);

        debugLogger.log({ uinfo, userid });

        if (!uinfo) return fadeOut(userInfoEl);

        addUserInfo(userInfoEl, uinfo);

        //We only actually perform the updates check when someone clicks, this should make it less costly, and more timely
        //also wrap it so that it only gets called the *FIRST* time we open this dialog on any given page (not much of an optimisation).
        if (typeof checkForNewVersion == "function" && !window.VersionChecked) {
            checkForNewVersion(popup);
            window.VersionChecked = true;
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

            debugLogger.log({ injectNextTo, placeIn, injector });

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
