idrinth.stats = {
  /**
     *
     * @returns {undefined}
     */
  calculate: function() {
    /**
         *
         * @param {object} result
         * @returns {Boolean} is last?
         */
    let increaseSingle = function(result) {
      /**
             *
             * @returns {Number}
             */
      let addOnePerc = function() {
        let base = 0;
        if (idrinth.settings.get("stats#mirele")) {
          base +=
            1.8 *
            (idrinth.settings.get("stats#perception") <= 10000 ? 10 : 35) *
            idrinth.settings.get("stats#legion") /
            100;
        }
        return base;
      };
      /**
             *
             * @returns {Number}
             */
      let addOneAttack = function() {
        let base = 4;
        if (idrinth.settings.get("stats#utym")) {
          base +=
            (idrinth.settings.get("stats#attack") <= 10000 ? 0.1 : 1 / 35) *
            1.8 *
            idrinth.settings.get("stats#legion") /
            100;
        }
        return base;
      };
      /**
             *
             * @returns {Number}
             */
      let addOneDefense = function() {
        let base = 1;
        if (idrinth.settings.get("stats#utym")) {
          base +=
            (idrinth.settings.get("stats#defense") <= 10000 ? 0.1 : 1 / 35) *
            1.8 *
            idrinth.settings.get("stats#legion") /
            100;
        }
        if (idrinth.settings.get("stats#kraken")) {
          base +=
            (idrinth.settings.get("stats#defense") <= 10000 ? 0.2 : 0.01) *
            1.8 *
            idrinth.settings.get("stats#legion") /
            100;
        }
        return base;
      };
      /**
             *
             * @param {Number} base
             * @param {string} added
             * @returns {Number}
             */
      let addProcs = function(base, added) {
        let perc = idrinth.settings.get("stats#perception") + 1;
        let total =
          base *
          (100 +
            idrinth.settings.get("stats#mount") +
            idrinth.settings.get("stats#critchance") *
              0.01 *
              Math.floor(perc < 500000 ? perc / 5000 : 50 + perc / 10000)) /
          100;
        if (idrinth.settings.get("stats#utym") && added === "perception") {
          total +=
            (idrinth.settings.get("stats#perception") <= 10000 ? 4 : 2) * 0.1;
        }
        if (idrinth.settings.get("stats#mirele") && added === "perception") {
          total += idrinth.settings.get("stats#perception") <= 10000 ? 1 : 0.1;
        }
        return total;
      };
      /**
             *
             * @param {string} stat
             * @returns {Number}
             */
      let getCost = function(stat) {
        return (
          Math.ceil(
            Math.max(
              0,
              idrinth.settings.get("stats#" + stat) -
                10000 -
                Math.floor(
                  Math.max(idrinth.settings.get("stats#level") / 500 - 2, 0)
                ) *
                  1500
            ) / 1500
          ) + 1
        );
      };
      let perc = addProcs(addOnePerc(), "perception") / getCost("perception");
      let defense = addProcs(addOneDefense(), "defense") / getCost("defense");
      let attack = addProcs(addOneAttack(), "attack") / getCost("attack");
      let stat = null;
      if (
        perc >= defense &&
        perc >= attack &&
        idrinth.settings.get("stats#stats") >= getCost("perception")
      ) {
        stat = "perception";
      } else if (
        attack >= defense &&
        attack >= perc &&
        idrinth.settings.get("stats#stats") >= getCost("attack")
      ) {
        stat = "attack";
      } else if (
        defense >= perc &&
        defense >= attack &&
        idrinth.settings.get("stats#stats") >= getCost("defense")
      ) {
        stat = "defense";
      } else {
        return true;
      }
      idrinth.settings.change(
        "stats#stats",
        idrinth.settings.get("stats#stats") - getCost(stat)
      );
      result.stats -= getCost(stat);
      result[stat]++;
      idrinth.settings.change(
        "stats#" + stat,
        idrinth.settings.get("stats#" + stat) + 1
      );
      return false;
    };
    let result = {
      stats: 0,
      attack: 0,
      defense: 0,
      perception: 0
    };
    while (idrinth.settings.get("stats#stats") > 0) {
      if (increaseSingle(result)) {
        break;
      }
    }
    for (var key in result) {
      if (result.hasOwnProperty(key)) {
        document.getElementById(
          "idrinth-stats-" + key
        ).parentNode.parentNode.childNodes[2].innerHTML = result[key] < 0
          ? result[key]
          : "+" + result[key];
        document.getElementById("idrinth-stats-" + key).value =
          Number.parseInt(
            document.getElementById("idrinth-stats-" + key).value,
            10
          ) + result[key];
      }
    }
  }
};
