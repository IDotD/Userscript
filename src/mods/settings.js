idrinth.settings = {
    data: {
        raids: false,
        favs: '',
        factor: true,
        moveLeft: false,
        minimalist: false,
        chatHiddenOnStart: true,
        names: true,
        timeout: 5000,
        loadtime: 5000,
        windows: 3,
        warBottom: false,
        landMax: true,
        chatting: true,
        chatuser: '',
        newgroundLoad: 30,
        chatpass: '',
        isWorldServer: false,
        alarmTime: '8:0',
        alarmActive: false,
        bannedRaids: { },
        language: 'en',
        notification: {
            mention: true,
            message: true,
            raid: true
        },
        land: {
            cornfield: 0,
            stable: 0,
            barn: 0,
            store: 0,
            pub: 0,
            inn: 0,
            tower: 0,
            fort: 0,
            castle: 0,
            gold: 0
        }
    },
    /**
     *
     * @param {string} field
     * @param {Boolean} allowObject
     * @returns {int|string|object}
     */
    get: function ( field, allowObject ) {
        'use strict';
        /**
         *
         * @param {object} parent
         * @param {string} field
         * @param {Boolean} allowObject
         * @returns {int|string|object}
         */
        var getValue = function ( parent, field, allowObject ) {
            if ( idrinth.core.fieldIsSetting ( parent, field, allowObject ) ) {
                return parent[field];
            }
            return null;
        };
        /**
         *
         * @param {string} key
         * @returns {undefined}
         */
        var remove = function ( key ) {
            try {
                window.localStorage.removeItem ( key );
            } catch ( e ) {
                //not really relevant
            }
        };
        if ( !field ) {
            return;
        }
        var value = getValue ( idrinth.settings.data, field, allowObject );
        if ( value !== null && ( typeof value !== 'object' || allowObject ) ) {
            remove ( 'idrinth-dotd-' + field );
            return value;
        }
        field = field.split ( '#' );
        remove ( 'idrinth-dotd-' + field[0] + '-' + field[1] );
        return getValue ( idrinth.settings.data[field[0]], field[1], allowObject );
    },
    change: function ( field, value ) {
        'use strict';
        var setValue = function ( parent, field, value ) {
            if ( idrinth.core.fieldIsSetting ( parent, field ) ) {
                parent[field] = value;
                return true;
            }
            return false;
        };
        var store = function ( ) {
            window.localStorage.setItem ( 'idotd', JSON.stringify ( idrinth.settings.data ) );
        };
        if ( !field ) {
            return;
        }
        if ( setValue ( idrinth.settings.data, field, value ) ) {
            store ();
            return;
        }
        field = field.split ( '#' );
        if ( !idrinth.settings.data[field[0]] || !field[1] ) {
            return;
        }
        if ( setValue ( idrinth.settings.data[field[0]], field[1], value ) ) {
            store ();
            return;
        }
    },
    start: function ( ) {
        'use strict';
        var getCurrent = function () {
            var data = JSON.parse ( window.localStorage.getItem ( 'idotd' ) );
            var apply = function ( to, from, apply ) {
                for (var key in from) {
                    if ( from.hasOwnProperty ( key ) ) {
                        if ( typeof from[key] === 'object' ) {
                            to[key] = typeof to[key] === 'object' ? to[key] : { };
                            apply ( to[key], from[key] );
                        } else {
                            to[key] = from[key];
                        }
                    }
                }
            };
            apply ( idrinth.settings.data, data, apply );
        };
        var getOld = function () {
            var objectIterator = function ( object, prefix, objectIterator ) {
                var itemHandler = function ( prefix, key, item ) {
                    if ( typeof item !== 'function' ) {
                        var tmp = window.localStorage.getItem ( 'idrinth-dotd-' + prefix + key );
                        if ( tmp ) {
                            if ( tmp === 'false' ) {
                                tmp = false;
                            } else if ( tmp === 'true' ) {
                                tmp = true;
                            }
                            item = tmp;
                        }
                    }
                    return item;
                };
                for (var key in object) {
                    if ( object.hasOwnProperty ( key ) ) {
                        if ( typeof object[key] !== 'object' ) {
                            object[key] = itemHandler ( prefix, key, object[key] );
                        } else {
                            object[key] = objectIterator ( object[key], prefix + key + '-', itemHandler, objectIterator );
                        }
                    }
                }
                return object;
            };
            objectIterator ( idrinth.settings.data, '', objectIterator );
        };
        if ( window.localStorage ) {
            if ( window.localStorage.getItem ( 'idotd' ) ) {
                getCurrent ();
            } else {
                getOld ();
            }
        }
    }
};