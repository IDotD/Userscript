idrinth.text = {     
    data: {
        chat: {
            ui:{
                close: 'Close',
                invite:'Invite to Chat ',
                account: 'Account',
                chat: 'Chat',
                createChat: 'Create Chat',
                joinChat: 'Join Chat',
                createAddChat: "Click to create additional chat",
                creditEmoticon: 'Emoticons provided by ',
                copyIdPasswort: 'Copy Password&Id',
                moreSettings: 'More settings at ',
                deleteRoom: 'Delete Room',
                leaveRoom: 'Leave Room',
            },
            message:{
                optional: 'This part of the script is optional, so logging in is unneeded for raid catching etc.',
                invalid: 'This should not be the data for logging in on the related gaming site and the login does not need to match your ingame name - you can set a display name after the registration.',
                offline: "Not logged in, click to login/register",
                modifyFail:'Can\'t modify that user at the moment',
                createFail: 'Can\'t create at the moment',
                joinFail: 'Can\'t join at the moment',
                joinNotwork:'Joining didn\'t work',
                loginFail: 'Login failed in an unexpected way',
                unknown:'The given username for dotd.idrinth.de is unknown, do you want to register it there?',
            },
            error:{
                errorDefault: 'Unexpected error occurred. Please contact script developers'
                                + ' (https://github.com/Idrinth/IDotD).',
            }
        },
        land: {
            lackGold: 'You lack gold to buy any more buildings at the moment.',
        },
        tier: {
            diffNormal: 'Normal',
            diffHard: 'Hard',
            diffLegend: 'Legend',
            diffNight: 'Nightmare',
            tagTop: 'Tag to screen-top',
            alertNoSpaceTierbox: 'There is no space for another tier-box at the moment, please close one first.',
        },
        ui: {
            importMan: 'Import all manually',
            importFav: 'Import favs manually',
            reloadGame: 'Reload game',
            clearRaids: 'Clear Raids',
            reloadScript: 'Reload Script',
            restartJoin: 'Restart Raidjoin',
            refreshFacebookLogin: 'Refresh Facebook Game Login',
            ngJoin: 'NG Raid Join(slow!)',

            enterBossName: 'Enter Boss\' Name',
            enableExtCharInfo: 'Enable extended Characterinformation?',
            miniLayout: 'Minimalist Layout',
            moveSetLeft: 'Move settings left',
            warBottomPage: 'Show war at the bottom of the page',
            useGoldUp: 'Check to try and use up the gold as efficient as possible - uncheck to only use the most efficient buy in the land buy calculator',
            buyTenOnce: 'Buy 10 Buildings at once?(Rec)',
            millisecondsCharInfoAppears: 'Milliseconds until the extended Characterinformation disappears',
            secondsToLoadGame: 'Seconds needed to load the game for joining',
            enableChat: 'Enable chat(needs script reload)',
            importInfo:'This script will always import the raids you manually set to be imported on the website and if it\'s enabled it will also import all raids matched by one of the faved searches provided.',
            enableAutoRaidRequest: 'Enable Auto-Raid-Request for Favorites?',
            idsToJoin: 'FavoriteIds to join (separate multiple by comma)',
            maxPopupsFrame: 'Maximum Popups/Frames for joining raids',
            timeAutoJoinRaids:'Time to automatically join raids slowly(reloads game multiple times). Format is [Hours]:[Minutes] without leading zeros, so 7:1 is fine, 07:01 is not',
            getSearchFavs:'Get your search-favorites from ',
        }
    },

    // idrinth.text.get("ui.getSearchFavs")

    get: function (key) {
        var getSub = function (obj, keys, func) {
            var key = keys.shift();
            if (obj.hasOwnProperty(key)) {
                if (keys.length > 0) {
                    return func(obj[key], keys, func);
                }
                return obj[key];
            }
            return idrinth.text.data.chat.error.errorDefault;
        };
        return getSub(idrinth.text.data,key.split('.'),getSub);
    }
}