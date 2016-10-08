idrinth.lang = {
    /**
     * if the language files have been applied correctly, this is true
     * @type Boolean
     */
    initialized: false,
    /**
     * Loads language specific code and signals it's readyness by setting
     * idrinth.lang.initialized to true
     * @method start
     * @returns {undefined}
     */
    start: function () {
        var language = idrinth.settings.language || window.navigator.userLanguage || window.navigator.language;
        if ( language === 'en' ) {
            idrinth.lang.initialized = true;
            return;
        }
        idrinth.core.ajax.runHome ( '', function ( file ) {
            /**
             *
             * @param {object} to
             * @param {object} from
             * @param {function} func
             * @returns {undefined}
             */
            var applyRecursive = function ( to, from, func ) {
                for (var prop in from) {
                    if ( from.hasOwnProperty ( prop ) ) {
                        if ( typeof to[prop] === 'string' && typeof from[prop] === 'string' ) {
                            to[prop] = file[prop];
                        } else if ( typeof to[prop] === 'object' && typeof from[prop] === 'object' ) {
                            func ( to[prop], from[prop], func );
                        }
                    }
                }
            };
            applyRecursive ( idrinth.text.data, JSON.parse ( file ), applyRecursive );
        }, idrinth.lang.start, idrinth.lang.start, null, true );
    }
};