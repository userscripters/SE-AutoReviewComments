<div id="metadata" align="center">
  <h1 id="name" align="center">Auto Review Comments</h1>
  <p align="center">
    Pro-forma comments for Stack Exchange
    <br>
    <a id="pulls" href="https://github.com/userscripters/SE-AutoReviewComments/pulls"><strong>Contribute now</strong></a>
    <br>
    <br>
    <a id="stackapps" href="http://stackapps.com/q/2116">StackApps.com</a>
    ·
    <a id="contributors" href="https://github.com/userscripters/SE-AutoReviewComments/graphs/contributors">Contributors</a>
    <br>
  </p>
</div>

### TOC

* [Introduction][1]
* [Features][2]
* [Installation][3]
* [Credits][4]

## No more re-typing the same comments over and over!

This script adds a little 'auto' link next to all comments boxes. When you click the link, you see a popup with customizable auto-comments (canned responses), which you can easily click to insert.

This script was inspired by answers to [this question on meta][5]. See also [here][6] for some history.

## Features

1. **Read your comment before you post it!**  
Note that the dialog only _inserts_ the text, it doesn't _send_ the comment, nor does it flag anything; this is so that you can **check** the text before posting!
2. **Customize the texts**  
Simply [double click][7] on a comment text or description to customize it. Hit the 'cancel' button if you screw up. This customization is currently **per-site**. Note that the "Welcome to `$SITENAME$`" text is automagically inserted if the user is 'new' (member for less than a week), so you don't _need_ to add that to your custom text (but you can if you want to, see '9' below).  
It is possible to target comments to specific use-cases (Answers, Questions, etc.) - see Import/export section below  
If you need more/less than the default 6 comments, just carry on reading...
3. **Quick user info**  
The dialog also includes a mini-summary of the user's activity (because if they haven't been back in months, there's no point writing them a comment).
4. **Automatic notification of new versions**  
The script will also **notify you if a newer version is created**.
5. **Import/export of custom comments**  
This helps with transferring custom comments between sites. The export/import 'format' is presented as markdown, so you can post it elsewhere, and let others benefit from your words of wisdom.  
Note that you can also use the Import to create an arbitrary number of comments (the default is 6). If there are too many, you can use the show/hide desc link to gain a bit of space.  
Title prefixes are allowed and permit a comment to be targeted to the associated dialogue (see point 7).
6. **Remote sources for comments**  
If you get bored with copy/pasting your comments between sites and/or computers, you can use the 'remote' button to define a remote source for your comment texts.  
You can choose between JSON and legacy JSONP source (note that only one at a time will work).
7. **Scoping comments**  
If you prefix your comment title with `[Q]`, it will be only displayed for questions, etc (see below). Non-prefixed comments are always displayed.  
The expected format for the title prefix (in the import/export dialogue) is: `###[Q] More than one question asked`

| Type | Prefix || ---- | ------ || Closure | `C` || CommentQuestion | `Q` || CommentAnswer | `A` || EditSummaryAnswer | `EA` || EditSummaryQuestion | `EQ` |1. **Using shortcodes**  
If the text `[type here]` is included in a comment, it will be automatically selected for completion when inserted. `[username]` will be replaced with the user's name (or just 'user' if nothing was found), and `[OP]` with the original poster's name (if found, else 'OP'). Also, `$MYUSERID$` will be replaced with your user id for the current site.
2. **Customise welcome message**  
The default message is `Welcome to $SITENAME$` \- which is shown for any 1-week-old users. By clicking on the 'welcome' link at the bottom of the popup, you can opt to change this message, or leave it empty to show no messages at all. You can also 'force' the message for older users on a one-off basis. This is per-site.

## Installation

You can download the [user script][8] or [preview the code][9].

Here are some [useful browser-specific instructions][10] on getting it to work. For more information about user scripts, check out the [\[tag:script\] tag wiki][10].

## Credits

