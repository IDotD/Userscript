idrinth.user = {
    token: '',
    id: 0,
    name: '',
    identifier: '',
    start: function ( ) {
        'use strict';
        var getCookie = function ( name ) {
            var ca = document.cookie.split ( ';' );
            for (var i = 0; i < ca.length; i++) {
                ca[i] = ca[i].replace ( /^\s*|\s*$/, '' );
                if ( ca[i].indexOf ( name + '=' ) === 0 ) {
                    return ca[i].substring ( name.length + 1, ca[i].length );
                }
            }
            return "";
        };
        if ( idrinth.platform === 'kongregate' ) {
            idrinth.user.name = active_user._attributes.get ( 'username' );
            idrinth.user.token = active_user.gameAuthToken ( );
            idrinth.user.id = active_user.id ( );
        } else if ( idrinth.platform === 'newgrounds' ) {
            idrinth.user.name = getCookie ( 'NG_GG_username' );
        } else if ( idrinth.platform === 'armorgames' ) {
            var ag = document.getElementById ( 'gamefilearea' ).children[0].src.match ( /^.+user_id=([a-f\d]{32})&auth_token=([a-f\d]{32}).+$/ );
            idrinth.user.name = window.u_name;
            idrinth.user.id = ag[1];
            idrinth.user.token = ag[2];
        }
        window.setTimeout ( idrinth.user.sendAlive, 20000 );
    },
    sendAlive: function () {
        var getIdentifier = function () {
            var guid = function () {
                //from http://stackoverflow.com/a/105074
                var s4 = function () {
                    return Math.floor ( ( 1 + Math.random () ) * 0x10000 ).toString ( 36 );
                };
                return s4 () + '-' +
                        s4 () + s4 () + '-' +
                        s4 () + s4 () + s4 () + '-' +
                        s4 () + s4 () + s4 () + s4 () + '-' +
                        s4 () + s4 () + s4 () + s4 () + s4 () + '-' +
                        s4 () + s4 () + s4 () + s4 () + s4 () + s4 ();
            };
            idrinth.user.identifier = window.localStorage.getItem ( 'idrinth-dotd-uuid' );
            if ( !idrinth.user.identifier || idrinth.user.identifier === '' || idrinth.user.identifier === null || !idrinth.user.identifier.match ( /^[a-z0-9]{4}-[a-z0-9]{8}-[a-z0-9]{12}-[a-z0-9]{16}-[a-z0-9]{20}-[a-z0-9]{24}$/ ) ) {
                idrinth.user.identifier = guid ();
            }
            window.localStorage.setItem ( 'idrinth-dotd-uuid', idrinth.user.identifier );
            return idrinth.user.identifier;
        };
        if ( !window.localStorage ) {
            return;
        }
        idrinth.runAjax ( 'https://dotd.idrinth.de/' +
                ( idrinth.settings.isWorldServer ? 'world-' : '' ) + idrinth.platform +
                '/i-am-alive/' + getIdentifier () + '/' );
    }
};
