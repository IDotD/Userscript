/**
 * @type {Object}
 */
var idrinth = {
    /**
    * @param {Object} data
    * @return {Object}
    */
   work: function ( data ) {
       let calc = new idrinth.Calculator (
           new idrinth.StatSet ( data.attack, data.defense, data.perception, data.level, data.stats ),
           new idrinth.PremiumSet ( data.utym, data.mirele, data.kraken ),
           new idrinth.MultiplierSet ( data.legion, data.mount, data.critchance )
       );
       return calc.calculate ();
   },
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
        increase (property) {
            this.stats -= this.getCost (this[property]);
            this[property]++;
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
            return 1 + Math.ceil ( toPositive ( value - modifier ) / 1500 );
        }
    },
    /**
     * @class Actual logic for stat calculation
     * @constructs {idrinth.Calculator}
     */
    Calculator: class Calculator {
        /**
         * @constructor
         * @param {idrinth.StatSet} stat
         * @param {idrinth.PremiumSet} premium
         * @param {idrinth.MultiplierSet} multiplier
         * @return {StatSet}
         */
        constructor ( stat, premium, multiplier ) {
            this.stat = stat;
            this.premium = premium;
            this.multiplier = multiplier;
        }
        /**
         * @returns {Number}
         */
        addOnePerception () {
            if (! this.premium.mirele ) {
                return 0;
            }
            return 1.8 * ( this.stat.perception <= 10000 ? 10 : 35 ) * this.multipliers.legion;
        }
        /**
         * @returns {Number}
         */
        addOneAttack () {
            let base = 4;
            if ( this.premium.utym ) {
                base += ( this.stat.attack <= 10000 ? 0.1 : 1 / 35 ) * 1.8 * this.multiplier.legion;
            }
            return base;
        }
        /**
         * @returns {Number}
         */
        addOneDefense () {
            let base = 1;
            if ( this.premium.utym ) {
                base += ( this.stat.defense <= 10000 ? 0.1 : 1 / 35 ) * 1.8 * this.multiplier.legion;
            }
            if ( this.premium.kraken ) {
                base += ( this.stat.defense <= 10000 ? 0.2 : 0.01 ) * 1.8 * this.multiplier.legion;
            }
            return base;
        }
        /**
         * @param {Number} value
         * @param {string} added
         * @returns {Number}
         */
        addProcs ( value ) {
            let perc = this.stat.perception + 1;
            return value * ( 1 + this.multiplier.mount + this.multiplier.critchance * 0.01 * Math.floor ( perc < 500000 ? perc / 5000 : 50 + perc / 10000 ) );
        }
        /**
         * @param {Number} value
         * @param {string} added
         * @returns {Number}
         */
        addPercProcs ( value ) {
            if ( this.premium.utym ) {
                value += this.stat.perception <= 10000 ? 0.4 : 0.2;
            }
            if ( this.premium.kraken ) {
                value += this.stat.perception <= 10000 ? 1 : 0.1;
            }
            return value;
        }
        getSet() {
            return {
                perception: this.addPercProcs(this.addProcs ( this.addOnePerception ())) / this.stat.getCost ( this.stat.perception ),
                defense: this.addProcs ( this.addOneDefense ()) / this.stat.getCost ( this.stat.defense ),
                attack: this.addProcs ( this.addOneAttack ()) / this.stat.getCost ( this.stat.attack )
            };
        }
        /**
         * @return {Boolean} was modified
         */
        increase () {
            let data = this.getSet();
            let isBiggest = function(key, data) {
                for (let prop in data) {
                    if(data[prop] > data[key]) {
                        return false;
                    }
                }
                return true;
            };
            for (let key in data) {
                if (isBiggest(key, data) && this.stat.getCost(this.stat[key]) < this.stat.stats) {
                    this.stat.increase(key);
                    return true;
                }
            }
            return false;
        }
        /**
         * @return {StatSet}
         */
        calculate ( ) {
            let modified = false;
            do {
                modified = this.increase();
            } while ( modified )
            return this.stat;
        }
    }
};