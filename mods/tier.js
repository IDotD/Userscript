idrinth.tier = {
    list: { },
    start: function () {
        'use strict';
        idrinth.runAjax (
                'https://dotd.idrinth.de/' + idrinth.platform + '/tier-service/',
                function ( text ) {
                    idrinth.tier.import ( text );
                },
                function ( ) {
                    window.setTimeout ( function () {
                        idrinth.tier.start ();
                    }, 10000 );
                },
                function ( ) {
                    window.setTimeout ( function () {
                        idrinth.tier.start ();
                    }, 10000 );
                }
        );
    },
    import: function ( data ) {
        'use strict';
        data = JSON.parse ( data );
        if ( data ) {
            idrinth.tier.list = data;
        } else {
            window.setTimeout ( idrinth.tier.start, 1000 );
        }
    },
    getTierForName: function ( name ) {
        var result = [ ];
        var regExp = new RegExp ( name, 'i' );
        for (var key in idrinth.tier.list) {
            if ( key.match ( regExp ) ) {
                result.push ( key );
            }
        }
        idrinth.ui.makeTierList ( result );
    }
};