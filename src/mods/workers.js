idrinth.workers = {
  list: '###WORKERS###',
  result: {
       /**
         * @param {string} list
         * @returns {undefined}
         */
     tiers: function(list) {
      /**
             *
             * @param {HTMLElement} elem
             * @returns {undefined}
             */
      let clearInnerHtml = function(elem) {
        elem.innerHTML = "";
      };
      /**
             *
             * @param {string} listKey
             * @param {string} difficulty
             * @param {string} ic
             * @returns {object} for the buildElement wrapper
             */
      let makeField = function(listKey, difficulty, ic) {
        let ln = {
          type: "td",
          attributes: []
        };
        /**
                 * 
                 * @param {object} ln
                 * @param {string} listKey
                 * @param {string} difficulty
                 * @param {string} ic
                 * @returns {object} for the buildElement wrapper
                 */
        let addTitle = function(ln, listKey, difficulty, ic) {
          /**
                     * 
                     * @param {string} listKey
                     * @param {string} difficulty
                     * @param {string} ic
                     * @returns {Boolean}
                     */
          let isUseable = function(listKey, difficulty, ic) {
            return (
              idrinth.tier.list[listKey].hasOwnProperty("loot") &&
              idrinth.tier.list[listKey].loot.hasOwnProperty(difficulty) &&
              idrinth.tier.list[listKey].loot[difficulty].hasOwnProperty(ic) &&
              idrinth.tier.list[listKey].loot[difficulty][ic]
            );
          };
          if (!isUseable(listKey, difficulty, ic)) {
            return ln;
          }
          let title = "";
          for (var key in idrinth.tier.list[listKey].loot[difficulty][ic]) {
            if (
              idrinth.tier.list[listKey].loot[difficulty][ic].hasOwnProperty(
                key
              )
            ) {
              title +=
                idrinth.tier.list[listKey].loot[difficulty][ic][key] +
                " " +
                idrinth.text.get("tier.loot." + key) +
                "\n";
            }
          }
          ln.attributes.push({
            name: "title",
            value: title
          });
          return ln;
        };
        /**
                 * 
                 * @param {object} ln
                 * @param {string} listKey
                 * @param {string} difficulty
                 * @param {string} ic
                 * @returns {object} for the buildElement wrapper
                 */
        let addContent = function(ln, listKey, difficulty, ic) {
          /**
                     * 
                     * @param {string} os numeric string
                     * @param {string} current numeric string
                     * @returns {Boolean}
                     */
          let isOs = function(os, current) {
            return Number.parseInt(os, 10) === Number.parseInt(current, 10);
          };
          if (
            !idrinth.tier.list[listKey].hasOwnProperty(difficulty) ||
            !idrinth.tier.list[listKey][difficulty].hasOwnProperty(ic)
          ) {
            return ln;
          }
          ln.css = isOs(
            idrinth.tier.list[listKey].os[difficulty],
            idrinth.tier.list[listKey][difficulty][ic]
          )
            ? "is-os"
            : "";
          ln.content = idrinth.ui.formatNumber(
            idrinth.tier.list[listKey][difficulty][ic]
          );
          if (
            idrinth.tier.list[listKey].epics &&
            idrinth.tier.list[listKey].epics.hasOwnProperty(difficulty) &&
            idrinth.tier.list[listKey].epics[difficulty].hasOwnProperty(ic)
          ) {
            ln.content +=
              " " + idrinth.tier.list[listKey].epics[difficulty][ic] + "E";
          }
          return ln;
        };
        return addContent(
          addTitle(ln, listKey, difficulty, ic),
          listKey,
          difficulty,
          ic
        );
      };
      /**
             *
             * @param {string} title
             * @param {object} dataset
             * @returns {HTMLElement}
             */
      let makeRow = function(title, dataset) {
        return {
          type: "tr",
          children: [
            {
              type: "th",
              content: title
            },
            {
              type: "td",
              content: idrinth.ui.formatNumber(dataset.n)
            },
            {
              type: "td",
              content: idrinth.ui.formatNumber(dataset.h)
            },
            {
              type: "td",
              content: idrinth.ui.formatNumber(dataset.l)
            },
            {
              type: "td",
              content: idrinth.ui.formatNumber(dataset.nm)
            }
          ]
        };
      };
      let wrapper = document.getElementById("idrinth-tierlist");
      clearInnerHtml(wrapper);
      /**
             *
             * @param {Array} list
             * @returns {String}
             */
      let formattedList = function(list) {
        let fList = [];
        for (var count = 0; count < list.length; count++) {
          fList.push(idrinth.ui.formatNumber(list[count]));
        }
        return fList.join(" | ");
      };
      /**
             *
             * @param {string} label
             * @param {string} click
             * @returns {object}
             */
      let makeButton = function(label, click) {
        return {
          type: "button",
          content: idrinth.text.get("tier." + label),
          attributes: [
            {
              name: "onclick",
              value: click
            },
            {
              name: "type",
              value: "action"
            }
          ]
        };
      };
      for (var count = list.length - 1; count >= 0; count--) {
        let boss = idrinth.tier.list[list[count]];
        let sub = idrinth.ui.buildElement({
          css: "tier-wrapper",
          children: [
            {
              type: "img",
              attributes: [
                {
                  name: "src",
                  value: "https://dotd.idrinth.de/static/raid-image-service/" +
                    boss.url +
                    "/"
                }
              ]
            },
            {
              type: "strong",
              content: boss.name
            },
            {
              type: "span",
              content: boss.types.join(", ")
            },
            makeButton(
              "copy",
              'idrinth.core.copyToClipboard.text("' +
                boss.name +
                "(NM): OS " +
                idrinth.ui.formatNumber(boss.os.nm) +
                ", AP " +
                idrinth.ui.formatNumber(boss.ap) +
                ", Tiers " +
                formattedList(boss.nm) +
                ' by IDotD")'
            ),
            makeButton(
              "tag",
              "idrinth.tier.addTagged('" +
                list[count].replace(/'/g, "\\'") +
                "');"
            ),
            {
              type: "span",
              content: "AP: " + idrinth.ui.formatNumber(boss.ap)
            },
            {
              type: "table",
              children: [
                {
                  type: "thead",
                  children: [
                    {
                      type: "tr",
                      children: [
                        {
                          type: "th",
                          content: "#"
                        },
                        {
                          type: "th",
                          content: idrinth.text.get("tier.diff.normal")
                        },
                        {
                          type: "th",
                          content: idrinth.text.get("tier.diff.hard")
                        },
                        {
                          type: "th",
                          content: idrinth.text.get("tier.diff.legend")
                        },
                        {
                          type: "th",
                          content: idrinth.text.get("tier.diff.night")
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tbody",
                  children: [
                    makeRow("FS", boss.fs),
                    makeRow("OS", boss.os),
                    makeRow("", {
                      n: "",
                      l: "",
                      h: "",
                      nm: ""
                    })
                  ]
                }
              ]
            }
          ]
        });
        let maxTiers = Math.max(
          boss.n.length,
          boss.h.length,
          boss.l.length,
          boss.nm.length
        );
        for (var ic = 0; ic < maxTiers; ic++) {
          sub.lastChild.lastChild.appendChild(
            idrinth.ui.buildElement({
              type: "tr",
              children: [
                {
                  type: "th",
                  content: ic + 1
                },
                makeField(list[count], "n", ic),
                makeField(list[count], "h", ic),
                makeField(list[count], "l", ic),
                makeField(list[count], "nm", ic)
              ]
            })
          );
        }
        wrapper.appendChild(sub);
      }
    },
    stats: function(result) {
    for (let key in result) {
      if (result.hasOwnProperty(key)) {
          let element = document.getElementById("idrinth-stats-" + key);
          let delta = result[key] - Number.parseInt(element.value, 10);
          idrinth.settings.change ("stats#"+key, result[key]);
        element.parentNode.parentNode.childNodes[2].innerHTML = "+" + delta;
        element.value = result[key];
      }
    }
  }
  },
  /**
     * runs the inWorker function in the worker and let's the resultHandler handle the result
     * @param {String} name
     * @returns {Worker}
     */
  getWorker: function(name) {
    if(typeof idrinth.workers.list[name] === 'string') {
        let blobURL = window.URL.createObjectURL(
          new Blob([
            "/*js:big*/\n" +//replaced server-side from libs/[name].js
            "self.onmessage = function(message) {self.postMessage(idrinth.work(message.data));};\n" +
            this.list[name]
          ])
        );
        let worker = new Worker(blobURL);
        window.URL.revokeObjectURL(blobURL);
        worker.resultHandler = idrinth.workers.result[name];
        worker.onmessage = function(message) {
          message.target.resultHandler(message.data);
        };
        idrinth.workers.list[name] = worker;
    }
    return idrinth.workers.list[name];
  },
  run: function (name, values) {
      idrinth.workers.getWorker (name).postMessage (values);
  }
};