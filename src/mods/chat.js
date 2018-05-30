idrinth.chat = {
  /**
     * own user id
     * @type Number
     */
  self: 0,
  /**
     * Maximum message id
     * @type Number
     */
  maxId: 0,
  /**
     * 
     * @type Array
     */
  messages: [],
  /**
     * 
     * @type Array
     */
  oldMessages: [],
  /**
     * 
     * @type Object
     */
  elements: {
    /**
         * 
         * @type HTMLElement
         */
    chats: null,
    /**
         * 
         * @type HTMLElement
         */
    menu: null
  },
  /**
     * 
     * @type {Object}
     */
  chatRank: {},
  /**
     * 
     * @type Number
     */
  refreshCount: 0,
  /**
     * 
     * @returns {undefined}
     */
  refreshChats: function() {
    /**
         * 
         * @param {String} data
         * @returns {undefined}
         */
    let applyMessages = function(data) {
      /**
             * 
             * @param {String} messages
             * @returns {undefined}
             */
      let processMessages = function(messages) {
        /**
                 * 
                 * @param {Array} chatMessages
                 * @param {Number} chatId
                 * @param {HTMLElement} chatElement
                 * @returns {Boolean}
                 */
        let addMessages = function(chatMessages, chatId, chatElement) {
          /**
                     * 
                     * @param {String} message
                     * @param {HTMLElement} chat
                     * @param {Number} chatId
                     * @param {Number} messageId
                     * @returns {undefined}
                     */
          let buildMessage = function(message, chat, chatId, messageId) {
            /**
                         * 
                         * @returns {String}
                         */
            let getfullDateInt = function() {
              /**
                             * 
                             * @param {Number} x
                             * @param {Number} n
                             * @returns {String}
                             */
              function addZero(x, n) {
                while (x.toString().length < n) {
                  x = "0" + x;
                }
                return x;
              }
              let d = new Date();
              return (
                addZero(d.getFullYear(), 2) +
                addZero(d.getMonth(), 2) +
                addZero(d.getDate(), 2) +
                addZero(d.getHours(), 2) +
                addZero(d.getMinutes(), 2) +
                addZero(d.getSeconds(), 2) +
                addZero(d.getMilliseconds(), 3)
              );
            };
            /**
                         * 
                         * @param {String} message
                         * @param {Boolean} own
                         * @param {Number} chatId
                         * @returns {undefined}
                         */
            let notify = function(message, own, chatId) {
              /**
                             * 
                             * @param {Number} chatId
                             * @returns {Boolean}
                             */
              let notActive = function(chatId) {
                try {
                  return (
                    !idrinth.windowactive ||
                    !document
                      .getElementById("idrinth-chat-tab-click-" + chatId)
                      .getAttribute("class")
                      .match(/(\s|^)active( |$)/) ||
                    !document
                      .getElementById("idrinth-chat")
                      .getAttribute("class")
                      .match(/(\s|^)active( |$)/)
                  );
                } catch (e) {
                  idrinth.core.log(e.getMessage);
                  return true;
                }
              };
              /**
                             * 
                             * @param {String} text
                             * @returns {Boolean}
                             */
              let messageAllowed = function(text) {
                try {
                  return (
                    (idrinth.settings.get("notification#message") &&
                      text.match(/\{[A-Z]{2}-Raid /) === null) ||
                    (idrinth.settings.get("notification#mention") &&
                      text.match(
                        new RegExp(
                          "(\s|^)" +
                            idrinth.core.escapeRegExp(
                              idrinth.chat.users[idrinth.chat.self].name
                            ) +
                            "(\s|$)",
                          "i"
                        )
                      ) !== null) ||
                    (idrinth.settings.get("notification#raid") &&
                      text.match(/\{[A-Z]{2}-Raid /) !== null)
                  );
                } catch (e) {
                  idrinth.core.log(e.getMessage());
                  return false;
                }
              };
              if (!own && notActive(chatId) && messageAllowed(message.text)) {
                try {
                  idrinth.core.sendNotification(
                    message.time.split(" ")[1] +
                      " " +
                      document.getElementById(
                        "idrinth-chat-tab-click-" + chatId
                      ).innerHTML +
                      ":",
                    idrinth.chat.users[message.user].name + ": " + message.text
                  );
                } catch (exception) {
                  idrinth.core.log(exception.getMessage());
                }
              }
            };
            let own =
              parseInt(message.user, 10) === parseInt(idrinth.chat.self, 10);
            notify(message, own, chatId);
            chat.appendChild(
              idrinth.ui.buildElement({
                type: "li",
                id: "idrinth-single-chat-message-" +
                  messageId +
                  (parseInt(messageId, 10) < 1 ? "-" + getfullDateInt() : ""),
                css: own ? "self-written " : "",
                children: [
                  {
                    type: "span",
                    css: "time",
                    content: message.time.split(" ")[1],
                    attributes: [
                      {
                        name: "title",
                        value: message.time
                      }
                    ]
                  },
                  {
                    type: "span",
                    css: "user " +
                      idrinth.chat.ranks[
                        parseInt(
                          idrinth.chat.chatRank[chatId][message.user],
                          10
                        )
                      ] +
                      (message.user === 0 ? " system-message" : ""),
                    content: idrinth.chat.users[message.user].name,
                    attributes: [
                      {
                        name: "data-id",
                        value: message.user
                      },
                      {
                        name: "onclick",
                        value: "idrinth.chat.userclick(this," +
                          message.user +
                          "," +
                          chatId +
                          ")"
                      }
                    ]
                  },
                  {
                    type: "#text",
                    content: ":"
                  },
                  {
                    type: "span",
                    children: idrinth.chat.buildMessageText(message.text)
                  }
                ]
              })
            );
          };
          let isNew = false;
          for (var messageId in chatMessages) {
            if (
              parseInt(messageId, 10) < 1 ||
              !document.getElementById(
                "idrinth-single-chat-message-" + messageId
              )
            ) {
              isNew = true;
              buildMessage(
                messages[chatId][messageId],
                chatElement,
                chatId,
                messageId
              );
              if (parseInt(messageId, 10) > parseInt(idrinth.chat.maxId, 10)) {
                idrinth.chat.maxId = messageId;
              }
            }
          }
          return isNew;
        };
        /**
                 * 
                 * @param {Boolean} isNew
                 * @param {HTMLElement} chat
                 * @param {Number} chatId
                 * @returns {undefined}
                 */
        let setChatClass = function(isNew, chat, chatId) {
          /**
                     * 
                     * @param {HTMLElement} element
                     * @returns {Boolean}
                     */
          let isActive = function(element) {
            let cssClass = element.getAttribute("class");
            return !!cssClass && !!cssClass.match(/(^|\s)active(\s|$)/);
          };
          let chatActive = isActive(document.getElementById("idrinth-chat"));
          if (isNew && !chatActive) {
            document
              .getElementById("idrinth-chat")
              .setAttribute("class", "new-message");
          }
          let tab = document.getElementById("idrinth-chat-tab-click-" + chatId);
          let tabActive = isActive(tab);
          if (isNew && !tabActive) {
            tab.setAttribute(
              "class",
              tab.getAttribute("class") + " new-message"
            );
          } else if (
            tabActive &&
            chatActive &&
            chat.lastChild.scrollTop < chat.lastChild.scrollHeight
          ) {
            try {
              chat.lastChild.scrollIntoView(false);
            } catch (e) {
              idrinth.core.log(e);
            }
            chat.lastChild.scrollTop = chat.lastChild.scrollHeight;
          }
        };
        if (idrinth.chat.maxId === 0) {
          idrinth.chat.maxId = 1;
        }
        for (var key in messages) {
          if (
            !isNaN(parseInt(key, 10)) &&
            document.getElementById("idrinth-chat-tab-" + key) &&
            document
              .getElementById("idrinth-chat-tab-" + key)
              .getElementsByTagName("ul")[1]
          ) {
            let chat = document
              .getElementById("idrinth-chat-tab-" + key)
              .getElementsByTagName("ul")[1];
            setChatClass(addMessages(messages[key], key, chat), chat, key);
          }
        }
      };
      if (!data) {
        return idrinth.chat.returnMessages(data);
      }
      data = JSON.parse(data);
      if (!data) {
        return idrinth.chat.returnMessages(data);
      }
      if (data.login) {
        return idrinth.chat.relogin();
      }
      if (data.messages) {
        processMessages(data.messages);
      }
      idrinth.chat.oldMessages = [];
      idrinth.core.timeouts.add("chat", idrinth.chat.refreshChats, 999);
    };
    /**
         * 
         * @returns {undefined}
         */
    let refreshMembers = function() {
      /**
             * 
             * @param {String} data
             * @returns {undefined}
             */
      let applyMembers = function(data) {
        /**
                 * 
                 * @returns {undefined}
                 */
        let applyMemberData = function() {
          /**
                     * 
                     * @param {HTMLElement} chat
                     * @param {Number} chatId
                     * @param {Number} userId
                     * @returns {undefined}
                     */
          let addMemberElement = function(chat, chatId, userId) {
            let usedPlatforms = "";
            for (var pkey in idrinth.chat.users[userId].platforms) {
              if (idrinth.chat.users[userId].platforms[pkey]) {
                usedPlatforms += pkey;
              }
            }
            chat.appendChild(
              idrinth.ui.buildElement({
                type: "li",
                css: "user " +
                  idrinth.chat.ranks[
                    parseInt(idrinth.chat.chatRank[chatId][userId], 10)
                  ],
                content: (usedPlatforms === ""
                  ? ""
                  : "[" + usedPlatforms.toUpperCase() + "] ") +
                  idrinth.chat.users[userId].name,
                attributes: [
                  {
                    name: "data-id",
                    value: userId
                  },
                  {
                    name: "onclick",
                    value: "idrinth.chat.userclick(this," +
                      userId +
                      ", " +
                      chatId +
                      ")"
                  }
                ]
              })
            );
          };
          for (var chatId in idrinth.chat.chatRank) {
            if (document.getElementById("idrinth-chat-tab-" + chatId)) {
              let chat = document
                .getElementById("idrinth-chat-tab-" + chatId)
                .getElementsByTagName("ul")[0];
              while (chat.firstChild) {
                chat.removeChild(chat.firstChild);
              }
              for (var userId in idrinth.chat.chatRank[chatId]) {
                if (idrinth.chat.chatRank[chatId].hasOwnProperty(userId)) {
                  addMemberElement(chat, chatId, userId);
                }
              }
            }
          }
        };
        if (!data) {
          return;
        }
        data = JSON.parse(data);
        if (!data) {
          return;
        }
        idrinth.chat.self = data.self;
        idrinth.chat.users = data.users;
        idrinth.chat.chatRank = data.members;
        applyMemberData();
      };
      idrinth.core.ajax.runHome("chat-service/accounts/", applyMembers);
    };
    idrinth.chat.oldMessages = JSON.parse(
      JSON.stringify(idrinth.chat.messages)
    );
    idrinth.chat.messages = [];
    idrinth.core.ajax.runHome(
      "chat-service/update/",
      applyMessages,
      idrinth.chat.returnMessages,
      idrinth.chat.returnMessages,
      JSON.stringify({
        maxId: idrinth.chat.maxId,
        messages: idrinth.chat.oldMessages
      })
    );
    if (idrinth.chat.refreshCount % 25 === 0) {
      refreshMembers();
    }
    idrinth.chat.refreshCount++;
  },
  /**
     * 
     * @param {String} data
     * @returns {undefined}
     */
  returnMessages: function(data) {
    for (var count = idrinth.chat.oldMessages.length - 1; count >= 0; count--) {
      idrinth.chat.messages.unshift(idrinth.chat.oldMessages[count]);
    }
    idrinth.chat.oldMessages = [];
    idrinth.core.timeouts.add("chat", idrinth.chat.refreshChats, 999);
  },
  /**
     * 
     * @param {HTMLElement} element
     * @param {Number} user
     * @param {Number} chat
     * @returns {undefined}
     */
  userclick: function(element, user, chat) {
    if (
      !idrinth.chat.chatRank[chat][idrinth.chat.self] ||
      parseInt(user, 10) === parseInt(idrinth.chat.self, 10)
    ) {
      return;
    }
    /**
         * 
         * @param {Number} chat
         * @param {Number} user
         * @param {Number} rankId
         * @returns {Array}
         */
    let getPopupContent = function(chat, user, rankId) {
      /**
             * 
             * @param {Number} chat
             * @returns {Array}
             */
      let getPromotionOptions = function(chat) {
        let promotionModes = [
          {
            chat: chat,
            label: "chat.actions.banUser",
            rank: "Banned",
            requiredRank: 3
          },
          {
            chat: chat,
            label: "chat.actions.makeMod",
            rank: "Mod",
            requiredRank: 3
          },
          {
            chat: chat,
            label: "chat.actions.makeAdmin",
            rank: "Owner",
            requiredRank: 4
          },
          {
            chat: chat,
            label: "chat.actions.makeUser",
            rank: "User",
            requiredRank: 3
          }
        ];
        for (var chatId in idrinth.chat.chatRank) {
          if (idrinth.chat.chatRank.hasOwnProperty(chatId)) {
            let intChatId = parseInt(chatId, 10);
            if (
              document.getElementById("idrinth-chat-tab-click-" + chatId) &&
              intChatId !== chat &&
              intChatId > 1 &&
              !(user in idrinth.chat.chatRank[chatId])
            ) {
              promotionModes.push({
                chat: chatId,
                label: "Invite to Chat " +
                  document.getElementById("idrinth-chat-tab-click-" + chatId)
                    .innerHTML,
                rank: "User",
                requiredRank: 1
              });
            }
          }
        }
        return promotionModes;
      };
      /**
             * 
             * @param {Object} node
             * @param {Number} user
             * @param {Number} ownRank
             * @returns {Array}
             */
      let promoteNode = function(node, user, ownRank) {
        /**
                 * 
                 * @param {Number} reqRank
                 * @param {Number} ownRank
                 * @returns {Boolean}
                 */
        let hasRights = function(reqRank, ownRank) {
          return reqRank <= ownRank;
        };
        if (!hasRights(node.requiredRank, ownRank)) {
          return;
        }
        let translation = idrinth.text.get(node.label);
        return {
          content: translation === idrinth.text.data.default
            ? node.label
            : translation,
          type: "li",
          attributes: [
            {
              name: "onclick",
              value: "idrinth.chat.useroptions(" +
                node.chat +
                "," +
                user +
                ",'" +
                node.rank +
                "');this.parentNode.parentNode.removeChild(this.parentNode);"
            }
          ]
        };
      };
      let popupContent = [];
      let promotionModes = getPromotionOptions(parseInt(chat, 10), user);
      for (var count = 0; count < promotionModes.length; count++) {
        let tmp = promoteNode(promotionModes[count], user, rankId);
        if (tmp) {
          popupContent.push(tmp);
        }
      }
      return popupContent;
    };
    let rankId = parseInt(idrinth.chat.chatRank[chat][idrinth.chat.self], 10);
    let popupContent = getPopupContent(chat, user, rankId);
    if (popupContent.length === 0) {
      return;
    }
    popupContent.push({
      type: "li",
      content: "Close",
      attributes: [
        {
          name: "onclick",
          value: "this.parentNode.parentNode.removeChild(this.parentNode);"
        }
      ]
    });
    idrinth.ui.base.appendChild(
      idrinth.ui.buildElement({
        type: "ul",
        children: popupContent,
        css: "idrinth-userinfo-box",
        attributes: [
          {
            name: "style",
            value: idrinth.ui.getElementPositioning(element)
          }
        ]
      })
    );
  },
  /**
     * changes the rank of a person
     * @param {Number} chat
     * @param {String} user
     * @param {String} rank
     * @returns {undefined}
     */
  useroptions: function(chat, user, rank) {
    idrinth.core.ajax.runHome(
      "chat-service/rank/",
      function(reply) {
        try {
          reply = JSON.parse(reply);
          idrinth.core.alert(reply.message);
        } catch (e) {
          idrinth.core.log(e);
        }
      },
      function(reply) {
        idrinth.core.alert(idrinth.text.get("chat.error.modify"));
      },
      function(reply) {
        idrinth.core.alert(idrinth.text.get("chat.error.modify"));
      },
      JSON.stringify({
        chat: chat,
        user: user,
        access: rank
      })
    );
  },
  /**
     * 
     * @param {String} message
     * @param {RegExp} regex
     * @param {Array} callbacks
     * @param {String} lastField
     * @returns {Array}
     */
  replaceInText: function(message, regex, callbacks, lastField) {
    /**
         * 
         * @param {String} message
         * @param {RegExp} regex
         * @param {Array} callbacks
         * @param {String} lastField
         * @returns {Array}
         */
    let complexHandler = function(message, regex, callbacks, lastField) {
      /**
             * 
             * @param {Number} count
             * @param {Array} callbacks
             * @param {String} text
             * @param {Array} textcontent
             * @returns {Array}
             */
      let partHandler = function(count, callbacks, text, textcontent) {
        /**
                 * 
                 * @param {Array} textcontent
                 * @param {Function} func
                 * @param {String} text
                 * @returns {unresolved}
                 */
        let callbackHandler = function(textcontent, func, text) {
          let tmp = func(text);
          for (var c2 = 0; c2 < tmp.length; c2++) {
            if (tmp[c2] !== undefined) {
              textcontent.push(tmp[c2]);
            }
          }
          return textcontent;
        };
        if (count % 2 === 0 && typeof callbacks[1] === "function") {
          textcontent = callbackHandler(
            textcontent,
            callbacks[1],
            text[Math.ceil(count / 2)]
          );
        } else if (
          count % 2 === 0 &&
          text[Math.ceil(count / 2)] !== undefined
        ) {
          textcontent.push({
            type: "#text",
            content: text[Math.ceil(count / 2)]
          });
        } else {
          textcontent.push(callbacks[0](matches[Math.ceil((count - 1) / 2)]));
        }
        return textcontent;
      };
      let matches = message.match(regex);
      let text = message
        .replace(regex, "$1########$" + lastField)
        .split("########");
      let textcontent = [];
      let length =
        (matches && Array.isArray(matches) ? matches.length : 0) +
        (text && Array.isArray(text) ? text.length : 0);
      for (var count = 0; count < length; count++) {
        textcontent = partHandler(count, callbacks, text, textcontent);
      }
      return textcontent;
    };
    /**
         * 
         * @param {String} message
         * @param {Array} callbacks
         * @returns {Array}
         */
    let simpleHandler = function(message, callbacks) {
      if (typeof callbacks[1] === "function") {
        let textcontent = [];
        let tmp = callbacks[1](message);
        for (var c2 = 0; c2 < tmp.length; c2++) {
          textcontent.push(tmp[c2]);
        }
        return textcontent;
      }
      return [
        {
          type: "#text",
          content: message
        }
      ];
    };
    try {
      return complexHandler(message, regex, callbacks, lastField);
    } catch (e) {
      return simpleHandler(message, callbacks);
    }
  },
  /**
     * 
     * @param {String} message
     * @returns {Object}
     */
  buildEmoticons: function(message) {
    if (!idrinth.chat.emotes.lookup) {
      return message;
    }
    let part = idrinth.core.escapeRegExp(
      Object.keys(idrinth.chat.emotes.lookup).join("TTTT")
    );
    let reg = new RegExp("(^| )(" + part.replace(/TTTT/g, "|") + ")($| )", "g");
    return idrinth.chat.replaceInText(
      message,
      reg,
      [
        function(match) {
          let el =
            idrinth.chat.emotes.positions[
              idrinth.chat.emotes.lookup[match.replace(/ /g, "")]
            ];
          return {
            type: "span",
            css: "idrinth-emoticon",
            attributes: [
              {
                name: "style",
                value: "background-position: 0px -" + el / 8 + "px;"
              },
              {
                name: "title",
                value: message
              }
            ],
            children: [
              {
                type: "span",
                attributes: [
                  {
                    name: "style",
                    value: "background-position: 0px -" + el / 2 + "px;"
                  }
                ]
              }
            ]
          };
        }
      ],
      3
    );
  },
  /**
     * 
     * @param {String} message
     * @returns {Object}
     **/
  buildMessageText: function(message) {
    let reg = new RegExp("(^|\\W)(https?://([^/ ]+)(/.*?)?)($| )", "ig");
    return idrinth.chat.replaceInText(
      message,
      reg,
      [
        function(match) {
          return {
            type: "a",
            content: match.match(/:\/\/([^\/]+?)(\/|$)/)[1],
            attributes: [
              {
                name: "href",
                value: match
              },
              {
                name: "title",
                value: "Go to " + match
              },
              {
                name: "target",
                value: "_blank"
              }
            ]
          };
        },
        idrinth.chat.buildEmoticons
      ],
      5
    );
  },
  /**
     * Rank-Classes & Names
     * @type Array
     */
  ranks: ["", "banned", "user", "mod", "owner"],
  /**
     * @type Object
     */
  emotes: {},
  /**
     * 
     * @returns {undefined}
     */
  start: function() {
    /**
         * 
         * @returns {HTMLElement}
         */
    let build = function() {
      /**
             * 
             * @param {String} label
             * @returns {Object}
             */
      let makeInput = function(label) {
        let translation = idrinth.text.get(label);
        return {
          type: "li",
          children: [
            {
              type: "label",
              content: translation === idrinth.text.data.default
                ? label
                : translation
            },
            {
              type: "input",
              attributes: [
                {
                  name: "type",
                  value: "text"
                },
                {
                  name: "onchange",
                  value: "this.setAttribute('value',this.value);"
                }
              ]
            }
          ]
        };
      };
      /**
             * 
             * @param {String} label
             * @param {String} onclick
             * @returns {Object}
             */
      let makeButton = function(label, onclick) {
        let translation = idrinth.text.get(label);
        return {
          type: "li",
          children: [
            {
              type: "button",
              attributes: [
                {
                  name: "type",
                  value: "button"
                },
                {
                  name: "onclick",
                  value: onclick
                }
              ],
              content: translation === idrinth.text.data.default
                ? label
                : translation
            }
          ]
        };
      };
      return idrinth.ui.buildElement({
        id: "idrinth-chat",
        css: "idrinth-hovering-box" +
          (!idrinth.settings.get("chatHiddenOnStart") ? " active" : "") +
          (idrinth.settings.get("moveLeft") ? " left-sided" : ""),
        children: [
          {
            type: "button",
            content: idrinth.settings.get("chatHiddenOnStart") ? "<<" : ">>",
            attributes: [
              {
                name: "onclick",
                value: "idrinth.chat.openCloseChat(this);"
              }
            ]
          },
          {
            type: "ul",
            css: "styles-scrollbar chat-labels",
            children: [
              {
                type: "li",
                css: "active",
                content: "\u2699",
                attributes: [
                  {
                    name: "onclick",
                    value: "idrinth.chat.enableChat(this);"
                  },
                  {
                    name: "data-id",
                    value: "0"
                  }
                ]
              }
            ]
          },
          {
            type: "ul",
            css: "chat-tabs",
            children: [
              {
                type: "li",
                css: "styles-scrollbar active",
                attributes: [
                  {
                    name: "data-id",
                    value: "0"
                  }
                ],
                children: [
                  {
                    type: "h1",
                    content: idrinth.text.get("chat.texts.title")
                  },
                  {
                    type: "p",
                    content: idrinth.text.get("chat.texts.optional")
                  },
                  {
                    id: "idrinth-chat-login",
                    children: [
                      {
                        type: "h2",
                        content: idrinth.text.get("chat.texts.account")
                      },
                      {
                        type: "p",
                        content: idrinth.text.get("chat.texts.invalid")
                      },
                      {
                        type: "ul",
                        css: "settings",
                        children: [
                          makeInput("Username"),
                          makeInput("Password"),
                          makeButton(
                            "chat.texts.offline",
                            "idrinth.chat.login()"
                          )
                        ]
                      }
                    ]
                  },
                  {
                    id: "idrinth-add-chat",
                    children: [
                      {
                        type: "h2",
                        content: idrinth.text.get("chat.actions.joinChat")
                      },
                      {
                        type: "ul",
                        css: "settings",
                        children: [
                          makeInput("Chat-ID"),
                          makeInput("Chat-Password"),
                          makeButton(
                            "chat.actions.createAddChat",
                            "idrinth.chat.add()"
                          )
                        ]
                      }
                    ]
                  },
                  {
                    id: "idrinth-make-chat",
                    children: [
                      {
                        type: "h2",
                        content: idrinth.text.get("chat.actions.createChat")
                      },
                      {
                        type: "ul",
                        css: "settings",
                        children: [
                          makeInput("Name"),
                          makeButton(
                            "chat.actions.createAddChat",
                            "idrinth.chat.create()"
                          )
                        ]
                      }
                    ]
                  },
                  {
                    type: "li",
                    children: [
                      {
                        type: "#text",
                        content: idrinth.text.get("chat.texts.settings")
                      },
                      {
                        type: "a",
                        content: "dotd.idrinth.de/" +
                          idrinth.platform +
                          "/chat/",
                        attributes: [
                          {
                            name: "target",
                            value: "_blank"
                          },
                          {
                            name: "href",
                            value: "https://dotd.idrinth.de/" +
                              idrinth.platform +
                              "/chat/"
                          }
                        ]
                      },
                      {
                        type: "#text",
                        content: "."
                      }
                    ]
                  },
                  {
                    type: "li",
                    children: [
                      {
                        type: "#text",
                        content: idrinth.text.get("chat.texts.creditEmoticon")
                      },
                      {
                        type: "a",
                        content: "emoticonshd.com",
                        attributes: [
                          {
                            name: "target",
                            value: "_blank"
                          },
                          {
                            name: "href",
                            value: "http://emoticonshd.com/"
                          }
                        ]
                      },
                      {
                        type: "#text",
                        content: "."
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });
    };
    if (!idrinth.settings.get("chatting")) {
      return;
    }
    if (!document.getElementById("idrinth-chat")) {
      idrinth.ui.base.appendChild(build());
      idrinth.chat.elements.chats = document
        .getElementById("idrinth-chat")
        .getElementsByTagName("ul")[1];
      idrinth.chat.elements.menu = document
        .getElementById("idrinth-chat")
        .getElementsByTagName("ul")[0];
    }
    idrinth.core.timeouts.add(
      "chat.login",
      function() {
        idrinth.core.ajax.runHome(
          "chat-service/login/",
          idrinth.chat.startLoginCallback,
          function(reply) {},
          function(reply) {
            idrinth.core.timeouts.add("chat.login", idrinth.chat.login, 1);
          },
          JSON.stringify({
            user: idrinth.settings.get("chatuser"),
            pass: idrinth.settings.get("chatpass")
          })
        );
      },
      2500
    );
    idrinth.core.timeouts.add(
      "chat.emoticons",
      function() {
        idrinth.core.ajax.runHome(
          "emoticons/data/",
          function(reply) {
            idrinth.chat.emotes = JSON.parse(reply);
          },
          function(reply) {},
          function(reply) {},
          "",
          true
        );
      },
      1
    );
  },
  /**
     * 
     * @returns {undefined}
     */
  create: function() {
    idrinth.core.ajax.runHome(
      "chat-service/create/",
      idrinth.chat.joinCallback,
      function(reply) {
        idrinth.core.alert(idrinth.text.get("chat.error.create"));
      },
      function(reply) {
        idrinth.core.alert(idrinth.text.get("chat.error.create"));
      },
      document
        .getElementById("idrinth-make-chat")
        .getElementsByTagName("input")[0].value
    );
  },
  /**
     * 
     * @param {String} reply
     * @returns {undefined}
     */
  joinCallback: function(reply) {
    if (!reply) {
      idrinth.core.alert(idrinth.text.get("chat.error.join"));
      return;
    }
    reply = JSON.parse(reply);
    if (!reply) {
      idrinth.core.alert(idrinth.text.get("chat.error.join"));
      return;
    }
    if (!reply.success) {
      if (reply.message) {
        idrinth.core.alert(reply.message);
      } else {
        idrinth.core.alert(idrinth.text.get("chat.error.join"));
      }
      return;
    }
    idrinth.ui.buildChat(
      reply.data.id,
      reply.data.name,
      reply.data.access,
      reply.data.pass
    );
    document.getElementById("idrinth-add-chat").getElementsByTagName("input")[
      0
    ].value =
      "";
    document.getElementById("idrinth-add-chat").getElementsByTagName("input")[
      1
    ].value =
      "";
    document.getElementById("idrinth-make-chat").getElementsByTagName("input")[
      0
    ].value =
      "";
  },
  /**
     * @type {Object}
     */
  users: {},
  /**
     * 
     * @returns {undefined}
     */
  add: function() {
    idrinth.core.ajax.runHome(
      "chat-service/join/",
      idrinth.chat.joinCallback,
      function(reply) {
        idrinth.core.alert(idrinth.text.get("chat.error.join"));
      },
      function(reply) {
        idrinth.core.alert(idrinth.text.get("chat.error.join"));
      },
      JSON.stringify({
        id: document
          .getElementById("idrinth-add-chat")
          .getElementsByTagName("input")[0].value,
        pass: document
          .getElementById("idrinth-add-chat")
          .getElementsByTagName("input")[1].value
      })
    );
  },
  /**
     * 
     * @param {Number} id
     * @returns {undefined}
     */
  send: function(id) {
    idrinth.chat.messages.push({
      chat: id,
      text: document.getElementById("idrinth-chat-input-" + id).value
    });
    document.getElementById("idrinth-chat-input-" + id).value = "";
  },
  /**
     * 
     * @param {Object} list
     * @returns {undefined}
     */
  join: function(list) {
    for (var chatId in list) {
      if (!document.getElementById("idrinth-chat-tab-" + chatId)) {
        idrinth.ui.buildChat(
          chatId,
          list[chatId].name,
          list[chatId].access,
          list[chatId].pass
        );
      }
    }
    idrinth.core.timeouts.add("chat", idrinth.chat.refreshChats, 500);
  },
  /**
     * 
     * @param {String} data
     * @returns {undefined}
     */
  startLoginCallback: function(data) {
    if (!data) {
      return;
    }
    data = JSON.parse(data);
    if (!data || !data.success) {
      return;
    }
    idrinth.ui.removeElement("idrinth-chat-login");
    idrinth.chat.join(data.data);
  },
  /**
     * 
     * @param {String} data
     * @returns {undefined}
     */
  loginCallback: function(data) {
    if (!data) {
      idrinth.core.alert(idrinth.text.get("chat.error.login"));
      return;
    }
    data = JSON.parse(data);
    if (!data) {
      idrinth.core.alert(idrinth.text.get("chat.error.login"));
      return;
    }
    if (!data.success && data.message && data["allow-reg"]) {
      idrinth.core.confirm(
        idrinth.text.get("chat.error.unknown"),
        "idrinth.chat.register();"
      );
      return;
    }
    if (!data.success && data.message) {
      idrinth.core.alert(data.message);
      return;
    }
    if (data.success) {
      let login = document
        .getElementById("idrinth-chat-login")
        .getElementsByTagName("input");
      idrinth.settings.change("chatuser", login[0].value);
      idrinth.settings.change("chatpass", login[1].value);
      idrinth.ui.removeElement("idrinth-chat-login");
      idrinth.chat.join(data.data);
      return;
    }
    idrinth.core.alert(idrinth.text.get("chat.error.login"));
  },
  /**
     * 
     * @returns {undefined}
     */
  register: function() {
    this.loginActions("register");
  },
  /**
     * 
     * @returns {undefined}
     */
  login: function() {
    this.loginActions("login");
  },
  /**
     * 
     * @returns {undefined}
     */
  relogin: function() {
    this.loginActions("relogin");
  },
  /**
     * 
     * @param {Event} event
     * @param {HTMLElement} element
     * @returns {undefined}
     */
  showOptions: function(event, element) {
    event.preventDefault();
    idrinth.ui.base.appendChild(
      idrinth.ui.buildElement({
        type: "ul",
        css: "idrinth-hovering-box hover-over",
        children: [
          {
            css: "clipboard-copy",
            content: idrinth.text.get("chat.actions.copyIdPasswort"),
            type: "li",
            attributes: [
              {
                name: "data-clipboard-text",
                value: element.getAttribute("title")
              }
            ]
          },
          {
            content: idrinth.text.get("chat.actions.leaveRoom"),
            type: "li",
            attributes: [
              {
                name: "onclick",
                value: "idrinth.chat.useroptions(" +
                  element.getAttribute("data-id") +
                  "," +
                  idrinth.chat.self +
                  ",'Leave');this.parentNode.parentNode.removeChild(this.parentNode);"
              }
            ]
          },
          {
            content: idrinth.text.get("chat.actions.deleteRoom"),
            type: "li",
            attributes: [
              {
                name: "onclick",
                value: "idrinth.core.ajax.runHome('chat-service/delete/" +
                  element.getAttribute("data-id") +
                  "/',idrinth.core.alert,idrinth.core.alert,idrinth.core.alert);this.parentNode.parentNode.removeChild(this.parentNode);"
              }
            ]
          },
          {
            type: "li",
            content: idrinth.text.get("chat.actions.close"),
            attributes: [
              {
                name: "onclick",
                value: "this.parentNode.parentNode.removeChild(this.parentNode);"
              }
            ]
          }
        ],
        attributes: [
          {
            name: "style",
            value: idrinth.ui.getElementPositioning(element, 0, 0)
          }
        ]
      })
    );
  },
  /**
     * 
     * @param {HTMLElement} element
     * @returns {undefined}
     */
  enableChat: function(element) {
    let tabs = document.getElementsByClassName("chat-tabs")[0].children,
      labels = document.getElementsByClassName("chat-labels")[0].children;
    for (var counter = 0; counter < labels.length; counter++) {
      let cur = labels[counter].getAttribute("class") + "";
      labels[counter].setAttribute(
        "class",
        cur.replace(/(^|\s)active(\s|$)/, " ")
      );
      tabs[counter].setAttribute("class", "");
      if (
        tabs[counter].getAttribute("data-id") ===
        element.getAttribute("data-id")
      ) {
        tabs[counter].setAttribute("class", "active");
      }
    }
    if (element.hasAttribute("class")) {
      element.setAttribute(
        "class",
        element.getAttribute("class").replace(/(^|\s)new-message(\s|$)/, " ") +
          " active"
      );
    } else {
      element.setAttribute("class", "active");
    }
  },
  /**
     * 
     * @param {HTMLElement} element
     * @returns {undefined}
     */
  openCloseChat: function(element) {
    let chat = element.parentNode;
    if (
      chat.getAttribute("class") === "idrinth-hovering-box active" ||
      chat.getAttribute("class") === "idrinth-hovering-box active left-sided"
    ) {
      chat.setAttribute(
        "class",
        "idrinth-hovering-box" +
          (idrinth.settings.get("moveLeft") ? " left-sided" : "") +
          (chat.getElementsByClassName("new-message") &&
            chat.getElementsByClassName("new-message").length
            ? " new-message"
            : "")
      );
      element.innerHTML = "&lt;&lt;";
    } else {
      chat.setAttribute(
        "class",
        "idrinth-hovering-box active" +
          (idrinth.settings.get("moveLeft") ? " left-sided" : "")
      );
      element.innerHTML = "&gt;&gt;";
    }
  },
  /**
     * 
     * @param {String} key
     * @returns {undefined}
     */
  loginActions: function(key) {
    let chatLogin,
      success,
      urls = {
        register: "chat-service/register/",
        login: "chat-service/login/",
        relogin: "chat-service/login/"
      },
      fail = function() {
        idrinth.core.alert(idrinth.text.get("chat.error.login"));
      },
      timeout = function() {
        idrinth.core.timeouts.add("chat.login", idrinth.chat.login, 1);
      },
      headers = {
        user: "",
        pass: ""
      };

    if (!urls[key]) {
      return;
    }

    if (key === "relogin") {
      success = function() {
        idrinth.core.timeouts.add("chat", idrinth.chat.refreshChats, 1500);
      };
      headers.user = idrinth.settings.get("chatuser");
      headers.pass = idrinth.settings.get("chatpass");
    } else {
      chatLogin = document
        .getElementById("idrinth-chat-login")
        .getElementsByTagName("input");
      headers.user = chatLogin[0].value;
      headers.pass = chatLogin[1].value;
      success = idrinth.chat.loginCallback;
    }
    idrinth.core.ajax.runHome(
      urls[key],
      success,
      fail,
      timeout,
      JSON.stringify(headers)
    );
  }
};
