idrinth.observer = {
  /**
     * 
     * @type MutationObserver[]
     */
  list: {},
  /**
     * 
     * @param {MutationRecord[]} mutations
     * @param {boolean} isPrivate
     * @returns {undefined}
     */
  handle: function(mutations, isPrivate) {
    /**
         *
         * @param {HTMLElement} element
         * @returns {undefined}
         */
    let checkLinks = function(node) {
      /**
             * 
             * @param {HTMLElement} element
             * @returns {undefined}
             */
      let handleLink = function(element) {
        let href = element.getAttribute("href");
        /**
                 * 
                 * @param {Array} parts
                 * @param {string} prefix
                 * @returns {null|string}
                 */
        let getData = function(parts, prefix) {
          for (var count = 0; count < parts.length; count++) {
            if (parts[count].match(prefix + "=")) {
              return parts[count].split("=")[1];
            }
          }
          return null;
        };
        /**
                 * 
                 * @param {string} href
                 * @param {Boolean} isWorld
                 * @returns {Boolean}
                 */
        let correctServer = function(href, isWorld) {
          if (href.match("serverid=2")) {
            return isWorld;
          }
          return !isWorld;
        };
        if (!href || !href.match(/action_type=raidhelp/)) {
          return;
        }
        href = href.replace(/^.*\?/, "");
        if (!correctServer(href, idrinth.settings.get("world"))) {
          return;
        }
        let parts = href.split("&");
        let id = getData(parts, "raid_id");
        let hash = getData(parts, "hash");
        if (!id || !hash) {
          return;
        }
        idrinth.raids.private[id] = hash;
        idrinth.core.ajax.runHome("get-raid-service/" + id + "/" + hash + "/");
      };
      if (node.tagName === "A" || node.tagName === "a") {
        handleLink(node);
      } else {
        let elements = node.getElementsByTagName("a");
        for (var count = 0; count < elements.length; count++) {
          handleLink(elements[count]);
        }
      }
    };
    /**
         *
         * @param {HTMLElement} element
         * @returns {undefined}
         */
    let checkNames = function(node) {
      /**
             *
             * @param {HTMLElement} element
             * @returns {undefined}
             */
      let processName = function(element) {
        let name = "";
        try {
          name = idrinth.names.parse(element);
        } catch (e) {
          return;
        }
        if (!name) {
          return;
        }
        if (!idrinth.names.users[name.toLowerCase()] && name.length > 0) {
          idrinth.names.users[name.toLowerCase()] = {};
          idrinth.core.ajax.runHome(
            "users-service/add/" + encodeURIComponent(name) + "/"
          );
        }
      };
      let elements = node.getElementsByClassName("username");
      for (var count = elements.length - 1; count >= 0; count--) {
        processName(elements[count]);
      }
    };
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        checkLinks(node);
        checkNames(node);
      });
    });
  },
  /**
     * 
     * @returns {undefined}
     */
  start: function() {
    if (idrinth.platform !== "kongregate") {
      return;
    }
    if (
      !document.getElementById("chat_rooms_container") ||
      !document.getElementById("chat_rooms_container").children[1] ||
      !document.getElementById("chat_rooms_container").children[1].children[2]
    ) {
      idrinth.core.timeouts.add("observer", idrinth.observer.start, 500, 1);
      return;
    }
    idrinth.observer.list.chat = new MutationObserver(function(mutations) {
      idrinth.observer.handle(mutations, false);
    });
    idrinth.observer.list.chat.observe(
      document.getElementById("chat_rooms_container").children[1].children[2],
      {
        childList: true,
        subtree: true
      }
    );
    idrinth.observer.list.guild = new MutationObserver(function(mutations) {
      idrinth.observer.handle(mutations, true);
    });
    idrinth.observer.list.guild.observe(
      document.getElementById("chat_rooms_container").children[0].children[2],
      {
        childList: true,
        subtree: true
      }
    );
  }
};
