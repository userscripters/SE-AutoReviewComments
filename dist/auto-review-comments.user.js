// ==UserScript==
// @author           benjol
// @contributors     double beep (https://github.com/double-beep), Oleg Valter (https://github.com/Oaphi)
// @description      No more re-typing the same comments over and over!
// @grant            GM_deleteValue
// @grant            GM_getValue
// @grant            GM_listValues
// @grant            GM_setValue
// @homepage         https://github.com/userscripters/SE-AutoReviewComments#readme
// @match            https://*.stackexchange.com/questions/*
// @match            https://*.stackexchange.com/review/*
// @match            https://askubuntu.com/questions/*
// @match            https://askubuntu.com/review/*
// @match            https://es.meta.stackoverflow.com/questions/*
// @match            https://es.meta.stackoverflow.com/review/*
// @match            https://es.stackoverflow.com/questions/*
// @match            https://es.stackoverflow.com/review/*
// @match            https://ja.meta.stackoverflow.com/questions/*
// @match            https://ja.meta.stackoverflow.com/review/*
// @match            https://ja.stackoverflow.com/questions/*
// @match            https://ja.stackoverflow.com/review/*
// @match            https://mathoverflow.net/questions/*
// @match            https://mathoverflow.net/review/*
// @match            https://meta.askubuntu.com/questions/*
// @match            https://meta.askubuntu.com/review/*
// @match            https://meta.mathoverflow.net/questions/*
// @match            https://meta.mathoverflow.net/review/*
// @match            https://meta.serverfault.com/questions/*
// @match            https://meta.serverfault.com/review/*
// @match            https://meta.stackoverflow.com/questions/*
// @match            https://meta.stackoverflow.com/review/*
// @match            https://meta.superuser.com/questions/*
// @match            https://meta.superuser.com/review/*
// @match            https://pt.meta.stackoverflow.com/questions/*
// @match            https://pt.meta.stackoverflow.com/review/*
// @match            https://pt.stackoverflow.com/questions/*
// @match            https://pt.stackoverflow.com/review/*
// @match            https://ru.meta.stackoverflow.com/questions/*
// @match            https://ru.meta.stackoverflow.com/review/*
// @match            https://ru.stackoverflow.com/questions/*
// @match            https://ru.stackoverflow.com/review/*
// @match            https://serverfault.com/questions/*
// @match            https://serverfault.com/review/*
// @match            https://stackapps.com/questions/*
// @match            https://stackapps.com/review/*
// @match            https://stackoverflow.com/questions/*
// @match            https://stackoverflow.com/review/*
// @match            https://superuser.com/questions/*
// @match            https://superuser.com/review/*
// @name             Auto Review Comments
// @run-at           document-start
// @source           git+https://github.com/userscripters/SE-AutoReviewComments.git
// @supportURL       https://github.com/userscripters/SE-AutoReviewComments/issues
// @version          1.4.7
// ==/UserScript==

