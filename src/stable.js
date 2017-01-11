var idrinth = {
    version: '###VERSION###',
    windowactive: true,
    facebook: {
        popup: null,
        restart: function () {
            try {
                idrinth.core.timeouts.remove ( 'facebook' );
                idrinth.facebook.popup.close ();
                idrinth.ui.reloadGame ();
                idrinth.raids.clearAll ();
            } catch ( e ) {
                idrinth.core.log ( e );
            }
        },
        rejoin: function () {
            idrinth.core.timeouts.remove ( 'raids' );
            idrinth.facebook.popup = window.open ( "https://apps.facebook.com/dawnofthedragons/" );
            idrinth.facebook.popup.onload = function () {
                idrinth.core.timeouts.add ( 'facebook', idrinth.facebook.restart, 3333 );
            };
            idrinth.core.timeouts.add ( 'facebook', idrinth.facebook.restart, 11111 );
        }
    },
    newgrounds: {
        originalUrl: '',
        raids: [ ],
        joinRaids: function () {
            for (var key in idrinth.raids.list) {
                if ( idrinth.raids.list[key].hash && idrinth.raids.list[key].raidId ) {
                    idrinth.newgrounds.raids.push ( key );
                }
            }
            idrinth.newgrounds.join ();
        },
        alarmCheck: function () {
            var now = new Date ();
            if ( idrinth.settings.get ( "alarmActive" ) && now.getHours () + ':' + now.getMinutes () === idrinth.settings.get ( "alarmTime" ) ) {
                idrinth.core.timeouts.add ( 'newgrounds', idrinth.newgrounds.joinRaids, 1 );
            }
            idrinth.core.timeouts.add ( 'newgrounds', idrinth.newgrounds.alarmCheck, 60000 );
        },
        join: function () {
            if ( idrinth.newgrounds.raids.length === 0 ) {
                idrinth.core.alert ( 'We\'re done! Have fun playing.' );
                return;
            }
            var frame = document.getElementById ( 'iframe_embed' ).getElementsByTagName ( 'iframe' )[0];
            var key = idrinth.newgrounds.raids.pop ();
            var link = idrinth.newgrounds.originalUrl + '&' + ( idrinth.raids.join.getServerLink ( key ) ).replace ( /^.*?\?/, '' );
            frame.setAttribute ( 'onload', 'idrinth.newgrounds.remove(\'' + key + '\')' );
            frame.setAttribute ( 'src', link );
        },
        remove: function ( key ) {
            idrinth.core.timeouts.add ( 'newgrounds.remove',
                    function () {
                        try {
                            idrinth.raids.list[key].joined = true;
                        } catch ( e ) {
                            try {
                                idrinth.raids.joined[key].joined = true;
                            } catch ( f ) {
                                idrinth.core.log ( "We seem to have joined a dead raid" );
                            }
                        }
                        if ( document.getElementById ( 'idrinth-raid-link-' + key ) ) {
                            idrinth.ui.removeElement ( 'idrinth-raid-link-' + key );
                        }
                        try {
                            idrinth.raids.joined[key] = idrinth.raids.list[key];
                        } catch ( e2 ) {
                            //lost?
                        }
                        try {
                            delete idrinth.raids.list[key];
                        } catch ( e3 ) {
                            //already gone, nothing to do
                        }
                        idrinth.raids.join.messages.trying ( key );
                        idrinth.newgrounds.join ();
                    },
                    idrinth.settings.get ( "newgroundLoad" ) * 1000 );
        }
    },
    reload: function ( ) {
        window.clearTimeout ( idrinth.core.timeouts.next );
        idrinth.ui.removeElement ( 'idrinth-controls' );
        idrinth.ui.removeElement ( 'idrinth-chat' );
        idrinth.ui.removeElement ( 'idrinth-war' );
        var sc = document.createElement ( 'script' );
        sc.setAttribute ( 'src', 'https://dotd.idrinth.de/static/userscript/###RELOAD-VERSION###/' + Math.random () + '/' );
        document.getElementsByTagName ( 'body' )[0].appendChild ( sc );
        window.setTimeout ( function () {
            idrinth = { };
        }, 1 );
    },
    platform: '',
    startInternal: function ( ) {
        if ( idrinth.platform === 'newgrounds' ) {
            try {
                var frame = document.getElementById ( 'iframe_embed' ).getElementsByTagName ( 'iframe' )[0];
                idrinth.newgrounds.originalUrl = frame.getAttribute ( 'src' );
                if ( window.location.search ) {
                    frame.setAttribute ( 'src', ( frame.getAttribute ( 'src' ) ).replace ( /&ir=.*/, '' ) + '&' + ( window.location.search ).replace ( /^\?/, '' ) );
                }
            } catch ( e ) {
                return idrinth.core.timeouts.add ( 'start', idrinth.startInternal, 500 );
                return;
            }
            return idrinth.core.timeouts.add ( 'newgrounds', idrinth.newgrounds.alarmCheck, 3333 );
        }
        idrinth.settings.start ( );
        idrinth.text.start ( );
        idrinth.core.timeouts.add ( 'start', function () {
            if ( !idrinth.text.initialized ) {
                return;
            }
            idrinth.core.timeouts.remove ( 'start' );
            idrinth.ui.start ( );
            idrinth.user.start ( );
            idrinth.names.start ( );
            idrinth.raids.start ( );
            idrinth.tier.start ( );
            idrinth.chat.start ( );
            idrinth.war.start ( );
            idrinth.core.timeouts.add ( 'core.multibind', function () {
                idrinth.core.multibind.add ( 'click', '.clipboard-copy', function ( element, event ) {
                    idrinth.core.copyToClipboard.element ( element );
                    element.parentNode.parentNode.removeChild ( element.parentNode );
                    idrinth.core.log ( event + ' fired on ' + element );
                } );
            }, 1000 );
            delete idrinth['start'];
            delete idrinth['startInternal'];
        }, 123, true );
        idrinth.core.timeouts.process ();
    },
    start: function ( ) {
        'use strict';
        window.onblur = function () {
            idrinth.windowactive = false;
        };
        window.onblur = function () {
            idrinth.windowactive = true;
        };
        idrinth.core.log ( 'Starting Idrinth\'s DotD Script' );
        idrinth.platform = location.hostname.split ( '.' )[location.hostname.split ( '.' ).length - 2];
        if ( idrinth.platform === 'dawnofthedragons' ) {
            idrinth.platform = 'facebook';
        }
        if ( idrinth.platform === 'armorgames' ) {
            return idrinth.core.timeouts.add ( 'start', idrinth.startInternal, 2222 );
        }
        idrinth.startInternal ();
    }
};
window.setTimeout ( idrinth.start, 6666 );
