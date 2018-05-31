/**
 * @param {Object} data
 * @return {Object}
 */
function work ( data ) {
    return idrinth.calculate (
        new idrinth.StatSet ( data.attack, data.defense, data.perception, data.level, data.stats ),
        new idrinth.PremiumSet ( data.utym, data.mirele, data.kraken ),
        new idrinth.MultiplierSet ( data.legion, data.mount, data.critchance )
    );
}
/**
 * @type {Object}
 */
var idrinth = {
    /**
     * @class Container for premium
     * @constructs {idrinth.PremiumSet}
     */
    PremiumSet: class PremiumSet {
        /**
         * @constructor
         * @param {Boolean} utym
         * @param {Boolean} mirele
         * @param {Boolean} kraken
         * @return {idrinth.PremiumSet}
         */
        constructor ( utym, mirele, kraken ) {
            this.utym = utym;
            this.mirele = mirele;
            this.kraken = kraken;
        }
        /**
         * @param {Number} damage
         * @param {String} stat
         * @param {idrinth.StatSet} stats
         * @return {Number}
         */
        modifyBase ( damage, stat, stats ) {}
        /**
         * @param {Number} damage
         * @param {String} stat
         * @param {idrinth.StatSet} stats
         * @return {Number}
         */
        modifyTotal ( damage, stat, stats ) {}
    },
    /**
     * @class Container for damage multipliers
     * @constructs {idrinth.StatSet}
     */
    MultiplierSet: class MultiplierSet {
        /**
         * @constructor
         * @param {Number} legion
         * @param {Number} mount
         * @param {Number} critchance
         * @return {idrinth.MultiplierSet}
         */
        constructor ( legion, mount, critchance ) {
            this.legion = legion;
            this.mount = mount;
            this.critchance = critchance;
        }
        /**
         * @param {Number} base
         * @param {String} stat
         * @param {idrinth.StatSet} stats
         * @param {idrinth.PremiumSet} premiums
         * @return {idrinth.StatSet}
         */
        modifyTotal ( base, stat, stats, premiums ) {}
    },
    /**
     * @class Container for attributes
     * @constructs {idrinth.StatSet}
     */
    StatSet: class StatSet {
        /**
         * @constructor
         * @param {Number} attack
         * @param {Number} defense
         * @param {Number} perception
         * @param {Number} level
         * @param {Number} stats
         * @return {idrinth.StatSet}
         */
        constructor ( attack, defense, perception, level, stats ) {
            this.attack = attack;
            this.defense = defense;
            this.perception = perception;
            this.stats = stats;
            this.level = level;
        }
        /**
         * @param {Number} value
         * @return {Number}
         */
        getCost ( value ) {
            /**
             * @param {Number} number
             * @return {Number}
             */
            let toPositive = function ( number ) {
                return Math.max ( number, 0 );
            };
            let modifier = 10000 + Math.floor ( toPositive ( this.level / 500 - 2 ) ) * 1500;
            return 1 + Math.ceil (toPositive (value - modifier) / 1500);
        }
        /**
         * @return {Array}
         */
        getIncreaseableStats () {
            let stats = [ ];
            if ( this.getCost ( this.attack ) <= this.stats ) {
                stats.push ( 'attack' );
            }
            if ( this.getCost ( this.defense ) <= this.stats ) {
                stats.push ( 'defense' );
            }
            if ( this.getCost ( this.perception ) <= this.stats ) {
                stats.push ( 'perception' );
            }
            return stats;
        }
    },
    /**
     * @param {StatSet} stat
     * @param {PremiumSet} premium
     * @param {MultiplierSet} multiplier
     * @return {StatSet}
     */
    calculate ( stat, premium, multiplier ) {
        let modified = false;
        do {
            stat.getIncreaseableStats ().forEach ();
        } while ( modified )
        return stat;
    }
};