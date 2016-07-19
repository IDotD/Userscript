idrinth.land = {
        calculate: function () {
            for (var key in idrinth.settings.land) {
                idrinth.settings.land[key] = parseInt( document.getElementById ( 'idrinth-land-' + key ,10).value );
            }
            var results = idrinth.settings.landMax ? idrinth.land.useUp () : idrinth.land.bestPrice ();
            if(Object.keys (results).length===0) {
                idrinth.alert('You lack gold to buy any more buildings at the moment.');
            }
            idrinth.land.putResults ( results );
        },
        bestPrice: function () {
            var factor = idrinth.settings.factor ? 10 : 1;
            var results = { };
            while ( idrinth.settings.land.gold >= 0 ) {
                var min = null;
                var minKey = null;
                for (var key in idrinth.land.data) {
                    if (
                            min === null ||
                            ( 10 + idrinth.settings.land[key] ) * idrinth.land.data[key].base / idrinth.land.data[key].perHour < min )
                    {
                        min = ( 10 + idrinth.settings.land[key] ) * idrinth.land.data[key].base / idrinth.land.data[key].perHour;
                        minKey = key;
                    }
                }
                if ( minKey === null ) {
                    return results;
                }
                var price = ( 10 + idrinth.settings.land[minKey] ) * factor * idrinth.land.data[minKey].base / 10;
                if ( price > idrinth.settings.land.gold ) {
                    idrinth.land.putResults ( results );
                    return;
                }
                idrinth.settings.land.gold = idrinth.settings.land.gold - price;
                results[minKey] = ( results[minKey] === undefined ? 0 : results[minKey] ) + factor;
                idrinth.settings.land[minKey] = idrinth.settings.land[minKey] + factor;
            }
            return results;
        },
        useUp: function () {
            var factor = idrinth.settings.factor ? 10 : 1;
            var results = { };
            while ( idrinth.settings.land.gold >= 0 ) {
                var min = null;
                var minKey = null;
                for (var key in idrinth.land.data) {
                    if (
                            ( min === null ||
                                    ( 10 + idrinth.settings.land[key] ) * idrinth.land.data[key].base / idrinth.land.data[key].perHour < min )
                            && ( 10 + idrinth.settings.land[key] ) * factor * idrinth.land.data[key].base / 10 <= idrinth.settings.land.gold )
                    {
                        min = ( 10 + idrinth.settings.land[key] ) * idrinth.land.data[key].base / idrinth.land.data[key].perHour;
                        minKey = key;
                    }
                }
                if ( minKey === null ) {
                    return results;
                }
                idrinth.settings.land.gold = idrinth.settings.land.gold - ( 10 + idrinth.settings.land[minKey] ) * factor * idrinth.land.data[minKey].base / 10;
                results[minKey] = ( results[minKey] === undefined ? 0 : results[minKey] ) + factor;
                idrinth.settings.land[minKey] = idrinth.settings.land[minKey] + factor;
            }
            return results;
        },
        putResults: function ( results ) {
            for (var key in results) {
                document.getElementById ( 'idrinth-land-' + key ).value = idrinth.settings.land[key];
                document.getElementById ( 'idrinth-land-' + key ).parentNode.nextSibling.innerHTML = '+' + results[key];
            }
            document.getElementById ( 'idrinth-land-gold' ).value = idrinth.settings.land.gold;
            idrinth.settings.save ();
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