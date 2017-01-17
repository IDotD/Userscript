idrinth.stats = {
    calculate: function () {
        var addOnePerc = function () {
            var base = 0;
            if ( idrinth.settings.get ( 'stats#mirele' ) ) {
                base += 1.8 * ( idrinth.settings.get ( 'stats#perception' ) <= 10000 ? 10 : 35 ) * idrinth.settings.get ( 'stats#legion' ) / 100;
            }
            return base;
        };
        var addOneAttack = function () {
            var base = 4;
            if ( idrinth.settings.get ( 'stats#utym' ) ) {
                base += ( idrinth.settings.get ( 'stats#attack' ) <= 10000 ? 0.1 : 1 / 35 ) * 1.8 * idrinth.settings.get ( 'stats#legion' ) / 100;
            }
            return base;
        };
        var addOneDefense = function () {
            var base = 1;
            if ( idrinth.settings.get ( 'stats#utym' ) ) {
                base += ( idrinth.settings.get ( 'stats#defense' ) <= 10000 ? 0.1 : 1 / 35 ) * 1.8 * idrinth.settings.get ( 'stats#legion' ) / 100;
            }
            if ( idrinth.settings.get ( 'stats#utym' ) ) {
                base += ( idrinth.settings.get ( 'stats#defense' ) <= 10000 ? 0.2 : 0.01 ) * 1.8 * idrinth.settings.get ( 'stats#legion' ) / 100;
            }
            return base;
        };
        var addProcs = function ( base, added ) {
            var perc = idrinth.settings.get ( 'stats#perception' ) + 1;
            var total = base * ( 100 + idrinth.settings.get ( 'stats#mount' ) + idrinth.settings.get ( 'stats#critchance' ) * 0.01 * Math.floor ( perc < 500000 ? perc / 5000 : 50 + perc / 10000 ) ) / 100;
            if ( idrinth.settings.get ( 'stats#utym' ) && added === 'perception' ) {
                total += ( idrinth.settings.get ( 'stats#perception' ) <= 10000 ? 4 : 2 ) * 0.1;
            }
            if ( idrinth.settings.get ( 'stats#mirele' ) && added === 'perception' ) {
                total += ( idrinth.settings.get ( 'stats#perception' ) <= 10000 ? 1 : 0.1 );
            }
            return total;
        };
        var getCost = function ( stat ) {
            return Math.ceil ( Math.max ( 0, idrinth.settings.get ( 'stats#' + stat ) - 10000 - Math.floor ( Math.max ( idrinth.settings.get ( 'stats#level' ) / 500 - 2, 0 ) ) * 1500 ) / 1500 ) + 1;
        };
        var result = {
            stats: 0,
            attack: 0,
            defense: 0,
            perception: 0
        };
        while ( idrinth.settings.get ( 'stats#stats' ) > 0 ) {
            var perc = addProcs ( addOnePerc (), 'perception' ) / getCost ( 'perception' );
            var defense = addProcs ( addOneDefense (), 'defense' ) / getCost ( 'defense' );
            var attack = addProcs ( addOneAttack (), 'attack' ) / getCost ( 'attack' );
            if ( perc <= defense && perc <= attack && idrinth.settings.get ( 'stats#stats' ) >= getCost ( 'perception' ) ) {
                idrinth.settings.change ( 'stats#stats', idrinth.settings.get ( 'stats#stats' ) - getCost ( 'perception' ) );
                result.stats -= getCost ( 'perception' );
                result.perception++;
                idrinth.settings.change ( 'stats#perception', idrinth.settings.get ( 'stats#perception' ) + 1 );
            } else if ( attack <= defense && perc >= attack && idrinth.settings.get ( 'stats#stats' ) >= getCost ( 'attack' ) ) {
                idrinth.settings.change ( 'stats#stats', idrinth.settings.get ( 'stats#stats' ) - getCost ( 'attack' ) );
                result.stats -= getCost ( 'attack' );
                result.attack++;
                idrinth.settings.change ( 'stats#attack', idrinth.settings.get ( 'stats#attack' ) + 1 );
            } else if ( perc >= defense && defense <= attack && idrinth.settings.get ( 'stats#stats' ) >= getCost ( 'defense' ) ) {
                idrinth.settings.change ( 'stats#stats', idrinth.settings.get ( 'stats#stats' ) - getCost ( 'defense' ) );
                result.stats -= getCost ( 'defense' );
                result.defense++;
                idrinth.settings.change ( 'stats#defense', idrinth.settings.get ( 'stats#defense' ) + 1 );
            } else {
                break;
            }
        }
        for (var key in result) {
            if ( result.hasOwnProperty ( key ) ) {
                document.getElementById ( 'idrinth-stats-' + key ).parentNode.parentNode.childNodes[2].innerHTML = result[key] < 0 ? result[key] : '+' + result[key];
                document.getElementById ( 'idrinth-stats-' + key ).value += result[key];
            }
        }
    },
    start: function () {
    }
};