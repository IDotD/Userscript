idrinth.land = {
    calculate: function () {
        var baseCalculator = function ( checkElementFunc ) {
            var factor = idrinth.settings.factor ? 10 : 1;
            var nextPrice = function ( building ) {
                return ( 10 + idrinth.settings.land[building] ) * idrinth.land.data[building].base;
            };
            var results = { };
            var applyResult = function ( res, factor, nextPrice ) {
                idrinth.settings.land.gold = idrinth.settings.land.gold - nextPrice () * factor / 10;
                results[res.key] = ( results[res.key] === undefined ? 0 : results[res.key] ) + factor;
                idrinth.settings.land[res.key] = idrinth.settings.land[res.key] + factor;
            };
            var processBuildings = function ( checkElementFunc, factor, nextPrice ) {
                var check = function ( checkElementFunc, building, factor, res, nextPrice ) {
                    for (var count = 0; count < checkElementFunc.length; count++) {
                        if ( !checkElementFunc[count] ( building, factor, res, nextPrice ) ) {
                            return res;
                        }
                    }
                    return  {
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
            while ( idrinth.settings.land.gold >= 0 ) {
                var res = processBuildings ( checkElementFunc, factor, nextPrice );
                if ( res.key === null ) {
                    return results;
                }
                applyResult ( res, factor, nextPrice );
            }
            idrinth.settings.save ();
            return results;
        };
        var getRequirements = function () {
            var bestPrice = function ( building, factor, res, nextPrice ) {
                return res.min === null || nextPrice ( building ) / idrinth.land.data[building].perHour < res.min;
            };
            var useUp = function ( building, factor, res, nextPrice ) {
                return nextPrice ( building ) * factor / 10 <= idrinth.settings.land.gold;
            };
            var funcs = [ useUp ];
            if ( idrinth.settings.landMax ) {
                funcs.push ( bestPrice );
            }
            return funcs;
        };
        var putResults = function ( results ) {
            for (var key in results) {
                document.getElementById ( 'idrinth-land-' + key ).value = idrinth.settings.land[key];
                document.getElementById ( 'idrinth-land-' + key ).parentNode.nextSibling.innerHTML = '+' + results[key];
            }
            document.getElementById ( 'idrinth-land-gold' ).value = idrinth.settings.land.gold;
            idrinth.settings.save ();
        };
        for (var key in idrinth.settings.land) {
            idrinth.settings.change ( 'land-' + key, parseInt ( document.getElementById ( 'idrinth-land-' + key ).value, 10 ) );
        }
        var results = baseCalculator ( getRequirements () );
        if ( Object.keys ( results ).length === 0 ) {
            idrinth.core.alert ( idrinth.text.get ( "land.lackgold" ) );
        }
        putResults ( results );
    },
    data: {
        cornfield: {
            perHour: 100,
            base: 4000
        },
        stable: {
            perHour: 300,
            base: 15000
        },
        barn: {
            perHour: 400,
            base: 25000
        },
        store: {
            perHour: 700,
            base: 50000
        },
        pub: {
            perHour: 900,
            base: 75000
        },
        inn: {
            perHour: 1200,
            base: 110000
        },
        tower: {
            perHour: 2700,
            base: 300000
        },
        fort: {
            perHour: 4500,
            base: 600000
        },
        castle: {
            perHour: 8000,
            base: 1200000
        }
    }
};