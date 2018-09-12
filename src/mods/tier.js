idrinth.tier = {
  /**
     *
     * @type {object}
     */
  list: {},
  /**
     *
     * @type {object}
     */
  taggedSlots: {},
  /**
     *
     * @param {string} name
     * @returns {undefined}
     */
  addTagged: function(name) {
    /**
         *
         * @param {string} key
         * @returns {Boolean}
         */
    let isValidParameter = function(name) {
      return (
        name &&
        idrinth.tier.list.hasOwnProperty(name) &&
        typeof idrinth.tier.list[name] !== "function" &&
        !document.getElementById("idrinth-tier-box-" + name)
      );
    };
    /**
         *
         * @param {string} key
         * @returns {Boolean}
         */
    let isFreeSlot = function(key) {
      return (
        idrinth.tier.taggedSlots.hasOwnProperty(key) &&
        typeof key !== "function" &&
        idrinth.tier.taggedSlots[key] === null
      );
    };
    if (!isValidParameter(name)) {
      return;
    }
    let boss = this.list[name];
    /**
         *
         * @param {int} x
         * @param {string} name
         * @returns {undefined}
         */
    let make = function(x, name) {
      let makeElement = function(label, number, description) {
        return {
          content: label + " " + idrinth.ui.formatNumber(number),
          attributes: [
            {
              name: "title",
              value: description
            }
          ]
        };
      };
      let info = [
        makeElement("FS", boss.fs.nm, idrinth.text.get("tier.FS")),
        makeElement("AP", boss.ap, idrinth.text.get("tier.AP"))
      ];
      if (boss.os && boss.os.nm) {
        info.push(makeElement("OS", boss.os.nm, idrinth.text.get("tier.OS")));
        info.unshift(
          makeElement(
            "MA",
            boss.nm[boss.nm.length - 1],
            idrinth.text.get("tier.MA")
          )
        );
        info.unshift(
          makeElement("MI", boss.nm[0], idrinth.text.get("tier.MI"))
        );
      }
      info.unshift({
        type: "strong",
        content: boss.name.replace(/\(.*$/, "")
      });
      idrinth.tier.taggedSlots[x] = idrinth.ui.buildElement({
        id: "idrinth-tier-box-" + name,
        css: "idrinth-hovering-box idrinth-tier-box",
        children: [
          {
            children: info
          }
        ],
        attributes: [
          {
            name: "title",
            value: idrinth.text.get("tier.clickClose")
          },
          {
            name: "onclick",
            value: "idrinth.ui.removeElement(this.id);idrinth.tier.taggedSlots['" +
              x +
              "']=null;"
          },
          {
            name: "style",
            value: "left:" +
              x +
              "px;background-image: url(https://dotd.idrinth.de/static/raid-image-service/" +
              boss.url +
              "/);"
          }
        ]
      });
      idrinth.ui.base.appendChild(idrinth.tier.taggedSlots[x]);
    };
    for (var key in this.taggedSlots) {
      if (isFreeSlot(key)) {
        return make(key, name);
      }
    }
    idrinth.core.alert(idrinth.text.get("tier.maxBoxes"));
  },
  /**
     * initializes this module
     * @returns {undefined}
     */
  start: function() {
    let pos = 1;
    /**
         * parsed a json-response and fills tier list and exclusion list
         * @param {string} data
         * @returns {undefined}
         */
    let importData = function(data) {
      data = JSON.parse(data);
      if (data) {
        idrinth.tier.list = data;
        /**
                 *
                 * @param {string} name
                 * @param {string} url
                 * @returns {undefined}
                 */
        let create = function(name, url) {
          if (!idrinth.settings.data.bannedRaids[name]) {
            idrinth.settings.data.bannedRaids[name] = false;
            window.localStorage.setItem(
              "idotd",
              JSON.stringify(idrinth.settings.data)
            );
          }
          document.getElementById("idrinth-raid-may-join-list").appendChild(
            idrinth.ui.buildElement({
              name: "bannedRaids#" + name,
              rType: "#input",
              type: "checkbox",
              id: "idrinth-raid-may-join-list-" + name,
              label: idrinth.text.get("raids.disableJoining") + name
            })
          );
          document
            .getElementById("idrinth-raid-may-join-list")
            .lastChild.setAttribute(
              "style",
              "background-image:url(https://dotd.idrinth.de/static/raid-image-service/" +
                url +
                "/);"
            );
        };
        for (var key in data) {
          if (data[key].name) {
            create(data[key].name, data[key].url);
          }
        }
      } else {
        idrinth.core.timeouts.add("tier", idrinth.tier.start, 1000);
      }
    };
    while (0 < window.innerWidth - 140 * (pos + 1)) {
      this.taggedSlots[(pos * 140).toString()] = null;
      pos++;
    }
    idrinth.core.ajax.runHome(
      "tier-service/",
      importData,
      function() {
        idrinth.core.timeouts.add("tier", idrinth.tier.start, 10000);
      },
      function() {
        idrinth.core.timeouts.add("tier", idrinth.tier.start, 10000);
      }
    );
  },
  /**
     * displays bosses that match both name and type
     * @returns {undefined}
     */
  getMatchingTiers: function() {
    idrinth.workers.run('tiers', {
      name: document.getElementById("idrinth-tierlist-namesearch").value,
      type: document.getElementById("idrinth-tierlist-typesearch").value,
      list: idrinth.tier.list
    });
  },
  /**
     * 
     * @param {Boolean} yes
     * @returns {undefined}
     */
  allCheck: function(yes) {
    let boxes = document
      .getElementById("idrinth-raid-may-join-list")
      .getElementsByTagName("input");
    for (var counter = boxes.length - 1; counter >= 0; counter--) {
      if (
        boxes[counter].getAttribute("type") === "checkbox" &&
        boxes[counter].checked !== yes
      ) {
        boxes[counter].checked = yes;
        idrinth.settings.change(
          boxes[counter].getAttribute("id").replace(/idrinth-/, ""),
          yes
        );
      }
    }
  }
};