* [Benjol][11], see [all versions][12] and [commits][13]
* [Tom Wijsman][14], see [v1.0.8][15]
* [balpha][16], see [v1.1.0][17]
* [Sathya][18], see [v1.1.6][19] and [commits][20]
* [ThiefMaster][21], see [v1.2.1][22]
* [Oliver Salzburg][23], see [v1.2.3][24] and [commits][25]
* [Shog9][26], see [v1.2.4][27]
* [PeeHaa][28], see [v1.2.9][29]
* [Derek][30], see [v1.2.9][31] and [commits][32]
* [Caleb][33], see [v1.3.1][31] and [commits][34]
* [bmdixon][35], see [v1.3.1][31]
* [Izzy][36], see [v1.3.2][37] and [commits][38]

All the people who noted bugs and made suggestions in the comments and answers [on the Stack Apps page][39]!


[1]: #no-more-re-typing-the-same-comments-over-and-over
[2]: #features
[3]: #installation
[4]: #credits
[5]: http://meta.stackoverflow.com/questions/74194/how-to-review-can-we-agree-on-a-review-policy
[6]: http://stackapps.com/questions/2116/autoreviewcomments-pro-forma-comments-for-se
[7]: http://stackapps.com/questions/2116/pro-forma-comments-for-review-educating-users-before-flagging/2134#2134
[8]: https://github.com/userscripters/SE-AutoReviewComments/raw/master/dist/autoreviewcomments.user.js
[9]: https://github.com/userscripters/SE-AutoReviewComments/blob/master/dist/autoreviewcomments.user.js
[10]: http://stackapps.com/tags/script/info
[11]: http://stackexchange.com/users/6711/benjol
[12]: https://github.com/userscripters/SE-AutoReviewComments/releases
[13]: https://github.com/userscripters/SE-AutoReviewComments/commits?author=Benjol
[14]: http://stackexchange.com/users/19908/tom-wijsman
[15]: https://github.com/userscripters/SE-AutoReviewComments/releases/tag/v1.0.8
[16]: http://stackexchange.com/users/40051/balpha
[17]: https://github.com/userscripters/SE-AutoReviewComments/releases/tag/v1.1.0
[18]: http://stackexchange.com/users/33230/sathya
[19]: https://github.com/userscripters/SE-AutoReviewComments/releases/tag/v1.0.6
[20]: https://github.com/userscripters/SE-AutoReviewComments/commits?author=SathyaBhat
[21]: http://stackexchange.com/users/113304/thiefmaster
[22]: https://github.com/userscripters/SE-AutoReviewComments/releases/tag/v1.2.1
[23]: http://stackexchange.com/users/95447/oliver-salzburg
[24]: https://github.com/userscripters/SE-AutoReviewComments/releases/tag/v1.2.3
[25]: https://github.com/userscripters/SE-AutoReviewComments/commits?author=oliversalzburg
[26]: http://stackexchange.com/users/620/shog9
[27]: https://github.com/userscripters/SE-AutoReviewComments/releases/tag/v1.2.4
[28]: http://stackexchange.com/users/239224/peehaa
[29]: https://github.com/userscripters/SE-AutoReviewComments/releases/tag/v1.2.9
[30]: http://stackexchange.com/users/106573/derek
[31]: https://github.com/userscripters/SE-AutoReviewComments/releases/tag/v1.3.1
[32]: https://github.com/userscripters/SE-AutoReviewComments/commits?author=derek1906
[33]: http://stackexchange.com/users/120635/caleb
[34]: https://github.com/userscripters/SE-AutoReviewComments/commits?author=alerque
[35]: http://stackexchange.com/users/412603/bmdixon
[36]: http://stackexchange.com/users/1540386/izzy
[37]: https://github.com/userscripters/SE-AutoReviewComments/releases/tag/v1.3.2
[38]: https://github.com/userscripters/SE-AutoReviewComments/commits?author=IzzySoft
[39]: http://stackapps.com/q/2116