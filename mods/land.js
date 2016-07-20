idrinth.land = {
    calculate: function () {
        var bestPrice = function ( building, factor, res ) {
            if (
                    res.min === null ||
                    ( 10 + idrinth.settings.land[building] ) * idrinth.land.data[building].base / idrinth.land.data[building].perHour < res.min )
            {
                res.min = ( 10 + idrinth.settings.land[building] ) * idrinth.land.data[building].base / idrinth.land.data[building].perHour;
                res.key = building;
            }
            return res;
        };
        var useUp = function ( building, factor, res ) {
            if (
                    ( res.min === null ||
                            ( 10 + idrinth.settings.land[building] ) * idrinth.land.data[building].base / idrinth.land.data[building].perHour < res.min )
                    && ( 10 + idrinth.settings.land[building] ) * factor * idrinth.land.data[building].base / 10 <= idrinth.settings.land.gold )
            {
                res.min = ( 10 + idrinth.settings.land[building] ) * idrinth.land.data[building].base / idrinth.land.data[building].perHour;
                res.key = building;
            }
            return res;
        };
        var baseCalculator = function ( checkElementFunc ) {
            var factor = idrinth.settings.factor ? 10 : 1;
            var results = { };
            while ( idrinth.settings.land.gold >= 0 ) {
                var res = { key: null, min: null };
                for (var building in idrinth.land.data) {
                    res = checkElementFunc ( building, factor, res );
                }
                if ( res.key === null ) {
                    return results;
                }
                idrinth.settings.land.gold = idrinth.settings.land.gold - ( 10 + idrinth.settings.land[res.key] ) * factor * idrinth.land.data[res.key].base / 10;
                results[res.key] = ( results[res.key] === undefined ? 0 : results[res.key] ) + factor;
                idrinth.settings.land[res.key] = idrinth.settings.land[res.key] + factor;
            }
            return results;
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
            idrinth.settings.land[key] = parseInt ( document.getElementById ( 'idrinth-land-' + key ).value, 10 );
        }
        var results = baseCalculator ( idrinth.settings.landMax ? useUp : bestPrice );
        if ( Object.keys ( results ).length === 0 ) {
            idrinth.alert ( 'You lack gold to buy any more buildings at the moment.' );
        }
        putResults ( results );
    },
    data: {
        cornfield: { perHour: 100, base: 4000 },
        stable: { perHour: 300, base: 15000 },
        barn: { perHour: 400, base: 25000 },
        store: { perHour: 700, base: 50000 },
        pub: { perHour: 900, base: 75000 },
        inn: { perHour: 1200, base: 110000 },
        tower: { perHour: 2700, base: 300000 },
        fort: { perHour: 4500, base: 600000 },
        castle: { perHour: 8000, base: 1200000 }
    }
};