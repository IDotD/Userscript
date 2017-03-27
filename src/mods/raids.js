idrinth.raids = {
    /**
     * @type Object
     */
    list: { },
    /**
     * @type Object
     */
    private: { },
    /**
     * @type Object
     */
    joined: { },
    /**
     * @type Number
     */
    requested: 0,
    /**
     * 
     * @param {Number} id
     * @returns {undefined}
     */
    import: function ( id ) {
        if ( !idrinth.platform ) {
            return;
        }
        /**
         * 
         * @param {String} toImport
         * @returns {String}
         */
        var getImportLink = function ( toImport ) {
            return 'raid-service/' + ( toImport === '' ? '_' : toImport ) + '/';
        };
        idrinth.core.ajax.runHome (
                getImportLink ( id ),
                /**
                 * 
                 * @param {string} responseText
                 * @returns {undefined}
                 */
                        function ( responseText ) {
                            var delHandler = function ( key ) {
                                if ( key in idrinth.raids.list ) {
                                    delete idrinth.raids.list[key];
                                }
                                if ( key in idrinth.raids.joined ) {
                                    delete idrinth.raids.joined[key];
                                }
                                if ( document.getElementById ( 'idrinth-raid-link-' + key ) ) {
                                    idrinth.ui.removeElement ( 'idrinth-raid-link-' + key );
                                }
                            };
                            var list = JSON.parse ( responseText );
                            for (var key in list) {
                                if ( list[key].delete ) {
                                    delHandler ( key );
                                } else {
                                    //worst case: overwriting itself
                                    list[key].private = idrinth.raids.list[key] && idrinth.raids.list[key].private;
                                    idrinth.raids.list[key] = list[key];
                                }
                            }
                        },
                        function () {
                        },
                        function () {
                        },
                        idrinth.raids.knowRaids ()
                        );
            },
    /**
     * 
     * @returns {String}
     */
    knowRaids: function () {
        return ( ( Object.keys ( idrinth.raids.joined ) ).concat ( Object.keys ( idrinth.raids.list ) ) ).join ();
    },
    /**
     * 
     * @returns {undefined}
     */
    clearAll: function () {
        idrinth.core.timeouts.remove ( 'raids' );
        while ( document.getElementById ( "idrinth-raid-link-list" ).firstChild ) {
            idrinth.ui.removeElement ( document.getElementById ( "idrinth-raid-link-list" ).firstChild.id );
        }
        idrinth.raids.list = { };
        idrinth.raids.joined = { };
        idrinth.raids.start ();
    },
    join: {
        /**
         * 
         */
        data: {
            /**
             * @type String
             */
            prefix: null,
            /**
             * @type String
             */
            tag: null
        },
        /**
         * 
         * @param {String} key
         * @returns {String}
         */
        getServerLink: function ( key ) {
            /**
             * 
             * @param {Object} list
             * @param {String} key
             * @param {String} prefix
             * @param {String} tag
             * @returns {String|Boolean}
             */
            var getLink = function ( list, key, prefix, tag ) {
                var build = function ( data, tag, prefix ) {
                    try {
                        return prefix +
                                tag + 'action_type=raidhelp&' +
                                tag + 'raid_id=' + data.raidId + '&' +
                                tag + 'difficulty=' + data.difficulty + '&' +
                                tag + 'hash=' + data.hash +
                                ( idrinth.settings.get ( "isWorldServer" ) ? '&' + tag + 'serverid=' + 2 : '' );
                    } catch ( e1 ) {
                        return false;
                    }
                };
                if ( list[key] ) {
                    var link = build ( list[key], tag, prefix );
                    if ( link ) {
                        return link;
                    }
                }
            };
            /**
             * 
             * @returns {String}
             */
            var makePrefix = function () {
                if ( idrinth.raids.join.data.prefix === null ) {
                    var sites = {
                        armorgames: 'http://50.18.191.15/armor/raidjoin.php?user_id=###id###&auth_token=###token###&',
                        kongregate: 'http://50.18.191.15/kong/raidjoin.php?kongregate_username=###name###&kongregate_user_id=###id###&kongregate_game_auth_token=###token###&',
                        newgrounds: 'https://newgrounds.com/portal/view/609826?',
                        dawnofthedragons: 'https://web1.dawnofthedragons.com/live_iframe/raidjoin.php?',
                        facebook: 'https://web1.dawnofthedragons.com/live_iframe/raidjoin.php?'
                    };
                    idrinth.raids.join.data.prefix = ( ( ( sites[idrinth.platform].replace (
                            '###id###', idrinth.user.id
                            ) ).replace (
                            '###token###', idrinth.user.token
                            ) ).replace (
                            '###name###', idrinth.user.name
                            ) );
                }
                return idrinth.raids.join.data.prefix;
            };
            /**
             * 
             * @returns {String}
             */
            var makeTag = function () {
                if ( idrinth.raids.join.data.tag === null ) {
                    var sites = {
                        armorgames: 'ar_',
                        kongregate: 'kv_',
                        newgrounds: 'ng_',
                        facebook: '',
                        dawnofthedragons: ''
                    };
                    idrinth.raids.join.data.tag = sites[idrinth.platform];
                }
                return idrinth.raids.join.data.tag;
            };
            var prefix = makePrefix ();
            var tag = makeTag ();
            var link = getLink ( idrinth.raids.list, key, prefix, tag );
            if ( link ) {
                return link;
            }
            link = getLink ( idrinth.raids.joined, key, prefix, tag );
            if ( link ) {
                return link;
            }
            return prefix;
        },
        /**
         * 
         */
        messages: {
            /**
             * 
             * @param {String} string
             * @param {String} key
             * @returns {undefined}
             */
            log: function ( string, key ) {
                var message = ( string.replace ( '#name#', idrinth.raids.list[key].name ) ).replace ( '#raid#', idrinth.raids.list[key].raid );
                idrinth.core.log ( message );
                var li = document.createElement ( 'li' );
                var ul = document.getElementById ( 'idrinth-joined-raids' ).getElementsByTagName ( 'ul' )[0];
                li.appendChild ( document.createTextNode ( ( new Date () ).toLocaleTimeString () + ' ' + message ) );
                if ( !ul.firstChild ) {
                    ul.appendChild ( li );
                } else {
                    if ( ul.childNodes.length > 9 ) {
                        ul.removeChild ( ul.lastChild );
                    }
                    ul.insertBefore ( li, ul.firstChild );
                }
            },
            /**
             * 
             * @param {String} key
             * @returns {undefined}
             */
            addToJoined: function ( key ) {
                if ( key && idrinth.raids.list.hasOwnProperty ( key ) ) {
                    idrinth.raids.joined[key] = idrinth.raids.list[key];
                    delete idrinth.raids.list[key];
                }
            },
            /**
             * 
             * @param {String} key
             * @returns {undefined}
             */
            success: function ( key ) {
                idrinth.raids.join.messages.log ( 'Joined #name#\'s #raid#.', key );
                idrinth.ui.removeElement ( 'idrinth-raid-link-' + key );
                this.addToJoined ( key );
            },
            /**
             * 
             * @param {String} key
             * @returns {undefined}
             */
            failed: function ( key ) {
                idrinth.raids.join.messages.log ( 'Could not join #name#\'s #raid#', key );
            },
            /**
             * 
             * @param {String} key
             * @returns {undefined}
             */
            trying: function ( key ) {
                ( ( function ( key ) {
                    idrinth.core.timeouts.add ( 'raid.join.' + key, function () {
                        var id = 'idrinth-raid-link-' + key;
                        if ( document.getElementById ( id ) ) {
                            idrinth.ui.removeElement ( id );
                        }
                    }, 300 );
                } ) ( key ) );
                if ( idrinth.raids.list[key] ) {
                    idrinth.raids.join.messages.log ( 'Trying to join #name#\'s #raid#', key );
                }
                this.addToJoined ( key );
            }
        },
        /**
         * 
         * @returns {undefined}
         */
        process: function () {
            /**
             * 
             * @returns {Boolean}
             */
            var join = function () {
                /**
                 * 
                 * @returns {function[]}
                 */
                var getServerMethods = function () {
                    /**
                     * 
                     * @param {String} key
                     * @returns {Function}
                     */
                    var byMessage = function ( key ) {
                        idrinth.inframe.send (
                                'joinRaid',
                                ( idrinth.raids.join.getServerLink ( key ) ).replace ( /^.*raidjoin\.php/, 'raidjoin.php' )
                                );
                        idrinth.raids.join.messages.trying ( key );
                    };
                    /**
                     * 
                     * @param {String} key
                     * @returns {undefined}
                     */
                    var postLink = function ( key ) {
                        if ( !document.getElementById ( 'idrinth-raid-link-' + key ) ) {
                            document.getElementById ( 'idrinth-raid-link-list' ).appendChild (
                                    idrinth.ui.buildElement (
                                            {
                                                children: [
                                                    {
                                                        type: 'span',
                                                        css: 'clipboard-copy',
                                                        id: 'idrinth-raid-link-' + key,
                                                        attributes: [
                                                            {
                                                                name: 'data-clipboard-text',
                                                                value: idrinth.raids.join.getServerLink ( key )
                                                            }
                                                        ],
                                                        content: idrinth.raids.list[key].name + '\'s ' + idrinth.raids.list[key].raid
                                                    }
                                                ]
                                            }
                                    )
                                    );
                        }
                    };
                    var options = [ postLink ];
                    if ( idrinth.platform === 'armorgames' || idrinth.platform === 'kongregate' ) {
                        options.push ( byMessage );
                    }
                    return options;
                };
                /**
                 * 
                 * @param {Number} amount
                 * @returns {Boolean}
                 */
                var reachedMax = function ( amount ) {
                    return amount > 99;
                };
                /**
                 * 
                 * @param {Number} added
                 * @param {String} key
                 * @param {function[]} options
                 * @returns {Number}
                 */
                var handleKey = function ( added, key, options ) {
                    var raid = idrinth.raids.list[key];
                    if ( !raid.joined ) {
                        added++;
                        options[0] ( key );//post link
                        if (
                                (
                                        ( !idrinth.settings.get ( "bannedRaids#" + raid.raid ) && !idrinth.settings.get ( "raidWhitelist" ) ) ||
                                        ( idrinth.settings.get ( "bannedRaids#" + raid.raid ) && idrinth.settings.get ( "raidWhitelist" ) )
                                        ) && (
                                !raid.private ||
                                idrinth.settings.get ( 'raid#joinPrivate' )
                                )
                                ) {
                            for (var count = 1; count < options.length; count++) {
                                options[count] ( key );
                            }
                        }
                    }
                    return added;
                };
                var added = 0;
                var options = getServerMethods ();
                for (var key in idrinth.raids.list) {
                    if ( typeof idrinth.raids.list[key] === 'object' ) {
                        added = handleKey ( added, key, options );
                    }
                    if ( reachedMax ( added ) ) {
                        return true;
                    }
                }
                return false;
            };
            /**
             * requests information for raids caught from a third party(chat for example)
             * @returns {undefined}
             */
            var handlePrivates = function () {
                /**
                 * 
                 * @param {String} reply
                 * @returns {undefined}
                 */
                var handle = function ( reply ) {
                    if ( !reply ) {
                        return;
                    }
                    reply = JSON.parse ( reply );
                    if ( !reply ) {
                        return;
                    }
                    if ( !reply.hasOwnProperty ( 'delete' ) ) {
                        idrinth.raids.list[reply.aid] = reply;
                        idrinth.raids.list[reply.aid].private = true;
                    }
                    try {
                        delete idrinth.raids.private[reply.raidId];
                    } catch ( e ) {
                        idrinth.core.log ( e.getMessage ? e.getMessage () : e.message );
                    }
                };
                if ( !idrinth.settings.get ( 'stat#requestPrivate' ) ) {
                    return;
                }
                for (var raidId in idrinth.raids.private) {
                    idrinth.core.ajax.runHome (
                            'get-raid-service/' + raidId + '/' + idrinth.raids.private[raidId] + '/',
                            handle
                            );
                }
            };
            if ( !join () && Date.now () - 60000 > idrinth.raids.requested ) {
                idrinth.raids.requested = Date.now ();
                idrinth.raids.import ( idrinth.settings.get ( "raids" ) ? idrinth.settings.get ( "favs" ) : '-1' );
            }
            handlePrivates ();
        }
    },
    /**
     * 
     * @returns {undefined}
     */
    start: function () {
        idrinth.core.timeouts.remove ( 'raids' );
        idrinth.core.timeouts.add ( 'raids', idrinth.raids.join.process, 1500, -1 );
    }
};