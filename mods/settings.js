idrinth.settings = {
    raids: false,
    favs: '',
    factor: true,
    moveLeft: false,
    minimalist: false,
    chatHiddenOnStart: true,
    names: true,
    timeout: 5000,
    loadtime: 5000,
    windows: 3,
    warBottom: false,
    landMax: true,
    chatting: true,
    chatuser: '',
    newgroundLoad: 30,
    chatpass: '',
    isWorldServer: false,
    alarmTime: '8:0',
    alarmActive: false,
    land: {
        cornfield: 0,
        stable: 0,
        barn: 0,
        store: 0,
        pub: 0,
        inn: 0,
        tower: 0,
        fort: 0,
        castle: 0,
        gold: 0
    },
    save: function ( ) {
        'use strict';
        if ( window.localStorage ) {
            for (var key in idrinth.settings) {
                if ( key !== 'land' && typeof idrinth.settings[key] !== 'function' ) {
                    window.localStorage.setItem ( 'idrinth-dotd-' + key, idrinth.settings[key] );
                }
            }
            for (var building in idrinth.settings.land) {
                if ( typeof idrinth.settings[key] !== 'function' ) {
                    window.localStorage.setItem ( 'idrinth-dotd-land-' + building, idrinth.settings.land[building] );
                }
            }
        }
    },
    change: function ( field, value ) {
        'use strict';
        idrinth.settings[field] = value;
        idrinth.settings.save ( );
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
                                buttonMaker ( 'Import all manually', 'idrinth.raids.import(\'\');' ),
                                buttonMaker ( 'Import favs manually', 'idrinth.raids.import(idrinth.settings.favs);' ),
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
        if ( window.localStorage ) {
            var itemHandler = function ( prefix, key, item ) {
                if ( typeof item !== 'function' ) {
                    var tmp = window.localStorage.getItem ( 'idrinth-dotd-' + prefix + key );
                    if ( tmp ) {
                        if ( tmp === 'false' ) {
                            tmp = false;
                        } else if ( tmp === 'true' ) {
                            tmp = true;
                        }
                        item = tmp;
                    }
                }
                return item;
            };
            for (var key in idrinth.settings) {
                if ( key !== 'land' ) {
                    idrinth.settings[key] = itemHandler ( '', key, idrinth.settings[key] );
                }
            }
            for (var building in idrinth.settings.land) {
                idrinth.settings.land[building] = itemHandler ( 'land-', building, idrinth.settings.land[building] );
            }
        }
        build ( );
    }
};