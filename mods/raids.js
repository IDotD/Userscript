idrinth.raids = {
    script: null,
    list: { },
    joined: { },
    interval: null,
    requested: 0,
    clearInterval: function () {
        try {
            window.clearInterval ( idrinth.raids.interval );
        } catch ( e ) {
            idrinth.raids.interval = null;
        }
    },
    restartInterval: function () {
        this.clearInterval ();
        idrinth.raids.interval = window.setInterval ( idrinth.raids.join.process, 1500 );
    },
    import: function ( ) {
        'use strict';
        idrinth.raids.importId ( idrinth.settings.raids ? idrinth.settings.favs : '-1' );
    },
    importId: function ( id ) {
        'use strict';
        if ( !idrinth.platform ) {
            return;
        }
        var getImportLink = function ( toImport ) {
            return 'https://dotd.idrinth.de/' + ( idrinth.settings.isWorldServer ? 'world-' : '' ) + idrinth.platform +
                    '/raid-service/' + ( toImport === '' ? '_' : toImport ) + '/';
        };
        idrinth.runAjax (
                getImportLink ( id ),
                function ( responseText ) {
                    'use strict';
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
                        } else {//worst case: overwriting itself
                            idrinth.raids.list[key] = list[key];
                        }
                    }
                },
                function ( ) {
                },
                function ( ) {
                },
                idrinth.raids.knowRaids ()
                );
    },
    knowRaids: function () {
        return ( ( Object.keys ( idrinth.raids.joined ) ).concat ( Object.keys ( idrinth.raids.list ) ) ).join ();
    },
    importManually: function ( all ) {
        'use strict';
        idrinth.raids.importId ( all ? '_' : idrinth.settings.favs );
    },
    clearAll: function () {
        this.clearInterval ( );
        while ( document.getElementById ( "idrinth-raid-link-list" ).firstChild ) {
            idrinth.ui.removeElement ( document.getElementById ( "idrinth-raid-link-list" ).firstChild.id );
        }
        idrinth.raids.list = { };
        idrinth.raids.joined = { };
        idrinth.raids.restartInterval ();
    },
    join: {
        data: {
            prefix: null,
            tag: null
        },
        getServerLink: function ( key ) {
            var getLink = function ( list, key, prefix, tag ) {
                var build = function ( data, tag, prefix ) {
                    try {
                        return prefix +
                                tag + 'action_type=raidhelp&' +
                                tag + 'raid_id=' + data.raidId + '&' +
                                tag + 'difficulty=' + data.difficulty + '&' +
                                tag + 'hash=' + data.hash +
                                ( idrinth.settings.isWorldServer ? '&' + tag + 'serverid=' + 2 : '' );
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
                return idrinth.raids.join.data.prefix;
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
        messages: {
            writeToGui: function ( string ) {
                var li = document.createElement ( 'li' );
                var ul = document.getElementById ( 'idrinth-joined-raids' ).getElementsByTagName ( 'ul' )[0];
                li.appendChild ( document.createTextNode ( ( new Date () ).toLocaleTimeString () + ' ' + string ) );
                if ( !ul.firstChild ) {
                    ul.appendChild ( li );
                } else {
                    if ( ul.childNodes.length > 9 ) {
                        ul.removeChild ( ul.lastChild );
                    }
                    ul.insertBefore ( li, ul.firstChild );
                }
            },
            log: function ( string ) {
                idrinth.log ( string );
                idrinth.raids.join.messages.writeToGui ( string );
            },
            addToJoined: function ( key ) {
                if ( key && idrinth.raids.list.hasOwnProperty ( key ) ) {
                    idrinth.raids.joined[ key ] = idrinth.raids.list[ key ];
                    delete idrinth.raids.list[ key ];
                }
            },
            success: function ( key ) {
                'use strict';
                idrinth.raids.join.messages.log ( 'Joined ' + idrinth.raids.list[key].name + '\'s ' + idrinth.raids.list[key].raid );
                idrinth.ui.removeElement ( 'idrinth-raid-link-' + key );
                this.addToJoined ( key );
            },
            failed: function ( key ) {
                'use strict';
                idrinth.raids.join.messages.log ( 'Could not join ' + idrinth.raids.list[key].name + '\'s ' + idrinth.raids.list[key].raid );
            },
            trying: function ( key ) {
                'use strict';
                ( ( function ( key ) {
                    window.setTimeout ( function () {
                        var id = 'idrinth-raid-link-' + key;
                        if ( document.getElementById ( id ) ) {
                            idrinth.ui.removeElement ( id );
                        }
                    }, 300 );
                } ) ( key ) );
                if ( idrinth.raids.list[key] ) {
                    idrinth.raids.join.messages.log ( 'Trying to join ' + idrinth.raids.list[key].name + '\'s ' + idrinth.raids.list[key].raid );
                }
                this.addToJoined ( key );
            }
        },
        'do': function ( ) {
            'use strict';
            var getServerMethods = function () {
                var byAjax = function ( key ) {
                    'use strict';
                    idrinth.runAjax (
                            idrinth.raids.join.servers.getServerLink ( key ),
                            function ( ) {
                                idrinth.raids.join.messages.success ( key );
                            },
                            function ( ) {
                                idrinth.raids.join.messages.failed ( key );
                            },
                            function ( ) {
                                idrinth.raids[key].joined = false;
                                idrinth.raids.join.messages.failed ( key );
                            }
                    );
                };
                var byFrame = function ( key ) {
                    'use strict';
                    var exist = document.getElementsByClassName ( 'idrinth-join-frame' ).length;
                    if ( exist >= idrinth.settings.windows ) {
                        idrinth.raids.list[key].joined = false;
                        return;
                    }
                    var frame = idrinth.ui.buildElement ( {
                        type: 'iframe',
                        css: 'idrinth-join-frame',
                        id: 'join-' + key,
                        attributes: [
                            {
                                name: 'src',
                                value: idrinth.raids.join.servers.getServerLink ( key )
                            },
                            {
                                name: 'sandbox',
                                value: 'allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts'
                            },
                            {
                                name: 'style',
                                value: 'top:' + exist + 'px;'
                            },
                            {
                                name: 'onload',
                                value: 'try{event.stopPropagation();}catch(e){}window.setTimeout(){function(){idrinth.ui.removeElement(\'' + key + '\');},1234);'
                            },
                            {
                                name: 'onunload',
                                value: 'try{event.stopPropagation();}catch(e){}'
                            }
                        ]
                    } );
                    ( ( function ( key ) {
                        return window.setTimeout ( function () {
                            idrinth.ui.removeElement ( 'join-' + key );
                        }, 30000 );
                    } ) ( key ) );
                    idrinth.ui.body.appendChild ( frame );
                    idrinth.raids.join.messages.trying ( key );
                };
                var postLink = function ( key ) {
                    'use strict';
                    if ( !document.getElementById ( 'idrinth-raid-link-' + key ) ) {
                        var span = document.createElement ( 'span' );
                        span.id = 'idrinth-raid-link-' + key;
                        span.setAttribute ( 'data-clipboard-text', idrinth.raids.join.servers.getServerLink ( key ) );
                        span.appendChild ( document.createTextNode ( idrinth.raids.list[key].name + '\'s ' + idrinth.raids.list[key].raid ) );
                        document.getElementById ( 'idrinth-raid-link-list' ).appendChild ( span );
                    }
                };
                var options = [ postLink ];
                if ( idrinth.platform === 'armorgames' || idrinth.platform === 'kongregates' ) {
                    options.push ( byAjax );
                } else if ( idrinth.platform === 'facebook' || idrinth.platform === 'dawnofthedragons' ) {
                    options.push ( byFrame );
                }
                return options;
            };
            var added = 0;
            var options = getServerMethods ();
            for (var key in idrinth.raids.list) {
                if ( !idrinth.raids.list[key].joined ) {
                    added++;
                    for (var count = 0; count < options.length; count++) {
                        options[count] ( key );
                    }
                }
                if ( added > 99 || ( ( idrinth.platform === 'facebook' || idrinth.platform === 'dawnofthedragons' ) && added >= idrinth.settings.windows ) ) {
                    return true;
                }
            }
            return false;
        },
        process: function ( ) {
            'use strict';
            if ( !idrinth.raids.join.do ( ) && Date.now ( ) - 60000 > idrinth.raids.requested ) {
                idrinth.raids.requested = Date.now ( );
                idrinth.raids.import ( );
            }
        }
    },
    start: function ( ) {
        'use strict';
        idrinth.raids.restartInterval ();
    }
};
