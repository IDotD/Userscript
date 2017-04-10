idrinth.land = {
    /**
     *
     * @returns {undefined}
     */
    calculate: function () {
        /**
         *
         * @param {function[]} checkElementFunc
         * @returns {object}
         */
        var baseCalculator = function ( checkElementFunc ) {
            var factor = idrinth.settings.get ( "factor" ) ? 10 : 1;
            /**
             *
             * @param {string} building
             * @returns {Number}
             */
            var nextPrice = function ( building ) {
                return ( 10 + idrinth.settings.get ( "land#" + building ) ) * idrinth.land.data[building].base;
            };
            var results = { };
            /**
             *
             * @param {type} results
             * @param {type} res
             * @param {type} factor
             * @param {type} nextPrice
             * @returns {Number|@var;factor}
             */
            var applyResult = function ( results, res, factor, nextPrice ) {
                idrinth.settings.change ( "land#gold", idrinth.settings.get ( "land#gold" ) - nextPrice ( res.key ) * factor / 10 );
                results[res.key] = ( results[res.key] === undefined ? 0 : results[res.key] ) + factor;
                idrinth.settings.change ( "land#" + res.key, idrinth.settings.get ( "land#" + res.key ) + factor );
                return results;
            };
            /**
             *
             * @param {function[]} checkElementFunc
             * @param {Number} factor
             * @param {function} nextPrice
             * @returns {object}
             */
            var processBuildings = function ( checkElementFunc, factor, nextPrice ) {
                /**
                 *
                 * @param {function[]} checkElementFunc
                 * @param {String} building
                 * @param {Number} factor
                 * @param {object} res
                 * @param {function} nextPrice
                 * @returns {object}
                 */
                var check = function ( checkElementFunc, building, factor, res, nextPrice ) {
                    for (var count = 0; count < checkElementFunc.length; count++) {
                        if ( !checkElementFunc[count] ( building, factor, res, nextPrice ) ) {
                            return res;
                        }
                    }
                    return {
                        min: nextPrice ( building ) / idrinth.land.data[building].perHour,
                        key: building
                    };
                };
                var res = {
                    key: null,
                    min: null
                };
                for (var building in idrinth.land.data) {
                    if ( building && idrinth.land.data[building] && idrinth.land.data.hasOwnProperty ( building ) ) {
                        res = check ( checkElementFunc, building, factor, res, nextPrice );
                    }
                }
                return res;
            };
            while ( idrinth.settings.get ( "land#gold" ) >= 0 ) {
                var res = processBuildings ( checkElementFunc, factor, nextPrice );
                if ( res.key === null ) {
                    return results;
                }
                results = applyResult ( results, res, factor, nextPrice );
            }
            return results;
        };
        /**
         *
         * @returns {function[]}
         */
        var getRequirements = function () {
            /**
             *
             * @param {String} building
             * @param {Number} factor
             * @param {Object} res
             * @param {function} nextPrice
             * @returns {Boolean}
             */
            var bestPrice = function ( building, factor, res, nextPrice ) {
                return res.min === null || nextPrice ( building ) / idrinth.land.data[building].perHour < res.min;
            };
            /**
             *
             * @param {String} building
             * @param {Number} factor
             * @param {Object} res
             * @param {function} nextPrice
             * @returns {Boolean}
             */
            var useUp = function ( building, factor, res, nextPrice ) {
                return nextPrice ( building ) * factor / 10 <= idrinth.settings.get ( "land#gold" );
            };
            var funcs = [ useUp ];
            if ( idrinth.settings.get ( "landMax" ) ) {
                funcs.push ( bestPrice );
            }
            return funcs;
        };
        /**
         * Adds the results to the gui
         * @param {object} results
         * @returns {undefined}
         */
        var putResults = function ( results ) {
            for (var key in results) {
                if ( results.hasOwnProperty ( key ) ) {
                    document.getElementById ( 'idrinth-land-' + key ).value = idrinth.settings.get ( "land#" + key );
                    document.getElementById ( 'idrinth-land-' + key ).parentNode.nextSibling.innerHTML = '+' + results[key];
                }
            }
            document.getElementById ( 'idrinth-land-gold' ).value = idrinth.settings.get ( "land#gold" );
        };
        var landSettings = idrinth.settings.get( "land", true );
        for (var key in landSettings ) {
            if ( landSettings.hasOwnProperty( key ) ) {
                idrinth.settings.change( 'land#' + key, parseInt( document.getElementById( 'idrinth-land-' + key ).value, 10 ) );
            }
        }
        var results = baseCalculator ( getRequirements () );
        if ( Object.keys ( results ).length === 0 ) {
            idrinth.core.alert ( idrinth.text.get ( "land.lack" ) );
        }
        putResults ( results );
    },
    /**
     * @type object
     */
    data: {
        /**
         * @type object
         */
        cornfield: {
            /**
             * @type Number
             */
            perHour: 100,
            /**
             * @type Number
             */
            base: 4000
        },
        /**
         * @type object
         */
        stable: {
            /**
             * @type Number
             */
            perHour: 300,
            /**
             * @type Number
             */
            base: 15000
        },
        /**
         * @type object
         */
        barn: {
            /**
             * @type Number
             */
            perHour: 400,
            /**
             * @type Number
             */
            base: 25000
        },
        /**
         * @type object
         */
        store: {
            /**
             * @type Number
             */
            perHour: 700,
            /**
             * @type Number
             */
            base: 50000
        },
        /**
         * @type object
         */
        pub: {
            /**
             * @type Number
             */
            perHour: 900,
            /**
             * @type Number
             */
            base: 75000
        },
        /**
         * @type object
         */
        inn: {
            /**
             * @type Number
             */
            perHour: 1200,
            /**
             * @type Number
             */
            base: 110000
        },
        /**
         * @type object
         */
        tower: {
            /**
             * @type Number
             */
            perHour: 2700,
            /**
             * @type Number
             */
            base: 300000
        },
        /**
         * @type object
         */
        fort: {
            /**
             * @type Number
             */
            perHour: 4500,
            /**
             * @type Number
             */
            base: 600000
        },
        /**
         * @type object
         */
        castle: {
            /**
             * @type Number
             */
            perHour: 8000,
            /**
             * @type Number
             */
            base: 1200000
        }
    }
};