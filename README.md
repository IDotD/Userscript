# IDotD
A script for dawn of the dragons, that works based on data provided to https://dotd.idrinth.de via UgUp

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e80204911a734a56a471ab9b9ac649db)](https://www.codacy.com/app/eldrim/IDotD?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Idrinth/IDotD&amp;utm_campaign=Badge_Grade)
[![Code Climate](https://codeclimate.com/github/Idrinth/IDotD/badges/gpa.svg)](https://codeclimate.com/github/Idrinth/IDotD)
[![Issue Count](https://codeclimate.com/github/Idrinth/IDotD/badges/issue_count.svg)](https://codeclimate.com/github/Idrinth/IDotD)

# Bugs, desired Features etc.

We prefer the usage of the [tracker](https://github.com/Idrinth/IDotD/issues) here, otherwise we do import requests from [GoogleDocs](https://docs.google.com/document/d/1ozOWQuAEKCNnt2cwQ4SZtkpYM_pvrl8Bnj0e_O1KKWs/edit) from time to time.
[Previous GooglDocs Tickets](https://github.com/Idrinth/IDotD/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3A%22Source%20GoogleDocs%22%20)

# Idrinth’s DotD Script - A Manual

## Content

* [Content](#content)
* [Basics](#basics)
    * [What does the script do?](#what-does-the-script-do)
    * [Why use a raidcatcher?](#why-use-a-raidcatcher)
    * [What other raidcatchers are there?](#what-other-raidcatchers-are-there)
* [Installation & Setup](#installation--setup)
    * [A Monkey?](#a-monkey)
    * [Installing the script](#installing-the-script)
    * [Where do I find it now?](#where-do-i-find-it-now)

## Basics

### What does the script do?

* A raid tier lookup based on data provided by mutik(thank you)

* A land buy calculator with different options(don't waste money vs buy as much as possible)

* A chat system, that allows raid sharing to specific groups of people in private rooms and auto-pubbing those raids

* An automatic raid-join service avaible on facebook, armorgames and kongregate(Attention, the facebook version needs iframes for that)

* You can see the basic ingame data of people chatting on Kong while on the Dawn of the Dragon's Game-Page

* You help adding to known Kongregate names, improving the [Search](http://dotd.idrinth.de/kongregate/platform/) and increasing the amount of people that will show you their ingame Profile

* Provide a list of unjoined raids, where you can copy the links with a single click(ALL platforms)

### Why use a raidcatcher?

Raidcatchers are helpful in multiple ways. They reduce the amount of time you need to spend asking for already known raids in the world chat, they provide you with a less click-intensive way of joining raids and reduce the amount of trains in the world chat, allowing for conversations to take place.

### What other raidcatchers are there?

As far as I know there are two more authors for raid catchers at the moment. [Hesperus ](http://www.dawnofthedragons.com/forums/forums/showthread.php?42960-Hesperus-Raid-Conglomerator)has downloadable application for joining raids on pretty much any server, Mutik has a script for [Armorgames ](https://greasyfork.org/de/scripts/9868-mutik-s-dotd-script-for-armorgames) and one for [Kongregate ](https://greasyfork.org/de/scripts/406-mutik-s-dotd-script)doing the task.

## Installation & Setup

### A Monkey?

As with any userscript you'll need a Monkey - if you installed mutik's script you already have one, otherwise use  [Tampermonkey(Chrome&Opera)](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=de), [Violentmonkey(Opera)](https://addons.opera.com/de/extensions/details/violent-monkey/) or [Greasemonkey(Firefox)](https://addons.mozilla.org/de/firefox/addon/greasemonkey/)  depending on the browser used.

### Installing the script

To install the script you merely need to open it’s URL in the browser you installed the monkey in. That should make the monkey ask you to install it.

Don’t be worried about the size of the script, since you are only installing a loader, that makes sure you can have an up to date version without needing to rely on luck when the monkeys update.

### Where do I find it now?

To have a userscript loaded, you will need to load the side it’s going to be used on, if it’s already open reload it, otherwise just open it normally.

You will find some grey boxes to the right:

* a bar with the version number containing all of the raid catching parts and most tools

* an open login window for the chat shipping with the raidcatcher

* a button to minimize the chat

## Usual settings

### Where is the settings window?

The settings are one of the tabs that show after left clicking the bar with the version information. The settings differ a bit from platform to platform, since they are not all avaible due to differences in the page’s structure.

The following settings are currently avaible:

* enable/disable chat completely

* buy land to minimize gold or buy land with higher left over gold

* favorites to import

* buy 1 or 10 buildings at once in the land calculator

* duration of the character information being shown

* minimalist layout

* move items left

* display kong user info

* import raids automatically

* set maximum amount of iframes for joining