"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
window.addEventListener("load", function () {
    var _a;
    if (typeof StackExchange !== "undefined") {
        (_a = StackExchange.ready) === null || _a === void 0 ? void 0 : _a.call(StackExchange, function () {
            var getNumTextLines = function (text, font, lineWidth) {
                var lines = text.split(/\r?\n/);
                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");
                if (!context) {
                    console.debug("missing 2d canvas context");
                    return 1;
                }
                context.font = font;
                return lines.reduce(function (a, line) {
                    var width = context.measureText(line).width;
                    var actualNumLines = Math.ceil(width / lineWidth);
                    return a + actualNumLines;
                }, 0);
            };
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
            var hide = function (element) {
                return element.classList.add("d-none");
            };
            var show = function (element) {
                return element.classList.remove("d-none");
            };
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
                return selector
                    ? found.filter(function (sib) { return sib.matches(selector); })
                    : found;
            };
            var fadeTo = function (element, min, speed) {
                if (speed === void 0) { speed = 200; }
                var style = element.style;
                style.transitionProperty = "opacity";
                style.transitionDuration = "".concat(speed.toFixed(0), "ms");
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
                return hash && ((_a = hashmap[hash]) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spreadArray([hashmap], __read(params), false)));
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
                Store.hasMatching = function (text) {
                    var _a = this, numKeys = _a.numKeys, prefix = _a.prefix, storage = _a.storage;
                    var expr = new RegExp("".concat(prefix, ".*?").concat(text));
                    for (var i = numKeys - 1; i >= 0; i--) {
                        var key = storage.key(i) || "";
                        if (expr.test(key)) {
                            return true;
                        }
                    }
                    return false;
                };
                Store.load = function (key, def) {
                    var _a = this, prefix = _a.prefix, storage = _a.storage;
                    var val = storage.getItem(prefix + key);
                    return val ? typeof def === "string" ?
                        val : JSON.parse(val) :
                        def;
                };
                Store.save = function (key, val) {
                    try {
                        var _a = this, prefix = _a.prefix, storage_1 = _a.storage;
                        storage_1.setItem(prefix + key, typeof val !== "string" ? JSON.stringify(val) : val);
                        return true;
                    }
                    catch (error) {
                        debugLogger.log("failed to save: ".concat(error));
                        return false;
                    }
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
                    on && console.debug.apply(console, __spreadArray(["".concat(pfx, ":\n\n").concat(JSON.stringify(msg, null, 2))], __read(params), false));
                };
                Debugger.prefix = "AutoReviewComments-";
                return Debugger;
            }());
            var VERSION = "1.4.7";
            var GITHUB_URL = "https://github.com/userscripters/SE-AutoReviewComments#readme";
            var API_VER = "2.2";
            var API_KEY = "5J)5cHN9KbyhE9Yf9S*G)g((";
            var FILTER_UNSAFE = ")7tZ5Od";
            var debugLogger = new Debugger(Store.load("debug", false));
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
                return "<a href=\"".concat(url, "\" target=\"_blank\">").concat(label, "</a>");
            };
            var htmlem = function (text) { return "<em>".concat(text, "</em>"); };
            var htmlstrong = function (text) {
                return "<strong>".concat(text, "</strong>");
            };
            var htmlinlinecode = function (text) {
                return "<code>".concat(text, "</code>");
            };
            var commentDefaults = [
                {
                    id: "default-0",
                    targets: [Target.CommentQuestion],
                    name: "More than one question asked",
                    description: "It is preferred if you can post separate questions instead of combining your questions into one. That way, it helps the people answering your question and also others hunting for at least one of your questions. Thanks!",
                },
                {
                    id: "default-1",
                    targets: [Target.CommentQuestion],
                    name: "Duplicate Closure",
                    description: "This question will likely be closed as a duplicate soon. If the answers from the duplicates do not fully address your question, please edit it to include why and flag this for re-opening. Thanks!",
                },
                {
                    id: "default-2",
                    targets: [Target.CommentAnswer],
                    name: "Answers just to say Thanks!",
                    description: "Please do not add \"thanks\" as answers. Invest some time in the site and you will gain sufficient [privileges](/privileges) to upvote answers you like, which is our way of saying thank you.",
                },
                {
                    id: "default-3",
                    targets: [Target.CommentAnswer],
                    name: "Nothing but a URL (and isn't spam)",
                    description: "Whilst this may theoretically answer the question, [it would be preferable](https://meta.stackexchange.com/q/8259) to include the essential parts of the answer here, and provide the link for reference.",
                },
                {
                    id: "default-4",
                    targets: [Target.CommentAnswer],
                    name: "Requests to OP for further information",
                    description: "This is really a comment, not an answer. With a bit more rep, [you will be able to post comments](/privileges/comment). For the moment, I have added the comment for you and flagging the post for deletion.",
                },
                {
                    id: "default-5",
                    targets: [Target.CommentAnswer],
                    name: "OP using an answer for further information",
                    description: "Please use the *Post answer* button only for actual answers. You should modify your original question to add additional information.",
                },
                {
                    id: "default-6",
                    targets: [Target.CommentAnswer],
                    name: "OP adding a new question as an answer",
                    description: "If you have another question, please ask it by clicking the [Ask Question](/questions/ask) button.",
                },
                {
                    id: "default-7",
                    targets: [Target.CommentAnswer],
                    name: 'Another user adding a "Me too!"',
                    description: "If you have a *new* question, please ask it by clicking the [Ask Question](/questions/ask) button. If you have sufficient reputation, [you may upvote](/privileges/vote-up) the question. Alternatively, \"star\" it as a favorite, and you will be notified of any new answers.",
                },
                {
                    id: "default-8",
                    targets: [Target.Closure],
                    name: "Too localized",
                    description: "This question appears to be off-topic because it is too localized.",
                },
                {
                    id: "default-9",
                    targets: [Target.EditSummaryQuestion],
                    name: "Improper tagging",
                    description: "The tags you used are not appropriate for the question. Please review [What are tags, and how should I use them?](/help/tagging)",
                },
            ];
            if (!Store.load("WelcomeMessage", ""))
                Store.save("WelcomeMessage", "Welcome to ".concat(sitename, "! "));
            var addStyles = function () {
                var style = document.createElement("style");
                document.head.append(style);
                var sheet = style.sheet;
                if (!sheet)
                    return;
                var arc = "auto-review-comments";
                var popupWidth = "690px";
                [
                    ".inline-editor button[id^='submit-button'] {\n                    width: unset !important;\n                }",
                    ".".concat(arc, ".popup{\n                    z-index: 9999;\n                    position:absolute;\n                    top: calc(100vh / 3);\n                    left: calc(50vw - ").concat(popupWidth, "/2);\n                    display:block;\n                    width:").concat(popupWidth, ";\n                    padding:15px 15px 10px;\n                }"),
                    ".".concat(arc, ".popup .svg-icon.mute-text a {\n                    color: var(--black-500);\n                }"),
                    ".".concat(arc, ".popup .main .view {\n                    padding: 1vh 1vw;\n                }"),
                    ".".concat(arc, ".popup .close:hover {\n                    cursor: pointer;\n                }"),
                    ".".concat(arc, ".popup .main .userinfo{\n                    padding:5px;\n                    margin-bottom:7px;\n                }"),
                    ".".concat(arc, ".popup .main .remoteurl {\n                    display: block;\n                    width: 100%;\n                }"),
                    ".".concat(arc, ".popup .main .action-list{\n                    max-height: 400px;\n                }"),
                    ".".concat(arc, ".popup .main .action-list li{\n                    padding:0;\n                    transition:.1s\n                }"),
                    ".".concat(arc, ".popup .main .action-list li:hover {\n                    background-color: var(--black-075)\n                }"),
                    ".".concat(arc, ".popup .main .action-list li label{\n                    position:relative;\n                    display:block;\n                    padding:10px;\n                }"),
                    ".".concat(arc, ".popup .main .action-list li label .action-name {\n                    display: block;\n                    margin-bottom: 3px;\n                    cursor: default;\n                    margin: 0 0 1vh 0;\n                }"),
                    ".".concat(arc, ".popup .main .action-list li label .action-desc {\n                    margin: 0;\n                    padding: 0;\n                    cursor: default;\n                }"),
                    ".".concat(arc, ".popup .main .action-list li label .quick-insert{\n                    display: none;\n                    transition: .3s;\n                }"),
                    ".".concat(arc, ".popup .main .action-list li:hover label .quick-insert{\n                    display:block\n                }"),
                    ".".concat(arc, ".popup .main .action-list li label .quick-insert:hover{\n                    background-color:#222;\n                    color:#fff\n                }"),
                    ".".concat(arc, ".announcement strong:first-child {\n                    display: block;\n                }"),
                    ".".concat(arc, ".announcement{\n                    padding:7px;\n                    margin-bottom:10px;\n                    background:orange;\n                    font-size:15px;\n                }"),
                    ".".concat(arc, ".announcement .notify-close{\n                    display:block;\n                    float:right;\n                    margin:0 4px;\n                    padding:0 4px;\n                    border:2px solid black;\n                    cursor:pointer;\n                    line-height:17px;\n                }"),
                    ".".concat(arc, ".announcement .notify-close a{\n                    color:black;\n                    text-decoration:none;\n                    font-weight:bold;\n                    font-size:16px;\n                }"),
                    ".".concat(arc, ".popup code {\n                    display: inline-block;\n                    margin: 1px;\n                    padding: 0px;\n                    background: none;\n                    border: 1px solid var(--black-200);\n                    border-radius: 2px;\n                    line-height: 1.5;\n                }"),
                ].forEach(function (rule) { return sheet.insertRule(rule); });
            };
            var makeTextInput = function (id, options) {
                var _a;
                if (options === void 0) { options = {}; }
                var _b = options.value, value = _b === void 0 ? "" : _b, _c = options.classes, classes = _c === void 0 ? [] : _c, _d = options.placeholder, placeholder = _d === void 0 ? "" : _d, title = options.title;
                var input = document.createElement("input");
                (_a = input.classList).add.apply(_a, __spreadArray([], __read(classes), false));
                input.type = "text";
                input.id = input.name = id;
                input.placeholder = placeholder;
                input.value = value;
                if (title)
                    input.title = title;
                return input;
            };
            var makeCheckbox = function (id, options) {
                var _a;
                if (options === void 0) { options = {}; }
                var _b = options.checked, checked = _b === void 0 ? false : _b, _c = options.classes, classes = _c === void 0 ? [] : _c;
                var input = document.createElement("input");
                (_a = input.classList).add.apply(_a, __spreadArray([], __read(classes), false));
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
                (_a = el.classList).add.apply(_a, __spreadArray([], __read(classes), false));
                return el;
            };
            var makeStacksTextArea = function (id, options) {
                if (options === void 0) { options = {}; }
                var _a = options.label, label = _a === void 0 ? "" : _a, _b = options.rows, rows = _b === void 0 ? 1 : _b, _c = options.value, value = _c === void 0 ? "" : _c;
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
                area.rows = rows;
                wrap.append(area);
                return [wrap, area];
            };
            var makeStacksIcon = function (icon, path) {
                var _a;
                var classes = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    classes[_i - 2] = arguments[_i];
                }
                var NS = "http://www.w3.org/2000/svg";
                var svg = document.createElementNS(NS, "svg");
                (_a = svg.classList).add.apply(_a, __spreadArray(["svg-icon", icon], __read(classes), false));
                svg.setAttribute("aria-hidden", "true");
                svg.setAttribute("width", "18");
                svg.setAttribute("height", "18");
                svg.setAttribute("viewBox", "0 0 18 18");
                var d = document.createElementNS(NS, "path");
                d.setAttribute("d", path);
                svg.append(d);
                return [svg, d];
            };
            var makeStacksIconInput = function (id, icon, path, options) {
                if (options === void 0) { options = {}; }
                var label = options.label, _a = options.classes, classes = _a === void 0 ? [] : _a, _b = options.iconClasses, iconClasses = _b === void 0 ? [] : _b, _c = options.inputClasses, inputClasses = _c === void 0 ? [] : _c, inputOptions = __rest(options, ["label", "classes", "iconClasses", "inputClasses"]);
                var wrap = el.apply(void 0, __spreadArray(["div", "ps-relative"], __read(classes), false));
                if (label) {
                    var lbl = el("label", "flex--item", "s-label");
                    lbl.htmlFor = id;
                    lbl.textContent = label;
                    wrap.append(lbl);
                }
                var input = makeTextInput(id, __assign(__assign({}, inputOptions), { classes: __spreadArray(["s-input"], __read(inputClasses), false) }));
                var _d = __read(makeStacksIcon.apply(void 0, __spreadArray([icon,
                    path,
                    "s-input-icon"], __read(iconClasses), false)), 1), iconSVG = _d[0];
                wrap.append(input, iconSVG);
                return [wrap, input];
            };
            var makeStacksURLInput = function (id, schema, options) {
                if (options === void 0) { options = {}; }
                var label = options.label, inputOptions = __rest(options, ["label"]);
                var wrap = el("div", "d-flex", "gs4", "gsy", "fd-column");
                if (label) {
                    var lbl = el("label", "flex--item", "s-label");
                    lbl.htmlFor = id;
                    lbl.textContent = label;
                    wrap.append(lbl);
                }
                var iwrap = el("div", "d-flex");
                var ischema = el("div", "flex--item", "s-input-fill", "order-first");
                ischema.textContent = schema;
                var iinput = el("div", "d-flex", "fl-grow1", "ps-relative");
                var input = makeTextInput(id, __assign({ classes: ["flex--item", "s-input", "blr0"] }, inputOptions));
                iinput.append(input);
                iwrap.append(ischema, iinput);
                wrap.append(iwrap);
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
            var makeStacksToggle = function (id, label, options) {
                if (options === void 0) { options = {}; }
                var _a = options.state, state = _a === void 0 ? false : _a, _b = options.type, type = _b === void 0 ? "postfixed" : _b;
                var wrap = el("div", "d-flex", "ai-center", "gs8");
                var lbl = el("label", "flex--item", "s-label");
                lbl.htmlFor = id;
                lbl.textContent = label;
                var iwrap = el("div", "flex--item", "s-toggle-switch");
                var input = makeCheckbox(id, { checked: state });
                var lever = el("div", "s-toggle-switch--indicator");
                iwrap.append(input, lever);
                wrap.append.apply(wrap, __spreadArray([], __read((type === "postfixed" ? [lbl, iwrap] : [iwrap, lbl])), false));
                return [wrap, input];
            };
            var makeButton = function (text, title, options) {
                if (options === void 0) { options = {}; }
                var id = options.id, _a = options.classes, classes = _a === void 0 ? [] : _a;
                var button = el.apply(void 0, __spreadArray(["button", "s-btn"], __read(classes), false));
                button.innerHTML = text;
                if (id)
                    button.id = id;
                if (title)
                    button.title = title;
                return button;
            };
            var makeStacksIconButton = function (icon, title, path, options) {
                if (options === void 0) { options = {}; }
                var url = options.url, _a = options.classes, classes = _a === void 0 ? [] : _a;
                var NS = "http://www.w3.org/2000/svg";
                var _b = __read(makeStacksIcon.apply(void 0, __spreadArray([icon, path], __read(classes), false)), 2), svg = _b[0], d = _b[1];
                var ttl = document.createElementNS(NS, "title");
                ttl.textContent = title;
                if (url) {
                    var anchor = document.createElementNS(NS, "a");
                    anchor.setAttribute("href", url);
                    anchor.setAttribute("target", "_blank");
                    anchor.append(ttl, d);
                    svg.append(anchor);
                    return svg;
                }
                svg.append(ttl);
                return svg;
            };
            var getCommentTargetsFromName = function (name) {
                var targets = [];
                var _a = __read(/^\[([\w,]+?)\]\s+/i.exec(name) || [], 2), serialized = _a[1];
                if (!serialized)
                    return targets;
                var mapped = serialized.split(",");
                return __spreadArray(__spreadArray([], __read(targets), false), __read(mapped), false);
            };
            var trimCommentTargetFromName = function (name) {
                return name.replace(/^\[([\w,]+?)\]\s+/, "");
            };
            var updateCurrentTab = function (tabs, active) {
                tabs.forEach(function (_a) {
                    var classList = _a.classList;
                    return classList.remove("is-selected");
                });
                active === null || active === void 0 ? void 0 : active.classList.add("is-selected");
            };
            var makeViewSwitcher = function (popup, viewsSel) { return function (view) {
                document
                    .querySelectorAll(viewsSel)
                    .forEach(hide);
                show(view);
                var _a = __read(view.id.split("-"), 1), currentId = _a[0];
                var tabButtons = __spreadArray([], __read(popup.querySelectorAll("[id$=-tab]")), false);
                var currentTab = tabButtons.find(function (t) { return t.id === "".concat(currentId, "-tab"); });
                updateCurrentTab(tabButtons, currentTab);
                Store.save("CurrentView", view.id);
                debugLogger.log("switched to view: ".concat(view.id));
                return view;
            }; };
            var makeTabsView = function (popup, id) {
                if (makeTabsView.view)
                    return makeTabsView.view;
                var wrap = el("div", "view", "d-flex", "ai-center", "jc-space-between");
                wrap.id = id;
                wrap.setAttribute("data-se-draggable-target", "handle");
                var tabGroup = el("div", "s-btn-group", "flex--item");
                var btnGroupClasses = ["s-btn__muted", "s-btn__outlined"];
                var buttons = [
                    makeButton("search", "search", {
                        id: "search-tab",
                        classes: __spreadArray(__spreadArray([], __read(btnGroupClasses), false), [
                            "popup-actions-search"
                        ], false)
                    }),
                    makeButton("import/export", "import/export all comments", {
                        id: "impexp-tab",
                        classes: __spreadArray(__spreadArray([], __read(btnGroupClasses), false), [
                            "popup-actions-impexp"
                        ], false)
                    }),
                    makeButton("remote", "setup remote source", {
                        id: "remote-tab",
                        classes: __spreadArray(__spreadArray([], __read(btnGroupClasses), false), [
                            "popup-actions-remote"
                        ], false)
                    }),
                    makeButton("welcome", "configure welcome", {
                        id: "welcome-tab",
                        classes: __spreadArray(__spreadArray([], __read(btnGroupClasses), false), [
                            "popup-actions-welcome"
                        ], false)
                    }),
                    makeButton("settings", "configure ARC", {
                        id: "settings-tab",
                        classes: __spreadArray(__spreadArray([], __read(btnGroupClasses), false), [
                            "popup-actions-settings"
                        ], false)
                    }),
                ];
                tabGroup.append.apply(tabGroup, __spreadArray([], __read(buttons), false));
                tabGroup.addEventListener("click", function (_a) {
                    var target = _a.target;
                    updateCurrentTab(buttons, target);
                });
                var iconGroup = el("div", "d-flex", "flex--item", "gs8", "ba", "bar-pill", "bc-black-300");
                var iconClasses = ["flex--item", "mute-text"];
                var seeBtn = makeStacksIconButton("iconEye", "see through", "M9.06 3C4 3 1 9 1 9s3 6 8.06 6C14 15 17 9 17 9s-3-6-7.94-6zM9\n             13a4 4 0 110-8 4 4 0 0 1 0 8zm0-2a2 2 0 002-2 2 2 0 0 0-2-2 2\n             2 0 0 0-2 2 2 2 0 0 0 2 2z", { classes: iconClasses });
                seeBtn.addEventListener("mouseenter", function () {
                    fadeTo(popup, 0.4);
                    var main = seeBtn.closest(".main");
                    if (main)
                        fadeOut(main);
                });
                seeBtn.addEventListener("mouseleave", function () {
                    fadeTo(popup, 1.0);
                    var main = seeBtn.closest(".main");
                    if (main)
                        fadeTo(main, 1);
                });
                var info = makeStacksIconButton("iconInfo", "see info about ARC (v".concat(VERSION, ")"), "M9 1a8 8 0 110 16A8 8 0 019 1zm1 13V8H8v6h2zm0-8V4H8v2h2z", { url: GITHUB_URL, classes: iconClasses });
                var closeWrap = el("div", "flex--item");
                var close = makeStacksIconButton("iconClear", "Close popup", "M15 4.41 13.59 3 9 7.59 4.41 3 3 4.41 7.59 9 3 13.59 4.41 15 9 10.41 13.59 15 15 13.59 10.41 9 15 4.41z", { classes: ["mute-text", "close"] });
                close.addEventListener("click", function () {
                    fadeOut(popup);
                    hide(popup);
                });
                var actionGroup = el("div", "d-flex", "gsx", "gs16", "ai-center", "flex--item");
                closeWrap.append(close);
                iconGroup.append(seeBtn, info);
                actionGroup.append(iconGroup, closeWrap);
                wrap.append(tabGroup, actionGroup);
                return (makeTabsView.view = wrap);
            };
            var makeSettingsView = function (popup, id) {
                if (makeSettingsView.view)
                    return makeSettingsView.view;
                var view = el("div", "view", "d-flex", "fd-column", "gs16");
                view.id = id;
                var generalWrap = el("div", "flex--item", "gsy", "gs24");
                var dangerWrap = el("div", "flex--item");
                var _a = __read(makeStacksToggle("toggleDescr", "hide comment descriptions", {
                    state: Store.load("hide-desc", false),
                    type: "prefixed"
                }), 1), descrToggle = _a[0];
                var _b = __read(makeStacksToggle("toggleDebug", "ARC debug mode", {
                    state: Store.load("debug", false),
                    type: "prefixed"
                }), 1), debugToggle = _b[0];
                var resetBtn = makeButton("reset custom comments", "resets any saved custom comments", {
                    classes: [
                        "popup-actions-reset",
                        "s-btn__outlined",
                        "s-btn__danger"
                    ]
                });
                generalWrap.append(descrToggle, debugToggle);
                dangerWrap.append(resetBtn);
                view.append(generalWrap, dangerWrap);
                popup.addEventListener("click", function (_a) {
                    var target = _a.target;
                    runFromHashmap({
                        ".popup-actions-reset": function (p, t) {
                            resetComments(commentDefaults);
                            updateComments(p, t);
                        },
                        "#toggleDebug": function () {
                            Store.toggle("debug");
                        },
                        "#toggleDescr": function (p) {
                            return toggleDescriptionVisibility(p, Store.toggle("hide-desc"));
                        },
                    }, function (key) { return target.matches(key); }, popup, Store.load("post_target", Target.CommentQuestion));
                });
                return (makeSettingsView.view = view);
            };
            var makeSearchView = function (popup, id) {
                if (makeSearchView.view)
                    return makeSearchView.view;
                var wrap = document.createElement("div");
                wrap.classList.add("view");
                wrap.id = id;
                var header = document.createElement("h2");
                header.innerHTML = "Which review comment to insert?";
                var uinfo = document.createElement("div");
                uinfo.classList.add("userinfo");
                uinfo.id = "userinfo";
                var _a = __read(makeStacksIconInput("comment-search", "iconSearch", "m18 16.5-5.14-5.18h-.35a7 7 0 10-1.19 1.19v.35L16.5 18l1.5-1.5zM12 7A5 5 0 112 7a5 5 0 0110 0z", {
                    placeholder: "filter the comments list",
                    classes: ["flex--item", "d-flex", "fd-column"],
                    iconClasses: ["s-input-icon__search", "flex--item"],
                    inputClasses: ["s-input__search"],
                }), 2), searchWrap = _a[0], searchInput = _a[1];
                setupSearchHandlers(popup, searchInput);
                var actions = el("ul", "action-list", "overflow-y-scroll", "d-flex", "fd-column", "mt16");
                wrap.append(header, uinfo, searchWrap, actions);
                return (makeSearchView.view = wrap);
            };
            var makeWelcomeView = function (popup, id, commentTarget) {
                if (makeWelcomeView.view)
                    return makeWelcomeView.view;
                var view = el("div", "view", "d-flex", "fd-column", "gsy", "gs16");
                view.id = id;
                var _a = __read(makeStacksIconInput("customwelcome", "iconSearch", "m18 16.5-5.14-5.18h-.35a7 7 0 10-1.19 1.19v.35L16.5 18l1.5-1.5zM12 7A5 5 0 112 7a5 5 0 0110 0z", {
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
                }), 2), welcomeWrap = _a[0], input = _a[1];
                input.classList.add("flex--item");
                input.addEventListener("change", function () {
                    Store.save("WelcomeMessage", input.value);
                    updateComments(popup, commentTarget);
                });
                welcomeWrap.append(input);
                var actionsWrap = el("div", "flex--item", "d-flex", "gsx", "gs8");
                var actions = [
                    makeButton("force", "force", {
                        classes: [
                            "welcome-force", "s-btn__primary",
                            "s-btn__filled",
                            "flex--item"
                        ]
                    }),
                    makeButton("cancel", "cancel", {
                        classes: [
                            "welcome-cancel",
                            "s-btn__danger",
                            "s-btn__outlined",
                            "flex--item"
                        ]
                    }),
                ];
                var viewSwitcher = makeViewSwitcher(popup, viewsSel);
                popup.addEventListener("click", function (_a) {
                    var target = _a.target;
                    runFromHashmap({
                        ".popup-actions-welcome": function () {
                            input.value || (input.value = Store.load("WelcomeMessage", ""));
                        },
                        ".welcome-cancel": function (p, t) {
                            return viewSwitcher(makeSearchView(p, "search-popup", t));
                        },
                        ".welcome-force": function (p, t) {
                            Store.save("ShowGreeting", true);
                            updateComments(p, t);
                        },
                    }, function (key) { return target.matches(key); }, popup, Store.load("target", commentTarget));
                });
                actionsWrap.append.apply(actionsWrap, __spreadArray([], __read(actions), false));
                view.append(welcomeWrap, actionsWrap);
                return (makeWelcomeView.view = view);
            };
            var updateImpExpComments = function (view) {
                var area = view.querySelector("textarea");
                if (!area) {
                    debugLogger.log("missing imp/exp textarea");
                    return view;
                }
                var loaded = loadComments();
                var content = loaded
                    .map(function (_a) {
                    var name = _a.name, description = _a.description, targets = _a.targets;
                    var safeTargets = targets || getCommentTargetsFromName(name);
                    return "###[".concat(safeTargets.join(","), "] ").concat(name, "\n").concat(HTMLtoMarkdown(description));
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
                    rows: 20
                }), 2), areaWrap = _a[0], area = _a[1];
                var handleChange = function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        importComments(area.value);
                        updateComments(popup, postType);
                        return [2];
                    });
                }); };
                area.addEventListener("change", handleChange);
                var actionWrap = el("div", "actions", "flex--item");
                var buttonsWrap = el("div", "d-flex", "gs8", "gsx");
                var toJsonBtn = makeButton("JSON", "Convert to JSON", {
                    classes: [
                        "s-btn__primary",
                        "flex--item"
                    ]
                });
                var toMarkdownBtn = makeButton("Markdown", "Go back to Markdown view", {
                    classes: [
                        "s-btn__primary",
                        "flex--item",
                        "d-none"
                    ]
                });
                toMarkdownBtn.addEventListener("click", function () {
                    area.addEventListener("change", handleChange);
                    hide(toMarkdownBtn);
                    show(toJsonBtn);
                    show(cancelBtn);
                    updateImpExpComments(view);
                });
                var cancelBtn = makeButton("cancel", "cancel import/export", {
                    classes: [
                        "s-btn__danger",
                        "flex--item"
                    ]
                });
                var viewSwitcher = makeViewSwitcher(popup, viewsSel);
                cancelBtn.addEventListener("click", function () {
                    return viewSwitcher(makeSearchView(popup, "search-popup", postType));
                });
                buttonsWrap.append(toMarkdownBtn, toJsonBtn, cancelBtn);
                actionWrap.append(buttonsWrap);
                var flexItemTextareaWrapper = el("div", "flex--item");
                var flexItemActionWrap = el("div", "flex--item");
                flexItemTextareaWrapper.append(areaWrap);
                flexItemActionWrap.append(actionWrap);
                view.append(flexItemTextareaWrapper, flexItemActionWrap);
                toJsonBtn.addEventListener("click", function () {
                    var _a;
                    var loaded = loadComments();
                    var content = JSON.stringify(loaded, null, 4);
                    area.value = content;
                    (_a = view.querySelector("textarea")) === null || _a === void 0 ? void 0 : _a.classList.add("ff-mono");
                    hide(toJsonBtn);
                    hide(cancelBtn);
                    show(toMarkdownBtn);
                    area.removeEventListener("change", handleChange);
                });
                return (makeImpExpView.view = updateImpExpComments(view));
            };
            var scheme = function (url) {
                return /^https?:\/\//.test(url) ? url : "https://".concat(url);
            };
            var unscheme = function (url) { return url.replace(/^https?:\/\//, ""); };
            var updateRemoteURL = function (key, inputId) {
                var input = document.getElementById(inputId);
                if (!input)
                    return false;
                input.value = unscheme(Store.load(key, ""));
                return true;
            };
            var makeOnRemoteChange = function (storeKey, input) {
                return function () {
                    var value = input.value;
                    Store.save(storeKey, scheme(unscheme(value)));
                    input.value = unscheme(value);
                };
            };
            var makeRemoteView = function (popup, id, commentTarget) {
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
                var initialURL = unscheme(Store.load(storeKeyJSONP, ""));
                var inputWrap = el("div", "d-flex", "fd-column", "gs8");
                var _a = __read(makeStacksURLInput(storeKeyJSON, initialScheme, {
                    label: "JSON source",
                    value: initialURL,
                }), 4), jsonWrap = _a[0], jsonIWrap = _a[2], jsonInput = _a[3];
                var _b = __read(makeStacksURLInput(storeKeyJSONP, initialScheme, {
                    label: "JSONP source",
                    value: initialURL,
                }), 4), jsonpWrap = _b[0], jsonpIWrap = _b[2], jsonpInput = _b[3];
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
                var commonBtnClasses = [
                    "s-btn__muted",
                    "s-btn__outlined",
                    "ml8",
                ];
                var getJSONbtn = makeButton(getNowText, "get JSON remote", {
                    classes: __spreadArray([
                        "remote-json-get"
                    ], __read(commonBtnClasses), false)
                });
                var getJSONPbtn = makeButton(getNowText, "get JSONP remote", {
                    classes: __spreadArray([
                        "remote-jsonp-get"
                    ], __read(commonBtnClasses), false)
                });
                popup.addEventListener("click", function (_a) {
                    var target = _a.target;
                    runFromHashmap({
                        ".remote-json-get": function () { return __awaiter(void 0, void 0, void 0, function () {
                            var url;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        url = jsonInput.value;
                                        if (!url) {
                                            notify("JSON remote URL is not provided", "warning");
                                            return [2];
                                        }
                                        getJSONbtn.classList.add("is-loading");
                                        return [4, fetchFromRemote(scheme(url))];
                                    case 1:
                                        _a.sent();
                                        updateComments(popup, commentTarget);
                                        getJSONbtn.classList.remove("is-loading");
                                        return [2];
                                }
                            });
                        }); },
                        ".remote-jsonp-get": function () { return __awaiter(void 0, void 0, void 0, function () {
                            var url;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        url = jsonpInput.value;
                                        if (!url) {
                                            notify("JSONP remote URL is not provided", "warning");
                                            return [2];
                                        }
                                        getJSONPbtn.classList.add("is-loading");
                                        return [4, fetchFromRemote(scheme(url), true)];
                                    case 1:
                                        _a.sent();
                                        updateComments(popup, commentTarget);
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
            var insertComment = function (html, op) {
                var md = HTMLtoMarkdown(html)
                    .replace(/\[username\]/g, "")
                    .replace(/\[OP\]/g, op);
                var input = document.querySelector("[data-arc=current]");
                if (!input) {
                    console.debug("missing comment box to insert to");
                    return;
                }
                input.value = md;
                input.focus();
                var hereTxt = "[type here]";
                var caret = md.indexOf(hereTxt);
                if (caret >= 0)
                    input.setSelectionRange(caret, caret + hereTxt.length);
            };
            var makePopup = function (target) {
                if (makePopup.popup)
                    return makePopup.popup;
                var popup = el("div", "auto-review-comments", "popup");
                var main = el("div", "main");
                main.id = "main";
                var viewSwitcher = makeViewSwitcher(popup, viewsSel);
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
                        ".popup-actions-search": function (p, t) {
                            return viewSwitcher(makeSearchView(p, "search-popup", t));
                        },
                    }, function (sel) { return target.matches(sel); }, popup, Store.load("post_target", Target.CommentQuestion));
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
                var initPostType = Store.load("post_target", target);
                debugLogger.log({ initPostType: initPostType, target: target });
                var views = viewsMap.map(function (_a) {
                    var _b = __read(_a, 2), id = _b[0], maker = _b[1];
                    return maker(popup, id, initPostType);
                });
                var visibleViews = 2;
                var hidden = views.slice(visibleViews);
                hidden.forEach(hide);
                main.append.apply(main, __spreadArray([], __read(views), false));
                popup.append(main);
                setupCommentHandlers(popup, commentViewId);
                var view = views.find(function (_a) {
                    var id = _a.id;
                    return id === commentViewId;
                });
                makeViewSwitcher(popup, viewsSel)(view);
                return (makePopup.popup = popup);
            };
            var span = function (text, options) {
                var _a;
                if (options === void 0) { options = {}; }
                var _b = options.classes, classes = _b === void 0 ? [] : _b, _c = options.unsafe, unsafe = _c === void 0 ? false : _c, _d = options.title, title = _d === void 0 ? "" : _d;
                var el = document.createElement("span");
                (_a = el.classList).add.apply(_a, __spreadArray([], __read(classes), false));
                unsafe ? (el.innerHTML = text) : (el.innerText = text);
                if (title)
                    el.title = title;
                return el;
            };
            var makeCommentItem = function (id, name, desc) {
                var li = el("li", "pr8");
                var reviewRadio = el("input");
                reviewRadio.id = "comment-".concat(id);
                reviewRadio.type = "radio";
                reviewRadio.name = "commentreview";
                reviewRadio.hidden = true;
                var lbl = el("label", "d-flex", "fw-wrap", "jc-space-between");
                lbl.htmlFor = reviewRadio.id;
                var nameEl = el("span", "action-name", "flex--item12");
                nameEl.id = "name-".concat(id);
                nameEl.innerHTML = name;
                var descEl = el("span", "action-desc", "flex--item11");
                descEl.id = "desc-".concat(id);
                descEl.innerHTML = desc;
                var insertBtn = makeButton("↓", "insert comment", {
                    classes: [
                        "s-btn",
                        "s-btn__muted",
                        "s-btn__outlined",
                        "quick-insert"
                    ]
                });
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
                var pad = function (number) {
                    return number < 10 ? "0".concat(number) : number;
                };
                var date = new Date(epochSeconds * 1000);
                var thisYear = new Date().getUTCFullYear();
                var thatDateShortYear = date
                    .getUTCFullYear()
                    .toString()
                    .substring(2);
                return ([
                    months[date.getUTCMonth()],
                    date.getUTCDate(),
                    date.getUTCFullYear() !== thisYear
                        ? "'".concat(thatDateShortYear)
                        : "",
                    "at",
                    [
                        date.getUTCHours(),
                        ":",
                        pad(date.getUTCMinutes()),
                    ].join(""),
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
                    }) || [, ""];
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
                    return "".concat(unitElapsed, " ").concat(type).concat(pluralS, " ago");
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
                var shortenedRep = range
                    ? (reputationNumber / range.divider).toFixed(1) + range.suffix
                    : reputationNumber.toString();
                return shortenedRep.replace('.0', '');
            };
            var getLoggedInUserId = function (se) { var _a; return ((_a = se.options.user.userId) === null || _a === void 0 ? void 0 : _a.toString()) || ""; };
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
            var isNewUser = function (creation_date, reputation) {
                return [
                    Date.now() / 1000 - creation_date < timeUnits.month,
                    reputation < 10
                ].some(Boolean);
            };
            var getOP = function (refresh) {
                if (refresh === void 0) { refresh = false; }
                if (getOP.op && !refresh)
                    return getOP.op;
                var question = document.getElementById("question");
                if (!question) {
                    var review = document.querySelector(".js-review-editor");
                    var userLink = review.querySelector(".s-post-summary--meta .s-user-card--link");
                    return (userLink === null || userLink === void 0 ? void 0 : userLink.textContent) || "OP";
                }
                var userlink = question.querySelector(userLinkSel);
                if (userlink)
                    return userlink.textContent || "OP";
                var deleted = question.querySelector(".owner .user-details");
                return (getOP.op = (deleted && deleted.innerHTML) || "OP");
            };
            var capitalize = function (text) {
                return text[0].toUpperCase() + text.slice(1).toLowerCase();
            };
            var b = function (text) {
                var strong = document.createElement("strong");
                strong.innerHTML = text;
                return strong;
            };
            var makeB = function (element) {
                return element.classList.add("fw-bold");
            };
            var link = function (url, label) {
                if (label === void 0) { label = url; }
                var a = document.createElement("a");
                a.href = url;
                a.target = "_blank";
                a.innerHTML = label;
                return a;
            };
            var text = function (data) { return document.createTextNode(data); };
            var addUserInfo = function (userInfo) {
                var _a;
                var container = document.getElementById("userinfo");
                if (!container)
                    return;
                var user_id = userInfo.user_id, creation_date = userInfo.creation_date, display_name = userInfo.display_name, last_access_date = userInfo.last_access_date, reputation = userInfo.reputation, user_type = userInfo.user_type;
                var newUserState = isNewUser(creation_date, reputation);
                Store.save("ShowGreeting", newUserState);
                if (newUserState) {
                    (_a = container
                        .querySelector(".action-desc")) === null || _a === void 0 ? void 0 : _a.prepend(Store.load("WelcomeMessage", ""));
                }
                var userLink = link("/users/".concat(user_id), "");
                userLink.append(b(display_name));
                empty(container);
                var relativeTimeClass = "relativetime";
                var _b = __read([
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
                }), 2), prettyCreation = _b[0], prettyLastSeen = _b[1];
                container.append(capitalize(user_type), text(" user "), userLink, text(", joined "), prettyCreation, text(", last seen "), prettyLastSeen, text(", reputation "), b(shortenReputationNumber(reputation)));
            };
            var getUserInfo = function (userid) { return __awaiter(void 0, void 0, void 0, function () {
                var url, res, _a, userInfo;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            url = new URL("https://api.stackexchange.com/".concat(API_VER, "/users/").concat(userid));
                            url.search = new URLSearchParams({
                                site: site,
                                key: API_KEY,
                                filter: FILTER_UNSAFE,
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
            var areSameLength = function () {
                var arrays = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    arrays[_i] = arguments[_i];
                }
                return new Set(arrays.map(function (a) { return a.length; })).size === 1;
            };
            var importComments = function (text) {
                var lines = text.split("\n");
                var names = [];
                var descs = [];
                var targets = [];
                lines.forEach(function (line) {
                    var ln = line.trim();
                    if (ln.startsWith("#")) {
                        var name_1 = ln.replace(/^#+/, "");
                        names.push(name_1);
                        targets.push(getCommentTargetsFromName(name_1));
                        return;
                    }
                    if (ln)
                        return descs.push(tag(ln));
                });
                if (!areSameLength(names, descs, targets)) {
                    debugLogger.log({ names: names, descs: descs, targets: targets });
                    return notify("Failed to import: titles and descriptions do not match", "danger");
                }
                var comments = names.map(function (name, idx) {
                    return {
                        id: idx.toString(),
                        name: trimCommentTargetFromName(name),
                        description: descs[idx],
                        targets: getCommentTargetsFromName(name)
                    };
                });
                Store.save("comments", comments);
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
                return String(html).replace(/(?<!.*?`)[&<>](?!.*?`)/gm, function (s) { return entityMapToHtml[s]; });
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
                var html = escapeHtml(markdown);
                var rules = [
                    [/(?<!`.*?(?=.+`))([*_]{2})(.+?)\1/g, htmlstrong(__makeTemplateObject(["$2"], ["$2"]))],
                    [/(?<!`.*?(?=.+`))([*_])([^`*_]+?)\1(?![*_])/g, htmlem(__makeTemplateObject(["$2"], ["$2"]))],
                    [/`(.+?)`/g, htmlinlinecode(__makeTemplateObject(["$1"], ["$1"]))],
                    [/\[([^\]]+)\]\((.+?)\)/g, htmllink("$2", "$1")],
                ];
                return rules.reduce(function (a, _a) {
                    var _b = __read(_a, 2), expr = _b[0], replacer = _b[1];
                    return a.replace(expr, replacer);
                }, html);
            };
            var untag = function (text) {
                return text
                    .replace(/\$SITENAME\$/g, sitename)
                    .replace(/\$SITEURL\$/g, site)
                    .replace(/\$MYUSERID\$/g, getLoggedInUserId(StackExchange));
            };
            var tag = function (markdown) {
                var regname = new RegExp(sitename, "g");
                var regurl = new RegExp("//".concat(site), "g");
                var reguid = new RegExp("/".concat(getLoggedInUserId(StackExchange), "[)]"), "g");
                return markdown
                    .replace(regname, "$SITENAME$")
                    .replace(regurl, "//$SITEURL$")
                    .replace(reguid, "/$MYUSERID$)");
            };
            var closeEditMode = function (popup, commentElem, value) {
                empty(commentElem);
                commentElem.innerHTML = value;
                commentElem.closest("li").querySelector("input").disabled =
                    false;
                commentElem.dataset.mode = "insert";
                popup
                    .querySelectorAll(".quick-insert")
                    .forEach(show);
            };
            var openEditMode = function (commentElem, popup) {
                var id = commentElem.id, dataset = commentElem.dataset, _a = commentElem.dataset.mode, mode = _a === void 0 ? "insert" : _a;
                if (mode === "edit")
                    return;
                var commentId = id.replace("desc-", "");
                var comments = Store.load("comments", []);
                var originalComment = comments.find(function (c) { return c.id === commentId; });
                if (!originalComment) {
                    debugLogger.log("failed to find edited comment (".concat(commentId, ")"));
                    return;
                }
                var description = originalComment.description;
                empty(commentElem);
                var replaceVars = makeVariableReplacer({
                    site: site,
                    sitename: sitename,
                    myId: getLoggedInUserId(StackExchange),
                    opName: getOP(),
                });
                var initialHTML = markdownToHTML(replaceVars(description));
                var preview = el("span", "d-inline-block", "p8");
                preview.innerHTML = initialHTML;
                var _b = __read(makeStacksTextArea(commentElem.id, { value: description }), 2), areaWrap = _b[0], area = _b[1];
                area.addEventListener("input", function (_a) {
                    var target = _a.target;
                    var value = target.value;
                    preview.innerHTML = markdownToHTML(replaceVars(value));
                });
                area.addEventListener("change", function (_a) {
                    var target = _a.target;
                    var value = target.value;
                    var updatedComment = __assign(__assign({}, originalComment), { description: value });
                    closeEditMode(popup, commentElem, replaceVars(saveComment(updatedComment)));
                });
                commentElem.closest("li").querySelector("input").disabled =
                    true;
                popup
                    .querySelectorAll(".quick-insert")
                    .forEach(hide);
                var actions = document.createElement("div");
                actions.classList.add("actions");
                var cancel = makeButton("cancel", "cancel edit");
                cancel.addEventListener("click", function () {
                    popup
                        .querySelectorAll(".quick-insert")
                        .forEach(show);
                    closeEditMode(popup, commentElem, initialHTML);
                });
                actions.append(cancel);
                commentElem.append(preview, areaWrap, actions);
                var _c = window.getComputedStyle(area), paddingLeft = _c.paddingLeft, paddingRight = _c.paddingRight, font = _c.font;
                var areaHorizontalPadding = parseInt(paddingLeft) + parseInt(paddingRight);
                var lineWidth = 650 - 20 - 8 - areaHorizontalPadding;
                area.rows = getNumTextLines(description, font, lineWidth);
                area.addEventListener("input", function () {
                    var value = area.value;
                    area.rows = getNumTextLines(value, font, lineWidth);
                });
                dataset.mode = "edit";
            };
            var originalARCinterop = function (numComments) {
                debugLogger.log("original ARC interop called");
                var comments = [];
                for (var i = 0; i < numComments; i++) {
                    var name_2 = Store.load("name-".concat(i), "");
                    var desc = Store.load("desc-".concat(i), "");
                    if (!name_2 || !desc)
                        continue;
                    comments.push({
                        id: i.toString(),
                        name: trimCommentTargetFromName(name_2),
                        description: HTMLtoMarkdown(desc),
                        targets: getCommentTargetsFromName(name_2)
                    });
                }
                var status = Store.save("comments", comments);
                if (status) {
                    Store.clear("name-");
                    Store.clear("desc-");
                }
                return comments;
            };
            var loadComments = function () {
                if (Store.hasMatching("name-") || Store.hasMatching("desc-")) {
                    var numComments = Store.load("commentcount", 0);
                    return originalARCinterop(numComments);
                }
                return Store.load("comments", []);
            };
            var resetComments = function (comments) {
                return Store.save("comments", comments);
            };
            var saveComment = function (comment) {
                var description = comment.description, id = comment.id;
                var toStore = __assign(__assign({}, comment), { description: tag(description) });
                var comments = Store.load("comments", []);
                var commentIdx = comments.findIndex(function (c) { return c.id === id; });
                commentIdx === -1 ?
                    comments.push(toStore) :
                    comments.splice(commentIdx, 1, toStore);
                Store.save("comments", comments);
                return (((Store.load("ShowGreeting", false) &&
                    Store.load("WelcomeMessage", "")) ||
                    "") + untag(markdownToHTML(description)));
            };
            var switchSelectedComment = function (popup, action) {
                var acts = popup.querySelector(".action-list");
                acts === null || acts === void 0 ? void 0 : acts.querySelectorAll("li").forEach(function (_a) {
                    var classList = _a.classList;
                    return classList.remove("action-selected");
                });
                action.classList.add("action-selected");
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
                    if (Store.load("hide-desc", false)) {
                        popup
                            .querySelectorAll(".action-desc")
                            .forEach(hide);
                    }
                    var action = el.closest("li");
                    switchSelectedComment(popup, action);
                    var descr = action.querySelector(".action-desc");
                    show(descr);
                };
            };
            var makeQuickInsertHandler = function (popup) {
                return function (_a) {
                    var target = _a.target;
                    var el = target;
                    if (!el.matches("label > .quick-insert"))
                        return;
                    var action = el.closest("li");
                    var radio = action === null || action === void 0 ? void 0 : action.querySelector("input");
                    var descr = action === null || action === void 0 ? void 0 : action.querySelector(".action-desc");
                    if (!action || !radio || !descr)
                        return notify("Something went wrong", "danger");
                    switchSelectedComment(popup, action);
                    radio.checked = true;
                    insertComment(descr.innerHTML, getOP());
                };
            };
            var setupCommentHandlers = function (popup, viewId) {
                popup.addEventListener("dblclick", function (_a) {
                    var target = _a.target;
                    var el = target;
                    if (!el.matches(".action-desc"))
                        return;
                    openEditMode(el, popup);
                });
                var insertHandler = makeQuickInsertHandler(popup);
                var selectHandler = makeCommentClickHandler(popup);
                popup.addEventListener("click", function (event) {
                    var currView = Store.load("CurrentView", "search-popup");
                    debugLogger.log({ currView: currView, viewId: viewId });
                    if (currView !== viewId)
                        return;
                    insertHandler(event);
                    selectHandler(event);
                });
            };
            var makeVariableReplacer = function (options) {
                return function (text) {
                    var myId = options.myId, opName = options.opName, site = options.site, sitename = options.sitename;
                    var rules = {
                        SITENAME: sitename,
                        SITEURL: site,
                        MYUSERID: myId,
                        OP: opName,
                    };
                    return Object.entries(rules).reduce(function (a, _a) {
                        var _b = __read(_a, 2), expression = _b[0], replacement = _b[1];
                        return a.replace(new RegExp("\\$".concat(expression, "\\$"), "g"), replacement);
                    }, text);
                };
            };
            var isCommentValidForTarget = function (comment, target) {
                var targets = comment.targets;
                return targets.includes(target);
            };
            var updateComments = function (popup, target) {
                var comments = loadComments();
                if (!comments.length) {
                    resetComments(commentDefaults);
                    return updateComments(popup, target);
                }
                var ul = popup.querySelector(".action-list");
                empty(ul);
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
                var greeting = greet ? "".concat(replaceVars(welcome), " ") : "";
                debugLogger.log(__assign({ comments: comments, target: target, greet: greet, welcome: welcome, greeting: greeting }, opts));
                var listItems = comments
                    .filter(function (comment) { return isCommentValidForTarget(comment, target); })
                    .map(function (_a) {
                    var name = _a.name, id = _a.id, description = _a.description;
                    var cname = name.replace(allTgtMatcher, "");
                    var desc = replaceVars(description).replace(/\$/g, "$$$");
                    return makeCommentItem(id, cname.replace(/\$/g, "$$$"), markdownToHTML(greeting + desc));
                });
                ul.append.apply(ul, __spreadArray([], __read(listItems), false));
                toggleDescriptionVisibility(popup);
            };
            var matchText = function (source, term) {
                var strict = term.startsWith("\"") && term.endsWith("\"");
                return new RegExp(strict ? "\\b".concat(term.slice(1, -1), "\\b") : term, "gm").test(source);
            };
            var filterOn = function (popup, text) {
                var term = text.toLowerCase();
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
                    var shown = matchText(name, term) || matchText(desc, term);
                    shown ? show(item) : hide(item);
                });
            };
            var setupSearchHandlers = function (popup, searchInput) {
                var callback = function (_a) {
                    var target = _a.target;
                    return setTimeout(function () {
                        var value = target.value;
                        filterOn(popup, value);
                    }, 100);
                };
                searchInput.addEventListener("keydown", callback);
                searchInput.addEventListener("change", callback);
                searchInput.addEventListener("cut", callback);
                searchInput.addEventListener("paste", callback);
                searchInput.addEventListener("search", callback);
            };
            var toggleDescriptionVisibility = function (popup, hidden) {
                if (hidden === void 0) { hidden = Store.load("hide-desc", false); }
                popup
                    .querySelectorAll("li:not(.action-selected) .action-desc")
                    .forEach(function (d) { return (hidden ? hide(d) : show(d)); });
            };
            var getJSONP = function (url, callbackName) {
                if (callbackName === void 0) { callbackName = "callback"; }
                return new Promise(function (resolve, reject) {
                    var target = typeof unsafeWindow !== "undefined"
                        ? unsafeWindow
                        : window;
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
                    var fetcher, remoteComments, comments;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                debugLogger.log({ isJSONP: isJSONP });
                                fetcher = isJSONP ? getJSONP : getJSON;
                                return [4, fetcher(url)];
                            case 1:
                                remoteComments = _a.sent();
                                comments = remoteComments.map(function (_a, i) {
                                    var description = _a.description, name = _a.name, targets = _a.targets;
                                    return ({
                                        description: description,
                                        id: i.toString(),
                                        name: trimCommentTargetFromName(name),
                                        targets: targets || getCommentTargetsFromName(name)
                                    });
                                });
                                Store.save("comments", comments);
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
            var autoLinkAction = function (where, target) { return __awaiter(void 0, void 0, void 0, function () {
                var popup, jsonURL, jsonpURL, userid, uinfo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Store.save("post_target", target);
                            popup = makePopup(target);
                            if (!popup.isConnected)
                                document.body.append(popup);
                            showPopup(popup);
                            jsonURL = Store.load("RemoteUrl", "");
                            jsonpURL = Store.load("remote_json", "");
                            if (!(jsonpURL && Store.load("AutoRemote", false))) return [3, 2];
                            debugLogger.log("autofetching JSONP remote");
                            return [4, fetchFromRemote(jsonpURL, true)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            if (!(jsonURL && Store.load("remote_json_auto", false))) return [3, 4];
                            debugLogger.log("autofetching JSON remote");
                            return [4, fetchFromRemote(jsonURL)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            userid = getUserId(where);
                            if (!userid) return [3, 6];
                            return [4, getUserInfo(userid)];
                        case 5:
                            uinfo = _a.sent();
                            debugLogger.log({ userid: userid, uinfo: uinfo });
                            if (uinfo)
                                addUserInfo(uinfo);
                            _a.label = 6;
                        case 6:
                            updateComments(popup, target);
                            center(popup);
                            StackExchange.helpers.bindMovablePopups();
                            return [2];
                    }
                });
            }); };
            var waitFor = function (selector, context) {
                if (context === void 0) { context = document; }
                return new Promise(function (resolve) {
                    var element = context.querySelector(selector);
                    if (element)
                        resolve(element);
                    var observer = new MutationObserver(function () {
                        var element = context.querySelector(selector);
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
            var observe = function (selector, context, callback) {
                var observerCallback = function () {
                    var collection = context.querySelectorAll(selector);
                    if (collection.length)
                        callback(__spreadArray([], __read(collection), false));
                };
                var observer = new MutationObserver(observerCallback);
                observer.observe(context, {
                    attributes: true,
                    childList: true,
                    subtree: true,
                });
                observerCallback();
            };
            var addTriggerButton = function (selector, locator, injector, actor) { return __awaiter(void 0, void 0, void 0, function () {
                var content;
                return __generator(this, function (_a) {
                    content = document.getElementById("content");
                    if (!content) {
                        debugLogger.log("missing main content");
                        return [2];
                    }
                    observe(selector, content, function (targets) {
                        targets
                            .filter(function (_a) {
                            var dataset = _a.dataset;
                            return dataset.arc !== "ready";
                        })
                            .forEach(function (target) {
                            target.addEventListener("click", function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a, injectNextTo, placeIn;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4, locator(target)];
                                        case 1:
                                            _a = __read.apply(void 0, [_b.sent(), 2]), injectNextTo = _a[0], placeIn = _a[1];
                                            debugLogger.log({ injectNextTo: injectNextTo, placeIn: placeIn });
                                            if (!injectNextTo || !placeIn)
                                                return [2];
                                            document
                                                .querySelectorAll("[data-arc=current]")
                                                .forEach(function (e) { return delete e.dataset.arc; });
                                            placeIn.dataset.arc = "current";
                                            return [2, injector(injectNextTo, actor)];
                                    }
                                });
                            }); }, { once: true });
                            target.dataset.arc = "ready";
                        });
                    });
                    return [2];
                });
            }); };
            var findCommentElements = function (where) { return __awaiter(void 0, void 0, void 0, function () {
                var id, divId, div, injectNextTo, placeCommentIn;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            id = where.parentElement.id;
                            divId = id.replace("-link", "");
                            div = document.getElementById(divId);
                            return [4, waitFor(".js-comment-form-layout button:last-of-type", div)];
                        case 1:
                            injectNextTo = _a.sent();
                            placeCommentIn = div.querySelector("textarea");
                            return [2, [injectNextTo, placeCommentIn]];
                    }
                });
            }); };
            var findEditSummaryElements = function (where) {
                var href = where.getAttribute("href") || "";
                var _a = __read(href.match(/posts\/(\d+)\/edit/) || [], 2), divid = _a[1];
                return Promise.all([
                    waitFor("#submit-button-".concat(divid)),
                    waitFor("#edit-comment-".concat(divid)),
                ]);
            };
            var findClosureElements = function (_where) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, Promise.all([
                            waitFor("#close-question-form .js-popup-submit"),
                            waitFor("#site-specific-comment textarea"),
                        ])];
                });
            }); };
            var findReviewQueueElements = function (_where) { return __awaiter(void 0, void 0, void 0, function () {
                var injectTo, placeIn;
                return __generator(this, function (_a) {
                    injectTo = document.querySelector(".js-review-editor [id^='submit-button']");
                    placeIn = document.querySelector(".js-review-editor .js-post-edit-comment-field");
                    return [2, [injectTo, placeIn]];
                });
            }); };
            var makePopupOpenButton = function (callback) {
                var params = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    params[_i - 1] = arguments[_i];
                }
                var btn = document.createElement("button");
                btn.type = "button";
                btn.textContent = "ARC comment";
                btn.classList.add("comment-auto-link", "s-btn", "s-btn__primary");
                btn.addEventListener("click", function () { return callback.apply(void 0, __spreadArray([], __read(params), false)); });
                return btn;
            };
            var getTargetType = function (where, clsMap) {
                var parent = where.closest(".answer") || where.closest(".question");
                if (!parent) {
                    return Target.CommentQuestion;
                }
                var classList = parent.classList;
                var _a = __read(clsMap.find(function (_a) {
                    var _b = __read(_a, 1), c = _b[0];
                    return classList.contains(c);
                }) || [], 2), target = _a[1];
                return target || Target.CommentQuestion;
            };
            var injectAutoLink = function (where, actor) {
                var existingAutoLinks = siblings(where, ".comment-auto-link");
                if (existingAutoLinks.length)
                    return;
                var clsMap = [
                    ["answer", Target.CommentAnswer],
                    ["question", Target.CommentQuestion],
                ];
                var target = getTargetType(where, clsMap);
                var lsep = makeSeparator();
                var alink = makePopupOpenButton(actor, where, target);
                where.after(lsep, alink);
            };
            var injectAutoLinkClosure = function (where, actor) {
                var existingAutoLinks = siblings(where, ".comment-auto-link");
                if (existingAutoLinks.length)
                    return;
                var lsep = makeSeparator();
                var alink = makePopupOpenButton(actor, where, Target.Closure);
                where.after(lsep, alink);
            };
            var injectAutoLinkReviewQueue = function (where, actor) {
                var existingAutoLinks = siblings(where, ".comment-auto-link");
                if (existingAutoLinks.length)
                    return;
                var clsMap = [
                    ["answer", Target.EditSummaryAnswer],
                    ["question", Target.EditSummaryQuestion],
                ];
                var target = getTargetType(where, clsMap);
                var lsep = makeSeparator();
                var alink = makePopupOpenButton(actor, where, target);
                alink.style.float = "right";
                where.after(lsep, alink);
            };
            var injectAutoLinkEdit = function (where, actor) {
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
                var target = getTargetType(where, clsMap);
                var lsep = makeSeparator();
                var alink = makePopupOpenButton(actor, where, target);
                where.after(lsep, alink);
            };
            addStyles();
            addTriggerButton(".js-add-link", findCommentElements, injectAutoLink, autoLinkAction);
            addTriggerButton(".js-edit-post", findEditSummaryElements, injectAutoLinkEdit, autoLinkAction);
            addTriggerButton(".js-close-question-link", findClosureElements, injectAutoLinkClosure, autoLinkAction);
            addTriggerButton(".js-review-submit", findReviewQueueElements, injectAutoLinkReviewQueue, autoLinkAction);
        });
    }
}, { once: true });
