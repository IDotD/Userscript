idrinth.inframe = {
    /**
     * the game's iframe
     * @type HTMLElement
     */
    game: null,
    /**
     * 
     * @param {string} task
     * @param {string} data
     * @returns {undefined}
     */
    send: function ( task, data ) {
        idrinth.inframe.game.sendMessage (
                JSON.stringify ( {
                    to: 'idotd',
                    task: task,
                    data: data
                } )
                );
    },
    /**
     * 
     * @returns {undefined}
     */
    start: function () {
        /**
         * remote initialisation
         * @returns {undefined}
         */
        var init = function () {
            window.addEventListener (
                    "message",
                    function ( event ) {
                        var attachRand = function ( element ) {
                            var src = element.getAttribute ( 'data' );
                            src = src.replace ( /\.swf(\?.*?)?$/, '.swf' );
                            element.setAttribute ( 'data', src + '?q=' + Math.random () );
                        };
                        try {
                            var data = JSON.parse ( event.data );
                            if ( data.to !== 'idotd' ) {
                                return;
                            }
                            switch ( data.task ) {
                                case 'game':
                                    attachRand ( getElementsByTagName ( 'object' )[0] );
                                    break;
                                case 'chat':
                                    attachRand ( getElementsByTagName ( 'object' )[1] );
                                    break;
                            }
                        } catch ( e ) {
                            //nothing
                        }
                    },
                    false
                    );
        };
        /**
         * @param {HTMLElement} parent
         */
        var handleFrame = function ( parent ) {
            idrinth.inframe.game = parent.getElementsByTagName ( 'iframe' )[0];
        };
        try {
            if ( idrinth.platform === 'kongregate' || idrinth.platform === 'facebook'/*'dawnofthedragons'*/ ) {
                handleFrame ( document );
            } else if ( idrinth.platform === 'newgrounds' ) {
                handleFrame ( document.getElementById ( 'iframe_embed' ) );
            } else if ( idrinth.platform === 'armorgames' ) {
                handleFrame ( document.getElementById ( 'gamefilearea' ) );
            }
            idrinth.inframe.send ( 'init', '(' + init.toString () + ')();' );
        } catch ( e ) {
            idrinth.core.log ( 'failed to find frame' );
        }
    }
};