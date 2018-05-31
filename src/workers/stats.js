function work ( data ) {
    return idrinth.calculate (
        new idrinth.StatSet(data.attack, data.defense, data.perception, data.level, data.stats),
        new idrinth.PremiumSet(data.utym, data.mirele, data.kraken),
        new idrinth.MultiplierSet(data.legion, data.mount, data.critchance)
    );
};
var idrinth = {
    PremiumSet: function (utym, mirele, kraken) {
        this.utym = utym;
        this.mirele = mirele;
        this.kraken = kraken;
        this.modifyBase = function(base, stat, stats) {};
        this.modifyTotal = function(base, stat, stats) {};
    },
    MultiplierSet: function (legion, mount, critchance) {
        this.legion = legion;
        this.mount = mount;
        this.critchance = critchance;
        this.modifyTotal = function(base, stat, stats, premiums) {};
    },
    StatSet: function(attack, defense, perception, level, stats) {
        this.attack = attack;
        this.defense = defense;
        this.perception = perception;
        this.stats = stats;
        this.level = level;
        this.getCost = function ( value ) {
        let toPositive = function(number) {
            return Math.max(number, 0);
        };
        return 1+ Math.ceil (
            toPositive (
                    value -
                    10000 -
                    Math.floor (toPositive ( this.level / 500 - 2 )) * 1500
                    ) / 1500
            );
        };
        this.getIncreaseableStats = function() {
            let stats = [];
            if (this.getCost(this.attack) <= this.stats) {
                stats.push ('attack');
            }
            if (this.getCost(this.defense) <= this.stats) {
                stats.push ('defense');
            }
            if (this.getCost(this.perception) <= this.stats) {
                stats.push ('perception');
            }
            return stats;
        };
    },
    /**
     * @param {idrinth.StatSet} stat
     * @param {idrinth.PremiumSet} premium
     * @param {idrinth.MultiplierSet} multiplier
     * @return {idrinth.StatSet}
     */
    calculate(stat, premium, multiplier) {
        let modified = false
        do {
            stat.getIncreaseableStats().forEach();
        } while (modified)
        return stat;
    }
};