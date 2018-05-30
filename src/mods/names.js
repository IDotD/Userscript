idrinth.names = {
  /**
     * @type {object}
     */
  users: {},
  /**
     * @type {object}
     */
  classes: {},
  /**
     * @type {object}
     */
  guilds: {},
  /**
     * @type {Boolean}
     */
  initialized: false,
  /**
     *
     * @param {HTMLElement} element
     * @returns {string}
     */
  parse: function(element) {
    if (element.getAttribute("dotdxname")) {
      return element.getAttribute("dotdxname");
    }
    if (element.getAttribute("username")) {
      return element.getAttribute("username");
    }
    return element.innerHTML.replace(/(<([^>]+)>)/gi, "");
  },
  /**
     * the method being run to handle data im- and export
     * @returns {undefined}
     */
  run: function() {
    /**
         *
         * @param {string} added the path-segment defining the data returned
         * @returns {undefined}
         */
    let load = function(added) {
      /**
             *
             * @param {string} data
             * @returns {undefined}
             */
      let importNames = function(data) {
        data = JSON.parse(data);
        if (!data) {
          return;
        }
        if (data.users) {
          idrinth.names.users = data.users;
        }
        if (data.guilds) {
          idrinth.names.guilds = data.guilds;
        }
        if (data.classes) {
          idrinth.names.classes = data.classes;
        }
      };
      idrinth.core.ajax.runHome("users-service/" + added, importNames);
    };
    try {
      if (idrinth.names.initialized) {
        load("get/");
      } else {
        load("init/");
      }
    } catch (e) {
      idrinth.core.log(e);
    }
    idrinth.names.initialized = true;
  },
  /**
     * initialises the module
     * @returns {undefined}
     */
  start: function() {
    /**
         * creates the tooltip-element
         * @returns {undefined}
         */
    let build = function() {
      /**
             *
             * @param {string} name
             * @returns {Array}
             */
      function getServerPart(name) {
        return [
          {
            css: "idrinth-line idrinth-tooltip-header",
            type: "a",
            attributes: [
              {
                name: "href",
                value: "#"
              },
              {
                name: "target",
                value: "_blank"
              },
              {
                name: "title",
                value: "go to summoner details"
              }
            ]
          },
          {
            css: "idrinth-line idrinth-tooltip-level",
            type: "span",
            children: [
              {
                type: "#text",
                content: "Level "
              },
              {
                css: "idrinth-format-number idrinth-format-level",
                type: "span",
                content: "0"
              },
              {
                type: "#text",
                content: " "
              },
              {
                css: "idrinth-format-class",
                type: "span",
                content: "Unknown"
              }
            ]
          },
          {
            css: "idrinth-line idrinth-tooltip-guild",
            type: "span",
            children: [
              {
                type: "#text",
                content: "of "
              },
              {
                css: "idrinth-format-guild",
                type: "a",
                attributes: [
                  {
                    name: "href",
                    value: "#"
                  },
                  {
                    name: "title",
                    value: "go to guild details"
                  },
                  {
                    name: "target",
                    value: "_blank"
                  }
                ]
              }
            ]
          },
          {
            css: "idrinth-line idrinth-tooltip-update",
            type: "span",
            children: [
              {
                type: "#text",
                content: "Updated "
              },
              {
                css: "idrinth-format-date",
                type: "span",
                content: "Unknown"
              }
            ]
          },
          {
            type: "span",
            content: "Server: " + name
          }
        ];
      }
      idrinth.ui.tooltip = idrinth.ui.buildElement({
        css: "idrinth-hovering-box idrinth-tooltip-overwrite idrinth-hide",
        id: "idrinth-tooltip",
        children: [
          {
            children: getServerPart("Kongregate")
          },
          {
            children: getServerPart("World")
          }
        ],
        attributes: [
          {
            name: "onmouseenter",
            value: "idrinth.names.isHovering=true;"
          },
          {
            name: "onmouseleave",
            value: "idrinth.names.isHovering=false;"
          }
        ]
      });
      idrinth.ui.base.appendChild(idrinth.ui.tooltip);
    };
    /**
         * shows the tooltip if the element has a known name
         * @param {HTMLElement} element
         * @returns {undefined}
         */
    let showTooltip = function(element) {
      /**
             *
             * @param {object} set
             * @param {HTMLElement} element
             * @param {Boolean} world
             * @returns {undefined}
             */
      function tooltip(set, element, world) {
        if (!set) {
          idrinth.ui.updateClassesList(element, ["idrinth-hide"], []);
          return;
        }
        let baseUrl =
          "https://dotd.idrinth.de/" +
          (world ? "world-kongregate" : "kongregate");
        idrinth.ui.updateClassesList(idrinth.ui.tooltip, [], ["idrinth-hide"]);
        idrinth.ui.updateClassesList(element, [], ["idrinth-hide"]);
        element.childNodes[0].setAttribute(
          "href",
          baseUrl + "/summoner/" + set.id + "/"
        );
        element.childNodes[0].innerHTML = set.name;
        element.childNodes[1].childNodes[1].innerHTML =
          set.level + " (" + set["7day"] + "/week, " + set["30day"] + "/month)";
        element.childNodes[1].childNodes[3].innerHTML =
          idrinth.names.classes[set.class];
        element.childNodes[2].childNodes[1].setAttribute(
          "href",
          baseUrl + "/guild/" + set.guildId + "/"
        );
        element.childNodes[2].childNodes[1].innerHTML =
          idrinth.names.guilds[world ? "world" : "kongregate"][set.guildId];
        element.childNodes[3].childNodes[1].innerHTML = set.updated;
        element.childNodes[3].setAttribute(
          "style",
          new Date() - new Date(set.updated) > 86400000 ? "color:#aa0000;" : ""
        );
      }
      idrinth.names.isHovering = false;
      let name = idrinth.names.parse(element).toLowerCase();
      if (
        idrinth.settings.get("names") &&
        idrinth.ui.tooltip &&
        idrinth.names.users[name]
      ) {
        idrinth.core.timeouts.remove("names.tooltip");
        idrinth.ui.tooltip.setAttribute(
          "style",
          idrinth.ui.getElementPositioning(element, -200, -100)
        );
        tooltip(
          idrinth.names.users[name].kongregate,
          idrinth.ui.tooltip.firstChild,
          false
        );
        tooltip(
          idrinth.names.users[name].world,
          idrinth.ui.tooltip.lastChild,
          true
        );
        idrinth.ui.setTooltipTimeout();
      }
    };
    if (idrinth.platform === "kongregate") {
      idrinth.core.multibind.add(
        "mouseover",
        ".chat_message_window .username",
        showTooltip
      );
      idrinth.core.timeouts.add("names", idrinth.names.run, 300000, -1);
      idrinth.core.timeouts.add("names-init", idrinth.names.run, 1);
      build();
    }
  }
};
