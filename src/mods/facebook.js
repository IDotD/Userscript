( function () {
    'use strict';
    window.idrinth.facebook = {
        /**
         *
         * @type window
         */
        popup: null,
        /**
         * restarts the script's fnctions
         * @returns {undefined}
         */
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
        /**
         * logs in again and then restarts the script's functions(via restart)
         * @returns {undefined}
         */
        rejoin: function () {
            idrinth.core.timeouts.remove ( 'raids' );
            idrinth.facebook.popup = window.open ( "https://apps.facebook.com/dawnofthedragons/" );
            idrinth.facebook.popup.onload = function () {
                idrinth.core.timeouts.add ( 'facebook', idrinth.facebook.restart, 3333 );
            };
            // in case onload fails
            idrinth.core.timeouts.add ( 'facebook', idrinth.facebook.restart, 11111 );
        }
    };
} () );