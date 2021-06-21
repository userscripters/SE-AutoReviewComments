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
(function () {
    var styleRegistry = new WeakMap();
    /**
     * @summary centers the element
     * @param {HTMLElement} element
     * @returns {HTMLElement}
     */
    var center = function (element) {
        var style = element.style;
        var update = {
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
    var hide = function (element) {
        var style = element.style, display = element.style.display;
        style.display = "none";
        styleRegistry.set(element, display);
        return element;
    };
    /**
     * @summary shows an element
     * @param {HTMLElement}
     * @returns {HTMLElement}
     */
    var show = function (element) {
        var oldDisplay = styleRegistry.get(element);
        if (!oldDisplay)
            return element;
        var style = element.style;
        style.display = oldDisplay;
        return element;
    };
    /**
     * @summary empties a node
     * @param {Node} node
     * @returns {Node}
     */
    var empty = function (node) {
        while (node.firstChild)
            node.firstChild.remove();
        return node;
    };
    /**
     * @summary gets an array of element siblings
     */
    var siblings = function (el, selector) {
        var found = [];
        var current = null;
        while ((current = el.nextElementSibling))
            found.push(current);
        return selector ? found.filter(function (sib) { return sib.matches(selector); }) : found;
    };
    /**
     * @summary promise-based delay
     * @param {number} delay
     * @returns {Promise<void>}
     */
    var delay = function (delay) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (res) { return setTimeout(res, delay); })];
    }); }); };
    /**
     * @summary fades element to provided opacity
     * @param {HTMLElement} element
     * @param {number} [speed]
     * @param {number} [min]
     * @returns {Promise<HTMLElement>}
     */
    var fadeTo = function (element, speed, min) {
        if (speed === void 0) { speed = 200; }
        if (min === void 0) { min = 0; }
        return __awaiter(void 0, void 0, void 0, function () {
            var style, steps, step, up, i, newOpacity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        style = element.style;
                        style.opacity = style.opacity || "1";
                        steps = Math.ceil(speed / 16);
                        step = (+style.opacity - min) / steps;
                        up = step < 0;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < steps)) return [3 /*break*/, 4];
                        newOpacity = +style.opacity - step;
                        style.opacity = newOpacity.toFixed(4);
                        if (up ? newOpacity >= min : newOpacity <= min)
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, delay(16)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, element];
                }
            });
        });
    };
    /**
     * @summary fades out an element
     * @param {HTMLElement} el
     * @param {number} [speed]
     */
    var fadeOut = function (el, speed) {
        if (speed === void 0) { speed = 200; }
        return fadeTo(el, speed);
    };
    var CONFIG = {
        postType: "",
    };
    StackExchange.ready(function () {
        var VERSION = "1.4.7";
        var RAW_URL = "https://raw.github.com/userscripters/SE-AutoReviewComments/master/dist/autoreviewcomments.user.js";
        var GITHUB_URL = "https://github.com/userscripters/SE-AutoReviewComments#readme";
        var STACKAPPS_URL = "http://stackapps.com/q/2116";
        var API_VER = "2.2";
        var FILTER_UNSAFE = ")7tZ5Od";
        // Self Updating Userscript, see https://gist.github.com/Benjol/874058
        if (typeof window.ARC_AutoUpdate === "function")
            return window.ARC_AutoUpdate(VERSION);
        /**
         * @summary checks if a given version is newer
         * @param {string} newVer new semantic version
         * @param {string} curVer current semantic version
         * @returns {boolean}
         */
        var isNewer = function (newVer, curVer) {
            var np = newVer.split(".").map(Number);
            var cp = curVer.split(".").map(Number);
            return np.some(function (v, idx) {
                return v > cp[idx] &&
                    np.slice(0, idx).every(function (v, i) { return i === idx || v >= cp[i]; });
            });
        };
        /**
         * @summary if has never version, download
         * @param {Notifier} notifier
         * @returns {void}
         */
        var updateCheck = function (notifier) {
            window.ARC_AutoUpdate = function (newver) {
                if (isNewer(newver, VERSION))
                    notifier(newver, RAW_URL);
            };
            var script = document.createElement("script");
            script.src = RAW_URL;
            document.head.append(script);
        };
        /**
         * @description Check to see if a new version has become available since last check
         * - only checks once a day
         * - does not check for first time visitors, shows them a welcome message instead
         * - called at the end of the main script if function exists
         */
        var checkForNewVersion = function (popup) {
            var today = new Date().setHours(0, 0, 0, 0);
            var LastUpdateCheckDay = load("LastUpdateCheckDay");
            if (LastUpdateCheckDay == null) {
                //first time visitor
                ShowMessage(popup, "Please read this!", "Thank you for installing this script.                             Please note that you can edit the texts inline by double-clicking them.                             For other options, please see the README at <a href=\"" + GITHUB_URL + "\" target=\"_blank\">here</a>.");
            }
            else if (LastUpdateCheckDay != today) {
                updateCheck(function (newVersion, installURL) {
                    if (newVersion == load("LastVersionAcknowledged"))
                        return;
                    ShowMessage(popup, "New Version!", "A new version (" + newVersion + ") of the <a href=\"" + STACKAPPS_URL + "\">AutoReviewComments</a> userscript is now available, see the <a href=\"" + GITHUB_URL + "/releases\">release notes</a> for details or <a href=\"" + installURL + "\">click here</a> to install now.", function () { return save("LastVersionAcknowledged", newVersion); });
                });
            }
            save("LastUpdateCheckDay", today);
        };
        var site = window.location.hostname;
        var sitename = StackExchange.options.site.name || "";
        var username = "user";
        var OP = "OP";
        var prefix = "AutoReviewComments-"; //prefix to avoid clashes in localstorage
        var myuserid = getLoggedInUserId();
        sitename = sitename.replace(/ ?Stack Exchange/, ""); //same for others ("Android Enthusiasts Stack Exchange", SR, and more)
        if (!load("WelcomeMessage"))
            save("WelcomeMessage", "Welcome to " + sitename + "! ");
        var greeting = load("WelcomeMessage") == "NONE" ? "" : load("WelcomeMessage");
        var showGreeting = false;
        // These are injection markers and MUST use single-quotes.
        // The injected strings use double-quotes themselves, so that would result in parser errors.
        var addStyles = function () {
            var style = document.createElement("style");
            document.head.append(style);
            var sheet = style.sheet;
            if (!sheet)
                return; //TODO: add failure handling
            var arc = "auto-review-comments";
            [
                "." + arc + ".popup{position:absolute;display:block;width:690px;padding:15px 15px 10px}",
                "." + arc + ".popup .float-left{float:left}",
                "." + arc + ".popup .float-right{float:right}",
                "." + arc + ".popup .throbber{display:none}",
                "." + arc + ".popup .remoteerror{color:red}",
                "." + arc + ".popup>div>textarea{width:100%;height:442px}",
                "." + arc + ".popup .main{overflow:hidden}",
                "." + arc + ".popup .main .userinfo{padding:5px;margin-bottom:7px;background:#eaefef}",
                "." + arc + ".popup .main .action-list{height:440px;margin:0 0 7px 0 !important;overflow-y:auto}",
                "." + arc + ".popup .main .action-list li{width:100%;padding:0;transition:.1s}",
                "." + arc + ".popup .main .action-list li:hover{background-color:#f2f2f2}",
                "." + arc + ".popup .main .action-list li.action-selected:hover{background-color:#e6e6e6}",
                "." + arc + ".popup .main .action-list li input{display:none}",
                "." + arc + ".popup .main .action-list li label{position:relative;display:block;padding:10px}",
                "." + arc + ".popup .main .action-list li label .action-name{display:block;margin-bottom:3px;cursor:default}",
                "." + arc + ".popup .main .action-list li label .action-desc{margin:0;color:#888;cursor:default}",
                "." + arc + ".popup .main .action-list li label .action-name textarea,.auto-review-comments.popup .main .action-list li label .action-desc textarea{width:99%;margin:0 0 -4px 0}",
                "." + arc + ".popup .main .action-list li label .action-desc textarea{height:42px}",
                "." + arc + ".popup .main .action-list li label .quick-insert{display:none;position:absolute;top:0;right:0;height:100%;margin:0;font-size:300%;color:transparent;border:0;transition:.3s;text-shadow:0 0 1px #fff;cursor:pointer;background-color:rgba(0,0,0,0.1);background:rgba(0,0,0,0.1);box-shadow:none;-moz-box-shadow:none;-webkit-box-shadow:none}",
                "." + arc + ".popup .main .action-list li:hover label .quick-insert{display:block}",
                "." + arc + ".popup .main .action-list li label .quick-insert:hover{background-color:#222;color:#fff}",
                "." + arc + ".popup .main .share-tip{display:none}",
                "." + arc + ".popup .main .share-tip .customwelcome{width:300px}",
                "." + arc + ".popup .main .share-tip .remoteurl{display:block;width:400px}",
                "." + arc + ".popup .actions,.auto-review-comments.popup .main .popup-actions .actions{margin:6px}",
                "." + arc + ".popup .main .popup-actions .popup-submit{float:none;margin:0 0 5px 0}",
                "." + arc + ".announcement{padding:7px;margin-bottom:10px;background:orange;font-size:15px}",
                "." + arc + ".announcement .notify-close{display:block;float:right;margin:0 4px;padding:0 4px;border:2px solid black;cursor:pointer;line-height:17px}",
                "." + arc + ".announcement .notify-close a{color:black;text-decoration:none;font-weight:bold;font-size:16px}",
                "." + arc + ".popup .main .searchbox{display:none}",
                "." + arc + ".popup .main .searchfilter{width:100%;box-sizing:border-box;display:block}",
            ].forEach(function (rule) { return sheet.insertRule(rule); });
        };
        var markupTemplate = '<div class="auto-review-comments popup" id="popup"> <div class="popup-close" id="close"><a title="close this popup (or hit Esc)">&#215;</a></div> <h2 class="handle">Which review comment to insert?</h2> <div class="main" id="main"> <div class="popup-active-pane"> <div class="userinfo" id="userinfo"> <img src="//sstatic.net/img/progress-dots.gif"/> </div> <div class="searchbox"> <input type="search" class="searchfilter" placeholder="filter the comments list"/> </div> <ul class="action-list"> </ul> </div> <div class="share-tip" id="remote-popup"> enter url for remote source of comments (use import/export to create jsonp) <input class="remoteurl" id="remoteurl" type="text"/> <img class="throbber" id="throbber1" src="//sstatic.net/img/progress-dots.gif"/> <span class="remoteerror" id="remoteerror1"></span> <div class="float-left"> <input type="checkbox" id="remoteauto"/> <label title="get from remote on every page refresh" for="remoteauto">auto-get</label> </div> <div class="float-right"> <a class="remote-get">get now</a> <span class="lsep"> | </span> <a class="remote-save">save</a> <span class="lsep"> | </span> <a class="remote-cancel">cancel</a> </div> </div> <div class="share-tip" id="welcome-popup"> configure "welcome" message (empty=none): <div> <input class="customwelcome" id="customwelcome" type="text"/> </div> <div class="float-right"> <a class="welcome-force">force</a> <span class="lsep"> | </span> <a class="welcome-save">save</a> <span class="lsep"> | </span> <a class="welcome-cancel">cancel</a> </div> </div> <div class="popup-actions"> <div class="float-left actions"> <a title="close this popup (or hit Esc)" class="popup-actions-cancel">cancel</a> <span class="lsep"> | </span> <a title="see info about this popup (v1.4.7)" class="popup-actions-help" href="//github.com/Benjol/SE-AutoReviewComments" target="_blank">info</a> <span class="lsep"> | </span> <a class="popup-actions-see">see-through</a> <span class="lsep"> | </span> <a title="filter comments by keyword" class="popup-actions-filter">filter</a> <span class="lsep"> | </span> <a title="reset any custom comments" class="popup-actions-reset">reset</a> <span class="lsep"> | </span> <a title="use this to import/export all comments" class="popup-actions-impexp">import/export</a> <span class="lsep"> | </span> <a title="use this to hide/show all comments" class="popup-actions-toggledesc">show/hide desc</a> <span class="lsep"> | </span> <a title="setup remote source" class="popup-actions-remote">remote</a> <img class="throbber" id="throbber2"src="//sstatic.net/img/progress-dots.gif"/> <span class="remoteerror" id="remoteerror2"></span> <span class="lsep"> | </span> <a title="configure welcome" class="popup-actions-welcome">welcome</a> </div> <div class="float-right"> <input class="popup-submit" type="button" disabled="disabled" value="Insert"> </div> </div> </div> </div>';
        /**
         * @summary makes a notification announcement
         * @param {string} title
         * @param {string} message
         * @returns {HTMLElement}
         */
        var makeAnnouncement = function (title, message) {
            var wrap = document.createElement("div");
            wrap.classList.add("auto-review-comments", "announcement");
            wrap.id = "announcement";
            var close = document.createElement("span");
            close.classList.add("notify-close");
            var dismissal = document.createElement("a");
            dismissal.title = "dismiss this notification";
            dismissal.textContent = "x";
            close.append(dismissal);
            wrap.append(close, b(title), text(message));
            return wrap;
        };
        var makeOption = function (id, name, desc) {
            var li = document.createElement("li");
            var reviewRadio = document.createElement("input");
            reviewRadio.id = "comment-" + id;
            reviewRadio.type = "radio";
            reviewRadio.name = "commentreview";
            var lbl = document.createElement("label");
            lbl.htmlFor = reviewRadio.id;
            var nameEl = document.createElement("span");
            nameEl.classList.add("action-name");
            nameEl.id = "name-" + id;
            nameEl.textContent = name;
            var descEl = document.createElement("span");
            descEl.classList.add("action-desc");
            descEl.id = "desc-" + id;
            descEl.textContent = desc;
            var insertBtn = document.createElement("button");
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
                Description: "It is preferred if you can post separate questions instead of combining your questions into one. That way, it helps the people answering your question and also others hunting for at least one of your questions. Thanks!",
            },
            {
                Target: [Target.CommentQuestion],
                Name: "Duplicate Closure",
                Description: "This question will probably be closed as a duplicate soon. If the answers from the duplicates don't fully address your question please edit it to include why and flag this for re-opening. Thanks!",
            },
            {
                Target: [Target.CommentAnswer],
                Name: "Answers just to say Thanks!",
                Description: 'Please don\'t add "thanks" as answers. Invest some time in the site and you will gain sufficient <a href="//$SITEURL$/privileges">privileges</a> to upvote answers you like, which is the $SITENAME$ way of saying thank you.',
            },
            {
                Target: [Target.CommentAnswer],
                Name: "Nothing but a URL (and isn't spam)",
                Description: 'Whilst this may theoretically answer the question, <a href="//meta.stackexchange.com/q/8259">it would be preferable</a> to include the essential parts of the answer here, and provide the link for reference.',
            },
            {
                Target: [Target.CommentAnswer],
                Name: "Requests to OP for further information",
                Description: "This is really a comment, not an answer. With a bit more rep, <a href=\"//$SITEURL$/privileges/comment\">you will be able to post comments</a>. For the moment I've added the comment for you, and I'm flagging this post for deletion.",
            },
            {
                Target: [Target.CommentAnswer],
                Name: "OP using an answer for further information",
                Description: "Please use the <em>Post answer</em> button only for actual answers. You should modify your original question to add additional information.",
            },
            {
                Target: [Target.CommentAnswer],
                Name: "OP adding a new question as an answer",
                Description: 'If you have another question, please ask it by clicking the <a href="//$SITEURL$/questions/ask">Ask Question</a> button.',
            },
            {
                Target: [Target.CommentAnswer],
                Name: 'Another user adding a "Me too!"',
                Description: 'If you have a NEW question, please ask it by clicking the <a href="//$SITEURL$/questions/ask">Ask Question</a> button. If you have sufficient reputation, <a href="//$SITEURL$/privileges/vote-up">you may upvote</a> the question. Alternatively, "star" it as a favorite and you will be notified of any new answers.',
            },
            {
                Target: [Target.Closure],
                Name: "Too localized",
                Description: "This question appears to be off-topic because it is too localized.",
            },
            {
                Target: [Target.EditSummaryQuestion],
                Name: "Improper tagging",
                Description: 'The tags you were using are not appropriate for this question. Please review <a href="//$SITEURL$/help/tagging">What are tags, and how should I use them?</a>',
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
        var minute = 60, hour = 3600, day = 86400, sixdays = 518400, week = 604800, month = 2592000, year = 31536000;
        //Wrap local storage access so that we avoid collisions with other scripts
        function load(key) {
            return localStorage[prefix + key];
        }
        function save(key, val) {
            localStorage[prefix + key] = val;
        }
        function RemoveStorage(key) {
            localStorage.removeItem(prefix + key);
        }
        function ClearStorage(startsWith) {
            for (var i = localStorage.length - 1; i >= 0; i--) {
                var key = localStorage.key(i);
                if (key.indexOf(prefix + startsWith) == 0)
                    localStorage.removeItem(key);
            }
        }
        /**
         * TODO: do something with this Cthulhu
         * @summary Calculate and format datespan for "Member since/for"
         * @param {number} date
         */
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
                strout =
                    "for " + Math.round(elapsedSeconds / month) + " months";
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
        /**
         * TODO: and about this Cthulhu
         * @summary Calculate and format datespan for "Last seen"
         * @param {number} date
         * @returns {string}
         */
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
        /**
         * TODO: and about this one (how many Cthulhu are there?)
         * @summary Format reputation string
         * @param {number} r
         * @returns {string}
         */
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
        /**
         * @summary Get the Id of the logged-in user
         * @returns {string}
         */
        function getLoggedInUserId() {
            var _a = StackExchange.options, _b = _a === void 0 ? {} : _a, _c = _b.user, _d = _c === void 0 ? {} : _c, userId = _d.userId;
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
        function ShowMessage(popup, title, body, callback) {
            var html = body.replace(/\n/g, "<BR/>");
            //TODO: replace HTML with text as makeAnnouncement uses textContent
            var message = makeAnnouncement(title, html);
            message.addEventListener("click", function (_a) {
                var target = _a.target;
                if (!target.matches(".notify-close"))
                    return;
                var parentElement = target.parentElement;
                fadeOut(parentElement);
                parentElement.remove();
                typeof callback === "function" && callback();
            });
            popup.querySelector("h2").before(message);
        }
        /**
         * @summary gets user Id
         * @returns {string}
         */
        function getUserId() {
            var href = document.querySelector(".post-signature .user-info a").href;
            var _a = __read(href.match(/posts\/(\d+)\//) || [], 2), uid = _a[1];
            return uid || "";
        }
        function isNewUser(date) {
            return new Date().valueOf() / 1000 - date < week;
        }
        function getOP() {
            var question = document.getElementById("question");
            var userlink = question.querySelector(".owner .user-details > a:not([id])");
            if (userlink)
                return userlink.textContent || "";
            var deletedUser = question.querySelector(".owner .user-details");
            if (deletedUser)
                return deletedUser.textContent || "";
            return "[NULL]";
        }
        /**
         * @summary properly capitalizes a word
         * @param {string} str
         * @returns {string}
         */
        var capitalize = function (str) {
            return str[0].toUpperCase() + str.slice(1).toLowerCase();
        };
        /**
         * @summary wraps text into a <strong> element
         * @param {string} text
         * @returns {HTMLElement}
         */
        var b = function (text) {
            var strong = document.createElement("strong");
            strong.textContent = text;
            return strong;
        };
        /**
         * @summary creates an <a> element
         * @param {string} url
         * @param {string} [label]
         * @returns {HTMLAnchorElement}
         */
        var link = function (url, label) {
            if (label === void 0) { label = url; }
            var a = document.createElement("a");
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
        var text = function (data) { return document.createTextNode(data); };
        /**
         * @summary adds user info to the UI
         * @param {HTMLElement} container
         * @returns {void}
         */
        var addUserInfo = function (container, userInfo) {
            var _a;
            var user_id = userInfo.user_id, creation_date = userInfo.creation_date, display_name = userInfo.display_name, last_access_date = userInfo.last_access_date, reputation = userInfo.reputation, user_type = userInfo.user_type;
            if (isNewUser(creation_date)) {
                showGreeting = true;
                (_a = container.querySelector(".action-desc")) === null || _a === void 0 ? void 0 : _a.prepend(greeting);
            }
            var userLink = link("/users/" + user_id, "");
            userLink.append(b(display_name));
            container.append(capitalize(user_type), text(" user "), userLink, text(", member "), b(datespan(creation_date)), text(", last seen "), b(lastseen(last_access_date)), text(", reputation "), b(repNumber(reputation)));
        };
        /**
         * @summary get basic user info from the API
         * @param {string} userid
         * @returns {Promise<UserInfo|null>}
         */
        function getUserInfo(userid) {
            return __awaiter(this, void 0, void 0, function () {
                var API_KEY, url, res, _a, userInfo;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            API_KEY = "5J)5cHN9KbyhE9Yf9S*G)g((";
                            url = new URL("api.stackexchange.com/" + API_VER + "/users/" + userid);
                            url.search = new URLSearchParams({
                                site: site,
                                key: API_KEY,
                                unsafe: FILTER_UNSAFE,
                            }).toString();
                            return [4 /*yield*/, fetch(url.toString())];
                        case 1:
                            res = _b.sent();
                            if (!res.ok)
                                return [2 /*return*/, null];
                            return [4 /*yield*/, res.json()];
                        case 2:
                            _a = __read.apply(void 0, [(_b.sent()).items, 1]), userInfo = _a[0];
                            return [2 /*return*/, userInfo];
                    }
                });
            });
        }
        /**
         * @summary makes a separator <span>
         * @returns {HTMLSpanElement}
         */
        var makeSeparator = function () {
            var lsep = document.createElement("span");
            lsep.classList.add("lsep");
            lsep.textContent = " | ";
            return lsep;
        };
        //Show textarea in front of popup to import/export all comments (for other sites or for posting somewhere)
        function ImportExport(popup) {
            var _this = this;
            var tohide = document.getElementById("main");
            var wrap = document.createElement("div");
            var actionWrap = document.createElement("div");
            actionWrap.classList.add("actions");
            var txtArea = document.createElement("textarea");
            var jsonpBtn = document.createElement("a");
            jsonpBtn.classList.add("jsonp");
            var saveBtn = document.createElement("a");
            saveBtn.classList.add("save");
            var cancelBtn = document.createElement("a");
            cancelBtn.classList.add("cancel");
            actionWrap.append(jsonpBtn, makeSeparator(), saveBtn, makeSeparator(), cancelBtn);
            //TODO: <div> & <textarea> same level??
            wrap.append(txtArea, actionWrap);
            var style = tohide.style;
            //Painful, but shortest way I've found to position div over the tohide element
            Object.assign(wrap.style, {
                position: "absolute",
                left: style.left,
                top: style.top,
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
            jsonpBtn.addEventListener("click", function () {
                var _a, _b;
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
                (_a = wrap.querySelector("a:lt(2)")) === null || _a === void 0 ? void 0 : _a.remove();
                (_b = wrap.querySelector(".lsep:lt(2)")) === null || _b === void 0 ? void 0 : _b.remove();
            });
            cancelBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fadeOut(wrap)];
                        case 1:
                            _a.sent();
                            wrap.remove();
                            return [2 /*return*/];
                    }
                });
            }); });
            saveBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            DoImport(txtArea.value);
                            WriteComments(popup);
                            return [4 /*yield*/, fadeOut(wrap)];
                        case 1:
                            _a.sent();
                            wrap.remove();
                            return [2 /*return*/];
                    }
                });
            }); });
            popup.append(wrap);
        }
        //Import complete text into comments
        function DoImport(text) {
            //clear out any existing stuff
            ClearStorage("name-");
            ClearStorage("desc-");
            var arr = text.split("\n");
            var nameIndex = 0, descIndex = 0;
            for (var i = 0; i < arr.length; i++) {
                var line = arr[i].trim();
                if (line.indexOf("#") == 0) {
                    var name = line.replace(/^#+/g, "");
                    save("name-" + nameIndex, name);
                    nameIndex++;
                }
                else if (line.length > 0) {
                    var desc = markDownToHtml(line);
                    save("desc-" + descIndex, Tag(desc));
                    descIndex++;
                }
            }
            //This is de-normalised, but I don't care.
            save("commentcount", Math.min(nameIndex, descIndex));
        }
        // From https://stackoverflow.com/a/12034334/259953
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
        function escapeHtml(html) {
            return String(html).replace(/[&<>]/g, function (s) {
                return entityMapToHtml[s];
            });
        }
        function unescapeHtml(html) {
            return Object.keys(entityMapFromHtml).reduce(function (result, entity) {
                return result.replace(new RegExp(entity, "g"), function (s) {
                    return entityMapFromHtml[s];
                });
            }, String(html));
        }
        function htmlToMarkDown(html) {
            var markdown = html
                .replace(/<a href="(.+?)">(.+?)<\/a>/g, "[$2]($1)")
                .replace(/<em>(.+?)<\/em>/g, "*$1*")
                .replace(/<strong>(.+?)<\/strong>/g, "**$1**");
            return unescapeHtml(markdown);
        }
        function markDownToHtml(markdown) {
            var html = escapeHtml(markdown).replace(/\[([^\]]+)\]\((.+?)\)/g, '<a href="$2">$1</a>');
            return html
                .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*([^`]+?)\*/g, "<em>$1</em>");
        }
        function UnTag(text) {
            return text
                .replace(/\$SITENAME\$/g, sitename)
                .replace(/\$SITEURL\$/g, site)
                .replace(/\$MYUSERID\$/g, myuserid);
        }
        function Tag(html) {
            //put tags back in
            var regname = new RegExp(sitename, "g"), regurl = new RegExp("//" + site, "g"), reguid = new RegExp("/" + myuserid + "[)]", "g");
            return html
                .replace(regname, "$SITENAME$")
                .replace(regurl, "//$SITEURL$")
                .replace(reguid, "/$MYUSERID$)");
        }
        var disable = function (selector) {
            return (document.querySelector(selector).disabled =
                true);
        };
        var enable = function (selector) {
            return (document.querySelector(selector).disabled =
                false);
        };
        /**
         * @summary Replace contents of element with a textarea (containing markdown of contents), and save/cancel buttons
         */
        function ToEditable(el) {
            var backup = el.innerHTML;
            var html = Tag(backup.replace(greeting, "")); //remove greeting before editing..
            if (html.indexOf("<textarea") > -1)
                return; //don't want to create a new textarea inside this one!
            var area = document.createElement("textarea");
            area.value = htmlToMarkDown(html);
            // Disable quick-insert while editing.
            siblings(el, ".quick-insert").forEach(hide);
            // Disable insert while editing.
            disable(".popup-submit");
            BorkFor(el); //this is a hack
            //save/cancel links to add to textarea
            var actions = document.createElement("div");
            actions.classList.add("actions");
            var save = document.createElement("a");
            save.addEventListener("click", function (event) {
                event.preventDefault(); //TODO: check if needed
                var parentElement = save.parentElement;
                SaveEditable(parentElement.parentElement);
                UnborkFor(el);
            });
            var sep = document.createElement("span");
            sep.classList.add("lsep");
            var cancel = document.createElement("a");
            cancel.addEventListener("click", function (event) {
                event.preventDefault(); //TODO: check if needed
                siblings(el, ".quick-insert").forEach(show);
                enable(".popup-submit");
                var parentElement = cancel.parentElement;
                CancelEditable(parentElement.parentElement, backup);
                UnborkFor(el);
            });
            actions.append(save, sep, cancel);
            el.append(area, actions);
        }
        //This is to stop the input pinching focus when I click inside textarea
        //Could have done something clever with contentEditable, but this is evil, and it annoys Yi :P
        function BorkFor(el) {
            var label = el.closest("label");
            label.htmlFor = "borken";
        }
        function UnborkFor(el) {
            var label = el.closest("label");
            var previousElementSibling = label.previousElementSibling;
            label.htmlFor = previousElementSibling.id;
        }
        //Save textarea contents, replace element html with new edited content
        function SaveEditable(el) {
            var html = markDownToHtml(el.querySelector("textarea").value);
            save(el.id, Tag(html));
            el.innerHTML = (showGreeting ? greeting : "") + UnTag(html);
        }
        function CancelEditable(el, backup) {
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
        var loadComments = function (numComments) {
            var comments = [];
            for (var i = 0; i < numComments; i++) {
                var name_1 = load("name-" + i);
                var desc = load("desc-" + i);
                comments.push({ name: name_1, desc: desc });
            }
            return comments;
        };
        /**
         * @summary rewrite all comments to ui (typically after import or reset)
         * @param {HTMLElement} popup
         */
        function WriteComments(popup) {
            var numComments = load("commentcount");
            if (!numComments)
                ResetComments();
            var ul = popup.querySelector(".action-list");
            empty(ul);
            var postType = CONFIG.postType;
            var comments = loadComments(numComments);
            var listItems = comments
                .filter(function (_a) {
                var name = _a.name;
                return IsCommentValidForPostType(name, postType);
            })
                .map(function (_a, i) {
                var name = _a.name, desc = _a.desc;
                var cname = name.replace(Target.MATCH_ALL, "");
                var descr = desc
                    .replace(/\$SITENAME\$/g, sitename)
                    .replace(/\$SITEURL\$/g, site)
                    .replace(/\$MYUSERID\$/g, myuserid)
                    .replace(/\$/g, "$$$");
                var optionElement = makeOption(i.toString(), cname.replace(/\$/g, "$$$"), (showGreeting ? greeting : "") + descr);
                var descrEl = optionElement.querySelector(".action-desc");
                descrEl.innerHTML = descr;
                return optionElement;
            });
            ul.append.apply(ul, __spreadArray([], __read(listItems)));
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
        function IsCommentValidForPostType(comment, postType) {
            var designator = comment.match(Target.MATCH_ALL);
            return designator ? -1 < designator.indexOf(postType) : true;
        }
        function AddOptionEventHandlers(popup) {
            popup.addEventListener("dblclick", function (_a) {
                var target = _a.target;
                if (!target.matches(".action-desc"))
                    return;
                ToEditable(target);
            });
            popup.addEventListener("click", function (_a) {
                var target = _a.target;
                if (!target.matches("label > .quick-insert"))
                    return;
                var parentElement = target.parentElement;
                var li = parentElement.parentElement;
                var radio = target.closest("input");
                // Mark action as selected.
                li.classList.add("action-selected");
                radio.checked = true;
                popup
                    .querySelector(".popup-submit")
                    .click();
            });
            //add click handler to radio buttons
            popup.addEventListener("click", function (_a) {
                var target = _a.target;
                if (!target)
                    return;
                popup.querySelector(".popup-submit").disabled = false;
                var selected = __spreadArray([], __read(popup.querySelectorAll(".action-selected")));
                selected.forEach(function (_a) {
                    var classList = _a.classList;
                    return classList.remove("action-selected");
                });
                if (load("hide-desc") == "hide") {
                    var unselectedDescrs = __spreadArray([], __read(popup.querySelectorAll(":not(.action-selected) .action-desc")));
                    unselectedDescrs.forEach(hide);
                }
                var action = target.closest("li");
                var classList = action.classList;
                classList.add("action-selected");
                var descr = action.querySelector(".action-desc");
                show(descr);
            });
            popup.addEventListener("keyup", function (event) {
                var _a;
                if (event.code == "Enter") {
                    event.preventDefault();
                    (_a = popup.querySelector(".popup-submit")) === null || _a === void 0 ? void 0 : _a.click();
                }
            });
        }
        function filterOn(popup, text) {
            var words = text
                .toLowerCase()
                .split(/\s+/)
                .filter(function (word) {
                return word.length > 0;
            });
            __spreadArray([], __read(popup.querySelectorAll(".action-list > li"))).forEach(function (item) {
                var name = item
                    .querySelector(".action-name")
                    .textContent.toLowerCase();
                var desc = item
                    .querySelector(".action-desc")
                    .textContent.toLowerCase();
                var isShow = true;
                //TODO: only last one counts??
                words.forEach(function (word) {
                    isShow =
                        isShow &&
                            (name.indexOf(word) >= 0 || desc.indexOf(word) >= 0);
                });
                isShow ? show(item) : hide(item);
            });
        }
        function AddSearchEventHandlers(popup) {
            var sbox = popup.querySelector(".searchbox"), stext = sbox.querySelector(".searchfilter"), kicker = popup.querySelector(".popup-actions-filter"), storageKey = "showFilter", shown = load(storageKey) == "show";
            var showHideFilter = function () {
                if (shown) {
                    show(sbox);
                    stext.focus();
                    save(storageKey, "show");
                }
                else {
                    hide(sbox);
                    stext.textContent = "";
                    filterOn(popup, "");
                    save(storageKey, "hide");
                }
            };
            var filterOnText = function () {
                var value = stext.value;
                filterOn(popup, value);
            };
            showHideFilter();
            kicker.addEventListener("click", function () {
                shown = !shown;
                showHideFilter();
                return false;
            });
            var callback = function () { return setTimeout(filterOnText, 100); };
            stext.addEventListener("keydown", callback);
            stext.addEventListener("change", callback);
            stext.addEventListener("cut", callback);
            stext.addEventListener("paste", callback);
            stext.addEventListener("search", callback);
        }
        //Adjust the descriptions so they show or hide based on the user's preference.
        function ShowHideDescriptions(popup) {
            //get list of all descriptions except the currently selected one
            var descriptions = __spreadArray([], __read(popup.querySelectorAll("ul.action-list li:not(.action-selected) span[id*='desc-']")));
            var isHide = load("hide-desc") == "hide";
            descriptions.forEach(function (description) {
                return isHide ? hide(description) : show(description);
            });
        }
        /**
         * @summary makes a JSONP request
         * @param {string} url resource URL
         * @returns {Promise<object>} response
         */
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
        //TODO: test out the change
        //customise welcome
        //reverse compatible!
        function loadFromRemote(url, success, error) {
            return __awaiter(this, void 0, void 0, function () {
                var data, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getJSONP(url)];
                        case 1:
                            data = _a.sent();
                            save("commentcount", data.length);
                            ClearStorage("name-");
                            ClearStorage("desc-");
                            data.forEach(function (_a, i) {
                                var name = _a.name, description = _a.description;
                                save("name-" + i, name);
                                save("desc-" + i, markDownToHtml(description));
                            });
                            success();
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _a.sent();
                            error(err_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
        //Factored out from main popu creation, just because it's too long
        function SetupRemoteBox(popup) {
            var remote = popup.querySelector("#remote-popup");
            var remoteerror = remote.querySelector("#remoteerror1");
            var urlfield = remote.querySelector("#remoteurl");
            var autofield = remote.querySelector("#remoteauto");
            var throbber = remote.querySelector("#throbber1");
            popup
                .querySelector(".popup-actions-remote")
                .addEventListener("click", function () {
                urlfield.value = load("RemoteUrl");
                autofield.checked = load("AutoRemote") == "true";
                show(remote);
            });
            popup
                .querySelector(".remote-cancel")
                .addEventListener("click", function () {
                hide(throbber);
                remoteerror.textContent = "";
                hide(remote);
            });
            popup
                .querySelector(".remote-save")
                .addEventListener("click", function () {
                save("RemoteUrl", urlfield.value);
                save("AutoRemote", autofield.checked);
                hide(remote);
            });
            popup
                .querySelector(".remote-get")
                .addEventListener("click", function () {
                show(throbber);
                loadFromRemote(urlfield.value, function () {
                    WriteComments(popup);
                    hide(throbber);
                }, function (_a) {
                    var message = _a.message;
                    return (remoteerror.textContent = message);
                });
            });
        }
        /**
         * @summary sets up a welcome box
         * @param {HTMLElement} popup
         * @returns {void}
         */
        function SetupWelcomeBox(popup) {
            var welcome = document.getElementById("welcome-popup");
            var custom = welcome.querySelector("#customwelcome");
            popup
                .querySelector(".popup-actions-welcome")
                .addEventListener("click", function () {
                custom.value = greeting;
                show(welcome);
            });
            popup
                .querySelector(".welcome-cancel")
                .addEventListener("click", function () {
                hide(welcome);
            });
            popup
                .querySelector(".welcome-force")
                .addEventListener("click", function () {
                showGreeting = true;
                WriteComments(popup);
                hide(welcome);
            });
            popup
                .querySelector(".welcome-save")
                .addEventListener("click", function () {
                var value = custom.value;
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
        function attachAutoLinkInjector(selector, locator, injector, actor) {
            /**
             * @summary The internal injector invokes the locator to find an element in relation to the trigger element and then invokes the injector on it.
             * @param {HTMLElement} trigger The element that triggered the mechanism.
             * @param {number} [retry=0] How often this operation was already retried. 20 retries will be performed in 50ms intervals.
             * @private
             */
            var _internalInjector = function (trigger, retry) {
                // If we didn't find the element after 20 retries, give up.
                if (20 <= retry)
                    return;
                var _a = __read(locator(trigger), 2), injectNextTo = _a[0], placeCommentIn = _a[1];
                // We didn't find it? Try again in 50ms.
                if (!injectNextTo) {
                    setTimeout(function () { return _internalInjector(trigger, retry + 1); }, 50);
                }
                else {
                    // Call our injector on the found element.
                    injector(injectNextTo, placeCommentIn, actor);
                }
            };
            var content = document.getElementById("content");
            content.addEventListener("click", function (_a) {
                var target = _a.target;
                if (!target.matches(selector))
                    return;
                _internalInjector(target, 0);
            });
        }
        attachAutoLinkInjector(".js-add-link", findCommentElements, injectAutoLink, autoLinkAction);
        attachAutoLinkInjector(".edit-post", findEditSummaryElements, injectAutoLinkEdit, autoLinkAction);
        attachAutoLinkInjector(".close-question-link", findClosureElements, injectAutoLinkClosure, autoLinkAction);
        attachAutoLinkInjector(".review-actions input:first", findReviewQueueElements, injectAutoLinkReviewQueue, autoLinkAction);
        /**
         * @description A locator for the help link next to the comment box under a post and the textarea for the comment.
         * @param {HTMLElement} where A DOM element, near which we're looking for the location where to inject our link.
         * @returns {Placement} The DOM element next to which the link should be inserted and the element into which the
         *                     comment should be placed.
         */
        function findCommentElements(where) {
            var parentElement = where.parentElement;
            var id = parentElement.id;
            var divId = id.replace("-link", "");
            var div = document.getElementById(divId);
            var injectNextTo = div.querySelector(".js-comment-help-link");
            var placeCommentIn = div.querySelector("textarea");
            return [injectNextTo, placeCommentIn];
        }
        /**
         * @summary A locator for the edit summary input box under a post while it is being edited.
         * @param {HTMLAnchorElement} where A DOM element, near which we're looking for the location where to inject our link.
         * @returns {Placement} The DOM element next to which the link should be inserted and the element into which the comment should be placed.
         */
        function findEditSummaryElements(_a) {
            var href = _a.href;
            var _b = __read(href.match(/posts\/(\d+)\/edit/) || [], 2), divid = _b[1];
            var nextElementSibling = document.getElementById("post-editor-" + divid).nextElementSibling;
            var placeIn = nextElementSibling.querySelector(".edit-comment");
            return [placeIn, placeIn];
        }
        /**
         * @summary A locator for the text area in which to put a custom off-topic closure reason in the closure dialog.
         * @param {HTMLElement} where A DOM element, near which we're looking for the location where to inject our link.
         * @returns {Placement} The DOM element next to which the link should be inserted and the element into which the
         *                     comment should be placed.
         */
        function findClosureElements(_where) {
            //TODO: why where is not used?
            var injectTo = document.querySelector(".close-as-off-topic-pane textarea");
            return [injectTo, injectTo];
        }
        /**
         * @summary A locator for the edit summary you get in the "Help and Improvement" review queue.
         * @param {HTMLElement} where A DOM element, near which we're looking for the location where to inject our link.
         * @returns {Placement} The DOM element next to which the link should be inserted and the element into which the
         *                     comment should be placed.
         */
        function findReviewQueueElements(_where) {
            var injectTo = document.querySelector(".text-counter");
            var placeIn = document.querySelector(".edit-comment");
            return [injectTo, placeIn];
        }
        /**
         * @summary
         * @param {Actor} what The function that will be called when the link is clicked.
         * @param {HTMLElement} next The DOM element next to which we'll place the link.
         * @param {HTMLElement} where The DOM element into which the comment should be placed.
         * @returns {HTMLAnchorElement}
         */
        var makeAutoLink = function (callback, next, where) {
            var alink = document.createElement("a");
            alink.classList.add("comment-auto-link");
            alink.textContent = "auto";
            alink.addEventListener("click", function (ev) {
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
        var getTargetType = function (where, clsMap) {
            var parentPost = where.closest(".answer") || where.closest(".question");
            if (!parentPost)
                return; //TODO: implement failure state handling
            var classList = parentPost.classList;
            //if not found, we have a problem
            var _a = __read(clsMap.find(function (_a) {
                var _b = __read(_a, 1), c = _b[0];
                return classList.contains(c);
            }) || [], 2), tgt = _a[1];
            return tgt;
        };
        /**
         * @summary Inject the auto link next to the given DOM element.
         * @param {HTMLElement} where The DOM element next to which we'll place the link.
         * @param {HTMLElement} placeCommentIn The DOM element into which the comment should be placed.
         * @param {Actor} what The function that will be called when the link is clicked.
         * @returns {void}
         */
        function injectAutoLink(where, placeCommentIn, what) {
            // Don't add auto links if one already exists
            var existingAutoLinks = siblings(where, ".comment-auto-link");
            if (existingAutoLinks.length)
                return;
            var clsMap = [
                ["answer", Target.CommentAnswer],
                ["question", Target.CommentQuestion],
            ];
            var tgt = getTargetType(where, clsMap);
            var lsep = makeSeparator();
            var alink = makeAutoLink(what, placeCommentIn, tgt);
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
        function injectAutoLinkEdit(where, placeCommentIn, what) {
            // Don't add auto links if one already exists
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
            var alink = makeAutoLink(what, placeCommentIn, tgt);
            where.after(lsep, alink);
        }
        /**
         * @summary Inject the auto link next to the given DOM element.
         * @param {HTMLElement} where The DOM element next to which we'll place the link.
         * @param {HTMLElement} placeCommentIn The DOM element into which the comment should be placed.
         * @param {Actor} what The function that will be called when the link is clicked.
         * @returns {void}
         */
        function injectAutoLinkClosure(where, placeCommentIn, what) {
            // Don't add auto links if one already exists
            var existingAutoLinks = siblings(where, ".comment-auto-link");
            if (existingAutoLinks.length)
                return;
            var lsep = makeSeparator();
            var alink = makeAutoLink(what, placeCommentIn, Target.Closure);
            where.after(lsep, alink);
        }
        /**
         * @summary Inject hte auto link next to the "characters left" counter below the edit summary in the review queue.
         * @param {HTMLElement} where The DOM element next to which we'll place the link.
         * @param {HTMLElement} placeCommentIn The DOM element into which the comment should be placed.
         * @param {Actor} what The function that will be called when the link is clicked.
         */
        function injectAutoLinkReviewQueue(where, placeCommentIn, what) {
            // Don't add auto links if one already exists
            var existingAutoLinks = siblings(where, ".comment-auto-link");
            if (existingAutoLinks.length)
                return;
            var lsep = makeSeparator();
            var alink = makeAutoLink(what, placeCommentIn, Target.EditSummaryQuestion);
            alink.style.float = "right";
            where.after(lsep, alink);
        }
        /**
         * @summary creates ARC modal and wires functionality
         * @param {HTMLInputElement} targetObject
         * @param {string} postType
         * @returns {Promise<void>}
         */
        function autoLinkAction(targetObject, postType) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var popup, see, throbber, remoteerror, userid, userInfoEl, uinfo;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            popup = document.querySelector(markupTemplate);
                            (_a = popup
                                .querySelector(".popup-close")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                                return fadeOut(popup).then(function (p) { return p.remove(); });
                            });
                            CONFIG.postType = postType;
                            //Reset this, otherwise we get the greeting twice...
                            showGreeting = false;
                            //create/add options
                            WriteComments(popup);
                            popup.addEventListener("click", function (_a) {
                                var target = _a.target;
                                var actionMap = {
                                    ".popup-actions-cancel": function () {
                                        return fadeOut(popup).then(function (p) { return p.remove(); });
                                    },
                                    ".popup-actions-reset": function () {
                                        ResetComments();
                                        WriteComments(popup);
                                    },
                                    ".popup-actions-impexp": function () { return ImportExport(popup); },
                                    ".popup-actions-toggledesc": function () {
                                        var hideDesc = load("hide-desc") || "show";
                                        save("hide-desc", hideDesc == "show" ? "hide" : "show");
                                        ShowHideDescriptions(popup);
                                    },
                                    ".popup-submit": function () {
                                        var selected = popup.querySelector("input[type=radio]:checked");
                                        var md = htmlToMarkDown(selected.closest(".action-desc").innerHTML)
                                            .replace(/\[username\]/g, username)
                                            .replace(/\[OP\]/g, OP);
                                        targetObject.value = md;
                                        targetObject.focus(); //focus provokes character count test
                                        var hereTxt = "[type here]";
                                        var caret = md.indexOf(hereTxt);
                                        if (caret >= 0)
                                            targetObject.setSelectionRange(caret, caret + hereTxt.length);
                                        fadeOut(popup).then(function (p) { return p.remove(); });
                                    },
                                };
                                var _b = __read(Object.entries(actionMap).find(function (_a) {
                                    var _b = __read(_a, 1), selector = _b[0];
                                    return target.matches(selector);
                                }) || [], 2), action = _b[1];
                                if (!action)
                                    return;
                                action();
                            });
                            see = popup.querySelector(".popup-actions-see");
                            see.addEventListener("mouseenter", function () {
                                fadeTo(popup, 0.4);
                                var notCloseEls = __spreadArray([], __read(popup.querySelectorAll(":not(#close)")));
                                notCloseEls.forEach(function (el) { return fadeOut(el); });
                            });
                            see.addEventListener("mouseleave", function () {
                                fadeTo(popup, 1.0);
                                var notCloseEls = __spreadArray([], __read(popup.querySelectorAll(":not(#close)")));
                                notCloseEls.forEach(function (el) { return fadeTo(el, 1.0); });
                            });
                            SetupRemoteBox(popup);
                            SetupWelcomeBox(popup);
                            //Auto-load from remote if required
                            if (!window.VersionChecked && load("AutoRemote") == "true") {
                                throbber = document.getElementById("throbber2");
                                remoteerror = document.getElementById("remoteerror2");
                                show(throbber);
                                loadFromRemote(load("RemoteUrl"), function () {
                                    WriteComments(popup);
                                    hide(throbber);
                                }, function (_a) {
                                    var message = _a.message;
                                    return (remoteerror.textContent = message);
                                });
                            }
                            // Attach to #content, everything else is too fragile.
                            (_b = document.getElementById("content")) === null || _b === void 0 ? void 0 : _b.append(popup);
                            center(popup);
                            StackExchange.helpers.bindMovablePopups();
                            userid = getUserId();
                            userInfoEl = document.getElementById("userinfo");
                            return [4 /*yield*/, getUserInfo(userid)];
                        case 1:
                            uinfo = _c.sent();
                            if (!uinfo) {
                                fadeOut(userInfoEl);
                                return [2 /*return*/];
                            }
                            addUserInfo(userInfoEl, uinfo);
                            OP = getOP();
                            //We only actually perform the updates check when someone clicks, this should make it less costly, and more timely
                            //also wrap it so that it only gets called the *FIRST* time we open this dialog on any given page (not much of an optimisation).
                            if (typeof checkForNewVersion == "function" &&
                                !window.VersionChecked) {
                                checkForNewVersion(popup); // eslint-disable-line no-undef
                                window.VersionChecked = true;
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
    });
})();
