var idrinth = {
    /**
     * @type String
     */
    version: '###VERSION###',
    /**
     * @type Boolean
     */
    windowactive: true,
    /**
     *
     * @type String
     */
    platform: '',
    /**
     *
     * @returns {undefined}
     */
    reload: function ( ) {
        window.clearTimeout ( idrinth.core.timeouts.next );
        idrinth.ui.removeElement ( 'idotd-base' );
        for (var event in idrinth.core.multibind.events) {
            idrinth.ui.base.removeEventListener ( event, idrinth.core.multibind.triggered );
        }
        window.setTimeout ( function () {
            idrinth = { };
            document.getElementById ( 'idotd-loader' ).errorFunction ();
        }, 1 );
    },
    /**
     * initializes the whole script
     * @returns {undefined}
     */
    start: function ( ) {
        /**
         *
         * @returns {undefined}
         */
        var startInternal = function ( ) {
            /**
             * initializes all modules
             * @returns {undefined}
             */
            var init = function () {
                if ( !idrinth.text.initialized ) {
                    return;
                }
                if ( idrinth.platform === 'newgrounds' ) {
                    try {
                        var frame = document.getElementById ( 'iframe_embed' ).getElementsByTagName ( 'iframe' )[0];
                        idrinth.newgrounds.originalUrl = frame.getAttribute ( 'src' );
                        if ( window.location.search ) {
                            frame.setAttribute ( 'src', ( frame.getAttribute ( 'src' ) ).replace ( /&ir=.*/, '' ) + '&' + ( window.location.search ).replace ( /^\?/, '' ) );
                        }
                    } catch ( e ) {
                        idrinth.core.log ( e.message ? e.message : e.getMessage () );
                        return;
                    }
                    idrinth.core.timeouts.add ( 'newgrounds', idrinth.newgrounds.alarmCheck, 3333 );
                }
                idrinth.core.timeouts.remove ( 'start' );
                idrinth.ui.start ( );
                idrinth.user.start ( );
                idrinth.names.start ( );
                idrinth.raids.start ( );
                idrinth.tier.start ( );
                idrinth.chat.start ( );
                idrinth.war.start ( );
                idrinth.inframe.start ( );
                idrinth.core.timeouts.add ( 'core.multibind', function () {
                    idrinth.core.multibind.add ( 'click', '.clipboard-copy', function ( element, event ) {
                        idrinth.core.copyToClipboard.element ( element );
                        element.parentNode.parentNode.removeChild ( element.parentNode );
                    } );
                }, 1000 );
                delete idrinth['start'];
            };
            idrinth.settings.start ( );
            idrinth.text.start ( );
            idrinth.core.timeouts.add ( 'start', init, 123, -1 );
        };
        idrinth.core.log ( 'Starting Idrinth\'s DotD Script' );
        window.onblur = function () {
            idrinth.windowactive = !idrinth.windowactive;
        };
        idrinth.platform = location.hostname.split ( '.' )[location.hostname.split ( '.' ).length - 2];
        if ( idrinth.platform === 'dawnofthedragons' ) {
            idrinth.platform = 'facebook';
        }
        if ( idrinth.platform === 'armorgames' ) {
            return idrinth.core.timeouts.add ( 'start', startInternal, 2222 );
        }
        startInternal ();
    }
};
window.idrinth = idrinth;
window.setTimeout ( window.idrinth.start, 6666 );
