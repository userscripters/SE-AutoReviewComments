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

type Placement = readonly [insert: HTMLElement | null, place: HTMLElement];

type Locator<T extends HTMLElement = HTMLElement> = (where: T) => Placement;

type Notifier = (newVersion: string, oldVersion: string) => void;

type Actor = (...args: any[]) => any;

type Injector = (
    injected: HTMLElement,
    placed: HTMLElement,
    action: Actor
) => void;

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

(() => {
    const styleRegistry = new WeakMap();

    /**
     * @summary centers the element
     * @param {HTMLElement} element
     * @returns {HTMLElement}
     */
    const center = (element: HTMLElement) => {
        const { style } = element;
        const update: Partial<CSSStyleDeclaration> = {
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "48%",
            height: "59%",
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
        const {
            style,
            style: { display },
        } = element;
        style.display = "none";
        styleRegistry.set(element, display);
        return element;
    };

    /**
     * @summary shows an element
     * @param {HTMLElement}
     * @returns {HTMLElement}
     */
    const show = (element: HTMLElement) => {
        const oldDisplay = styleRegistry.get(element);
        if (!oldDisplay) return element;
        const { style } = element;
        style.display = oldDisplay;
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
    const siblings = <T extends Element>(
        el: HTMLElement,
        selector?: string
    ) => {
        const found: T[] = [];
        let current: T | null = null;
        while ((current = <T>el.nextElementSibling)) found.push(current);
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
     * @param {number} [speed]
     * @param {number} [min]
     * @returns {Promise<HTMLElement>}
     */
    const fadeTo = async (element: HTMLElement, speed = 200, min = 0) => {
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

        return element;
    };

    /**
     * @summary fades out an element
     * @param {HTMLElement} el
     * @param {number} [speed]
     */
    const fadeOut = (el: HTMLElement, speed = 200) => fadeTo(el, speed);

    const CONFIG = {
        postType: "",
    };

    StackExchange.ready(() => {
        const VERSION = "{{VERSION}}";
        const RAW_URL = "{{RAW_URL}}";
        const GITHUB_URL = "{{GITHUB_URL}}";
        const STACKAPPS_URL = "{{STACKAPPS_URL}}";
        const API_VER = "{{API_VER}}";
        const FILTER_UNSAFE = "{{FILTER_UNSAFE}}";

        // Self Updating Userscript, see https://gist.github.com/Benjol/874058
        if (typeof window.ARC_AutoUpdate === "function")
            return window.ARC_AutoUpdate(VERSION);

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
            const LastUpdateCheckDay = load("LastUpdateCheckDay");

            if (!LastUpdateCheckDay) {
                //first time visitor
                ShowMessage(
                    popup,
                    "Please read this!",
                    `Thank you for installing this script.
                    Please note that you can edit the texts inline by double-clicking them.
                    For other options, please see the README at <a href="${GITHUB_URL}" target="_blank">here</a>.`
                );
            } else if (LastUpdateCheckDay != today) {
                updateCheck((newVersion: string, installURL: string) => {
                    if (newVersion == load("LastVersionAcknowledged")) return;

                    ShowMessage(
                        popup,
                        "New Version!",
                        `A new version (${newVersion}) of the <a href="${STACKAPPS_URL}">AutoReviewComments</a> userscript is now available, see the <a href="${GITHUB_URL}/releases">release notes</a> for details or <a href="${installURL}">click here</a> to install now.`,
                        () => save("LastVersionAcknowledged", newVersion)
                    );
                });
            }

            save("LastUpdateCheckDay", today);
        };

        const site = window.location.hostname;

        const sitename = (StackExchange.options.site.name || "").replace(
            / ?Stack Exchange/,
            ""
        ); //same for others ("Android Enthusiasts Stack Exchange", SR, and more);

        const username = "user";
        const OP = "OP";
        const prefix = "AutoReviewComments-"; //prefix to avoid clashes in localstorage
        const myuserid = getLoggedInUserId();

        if (!load("WelcomeMessage"))
            save("WelcomeMessage", `Welcome to ${sitename}! `);

        const greeting =
            load("WelcomeMessage") == "NONE" ? "" : load("WelcomeMessage");

        const showGreeting = false;

        // These are injection markers and MUST use single-quotes.
        // The injected strings use double-quotes themselves, so that would result in parser errors.

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
                    padding:15px 15px 10px
                }`,
                `.${arc}.popup .float-left{
                    float:left
                }`,
                `.${arc}.popup .float-right{
                    float:right
                }`,
                `.${arc}.popup .throbber{
                    display:none
                }`,
                `.${arc}.popup .remoteerror{
                    color:red}`,
                `.${arc}.popup>div>textarea{
                    width:100%;height:442px
                }`,
                `.${arc}.popup .main{
                    overflow:hidden
                }`,
                `.${arc}.popup .main .userinfo{
                    padding:5px;margin-bottom:7px;background:#eaefef
                }`,
                `.${arc}.popup .main .action-list{
                    height:440px;margin:0 0 7px 0 !important;overflow-y:auto
                }`,
                `.${arc}.popup .main .action-list li{
                    width:100%;padding:0;transition:.1s
                }`,
                `.${arc}.popup .main .action-list li:hover{
                    background-color:#f2f2f2
                }`,
                `.${arc}.popup .main .action-list li.action-selected:hover{
                    background-color:#e6e6e6
                }`,
                `.${arc}.popup .main .action-list li input{
                    display:none
                }`,
                `.${arc}.popup .main .action-list li label{
                    position:relative;display:block;padding:10px
                }`,
                `.${arc}.popup .main .action-list li label .action-name{
                    display:block;
                    margin-bottom:3px;
                    cursor:default;
                }`,
                `.${arc}.popup .main .action-list li label .action-desc{
                    margin:0;color:#888;cursor:default
                }`,
                `.${arc}.popup .main .action-list li label .action-name textarea,
                .auto-review-comments.popup .main .action-list li label .action-desc textarea{
                    width:99%;margin:0 0 -4px 0
                }`,
                `.${arc}.popup .main .action-list li label .action-desc textarea{
                    height:42px}`,
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
                    display:block}`,
                `.${arc}.popup .main .action-list li label .quick-insert:hover{
                    background-color:#222;
                    color:#fff
                }`,
                `.${arc}.popup .main .share-tip{
                    display:none
                }`,
                `.${arc}.popup .main .share-tip .customwelcome{
                    width:300px
                }`,
                `.${arc}.popup .main .share-tip .remoteurl{
                    display:block;width:400px
                }`,
                `.${arc}.popup .actions,.auto-review-comments.popup .main .popup-actions .actions{
                    margin:6px
                }`,
                `.${arc}.popup .main .popup-actions .popup-submit{float:none;margin:0 0 5px 0}`,
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
                `.${arc}.popup .main .searchbox{display:none}`,
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
        const makeButton = (
            text: string,
            title: string,
            ...classes: string[]
        ) => {
            const cancelBtn = document.createElement("a");
            cancelBtn.classList.add(...classes);
            cancelBtn.textContent = text;
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

            const btn = makeButton("&#215;", "close this popup (or hit Esc)");

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
         * @summary makes popup action list
         * @returns {HTMLElement}
         */
        const makePopupActions = () => {
            const wrap = document.createElement("div");
            wrap.classList.add("popup-actions");

            const actionsWrap = document.createElement("div");
            actionsWrap.classList.add("float-left", "actions");

            const submitWrap = document.createElement("div");
            submitWrap.classList.add("float-right");

            const submitBtn = document.createElement("input");
            submitBtn.classList.add("popup-submit");
            submitBtn.type = "button";
            submitBtn.disabled = true;
            submitBtn.value = "Insert";

            submitWrap.append(submitBtn);

            const cancelBtn = makeButton(
                "cancel",
                "close this popup (or hit Esc)",
                "popup-actions-cancel"
            );

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

            const errSpan = document.createElement("span");
            errSpan.classList.add("remoteerror");
            errSpan.id = "remoteerror2";

            const welcomeBtn = makeButton(
                "welcome",
                "configure welcome",
                "popup-actions-welcome"
            );

            const sep = makeSeparator();

            const actionsList = [
                cancelBtn,
                sep,
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
                errSpan,
                sep.cloneNode(),
                welcomeBtn,
            ];

            actionsWrap.append(...actionsList);
            wrap.append(actionsWrap, submitWrap);
            return wrap;
        };

        /**
         * @summary makes active pane
         * @param {string} id
         * @returns {HTMLElement}
         */
        const makeActivePopup = (id: string) => {
            const wrap = document.createElement("div");
            wrap.classList.add("popup-active-pane");

            const uinfo = document.createElement("div");
            uinfo.classList.add("userinfo");
            uinfo.id = id;

            const image = makeImage(
                "dots",
                "https://sstatic.net/img/progress-dots.gif",
                "userinfo"
            );

            uinfo.append(image);

            const searchWrap = document.createElement("div");
            searchWrap.classList.add("searchbox");

            const search = document.createElement("input");
            search.classList.add("searchfilter");
            search.type = "search";
            search.placeholder = "filter the comments list";

            searchWrap.append(search);

            const actions = document.createElement("ul");
            actions.classList.add("action-list");

            wrap.append(uinfo, searchWrap, actions);
            return wrap;
        };

        /**
         * @summary makes welcome popup
         * @param {string} id
         * @returns {HTMLElement}
         */
        const makeWelcomePopup = (id: string) => {
            const wrap = document.createElement("div");
            wrap.classList.add("share-tip");
            wrap.id = id;

            const text = document.createTextNode(
                'setup "welcome" message (empty=none):'
            );

            wrap.append(text);

            const welcomeWrap = document.createElement("div");

            const input = document.createElement("input");
            input.classList.add("customwelcome");
            input.type = "text";
            input.id = "customwelcome";

            welcomeWrap.append(input);

            const actionsWrap = document.createElement("div");
            actionsWrap.classList.add("float-right");

            const sep = makeSeparator();

            const actions = [
                makeButton("force", "force", "welcome-force"),
                sep,
                makeButton("save", "save", "welcome-save"),
                sep.cloneNode(),
                makeButton("cancel", "cancel", "welcome-cancel"),
            ];

            actionsWrap.append(...actions);

            wrap.append(welcomeWrap, actionsWrap);
            return wrap;
        };

        /**
         * @summary creates the popup markup
         * @returns {HTMLElement}
         */
        const makePopup = () => {
            const popup = document.createElement("div");
            popup.classList.add("auto-review-comments", "popup");

            const close = makeCloseBtn("close");

            const header = document.createElement("h2");
            header.classList.add("handle");
            header.textContent = "Which review comment to insert?";

            const main = document.createElement("div");
            main.classList.add("main");
            main.id = "main";

            const markup = `
                <div class="share-tip" id="remote-popup">
                    enter url for remote source of comments (use import/export to create jsonp)
                    <input class="remoteurl" id="remoteurl" type="text"/>
                    <img class="throbber" id="throbber1" src="//sstatic.net/img/progress-dots.gif"/>
                    <span class="remoteerror" id="remoteerror1"></span>
                    <div class="float-left">
                        <input type="checkbox" id="remoteauto"/>
                        <label title="get from remote on every page refresh" for="remoteauto">auto-get</label>
                    </div>
                    <div class="float-right">
                        <a class="remote-get">get now</a>
                        <span class="lsep"> | </span>
                        <a class="remote-save">save</a>
                        <span class="lsep"> | </span>
                        <a class="remote-cancel">cancel</a>
                    </div>
                </div>
                `;

            main.append(
                makeActivePopup("userinfo"),
                makeRemotePopup(),
                makeWelcomePopup("welcome-popup"),
                makePopupActions()
            );

            popup.append(close, header, main);

            return popup;
        };

        /**
         * @summary makes a notification announcement
         * @param {string} title
         * @param {string} message
         * @returns {HTMLElement}
         */
        const makeAnnouncement = (title: string, message: string) => {
            const wrap = document.createElement("div");
            wrap.classList.add("auto-review-comments", "announcement");
            wrap.id = "announcement";

            const close = document.createElement("span");
            close.classList.add("notify-close");

            const dismissal = document.createElement("a");
            dismissal.title = "dismiss this notification";
            dismissal.textContent = "x";

            close.append(dismissal);

            wrap.append(close, b(title), text(message));
            return wrap;
        };

        const makeOption = (id: string, name: string, desc: string) => {
            const li = document.createElement("li");

            const reviewRadio = document.createElement("input");
            reviewRadio.id = `comment-${id}`;
            reviewRadio.type = "radio";
            reviewRadio.name = "commentreview";

            const lbl = document.createElement("label");
            lbl.htmlFor = reviewRadio.id;

            const nameEl = document.createElement("span");
            nameEl.classList.add("action-name");
            nameEl.id = `name-${id}`;
            nameEl.textContent = name;

            const descEl = document.createElement("span");
            descEl.classList.add("action-desc");
            descEl.id = `desc-${id}`;
            descEl.textContent = desc;

            const insertBtn = document.createElement("button");
            insertBtn.classList.add("quick-insert");
            insertBtn.textContent = "↓";
            insertBtn.title = "Insert now";

            lbl.append(nameEl, descEl, insertBtn);
            li.append(reviewRadio, lbl);

            return li;
        };

        /**
         * All the different "targets" a comment can be placed on.
         * The given values are used as prefixes in the comment titles, to make it easy for the user to change the targets,
         * by simply adding the prefix to their comment title.
         */
        var Target = {
            // A regular expression to match the possible targets in a string.
            MATCH_ALL: new RegExp("\\[(E?[AQ]|C)(?:,(E?[AQ]|C))*\\]"),
            Closure: "C",
            CommentQuestion: "Q",
            CommentAnswer: "A",
            EditSummaryAnswer: "EA",
            EditSummaryQuestion: "EQ",
        };

        //default comments
        var defaultcomments = [
            {
                Target: [Target.CommentQuestion],
                Name: "More than one question asked",
                Description:
                    "It is preferred if you can post separate questions instead of combining your questions into one. That way, it helps the people answering your question and also others hunting for at least one of your questions. Thanks!",
            },
            {
                Target: [Target.CommentQuestion],
                Name: "Duplicate Closure",
                Description:
                    "This question will probably be closed as a duplicate soon. If the answers from the duplicates don't fully address your question please edit it to include why and flag this for re-opening. Thanks!",
            },
            {
                Target: [Target.CommentAnswer],
                Name: "Answers just to say Thanks!",
                Description:
                    'Please don\'t add "thanks" as answers. Invest some time in the site and you will gain sufficient <a href="//$SITEURL$/privileges">privileges</a> to upvote answers you like, which is the $SITENAME$ way of saying thank you.',
            },
            {
                Target: [Target.CommentAnswer],
                Name: "Nothing but a URL (and isn't spam)",
                Description:
                    'Whilst this may theoretically answer the question, <a href="//meta.stackexchange.com/q/8259">it would be preferable</a> to include the essential parts of the answer here, and provide the link for reference.',
            },
            {
                Target: [Target.CommentAnswer],
                Name: "Requests to OP for further information",
                Description:
                    "This is really a comment, not an answer. With a bit more rep, <a href=\"//$SITEURL$/privileges/comment\">you will be able to post comments</a>. For the moment I've added the comment for you, and I'm flagging this post for deletion.",
            },
            {
                Target: [Target.CommentAnswer],
                Name: "OP using an answer for further information",
                Description:
                    "Please use the <em>Post answer</em> button only for actual answers. You should modify your original question to add additional information.",
            },
            {
                Target: [Target.CommentAnswer],
                Name: "OP adding a new question as an answer",
                Description:
                    'If you have another question, please ask it by clicking the <a href="//$SITEURL$/questions/ask">Ask Question</a> button.',
            },
            {
                Target: [Target.CommentAnswer],
                Name: 'Another user adding a "Me too!"',
                Description:
                    'If you have a NEW question, please ask it by clicking the <a href="//$SITEURL$/questions/ask">Ask Question</a> button. If you have sufficient reputation, <a href="//$SITEURL$/privileges/vote-up">you may upvote</a> the question. Alternatively, "star" it as a favorite and you will be notified of any new answers.',
            },
            {
                Target: [Target.Closure],
                Name: "Too localized",
                Description:
                    "This question appears to be off-topic because it is too localized.",
            },
            {
                Target: [Target.EditSummaryQuestion],
                Name: "Improper tagging",
                Description:
                    'The tags you were using are not appropriate for this question. Please review <a href="//$SITEURL$/help/tagging">What are tags, and how should I use them?</a>',
            },
        ];

        var weekday_name = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        var minute = 60,
            hour = 3600,
            day = 86400,
            sixdays = 518400,
            week = 604800,
            month = 2592000,
            year = 31536000;

        //Wrap local storage access so that we avoid collisions with other scripts
        function load(key: string) {
            return localStorage[prefix + key];
        }
        function save(key: string, val: string | number | boolean) {
            localStorage[prefix + key] = val;
        }
        function RemoveStorage(key: string) {
            localStorage.removeItem(prefix + key);
        }
        function ClearStorage(startsWith: string) {
            for (var i = localStorage.length - 1; i >= 0; i--) {
                var key = localStorage.key(i)!;
                if (key.indexOf(prefix + startsWith) == 0)
                    localStorage.removeItem(key);
            }
        }

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
            else if (elapsedSeconds < day + nowseconds)
                strout = "since yesterday";
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
                strout =
                    "for " + Math.round(elapsedSeconds / month) + " months";
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
        function getLoggedInUserId() {
            const { options: { user: { userId } = {} } = {} } = StackExchange;
            return userId || "";
        }

        /**
         * @summary shows a message
         * @param {HTMLElement} popup
         * @param {string} title
         * @param {string} body
         * @param {Function} [callback]
         * @returns {void}
         */
        const ShowMessage = (
            popup: HTMLElement,
            title: string,
            body: string,
            callback?: (...args: any[]) => void
        ) => {
            const html = body.replace(/\n/g, "<BR/>");

            //TODO: replace HTML with text as makeAnnouncement uses textContent
            const message = makeAnnouncement(title, html);

            message.addEventListener("click", ({ target }) => {
                if (!(<HTMLElement>target).matches(".notify-close")) return;

                const { parentElement } = <HTMLElement>target;

                fadeOut(parentElement!);
                parentElement!.remove();

                typeof callback === "function" && callback();
            });

            popup.querySelector("h2")!.before(message);
        };

        /**
         * @summary gets user Id
         * @returns {string}
         */
        const getUserId = () => {
            const { href } = document.querySelector<HTMLAnchorElement>(
                ".post-signature .user-info a"
            )!;
            const [, uid] = href.match(/posts\/(\d+)\//) || [];
            return uid || "";
        };

        /**
         * @summary checks if the user is new
         * @param {number} date
         * @returns {boolean}
         */
        const isNewUser = (date: number) => Date.now() / 1000 - date < week;

        /**
         * @summary
         * @returns {string}
         */
        const getOP = () => {
            const question = document.getElementById("question")!;

            const userlink = question.querySelector(
                ".owner .user-details > a:not([id])"
            );

            if (userlink) return userlink.textContent || "";

            const deletedUser = question.querySelector(".owner .user-details");
            return deletedUser ? deletedUser.textContent || "" : "";
        };

        type StackAPIBatchResponse<T> = {
            has_more: boolean;
            items: T[];
            quota_max: number;
            quota_remaining: number;
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
            strong.textContent = text;
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
            a.textContent = label;
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
                showGreeting = true;
                container.querySelector(".action-desc")?.prepend(greeting);
            }

            const userLink = link(`/users/${user_id}`, "");
            userLink.append(b(display_name));

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
        async function getUserInfo(userid: string) {
            const API_KEY = "5J)5cHN9KbyhE9Yf9S*G)g((";

            const url = new URL(
                `api.stackexchange.com/${API_VER}/users/${userid}`
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
        }

        /**
         * @summary makes a separator <span>
         * @returns {HTMLSpanElement}
         */
        const makeSeparator = () => {
            const lsep = document.createElement("span");
            lsep.classList.add("lsep");
            lsep.textContent = " | ";
            return lsep;
        };

        //Show textarea in front of popup to import/export all comments (for other sites or for posting somewhere)
        function ImportExport(popup: HTMLElement) {
            const tohide = document.getElementById("main")!;

            const wrap = document.createElement("div");

            const actionWrap = document.createElement("div");
            actionWrap.classList.add("actions");

            const txtArea = document.createElement("textarea");

            const jsonpBtn = document.createElement("a");
            jsonpBtn.classList.add("jsonp");

            const saveBtn = document.createElement("a");
            saveBtn.classList.add("save");

            const cancelBtn = document.createElement("a");
            cancelBtn.classList.add("cancel");

            actionWrap.append(
                jsonpBtn,
                makeSeparator(),
                saveBtn,
                makeSeparator(),
                cancelBtn
            );

            //TODO: <div> & <textarea> same level??
            wrap.append(txtArea, actionWrap);

            const { style } = tohide;

            //Painful, but shortest way I've found to position div over the tohide element
            Object.assign(wrap.style, {
                position: "absolute",
                left: style.left, //tohide.position().left,
                top: style.top, //tohide.position().top,
                width: style.width,
                height: style.height,
                background: "white",
            });

            var txt = "";
            for (var i = 0; i < load("commentcount"); i++) {
                var name = load("name-" + i);
                var desc = load("desc-" + i);
                txt += "###" + name + "\n" + htmlToMarkDown(desc) + "\n\n"; //the leading ### makes prettier if pasting to markdown, and differentiates names from descriptions
            }

            txtArea.value = txt;

            jsonpBtn.addEventListener("click", () => {
                var txt = "callback(\n[\n";
                for (var i = 0; i < load("commentcount"); i++) {
                    txt +=
                        '{ "name": "' +
                        load("name-" + i) +
                        '", "description": "' +
                        load("desc-" + i).replace(/"/g, '\\"') +
                        '"},\n\n';
                }

                txtArea.value = txt + "]\n)";

                wrap.querySelector("a:lt(2)")?.remove();
                wrap.querySelector(".lsep:lt(2)")?.remove();
            });

            cancelBtn.addEventListener("click", async () => {
                await fadeOut(wrap);
                wrap.remove();
            });

            saveBtn.addEventListener("click", async () => {
                DoImport(txtArea.value);
                WriteComments(popup);
                await fadeOut(wrap);
                wrap.remove();
            });

            popup.append(wrap);
        }

        //Import complete text into comments
        function DoImport(text: string) {
            //clear out any existing stuff
            ClearStorage("name-");
            ClearStorage("desc-");
            var arr = text.split("\n");
            var nameIndex = 0,
                descIndex = 0;
            for (var i = 0; i < arr.length; i++) {
                var line = arr[i].trim();
                if (line.indexOf("#") == 0) {
                    var name = line.replace(/^#+/g, "");
                    save("name-" + nameIndex, name);
                    nameIndex++;
                } else if (line.length > 0) {
                    var desc = markDownToHtml(line);
                    save("desc-" + descIndex, Tag(desc));
                    descIndex++;
                }
            }
            //This is de-normalised, but I don't care.
            save("commentcount", Math.min(nameIndex, descIndex));
        }

        // From https://stackoverflow.com/a/12034334/259953
        var entityMapToHtml: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
        };
        var entityMapFromHtml: Record<string, string> = {
            "&amp;": "&",
            "&lt;": "<",
            "&gt;": ">",
        };

        function escapeHtml(html: string) {
            return String(html).replace(/[&<>]/g, function (s) {
                return entityMapToHtml[s];
            });
        }

        function unescapeHtml(html: string) {
            return Object.keys(entityMapFromHtml).reduce(function (
                result,
                entity
            ) {
                return result.replace(new RegExp(entity, "g"), function (s) {
                    return entityMapFromHtml[s];
                });
            },
            String(html));
        }

        function htmlToMarkDown(html: string) {
            var markdown = html
                .replace(/<a href="(.+?)">(.+?)<\/a>/g, "[$2]($1)")
                .replace(/<em>(.+?)<\/em>/g, "*$1*")
                .replace(/<strong>(.+?)<\/strong>/g, "**$1**");
            return unescapeHtml(markdown);
        }

        function markDownToHtml(markdown: string) {
            var html = escapeHtml(markdown).replace(
                /\[([^\]]+)\]\((.+?)\)/g,
                '<a href="$2">$1</a>'
            );
            return html
                .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*([^`]+?)\*/g, "<em>$1</em>");
        }

        function UnTag(text: string) {
            return text
                .replace(/\$SITENAME\$/g, sitename)
                .replace(/\$SITEURL\$/g, site)
                .replace(/\$MYUSERID\$/g, myuserid);
        }

        function Tag(html: string) {
            //put tags back in
            var regname = new RegExp(sitename, "g"),
                regurl = new RegExp("//" + site, "g"),
                reguid = new RegExp("/" + myuserid + "[)]", "g");
            return html
                .replace(regname, "$SITENAME$")
                .replace(regurl, "//$SITEURL$")
                .replace(reguid, "/$MYUSERID$)");
        }

        const disable = (selector: string) =>
            (document.querySelector<HTMLButtonElement>(selector)!.disabled =
                true);

        const enable = (selector: string) =>
            (document.querySelector<HTMLButtonElement>(selector)!.disabled =
                false);

        /**
         * @summary Replace contents of element with a textarea (containing markdown of contents), and save/cancel buttons
         */
        function ToEditable(el: HTMLElement) {
            var backup = el.innerHTML;
            var html = Tag(backup.replace(greeting, "")); //remove greeting before editing..
            if (html.indexOf("<textarea") > -1) return; //don't want to create a new textarea inside this one!

            const area = document.createElement("textarea");
            area.value = htmlToMarkDown(html);

            // Disable quick-insert while editing.
            siblings<HTMLElement>(el, ".quick-insert").forEach(hide);

            // Disable insert while editing.
            disable(".popup-submit");

            BorkFor(el); //this is a hack
            //save/cancel links to add to textarea
            const actions = document.createElement("div");
            actions.classList.add("actions");

            const save = document.createElement("a");
            save.addEventListener("click", (event) => {
                event.preventDefault(); //TODO: check if needed

                const { parentElement } = save;

                SaveEditable(parentElement!.parentElement!);
                UnborkFor(el);
            });

            const sep = document.createElement("span");
            sep.classList.add("lsep");

            const cancel = document.createElement("a");
            cancel.addEventListener("click", (event) => {
                event.preventDefault(); //TODO: check if needed

                siblings<HTMLElement>(el, ".quick-insert").forEach(show);

                enable(".popup-submit");

                const { parentElement } = cancel;

                CancelEditable(parentElement!.parentElement!, backup);
                UnborkFor(el);
            });

            actions.append(save, sep, cancel);
            el.append(area, actions);
        }

        //This is to stop the input pinching focus when I click inside textarea
        //Could have done something clever with contentEditable, but this is evil, and it annoys Yi :P
        function BorkFor(el: HTMLElement) {
            var label = el.closest("label")!;
            label.htmlFor = "borken";
        }
        function UnborkFor(el: HTMLElement) {
            var label = el.closest("label")!;
            const { previousElementSibling } = label;
            label.htmlFor = previousElementSibling!.id;
        }
        //Save textarea contents, replace element html with new edited content
        function SaveEditable(el: HTMLElement) {
            var html = markDownToHtml(el.querySelector("textarea")!.value);
            save(el.id, Tag(html));
            el.innerHTML = (showGreeting ? greeting : "") + UnTag(html);
        }

        function CancelEditable(el: HTMLElement, backup: string) {
            el.innerHTML = backup;
        }

        /**
         * @summary Empty all custom comments from storage and rewrite to ui
         */
        function ResetComments() {
            ClearStorage("name-");
            ClearStorage("desc-");
            defaultcomments.forEach(function (value, index) {
                var targetsPrefix = "";
                if (value.Target) {
                    var targets = value.Target.join(",");
                    targetsPrefix = "[" + targets + "] ";
                }
                save("name-" + index, targetsPrefix + value["Name"]);
                save("desc-" + index, value["Description"]);
            });
            save("commentcount", defaultcomments.length);
        }

        /**
         * TODO: rework once moved to config object
         * @summary loads comments from storage
         * @param {number} numComments
         * @returns {{ name: string; desc: string }[]}
         */
        const loadComments = (numComments: number) => {
            const comments: { name: string; desc: string }[] = [];
            for (var i = 0; i < numComments; i++) {
                const name = load("name-" + i);
                const desc = load("desc-" + i);
                comments.push({ name, desc });
            }
            return comments;
        };

        /**
         * @summary rewrite all comments to ui (typically after import or reset)
         * @param {HTMLElement} popup
         */
        function WriteComments(popup: HTMLElement) {
            const numComments = load("commentcount");

            if (!numComments) ResetComments();

            const ul = popup.querySelector(".action-list")!;

            empty(ul);

            const { postType } = CONFIG;

            const comments = loadComments(numComments);

            const listItems = comments
                .filter(({ name }) => IsCommentValidForPostType(name, postType))
                .map(({ name, desc }, i) => {
                    const cname = name.replace(Target.MATCH_ALL, "");

                    var descr = desc
                        .replace(/\$SITENAME\$/g, sitename)
                        .replace(/\$SITEURL\$/g, site)
                        .replace(/\$MYUSERID\$/g, myuserid)
                        .replace(/\$/g, "$$$");

                    const optionElement = makeOption(
                        i.toString(),
                        cname.replace(/\$/g, "$$$"),
                        (showGreeting ? greeting : "") + descr
                    );

                    const descrEl =
                        optionElement.querySelector(".action-desc")!;
                    descrEl.innerHTML = descr;

                    return optionElement;
                });

            ul.append(...listItems);

            ShowHideDescriptions(popup);
            AddOptionEventHandlers(popup);
            AddSearchEventHandlers(popup);
        }

        /**
         * @summary Checks if a given comment could be used together with a given post type.
         * @param {string} comment The comment itself.
         * @param {Target} postType The type of post the comment could be placed on.
         * @return {boolean} true if the comment is valid for the type of post; false otherwise.
         */
        function IsCommentValidForPostType(comment: string, postType: string) {
            const designator = comment.match(Target.MATCH_ALL);
            return designator ? -1 < designator.indexOf(postType) : true;
        }

        function AddOptionEventHandlers(popup: HTMLElement) {
            popup.addEventListener("dblclick", ({ target }) => {
                if (!(<HTMLElement>target).matches(".action-desc")) return;
                ToEditable(<HTMLElement>target);
            });

            popup.addEventListener("click", ({ target }) => {
                if (!(<HTMLElement>target).matches("label > .quick-insert"))
                    return;

                var { parentElement } = <HTMLElement>target;
                var li = parentElement!.parentElement;
                var radio = (<HTMLElement>target).closest("input")!;

                // Mark action as selected.
                li!.classList.add("action-selected");

                radio.checked = true;

                popup
                    .querySelector<HTMLButtonElement>(".popup-submit")!
                    .click();
            });

            //add click handler to radio buttons
            popup.addEventListener("click", ({ target }) => {
                if (!target) return;

                popup.querySelector<HTMLButtonElement>(
                    ".popup-submit"
                )!.disabled = false;

                const selected = [
                    ...popup.querySelectorAll(".action-selected"),
                ];

                selected.forEach(({ classList }) =>
                    classList.remove("action-selected")
                );

                if (load("hide-desc") == "hide") {
                    const unselectedDescrs = [
                        ...popup.querySelectorAll<HTMLSpanElement>(
                            ":not(.action-selected) .action-desc"
                        ),
                    ];

                    unselectedDescrs.forEach(hide);
                }

                const action = (<HTMLElement>target).closest("li")!;
                const { classList } = action;
                classList.add("action-selected");

                const descr =
                    action.querySelector<HTMLElement>(".action-desc")!;

                show(descr);
            });

            popup.addEventListener("keyup", (event) => {
                if (event.code == "Enter") {
                    event.preventDefault();
                    popup.querySelector<HTMLElement>(".popup-submit")?.click();
                }
            });
        }

        function filterOn(popup: HTMLElement, text: string) {
            var words = text
                .toLowerCase()
                .split(/\s+/)
                .filter(function (word) {
                    return word.length > 0;
                });

            [
                ...popup.querySelectorAll<HTMLLIElement>(".action-list > li"),
            ].forEach((item) => {
                const name = item
                    .querySelector(".action-name")!
                    .textContent!.toLowerCase();
                const desc = item
                    .querySelector(".action-desc")!
                    .textContent!.toLowerCase();

                var isShow = true;

                //TODO: only last one counts??
                words.forEach((word) => {
                    isShow =
                        isShow &&
                        (name.indexOf(word) >= 0 || desc.indexOf(word) >= 0);
                });

                isShow ? show(item) : hide(item);
            });
        }

        function AddSearchEventHandlers(popup: HTMLElement) {
            var sbox = popup.querySelector<HTMLElement>(".searchbox")!,
                stext = sbox.querySelector<HTMLInputElement>(".searchfilter")!,
                kicker = popup.querySelector(".popup-actions-filter")!,
                storageKey = "showFilter",
                shown = load(storageKey) == "show";

            var showHideFilter = function () {
                if (shown) {
                    show(sbox);
                    stext.focus();
                    save(storageKey, "show");
                } else {
                    hide(sbox);
                    stext.textContent = "";
                    filterOn(popup, "");
                    save(storageKey, "hide");
                }
            };

            var filterOnText = function () {
                var { value } = stext;
                filterOn(popup, value);
            };

            showHideFilter();

            kicker.addEventListener("click", function () {
                shown = !shown;
                showHideFilter();

                return false;
            });

            const callback = () => setTimeout(filterOnText, 100);

            stext.addEventListener("keydown", callback);
            stext.addEventListener("change", callback);
            stext.addEventListener("cut", callback);
            stext.addEventListener("paste", callback);
            stext.addEventListener("search", callback);
        }

        //Adjust the descriptions so they show or hide based on the user's preference.
        function ShowHideDescriptions(popup: HTMLElement) {
            //get list of all descriptions except the currently selected one
            var descriptions = [
                ...popup.querySelectorAll<HTMLSpanElement>(
                    "ul.action-list li:not(.action-selected) span[id*='desc-']"
                ),
            ];

            const isHide = load("hide-desc") == "hide";
            descriptions.forEach((description) =>
                isHide ? hide(description) : show(description)
            );
        }

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

        //TODO: test out the change
        //customise welcome
        //reverse compatible!
        async function loadFromRemote(
            url: string,
            success: (...args: any[]) => any,
            error: (...args: any[]) => any
        ) {
            try {
                const data = await getJSONP<
                    { name: string; description: string }[]
                >(url);

                save("commentcount", data.length);
                ClearStorage("name-");
                ClearStorage("desc-");
                data.forEach(({ name, description }, i) => {
                    save("name-" + i, name);
                    save("desc-" + i, markDownToHtml(description));
                });
                success();
            } catch (err) {
                error(err);
            }
        }

        //Factored out from main popu creation, just because it's too long
        function SetupRemoteBox(popup: HTMLElement) {
            var remote = popup.querySelector<HTMLElement>("#remote-popup")!;
            var remoteerror = remote.querySelector("#remoteerror1");
            var urlfield =
                remote.querySelector<HTMLInputElement>("#remoteurl")!;
            var autofield =
                remote.querySelector<HTMLInputElement>("#remoteauto")!;
            var throbber = remote.querySelector<HTMLElement>("#throbber1")!;

            popup
                .querySelector(".popup-actions-remote")!
                .addEventListener("click", function () {
                    urlfield.value = load("RemoteUrl");
                    autofield.checked = load("AutoRemote") == "true";
                    show(remote);
                });

            popup
                .querySelector(".remote-cancel")!
                .addEventListener("click", function () {
                    hide(throbber);
                    remoteerror!.textContent = "";
                    hide(remote);
                });

            popup
                .querySelector(".remote-save")!
                .addEventListener("click", function () {
                    save("RemoteUrl", urlfield.value);
                    save("AutoRemote", autofield.checked);
                    hide(remote);
                });

            popup
                .querySelector(".remote-get")!
                .addEventListener("click", function () {
                    show(throbber);
                    loadFromRemote(
                        urlfield.value,
                        function () {
                            WriteComments(popup);
                            hide(throbber);
                        },
                        ({ message }: Error) =>
                            (remoteerror!.textContent = message)
                    );
                });
        }

        /**
         * @summary sets up a welcome box
         * @param {HTMLElement} popup
         * @returns {void}
         */
        function SetupWelcomeBox(popup: HTMLElement) {
            const welcome = document.getElementById("welcome-popup")!;
            const custom =
                welcome.querySelector<HTMLInputElement>("#customwelcome")!;

            popup
                .querySelector(".popup-actions-welcome")!
                .addEventListener("click", function () {
                    custom.value = greeting;
                    show(welcome);
                });

            popup
                .querySelector(".welcome-cancel")!
                .addEventListener("click", function () {
                    hide(welcome);
                });

            popup
                .querySelector(".welcome-force")!
                .addEventListener("click", function () {
                    showGreeting = true;
                    WriteComments(popup);
                    hide(welcome);
                });

            popup
                .querySelector(".welcome-save")!
                .addEventListener("click", function () {
                    const { value } = custom;
                    var msg = value || "NONE";
                    save("WelcomeMessage", msg);
                    greeting = value;
                    hide(welcome);
                });
        }

        addStyles();

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
        function attachAutoLinkInjector<T extends HTMLElement>(
            selector: string,
            locator: Locator<T>,
            injector: Injector,
            actor: Actor
        ) {
            /**
             * @summary The internal injector invokes the locator to find an element in relation to the trigger element and then invokes the injector on it.
             * @param {HTMLElement} trigger The element that triggered the mechanism.
             * @param {number} [retry=0] How often this operation was already retried. 20 retries will be performed in 50ms intervals.
             * @private
             */
            const _internalInjector = (trigger: T, retry: number) => {
                // If we didn't find the element after 20 retries, give up.
                if (20 <= retry) return;

                const [injectNextTo, placeCommentIn] = locator(trigger);

                // We didn't find it? Try again in 50ms.
                if (!injectNextTo) {
                    setTimeout(() => _internalInjector(trigger, retry + 1), 50);
                } else {
                    // Call our injector on the found element.
                    injector(injectNextTo, placeCommentIn, actor);
                }
            };

            const content = document.getElementById("content")!;
            content.addEventListener("click", ({ target }) => {
                if (!(<HTMLElement>target).matches(selector)) return;
                _internalInjector(<T>target, 0);
            });
        }

        attachAutoLinkInjector(
            ".js-add-link",
            findCommentElements,
            injectAutoLink,
            autoLinkAction
        );

        attachAutoLinkInjector(
            ".edit-post",
            findEditSummaryElements,
            injectAutoLinkEdit,
            autoLinkAction
        );

        attachAutoLinkInjector(
            ".close-question-link",
            findClosureElements,
            injectAutoLinkClosure,
            autoLinkAction
        );

        attachAutoLinkInjector(
            ".review-actions input:first",
            findReviewQueueElements,
            injectAutoLinkReviewQueue,
            autoLinkAction
        );

        /**
         * @description A locator for the help link next to the comment box under a post and the textarea for the comment.
         * @param {HTMLElement} where A DOM element, near which we're looking for the location where to inject our link.
         * @returns {Placement} The DOM element next to which the link should be inserted and the element into which the
         *                     comment should be placed.
         */
        function findCommentElements(where: HTMLElement): Placement {
            const { parentElement } = where;
            var { id } = parentElement!;

            const divId = id.replace("-link", "");

            const div = document.getElementById(divId)!;

            var injectNextTo = div.querySelector<HTMLElement>(
                ".js-comment-help-link"
            )!;
            var placeCommentIn = div.querySelector("textarea")!;
            return [injectNextTo, placeCommentIn];
        }

        /**
         * @summary A locator for the edit summary input box under a post while it is being edited.
         * @param {HTMLAnchorElement} where A DOM element, near which we're looking for the location where to inject our link.
         * @returns {Placement} The DOM element next to which the link should be inserted and the element into which the comment should be placed.
         */
        function findEditSummaryElements({
            href,
        }: HTMLAnchorElement): Placement {
            const [, divid] = href.match(/posts\/(\d+)\/edit/) || [];

            const { nextElementSibling } = document.getElementById(
                `post-editor-${divid}`
            )!;

            const placeIn =
                nextElementSibling!.querySelector<HTMLElement>(
                    ".edit-comment"
                )!;

            return [placeIn, placeIn];
        }

        /**
         * @summary A locator for the text area in which to put a custom off-topic closure reason in the closure dialog.
         * @param {HTMLElement} where A DOM element, near which we're looking for the location where to inject our link.
         * @returns {Placement} The DOM element next to which the link should be inserted and the element into which the
         *                     comment should be placed.
         */
        function findClosureElements(_where: HTMLElement): Placement {
            //TODO: why where is not used?
            const injectTo = document.querySelector<HTMLElement>(
                ".close-as-off-topic-pane textarea"
            )!;
            return [injectTo, injectTo];
        }

        /**
         * @summary A locator for the edit summary you get in the "Help and Improvement" review queue.
         * @param {HTMLElement} where A DOM element, near which we're looking for the location where to inject our link.
         * @returns {Placement} The DOM element next to which the link should be inserted and the element into which the
         *                     comment should be placed.
         */
        function findReviewQueueElements(_where: HTMLElement): Placement {
            const injectTo =
                document.querySelector<HTMLElement>(".text-counter")!;
            const placeIn =
                document.querySelector<HTMLElement>(".edit-comment")!;
            return [injectTo, placeIn];
        }

        /**
         * @summary
         * @param {Actor} what The function that will be called when the link is clicked.
         * @param {HTMLElement} next The DOM element next to which we'll place the link.
         * @param {HTMLElement} where The DOM element into which the comment should be placed.
         * @returns {HTMLAnchorElement}
         */
        const makeAutoLink = (
            callback: Actor,
            next: Parameters<Actor>[0],
            where: Parameters<Actor>[1]
        ) => {
            const alink = document.createElement("a");
            alink.classList.add("comment-auto-link");
            alink.textContent = "auto";
            alink.addEventListener("click", (ev) => {
                ev.preventDefault();
                callback(next, where);
            });
            return alink;
        };

        type PostType = "answer" | "question";

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
            const parentPost =
                where.closest(".answer") || where.closest(".question");
            if (!parentPost) return; //TODO: implement failure state handling

            const { classList } = parentPost;

            //if not found, we have a problem
            const [, tgt] = clsMap.find(([c]) => classList.contains(c)) || [];
            return tgt;
        };

        /**
         * @summary Inject the auto link next to the given DOM element.
         * @param {HTMLElement} where The DOM element next to which we'll place the link.
         * @param {HTMLElement} placeCommentIn The DOM element into which the comment should be placed.
         * @param {Actor} what The function that will be called when the link is clicked.
         * @returns {void}
         */
        function injectAutoLink(
            where: HTMLElement,
            placeCommentIn: HTMLElement,
            what: Actor
        ) {
            // Don't add auto links if one already exists
            const existingAutoLinks = siblings(where, ".comment-auto-link");
            if (existingAutoLinks.length) return;

            const clsMap: [PostType, string][] = [
                ["answer", Target.CommentAnswer],
                ["question", Target.CommentQuestion],
            ];
            const tgt = getTargetType(where, clsMap);

            const lsep = makeSeparator();
            const alink = makeAutoLink(what, placeCommentIn, tgt);
            where.after(lsep, alink);
        }

        /**
         * Inject the auto link next to the edit summary input box.
         * This will also slightly shrink the input box, so that the link will fit next to it.
         * @param {HTMLElement} where The DOM element next to which we'll place the link.
         * @param {HTMLElement} placeCommentIn The DOM element into which the comment should be placed.
         * @param {Actor} what The function that will be called when the link is clicked.
         * @returns {void}
         */
        function injectAutoLinkEdit(
            where: HTMLElement,
            placeCommentIn: HTMLElement,
            what: Actor
        ) {
            // Don't add auto links if one already exists
            var existingAutoLinks = siblings(where, ".comment-auto-link");
            if (existingAutoLinks.length) return;

            const { style } = where;
            style.width = "510px";

            const overs = siblings<HTMLElement>(where, ".actual-edit-overlay");
            overs.forEach(({ style }) => (style.width = "510px"));

            const clsMap: [PostType, string][] = [
                ["answer", Target.EditSummaryAnswer],
                ["question", Target.EditSummaryQuestion],
            ];
            const tgt = getTargetType(where, clsMap);

            const lsep = makeSeparator();
            const alink = makeAutoLink(what, placeCommentIn, tgt);
            where.after(lsep, alink);
        }
        /**
         * @summary Inject the auto link next to the given DOM element.
         * @param {HTMLElement} where The DOM element next to which we'll place the link.
         * @param {HTMLElement} placeCommentIn The DOM element into which the comment should be placed.
         * @param {Actor} what The function that will be called when the link is clicked.
         * @returns {void}
         */
        function injectAutoLinkClosure(
            where: HTMLElement,
            placeCommentIn: HTMLElement,
            what: Actor
        ) {
            // Don't add auto links if one already exists
            var existingAutoLinks = siblings(where, ".comment-auto-link");
            if (existingAutoLinks.length) return;

            const lsep = makeSeparator();
            const alink = makeAutoLink(what, placeCommentIn, Target.Closure);
            where.after(lsep, alink);
        }

        /**
         * @summary Inject hte auto link next to the "characters left" counter below the edit summary in the review queue.
         * @param {HTMLElement} where The DOM element next to which we'll place the link.
         * @param {HTMLElement} placeCommentIn The DOM element into which the comment should be placed.
         * @param {Actor} what The function that will be called when the link is clicked.
         */
        function injectAutoLinkReviewQueue(
            where: HTMLElement,
            placeCommentIn: HTMLElement,
            what: Actor
        ) {
            // Don't add auto links if one already exists
            var existingAutoLinks = siblings(where, ".comment-auto-link");
            if (existingAutoLinks.length) return;

            const lsep = makeSeparator();
            const alink = makeAutoLink(
                what,
                placeCommentIn,
                Target.EditSummaryQuestion
            );
            alink.style.float = "right";

            where.after(lsep, alink);
        }

        /**
         * @summary creates ARC modal and wires functionality
         * @param {HTMLInputElement} targetObject
         * @param {string} postType
         * @returns {Promise<void>}
         */
        async function autoLinkAction(
            targetObject: HTMLInputElement,
            postType: string
        ) {
            const popup = makePopup();

            popup
                .querySelector(".popup-close")
                ?.addEventListener("click", () =>
                    fadeOut(popup).then((p) => p.remove())
                );

            CONFIG.postType = postType;

            //Reset this, otherwise we get the greeting twice...
            showGreeting = false;

            //create/add options
            WriteComments(popup);

            popup.addEventListener("click", ({ target }) => {
                const actionMap = {
                    ".popup-actions-cancel": () =>
                        fadeOut(popup).then((p) => p.remove()),
                    ".popup-actions-reset": () => {
                        ResetComments();
                        WriteComments(popup);
                    },
                    ".popup-actions-impexp": () => ImportExport(popup),
                    ".popup-actions-toggledesc": () => {
                        var hideDesc = load("hide-desc") || "show";
                        save("hide-desc", hideDesc == "show" ? "hide" : "show");
                        ShowHideDescriptions(popup);
                    },
                    ".popup-submit": () => {
                        var selected = popup.querySelector(
                            "input[type=radio]:checked"
                        )!;

                        var md = htmlToMarkDown(
                            selected.closest(".action-desc")!.innerHTML
                        )
                            .replace(/\[username\]/g, username)
                            .replace(/\[OP\]/g, OP);

                        targetObject.value = md;
                        targetObject.focus(); //focus provokes character count test

                        const hereTxt = "[type here]";

                        var caret = md.indexOf(hereTxt);
                        if (caret >= 0)
                            targetObject.setSelectionRange(
                                caret,
                                caret + hereTxt.length
                            );

                        fadeOut(popup).then((p) => p.remove());
                    },
                };

                const [, action] =
                    Object.entries(actionMap).find(([selector]) =>
                        (<HTMLElement>target).matches(selector)
                    ) || [];

                if (!action) return;

                action();
            });

            const see = popup.querySelector(".popup-actions-see")!;

            see.addEventListener("mouseenter", () => {
                fadeTo(popup, 0.4);

                const notCloseEls = [
                    ...popup.querySelectorAll<HTMLElement>(":not(#close)"),
                ];

                notCloseEls.forEach((el) => fadeOut(el));
            });

            see.addEventListener("mouseleave", () => {
                fadeTo(popup, 1.0);

                const notCloseEls = [
                    ...popup.querySelectorAll<HTMLElement>(":not(#close)"),
                ];

                notCloseEls.forEach((el) => fadeTo(el, 1.0));
            });

            SetupRemoteBox(popup);
            SetupWelcomeBox(popup);

            //Auto-load from remote if required
            if (!window.VersionChecked && load("AutoRemote") == "true") {
                var throbber = document.getElementById("throbber2")!;
                var remoteerror = document.getElementById("remoteerror2")!;
                show(throbber);
                loadFromRemote(
                    load("RemoteUrl"),
                    function () {
                        WriteComments(popup);
                        hide(throbber);
                    },
                    ({ message }: Error) => (remoteerror.textContent = message)
                );
            }

            // Attach to #content, everything else is too fragile.
            document.getElementById("content")?.append(popup);

            center(popup);

            StackExchange.helpers.bindMovablePopups();

            //Get user info and inject
            var userid = getUserId();

            const userInfoEl = document.getElementById("userinfo")!;

            const uinfo = await getUserInfo(userid);

            if (!uinfo) {
                fadeOut(userInfoEl);
                return;
            }

            addUserInfo(userInfoEl, uinfo);

            OP = getOP();

            //We only actually perform the updates check when someone clicks, this should make it less costly, and more timely
            //also wrap it so that it only gets called the *FIRST* time we open this dialog on any given page (not much of an optimisation).
            if (
                typeof checkForNewVersion == "function" &&
                !window.VersionChecked
            ) {
                checkForNewVersion(popup); // eslint-disable-line no-undef
                window.VersionChecked = true;
            }
        }
    });
})();
