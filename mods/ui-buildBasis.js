idrinth.ui.buildBasis = {
    'do': function () {
        var wrapper = function ( ) {
            var buildActions = function () {
                var buttonMaker = function ( label, onclick, platform ) {
                    return {
                        css: 'idrinth-float-half',
                        type: 'button',
                        content: label,
                        attributes: [ {
                                name: 'type',
                                value: 'button'
                            }, {
                                name: 'style',
                                value: platform && platform !== idrinth.platform ? "display:none" : ""
                            }, {
                                name: 'onclick',
                                value: onclick
                            } ]
                    };
                };
                return [ {
                        children: [
                            buttonMaker ( 'Import all manually', 'idrinth.raids.importManually(true);' ),
                            buttonMaker ( 'Import favs manually', 'idrinth.raids.importManually(false);' ),
                            buttonMaker ( 'Reload game', 'idrinth.ui.reloadGame();' ),
                            buttonMaker ( 'Clear Raids', 'idrinth.raids.clearAll();' ),
                            buttonMaker ( 'Reload Script', 'idrinth.reload();' ),
                            buttonMaker ( 'Restart Raidjoin', 'idrinth.raids.restartInterval();' ),
                            buttonMaker ( 'Refresh Facebook Game Login', 'idrinth.facebook.rejoin()', 'facebook' ),
                            buttonMaker ( 'NG Raid Join(slow!)', 'idrinth.newgrounds.joinRaids()', 'newgrounds' ),
                            buttonMaker ( idrinth.settings.alarmActive ? 'disable timed Autojoin' : 'enable timed Autojoin', 'idrinth.settings.change(\'alarmActive\',!idrinth.settings.alarmActive);this.innerHTML=idrinth.settings.alarmActive?\'disable timed Autojoin\':\'enable timed Autojoin\'', 'newgrounds' )
                        ]
                    }, {
                        css: 'idrinth-line',
                        id: 'idrinth-joined-raids',
                        content: 'Last raids joined:',
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
                                content: 'Enter Boss\' Name',
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
                                        name: 'onkeyup',
                                        value: 'idrinth.tier.getTierForName(this.value);'
                                    },
                                    {
                                        name: 'onchange',
                                        value: 'idrinth.tier.getTierForName(this.value);'
                                    },
                                    {
                                        name: 'onblur',
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
                        label: 'Enable extended Characterinformation?'
                    }, {
                        name: 'minimalist',
                        rType: '#input',
                        type: 'checkbox',
                        label: 'Minimalist Layout'
                    }, {
                        name: 'moveLeft',
                        rType: '#input',
                        type: 'checkbox',
                        label: 'Move settings left'
                    }, {
                        name: 'warBottom',
                        rType: '#input',
                        type: 'checkbox',
                        label: 'Show war at the bottom of the page'
                    }, {
                        name: 'landMax',
                        rType: '#input',
                        type: 'checkbox',
                        label: 'Check to try and use up the gold as efficient as possible - uncheck to only use the most efficient buy in the land buy calculator'
                    }, {
                        name: 'factor',
                        rType: '#input',
                        type: 'checkbox',
                        label: 'Buy 10 Buildings at once?(Rec)'
                    }, {
                        name: 'timeout',
                        rType: '#input',
                        type: 'number',
                        platforms: [ 'kongregate' ],
                        label: 'Milliseconds until the extended Characterinformation disappears'
                    }, {
                        name: 'newgroundLoad',
                        rType: '#input',
                        type: 'number',
                        platforms: [ 'newgrounds' ],
                        label: 'Seconds needed to load the game for joining'
                    }, {
                        name: 'chatting',
                        rType: '#input',
                        type: 'checkbox',
                        label: 'Enable chat(needs script reload)'
                    }, {
                        css: 'idrinth-line',
                        type: 'span',
                        content: 'This script will always import the raids you manually set to be imported on the website and if it\'s enabled it will also import all raids matched by one of the faved searches provided.'
                    }, {
                        name: 'raids',
                        rType: '#input',
                        type: 'checkbox',
                        label: 'Enable Auto-Raid-Request for Favorites?'
                    }, {
                        name: 'favs',
                        rType: '#input',
                        type: 'text',
                        label: 'FavoriteIds to join (separate multiple by comma)'
                    }, {
                        name: 'isWorldServer',
                        rType: '#input',
                        type: 'checkbox',
                        label: 'Worldserver?'
                    }, {
                        name: 'windows',
                        rType: '#input',
                        type: 'number',
                        platforms: [ 'dawnofthedragons' ],
                        label: 'Maximum Popups/Frames for joining raids'
                    }, {
                        name: 'alarmTime',
                        rType: '#input',
                        type: 'text',
                        platforms: [ 'newgrounds' ],
                        label: 'Time to automatically join raids slowly(reloads game multiple times). Format is [Hours]:[Minutes] without leading zeros, so 7:1 is fine, 07:01 is not'
                    }, {
                        css: 'idrinth-line',
                        type: 'p',
                        children: [ {
                                type: '#text',
                                content: 'Get your search-favorites from '
                            }, {
                                type: 'a',
                                attributes: [ {
                                        name: 'href',
                                        value: 'https://dotd.idrinth.de/' + idrinth.platform + '/'
                                    }, {
                                        name: 'target',
                                        value: '_blank'
                                    } ],
                                content: 'Idrinth\'s Raidsearch'
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
                                value: idrinth.land.data[label.toLowerCase ()].perHour + ' gold per hour each'
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
                                        content: 'Avaible Gold'
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
                                                content: 'Calculate',
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
                        css: 'tab-element',
                        id: 'tab-element-' + name.toLowerCase (),
                        attributes: [
                            {
                                name: 'style',
                                value: first ? 'display:block;' : 'display:none;'
                            }
                        ],
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
                        attributes: [ {
                                name: 'style',
                                value: 'margin:0;padding:0;overflow:hidden;width:100%;'
                            } ]
                    },
                    {
                        type: 'ul',
                        children: body,
                        attributes: [ {
                                name: 'style',
                                value: 'margin:0;padding:0;overflow-x:hidden;width:100%;max-height: 500px;overflow-y: scroll;'
                            } ]
                    }
                ];
            };
            var buildRaidJoinList = function () {
                return [ {
                        content: 'click to copy raid link',
                        type: 'strong'
                    }, {
                        id: 'idrinth-raid-link-list'
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
        'use strict';
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
        if ( idrinth.settings.chatting ) {
            idrinth.ui.body.appendChild ( idrinth.ui.buildBasis.buildChat () );
            idrinth.chat.elements.chats = document.getElementById ( 'idrinth-chat' ).getElementsByTagName ( 'ul' )[1];
            idrinth.chat.elements.menu = document.getElementById ( 'idrinth-chat' ).getElementsByTagName ( 'ul' )[0];
        }
        document.getElementById ( 'idrinth-favs' ).setAttribute ( 'onkeyup', 'this.value=this.value.replace(/[^a-f0-9,]/g,\'\')' );
    },
    buildChat: function () {
        return idrinth.ui.buildElement ( {
            id: 'idrinth-chat',
            css: 'idrinth-hovering-box' + ( !idrinth.settings.chatHiddenOnStart ? ' active' : '' ) + ( idrinth.settings.moveLeft ? ' left-sided' : '' ),
            children: [
                {
                    type: 'button',
                    content: ( idrinth.settings.chatHiddenOnStart ? '<<' : '>>' ),
                    attributes: [ {
                            name: 'onclick',
                            value: 'idrinth.chat.openCloseChat(this);'
                        } ]
                }, {
                    type: 'ul',
                    css: 'styles-scrollbar chat-labels',
                    children: [ {
                            type: 'li',
                            css: 'active',
                            content: "\u2699",
                            attributes: [
                                {
                                    name: 'onclick',
                                    value: 'idrinth.chat.enableChat(this);'
                                },
                                {
                                    name: 'data-id',
                                    value: '0'
                                }
                            ]
                        } ]
                }, {
                    type: 'ul',
                    css: 'chat-tabs',
                    children: [ {
                            type: 'li',
                            css: 'styles-scrollbar active',
                            attributes: [
                                {
                                    name: 'data-id',
                                    value: '0'
                                }
                            ],
                            children: [
                                {
                                    type: 'h1',
                                    content: 'Chat'
                                },
                                {
                                    type: 'p',
                                    content: 'This part of the script is optional, so logging in is unneeded for raid catching etc.'
                                }, {
                                    id: 'idrinth-chat-login',
                                    children: [
                                        {
                                            type: 'h2',
                                            content: 'Account'
                                        },
                                        {
                                            type: 'p',
                                            content: 'This should not be the data for logging in on the related gaming site and the login does not need to match your ingame name - you can set a display name after the registration.'
                                        },
                                        {
                                            type: 'ul',
                                            css: 'settings',
                                            children: [
                                                {
                                                    type: 'li',
                                                    children: [
                                                        {
                                                            type: 'label',
                                                            content: 'Username'
                                                        },
                                                        {
                                                            type: 'input',
                                                            attributes: [
                                                                {
                                                                    name: 'type',
                                                                    value: 'text'
                                                                },
                                                                {
                                                                    name: 'onchange',
                                                                    value: 'this.setAttribute(\'value\',this.value);'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: 'li',
                                                    children: [
                                                        {
                                                            type: 'label',
                                                            content: 'Password'
                                                        },
                                                        {
                                                            type: 'input',
                                                            attributes: [
                                                                {
                                                                    name: 'type',
                                                                    value: 'text'
                                                                },
                                                                {
                                                                    name: 'onchange',
                                                                    value: 'this.setAttribute(\'value\',this.value);'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: 'li',
                                                    children: [
                                                        {
                                                            type: 'button',
                                                            attributes: [
                                                                {
                                                                    name: 'type',
                                                                    value: 'button'
                                                                },
                                                                {
                                                                    name: 'onclick',
                                                                    value: 'idrinth.chat.login()'
                                                                }
                                                            ],
                                                            content: 'Not logged in, click to login/register'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    id: 'idrinth-add-chat',
                                    children: [
                                        {
                                            type: 'h2',
                                            content: 'Join Chat'
                                        },
                                        {
                                            type: 'ul',
                                            css: 'settings',
                                            children: [
                                                {
                                                    type: 'li',
                                                    children: [
                                                        {
                                                            type: 'label',
                                                            content: 'Chat-ID'
                                                        },
                                                        {
                                                            type: 'input',
                                                            attributes: [
                                                                {
                                                                    name: 'type',
                                                                    value: 'text'
                                                                },
                                                                {
                                                                    name: 'onchange',
                                                                    value: 'this.setAttribute(\'value\',this.value);'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: 'li',
                                                    children: [
                                                        {
                                                            type: 'label',
                                                            content: 'Chat-Password'
                                                        },
                                                        {
                                                            type: 'input',
                                                            attributes: [
                                                                {
                                                                    name: 'type',
                                                                    value: 'text'
                                                                },
                                                                {
                                                                    name: 'onchange',
                                                                    value: 'this.setAttribute(\'value\',this.value);'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: 'li',
                                                    children: [
                                                        {
                                                            type: 'button',
                                                            attributes: [
                                                                {
                                                                    name: 'type',
                                                                    value: 'button'
                                                                },
                                                                {
                                                                    name: 'onclick',
                                                                    value: 'idrinth.chat.add()'
                                                                }
                                                            ],
                                                            content: 'Click to Join additional chat'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    id: 'idrinth-make-chat',
                                    children: [
                                        {
                                            type: 'h2',
                                            content: 'Create Chat'
                                        },
                                        {
                                            type: 'ul',
                                            css: 'settings',
                                            children: [
                                                {
                                                    type: 'li',
                                                    children: [
                                                        {
                                                            type: 'label',
                                                            content: 'Name'
                                                        },
                                                        {
                                                            type: 'input',
                                                            attributes: [
                                                                {
                                                                    name: 'type',
                                                                    value: 'text'
                                                                },
                                                                {
                                                                    name: 'onchange',
                                                                    value: 'this.setAttribute(\'value\',this.value);'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: 'li',
                                                    children: [
                                                        {
                                                            type: 'button',
                                                            attributes: [
                                                                {
                                                                    name: 'type',
                                                                    value: 'button'
                                                                },
                                                                {
                                                                    name: 'onclick',
                                                                    value: 'idrinth.chat.create()'
                                                                }
                                                            ],
                                                            content: 'Click to Create additional chat'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }, {
                                    type: 'li',
                                    children: [
                                        {
                                            type: '#text',
                                            content: 'More settings at '
                                        },
                                        {
                                            type: 'a',
                                            content: 'dotd.idrinth.de/' + idrinth.platform + '/chat/',
                                            attributes: [
                                                {
                                                    name: 'target',
                                                    value: '_blank'
                                                },
                                                {
                                                    name: 'href',
                                                    value: 'https://dotd.idrinth.de/' + idrinth.platform + '/chat/'
                                                }
                                            ]
                                        },
                                        {
                                            type: '#text',
                                            content: '.'
                                        }
                                    ]
                                }, {
                                    type: 'li',
                                    children: [
                                        {
                                            type: '#text',
                                            content: 'Emoticons provided by '
                                        },
                                        {
                                            type: 'a',
                                            content: 'emoticonshd.com',
                                            attributes: [
                                                {
                                                    name: 'target',
                                                    value: '_blank'
                                                },
                                                {
                                                    name: 'href',
                                                    value: 'http://emoticonshd.com/'
                                                }
                                            ]
                                        },
                                        {
                                            type: '#text',
                                            content: '.'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        } );
    },
    war: function () {
        return idrinth.ui.buildElement (
                {
                    id: 'idrinth-war',
                    css: 'idrinth-central-box idrinth-hovering-box',
                    children: [
                        {
                            children: [
                                {
                                    type: 'span',
                                    content: 'current WAR'
                                },
                                {
                                    type: 'span',
                                    attributes: [
                                        {
                                            name: 'style',
                                            value: 'padding:0.2em;width:1em;height:1em;float:right;cursor:pointer;background:#000;color:#fff;border-radius:50%;'
                                        },
                                        {
                                            name: 'onclick',
                                            value: 'idrinth.war.oc();'
                                        }
                                    ],
                                    content: '\u2195'
                                }
                            ]
                        },
                        {
                            type: 'table',
                            children: [
                                {
                                    type: 'thead',
                                    children: [
                                        {
                                            type: 'tr',
                                            children: [
                                                {
                                                    type: 'th',
                                                    content: 'summon?'
                                                },
                                                {
                                                    type: 'th',
                                                    content: 'raid'
                                                },
                                                {
                                                    type: 'th',
                                                    content: 'join'
                                                },
                                                {
                                                    type: 'th',
                                                    content: 'magic2use'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'tbody'
                                }
                            ]
                        }
                    ]
                }
        );
    },
    buildTooltip: function ( ) {
        'use strict';
        function getServerPart ( name ) {
            return [ {
                    css: 'idrinth-line idrinth-tooltip-header',
                    type: 'a',
                    attributes: [ {
                            name: 'href',
                            value: '#'
                        }, {
                            name: 'target',
                            value: '_blank'
                        }, {
                            name: 'title',
                            value: 'go to summoner details'
                        } ]
                }, {
                    css: 'idrinth-line idrinth-tooltip-level',
                    type: 'span',
                    children: [ {
                            type: '#text',
                            content: 'Level '
                        }, {
                            css: 'idrinth-format-number idrinth-format-level',
                            type: 'span',
                            content: '0'
                        }, {
                            type: '#text',
                            content: ' '
                        }, {
                            css: 'idrinth-format-class',
                            type: 'span',
                            content: 'Unknown'
                        } ]
                }, {
                    css: 'idrinth-line idrinth-tooltip-guild',
                    type: 'span',
                    children: [ {
                            type: '#text',
                            content: 'of '
                        }, {
                            css: 'idrinth-format-guild',
                            type: 'a',
                            attributes: [ {
                                    name: 'href',
                                    'value': '#'
                                }, {
                                    name: 'title',
                                    value: 'go to guild details'
                                }, {
                                    name: 'target',
                                    value: '_blank'
                                } ]
                        } ]
                }, {
                    css: 'idrinth-line idrinth-tooltip-update',
                    type: 'span',
                    children: [ {
                            type: '#text',
                            content: 'Updated '
                        }, {
                            css: 'idrinth-format-date',
                            type: 'span',
                            content: 'Unknown'
                        } ]
                }, {
                    type: 'span',
                    content: 'Server: ' + name
                } ];
        }
        idrinth.ui.tooltip = idrinth.ui.buildElement ( {
            css: 'idrinth-hovering-box idrinth-tooltip-overwrite',
            id: 'idrinth-tooltip',
            children: [
                {
                    children: getServerPart ( 'Kongregate' )
                },
                {
                    children: getServerPart ( 'World' )
                }
            ],
            attributes: [
                {
                    name: 'onmouseenter',
                    value: 'idrinth.names.isHovering=true;'
                },
                {
                    name: 'onmouseleave',
                    value: 'idrinth.names.isHovering=false;'
                }
            ]
        } );
        idrinth.ui.body.appendChild ( idrinth.ui.tooltip );
    }
};
