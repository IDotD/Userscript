idrinth.user = {
    token: '',
    id: 0,
    name: '',
    identifier: '',
    start: function ( ) {
        'use strict';
        if ( idrinth.realSite === 'kongregate' ) {
            idrinth.user.name = active_user._attributes.get ( 'username' );
            idrinth.user.token = active_user.gameAuthToken ( );
            idrinth.user.id = active_user.id ( );
        } else if ( idrinth.realSite === 'newgrounds' ) {
            idrinth.user.name = Cookies.get ( 'NG_GG_username' );
        } else if ( idrinth.realSite === 'armorgames' ) {
            var ag = document.getElementById ( 'gamefilearea' ).children[0].src.match ( /^.+user_id=([a-f\d]{32})&auth_token=([a-f\d]{32}).+$/ );
            idrinth.user.name = window.u_name;
            idrinth.user.id = ag[1];
            idrinth.user.token = ag[2];
        }
        window.setTimeout ( idrinth.user.sendAlive, 20000 );
    },
    sendAlive: function () {
        function guid () {
            //from http://stackoverflow.com/a/105074
            function s4 () {
                return Math.floor ( ( 1 + Math.random () ) * 0x10000 ).toString ( 36 );
            }
            return s4 () + '-' +
                    s4 () + s4 () + '-' +
                    s4 () + s4 () + s4 () + '-' +
                    s4 () + s4 () + s4 () + s4 () + '-' +
                    s4 () + s4 () + s4 () + s4 () + s4 () + '-' +
                    s4 () + s4 () + s4 () + s4 () + s4 () + s4 ();
        }
        if ( window.localStorage ) {
            idrinth.user.identifier = window.localStorage.getItem ( 'idrinth-dotd-uuid' );
            if ( !idrinth.user.identifier || idrinth.user.identifier === '' || idrinth.user.identifier === null || !idrinth.user.identifier.match ( /^[a-z0-9]{4}-[a-z0-9]{8}-[a-z0-9]{12}-[a-z0-9]{16}-[a-z0-9]{20}-[a-z0-9]{24}$/ ) ) {
                idrinth.user.identifier = guid ();
            }
            window.localStorage.setItem ( 'idrinth-dotd-uuid', idrinth.user.identifier );
            idrinth.runAjax ( 'https://dotd.idrinth.de/' +
                    ( idrinth.settings.isWorldServer ? 'world-' : '' ) + idrinth.platform +
                    '/i-am-alive/' + idrinth.user.identifier + '/' );
        }
    }
};