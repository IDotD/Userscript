( function ( idrinth ) {
    'use strict';
    idrinth.settings = {
        /**
         *
         * @type {object}
         */
        data: {
            /**
             *
             * @type Boolean
             */
            raids: false,
            /**
             *
             * @type String
             */
            favs: '',
            /**
             *
             * @type Boolean
             */
            factor: true,
            /**
             *
             * @type Boolean
             */
            moveLeft: false,
            /**
             *
             * @type Boolean
             */
            minimalist: false,
            /**
             *
             * @type Boolean
             */
            chatHiddenOnStart: true,
            /**
             *
             * @type Boolean
             */
            names: true,
            /**
             *
             * @type Number
             */
            timeout: 5000,
            /**
             *
             * @type Number
             */
            loadtime: 5000,
            /**
             *
             * @type Number
             */
            windows: 3,
            /**
             *
             * @type Boolean
             */
            warBottom: false,
            /**
             *
             * @type Boolean
             */
            landMax: true,
            /**
             *
             * @type Boolean
             */
            chatting: true,
            /**
             *
             * @type String
             */
            chatuser: '',
            /**
             *
             * @type Number
             */
            newgroundLoad: 30,
            /**
             *
             * @type String
             */
            chatpass: '',
            /**
             *
             * @type Boolean
             */
            isWorldServer: false,
            /**
             *
             * @type String
             */
            alarmTime: '8:0',
            /**
             *
             * @type Boolean
             */
            alarmActive: false,
            /**
             *
             * @type Object
             */
            bannedRaids: { },
            /**
             *
             * @type String
             */
            lang: null,
            /**
             *
             * @type {Object}
             */
            notification: {
                /**
                 *
                 * @type Boolean
                 */
                mention: true,
                /**
                 *
                 * @type Boolean
                 */
                message: true,
                /**
                 *
                 * @type Boolean
                 */
                raid: true
            },
            /**
             *
             * @type Object
             */
            land: {
                /**
                 *
                 * @type Number
                 */
                cornfield: 0,
                /**
                 *
                 * @type Number
                 */
                stable: 0,
                /**
                 *
                 * @type Number
                 */
                barn: 0,
                /**
                 *
                 * @type Number
                 */
                store: 0,
                /**
                 *
                 * @type Number
                 */
                pub: 0,
                /**
                 *
                 * @type Number
                 */
                inn: 0,
                /**
                 *
                 * @type Number
                 */
                tower: 0,
                /**
                 *
                 * @type Number
                 */
                fort: 0,
                /**
                 *
                 * @type Number
                 */
                castle: 0,
                /**
                 *
                 * @type Number
                 */
                gold: 0
            },
            /**
             *
             * @type {object}
             */
            stats: {
                /**
                 *
                 * @type Number
                 */
                stats: 0,
                /**
                 *
                 * @type Number
                 */
                level: 1,
                /**
                 *
                 * @type Number
                 */
                perception: 0,
                /**
                 *
                 * @type Number
                 */
                attack: 0,
                /**
                 *
                 * @type Number
                 */
                defense: 0,
                /**
                 *
                 * @type Number
                 */
                critchance: 5,
                /**
                 *
                 * @type Number
                 */
                mount: 0,
                /**
                 *
                 * @type Boolean
                 */
                kraken: false,
                /**
                 *
                 * @type Boolean
                 */
                mirele: false,
                /**
                 *
                 * @type Boolean
                 */
                utym: false
            }
        },
        /**
         *
         * @param {string} field
         * @param {Boolean} allowObject
         * @returns {int|string|object}
         */
        get: function ( field, allowObject ) {
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
        /**
         *
         * @param {String} field
         * @param {String|Booleab|Number} value
         * @returns {undefined}
         */
        change: function ( field, value ) {
            /**
             *
             * @param {obect} parent
             * @param {string} field
             * @param {String|Booleab|Number} value
             * @returns {Boolean}
             */
            var setValue = function ( parent, field, value ) {
                if ( idrinth.core.fieldIsSetting ( parent, field ) ) {
                    parent[field] = value;
                    return true;
                }
                return false;
            };
            /**
             * saves the data to local storage
             * @returns {undefined}
             */
            var store = function () {
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
        /**
         * initializes the module
         * @returns {undefined}
         */
        start: function () {
            /**
             * fills the data from json in idotd
             * @returns {undefined}
             */
            var getCurrent = function () {
                var data = JSON.parse ( window.localStorage.getItem ( 'idotd' ) );
                /**
                 *
                 * @param {object} to
                 * @param {object} from
                 * @param {function} apply
                 * @returns {undefined}
                 */
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
            /**
             * fills the data from seperate storages
             * @returns {undefined}
             */
            var getOld = function () {
                /**
                 *
                 * @param {object} object
                 * @param {String} prefix
                 * @param {function} objectIterator
                 * @returns {Boolean}
                 */
                var objectIterator = function ( object, prefix, objectIterator ) {
                    /**
                     *
                     * @param {String} prefix
                     * @param {String} key
                     * @param {Number|String|Boolean} item
                     * @returns {Boolean}
                     * @todo remove this once old data is unlikely to exist
                     */
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
} ( idrinth ) );