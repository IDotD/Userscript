idrinth.raids = {
    script: null,
    list: { },
    joined: { },
    interval: null,
    requested: 0,
    restartInterval: function () {
        try {
            window.clearInterval ( idrinth.raids.interval );
        } catch ( e ) {
            idrinth.raids.interval = null;
        }
        idrinth.raids.interval = window.setInterval ( function ( ) {
            idrinth.raids.join.process ( );
        }, 1500 );
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
                idrinth.raids.importProcess,
                function ( ) {
                },
                function ( ) {
                },
                idrinth.raids.knowRaids ()
                );
    },
    knowRaids: function () {
        var data = '';
        if ( Object.keys ( idrinth.raids.joined ).length > 0 ) {
            data = data + ',' + ( Object.keys ( idrinth.raids.joined ) ).join ();
        }
        if ( Object.keys ( idrinth.raids.list ).length > 0 ) {
            data = data + ',' + ( Object.keys ( idrinth.raids.list ) ).join ();
        }
        return data.replace ( /^,|,$/, '' );
    },
    importManually: function ( all ) {
        'use strict';
        idrinth.raids.importId ( all ? '_' : idrinth.settings.favs );
    },
    importProcess: function ( responseText ) {
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
    clearAll: function () {
        try {
            window.clearInterval ( idrinth.raids.interval );
        } catch ( e ) {
            idrinth.raids.interval = null;
        }
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
            makePrefix: function () {
                if ( idrinth.raids.join.data.prefix === null ) {
                    var sites={
                        armorgames:'http://50.18.191.15/armor/raidjoin.php?user_id=###id###&auth_token=###token###&',
                        kongregate:'http://50.18.191.15/kong/raidjoin.php?kongregate_username=###name###&kongregate_user_id=###id###&kongregate_game_auth_token=###token###&',
                        newgrounds:'https://newgrounds.com/portal/view/609826?',
                        dawnofthedragons:'https://web1.dawnofthedragons.com/live_iframe/raidjoin.php?',
                        facebook:'https://web1.dawnofthedragons.com/live_iframe/raidjoin.php?'
                    };
                    idrinth.raids.join.data.prefix=(((sites[idrinth.platform].replace (
                        '###id###',idrinth.user.id
                        )).replace (
                        '###token###',idrinth.user.token
                        )).replace (
                        '###name###',idrinth.user.name
                        ));
                }
                return idrinth.raids.join.data.prefix;
            },
            tag: { armorgames: 'ar_', kongregate: 'kv_', newgrounds: 'ng_', facebook: '', dawnofthedragons: '' }
        },
        servers: {
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
                var prefix = idrinth.raids.join.data.makePrefix ();
                var tag = idrinth.raids.join.data.tag[idrinth.platform];
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
            kongregate: function ( key ) {
                'use strict';
                idrinth.raids.join.byAjax.do ( key, idrinth.raids.join.servers.getServerLink ( key ) );
            },
            armorgames: function ( key ) {
                'use strict';
                idrinth.raids.join.byAjax.do ( key, idrinth.raids.join.servers.getServerLink ( key ) );
            },
            postLink: function ( key ) {
                'use strict';
                if ( !document.getElementById ( 'idrinth-raid-link-' + key ) ) {
                    var span = document.createElement ( 'span' );
                    span.id = 'idrinth-raid-link-' + key;
                    span.setAttribute ( 'data-clipboard-text', idrinth.raids.join.servers.getServerLink ( key ) );
                    span.appendChild ( document.createTextNode ( idrinth.raids.list[key].name + '\'s ' + idrinth.raids.list[key].raid ) );
                    document.getElementById ( 'idrinth-raid-link-list' ).appendChild ( span );
                }
            },
            facebook: function ( key ) {
                'use strict';
                idrinth.raids.join.byFrame.do ( key, idrinth.raids.join.servers.getServerLink ( key ) );
            },
            dawnofthedragons: function ( key ) {
                'use strict';
                idrinth.raids.join.byFrame.do ( key, idrinth.raids.join.servers.getServerLink ( key ) );
            }
        },
        byAjax: {
            'do': function ( key, link ) {
                'use strict';
                idrinth.runAjax (
                        link,
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
            }
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
            success: function ( key ) {
                'use strict';
                idrinth.raids.join.messages.log ( 'Joined ' + idrinth.raids.list[key].name + '\'s ' + idrinth.raids.list[key].raid );
                try {
                    idrinth.ui.removeElement ( 'idrinth-raid-link-' + key );
                } catch ( e ) {
                }
                try {
                    idrinth.raids.joined[key] = idrinth.raids.list[key];
                    delete idrinth.raids.list[key];
                } catch ( e1 ) {
                }
            },
            failed: function ( key ) {
                'use strict';
                idrinth.raids.join.messages.log ( 'Could not join ' + idrinth.raids.list[key].name + '\'s ' + idrinth.raids.list[key].raid );
            },
            trying: function ( key ) {
                'use strict';
                eval ( "window.setTimeout(function(){try{idrinth.ui.removeElement ('idrinth-raid-link-'+key);}catch(e){}},300)" );
                if ( idrinth.raids.list[key] ) {
                    idrinth.raids.join.messages.log ( 'Trying to join ' + idrinth.raids.list[key].name + '\'s ' + idrinth.raids.list[key].raid );
                }
                try {
                    idrinth.raids.joined[key] = idrinth.raids.list[key];
                    delete idrinth.raids.list[key];
                } catch ( e1 ) {
                }
            }
        },
        byFrame: {
            windows: [ null, null, null ],
            timeouts: [ ],
            'do': function ( key, link ) {
                'use strict';
                for (var count = 0; count < idrinth.settings.windows; count++) {
                    if ( idrinth.raids.join.byFrame.windows[count] === null || idrinth.raids.join.byFrame.windows[count] === undefined ) {
                        idrinth.raids.join.byFrame.windows[count] =
                                idrinth.ui.buildElement ( { type: 'iframe', id: 'join-' + key, attributes: [
                                        { name: 'src', value: link },
                                        { name: 'sandbox', value: 'allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts' },
                                        { name: 'style', value: 'position:absolute;top:' + count + 'px;left:0;width:1px;height:1px;z-index:-100;' },
                                        { name: 'onload', value: 'try{event.stopPropagation();}catch(e){}window.setTimeout(){function(){idrinth.raids.join.byFrame.remove(' + count + ',\'' + key + '\');},1234);' },
                                        { name: 'onunload', value: 'try{event.stopPropagation();}catch(e){}' }
                                    ] } );
                        idrinth.raids.join.byFrame.timeouts[count] = eval ( 'window.setTimeout(function(){idrinth.raids.join.byFrame.remove(' + count + ',\'' + key + '\');},30000);' );
                        idrinth.ui.body.appendChild ( idrinth.raids.join.byFrame.windows[count] );
                        idrinth.raids.join.messages.trying ( key );
                        return;
                    }
                }
                idrinth.raids.list[key].joined = false;
            },
            remove: function ( count, key ) {
                try {
                    window.clearTimeout ( idrinth.raids.join.byFrame.timeouts[count] );
                } catch ( e0 ) {
                }
                try {
                    idrinth.raids.join.byFrame.windows[count] = null;
                } catch ( e1 ) {
                }
                try {
                    idrinth.ui.removeElement ( 'join-' + key );
                } catch ( e2 ) {
                }
            }
        },
        'do': function ( ) {
            'use strict';
            var added = 0;
            for (var key in idrinth.raids.list) {
                if ( !idrinth.raids.list[key].joined ) {
                    added++;
                    idrinth.raids.join.servers.postLink ( key );
                    idrinth.raids.list[key].joined = true;
                    if ( typeof idrinth.raids.join.servers[idrinth.platform] === 'function' ) {
                        idrinth.raids.join.servers[idrinth.platform] ( key );
                    }
                }
                if ( added > 99 || ( idrinth.platform === 'facebook' && added >= idrinth.settings.windows ) ) {
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