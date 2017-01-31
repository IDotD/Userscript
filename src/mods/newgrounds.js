( function ( idrinth ) {
    'use strict';
    idrinth.newgrounds = {
        /**
         *
         * @type String
         */
        originalUrl: '',
        /**
         *
         * @type Array
         */
        raids: [ ],
        /**
         *
         * @returns {undefined}
         */
        joinRaids: function () {
            for (var key in idrinth.raids.list) {
                if ( idrinth.raids.list[key].hash && idrinth.raids.list[key].raidId ) {
                    idrinth.newgrounds.raids.push ( key );
                }
            }
            idrinth.newgrounds.join ();
        },
        /**
         *
         * @returns {undefined}
         */
        alarmCheck: function () {
            var now = new Date ();
            if ( idrinth.settings.get ( "alarmActive" ) && now.getHours () + ':' + now.getMinutes () === idrinth.settings.get ( "alarmTime" ) ) {
                idrinth.core.timeouts.add ( 'newgrounds', idrinth.newgrounds.joinRaids, 1 );
            }
            idrinth.core.timeouts.add ( 'newgrounds', idrinth.newgrounds.alarmCheck, 60000 );
        },
        /**
         *
         * @returns {undefined}
         */
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
        /**
         *
         * @param {string} key
         * @returns {undefined}
         */
        remove: function ( key ) {
            idrinth.core.timeouts.add (
                    'newgrounds.remove',
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
                    idrinth.settings.get ( "newgroundLoad" ) * 1000
                    );
        }
    };
} ( window.idrinth ) );
