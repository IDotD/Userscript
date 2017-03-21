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
                    data: !data ? true : data
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
        var reload = function ( data ) {
            var objects = document.getElementsByTagName ( 'object' );
            var modify = function ( element, data ) {
                var src = element.getAttribute ( 'data' );
                if ( !src ) {
                    return false;
                }
                src = src.replace ( /\.swf(\?.*?)?$/, '.swf' );
                if ( src.match ( new RegExp ( data + '\\.swf$' ) ) ) {
                    objects[count].setAttribute ( 'data', src + '?q=' + Math.random () );
                    return true;
                }
                return false;
            };
            for (var count = 0; count < objects.length; count++) {
                if ( modify ( objects[count], data ) ) {
                    return;
                }
            }
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
                handleFrame ( document.getElementById ( 'game' ) );
            } else if ( idrinth.platform === 'newgrounds' ) {
                handleFrame ( document.getElementById ( 'iframe_embed' ) );
            } else if ( idrinth.platform === 'armorgames' ) {
                handleFrame ( document.getElementById ( 'gamefilearea' ) );
            }
            idrinth.inframe.send ( 'add', 'window.idrinth.reload=' + reload.toString () + ';' );
        } catch ( e ) {
            idrinth.core.log ( 'failed to find frame' );
        }
    }
};