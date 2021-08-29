// ==UserScript==
// @author           benjol
// @contributors     double beep (https://github.com/double-beep), Oleg Valter (https://github.com/Oaphi)
// @description      No more re-typing the same comments over and over!
// @grant            GM_deleteValue
// @grant            GM_getValue
// @grant            GM_listValues
// @grant            GM_setValue
// @homepage         https://github.com/userscripters/SE-AutoReviewComments#readme
// @match            *://*.askubuntu.com/*
// @match            *://*.mathoverflow.net/*
// @match            *://*.serverfault.com/*
// @match            *://*.stackapps.com/*
// @match            *://*.stackexchange.com/*
// @match            *://*.stackoverflow.com/*
// @match            *://*.superuser.com/.*
// @name             Autoreviewcomments
// @run-at           document-start
// @source           git+https://github.com/userscripters/SE-AutoReviewComments.git
// @supportURL       https://github.com/userscripters/SE-AutoReviewComments/issues
// @version          1.4.7
// ==/UserScript==

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
StackExchange.ready(function () {
    var center = function (element) {
        var style = element.style;
        var update = {
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
        };
        Object.assign(style, update);
        return element;
    };
    var hide = function (element) { return element.classList.add("d-none"); };
    var show = function (element) { return element.classList.remove("d-none"); };
    var empty = function (node) {
        while (node.firstChild)
            node.firstChild.remove();
        return node;
    };
    var siblings = function (el, selector) {
        var found = [];
        var current = el;
        while ((current = current.nextElementSibling))
            found.push(current);
        return selector ? found.filter(function (sib) { return sib.matches(selector); }) : found;
    };
    var fadeTo = function (element, min, speed) {
        if (speed === void 0) { speed = 200; }
        var style = element.style;
        style.transitionProperty = "opacity";
        style.transitionDuration = speed.toFixed(0) + "ms";
        style.transitionTimingFunction = "linear";
        style.opacity = min.toFixed(2);
        return element;
    };
    var fadeOut = function (el, speed) {
        if (speed === void 0) { speed = 200; }
        return fadeTo(el, 0, speed);
    };
    var pluralise = function (count) { return (count === 1 ? "" : "s"); };
    var runFromHashmap = function (hashmap, comparator) {
        var _a;
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        var hash = Object.keys(hashmap).find(comparator);
        return hash && ((_a = hashmap[hash]) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spreadArray([hashmap], __read(params))));
    };
    var storageMap = {
        GM_setValue: {
            get length() {
                return GM_listValues().length;
            },
            clear: function () {
                var keys = GM_listValues();
                return keys.forEach(function (key) { return GM_deleteValue(key); });
            },
            key: function (index) {
                return GM_listValues()[index];
            },
            getItem: function (key) {
                return GM_getValue(key);
            },
            setItem: function (key, val) {
                return GM_setValue(key, val);
            },
            removeItem: function (key) {
                return GM_deleteValue(key);
            },
        },
    };
    var _a = __read(Object.entries(storageMap).find(function (_a) {
        var _b = __read(_a, 1), key = _b[0];
        return typeof window[key] === "function";
    }) || [], 2), storage = _a[1];
    var Store = (function () {
        function Store() {
        }
        Object.defineProperty(Store, "numKeys", {
            get: function () {
                var length = this.storage.length;
                return length;
            },
            enumerable: false,
            configurable: true
        });
        Store.clear = function (startsWith) {
            var _a = this, numKeys = _a.numKeys, prefix = _a.prefix, storage = _a.storage;
            for (var i = numKeys - 1; i >= 0; i--) {
                var key = storage.key(i);
                if (key.startsWith(prefix + startsWith))
                    storage.removeItem(key);
            }
        };
        Store.load = function (key, def) {
            var _a = this, prefix = _a.prefix, storage = _a.storage;
            var val = storage.getItem(prefix + key);
            return val ? JSON.parse(val) : def;
        };
        Store.save = function (key, val) {
            var _a = this, prefix = _a.prefix, storage = _a.storage;
            storage.setItem(prefix + key, JSON.stringify(val));
        };
        Store.toggle = function (key) {
            return Store.save(key, !Store.load(key));
        };
        Store.remove = function (key) {
            var _a = this, prefix = _a.prefix, storage = _a.storage;
            return storage.removeItem(prefix + key);
        };
        Store.prefix = "AutoReviewComments-";
        Store.storage = storage || localStorage;
        return Store;
    }());
    var Debugger = (function () {
        function Debugger(on) {
            this.on = on;
        }
        Debugger.prototype.log = function (msg) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            var on = this.on;
            var pfx = Debugger.prefix.replace("-", "");
            on && console.debug.apply(console, __spreadArray([pfx + ":\n\n" + JSON.stringify(msg, null, 2)], __read(params)));
        };
        Debugger.prefix = "AutoReviewComments-";
        return Debugger;
    }());
    var VERSION = "1.4.7";
    var GITHUB_URL = "https://github.com/userscripters/SE-AutoReviewComments#readme";
    var API_VER = "2.2";
    var API_KEY = "5J)5cHN9KbyhE9Yf9S*G)g((";
    var FILTER_UNSAFE = ")7tZ5Od";
    var debugLogger = new Debugger(Store.load("debug"));
    var site = window.location.hostname;
    var sitename = (StackExchange.options.site.name || "").replace(/\s?Stack Exchange/, "");
    debugLogger.log({
        site: site,
        sitename: sitename,
        isScriptManager: !!storage,
    });
    var allTgtMatcher = new RegExp("\\[(E?[AQ]|C)(?:,(E?[AQ]|C))*\\]");
    var userLinkSel = ".post-signature .user-details[itemprop=author] a";
    var viewsSel = ".main .view:not(:first-child)";
    var Target;
    (function (Target) {
        Target["Closure"] = "C";
        Target["CommentQuestion"] = "Q";
        Target["CommentAnswer"] = "A";
        Target["EditSummaryAnswer"] = "EA";
        Target["EditSummaryQuestion"] = "EQ";
    })(Target || (Target = {}));
    var htmllink = function (url, label) {
        if (label === void 0) { label = url; }
        return "<a href=\"" + url + "\" target=\"_blank\">" + label + "</a>";
    };
    var htmlem = function (text) { return "<em>" + text + "</em>"; };
    var commentDefaults = [
        {
            targets: [Target.CommentQuestion],
            name: "More than one question asked",
            description: "It is preferred if you can post separate questions instead of combining your questions into one. That way, it helps the people answering your question and also others hunting for at least one of your questions. Thanks!",
        },
        {
            targets: [Target.CommentQuestion],
            name: "Duplicate Closure",
            description: "This question will likely be closed as a duplicate soon. If the answers from the duplicates do not fully address your question, please edit it to include why and flag this for re-opening. Thanks!",
        },
        {
            targets: [Target.CommentAnswer],
            name: "Answers just to say Thanks!",
            description: "Please do not add \"thanks\" as answers. Invest some time in the site and you will gain sufficient " + htmllink("/privileges", "privileges") + " to upvote answers you like, which is our way of saying thank you.",
        },
        {
            targets: [Target.CommentAnswer],
            name: "Nothing but a URL (and isn't spam)",
            description: "Whilst this may theoretically answer the question, " + htmllink("https://meta.stackexchange.com/q/8259", "it would be preferable") + " to include the essential parts of the answer here, and provide the link for reference.",
        },
        {
            targets: [Target.CommentAnswer],
            name: "Requests to OP for further information",
            description: "This is really a comment, not an answer. With a bit more rep, " + htmllink("/privileges/comment", "you will be able to post comments") + ". For the moment, I have added the comment for you and flagging the post for deletion.",
        },
        {
            targets: [Target.CommentAnswer],
            name: "OP using an answer for further information",
            description: "Please use the " + htmlem("Post answer") + " button only for actual answers. You should modify your original question to add additional information.",
        },
        {
            targets: [Target.CommentAnswer],
            name: "OP adding a new question as an answer",
            description: "If you have another question, please ask it by clicking the " + htmllink("/questions/ask", "Ask Question") + " button.",
        },
        {
            targets: [Target.CommentAnswer],
            name: 'Another user adding a "Me too!"',
            description: "If you have a " + htmlem("new") + " question, please ask it by clicking the " + htmllink("/questions/ask", "Ask Question") + " button. If you have sufficient reputation, " + htmllink("/privileges/vote-up", "you may upvote") + " the question. Alternatively, \"star\" it as a favorite, and you will be notified of any new answers.",
        },
        {
            targets: [Target.Closure],
            name: "Too localized",
            description: "This question appears to be off-topic because it is too localized.",
        },
        {
            targets: [Target.EditSummaryQuestion],
            name: "Improper tagging",
            description: "The tags you used are not appropriate for the question. Please review " + htmllink("/help/tagging", "What are tags, and how should I use them?"),
        },
    ];
    if (!Store.load("WelcomeMessage"))
        Store.save("WelcomeMessage", "Welcome to " + sitename + "! ");
    var addStyles = function () {
        var style = document.createElement("style");
        document.head.append(style);
        var sheet = style.sheet;
        if (!sheet)
            return;
        var arc = "auto-review-comments";
        [
            "." + arc + ".popup{\n                    position:absolute;\n                    display:block;\n                    width:690px;\n                    padding:15px 15px 10px;\n                }",
            "." + arc + ".popup .svg-icon.mute-text a {\n                    color: var(--black-500);\n                }",
            "." + arc + ".popup .main .view {\n                    padding: 1vh 1vw;\n                }",
            "." + arc + ".popup .main .userinfo{\n                    padding:5px;\n                    margin-bottom:7px;\n                }",
            "." + arc + ".popup .main .remoteurl, ." + arc + ".popup .main .customwelcome {\n                    display: block;\n                    width: 100%;\n                }",
            "." + arc + ".popup .main .action-list{\n                    overflow-y:scroll;\n                    max-height: 400px;\n                }",
            "." + arc + ".popup .main .action-list li{\n                    padding:0;\n                    transition:.1s\n                }",
            "." + arc + ".popup .main .action-list li:hover{\n                    background-color:#f2f2f2\n                }",
            "." + arc + ".popup .main .action-list li.action-selected:hover{\n                    background-color:#e6e6e6\n                }",
            "." + arc + ".popup .main .action-list li label{\n                    position:relative;\n                    display:block;\n                    padding:10px;\n                }",
            "." + arc + ".popup .main .action-list li label .action-name{\n                    display:block;\n                    margin-bottom:3px;\n                    cursor:default;\n                }",
            "." + arc + ".popup .main .action-list li label .action-desc{\n                    margin:0;\n                    color:#888;\n                    cursor:default;\n                }",
            "." + arc + ".popup .main .action-list li label .quick-insert{\n                    display:none;\n                    position:absolute;\n                    top:0;\n                    right:0;\n                    height:100%;\n                    margin:0;font-size:300%;\n                    color:transparent;\n                    border:0;\n                    transition:.3s;\n                    text-shadow:0 0 1px #fff;\n                    cursor:pointer;\n                    background-color:rgba(0,0,0,0.1);\n                    background:rgba(0,0,0,0.1);\n                    box-shadow:none;\n                    -moz-box-shadow:none;\n                    -webkit-box-shadow:none;\n                }",
            "." + arc + ".popup .main .action-list li:hover label .quick-insert{\n                    display:block\n                }",
            "." + arc + ".popup .main .action-list li label .quick-insert:hover{\n                    background-color:#222;\n                    color:#fff\n                }",
            "." + arc + ".announcement strong:first-child {\n                    display: block;\n                }",
            "." + arc + ".announcement{\n                    padding:7px;\n                    margin-bottom:10px;\n                    background:orange;\n                    font-size:15px;\n                }",
            "." + arc + ".announcement .notify-close{\n                    display:block;\n                    float:right;\n                    margin:0 4px;\n                    padding:0 4px;\n                    border:2px solid black;\n                    cursor:pointer;\n                    line-height:17px;\n                }",
            "." + arc + ".announcement .notify-close a{\n                    color:black;\n                    text-decoration:none;\n                    font-weight:bold;\n                    font-size:16px;\n                }",
            "." + arc + ".popup .main .searchfilter{\n                    width:100%;\n                    box-sizing:border-box;\n                    display:block\n                }",
        ].forEach(function (rule) { return sheet.insertRule(rule); });
    };
    var makeTextInput = function (id, _a) {
        var _b;
        var _c = _a === void 0 ? {} : _a, _d = _c.value, value = _d === void 0 ? "" : _d, _e = _c.classes, classes = _e === void 0 ? [] : _e;
        var input = document.createElement("input");
        (_b = input.classList).add.apply(_b, __spreadArray([], __read(classes)));
        input.type = "text";
        input.id = input.name = id;
        input.value = value;
        return input;
    };
    var makeCheckbox = function (id, _a) {
        var _b;
        var _c = _a === void 0 ? {} : _a, _d = _c.checked, checked = _d === void 0 ? false : _d, _e = _c.classes, classes = _e === void 0 ? [] : _e;
        var input = document.createElement("input");
        (_b = input.classList).add.apply(_b, __spreadArray([], __read(classes)));
        input.type = "checkbox";
        input.id = input.name = id;
        input.checked = checked;
        return input;
    };
    var el = function (tag) {
        var _a;
        var classes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            classes[_i - 1] = arguments[_i];
        }
        var el = document.createElement(tag);
        (_a = el.classList).add.apply(_a, __spreadArray([], __read(classes)));
        return el;
    };
    var makeStacksTextArea = function (id, _a) {
        var _b = _a.label, label = _b === void 0 ? "" : _b, _c = _a.value, value = _c === void 0 ? "" : _c;
        var wrap = el("div", "d-flex", "fd-column", "gs4", "gsy");
        if (label) {
            var lbl = el("label", "flex--item", "s-label");
            lbl.htmlFor = id;
            lbl.textContent = label;
            wrap.append(lbl);
        }
        var area = el("textarea", "flex--item", "s-textarea");
        area.id = area.name = id;
        area.value = value;
        area.rows = 20;
        wrap.append(area);
        return [wrap, area];
    };
    var makeStacksURLInput = function (id, schema, label, value) {
        var wrap = el("div", "d-flex", "gs4", "gsy", "fd-column");
        var lbl = el("label", "flex--item", "s-label");
        lbl.htmlFor = id;
        lbl.textContent = label;
        var iwrap = el("div", "d-flex");
        var ischema = el("div", "flex--item", "s-input-fill", "order-first");
        ischema.textContent = schema;
        var iinput = el("div", "d-flex", "fl-grow1", "ps-relative");
        var input = makeTextInput(id, {
            value: value,
            classes: ["flex--item", "s-input", "blr0"],
        });
        iinput.append(input);
        iwrap.append(ischema, iinput);
        wrap.append(lbl, iwrap);
        return [wrap, iwrap, iinput, input];
    };
    var makeStacksCheckbox = function (id, label, state) {
        if (state === void 0) { state = false; }
        var fset = el("fieldset", "d-flex", "gs8");
        var iwrap = el("div", "flex--item");
        var lbl = el("label", "flex--item", "s-label", "fw-normal");
        lbl.htmlFor = id;
        lbl.textContent = label;
        var input = makeCheckbox(id, {
            checked: state,
            classes: ["s-checkbox"],
        });
        iwrap.append(input);
        fset.append(iwrap, lbl);
        return [fset, input];
    };
    var makeStacksToggle = function (id, label, state) {
        if (state === void 0) { state = false; }
        var wrap = el("div", "d-flex", "ai-center", "gs8");
        var lbl = el("label", "flex--item", "s-label");
        lbl.htmlFor = id;
        lbl.textContent = label;
        var iwrap = el("div", "flex--item", "s-toggle-switch");
        var input = makeCheckbox(id, { checked: state });
        var lever = el("div", "s-toggle-switch--indicator");
        iwrap.append(input, lever);
        wrap.append(lbl, iwrap);
        return [wrap, input];
    };
    var makeButton = function (text, title) {
        var classes = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            classes[_i - 2] = arguments[_i];
        }
        var button = el.apply(void 0, __spreadArray(["button", "s-btn"], __read(classes)));
        button.innerHTML = text;
        if (title)
            button.title = title;
        return button;
    };
    var makeCloseBtn = function (id) {
        var close = document.createElement("div");
        close.classList.add("popup-close");
        close.id = id;
        var clearSvg = makeStacksIconButton("iconClear", "Close popup", "M15 4.41 13.59 3 9 7.59 4.41 3 3 4.41 7.59 9 3 13.59 4.41 15 9 10.41 13.59 15 15 13.59 10.41 9 15 4.41z", {});
        var btn = makeButton(clearSvg.outerHTML, "", "s-btn__muted");
        close.append(btn);
        return close;
    };
    var makeStacksIconButton = function (icon, title, path, _a) {
        var _b;
        var url = _a.url, _c = _a.classes, classes = _c === void 0 ? [] : _c;
        var NS = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(NS, "svg");
        (_b = svg.classList).add.apply(_b, __spreadArray(["svg-icon", icon], __read(classes)));
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("width", "18");
        svg.setAttribute("height", "18");
        svg.setAttribute("viewBox", "0 0 18 18");
        var ttl = document.createElementNS(NS, "title");
        ttl.textContent = title;
        var d = document.createElementNS(NS, "path");
        d.setAttribute("d", path);
        if (url) {
            var anchor = document.createElementNS(NS, "a");
            anchor.setAttribute("href", url);
            anchor.setAttribute("target", "_blank");
            anchor.append(ttl, d);
            svg.append(anchor);
            return svg;
        }
        svg.append(ttl, d);
        return svg;
    };
    var makeViewSwitcher = function (viewsSel) { return function (view) {
        document.querySelectorAll(viewsSel).forEach(hide);
        show(view);
        Store.save("CurrentView", view.id);
        return view;
    }; };
    var makeTabsView = function (popup, id, _postType) {
        if (makeTabsView.view)
            return makeTabsView.view;
        var wrap = el("div", "view", "d-flex", "ai-center", "jc-space-between");
        wrap.id = id;
        var tabGroup = el("div", "s-btn-group", "flex--item");
        var btnGroupClasses = ["s-btn__muted", "s-btn__outlined"];
        var buttons = [
            makeButton.apply(void 0, __spreadArray(__spreadArray(["filter",
                "filter"], __read(btnGroupClasses)), ["popup-actions-filter"])),
            makeButton.apply(void 0, __spreadArray(__spreadArray(["import/export",
                "import/export all comments"], __read(btnGroupClasses)), ["popup-actions-impexp"])),
            makeButton.apply(void 0, __spreadArray(__spreadArray(["remote",
                "setup remote source"], __read(btnGroupClasses)), ["popup-actions-remote"])),
            makeButton.apply(void 0, __spreadArray(__spreadArray(["welcome",
                "configure welcome"], __read(btnGroupClasses)), ["popup-actions-welcome"])),
            makeButton.apply(void 0, __spreadArray(__spreadArray(["settings",
                "configure ARC"], __read(btnGroupClasses)), ["popup-actions-settings"])),
        ];
        tabGroup.append.apply(tabGroup, __spreadArray([], __read(buttons)));
        tabGroup.addEventListener("click", function (_a) {
            var target = _a.target;
            buttons.forEach(function (_a) {
                var classList = _a.classList;
                return classList.remove("is-selected");
            });
            target.classList.add("is-selected");
        });
        var iconGroup = el("div", "d-flex", "flex--item", "gs8", "ba", "bar-pill", "bc-black-300");
        var iconClasses = ["flex--item", "mute-text"];
        var seeBtn = makeStacksIconButton("iconEye", "see through", "M9.06 3C4 3 1 9 1 9s3 6 8.06 6C14 15 17 9 17 9s-3-6-7.94-6zM9\n             13a4 4 0 110-8 4 4 0 0 1 0 8zm0-2a2 2 0 002-2 2 2 0 0 0-2-2 2\n             2 0 0 0-2 2 2 2 0 0 0 2 2z", { classes: iconClasses });
        seeBtn.addEventListener("mouseenter", function () {
            fadeTo(popup, 0.4);
            fadeOut(seeBtn.closest(".main"));
        });
        seeBtn.addEventListener("mouseleave", function () {
            fadeTo(popup, 1.0);
            fadeTo(seeBtn.closest(".main"), 1);
        });
        var info = makeStacksIconButton("iconInfo", "see info about ARC (v" + VERSION + ")", "M9 1a8 8 0 110 16A8 8 0 019 1zm1 13V8H8v6h2zm0-8V4H8v2h2z", { url: GITHUB_URL, classes: iconClasses });
        iconGroup.append(seeBtn, info);
        wrap.append(tabGroup, iconGroup);
        return (makeTabsView.view = wrap);
    };
    var makeSettingsView = function (popup, id, postType) {
        if (makeSettingsView.view)
            return makeSettingsView.view;
        var view = el("div", "view", "d-flex", "fd-column", "gs16");
        view.id = id;
        var generalWrap = el("div", "flex--item");
        var dangerWrap = el("div", "flex--item");
        var _a = __read(makeStacksToggle("toggleDescr", "hide comment descriptions", Store.load("hide-desc", false)), 1), descrToggle = _a[0];
        var resetBtn = makeButton("reset", "reset any custom comments", "popup-actions-reset", "s-btn__filled", "s-btn__danger");
        generalWrap.append(descrToggle);
        dangerWrap.append(resetBtn);
        view.append(generalWrap, dangerWrap);
        popup.addEventListener("click", function (_a) {
            var target = _a.target;
            runFromHashmap({
                ".popup-actions-reset": function (p, t) {
                    resetComments(commentDefaults);
                    updateComments(p, t);
                },
                "#toggleDescr": function (p) {
                    return toggleDescriptionVisibility(p, Store.toggle("hide-desc"));
                },
            }, function (key) { return target.matches(key); }, popup, Store.load("post_type", postType));
        });
        return (makeSettingsView.view = view);
    };
    var makeSearchView = function (_popup, id) {
        if (makeSearchView.view)
            return makeSearchView.view;
        var wrap = document.createElement("div");
        wrap.classList.add("view");
        wrap.id = id;
        var header = document.createElement("h2");
        header.classList.add("handle");
        header.innerHTML = "Which review comment to insert?";
        var uinfo = document.createElement("div");
        uinfo.classList.add("userinfo");
        uinfo.id = "userinfo";
        var searchWrap = document.createElement("div");
        searchWrap.classList.add("searchbox");
        var search = document.createElement("input");
        search.classList.add("searchfilter");
        search.type = "search";
        search.placeholder = "filter the comments list";
        searchWrap.append(search);
        var actions = document.createElement("ul");
        actions.classList.add("action-list");
        wrap.append(header, uinfo, searchWrap, actions);
        return (makeSearchView.view = wrap);
    };
    var makeWelcomeView = function (popup, id, postType) {
        if (makeWelcomeView.view)
            return makeWelcomeView.view;
        var view = el("div", "view");
        view.id = id;
        var text = document.createTextNode('Setup the "welcome" message (blank is none):');
        var welcomeWrap = document.createElement("div");
        var input = makeTextInput("customwelcome", {
            classes: ["customwelcome"],
        });
        input.addEventListener("change", function () {
            return Store.save("WelcomeMessage", input.value);
        });
        welcomeWrap.append(input);
        var actionsWrap = el("div", "float-right");
        var actions = [
            makeButton("force", "force", "welcome-force", "s-btn__outlined"),
            makeButton("cancel", "cancel", "welcome-cancel", "s-btn__danger"),
        ];
        var viewSwitcher = makeViewSwitcher(viewsSel);
        popup.addEventListener("click", function (_a) {
            var target = _a.target;
            runFromHashmap({
                ".popup-actions-welcome": function () {
                    input.value || (input.value = Store.load("WelcomeMessage"));
                },
                ".welcome-cancel": function (p, t) {
                    return viewSwitcher(makeSearchView(p, "search-popup", t));
                },
                ".welcome-force": function (p, t) {
                    Store.save("ShowGreeting", true);
                    updateComments(p, t);
                },
            }, function (key) { return target.matches(key); }, popup, Store.load("post_type", postType));
        });
        actionsWrap.append.apply(actionsWrap, __spreadArray([], __read(actions)));
        view.append(text, welcomeWrap, actionsWrap);
        return (makeWelcomeView.view = view);
    };
    var updateImpExpComments = function (view) {
        var area = view.querySelector("textarea");
        var numComments = Store.load("commentcount");
        var loaded = loadComments(numComments);
        var content = loaded
            .map(function (_a) {
            var name = _a.name, desc = _a.desc;
            return "###" + name + "\n" + HTMLtoMarkdown(desc);
        })
            .join("\n\n");
        area.value = content;
        return view;
    };
    var makeImpExpView = function (popup, id, postType) {
        if (makeImpExpView.view)
            return updateImpExpComments(makeImpExpView.view);
        var view = el("div", "view");
        view.id = id;
        view.classList.add("d-flex", "gs8", "gsy", "fd-column");
        var _a = __read(makeStacksTextArea("impexp", {
            label: "Comment source",
        }), 2), areaWrap = _a[0], area = _a[1];
        area.addEventListener("change", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                importComments(area.value);
                updateComments(popup, postType);
                return [2];
            });
        }); });
        var actionWrap = el("div", "actions", "flex--item");
        var buttonsWrap = el("div", "d-flex", "gs8", "gsx");
        var toJsonBtn = makeButton("JSON", "Convert to JSON", "s-btn__primary", "flex--item");
        var cancelBtn = makeButton("cancel", "cancel import/export", "s-btn__danger", "flex--item");
        var viewSwitcher = makeViewSwitcher(viewsSel);
        cancelBtn.addEventListener("click", function () {
            return viewSwitcher(makeSearchView(popup, "search-popup", postType));
        });
        buttonsWrap.append(toJsonBtn, cancelBtn);
        actionWrap.append(buttonsWrap);
        var flexItemTextareaWrapper = el("div", "flex--item");
        var flexItemActionWrap = el("div", "flex--item");
        flexItemTextareaWrapper.append(areaWrap);
        flexItemActionWrap.append(actionWrap);
        view.append(flexItemTextareaWrapper, flexItemActionWrap);
        toJsonBtn.addEventListener("click", function () {
            var _a, _b;
            var numComments = Store.load("commentcount");
            var loaded = loadComments(numComments);
            var content = JSON.stringify(loaded, null, 4);
            area.value = content;
            (_a = view.querySelector("textarea")) === null || _a === void 0 ? void 0 : _a.classList.add("ff-mono");
            (_b = view.querySelector(".actions")) === null || _b === void 0 ? void 0 : _b.remove();
        });
        return (makeImpExpView.view = updateImpExpComments(view));
    };
    var scheme = function (url) {
        return /^https?:\/\//.test(url) ? url : "https://" + url;
    };
    var unscheme = function (url) { return url.replace(/^https?:\/\//, ""); };
    var updateRemoteURL = function (key, inputId) {
        var input = document.getElementById(inputId);
        if (!input)
            return false;
        input.value = unscheme(Store.load(key) || "");
        return true;
    };
    var makeOnRemoteChange = function (storeKey, input) {
        return function () {
            var value = input.value;
            Store.save(storeKey, scheme(unscheme(value)));
            input.value = unscheme(value);
        };
    };
    var makeRemoteView = function (popup, id, postType) {
        var storeKeyJSON = "remote_json";
        var storeKeyJSONauto = "remote_json_auto";
        var storeKeyJSONP = "RemoteUrl";
        var storeKeyJSONPauto = "AutoRemote";
        if (makeRemoteView.view) {
            var view = makeRemoteView.view;
            updateRemoteURL(storeKeyJSON, storeKeyJSON);
            updateRemoteURL(storeKeyJSONP, storeKeyJSONP);
            return view;
        }
        var wrap = el("div", "view");
        wrap.id = id;
        var initialScheme = "https://";
        var initialURL = unscheme(Store.load(storeKeyJSONP) || "");
        var inputWrap = el("div", "d-flex", "fd-column", "gs8");
        var _a = __read(makeStacksURLInput(storeKeyJSON, initialScheme, "JSON source", initialURL), 4), jsonWrap = _a[0], jsonIWrap = _a[2], jsonInput = _a[3];
        var _b = __read(makeStacksURLInput(storeKeyJSONP, initialScheme, "JSONP source", initialURL), 4), jsonpWrap = _b[0], jsonpIWrap = _b[2], jsonpInput = _b[3];
        jsonInput.addEventListener("change", makeOnRemoteChange(storeKeyJSON, jsonInput));
        jsonpInput.addEventListener("change", makeOnRemoteChange(storeKeyJSONP, jsonpInput));
        var autoWrap = el("div", "float-left");
        var toggleText = "auto get";
        var _c = __read(makeStacksCheckbox(storeKeyJSONauto, toggleText, Store.load(storeKeyJSONauto, false)), 2), autoJSONwrap = _c[0], autoJSONcbx = _c[1];
        var _d = __read(makeStacksCheckbox(storeKeyJSONPauto, toggleText, Store.load(storeKeyJSONPauto, false)), 2), autoJSONPwrap = _d[0], autoJSONPcbx = _d[1];
        autoJSONcbx.addEventListener("change", function () {
            return Store.toggle(storeKeyJSONauto);
        });
        autoJSONPcbx.addEventListener("change", function () {
            return Store.toggle(storeKeyJSONPauto);
        });
        var getNowText = "get now";
        var commonBtnClasses = ["s-btn__muted", "s-btn__outlined", "ml8"];
        var getJSONbtn = makeButton.apply(void 0, __spreadArray([getNowText,
            "get JSON remote",
            "remote-json-get"], __read(commonBtnClasses)));
        var getJSONPbtn = makeButton.apply(void 0, __spreadArray([getNowText,
            "get JSONP remote",
            "remote-jsonp-get"], __read(commonBtnClasses)));
        popup.addEventListener("click", function (_a) {
            var target = _a.target;
            runFromHashmap({
                ".remote-json-get": function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                getJSONbtn.classList.add("is-loading");
                                return [4, fetchFromRemote(scheme(jsonInput.value))];
                            case 1:
                                _a.sent();
                                updateComments(popup, postType);
                                getJSONbtn.classList.remove("is-loading");
                                return [2];
                        }
                    });
                }); },
                ".remote-jsonp-get": function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                getJSONPbtn.classList.add("is-loading");
                                return [4, fetchFromRemote(scheme(jsonpInput.value), true)];
                            case 1:
                                _a.sent();
                                updateComments(popup, postType);
                                getJSONPbtn.classList.remove("is-loading");
                                return [2];
                        }
                    });
                }); },
            }, function (key) { return target.matches(key); });
        });
        inputWrap.append(jsonWrap, jsonpWrap);
        jsonWrap.append(autoJSONwrap);
        jsonpWrap.append(autoJSONPwrap);
        jsonIWrap.after(getJSONbtn);
        jsonpIWrap.after(getJSONPbtn);
        wrap.append(inputWrap, autoWrap);
        return (makeRemoteView.view = wrap);
    };
    var insertComment = function (input, html, op) {
        var md = HTMLtoMarkdown(html)
            .replace(/\[username\]/g, "")
            .replace(/\[OP\]/g, op);
        input.value = md;
        input.focus();
        var hereTxt = "[type here]";
        var caret = md.indexOf(hereTxt);
        if (caret >= 0)
            input.setSelectionRange(caret, caret + hereTxt.length);
    };
    var makePopup = function (input, postType) {
        if (makePopup.popup)
            return makePopup.popup;
        var popup = document.createElement("div");
        popup.classList.add("auto-review-comments", "popup");
        var close = makeCloseBtn("close");
        close.addEventListener("click", function () {
            fadeOut(popup);
            hide(popup);
        });
        var main = document.createElement("div");
        main.classList.add("main");
        main.id = "main";
        var viewSwitcher = makeViewSwitcher(viewsSel);
        popup.addEventListener("click", function (_a) {
            var target = _a.target;
            runFromHashmap({
                ".popup-actions-welcome": function (p, t) {
                    return viewSwitcher(makeWelcomeView(p, "welcome-popup", t));
                },
                ".popup-actions-remote": function (p, t) {
                    return viewSwitcher(makeRemoteView(p, "remote-popup", t));
                },
                ".popup-actions-settings": function (p, t) {
                    return viewSwitcher(makeSettingsView(p, "settings-popup", t));
                },
                ".popup-actions-impexp": function (p, t) {
                    return viewSwitcher(makeImpExpView(p, "impexp-popup", t));
                },
                ".popup-actions-filter": function (p, t) {
                    return viewSwitcher(makeSearchView(p, "search-popup", t));
                },
                ".quick-insert": function (p) {
                    var selected = p.querySelector(".action-selected");
                    var descr = selected === null || selected === void 0 ? void 0 : selected.querySelector(".action-desc");
                    if (!descr || !selected)
                        return notify("Nothing selected, please select a comment", "warning");
                    var op = getOP();
                    debugLogger.log({ op: op });
                    insertComment(input, descr.innerHTML, op);
                    fadeOut(p);
                    hide(p);
                },
            }, function (sel) { return target.matches(sel); }, popup, Store.load("post_type", "question"));
        });
        var commentViewId = "search-popup";
        var viewsMap = [
            ["tabs-popup", makeTabsView],
            [commentViewId, makeSearchView],
            ["remote-popup", makeRemoteView],
            ["welcome-popup", makeWelcomeView],
            ["impexp-popup", makeImpExpView],
            ["settings-popup", makeSettingsView],
        ];
        var initPostType = Store.load("post_type", postType);
        debugLogger.log({ initPostType: initPostType, postType: postType });
        var views = viewsMap.map(function (_a) {
            var _b = __read(_a, 2), id = _b[0], maker = _b[1];
            return maker(popup, id, initPostType);
        });
        var hidden = views.slice(1, -1);
        hidden.forEach(hide);
        main.append.apply(main, __spreadArray([], __read(views)));
        popup.append(close, main);
        setupCommentHandlers(popup, commentViewId);
        setupSearchHandlers(popup);
        makeViewSwitcher(viewsSel)(views[0]);
        return (makePopup.popup = popup);
    };
    var span = function (text, _a) {
        var _b;
        var _c = _a.classes, classes = _c === void 0 ? [] : _c, _d = _a.unsafe, unsafe = _d === void 0 ? false : _d, _e = _a.title, title = _e === void 0 ? "" : _e;
        var el = document.createElement("span");
        (_b = el.classList).add.apply(_b, __spreadArray([], __read(classes)));
        unsafe ? (el.innerHTML = text) : (el.innerText = text);
        if (title)
            el.title = title;
        return el;
    };
    var makeOption = function (id, name, desc) {
        var li = document.createElement("li");
        var reviewRadio = document.createElement("input");
        reviewRadio.id = "comment-" + id;
        reviewRadio.type = "radio";
        reviewRadio.name = "commentreview";
        reviewRadio.hidden = true;
        var lbl = document.createElement("label");
        lbl.htmlFor = reviewRadio.id;
        var nameEl = document.createElement("span");
        nameEl.classList.add("action-name");
        nameEl.id = "name-" + id;
        nameEl.innerHTML = name;
        var descEl = document.createElement("span");
        descEl.classList.add("action-desc");
        descEl.id = "desc-" + id;
        descEl.innerHTML = desc;
        var insertBtn = document.createElement("button");
        insertBtn.classList.add("quick-insert");
        insertBtn.innerHTML = "↓";
        insertBtn.title = "Insert now";
        lbl.append(nameEl, descEl, insertBtn);
        li.append(reviewRadio, lbl);
        return li;
    };
    var timeUnits = {
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
    };
    var months = [
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
    var absoluteTime = function (epochSeconds) {
        var pad = function (number) { return (number < 10 ? "0" + number : number); };
        var date = new Date(epochSeconds * 1000);
        var thisYear = new Date().getUTCFullYear();
        var thatDateShortYear = date.getUTCFullYear().toString().substring(2);
        return ([
            months[date.getUTCMonth()],
            date.getUTCDate(),
            date.getUTCFullYear() !== thisYear
                ? "'" + thatDateShortYear
                : "",
            "at",
            [date.getUTCHours(), ":", pad(date.getUTCMinutes())].join(""),
        ].join(" ") || "");
    };
    var prettifyDate = function (dateSeconds) {
        var _a, _b;
        var diff = new Date().getTime() / 1000 - dateSeconds;
        if (isNaN(diff) || diff < 0)
            return "";
        var findFromObject = function (object) {
            return Object.entries(object)
                .sort(function (_a, _b) {
                var _c = __read(_a, 1), a = _c[0];
                var _d = __read(_b, 1), b = _d[0];
                return Number(a) - Number(b);
            })
                .find(function (_a) {
                var _b = __read(_a, 1), timeUnitSecs = _b[0];
                return diff < Number(timeUnitSecs);
            }) || [
                ,
                "",
            ];
        };
        var divideByMap = (_a = {},
            _a[timeUnits.minute] = timeUnits.second,
            _a[timeUnits.hour] = timeUnits.minute,
            _a[timeUnits.day / 2] = timeUnits.hour,
            _a[timeUnits.week] = timeUnits.day,
            _a);
        var _c = __read(findFromObject(divideByMap), 2), divideBy = _c[1];
        var unitElapsed = Math.floor(diff / divideBy);
        var pluralS = pluralise(unitElapsed);
        var getTimeAgo = function (type) {
            return unitElapsed + " " + type + pluralS + " ago";
        };
        var stringsMap = (_b = {},
            _b[timeUnits.second * 2] = "just now",
            _b[timeUnits.minute] = getTimeAgo("sec"),
            _b[timeUnits.hour] = getTimeAgo("min"),
            _b[timeUnits.day / 2] = getTimeAgo("hour"),
            _b[timeUnits.day] = "today",
            _b[timeUnits.day * 2] = "yesterday",
            _b[timeUnits.week] = getTimeAgo("day"),
            _b);
        var _d = __read(findFromObject(stringsMap), 2), relativeDateString = _d[1];
        return relativeDateString || absoluteTime(dateSeconds);
    };
    var shortenReputationNumber = function (reputationNumber) {
        var ranges = [
            { divider: 1e6, suffix: "m" },
            { divider: 1e3, suffix: "k" },
        ];
        var range = ranges.find(function (_a) {
            var divider = _a.divider;
            return reputationNumber >= divider;
        });
        return range
            ? (reputationNumber / range.divider).toFixed(1) + range.suffix
            : reputationNumber.toString();
    };
    var getLoggedInUserId = function (se) {
        return se.options.user.userId || "";
    };
    var notify = function (toastBody, type) {
        StackExchange.helpers.showToast(toastBody, { type: type });
    };
    var getUserId = function (tgt) {
        var parent = tgt.closest(".answer") || tgt.closest(".question");
        if (!parent)
            return "";
        var userLink = parent.querySelector(userLinkSel);
        if (!userLink)
            return "";
        var href = userLink.href;
        var _a = __read(/users\/(\d+)\//.exec(href) || [], 2), uid = _a[1];
        return uid || "";
    };
    var isNewUser = function (date) {
        return Date.now() / 1000 - date < timeUnits.week;
    };
    var getOP = function (refresh) {
        if (refresh === void 0) { refresh = false; }
        if (getOP.op && !refresh)
            return getOP.op;
        var question = document.getElementById("question");
        var userlink = question.querySelector(userLinkSel);
        if (userlink)
            return userlink.innerHTML || "";
        var deleted = question.querySelector(".owner .user-details");
        return (getOP.op = (deleted && deleted.innerHTML) || "OP");
    };
    var capitalize = function (str) {
        return str[0].toUpperCase() + str.slice(1).toLowerCase();
    };
    var b = function (text) {
        var strong = document.createElement("strong");
        strong.innerHTML = text;
        return strong;
    };
    var makeB = function (element) { return element.classList.add("fw-bold"); };
    var link = function (url, label) {
        if (label === void 0) { label = url; }
        var a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.innerHTML = label;
        return a;
    };
    var text = function (data) { return document.createTextNode(data); };
    var addUserInfo = function (_a) {
        var _b;
        var user_id = _a.user_id, creation_date = _a.creation_date, display_name = _a.display_name, last_access_date = _a.last_access_date, reputation = _a.reputation, user_type = _a.user_type;
        var container = document.getElementById("userinfo");
        if (!container)
            return;
        if (isNewUser(creation_date)) {
            Store.save("ShowGreeting", true);
            (_b = container
                .querySelector(".action-desc")) === null || _b === void 0 ? void 0 : _b.prepend(Store.load("WelcomeMessage") || "");
        }
        var userLink = link("/users/" + user_id, "");
        userLink.append(b(display_name));
        empty(container);
        var relativeTimeClass = "relativetime";
        var _c = __read([
            creation_date,
            last_access_date,
        ].map(function (date) {
            var prettified = prettifyDate(date);
            var isoString = new Date(date * 1000)
                .toISOString()
                .replace("T", " ")
                .replace(/\.\d{3}/, "");
            var dateSpan = span(prettified, {
                classes: [relativeTimeClass],
                unsafe: true,
                title: isoString,
            });
            makeB(dateSpan);
            return dateSpan;
        }), 2), prettyCreation = _c[0], prettyLastSeen = _c[1];
        container.append(capitalize(user_type), text(" user "), userLink, text(", joined "), prettyCreation, text(", last seen "), prettyLastSeen, text(", reputation "), b(shortenReputationNumber(reputation)));
    };
    var getUserInfo = function (userid) { return __awaiter(void 0, void 0, void 0, function () {
        var url, res, _a, userInfo;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = new URL("https://api.stackexchange.com/" + API_VER + "/users/" + userid);
                    url.search = new URLSearchParams({
                        site: site,
                        key: API_KEY,
                        unsafe: FILTER_UNSAFE,
                    }).toString();
                    return [4, fetch(url.toString())];
                case 1:
                    res = _b.sent();
                    if (!res.ok)
                        return [2, null];
                    return [4, res.json()];
                case 2:
                    _a = __read.apply(void 0, [(_b.sent()).items, 1]), userInfo = _a[0];
                    return [2, userInfo];
            }
        });
    }); };
    var makeSeparator = function () {
        var lsep = document.createElement("span");
        lsep.classList.add("lsep");
        lsep.innerHTML = " | ";
        return lsep;
    };
    var importComments = function (text) {
        Store.clear("name-");
        Store.clear("desc-");
        var lines = text.split("\n");
        var names = [];
        var descs = [];
        lines.forEach(function (line) {
            var ln = line.trim();
            if (ln.startsWith("#"))
                return names.push(ln.replace(/^#+/g, ""));
            if (ln)
                return descs.push(tag(markdownToHTML(ln)));
        });
        var numNames = names.length;
        var numDescs = descs.length;
        debugLogger.log({ numNames: numNames, numDescs: numDescs });
        if (numNames !== numDescs)
            return notify("Failed to import: titles and descriptions do not match", "danger");
        names.forEach(function (name, idx) {
            Store.save("name-" + idx, name);
            Store.save("desc-" + idx, descs[idx]);
        });
        Store.save("commentcount", numNames);
    };
    var entityMapToHtml = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
    };
    var entityMapFromHtml = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
    };
    var escapeHtml = function (html) {
        return String(html).replace(/[&<>]/g, function (s) { return entityMapToHtml[s]; });
    };
    var unescapeHtml = function (html) {
        return Object.entries(entityMapFromHtml).reduce(function (acc, _a) {
            var _b = __read(_a, 2), k = _b[0], v = _b[1];
            return acc.replace(new RegExp(k, "g"), v);
        }, String(html));
    };
    var HTMLtoMarkdown = function (html) {
        return unescapeHtml(html
            .replace(/<a href="(.+?)".+?>(.+?)<\/a>/g, "[$2]($1)")
            .replace(/<em>(.+?)<\/em>/g, "*$1*")
            .replace(/<strong>(.+?)<\/strong>/g, "**$1**"));
    };
    var markdownToHTML = function (markdown) {
        return escapeHtml(markdown)
            .replace(/\[([^\]]+)\]\((.+?)\)/g, htmllink("$2", "$1"))
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*([^`]+?)\*/g, htmlem("$1"));
    };
    var untag = function (text) {
        return text
            .replace(/\$SITENAME\$/g, sitename)
            .replace(/\$SITEURL\$/g, site)
            .replace(/\$MYUSERID\$/g, getLoggedInUserId(StackExchange));
    };
    var tag = function (html) {
        var regname = new RegExp(sitename, "g");
        var regurl = new RegExp("//" + site, "g");
        var reguid = new RegExp("/" + getLoggedInUserId(StackExchange) + "[)]", "g");
        return html
            .replace(regname, "$SITENAME$")
            .replace(regurl, "//$SITEURL$")
            .replace(reguid, "/$MYUSERID$)");
    };
    var saveComment = function (id, value) {
        var html = markdownToHTML(value);
        Store.save(id, tag(html));
        return (((Store.load("ShowGreeting") && Store.load("WelcomeMessage")) ||
            "") + untag(html));
    };
    var closeEditMode = function (commentElem, value) {
        var dataset = commentElem.dataset;
        empty(commentElem);
        commentElem.innerHTML = value;
        commentElem.closest("li").querySelector("input").disabled = false;
        dataset.mode = "insert";
    };
    var openEditMode = function (commentElem, popup) {
        var backup = commentElem.innerHTML, dataset = commentElem.dataset, _a = commentElem.dataset.mode, mode = _a === void 0 ? "insert" : _a;
        if (mode === "edit")
            return;
        var html = tag(backup.replace(Store.load("WelcomeMessage", ""), ""));
        debugLogger.log({ backup: backup, html: html });
        empty(commentElem);
        var preview = document.createElement("span");
        preview.classList.add("d-inline-block", "p8");
        preview.innerHTML = html;
        var _b = __read(makeStacksTextArea(commentElem.id, {
            value: HTMLtoMarkdown(html),
        }), 2), areaWrap = _b[0], area = _b[1];
        area.addEventListener("input", function (_a) {
            var target = _a.target;
            var value = target.value;
            preview.innerHTML = markdownToHTML(untag(value));
        });
        area.addEventListener("change", function (_a) {
            var target = _a.target;
            var _b = target, id = _b.id, value = _b.value;
            closeEditMode(commentElem, saveComment(id, value));
        });
        commentElem.closest("li").querySelector("input").disabled = true;
        popup.querySelectorAll(".quick-insert").forEach(hide);
        var actions = document.createElement("div");
        actions.classList.add("actions");
        var cancel = makeButton("cancel", "cancel edit");
        cancel.addEventListener("click", function () {
            popup.querySelectorAll(".quick-insert").forEach(show);
            closeEditMode(commentElem, backup);
        });
        actions.append(cancel);
        commentElem.append(preview, areaWrap, actions);
        dataset.mode = "edit";
    };
    var resetComments = function (comments) {
        Store.clear("name-");
        Store.clear("desc-");
        comments.forEach(function (_a, index) {
            var description = _a.description, name = _a.name, targets = _a.targets;
            var prefix = targets ? "[" + targets.join(",") + "] " : "";
            Store.save("name-" + index, prefix + name);
            Store.save("desc-" + index, description);
        });
        Store.save("commentcount", commentDefaults.length);
    };
    var loadComments = function (numComments) {
        var comments = [];
        for (var i = 0; i < numComments; i++) {
            var name_1 = Store.load("name-" + i);
            var desc = Store.load("desc-" + i);
            comments.push({ name: name_1, desc: desc });
        }
        return comments;
    };
    var makeCommentClickHandler = function (popup) {
        return function (_a) {
            var target = _a.target;
            var el = target;
            if (!el.matches("input[type=radio]"))
                return;
            var acts = popup.querySelector(".action-list");
            acts.querySelectorAll("li").forEach(function (_a) {
                var classList = _a.classList;
                return classList.remove("action-selected");
            });
            if (Store.load("hide-desc")) {
                popup
                    .querySelectorAll(".action-desc")
                    .forEach(hide);
            }
            var action = el.closest("li");
            var classList = action.classList;
            classList.add("action-selected");
            var descr = action.querySelector(".action-desc");
            show(descr);
        };
    };
    var makeQuickInsertHandler = function () {
        return function (_a) {
            var target = _a.target;
            var el = target;
            if (!el.matches("label > .quick-insert"))
                return;
            var action = el.closest("li");
            var radio = action === null || action === void 0 ? void 0 : action.querySelector("input");
            if (!action || !radio)
                return notify("Something went wrong", "danger");
            action.classList.add("action-selected");
            radio.checked = true;
        };
    };
    var setupCommentHandlers = function (popup, viewId) {
        var currView = Store.load("CurrentView");
        popup.addEventListener("dblclick", function (_a) {
            var target = _a.target;
            var el = target;
            if (!el.matches(".action-desc"))
                return;
            openEditMode(el, popup);
        });
        var insertHandler = makeQuickInsertHandler();
        var selectHandler = makeCommentClickHandler(popup);
        popup.addEventListener("click", function (event) {
            debugLogger.log({ currView: currView, viewId: viewId });
            if (currView !== viewId)
                return;
            insertHandler(event);
            selectHandler(event);
        });
    };
    var makeVariableReplacer = function (_a) {
        var myId = _a.myId, opName = _a.opName, site = _a.site, sitename = _a.sitename;
        return function (text) {
            var rules = {
                SITENAME: sitename,
                SITEURL: site,
                MYUSERID: myId,
                OP: opName,
            };
            return Object.entries(rules).reduce(function (a, _a) {
                var _b = __read(_a, 2), expression = _b[0], replacement = _b[1];
                return a.replace(new RegExp("\\$" + expression + "\\$", "g"), replacement);
            }, text);
        };
    };
    var updateComments = function (popup, postType) {
        var numComments = Store.load("commentcount");
        if (!numComments)
            resetComments(commentDefaults);
        var ul = popup.querySelector(".action-list");
        empty(ul);
        var comments = loadComments(numComments);
        var myId = getLoggedInUserId(StackExchange);
        var opName = getOP();
        var opts = {
            myId: myId,
            opName: opName,
            site: site,
            sitename: sitename,
        };
        var replaceVars = makeVariableReplacer(opts);
        var greet = Store.load("ShowGreeting", false);
        var welcome = Store.load("WelcomeMessage", "");
        var greeting = greet ? replaceVars(welcome) + " " : "";
        debugLogger.log(__assign({ comments: comments, postType: postType, greet: greet, welcome: welcome, greeting: greeting }, opts));
        var listItems = comments
            .filter(function (_a) {
            var name = _a.name;
            return isCommentValidForType(name, postType);
        })
            .map(function (_a, i) {
            var name = _a.name, desc = _a.desc;
            var cname = name.replace(allTgtMatcher, "");
            var description = replaceVars(desc).replace(/\$/g, "$$$");
            return makeOption(i.toString(), cname.replace(/\$/g, "$$$"), greeting + description);
        });
        ul.append.apply(ul, __spreadArray([], __read(listItems)));
        toggleDescriptionVisibility(popup);
    };
    var isCommentValidForType = function (text, postType) {
        var _a = __read(text.match(allTgtMatcher) || [], 2), matched = _a[1];
        return matched === postType;
    };
    var filterOn = function (popup, text) {
        var words = text
            .toLowerCase()
            .split(/\s+/)
            .filter(function (_a) {
            var length = _a.length;
            return length;
        });
        var items = popup.querySelectorAll(".action-list > li");
        if (!text)
            return items.forEach(show);
        items.forEach(function (item) {
            var name = item
                .querySelector(".action-name")
                .innerHTML.toLowerCase();
            var desc = item
                .querySelector(".action-desc")
                .innerHTML.toLowerCase();
            var shown = words.some(function (w) { return name.includes(w) || desc.includes(w); });
            shown ? show(item) : hide(item);
        });
    };
    var setupSearchHandlers = function (popup) {
        var filterSel = ".searchfilter";
        var sbox = popup.querySelector(".searchbox");
        var stext = sbox.querySelector(filterSel);
        if (!stext)
            return debugLogger.log("missing filter: " + filterSel);
        var callback = function (_a) {
            var target = _a.target;
            return setTimeout(function () {
                var value = target.value;
                filterOn(popup, value);
            }, 100);
        };
        stext.addEventListener("keydown", callback);
        stext.addEventListener("change", callback);
        stext.addEventListener("cut", callback);
        stext.addEventListener("paste", callback);
        stext.addEventListener("search", callback);
    };
    var toggleDescriptionVisibility = function (popup, hidden) {
        if (hidden === void 0) { hidden = Store.load("hide-desc"); }
        popup
            .querySelectorAll("li:not(.action-selected) .action-desc")
            .forEach(function (d) { return (hidden ? hide(d) : show(d)); });
    };
    var getJSONP = function (url, callbackName) {
        if (callbackName === void 0) { callbackName = "callback"; }
        return new Promise(function (resolve, reject) {
            var target = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
            var clean = function (handler, value) {
                script.remove();
                delete target[callbackName];
                handler(value);
            };
            target[callbackName] = function (json) { return clean(resolve, json); };
            var script = document.createElement("script");
            script.src = url;
            script.async = true;
            script.addEventListener("error", function (_a) {
                var error = _a.error;
                return clean(reject, error);
            });
            document.body.append(script);
        });
    };
    var getJSON = function (url) { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, fetch(url)];
                case 1:
                    res = _a.sent();
                    return [2, res.json()];
            }
        });
    }); };
    var fetchFromRemote = function (url, isJSONP) {
        if (isJSONP === void 0) { isJSONP = false; }
        return __awaiter(void 0, void 0, void 0, function () {
            var fetcher, comments;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        debugLogger.log({ isJSONP: isJSONP });
                        fetcher = isJSONP ? getJSONP : getJSON;
                        return [4, fetcher(url)];
                    case 1:
                        comments = _a.sent();
                        Store.save("commentcount", comments.length);
                        Store.clear("name-");
                        Store.clear("desc-");
                        comments.forEach(function (_a, i) {
                            var name = _a.name, description = _a.description;
                            Store.save("name-" + i, name);
                            Store.save("desc-" + i, tag(markdownToHTML(description)));
                        });
                        return [2];
                }
            });
        });
    };
    var showPopup = function (popup) {
        show(popup);
        fadeTo(popup, 1);
        var style = popup.style, classList = popup.classList;
        style.display = "";
        classList.remove("popup-closing", "popup-closed");
    };
    var autoLinkAction = function (target, postType) { return __awaiter(void 0, void 0, void 0, function () {
        var popup, userid, uinfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Store.save("post_type", postType);
                    popup = makePopup(target, postType);
                    if (!popup.isConnected)
                        document.body.append(popup);
                    showPopup(popup);
                    if (!Store.load("AutoRemote")) return [3, 2];
                    debugLogger.log("autofetching JSONP remote");
                    return [4, fetchFromRemote(Store.load("RemoteUrl"), true)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!Store.load("remote_json_auto")) return [3, 4];
                    debugLogger.log("autofetching JSON remote");
                    return [4, fetchFromRemote(Store.load("remote_json"))];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    updateComments(popup, postType);
                    center(popup);
                    StackExchange.helpers.bindMovablePopups();
                    userid = getUserId(target);
                    if (!userid) return [3, 6];
                    return [4, getUserInfo(userid)];
                case 5:
                    uinfo = _a.sent();
                    debugLogger.log({ userid: userid, uinfo: uinfo });
                    if (uinfo)
                        addUserInfo(uinfo);
                    _a.label = 6;
                case 6: return [2];
            }
        });
    }); };
    function addTriggerButton(selector, locator, injector, actor) {
        var maxTries = 20;
        var _injector = function (trigger, retry) {
            if (maxTries <= retry)
                return;
            var _a = __read(locator(trigger), 2), injectNextTo = _a[0], placeIn = _a[1];
            if (injectNextTo)
                return injector(injectNextTo, placeIn, actor);
            setTimeout(function () { return _injector(trigger, retry + 1); }, 50);
        };
        var content = document.getElementById("content");
        content.addEventListener("click", function (_a) {
            var target = _a.target;
            if (!target.matches(selector))
                return;
            _injector(target, 0);
        });
    }
    var findCommentElements = function (_a) {
        var parentElement = _a.parentElement;
        var id = parentElement.id;
        var divId = id.replace("-link", "");
        var div = document.getElementById(divId);
        var injectNextTo = div.querySelector(".js-comment-help-link");
        var placeCommentIn = div.querySelector("textarea");
        return [injectNextTo, placeCommentIn];
    };
    var findEditSummaryElements = function (_a) {
        var href = _a.href;
        var _b = __read(href.match(/posts\/(\d+)\/edit/) || [], 2), divid = _b[1];
        var nextElementSibling = document.getElementById("post-editor-" + divid).nextElementSibling;
        var placeIn = nextElementSibling.querySelector(".edit-comment");
        return [placeIn, placeIn];
    };
    var findClosureElements = function (_where) {
        var injectTo = document.querySelector(".close-as-off-topic-pane textarea");
        return [injectTo, injectTo];
    };
    var findReviewQueueElements = function (_where) {
        var injectTo = document.querySelector(".text-counter");
        var placeIn = document.querySelector(".edit-comment");
        return [injectTo, placeIn];
    };
    var makePopupOpenButton = function (callback, next, where) {
        var alink = document.createElement("a");
        alink.classList.add("comment-auto-link");
        alink.innerHTML = "auto";
        alink.addEventListener("click", function (ev) {
            ev.preventDefault();
            callback(next, where);
        });
        return alink;
    };
    var getTargetType = function (where, clsMap) {
        var parent = where.closest(".answer") || where.closest(".question");
        if (!parent)
            return Target.CommentQuestion;
        var classList = parent.classList;
        var _a = __read(clsMap.find(function (_a) {
            var _b = __read(_a, 1), c = _b[0];
            return classList.contains(c);
        }) || [], 2), tgt = _a[1];
        return tgt;
    };
    var injectAutoLink = function (where, placeCommentIn, actor) {
        var existingAutoLinks = siblings(where, ".comment-auto-link");
        if (existingAutoLinks.length)
            return;
        var clsMap = [
            ["answer", Target.CommentAnswer],
            ["question", Target.CommentQuestion],
        ];
        var tgt = getTargetType(where, clsMap);
        var lsep = makeSeparator();
        var alink = makePopupOpenButton(actor, placeCommentIn, tgt);
        where.after(lsep, alink);
    };
    var injectAutoLinkClosure = function (where, placeCommentIn, actor) {
        var existingAutoLinks = siblings(where, ".comment-auto-link");
        if (existingAutoLinks.length)
            return;
        var lsep = makeSeparator();
        var alink = makePopupOpenButton(actor, placeCommentIn, Target.Closure);
        where.after(lsep, alink);
    };
    var injectAutoLinkReviewQueue = function (where, placeCommentIn, actor) {
        var existingAutoLinks = siblings(where, ".comment-auto-link");
        if (existingAutoLinks.length)
            return;
        var lsep = makeSeparator();
        var alink = makePopupOpenButton(actor, placeCommentIn, Target.EditSummaryQuestion);
        alink.style.float = "right";
        where.after(lsep, alink);
    };
    var injectAutoLinkEdit = function (where, placeIn, actor) {
        var existingAutoLinks = siblings(where, ".comment-auto-link");
        if (existingAutoLinks.length)
            return;
        var style = where.style;
        style.width = "510px";
        var overs = siblings(where, ".actual-edit-overlay");
        overs.forEach(function (_a) {
            var style = _a.style;
            return (style.width = "510px");
        });
        var clsMap = [
            ["answer", Target.EditSummaryAnswer],
            ["question", Target.EditSummaryQuestion],
        ];
        var tgt = getTargetType(where, clsMap);
        var lsep = makeSeparator();
        var alink = makePopupOpenButton(actor, placeIn, tgt);
        where.after(lsep, alink);
    };
    addStyles();
    addTriggerButton(".js-add-link", findCommentElements, injectAutoLink, autoLinkAction);
    addTriggerButton(".edit-post", findEditSummaryElements, injectAutoLinkEdit, autoLinkAction);
    addTriggerButton(".close-question-link", findClosureElements, injectAutoLinkClosure, autoLinkAction);
    addTriggerButton(".review-actions input:first-child", findReviewQueueElements, injectAutoLinkReviewQueue, autoLinkAction);
});
