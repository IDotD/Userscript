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
        idrinth.inframe.game.postMessage (
                JSON.stringify ( {
                    to: 'idotd',
                    task: task,
                    data: !data?true:data
                } ),
                '*'
                );
    },
    /**
     * 
     * @returns {undefined}
     */
    start: function () {
        /**
         * @returns {undefined}
         */
        var game = function (data) {
            var attachRand = function ( element ) {
                var src = element.getAttribute ( 'data' );
                src = src.replace ( /\.swf(\?.*?)?$/, '.swf' );
                element.setAttribute ( 'data', src + '?q=' + Math.random () );
            };
            attachRand ( getElementsByTagName ( 'object' )[0] );
        };
        /**
         * @returns {undefined}
         */
        var chat = function (data) {
            var attachRand = function ( element ) {
                var src = element.getAttribute ( 'data' );
                src = src.replace ( /\.swf(\?.*?)?$/, '.swf' );
                element.setAttribute ( 'data', src + '?q=' + Math.random () );
            };
            attachRand ( document.getElementsByTagName ( 'object' )[1] );
        };
        /**
         * @param {HTMLElement} parent
         */
        var handleFrame = function ( parent ) {
            idrinth.inframe.game = parent.getElementsByTagName ( 'iframe' )[0].contentWindow;
        };
        try {
            if ( idrinth.platform === 'facebook'/*'dawnofthedragons'*/ ) {
                handleFrame ( document );
            } else if ( idrinth.platform === 'kongregate' ) {
                handleFrame ( document.getElementById('game') );
            } else if ( idrinth.platform === 'newgrounds' ) {
                handleFrame ( document.getElementById ( 'iframe_embed' ) );
            } else if ( idrinth.platform === 'armorgames' ) {
                handleFrame ( document.getElementById ( 'gamefilearea' ) );
            }
            idrinth.inframe.send ( 'add', 'window.idrinth.game=' + game.toString () + ';' );
            idrinth.inframe.send ( 'add', 'window.idrinth.chat=' + chat.toString () + ';' );
        } catch ( e ) {
            idrinth.core.log ( 'failed to find frame' );
        }
    }
};