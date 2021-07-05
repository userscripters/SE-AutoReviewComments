"use strict";
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
    var hide = function (element) {
        var style = element.style;
        style.display = "none";
        return element;
    };
    var show = function (element) {
        var style = element.style;
        style.display = "";
        return element;
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
        return selector ? found.filter(function (sib) { return sib.matches(selector); }) : found;
    };
    var delay = function (delay) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2, new Promise(function (res) { return setTimeout(res, delay); })];
    }); }); };
    var fadeTo = function (element, min, speed) {
        if (speed === void 0) { speed = 200; }
        return __awaiter(void 0, void 0, void 0, function () {
            var style, steps, step, up, i, newOpacity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (element.fades)
                            return [2, element];
                        element.fades = true;
                        style = element.style;
                        style.opacity = style.opacity || "1";
                        steps = Math.ceil(speed / 16);
                        step = (+style.opacity - min) / steps;
                        up = step < 0;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < steps)) return [3, 4];
                        newOpacity = +style.opacity - step;
                        style.opacity = newOpacity.toFixed(4);
                        if (up ? newOpacity >= min : newOpacity <= min)
                            return [3, 4];
                        return [4, delay(16)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3, 1];
                    case 4:
                        delete element.fades;
                        return [2, element];
                }
            });
        });
    };
    var fadeOut = function (el, speed) {
        if (speed === void 0) { speed = 200; }
        return fadeTo(el, 0, speed);
    };
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
            var val = storage[prefix + key];
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
        Store.storage = localStorage;
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
    var RAW_URL = "https://raw.github.com/userscripters/SE-AutoReviewComments/master/dist/autoreviewcomments.user.js";
    var GITHUB_URL = "https://github.com/userscripters/SE-AutoReviewComments#readme";
    var STACKAPPS_URL = "http://stackapps.com/q/2116";
    var API_VER = "2.2";
    var API_KEY = "5J)5cHN9KbyhE9Yf9S*G)g((";
    var FILTER_UNSAFE = ")7tZ5Od";
    var debugLogger = new Debugger(Store.load("debug"));
    var site = window.location.hostname;
    var sitename = (StackExchange.options.site.name || "").replace(/\s?Stack Exchange/, "");
    var allTgtMatcher = new RegExp("\\[(E?[AQ]|C)(?:,(E?[AQ]|C))*\\]");
    var userLinkSel = ".post-signature .user-details[itemprop=author] a";
    var viewsSel = ".main .view:not(:last-child)";
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
            Target: [Target.CommentQuestion],
            Name: "More than one question asked",
            Description: "It is preferred if you can post separate questions instead of combining your questions into one. That way, it helps the people answering your question and also others hunting for at least one of your questions. Thanks!",
        },
        {
            Target: [Target.CommentQuestion],
            Name: "Duplicate Closure",
            Description: "This question will likely be closed as a duplicate soon. If the answers from the duplicates do not fully address your question, please edit it to include why and flag this for re-opening. Thanks!",
        },
        {
            Target: [Target.CommentAnswer],
            Name: "Answers just to say Thanks!",
            Description: "Please do not add \"thanks\" as answers. Invest some time in the site and you will gain sufficient " + htmllink("/privileges", "privileges") + " to upvote answers you like, which is our way of saying thank you.",
        },
        {
            Target: [Target.CommentAnswer],
            Name: "Nothing but a URL (and isn't spam)",
            Description: "Whilst this may theoretically answer the question, " + htmllink("https://meta.stackexchange.com/q/8259", "it would be preferable") + " to include the essential parts of the answer here, and provide the link for reference.",
        },
        {
            Target: [Target.CommentAnswer],
            Name: "Requests to OP for further information",
            Description: "This is really a comment, not an answer. With a bit more rep, " + htmllink("/privileges/comment", "you will be able to post comments") + ". For the moment, I have added the comment for you and flagging the post for deletion.",
        },
        {
            Target: [Target.CommentAnswer],
            Name: "OP using an answer for further information",
            Description: "Please use the " + htmlem("Post answer") + " button only for actual answers. You should modify your original question to add additional information.",
        },
        {
            Target: [Target.CommentAnswer],
            Name: "OP adding a new question as an answer",
            Description: "If you have another question, please ask it by clicking the " + htmllink("/questions/ask", "Ask Question") + " button.",
        },
        {
            Target: [Target.CommentAnswer],
            Name: 'Another user adding a "Me too!"',
            Description: "If you have a " + htmlem("new") + " question, please ask it by clicking the " + htmllink("/questions/ask", "Ask Question") + " button. If you have sufficient reputation, " + htmllink("/privileges/vote-up", "you may upvote") + " the question. Alternatively, \"star\" it as a favorite, and you will be notified of any new answers.",
        },
        {
            Target: [Target.Closure],
            Name: "Too localized",
            Description: "This question appears to be off-topic because it is too localized.",
        },
        {
            Target: [Target.EditSummaryQuestion],
            Name: "Improper tagging",
            Description: "The tags you used are not appropriate for the question. Please review " + htmllink("/help/tagging", "What are tags, and how should I use them?"),
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
    var minute = 60;
    var hour = 3600;
    var day = 86400;
    var sixdays = 518400;
    var week = 604800;
    var month = 2592000;
    var year = 31536000;
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
            "." + arc + ".popup .throbber{\n                    display:none\n                }",
            "." + arc + ".popup>div>textarea{\n                    width:100%;\n                    height:442px;\n                }",
            "." + arc + ".popup .view textarea {\n                    resize: vertical;\n                }",
            "." + arc + ".popup .main{\n                    overflow:hidden\n                }",
            "." + arc + ".popup .main .view {\n                    overflow: auto;\n                    padding: 1vh 1vw;\n                }",
            "." + arc + ".popup .main .userinfo{\n                    padding:5px;\n                    margin-bottom:7px;\n                }",
            "." + arc + ".popup .main .remoteurl, ." + arc + ".popup .main .customwelcome {\n                    display: block;\n                    width: 100%;\n                }",
            "." + arc + ".popup .main .action-list{\n                    margin:0 0 7px 0 !important;\n                    overflow-y:auto;\n                }",
            "." + arc + ".popup .main .action-list li{\n                    width:100%;\n                    padding:0;\n                    transition:.1s\n                }",
            "." + arc + ".popup .main .action-list li:hover{\n                    background-color:#f2f2f2\n                }",
            "." + arc + ".popup .main .action-list li.action-selected:hover{\n                    background-color:#e6e6e6\n                }",
            "." + arc + ".popup .main .action-list li label{\n                    position:relative;\n                    display:block;\n                    padding:10px;\n                }",
            "." + arc + ".popup .main .action-list li label .action-name{\n                    display:block;\n                    margin-bottom:3px;\n                    cursor:default;\n                }",
            "." + arc + ".popup .main .action-list li label .action-desc{\n                    margin:0;\n                    color:#888;\n                    cursor:default;\n                }",
            "." + arc + ".popup .main .action-list li label .quick-insert{\n                    display:none;\n                    position:absolute;\n                    top:0;\n                    right:0;\n                    height:100%;\n                    margin:0;font-size:300%;\n                    color:transparent;\n                    border:0;\n                    transition:.3s;\n                    text-shadow:0 0 1px #fff;\n                    cursor:pointer;\n                    background-color:rgba(0,0,0,0.1);\n                    background:rgba(0,0,0,0.1);\n                    box-shadow:none;\n                    -moz-box-shadow:none;\n                    -webkit-box-shadow:none;\n                }",
            "." + arc + ".popup .main .action-list li:hover label .quick-insert{\n                    display:block\n                }",
            "." + arc + ".popup .main .action-list li label .quick-insert:hover{\n                    background-color:#222;\n                    color:#fff\n                }",
            "." + arc + ".popup .actions,.auto-review-comments.popup .main .actions{\n                    margin:6px\n                }",
            "." + arc + ".popup .main .popup-submit{\n                    float:none;\n                    margin:0 0 5px 0;\n                }",
            "." + arc + ".announcement strong:first-child {\n                    display: block;\n                }",
            "." + arc + ".announcement{\n                    padding:7px;\n                    margin-bottom:10px;\n                    background:orange;\n                    font-size:15px;\n                }",
            "." + arc + ".announcement .notify-close{\n                    display:block;\n                    float:right;\n                    margin:0 4px;\n                    padding:0 4px;\n                    border:2px solid black;\n                    cursor:pointer;\n                    line-height:17px;\n                }",
            "." + arc + ".announcement .notify-close a{\n                    color:black;\n                    text-decoration:none;\n                    font-weight:bold;\n                    font-size:16px;\n                }",
            "." + arc + ".popup .main .searchfilter{\n                    width:100%;\n                    box-sizing:border-box;\n                    display:block\n                }",
        ].forEach(function (rule) { return sheet.insertRule(rule); });
    };
    var makeButton = function (text, title) {
        var _a;
        var classes = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            classes[_i - 2] = arguments[_i];
        }
        var cancelBtn = document.createElement("a");
        (_a = cancelBtn.classList).add.apply(_a, __spreadArray([], __read(classes)));
        cancelBtn.innerHTML = text;
        cancelBtn.title = title;
        return cancelBtn;
    };
    var makeLinkButton = function (url, text, title) {
        var classes = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            classes[_i - 3] = arguments[_i];
        }
        var btn = makeButton.apply(void 0, __spreadArray([text, title], __read(classes)));
        btn.href = url;
        btn.target = "_blank";
        return btn;
    };
    var makeCloseBtn = function (id) {
        var close = document.createElement("div");
        close.classList.add("popup-close");
        close.id = id;
        var btn = makeButton("×", "close this popup (or hit Esc)");
        close.append(btn);
        return close;
    };
    var makeImage = function (id, src) {
        var _a;
        var classes = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            classes[_i - 2] = arguments[_i];
        }
        var img = document.createElement("img");
        (_a = img.classList).add.apply(_a, __spreadArray([], __read(classes)));
        img.src = src;
        img.id = id;
        return img;
    };
    var makeSubmitButton = function (id) {
        var submitBtn = document.createElement("input");
        submitBtn.classList.add("popup-submit");
        submitBtn.type = "button";
        submitBtn.value = "Insert";
        submitBtn.id = id;
        return submitBtn;
    };
    var switchToView = function (view) {
        document.querySelectorAll(viewsSel).forEach(hide);
        show(view);
        Store.save("CurrentView", view.id);
        return view;
    };
    var makeActionsView = function (popup, id) {
        var wrap = document.createElement("div");
        wrap.classList.add("view");
        wrap.id = id;
        var actionsWrap = document.createElement("div");
        actionsWrap.classList.add("float-left", "actions");
        var submitWrap = document.createElement("div");
        submitWrap.classList.add("float-right");
        var submitBtn = makeSubmitButton(Store.prefix + "-submit");
        disable(submitBtn);
        submitWrap.append(submitBtn);
        var helpBtn = makeLinkButton(GITHUB_URL, "info", "see info about this popup (v" + VERSION + ")", "popup-actions-help");
        var seeBtn = makeButton("see-through", "see through", "popup-actions-see");
        seeBtn.addEventListener("mouseenter", function () {
            fadeTo(popup, 0.4);
            fadeOut(seeBtn.closest(".main"));
        });
        seeBtn.addEventListener("mouseleave", function () {
            fadeTo(popup, 1.0);
            fadeTo(seeBtn.closest(".main"), 1);
        });
        var filterBtn = makeButton("filter", "filter", "popup-actions-filter");
        var resetBtn = makeButton("reset", "reset any custom comments", "popup-actions-reset");
        var importBtn = makeButton("import/export", "use this to import/export all comments", "popup-actions-impexp");
        var descrBtn = makeButton("show/hide desc", "use this to hide/show all comments", "popup-actions-toggledesc");
        var remoteBtn = makeButton("remote", "setup remote source", "popup-actions-remote");
        var dotsImg = makeImage("throbber2", "https://sstatic.net/img/progress-dots.gif", "throbber");
        var welcomeBtn = makeButton("welcome", "configure welcome", "popup-actions-welcome");
        var sep = makeSeparator();
        var actionsList = [
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
        actionsWrap.append.apply(actionsWrap, __spreadArray([], __read(actionsList)));
        wrap.append(actionsWrap, submitWrap);
        return wrap;
    };
    var makeSearchView = function (id) {
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
        var wrap = document.createElement("div");
        wrap.classList.add("view");
        wrap.id = id;
        var text = document.createTextNode('Setup the "welcome" message (blank is none):');
        var welcomeWrap = document.createElement("div");
        var input = document.createElement("input");
        input.classList.add("customwelcome");
        input.type = "text";
        input.id = "customwelcome";
        input.addEventListener("change", function () {
            return Store.save("WelcomeMessage", input.value);
        });
        welcomeWrap.append(input);
        var actionsWrap = document.createElement("div");
        actionsWrap.classList.add("float-right");
        var actions = [
            makeButton("force", "force", "welcome-force"),
            makeSeparator(),
            makeButton("cancel", "cancel", "welcome-cancel"),
        ];
        popup.addEventListener("click", function (_a) {
            var target = _a.target;
            var el = target;
            var actionMap = {
                ".popup-actions-welcome": function (_p, w) {
                    input.value || (input.value = Store.load("WelcomeMessage"));
                    show(w);
                },
                ".welcome-cancel": function () {
                    return switchToView(makeSearchView("search-popup"));
                },
                ".welcome-force": function () {
                    Store.save("ShowGreeting", true);
                    updateComments(popup, postType);
                },
            };
            var _b = __read(Object.entries(actionMap).find(function (_a) {
                var _b = __read(_a, 1), key = _b[0];
                return el.matches(key);
            }) ||
                [], 2), action = _b[1];
            if (!action)
                return debugLogger.log({ target: target });
            action(popup, wrap);
        });
        actionsWrap.append.apply(actionsWrap, __spreadArray([], __read(actions)));
        wrap.append(text, welcomeWrap, actionsWrap);
        return (makeWelcomeView.view = wrap);
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
        var view = document.createElement("div");
        view.classList.add("view");
        view.id = id;
        var actionWrap = document.createElement("div");
        actionWrap.classList.add("actions");
        var txtArea = document.createElement("textarea");
        txtArea.addEventListener("change", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                doImport(txtArea.value);
                updateComments(popup, postType);
                return [2];
            });
        }); });
        var jsonpBtn = makeButton("JSONP", "JSONP", "jsonp");
        var cancelBtn = makeButton("cancel", "cancel import/export", "cancel");
        cancelBtn.addEventListener("click", function () {
            return switchToView(makeSearchView("search-popup"));
        });
        actionWrap.append(jsonpBtn, makeSeparator(), cancelBtn);
        view.append(txtArea, actionWrap);
        var cbk = "callback";
        jsonpBtn.addEventListener("click", function () {
            var _a;
            var numComments = Store.load("commentcount");
            var loaded = loadComments(numComments);
            var content = loaded
                .map(function (comment) { return JSON.stringify(comment); })
                .join(",\n");
            txtArea.value = cbk + "([\n" + content + "\n])";
            (_a = view.querySelector(".actions")) === null || _a === void 0 ? void 0 : _a.remove();
        });
        return (makeImpExpView.view = updateImpExpComments(view));
    };
    var makeRemoteView = function (popup, id, postType) {
        if (makeRemoteView.view)
            return makeRemoteView.view;
        var wrap = document.createElement("div");
        wrap.classList.add("view");
        wrap.id = id;
        var text = document.createTextNode("Remote source of comments (use import/export to create JSONP)");
        var remoteInput = document.createElement("input");
        remoteInput.classList.add("remoteurl");
        remoteInput.type = "text";
        remoteInput.id = "remoteurl";
        remoteInput.addEventListener("change", function () {
            Store.save("RemoteUrl", remoteInput.value);
        });
        var image = makeImage("throbber1", "https://sstatic.net/img/progress-dots.gif", "throbber");
        var autoWrap = document.createElement("div");
        autoWrap.classList.add("float-left");
        var autoInput = document.createElement("input");
        autoInput.type = "checkbox";
        autoInput.id = "remoteauto";
        autoInput.checked = Store.load("AutoRemote");
        autoInput.addEventListener("change", function () {
            Store.save("AutoRemote", autoInput.checked);
        });
        var autoLabel = document.createElement("label");
        autoLabel.title = "get from remote on every page refresh";
        autoLabel.htmlFor = autoInput.id;
        autoLabel.textContent = "auto-get";
        autoWrap.append(autoInput, autoLabel);
        var actionsWrap = document.createElement("div");
        actionsWrap.classList.add("float-right");
        var actions = [
            makeButton("get now", "get remote", "remote-get"),
            makeSeparator(),
            makeButton("cancel", "cancel remote", "remote-cancel"),
        ];
        popup.addEventListener("click", function (_a) {
            var target = _a.target;
            var el = target;
            var actionMap = {
                ".popup-actions-remote": function () {
                    remoteInput.value && (remoteInput.value = Store.load("RemoteUrl"));
                    autoInput.checked = Store.load("AutoRemote", false);
                },
                ".remote-cancel": function () {
                    return switchToView(makeSearchView("search-popup"));
                },
                ".remote-get": function () {
                    show(image);
                    loadFromRemote(remoteInput.value, function () {
                        updateComments(popup, postType);
                        hide(image);
                    }, function (_a) {
                        var message = _a.message;
                        return notify(popup, "Problem", message);
                    });
                },
            };
            var _b = __read(Object.entries(actionMap).find(function (_a) {
                var _b = __read(_a, 1), key = _b[0];
                return el.matches(key);
            }) ||
                [], 2), action = _b[1];
            if (!action)
                return debugLogger.log({ el: el, wrap: wrap });
            action();
        });
        actionsWrap.append.apply(actionsWrap, __spreadArray([], __read(actions)));
        wrap.append(text, remoteInput, image, autoWrap, actionsWrap);
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
        popup.addEventListener("click", function (_a) {
            var target = _a.target;
            var actionMap = {
                ".popup-actions-welcome": function (p, t) {
                    return switchToView(makeWelcomeView(p, "welcome-popup", t));
                },
                ".popup-actions-remote": function (p, t) {
                    return switchToView(makeRemoteView(p, "remote-popup", t));
                },
                ".popup-actions-impexp": function (p, t) {
                    return switchToView(makeImpExpView(p, "impexp-popup", t));
                },
                ".popup-actions-filter": function () {
                    return switchToView(makeSearchView("search-popup"));
                },
                ".popup-actions-reset": function (p, t) {
                    resetComments();
                    updateComments(p, t);
                },
                ".popup-actions-toggledesc": function (p) {
                    var newVisibility = !Store.load("hide-desc");
                    Store.save("hide-desc", newVisibility);
                    toggleDescriptionVisibility(p, newVisibility);
                },
                ".popup-submit": function (p) {
                    var selected = p.querySelector(".action-selected");
                    var descr = selected === null || selected === void 0 ? void 0 : selected.querySelector(".action-desc");
                    debugLogger.log({ selected: selected, descr: descr });
                    if (!descr || !selected)
                        return notify(p, "Nothing selected", "please select a comment");
                    var op = getOP();
                    debugLogger.log({ op: op });
                    insertComment(input, descr.innerHTML, op);
                    fadeOut(p);
                    hide(p);
                },
            };
            var _b = __read(Object.entries(actionMap).find(function (_a) {
                var _b = __read(_a, 1), selector = _b[0];
                return target.matches(selector);
            }) || [], 2), action = _b[1];
            if (!action)
                return debugLogger.log({ target: target, postType: postType });
            action(popup, postType);
        });
        var commentViewId = "search-popup";
        var views = [
            makeSearchView(commentViewId),
            makeRemoteView(popup, "remote-popup", postType),
            makeWelcomeView(popup, "welcome-popup", postType),
            makeImpExpView(popup, "impexp-popup", postType),
            makeActionsView(popup, "popup-actions"),
        ];
        var hidden = views.slice(1, -1);
        hidden.forEach(hide);
        main.append.apply(main, __spreadArray([], __read(views)));
        popup.append(close, main);
        setupCommentHandlers(popup, commentViewId);
        setupSearchHandlers(popup, ".popup-actions-filter");
        switchToView(views[0]);
        return (makePopup.popup = popup);
    };
    var span = function (text, _a) {
        var _b;
        var _c = _a.classes, classes = _c === void 0 ? [] : _c, _d = _a.unsafe, unsafe = _d === void 0 ? false : _d;
        var el = document.createElement("span");
        (_b = el.classList).add.apply(_b, __spreadArray([], __read(classes)));
        unsafe ? (el.innerHTML = text) : (el.innerText = text);
        return el;
    };
    var makeAnnouncement = function (title, message, unsafe) {
        if (unsafe === void 0) { unsafe = false; }
        var wrap = document.createElement("div");
        wrap.classList.add("auto-review-comments", "announcement");
        wrap.id = "announcement";
        var close = document.createElement("span");
        close.classList.add("notify-close");
        var dismissal = makeButton("x", "dismiss this notification");
        close.append(dismissal);
        var txt = unsafe ? span(message, { unsafe: unsafe }) : text(message);
        wrap.append(b(title), txt, close);
        return wrap;
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
    function datespan(date) {
        var now = Date.now() / 1000;
        var then = new Date(date * 1000);
        var today = new Date().setHours(0, 0, 0) / 1000;
        var nowseconds = now - today;
        var elapsedSeconds = now - date;
        var strout = "";
        if (elapsedSeconds < nowseconds)
            strout = "since today";
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
        }
        else if (elapsedSeconds > month) {
            strout = "for " + Math.round(elapsedSeconds / month) + " months";
            if (elapsedSeconds % month > week)
                strout +=
                    ", " +
                        Math.round((elapsedSeconds % month) / week) +
                        " weeks";
        }
        else {
            strout = "for " + Math.round(elapsedSeconds / week) + " weeks";
        }
        return strout;
    }
    function lastseen(date) {
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
        if (elapsedSeconds < day + nowseconds)
            return "yesterday";
        var then = new Date(date * 1000);
        if (elapsedSeconds < sixdays)
            return "on " + weekday_name[then.getDay()];
        return then.toDateString();
    }
    function repNumber(r) {
        if (r < 1e4)
            return r.toString();
        else if (r < 1e5) {
            var d = Math.floor(Math.round(r / 100) / 10);
            r = Math.round((r - d * 1e3) / 100);
            return d + (r > 0 ? "." + r : "") + "k";
        }
        else
            return Math.round(r / 1e3) + "k";
    }
    var getLoggedInUserId = function (se) {
        return se.options.user.userId || "";
    };
    var notify = function (popup, title, body, callback) {
        var message = makeAnnouncement(title, body, true);
        message.addEventListener("click", function (_a) {
            var target = _a.target;
            if (!target.matches(".notify-close a"))
                return;
            fadeOut(message);
            message.remove();
            typeof callback === "function" && callback();
        });
        popup.prepend(message);
        return message;
    };
    var getUserId = function (tgt) {
        var parent = tgt.closest(".answer") || tgt.closest(".question");
        if (!parent)
            return "";
        var href = parent.querySelector(userLinkSel).href;
        var _a = __read(href.match(/users\/(\d+)\//) || [], 2), uid = _a[1];
        return uid || "";
    };
    var isNewUser = function (date) { return Date.now() / 1000 - date < week; };
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
    var link = function (url, label) {
        if (label === void 0) { label = url; }
        var a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.innerHTML = label;
        return a;
    };
    var text = function (data) { return document.createTextNode(data); };
    var addUserInfo = function (container, userInfo) {
        var _a;
        var user_id = userInfo.user_id, creation_date = userInfo.creation_date, display_name = userInfo.display_name, last_access_date = userInfo.last_access_date, reputation = userInfo.reputation, user_type = userInfo.user_type;
        if (isNewUser(creation_date)) {
            Store.save("ShowGreeting", true);
            (_a = container
                .querySelector(".action-desc")) === null || _a === void 0 ? void 0 : _a.prepend(Store.load("WelcomeMessage") || "");
        }
        var userLink = link("/users/" + user_id, "");
        userLink.append(b(display_name));
        empty(container);
        container.append(capitalize(user_type), text(" user "), userLink, text(", member "), b(datespan(creation_date)), text(", last seen "), b(lastseen(last_access_date)), text(", reputation "), b(repNumber(reputation)));
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
    function doImport(text) {
        Store.clear("name-");
        Store.clear("desc-");
        var arr = text.split("\n");
        var nameIndex = 0;
        var descIndex = 0;
        arr.forEach(function (untrimmed) {
            var line = untrimmed.trim();
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
        Store.save("commentcount", Math.min(nameIndex, descIndex));
    }
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
            .replace(/<a href="(.+?)">(.+?)<\/a>/g, "[$2]($1)")
            .replace(/<em>(.+?)<\/em>/g, "*$1*")
            .replace(/<strong>(.+?)<\/strong>/g, "**$1**"));
    };
    var markdownToHTML = function (markdown) {
        return escapeHtml(markdown)
            .replace(/\[([^\]]+)\]\((.+?)\)/g, '<a href="$2">$1</a>')
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*([^`]+?)\*/g, "<em>$1</em>");
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
    var disable = function (elOrQuery) {
        return ((typeof elOrQuery === "string"
            ? document.querySelector(elOrQuery)
            : elOrQuery).disabled = true);
    };
    var enable = function (elOrQuery) {
        return ((typeof elOrQuery === "string"
            ? document.querySelector(elOrQuery)
            : elOrQuery).disabled = false);
    };
    var saveComment = function (id, value) {
        var html = markdownToHTML(value);
        Store.save(id, tag(html));
        return (((Store.load("ShowGreeting") && Store.load("WelcomeMessage")) ||
            "") + untag(html));
    };
    var closeEditMode = function (commentElem, value) {
        empty(commentElem);
        commentElem.innerHTML = value;
        enable("#" + Store.prefix + "-submit");
    };
    var openEditMode = function (commentElem, popup) {
        var backup = commentElem.innerHTML;
        var html = tag(backup.replace(Store.load("WelcomeMessage", ""), ""));
        debugLogger.log({ backup: backup, html: html });
        empty(commentElem);
        var preview = document.createElement("span");
        preview.classList.add("d-inline-block", "p8");
        preview.innerHTML = html;
        var area = document.createElement("textarea");
        area.value = HTMLtoMarkdown(html);
        area.id = area.name = commentElem.id;
        popup.querySelectorAll(".quick-insert").forEach(hide);
        disable("#" + Store.prefix + "-submit");
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
        var actions = document.createElement("div");
        actions.classList.add("actions");
        var cancel = makeButton("cancel", "cancel edit");
        cancel.addEventListener("click", function () {
            popup.querySelectorAll(".quick-insert").forEach(show);
            closeEditMode(commentElem, backup);
        });
        actions.append(cancel);
        commentElem.append(preview, area, actions);
    };
    var resetComments = function () {
        Store.clear("name-");
        Store.clear("desc-");
        commentDefaults.forEach(function (_a, index) {
            var Description = _a.Description, Name = _a.Name, Target = _a.Target;
            var prefix = Target ? "[" + Target.join(",") + "] " : "";
            Store.save("name-" + index, prefix + Name);
            Store.save("desc-" + index, Description);
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
            debugLogger.log({ acts: acts, action: action, descr: descr });
            show(descr);
            enable("#" + Store.prefix + "-submit");
        };
    };
    var makeQuickInsertHandler = function (popup) {
        return function (_a) {
            var _b;
            var target = _a.target;
            var el = target;
            if (!el.matches("label > .quick-insert"))
                return;
            var action = el.closest("li");
            var radio = action === null || action === void 0 ? void 0 : action.querySelector("input");
            debugLogger.log({ action: action, radio: radio });
            if (!action || !radio)
                return notify(popup, "Problem", "something went wrong");
            action.classList.add("action-selected");
            radio.checked = true;
            (_b = document.getElementById(Store.prefix + "-submit")) === null || _b === void 0 ? void 0 : _b.click();
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
        var insertHandler = makeQuickInsertHandler(popup);
        var selectHandler = makeCommentClickHandler(popup);
        popup.addEventListener("click", function (event) {
            debugLogger.log({ currView: currView, viewId: viewId, event: event });
            if (currView !== viewId)
                return;
            insertHandler(event);
            selectHandler(event);
        });
        popup.addEventListener("keyup", function (event) {
            var _a;
            if (event.code !== "Enter" || currView !== viewId)
                return;
            event.preventDefault();
            (_a = document.getElementById(Store.prefix + "-submit")) === null || _a === void 0 ? void 0 : _a.click();
        });
    };
    var updateComments = function (popup, postType) {
        var numComments = Store.load("commentcount");
        if (!numComments)
            resetComments();
        var ul = popup.querySelector(".action-list");
        empty(ul);
        var comments = loadComments(numComments);
        var greet = Store.load("ShowGreeting", false);
        var welcome = Store.load("WelcomeMessage", "");
        var greeting = greet ? welcome : "";
        var userId = getLoggedInUserId(StackExchange);
        debugLogger.log({
            comments: comments,
            postType: postType,
            greet: greet,
            welcome: welcome,
            greeting: greeting,
            userId: userId,
        });
        var listItems = comments
            .filter(function (_a) {
            var name = _a.name;
            return isCommentValidForType(name, postType);
        })
            .map(function (_a, i) {
            var name = _a.name, desc = _a.desc;
            var cname = name.replace(allTgtMatcher, "");
            var description = desc
                .replace(/\$SITENAME\$/g, sitename)
                .replace(/\$SITEURL\$/g, site)
                .replace(/\$MYUSERID\$/g, userId)
                .replace(/\$/g, "$$$");
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
    var setupSearchHandlers = function (popup, filterSel) {
        var sbox = popup.querySelector(".searchbox");
        var stext = sbox.querySelector(".searchfilter");
        var kicker = popup.querySelector(filterSel);
        var storageKey = "showFilter";
        var showHideFilter = function () {
            var shown = Store.load(storageKey, false);
            if (shown) {
                show(sbox);
                stext.focus();
            }
            else {
                hide(sbox);
                stext.innerHTML = "";
                filterOn(popup, "");
            }
            Store.save(storageKey, shown);
        };
        showHideFilter();
        kicker.addEventListener("click", function () {
            Store.toggle(storageKey);
            showHideFilter();
            return false;
        });
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
    var getJSONP = function (url) {
        return new Promise(function (resolve, reject) {
            var cbkName = "jsonp-" + Date.now();
            var uri = new URL(url);
            uri.searchParams.append("callback", cbkName);
            var script = document.createElement("script");
            script.src = uri.toString();
            script.async = true;
            window[cbkName] = function (json) {
                script.remove();
                delete window[cbkName];
                resolve(json);
            };
            script.addEventListener("error", function (_a) {
                var error = _a.error;
                script.remove();
                delete window[cbkName];
                reject(error);
            });
            document.body.append(script);
        });
    };
    var loadFromRemote = function (url, success, error) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, getJSONP(url)];
                case 1:
                    data = _a.sent();
                    debugLogger.log({ data: data });
                    Store.save("commentcount", data.length);
                    Store.clear("name-");
                    Store.clear("desc-");
                    data.forEach(function (_a, i) {
                        var name = _a.name, description = _a.description;
                        Store.save("name-" + i, name);
                        Store.save("desc-" + i, markdownToHTML(description));
                    });
                    success();
                    return [3, 3];
                case 2:
                    err_1 = _a.sent();
                    error(err_1);
                    return [3, 3];
                case 3: return [2];
            }
        });
    }); };
    var showPopup = function (popup) {
        fadeTo(popup, 1);
        var style = popup.style, classList = popup.classList;
        style.display = "";
        classList.remove("popup-closing", "popup-closed");
    };
    var autoLinkAction = function (target, postType) { return __awaiter(void 0, void 0, void 0, function () {
        var popup, throbber, userid, userInfoEl, uinfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    debugLogger.log({ target: target, postType: postType });
                    popup = makePopup(target, postType);
                    if (!popup.isConnected)
                        document.body.append(popup);
                    showPopup(popup);
                    updateComments(popup, postType);
                    if (Store.load("AutoRemote") == "true") {
                        throbber = document.getElementById("throbber2");
                        show(throbber);
                        loadFromRemote(Store.load("RemoteUrl"), function () {
                            updateComments(popup, postType);
                            hide(throbber);
                        }, function (_a) {
                            var message = _a.message;
                            return notify(popup, "Problem", message);
                        });
                    }
                    center(popup);
                    StackExchange.helpers.bindMovablePopups();
                    userid = getUserId(target);
                    userInfoEl = document.getElementById("userinfo");
                    return [4, getUserInfo(userid)];
                case 1:
                    uinfo = _a.sent();
                    debugLogger.log({ uinfo: uinfo, userid: userid });
                    if (!uinfo)
                        return [2, fadeOut(userInfoEl)];
                    addUserInfo(userInfoEl, uinfo);
                    return [2];
            }
        });
    }); };
    function addTriggerButton(selector, locator, injector, actor) {
        var maxTries = 20;
        var _injector = function (trigger, retry) {
            if (maxTries <= retry)
                return;
            var _a = __read(locator(trigger), 2), injectNextTo = _a[0], placeIn = _a[1];
            debugLogger.log({ injectNextTo: injectNextTo, placeIn: placeIn, injector: injector });
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
