idrinth.text = {
    /**
     * if the language files have been applied correctly, this is true
     * @type Boolean
     */
    initialized: false,
    /**
     * Loads language specific code and signals it's readyness by setting
     * idrinth.text.initialized to true
     * @method start
     * @returns {undefined}
     */
    start: function () {
        var language = idrinth.settings.language || window.navigator.userLanguage || window.navigator.language;
        if ( language === 'en' ) {
            idrinth.text.initialized = true;
            return;
        }
        idrinth.core.ajax.runHome ( '', function ( file ) {
            /**
             *
             * @param {object} to
             * @param {object} from
             * @param {function} func
             * @returns {undefined}
             */
            var applyRecursive = function ( to, from, func ) {
                for (var prop in from) {
                    if ( from.hasOwnProperty ( prop ) ) {
                        if ( typeof to[prop] === 'string' && typeof from[prop] === 'string' ) {
                            to[prop] = file[prop];
                        } else if ( typeof to[prop] === 'object' && typeof from[prop] === 'object' ) {
                            func ( to[prop], from[prop], func );
                        }
                    }
                }
            };
            applyRecursive ( idrinth.text.data, JSON.parse ( file ), applyRecursive );
        }, idrinth.text.start, idrinth.text.start, null, true );
    },
    data: {
        chat: {
            ui: {
                close: 'Close',
                invite: 'Invite to Chat ',
                account: 'Account',
                chat: 'Chat',
                createChat: 'Create Chat',
                joinChat: 'Join Chat',
                createAddChat: "Click to create additional chat",
                creditEmoticon: 'Emoticons provided by ',
                copyIdPasswort: 'Copy Password&Id',
                moreSettings: 'More settings at ',
                deleteRoom: 'Delete Room',
                leaveRoom: 'Leave Room'
            },
            message: {
                optional: 'This part of the script is optional, so logging in is unneeded for raid catching etc.',
                invalid: 'This should not be the data for logging in on the related gaming site and the login does not need to match your ingame name - you can set a display name after the registration.',
                offline: "Not logged in, click to login/register",
                modifyFail: 'Can\'t modify that user at the moment',
                createFail: 'Can\'t create at the moment',
                joinFailMoment: 'Can\'t join at the moment',
                joinFail: 'Joining didn\'t work',
                loginFail: 'Login failed in an unexpected way',
                unknown: 'The given username for dotd.idrinth.de is unknown, do you want to register it there?'
            },
            error: {
            }
        },
        default: 'Unexpected error occurred. Please contact script developers'
                + ' (https://github.com/Idrinth/IDotD).',
        land: {
            lackGold: 'You lack gold to buy any more buildings at the moment.'
        },
        tier: {
            diff: {
                normal: 'Normal',
                hard: 'Hard',
                legend: 'Legend',
                night: 'Nightmare'
            },
            tagTop: 'Tag to screen-top',
            maxBoxes: 'There is no space for another tier-box at the moment, please close one first.',
            disableJoining: 'Disable joining for '
        },
        ui: {
            button: {
                ok: 'Ok',
                cancel: 'Cancel',
                importManually: 'Import all manually',
                importFav: 'Import favs manually',
                reloadGame: 'Reload game',
                clearRaids: 'Clear Raids',
                reloadScript: 'Reload Script',
                restartRaidJoin: 'Restart Raidjoin',
                refreshFBGameLogin: 'Refresh Facebook Game Login',
                ngRaidJoin: 'NG Raid Join(slow!)',
                calc: 'Calculate',
                disableTimedAutoJoin: 'disable timed Autojoin',
                enableTimedAutoJoin: 'enable timed Autojoin'
            },
            lastRaidsJoined: 'Last raids joined:',
            enterBossName: 'Enter Boss\' Name',
            settingInfo: 'This script will always import the raids you manually set to be imported on the website and if it\'s enabled it will also import all raids matched by one of the faved searches provided.',
            maxPopupsFrame: 'Maximum Popups/Frames for joining raids',
            timeAutoJoin: 'Time to automatically join raids slowly(reloads game multiple times). Format is [Hours]:[Minutes] without leading zeros, so 7:1 is fine, 07:01 is not',
            getFavFrom: 'Get your search-favorites from ',
            raidsearch: 'Idrinth\'s Raidsearch',
            goldHour: ' gold per hour each',
            availGold: 'Avaible Gold',
            clickCopy: 'click to copy raid link',
            reloadGameFail: 'The game couldn\'t be reloaded',
            setting: {
                enableExtendedCharInfo: 'Enable extended Characterinformation?',
                minimLayout: 'Minimalist Layout',
                moveSettingLeft: 'Move settings left',
                warBottomPage: 'Show war at the bottom of the page',
                useGoldEfficiently: 'Check to try and use up the gold as efficient as possible - uncheck to only use the most efficient buy in the land buy calculator',
                tenBuildOnce: 'Buy 10 Buildings at once?(Rec)',
                extCharInfoDuration: 'Milliseconds until the extended Characterinformation disappears',
                joiningDuration: 'Seconds needed to load the game for joining',
                enableChat: 'Enable chat(needs script reload)',
                enableFavRequest: 'Enable Auto-Raid-Request for Favorites?',
                favIdToJoin: 'FavoriteIds to join (separate multiple by comma)',
                worldserver: 'Worldserver?',
                disableAutoJoinSpecific: 'Disable Autojoining for specific raids'
            }
        }
    },
    /**
     * returns the translation of a provided key or an error-message if no
     * matching translation is found
     * @param string key
     * @returns {string}
     */
    get: function ( key ) {
        var getSub = function ( obj, keys, func ) {
            var key = keys.shift ();
            if ( obj.hasOwnProperty ( key ) ) {
                if ( keys.length > 0 ) {
                    return func ( obj[key], keys, func );
                }
                return obj[key];
            }
            return idrinth.text.data.error;
        };
        return getSub ( idrinth.text.data, key.split ( '.' ), getSub );
    }
};