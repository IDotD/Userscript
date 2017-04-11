idrinth.ui = {
    /**
     *
     * @type HTMLElement
     */
    tooltip: null,
    /**
     *
     * @type HTMLElement
     */
    base: null,
    /**
     *
     * @type HTMLElement
     */
    controls: null,
    /**
     *
     * @param {Number} number
     * @returns {String}
     */
    formatNumber: function ( number ) {
        if ( isNaN ( number ) ) {
            return '';
        }
        var count = 0;
        var post = [ '', 'k', 'm', 'b', 't', 'qa', 'qi', 's' ];
        while ( number > 999 && count < post.length ) {
            number = Math.round ( number / 10 ) / 100;
            count++;
        }
        return number.toString () + post[count];
    },
    /**
     *
     * @param {Number} id
     * @param {string} name
     * @param {string} rank
     * @param {string} pass
     * @returns {undefined}
     */
    buildChat: function ( id, name, rank, pass ) {
        if ( !idrinth.chat.elements.chats ) {
            idrinth.core.timeouts.add ( 'chat-' + id, function () {
                idrinth.ui.buildChat ( id, name, rank, pass );
            }, 500 );
        }
        idrinth.chat.elements.chats.appendChild ( idrinth.ui.buildElement ( {
            type: 'li',
            id: 'idrinth-chat-tab-' + id,
            css: rank.toLowerCase (),
            attributes: [
                {
                    name: 'data-id',
                    value: id
                }
            ],
            children: [
                {
                    type: 'ul',
                    css: "styled-scrollbar users"
                },
                {
                    type: 'ul',
                    css: "styled-scrollbar chat"
                },
                {
                    type: 'input',
                    css: 'add-chat-box',
                    id: "idrinth-chat-input-" + id,
                    attributes: [
                        {
                            name: 'title',
                            value: 'press ENTER or RETURN to send'
                        },
                        {
                            name: 'onkeyup',
                            value: 'if(event.keyCode===13||event.which===13){idrinth.chat.send(' + id + ');}'
                        }
                    ]
                }
            ]
        } ) );
        idrinth.chat.elements.menu.appendChild (
                idrinth.ui.buildElement (
                        {
                            type: 'li',
                            content: name,
                            id: 'idrinth-chat-tab-click-' + id,
                            attributes: [
                                {
                                    name: 'data-id',
                                    value: id
                                },
                                {
                                    name: 'title',
                                    value: name + "\nID:" + id + "\nPassword: " + pass
                                },
                                {
                                    name: 'onclick',
                                    value: 'idrinth.chat.enableChat(this);'
                                },
                                {
                                    name: 'oncontextmenu',
                                    value: 'idrinth.chat.showOptions(event,this);'
                                }
                            ]
                        }
                )
                );
    },
    /**
     *
     * @param {HTMLElement} element
     * @param {Number} offsetX
     * @param {Number} offsetY
     * @returns {String}
     */
    getElementPositioning: function ( element, offsetX, offsetY ) {
        var pos = {
            x: element.getBoundingClientRect ().left + ( offsetX ? offsetX : 0 ),
            y: element.getBoundingClientRect ().top + ( offsetY ? offsetY : 0 )
        };
        return 'position:fixed;left:' + pos.x + 'px;top:' + pos.y + 'px';
    },
    /**
     *
     * @param {object} config
     * @returns {HTMLElement}
     */
    buildElement: function ( config ) {
        /**
         *
         * @param {HTMLElement} el
         * @param {object} config
         * @returns {undefined}
         */
        var setBase = function ( el, config ) {
            if ( config.id ) {
                el.id = config.id;
            }
            if ( config.css ) {
                el.setAttribute ( 'class', config.css );
            }
            if ( config.content ) {
                el.appendChild ( document.createTextNode ( config.content ) );
            }
        };
        /**
         *
         * @param {HTMLElement} el
         * @param {object} config
         * @returns {undefined}
         */
        var addChildren = function ( el, config ) {
            if ( !config.children || !config.children.length ) {
                return;
            }
            for (var count = 0, l = config.children.length; count < l; count++) {
                el.appendChild ( idrinth.ui.buildElement ( config.children[count] ) );
            }
        };
        /**
         *
         * @param {HTMLElement} el
         * @param {object} config
         * @returns {undefined}
         */
        var addAttributes = function ( el, config ) {
            /**
             *
             * @param {HTMLElement} el
             * @param {object} set
             * @returns {undefined}
             */
            var applyValue = function ( el, set ) {
                if ( !set || set.value === undefined ) {
                    return;
                }
                if ( set.name ) {
                    set.names = [ set.name ];
                }
                if ( set.names && Array.isArray ( set.names ) ) {
                    for (var pos = 0; pos < set.names.length; pos++) {
                        el.setAttribute ( set.names[pos], set.value );
                    }
                }
            };
            if ( !config.attributes || !config.attributes.length ) {
                return;
            }
            for (var count = 0, l = config.attributes.length; count < l; count++) {
                applyValue ( el, config.attributes[count] );
            }
        };
        /**
         *
         * @param {object} config
         * @returns {HTMLElement}
         */
        var makeInputLabel = function ( config ) {
            /**
             *
             * @param {String|Number} value
             * @param {Array} list
             * @returns {Boolean}
             */
            var inArray = function ( value, list ) {
                if ( !Array.isArray ( list ) ) {
                    return false;
                }
                if ( typeof list.includes === 'function' ) {
                    return list.includes ( value );
                }
                return list.indexOf ( value ) > -1;
            };
            var input = [ {
                    name: 'type',
                    value: config.type
                } ];
            if ( idrinth.settings.get ( config.name ) && config.type === 'checkbox' ) {
                input.push ( {
                    name: 'checked',
                    value: 'checked'
                } );
            }
            if ( config.type !== 'checkbox' ) {
                input.push ( {
                    name: 'value',
                    value: idrinth.settings.get ( config.name )
                } );
                input.push ( {
                    name: 'onchange',
                    value: 'idrinth.settings.change(\'' + config.name + '\',this.value)'
                } );
            } else {
                input.push ( {
                    name: 'onchange',
                    value: 'idrinth.settings.change(\'' + config.name + '\',this.checked)'
                } );
            }
            var translation = idrinth.text.get ( config.label );
            return idrinth.ui.buildElement ( {
                css: 'idrinth-line' + ( config.platforms && !inArray ( idrinth.platform, config.platforms ) ? ' idrinth-hide' : '' ),
                children: [ {
                        type: 'label',
                        css: 'idrinth-float-half',
                        content: translation === idrinth.text.data.default ? config.label : translation,
                        attributes: [ {
                                name: 'for',
                                value: 'idrinth-' + config.name
                            } ]
                    }, {
                        type: 'input',
                        css: 'idrinth-float-half',
                        id: 'idrinth-' + config.name,
                        attributes: input
                    } ]
            } );
        };
        if ( config.type === '#text' ) {
            return document.createTextNode ( config.content );
        }
        if ( config.rType === '#input' ) {
            return makeInputLabel ( config );
        }
        var el = document.createElement ( config.type ? config.type : 'div' );
        setBase ( el, config );
        addChildren ( el, config );
        addAttributes ( el, config );
        return el;
    },
    /**
     *
     * @param {string} title
     * @param {string|HTMLElement} content
     * @param {string} altFunc
     * @returns {undefined}
     */
    buildModal: function ( title, content, altFunc ) {
        var mod = {
            children: [ ],
            css: 'idrinth-hovering-box idrinth-popup idrinth-' + ( typeof altFunc === 'string' ? 'confim' : 'alert' )
        };
        if ( typeof title === 'string' ) {
            mod.children.push ( {
                content: title,
                css: 'header'
            } );
        } else {
            mod.children.push ( {
                content: 'Title missing',
                css: 'header'
            } );
        }
        if ( typeof content === 'string' ) {
            mod.children.push ( {
                content: content,
                css: 'content'
            } );
        } else if ( typeof content === 'object' && content.type ) {
            mod.children.push ( {
                children: content,
                css: 'content'
            } );
        } else {
            mod.children.push ( {
                children: 'Content missing',
                css: 'content'
            } );
        }
        mod.children.push ( {
            css: 'buttons'
        } );
        /**
         *
         * @param {String} text
         * @param {String} func
         * @returns {object}
         */
        var makeButton = function ( text, func ) {
            return {
                type: 'button',
                content: idrinth.text.get ( "button." + text ),
                attributes: [ {
                        name: 'onclick',
                        value: 'this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);' + func
                    } ]
            };
        };
        if ( typeof altFunc === 'string' ) {
            mod.children[mod.children.length - 1].children = [
                makeButton ( 'ok', altFunc ),
                makeButton ( 'cancel', '' )
            ];
        } else {
            mod.children[mod.children.length - 1].children = [ makeButton ( 'ok', '' ) ];
        }
        idrinth.ui.base.appendChild ( idrinth.ui.buildElement ( mod ) );
    },
    /**
     *
     * @param {HTMLElement} element
     * @param {string} selector
     * @returns {HTMLElement}
     */
    matchesCss: function ( element, selector ) {
        while ( element && element !== document ) {
            if ( typeof element.matches === 'function' && element.matches ( selector ) ) {
                return element;
            }
            element = element.parentNode
        }
    },
    /**
     *
     * @returns {undefined}
     */
    setTooltipTimeout: function () {
        idrinth.core.timeouts.add ( 'names.tooltip', idrinth.ui.hideTooltip, idrinth.settings.get ( "timeout" ) ? idrinth.settings.get ( "timeout" ) : 5000 );
    },
    /**
     *
     * @returns {undefined}
     */
    hideTooltip: function () {
        if ( idrinth.names.isHovering ) {
            return idrinth.ui.setTooltipTimeout ();
        }
        idrinth.ui.updateClassesList ( idrinth.ui.tooltip, [ 'idrinth-hide' ], [ ] );
    },
    /**
     *
     * @returns {undefined}
     */
    openCloseSettings: function () {
        var toRemove = [ ( idrinth.ui.controls.getAttribute ( 'class' ) ).match ( /(^|\s)inactive($|\s)/ ) ? 'inactive' : 'active' ];
        if ( !idrinth.settings.get ( "moveLeft" ) ) {
            toRemove.push ( 'left-sided' );
        }
        if ( !idrinth.settings.get ( "minimalist" ) ) {
            toRemove.push ( 'small' );
        }
        idrinth.ui.updateClassesList ( idrinth.ui.controls, [ 'active', 'inactive', 'left-sided', 'small' ], toRemove );
    },
    /**
     *
     * @param {HTMLElement} element
     * @param {String} cssClass
     * @returns {Boolean}
     */
    childOf: function ( element, cssClass ) {
        do {
            if ( element.className && element.className.match ( new RegExp ( '(^|\s)' + cssClass + '(\s|$)' ) ) ) {
                return true;
            }
            if ( !element.parentNode || element === idrinth.ui.base ) {
                return false;
            }
            element = element.parentNode;
        } while ( element );
        return false;
    },
    /**
     *
     * @param {string} id
     * @returns {undefined}
     */
    removeElement: function ( id ) {
        var el = document.getElementById ( id );
        if ( el ) {
            el.parentNode.removeChild ( el );
        }
    },
    /**
     *
     * @param {HTMLElement} element
     * @param {Array|String} add
     * @param {Array|String} remove
     * @returns {undefined}
     */
    updateClassesList: function ( element, add, remove ) {
        /**
         *
         * @param {String} classString
         * @param {Array|String} add
         * @param {Array|String} remove
         * @returns {unresolved}
         */
        var getClassesList = function ( classString, add, remove ) {
            /**
             *
             * @param {String|Array} value
             * @returns {Array}
             */
            var forceToArray = function ( value ) {
                return value && typeof value === 'object' && Array.isArray ( value ) && value !== null ? value : [ ];
            };
            var original = classString === null ? [ ] : classString.split ( ' ' ).concat ( forceToArray ( add ) );
            var list = [ ];
            remove = forceToArray ( remove );
            /**
             *
             * @param {Array} list
             * @param {string} element
             * @param {Array} forbidden
             * @returns {unresolved}
             */
            var addUnique = function ( list, element, forbidden ) {
                if ( list.indexOf ( element ) === -1 && forbidden.indexOf ( element ) === -1 ) {
                    list.push ( element );
                }
                return list;
            };
            for (var counter = 0; counter < original.length; counter++) {
                list = addUnique ( list, original[counter], remove );
            }
            return list.join ( ' ' );
        };
        element.setAttribute ( 'class', getClassesList ( element.getAttribute ( 'class' ), add, remove ) );
    },
    /**
     *
     * @param {String} name
     * @returns {undefined}
     */
    activateTab: function ( name ) {
        var head = document.getElementById ( 'tab-activator-' + name ).parentNode.childNodes;
        var body = document.getElementById ( 'tab-element-' + name ).parentNode.childNodes;
        /**
         *
         * @param {HTMLElement} head
         * @param {HTMLElement} body
         * @param {string} name
         * @returns {undefined}
         */
        var setClasses = function ( head, body, name ) {
            if ( head === document.getElementById ( 'tab-activator-' + name ) ) {
                idrinth.ui.updateClassesList ( head, [ 'active' ], [ ] );
                idrinth.ui.updateClassesList ( body, [ ], [ 'idrinth-hide' ] );
                return;
            }
            idrinth.ui.updateClassesList ( head, [ ], [ 'active' ] );
            idrinth.ui.updateClassesList ( body, [ 'idrinth-hide' ], [ ] );
        };
        for (var count = 0; count < head.length; count++) {
            setClasses ( head[count], body[count], name );
        }
    },
    /**
     * initializes the gui
     * @returns {undefined}
     */
    start: function () {
        /**
         * builds most of the gui
         * @returns {undefined}
         */
        var build = function () {
            /**
             *
             * @returns {Array}
             */
            var wrapper = function () {
                /**
                 * creates the action tab
                 * @returns {Array}
                 */
                var buildActions = function () {
                    /**
                     *
                     * @param {string} label
                     * @param {string} onclick
                     * @param {string} platform
                     * @returns {object}
                     */
                    var buttonMaker = function ( label, onclick, platform ) {
                        return {
                            css: 'idrinth-float-half' + ( platform && platform !== idrinth.platform ? " idrinth-hide" : "" ),
                            type: 'button',
                            content: label,
                            attributes: [ {
                                    name: 'type',
                                    value: 'button'
                                }, {
                                    name: 'onclick',
                                    value: onclick
                                } ]
                        };
                    };
                    return [ {
                            children: [
                                buttonMaker ( idrinth.text.get ( "raids.imports.manually" ), 'idrinth.raids.import(\'\');' ),
                                buttonMaker ( idrinth.text.get ( "raids.imports.favs" ), 'idrinth.raids.import(idrinth.settings.get("favs"));' ),
                                buttonMaker ( idrinth.text.get ( "button.reloadGame" ), 'idrinth.inframe.send(\'reload\',\'dotd\');' ),
                                buttonMaker ( idrinth.text.get ( "button.reloadChat" ), 'idrinth.inframe.send(\'reload\',\'chatclient\');' ),
                                buttonMaker ( idrinth.text.get ( "raids.clear" ), 'idrinth.raids.clearAll();' ),
                                buttonMaker ( idrinth.text.get ( "button.reloadScript" ), 'idrinth.reload();' ),
                                buttonMaker ( idrinth.text.get ( "raids.imports.restart" ), 'idrinth.raids.start();' ),
                                buttonMaker ( idrinth.text.get ( "button.ngRaidJoin" ), 'idrinth.newgrounds.joinRaids()', 'newgrounds' ),
                                buttonMaker ( idrinth.settings.get ( "alarmActive" ) ? idrinth.text.get ( "button.disableTimedAutoJoin" ) : idrinth.text.get ( "button.enableTimedAutoJoin" ),
                                        'idrinth.settings.change(\'alarmActive\',!idrinth.settings.get("alarmActive"));this.innerHTML=idrinth.settings.get("alarmActive") ? idrinth.text.get ( "button.disableTimedAutoJoin" ):"button.enableTimedAutoJoin"', 'newgrounds' )
                            ]
                        }, {
                            css: 'idrinth-line',
                            id: 'idrinth-joined-raids',
                            content: idrinth.text.get ( "raids.lastJoined" ),
                            children: [
                                {
                                    type: 'ul'
                                }
                            ]
                        }
                    ];
                };
                /**
                 *
                 * @returns {Array}
                 */
                var buildTiers = function () {
                    /**
                     *
                     * @param {string} label
                     * @returns {object}
                     */
                    var makeSearch = function ( label ) {
                        return {
                            type: 'input',
                            css: 'idrinth-float-half',
                            id: 'idrinth-tierlist-' + label + 'search',
                            attributes: [
                                {
                                    names: [ 'onblur', 'onchange', 'onkeyup' ],
                                    value: 'idrinth.tier.getMatchingTiers();'
                                },
                                {
                                    names: [ 'placeholder', 'title' ],
                                    value: idrinth.text.get ( "tier." + label )
                                }
                            ]
                        };
                    };
                    return [ {
                            css: 'idrinth-line',
                            children: [ {
                                    type: 'label',
                                    content: idrinth.text.get ( "tier.search" ),
                                    css: 'idrinth-line',
                                    attributes: [
                                        {
                                            name: 'for',
                                            value: 'idrinth-tierlist-bosssearch'
                                        }
                                    ]
                                },
                                makeSearch ( 'name' ),
                                makeSearch ( 'type' )
                            ]
                        }, {
                            id: 'idrinth-tierlist'
                        } ];
                };
                /**
                 *
                 * @returns {Array}
                 */
                var buildControls = function () {
                    /**
                     *
                     * @param {Array} list
                     * @param {String} header
                     * @returns {object}
                     */
                    var wrap = function ( list, header ) {
                        return {
                            children: [
                                {
                                    type: 'strong',
                                    content: idrinth.text.get ( "ui.wrap." + header )
                                },
                                {
                                    children: list
                                }
                            ],
                            css: 'idrinth-openclick'
                        };
                    };
                    /**
                     *
                     * @param {HTMLElement} element
                     * @returns {undefined}
                     */
                    var openCloseSwitch = function ( element ) {
                        var isActive = ( element.parentElement.getAttribute ( 'class' ) ).match ( /(^|\s)active($|\s)/ );
                        idrinth.ui.updateClassesList ( element.parentElement, isActive ? [ ] : [ 'active' ], isActive ? [ 'active' ] : [ ] );
                    };
                    idrinth.core.multibind.add ( 'click', '.idrinth-openclick > strong', openCloseSwitch );
                    return [
                        wrap ( [ {
                                name: 'lang',
                                rType: '#input',
                                type: 'text',
                                label: "setting.lang"
                            }, {
                                name: 'minimalist',
                                rType: '#input',
                                type: 'checkbox',
                                label: "setting.minimLayout"
                            }, {
                                name: 'moveLeft',
                                rType: '#input',
                                type: 'checkbox',
                                label: "setting.moveSettingLeft"
                            }, {
                                name: 'warBottom',
                                rType: '#input',
                                type: 'checkbox',
                                label: "setting.warBottomPage"
                            } ], 'general' ),
                        wrap ( [ {
                                name: 'names',
                                rType: '#input',
                                type: 'checkbox',
                                platforms: [ 'kongregate' ],
                                label: "setting.enableExtCharInfo"
                            }, {
                                name: 'timeout',
                                rType: '#input',
                                type: 'number',
                                platforms: [ 'kongregate' ],
                                label: "setting.extCharInfoDuration"
                            } ], 'names' ),
                        wrap ( [ {
                                name: 'landMax',
                                rType: '#input',
                                type: 'checkbox',
                                label: "setting.useGoldEfficiently"
                            }, {
                                name: 'factor',
                                rType: '#input',
                                type: 'checkbox',
                                label: "setting.tenBuildOnce"
                            } ], 'landbuy' ),
                        wrap ( [ {
                                name: 'raids',
                                rType: '#input',
                                type: 'checkbox',
                                label: "setting.enableFavRequest"
                            }, {
                                name: 'raidWhitelist',
                                rType: '#input',
                                type: 'checkbox',
                                label: "setting.raidWhitelist"
                            }, {
                                name: 'favs',
                                rType: '#input',
                                type: 'text',
                                label: "setting.favIdToJoin"
                            }, {
                                name: 'isWorldServer',
                                rType: '#input',
                                type: 'checkbox',
                                label: "setting.worldserver"
                            }, {
                                name: 'raid#requestPrivate',
                                rType: '#input',
                                type: 'checkbox',
                                label: "setting.raid.requestPrivate"
                            }, {
                                name: 'raid#joinPrivate',
                                rType: '#input',
                                type: 'checkbox',
                                label: "setting.raid.joinPrivate"
                            }, {
                                name: 'newgroundLoad',
                                rType: '#input',
                                type: 'number',
                                platforms: [ 'newgrounds' ],
                                label: "setting.joiningDuration"
                            }, {
                                name: 'alarmTime',
                                rType: '#input',
                                type: 'text',
                                platforms: [ 'newgrounds' ],
                                label: "ui.timeAutoJoin"
                            } ], 'raidjoining' ),
                        wrap ( [ {
                                name: 'chatting',
                                rType: '#input',
                                type: 'checkbox',
                                label: "setting.enableChat"
                            }, {
                                name: 'notification#mention',
                                rType: '#input',
                                type: 'checkbox',
                                label: 'chat.notification.mention'
                            }, {
                                name: 'notification#raid',
                                rType: '#input',
                                type: 'checkbox',
                                label: 'chat.notification.raid'
                            }, {
                                name: 'notification#message',
                                rType: '#input',
                                type: 'checkbox',
                                label: 'chat.notification.message'
                            }, {
                                name: 'notification#content',
                                rType: '#input',
                                type: 'checkbox',
                                label: 'chat.notification.content'
                            }, {
                                name: 'notification#image',
                                rType: '#input',
                                type: 'checkbox',
                                label: 'chat.notification.image'
                            } ], 'chat' ),
                        {
                            css: 'idrinth-line',
                            type: 'p',
                            children: [ {
                                    type: '#text',
                                    content: idrinth.text.get ( "ui.getFavFrom" )
                                }, {
                                    type: 'a',
                                    attributes: [ {
                                            name: 'href',
                                            value: 'https://dotd.idrinth.de/' + idrinth.platform + '/'
                                        }, {
                                            name: 'target',
                                            value: '_blank'
                                        } ],
                                    content: idrinth.text.get ( "ui.raidsearch" )
                                } ]
                        } ];
                };
                /**
                 *
                 * @returns {Array}
                 */
                var buildLand = function () {
                    /**
                     *
                     * @param {string} label
                     * @returns {object}
                     */
                    var buildItem = function ( label ) {
                        return {
                            type: 'tr',
                            children: [ {
                                    type: 'th',
                                    content: idrinth.text.get ( "land." + label )
                                }, {
                                    type: 'td',
                                    children: [ {
                                            type: 'input',
                                            id: 'idrinth-land-' + label.toLowerCase (),
                                            attributes: [
                                                {
                                                    name: 'value',
                                                    value: idrinth.settings.get ( "land#" + label.toLowerCase () )
                                                },
                                                {
                                                    name: 'type',
                                                    value: 'number'
                                                }
                                            ]
                                        } ]
                                }, {
                                    type: 'td',
                                    content: '-'
                                } ],
                            attributes: [
                                {
                                    name: 'title',
                                    value: idrinth.land.data[label.toLowerCase ()].perHour + idrinth.text.get ( "land.hour" )
                                }
                            ]
                        };
                    };
                    return [ {
                            type: 'table',
                            id: 'idrinth-land-buy-table',
                            children: [
                                buildItem ( 'Cornfield' ),
                                buildItem ( 'Stable' ),
                                buildItem ( 'Barn' ),
                                buildItem ( 'Store' ),
                                buildItem ( 'Pub' ),
                                buildItem ( 'Inn' ),
                                buildItem ( 'Tower' ),
                                buildItem ( 'Fort' ),
                                buildItem ( 'Castle' ),
                                {
                                    type: 'tr',
                                    children: [ {
                                            type: 'td'
                                        }, {
                                            type: 'td'
                                        }, {
                                            type: 'td'
                                        } ]
                                },
                                {
                                    type: 'tr',
                                    children: [ {
                                            type: 'th',
                                            content: idrinth.text.get ( "land.available" )
                                        }, {
                                            type: 'td',
                                            children: [ {
                                                    type: 'input',
                                                    id: 'idrinth-land-gold',
                                                    attributes: [
                                                        {
                                                            name: 'value',
                                                            value: idrinth.settings.get ( "land#gold" )
                                                        },
                                                        {
                                                            name: 'type',
                                                            value: 'number'
                                                        }
                                                    ]
                                                } ]
                                        }, {
                                            type: 'td',
                                            children: [ {
                                                    type: 'button',
                                                    content: idrinth.text.get ( "land.calc" ),
                                                    attributes: [
                                                        {
                                                            name: 'onclick',
                                                            value: 'idrinth.land.calculate();'
                                                        },
                                                        {
                                                            name: 'type',
                                                            value: 'button'
                                                        }
                                                    ]
                                                } ]
                                        } ]
                                }
                            ]
                        } ];
                };
                /**
                 *
                 * @returns {Array}
                 */
                var buildStats = function () {
                    /**
                     *
                     * @param {string} label
                     * @returns {object}
                     */
                    var buildItem = function ( label ) {
                        var isCheck = label === 'mirele' || label === 'kraken' || label === 'utym';
                        return {
                            type: 'tr',
                            children: [ {
                                    type: 'th',
                                    content: idrinth.text.get ( "stats." + label )
                                }, {
                                    type: 'td',
                                    children: [ {
                                            type: 'input',
                                            id: 'idrinth-stats-' + label,
                                            attributes: [
                                                {
                                                    name: isCheck ? 'checked' : 'value',
                                                    value: idrinth.settings.get ( "stats#" + label )
                                                },
                                                {
                                                    name: 'type',
                                                    value: isCheck ? 'checkbox' : 'number'
                                                },
                                                {
                                                    names: [ 'onchange', 'onblur' ],
                                                    value: 'idrinth.settings.change(\'stats#' + label + '\',' + ( isCheck ? 'this.checked' : 'Number.parseInt ( this.value, 10 )' ) + ')'
                                                }
                                            ]
                                        } ]
                                }, {
                                    type: 'td',
                                    content: '-'
                                } ]
                        };
                    };
                    return [ {
                            type: 'table',
                            id: 'idrinth-stat-buy-table',
                            children: [
                                buildItem ( 'stats' ),
                                buildItem ( 'perception' ),
                                buildItem ( 'attack' ),
                                buildItem ( 'defense' ),
                                buildItem ( 'mirele' ),
                                buildItem ( 'utym' ),
                                buildItem ( 'kraken' ),
                                buildItem ( 'level' ),
                                buildItem ( 'mount' ),
                                buildItem ( 'critchance' ),
                                {
                                    type: 'tr',
                                    children: [ {
                                            type: 'td'
                                        }, {
                                            type: 'td'
                                        }, {
                                            type: 'td'
                                        } ]
                                },
                                {
                                    type: 'tr',
                                    children: [ {
                                            type: 'th'
                                        }, {
                                            type: 'td'
                                        }, {
                                            type: 'td',
                                            children: [ {
                                                    type: 'button',
                                                    content: idrinth.text.get ( "land.calc" ),
                                                    attributes: [
                                                        {
                                                            name: 'onclick',
                                                            value: 'idrinth.stats.calculate();'
                                                        },
                                                        {
                                                            name: 'type',
                                                            value: 'button'
                                                        }
                                                    ]
                                                } ]
                                        } ]
                                }
                            ]
                        } ];
                };
                /**
                 *
                 * @param {object} config
                 * @returns {Array}
                 */
                var makeTabs = function ( config ) {
                    var head = [ ];
                    var first = true;
                    var body = [ ];
                    /**
                     *
                     * @param {string} name
                     * @param {Number} width
                     * @param {Boolean} first
                     * @returns {object}
                     */
                    var buildHead = function ( name, width, first ) {
                        return {
                            type: 'li',
                            content: idrinth.text.get ( "ui.tabs." + name ),
                            css: 'tab-activator' + ( first ? ' active' : '' ),
                            id: 'tab-activator-' + name.toLowerCase (),
                            attributes: [
                                {
                                    name: 'onclick',
                                    value: 'idrinth.ui.activateTab(\'' + name.toLowerCase () + '\');'
                                },
                                {
                                    name: 'style',
                                    value: 'width:' + width + '%;'
                                }
                            ]
                        };
                    };
                    /**
                     *
                     * @param {string} name
                     * @param {Array} children
                     * @param {Boolean} first
                     * @returns {object}
                     */
                    var buildBody = function ( name, children, first ) {
                        return {
                            type: 'li',
                            css: 'tab-element' + ( first ? '' : ' idrinth-hide' ),
                            id: 'tab-element-' + name.toLowerCase (),
                            children: children
                        };
                    };
                    var width = Math.floor ( 100 / ( Object.keys ( config ) ).length );
                    for (var name in config) {
                        if ( typeof name === 'string' ) {
                            head.push ( buildHead ( name, width, first ) );
                            body.push ( buildBody ( name, config[name], first ) );
                            first = false;
                        }
                    }
                    return [
                        {
                            type: 'ul',
                            children: head,
                            css: 'idrinth-ui-menu'
                        },
                        {
                            type: 'ul',
                            children: body,
                            css: 'idrinth-ui-menu',
                            attributes: [ {
                                    name: 'style',
                                    value: 'max-height: 500px;overflow-y: scroll;'
                                } ]
                        }
                    ];
                };
                /**
                 *
                 * @returns {Array}
                 */
                var buildRaidJoinList = function () {
                    return [ {
                            content: idrinth.text.get ( "raids.clickCopy" ),
                            type: 'strong'
                        }, {
                            id: 'idrinth-raid-link-list'
                        }, {
                            content: idrinth.text.get ( "raids.disableSpecific" ),
                            type: 'strong'
                        }, {
                            id: 'idrinth-raid-may-join-list'
                        } ];
                };
                return makeTabs ( {
                    'Actions': buildActions (),
                    'Raids': buildRaidJoinList (),
                    'Settings': buildControls (),
                    'Tiers': buildTiers (),
                    'Land': buildLand (),
                    'Stats': buildStats ()
                } );
            };
            var children = wrapper ();
            children.unshift ( {
                css: 'idrinth-line',
                type: 'strong',
                children: [
                    {
                        type: 'span',
                        content: 'Idrinth\'s'
                    },
                    {
                        type: 'span',
                        content: ' DotD Script v' + idrinth.version
                    }
                ],
                attributes: [ {
                        name: 'title',
                        value: 'Click to open/close'
                    }, {
                        name: 'onclick',
                        value: 'idrinth.ui.openCloseSettings();'
                    }, {
                        name: 'style',
                        value: 'display:block;cursor:pointer;'
                    } ]
            } );
            idrinth.ui.controls = idrinth.ui.buildElement ( {
                css: 'idrinth-hovering-box idrinth-controls-overwrite inactive' + ( idrinth.settings.get ( "moveLeft" ) ? ' left-sided' : '' ) + ( idrinth.settings.get ( "minimalist" ) ? ' small' : '' ),
                id: 'idrinth-controls',
                children: children
            } );
            idrinth.ui.base.appendChild ( idrinth.ui.controls );
            document.getElementById ( 'idrinth-favs' ).setAttribute ( 'onkeyup', 'idrinth.ui.replaceInValue(this);' );
        };
        idrinth.ui.base = document.createElement ( 'div' );
        idrinth.ui.base.setAttribute ( 'id', 'idotd-base' );
        document.getElementsByTagName ( 'body' )[0].appendChild ( idrinth.ui.base );
        document.getElementsByTagName ( 'head' )[0].appendChild ( idrinth.ui.buildElement ( {
            type: 'link',
            attributes: [ {
                    name: 'rel',
                    value: 'stylesheet'
                }, {
                    name: 'href',
                    value: 'https://dotd.idrinth.de/static/userscript-styles/###RELOAD-VERSION###/'
                } ]
        } ) );
        build ();
    },
    /**
     * 
     * @param {HTMLElement} element
     * @returns {undefined}
     */
    replaceInValue: function ( element ) {
        var pos = element.selectionStart;
        var part = element.value.substr ( 0, pos + 1 );
        var pre = part.length;
        part = part.replace ( /[^a-f0-9,]/g, '' );
        part = part.replace ( /,{2,}/g, ',' );
        pos = pos + part.length - pre;
        element.value = element.value.replace ( /[^a-f0-9,]/g, '' );
        element.value = element.value.replace ( /,{2,}/g, ',' );
        pos = Math.min ( pos, element.value.length );
        pos = Math.max ( pos, 0 );
        element.setSelectionRange ( pos, pos );
    }
};