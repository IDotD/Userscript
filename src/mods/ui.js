idrinth.ui = {
    tooltip: null,
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
    buildChat: function ( id, name, rank, pass ) {
        if ( !idrinth.chat.elements.chats ) {
            window.setTimeout ( function () {
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
    getElementPositioning: function ( element, offsetX, offsetY ) {
        var pos = {
            x: element.getBoundingClientRect ().left + ( offsetX ? offsetX : 0 ),
            y: element.getBoundingClientRect ().top + ( offsetY ? offsetY : 0 )
        };
        return 'position:fixed;left:' + pos.x + 'px;top:' + pos.y + 'px';
    },
    buildElement: function ( config ) {
        'use strict';
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
        var addChildren = function ( el, config ) {
            if ( !config.children || !config.children.length ) {
                return;
            }
            for (var count = 0, l = config.children.length; count < l; count++) {
                el.appendChild ( idrinth.ui.buildElement ( config.children[count] ) );
            }
        };
        var addAttributes = function ( el, config ) {
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
        var makeInputLabel = function ( config ) {
            'use strict';
            var inArray = function ( value, list ) {
                'use strict';
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
    controls: null,
    tooltipTO: null,
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
        var makeButton = function ( text, func ) {
            return {
                type: 'button',
                content: idrinth.text.get ( "ui.button." + text ),
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
        idrinth.ui.body.appendChild ( idrinth.ui.buildElement ( mod ) );
    },
    showTooltip: function ( element ) {
        'use strict';
        function tooltip ( set, element, world ) {
            if ( !set ) {
                idrinth.ui.updateClassesList ( element, [ 'idrinth-hide' ], [ ] );
                return;
            }
            var baseUrl = 'https://dotd.idrinth.de/' + ( world ? 'world-kongregate' : 'kongregate' );
            idrinth.ui.updateClassesList ( idrinth.ui.tooltip, [ ], [ 'idrinth-hide' ] );
            idrinth.ui.updateClassesList ( element, [ ], [ 'idrinth-hide' ] );
            element.childNodes[0].setAttribute ( 'href', baseUrl + '/summoner/' + set.id + '/' );
            element.childNodes[0].innerHTML = set.name;
            element.childNodes[1].childNodes[1].innerHTML = set.level + ' (' + set['7day'] + '/week, ' + set['30day'] + '/month)';
            element.childNodes[1].childNodes[3].innerHTML = idrinth.names.classes[set.class];
            element.childNodes[2].childNodes[1].setAttribute ( 'href', baseUrl + '/guild/' + set.guildId + '/' );
            element.childNodes[2].childNodes[1].innerHTML = idrinth.names.guilds[world ? 'world' : 'kongregate'][set.guildId];
            element.childNodes[3].childNodes[1].innerHTML = set.updated;
            element.childNodes[3].setAttribute ( 'style', ( new Date () ) - ( new Date ( set.updated ) ) > 86400000 ? 'color:#aa0000;' : '' );
        }
        idrinth.names.isHovering = false;
        var name = idrinth.names.parse ( element ).toLowerCase ( );
        if ( idrinth.settings.names && idrinth.ui.tooltip && idrinth.names.users[name] ) {
            window.clearTimeout ( idrinth.ui.tooltipTO );
            idrinth.ui.tooltip.setAttribute ( 'style', idrinth.ui.getElementPositioning ( element, -200, -100 ) );
            tooltip ( idrinth.names.users[name].kongregate, idrinth.ui.tooltip.firstChild, false );
            tooltip ( idrinth.names.users[name].world, idrinth.ui.tooltip.lastChild, true );
            idrinth.ui.setTooltipTimeout ();
        }
    },
    matchesCss: function ( element, selector ) {
        while ( element && element !== document ) {
            if ( typeof element.matches === 'function' && element.matches ( selector ) ) {
                return element;
            }
            element = element.parentNode
        }
    },
    setTooltipTimeout: function () {
        idrinth.ui.tooltipTO = window.setTimeout ( idrinth.ui.hideTooltip, idrinth.settings.timeout ? idrinth.settings.timeout : 5000 );
    },
    hideTooltip: function () {
        if ( idrinth.names.isHovering ) {
            return idrinth.ui.setTooltipTimeout ();
        }
        idrinth.ui.updateClassesList ( idrinth.ui.tooltip, [ 'idrinth-hide' ], [ ] );
    },
    openCloseSettings: function ( ) {
        'use strict';
        var toRemove = [ ( idrinth.ui.controls.getAttribute ( 'class' ) ).match ( /(^|\s)inactive($|\s)/ ) ? 'inactive' : 'active' ];
        if ( !idrinth.settings.moveLeft ) {
            toRemove.push ( 'left-sided' );
        }
        if ( !idrinth.settings.minimalist ) {
            toRemove.push ( 'small' );
        }
        idrinth.ui.updateClassesList ( idrinth.ui.controls, [ 'active', 'inactive', 'left-sided', 'small' ], toRemove );
    },
    childOf: function ( element, cssClass ) {
        'use strict';
        do {
            if ( element.className.match ( new RegExp ( '(^|\s)' + cssClass + '(\s|$)' ) ) ) {
                return true;
            }
            if ( !element.parentNode || element === document.getElementsByTagName ( 'body' )[0] ) {
                return false;
            }
            element = element.parentNode;
        } while ( element );
        return false;
    },
    removeElement: function ( id ) {
        'use strict';
        var el = document.getElementById ( id );
        if ( el ) {
            el.parentNode.removeChild ( el );
        }
    },
    reloadGame: function ( ) {
        'use strict';
        var handleFrame = function ( parent ) {
            var frame = parent.getElementsByTagName ( 'iframe' )[0];
            var src = ( frame.getAttribute ( 'src' ) ).replace ( /&ir=.*/, '' );
            frame.setAttribute ( 'src', src + ( src.indexOf ( '?' ) > -1 ? '&' : '?' ) + 'ir=' + Math.random () );
        };
        try {
            if ( idrinth.platform === 'kongregate' ) {
                window.activateGame ( );
            } else if ( idrinth.platform === 'facebook'/*'dawnofthedragons'*/ ) {
                handleFrame ( document );
            } else if ( idrinth.platform === 'newgrounds' ) {
                handleFrame ( document.getElementById ( 'iframe_embed' ) );
            } else if ( idrinth.platform === 'armorgames' ) {
                handleFrame ( document.getElementById ( 'gamefilearea' ) );
            }
        } catch ( e ) {
            idrinth.core.alert ( idrinth.text.get ( "ui.reloadGameFail" ) );
        }
    },
    updateClassesList: function ( element, add, remove ) {
        var getClassesList = function ( classString, add, remove ) {
            var forceToArray = function ( value ) {
                return value && typeof value === 'object' && Array.isArray ( value ) && value !== null ? value : [ ];
            };
            var original = classString === null ? [ ] : classString.split ( ' ' ).concat ( forceToArray ( add ) );
            var list = [ ];
            remove = forceToArray ( remove );
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
    activateTab: function ( name ) {
        var head = document.getElementById ( 'tab-activator-' + name ).parentNode.childNodes;
        var body = document.getElementById ( 'tab-element-' + name ).parentNode.childNodes;
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
    start: function ( ) {
        'use strict';
        var build = function () {
            'use strict';
            var wrapper = function ( ) {
                var buildActions = function () {
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
                                buttonMaker ( idrinth.text.get ( "ui.imports.manually" ), 'idrinth.raids.import(\'\');' ),
                                buttonMaker ( idrinth.text.get ( "ui.imports.favs" ), 'idrinth.raids.import(idrinth.settings.favs);' ),
                                buttonMaker ( idrinth.text.get ( "ui.button.reloadGame" ), 'idrinth.ui.reloadGame();' ),
                                buttonMaker ( idrinth.text.get ( "ui.button.clearRaids" ), 'idrinth.raids.clearAll();' ),
                                buttonMaker ( idrinth.text.get ( "ui.button.reloadScript" ), 'idrinth.reload();' ),
                                buttonMaker ( idrinth.text.get ( "ui.imports.restart" ), 'idrinth.raids.restartInterval();' ),
                                buttonMaker ( idrinth.text.get ( "ui.button.refreshFBGameLogin" ), 'idrinth.facebook.rejoin()', 'facebook' ),
                                buttonMaker ( idrinth.text.get ( "ui.button.ngRaidJoin" ), 'idrinth.newgrounds.joinRaids()', 'newgrounds' ),
                                buttonMaker ( idrinth.settings.alarmActive ? idrinth.text.get ( "ui.button.disableTimedAutoJoin" ) : idrinth.text.get ( "ui.button.enableTimedAutoJoin" ), 'idrinth.settings.change(\'alarmActive\',!idrinth.settings.alarmActive);this.innerHTML=idrinth.settings.alarmActive?\'disable timed Autojoin\':\'enable timed Autojoin\'', 'newgrounds' )
                            ]
                        }, {
                            css: 'idrinth-line',
                            id: 'idrinth-joined-raids',
                            content: idrinth.text.get ( "ui.lastRaidsJoined" ),
                            children: [
                                {
                                    type: 'ul'
                                }
                            ]
                        }
                    ];
                };
                var buildTiers = function () {
                    return [ {
                            css: 'idrinth-line',
                            children: [ {
                                    type: 'label',
                                    content: idrinth.text.get ( "ui.enterBossName" ),
                                    css: 'idrinth-float-half',
                                    attributes: [
                                        {
                                            name: 'for',
                                            value: 'idrinth-tierlist-bosssearch'
                                        }
                                    ]
                                }, {
                                    type: 'input',
                                    css: 'idrinth-float-half',
                                    id: 'idrinth-tierlist-bosssearch',
                                    attributes: [
                                        {
                                            names: [ 'onblur', 'onchange', 'onkeyup' ],
                                            value: 'idrinth.tier.getTierForName(this.value);'
                                        }
                                    ]
                                } ]
                        }, {
                            id: 'idrinth-tierlist'
                        } ];
                };
                var buildControls = function () {
                    'use strict';
                    return [ {
                            name: 'names',
                            rType: '#input',
                            type: 'checkbox',
                            platforms: [ 'kongregate' ],
                            label: "ui.setting.enableExtCharInfo"
                        }, {
                            name: 'minimalist',
                            rType: '#input',
                            type: 'checkbox',
                            label: "ui.setting.minimLayout"
                        }, {
                            name: 'moveLeft',
                            rType: '#input',
                            type: 'checkbox',
                            label: "ui.setting.moveSettingLeft"
                        }, {
                            name: 'warBottom',
                            rType: '#input',
                            type: 'checkbox',
                            label: "ui.setting.warBottomPage"
                        }, {
                            name: 'landMax',
                            rType: '#input',
                            type: 'checkbox',
                            label: "ui.setting.useGoldEfficiently"
                        }, {
                            name: 'factor',
                            rType: '#input',
                            type: 'checkbox',
                            label: "ui.setting.tenBuildOnce"
                        }, {
                            name: 'timeout',
                            rType: '#input',
                            type: 'number',
                            platforms: [ 'kongregate' ],
                            label: "ui.setting.extCharInfoDuration"
                        }, {
                            name: 'newgroundLoad',
                            rType: '#input',
                            type: 'number',
                            platforms: [ 'newgrounds' ],
                            label: "ui.setting.joiningDuration"
                        }, {
                            name: 'chatting',
                            rType: '#input',
                            type: 'checkbox',
                            label: "ui.setting.enableChat"
                        }, {
                            css: 'idrinth-line',
                            type: 'span',
                            content: "ui.settingInfo"
                        }, {
                            name: 'raids',
                            rType: '#input',
                            type: 'checkbox',
                            label: "ui.setting.enableFavRequest"
                        }, {
                            name: 'favs',
                            rType: '#input',
                            type: 'text',
                            label: "ui.setting.favIdToJoin"
                        }, {
                            name: 'isWorldServer',
                            rType: '#input',
                            type: 'checkbox',
                            label: "ui.setting.worldserver"
                        }, {
                            name: 'notification#mention',
                            rType: '#input',
                            type: 'checkbox',
                            label: 'chat.notification.mentionNotis'
                        }, {
                            name: 'notification#raid',
                            rType: '#input',
                            type: 'checkbox',
                            label: 'chat.notification.raidNotis'
                        }, {
                            name: 'notification#message',
                            rType: '#input',
                            type: 'checkbox',
                            label: 'chat.notification.messageNotis'
                        }, {
                            name: 'windows',
                            rType: '#input',
                            type: 'number',
                            platforms: [ 'dawnofthedragons', 'facebook' ],
                            label: "ui.maxPopupsFrame"
                        }, {
                            name: 'alarmTime',
                            rType: '#input',
                            type: 'text',
                            platforms: [ 'newgrounds' ],
                            label: "ui.timeAutoJoin"
                        }, {
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
                var buildLand = function () {
                    var buildItem = function ( label ) {
                        return {
                            type: 'tr',
                            children: [ {
                                    type: 'th',
                                    content: label
                                }, {
                                    type: 'td',
                                    children: [ {
                                            type: 'input',
                                            id: 'idrinth-land-' + label.toLowerCase (),
                                            attributes: [
                                                {
                                                    name: 'value',
                                                    value: idrinth.settings.land[label.toLowerCase ()]
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
                                    value: idrinth.land.data[label.toLowerCase ()].perHour + idrinth.text.get ( "ui.goldHour" )
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
                                            content: idrinth.text.get ( "ui.availGold" )
                                        }, {
                                            type: 'td',
                                            children: [ {
                                                    type: 'input',
                                                    id: 'idrinth-land-gold',
                                                    attributes: [
                                                        {
                                                            name: 'value',
                                                            value: idrinth.settings.land.gold
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
                                                    content: idrinth.text.get ( "ui.button.calc" ),
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
                var makeTabs = function ( config ) {
                    var head = [ ];
                    var first = true;
                    var body = [ ];
                    var buildHead = function ( name, width, first ) {
                        return {
                            type: 'li',
                            content: name,
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
                var buildRaidJoinList = function () {
                    return [ {
                            content: idrinth.text.get ( "ui.clickCopy" ),
                            type: 'strong'
                        }, {
                            id: 'idrinth-raid-link-list'
                        }, {
                            content: idrinth.text.get ( "ui.setting.disableAutoJoinSpecific" ),
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
                    'Land': buildLand ()
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
                css: 'idrinth-hovering-box idrinth-controls-overwrite inactive' + ( idrinth.settings.moveLeft ? ' left-sided' : '' ) + ( idrinth.settings.minimalist ? ' small' : '' ),
                id: 'idrinth-controls',
                children: children
            } );
            idrinth.ui.body.appendChild ( idrinth.ui.controls );
            document.getElementById ( 'idrinth-favs' ).setAttribute ( 'onkeyup', 'this.value=this.value.replace(/[^a-f0-9,]/g,\'\')' );
        };
        idrinth.ui.body = document.getElementsByTagName ( 'body' )[0];
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
    }
};
