var idrinth = {
    ajax: [ ],
    version: '###VERSION###',
    getfullDateInt: function () {
        function addZero ( x, n ) {
            while ( x.toString ().length < n ) {
                x = "0" + x;
            }
            return x;
        }
        var d = new Date ();
        return addZero ( d.getFullYear (), 2 ) +
                addZero ( d.getMonth (), 2 ) +
                addZero ( d.getDate (), 2 ) +
                addZero ( d.getHours (), 2 ) +
                addZero ( d.getMinutes (), 2 ) +
                addZero ( d.getSeconds (), 2 ) +
                addZero ( d.getMilliseconds (), 3 );
    },
    escapeRegExp: function ( str ) {
        return str.replace ( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&" );
    },
    facebook: {
        popup: null,
        timeout: null,
        restart: function () {
            try {
                window.clearTimeout ( idrinth.facebook.timeout );
                idrinth.facebook.popup.close ();
                idrinth.ui.reloadGame ();
                idrinth.raids.clearAll ();
            } catch ( e ) {
                idrinth.log ( e );
            }
        },
        rejoin: function () {
            try {
                window.clearInterval ( idrinth.raids.interval );
            } catch ( e ) {
                idrinth.log(e);
            }
            idrinth.facebook.popup = window.open ( "https://apps.facebook.com/dawnofthedragons/" );
            idrinth.facebook.popup.onload = function () {
                window.clearTimeout ( idrinth.facebook.timeout );
                idrinth.facebook.timeout = window.setTimeout ( function () {
                    idrinth.facebook.restart ();
                }, 3333 );
            };
            idrinth.facebook.timeout = window.setTimeout ( function () {
                idrinth.facebook.restart ();
            }, 11111 );
        }
    },
    newgrounds: {
        originalUrl: '',
        raids: [ ],
        joinRaids: function () {
            for (var key in idrinth.raids.list) {
                if(idrinth.raids.list[key].hash&&idrinth.raids.list[key].raidId) {
                    idrinth.newgrounds.raids.push ( key );
                }
            }
            idrinth.newgrounds.join ();
        },
        alarmCheck: function () {
            var now = new Date ();
            if ( idrinth.settings.alarmActive && now.getHours () + ':' + now.getMinutes () === idrinth.settings.alarmTime ) {
                window.setTimeout ( idrinth.newgrounds.joinRaids, 1 );
            }
            window.setTimeout ( idrinth.newgrounds.alarmCheck, 60000 );
        },
        join: function () {
            if ( idrinth.newgrounds.raids.length === 0 ) {
                idrinth.alert ( 'We\'re done! Have fun playing.' );
                return;
            }
            var frame = document.getElementById ( 'iframe_embed' ).getElementsByTagName ( 'iframe' )[0];
            var key = idrinth.newgrounds.raids.pop ();
            var link = idrinth.newgrounds.originalUrl + '&' + ( idrinth.raids.join.servers.getServerLink ( key ) ).replace ( /^.*?\?/, '' );
            frame.setAttribute ( 'onload', 'idrinth.newgrounds.remove(\'' + key + '\')' );
            frame.setAttribute ( 'src', link );
        },
        remove: function ( key ) {
            window.setTimeout (
                    function () {
                        try {
                            idrinth.raids.list[key].joined = true;
                        } catch ( e ) {
                            try {
                                idrinth.raids.joined[key].joined = true;
                            } catch ( f ) {
                                idrinth.log ( "We seem to have joined a dead raid" );
                            }
                        }
                        if ( document.getElementById ( 'idrinth-raid-link-' + key ) ) {
                            idrinth.ui.removeElement ( 'idrinth-raid-link-' + key );
                        }
                        try {
                            idrinth.raids.joined[key] = idrinth.raids.list[key];
                        } catch ( e2 ) {
                            //lost?
                        }
                        try {
                            delete idrinth.raids.list[key];
                        } catch ( e3 ) {
                            //already gone, nothing to do
                        }
                        idrinth.raids.join.messages.trying ( key );
                        idrinth.newgrounds.join ();
                    },
                    idrinth.settings.newgroundLoad * 1000 );
        }
    },
    reload: function () {
        idrinth.ui.removeElement ( 'idrinth-controls' );
        idrinth.ui.removeElement ( 'idrinth-chat' );
        idrinth.ui.removeElement ( 'idrinth-war' );
        var sc = document.createElement ( 'script' );
        sc.setAttribute ( 'src', 'https://dotd.idrinth.de/static/userscript/' + Math.random () + '/' );
        document.getElementsByTagName ( 'body' )[0].appendChild ( sc );
        window.setTimeout ( function () {
            idrinth = { };
        }, 1 );
    },
    inArray: function ( value, list ) {
        'use strict';
        if ( !Array.isArray ( list ) ) {
            return false;
        }
        var c = 0;
        if ( typeof list.includes === 'function' ) {
            return list.includes ( value );
        }
        for (c = 0; c < list.length; c++) {
            if ( list[c] === value ) {
                return true;
            }
        }
        return false;
    },
    runAjax: function ( url, success, failure, timeout, additionalHeader ) {
        'use strict';
        var pos = idrinth.ajax.length;
        idrinth.ajax[pos] = new XMLHttpRequest ( );
        idrinth.ajax[pos]._remove = function ( request ) {
            var position = idrinth.ajax.indexOf ( request );
            if ( position > -1 ) {
                idrinth.ajax.splice ( position, 1 );
            }
        };
        idrinth.ajax[pos].onreadystatechange = function ( event ) {
            var request = ( event || window.event ).target;
            var call = function ( func, value ) {
                if ( typeof func !== 'function' ) {
                    return;
                }
                try {
                    return func ( value );
                } catch ( e ) {
                    return null;
                }
            };
            if ( request.readyState === 4 ) {
                var status = ( request.status > 199 && request.status < 300 ) || request.status === 0;
                call ( status ? success : failure, status ? request.responseText : request );
                request._remove ( request );
            }
        };
        idrinth.ajax[pos].timeout = 30000;
        idrinth.ajax[pos].ontimeout = function ( event ) {
            var request = ( event || window.event ).target;
            timeout.bind ( request );
            request._remove ( request );
        };
        idrinth.ajax[pos].onerror = function ( event ) {
            var request = ( event || window.event ).target;
            request._remove ( request );
        };
        idrinth.ajax[pos].onabort = function ( event ) {
            var request = ( event || window.event ).target;
            request._remove ( request );
        };
        idrinth.ajax[pos]._url = url;
        idrinth.ajax[pos].open ( "GET", url, true );
        if ( url.match ( '/dotd\.idrinth\.de/' ) ) {
            if ( additionalHeader ) {
                idrinth.ajax[pos].setRequestHeader ( "Idrinth-Addition", additionalHeader );
            }
            idrinth.ajax[pos].withCredentials = true;
        }
        idrinth.ajax[pos].send ( );
    },
    platform: '',
    realSite: '',
    log: function ( string ) {
        'use strict';
        console.log ( '[IDotDS] ' + string );
    },
    ui: {
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
                    { name: 'data-id', value: id }
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
                            { name: 'title', value: 'press ENTER or RETURN to send' },
                            { name: 'onkeyup', value: 'if(event.keyCode===13||event.which===13){idrinth.chat.send(' + id + ');}' }
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
                                    { name: 'data-id', value: id },
                                    { name: 'title', value: name + "\nID:" + id + "\nPassword: " + pass },
                                    { name: 'onclick', value: 'idrinth.chat.enableChat(this);' }
                                ]
                            }
                    )
                    );
        },
        buildBasis: {
            makeTabs: function ( config ) {
                var head = [ ];
                var first = true;
                var body = [ ];
                var buildHead=function(name,width,first) {
                    return {
                        type: 'li',
                        content: name,
                        css: 'tab-activator' + ( first ? ' active' : '' ),
                        id: 'tab-activator-' + name.toLowerCase (),
                        attributes: [
                            { name: 'onclick', value: 'idrinth.ui.activateTab(\'' + name.toLowerCase () + '\');' },
                            { name: 'style', value: 'width:' + width + '%;' }
                        ]
                    };
                };
                var buildBody=function(name,children,first){
                    return {
                        type: 'li',
                        css: 'tab-element',
                        id: 'tab-element-' + name.toLowerCase (),
                        attributes: [
                            { name: 'style', value: first ? 'display:block;' : 'display:none;' }
                        ],
                        children: children
                    };
                };
                var width=Math.floor ( 100 / ( Object.keys ( config ) ).length );
                for (var name in config) {
                    if(typeof name === 'string') {
                        head.push ( buildHead(name,width,first) );
                        body.push ( buildBody(name,config[name],first) );
                        first = false;
                    }
                }
                return [
                    { type: 'ul', children: head, attributes: [ { name: 'style', value: 'margin:0;padding:0;overflow:hidden;width:100%;' } ] },
                    { type: 'ul', children: body, attributes: [ { name: 'style', value: 'margin:0;padding:0;overflow-x:hidden;width:100%;max-height: 500px;overflow-y: scroll;' } ] }
                ];
            },
            wrapper: function ( ) {
                return idrinth.ui.buildBasis.makeTabs ( {
                    'Actions': idrinth.ui.buildBasis.buildActions (),
                    'Raids': idrinth.ui.buildBasis.buildRaidJoinList (),
                    'Settings': idrinth.ui.buildBasis.buildControls (),
                    'Tiers': idrinth.ui.buildBasis.buildTiers (),
                    'Land': idrinth.ui.buildBasis.buildLand ()
                } );
            },
            'do': function () {
                'use strict';
                var children = idrinth.ui.buildBasis.wrapper ();
                children.unshift ( {
                    css: 'idrinth-line',
                    type: 'strong',
                    children: [
                        { type: 'span', content: 'Idrinth\'s' },
                        { type: 'span', content: ' DotD Script v' + idrinth.version }
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
                    type: 'div',
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
            buildLandItem: function ( label ) {
                return { type: 'tr', children: [ {
                            type: 'th',
                            content: label
                        }, {
                            type: 'td',
                            children: [ {
                                    type: 'input',
                                    id: 'idrinth-land-' + label.toLowerCase (),
                                    attributes: [
                                        { name: 'value', value: idrinth.settings.land[label.toLowerCase ()] },
                                        { name: 'type', value: 'number' }
                                    ]
                                } ]
                        }, {
                            type: 'td',
                            content: '-'
                        } ], attributes: [
                        { name: 'title', value: idrinth.land.data[label.toLowerCase ()].perHour + ' gold per hour each' }
                    ] };
            },
            buildLand: function () {
                return [ { type: 'table', id: 'idrinth-land-buy-table', children: [
                            idrinth.ui.buildBasis.buildLandItem ( 'Cornfield' ),
                            idrinth.ui.buildBasis.buildLandItem ( 'Stable' ),
                            idrinth.ui.buildBasis.buildLandItem ( 'Barn' ),
                            idrinth.ui.buildBasis.buildLandItem ( 'Store' ),
                            idrinth.ui.buildBasis.buildLandItem ( 'Pub' ),
                            idrinth.ui.buildBasis.buildLandItem ( 'Inn' ),
                            idrinth.ui.buildBasis.buildLandItem ( 'Tower' ),
                            idrinth.ui.buildBasis.buildLandItem ( 'Fort' ),
                            idrinth.ui.buildBasis.buildLandItem ( 'Castle' ),
                            { type: 'tr', children: [ { type: 'td' }, { type: 'td' }, { type: 'td' } ] },
                            { type: 'tr', children: [ {
                                        type: 'th',
                                        content: 'Avaible Gold'
                                    }, {
                                        type: 'td',
                                        children: [ {
                                                type: 'input',
                                                id: 'idrinth-land-gold',
                                                attributes: [
                                                    { name: 'value', value: idrinth.settings.land.gold },
                                                    { name: 'type', value: 'number' }
                                                ]
                                            } ]
                                    }, {
                                        type: 'td',
                                        children: [ {
                                                type: 'button',
                                                content: 'Calculate',
                                                attributes: [
                                                    { name: 'onclick', value: 'idrinth.land.calculate();' },
                                                    { name: 'type', value: 'button' }
                                                ]
                                            } ]
                                    } ] }
                        ] } ];
            },
            buildRaidJoinList: function () {
                return [ {
                        content: 'click to copy raid link',
                        type: 'strong' }, {
                        id: 'idrinth-raid-link-list',
                        type: 'div' } ];
            },
            buildChat: function () {
                return idrinth.ui.buildElement ( {
                    type: 'div',
                    id: 'idrinth-chat',
                    css: 'idrinth-hovering-box active' + ( idrinth.settings.moveLeft ? ' left-sided' : '' ),
                    children: [
                        {
                            type: 'button',
                            content: '>>',
                            attributes: [ { name: 'onclick', value: 'idrinth.chat.openCloseChat(this);' } ]
                        }, {
                            type: 'ul',
                            css: 'styles-scrollbar chat-labels',
                            children: [ {
                                    type: 'li',
                                    css: 'active',
                                    content: "\u2699",
                                    attributes: [
                                        { name: 'onclick', value: 'idrinth.chat.enableChat(this);' },
                                        { name: 'data-id', value: '0' }
                                    ]
                                } ]
                        }, {
                            type: 'ul',
                            css: 'chat-tabs',
                            children: [ {
                                    type: 'li',
                                    css: 'styles-scrollbar active',
                                    attributes: [
                                        { name: 'data-id', value: '0' }
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
                                            type: 'div',
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
                                                                { type: 'label', content: 'Username' },
                                                                { type: 'input', attributes: [
                                                                        { name: 'type', value: 'text' },
                                                                        { name: 'onchange', value: 'this.setAttribute(\'value\',this.value);' }
                                                                    ] }
                                                            ]
                                                        },
                                                        {
                                                            type: 'li',
                                                            children: [
                                                                { type: 'label', content: 'Password' },
                                                                { type: 'input', attributes: [
                                                                        { name: 'type', value: 'text' },
                                                                        { name: 'onchange', value: 'this.setAttribute(\'value\',this.value);' }
                                                                    ] }
                                                            ]
                                                        },
                                                        {
                                                            type: 'li',
                                                            children: [
                                                                {
                                                                    type: 'button',
                                                                    attributes: [
                                                                        { name: 'type', value: 'button' },
                                                                        { name: 'onclick', value: 'idrinth.chat.login()' }
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
                                            type: 'div',
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
                                                                { type: 'label', content: 'Chat-ID' },
                                                                { type: 'input', attributes: [
                                                                        { name: 'type', value: 'text' },
                                                                        { name: 'onchange', value: 'this.setAttribute(\'value\',this.value);' }
                                                                    ] }
                                                            ]
                                                        },
                                                        {
                                                            type: 'li',
                                                            children: [
                                                                { type: 'label', content: 'Chat-Password' },
                                                                { type: 'input', attributes: [
                                                                        { name: 'type', value: 'text' },
                                                                        { name: 'onchange', value: 'this.setAttribute(\'value\',this.value);' }
                                                                    ] }
                                                            ]
                                                        },
                                                        {
                                                            type: 'li',
                                                            children: [
                                                                {
                                                                    type: 'button',
                                                                    attributes: [
                                                                        { name: 'type', value: 'button' },
                                                                        { name: 'onclick', value: 'idrinth.chat.add()' }
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
                                            type: 'div',
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
                                                                { type: 'label', content: 'Name' },
                                                                { type: 'input', attributes: [
                                                                        { name: 'type', value: 'text' },
                                                                        { name: 'onchange', value: 'this.setAttribute(\'value\',this.value);' }
                                                                    ] }
                                                            ]
                                                        },
                                                        {
                                                            type: 'li',
                                                            children: [
                                                                {
                                                                    type: 'button',
                                                                    attributes: [
                                                                        { name: 'type', value: 'button' },
                                                                        { name: 'onclick', value: 'idrinth.chat.create()' }
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
                                                { type: '#text', content: 'More settings at ' },
                                                { type: 'a', content: 'dotd.idrinth.de/' + idrinth.platform + '/chat/', attributes: [
                                                        { name: 'target', value: '_blank' },
                                                        { name: 'href', value: 'https://dotd.idrinth.de/' + idrinth.platform + '/chat/' }
                                                    ] },
                                                { type: '#text', content: '.' }
                                            ]
                                        }, {
                                            type: 'li',
                                            children: [
                                                { type: '#text', content: 'Emoticons provided by ' },
                                                { type: 'a', content: 'emoticonshd.com', attributes: [
                                                        { name: 'target', value: '_blank' },
                                                        { name: 'href', value: 'http://emoticonshd.com/' }
                                                    ] },
                                                { type: '#text', content: '.' }
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
                            type: 'div',
                            id: 'idrinth-war',
                            css: 'idrinth-central-box idrinth-hovering-box',
                            children: [
                                {
                                    type: 'div',
                                    children: [
                                        {
                                            type: 'span',
                                            content: 'current WAR'
                                        },
                                        {
                                            type: 'span',
                                            attributes: [
                                                { name: 'style', value: 'padding:0.2em;width:1em;height:1em;float:right;cursor:pointer;background:#000;color:#fff;border-radius:50%;' },
                                                { name: 'onclick', value: 'idrinth.war.oc();' }
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
            buildActions: function () {
                return [ {
                        css: 'idrinth-line',
                        type: 'div',
                        children: [ {
                                css: 'idrinth-float-half',
                                type: 'button',
                                content: 'import all manually',
                                attributes: [ {
                                        name: 'type',
                                        value: 'button'
                                    }, {
                                        name: 'onclick',
                                        value: 'idrinth.raids.importManually(true);'
                                    } ]
                            }, {
                                css: 'idrinth-float-half',
                                type: 'button',
                                content: 'import favs manually',
                                attributes: [ {
                                        name: 'type',
                                        value: 'button'
                                    }, {
                                        name: 'onclick',
                                        value: 'idrinth.raids.importManually(false);'
                                    } ]
                            }, {
                                css: 'idrinth-float-half',
                                type: 'button',
                                content: 'Reload Game',
                                attributes: [ {
                                        name: 'type',
                                        value: 'button'
                                    }, {
                                        name: 'onclick',
                                        value: 'idrinth.ui.reloadGame();'
                                    } ]
                            }, {
                                css: 'idrinth-float-half',
                                type: 'button',
                                content: 'Clear Raids',
                                attributes: [ {
                                        name: 'type',
                                        value: 'button'
                                    }, {
                                        name: 'onclick',
                                        value: 'idrinth.raids.clearAll();'
                                    } ]
                            }, {
                                css: 'idrinth-float-half',
                                type: 'button',
                                content: 'Reload Idrinth\'s Script',
                                attributes: [ {
                                        name: 'type',
                                        value: 'button'
                                    }, {
                                        name: 'onclick',
                                        value: 'idrinth.reload();'
                                    } ]
                            }, {
                                css: 'idrinth-float-half',
                                type: 'button',
                                content: 'Restart RaidJoin',
                                attributes: [ {
                                        name: 'type',
                                        value: 'button'
                                    }, {
                                        name: 'onclick',
                                        value: 'idrinth.raids.restartInterval();'
                                    } ]
                            }, {
                                css: 'idrinth-float-half',
                                type: 'button',
                                content: 'Refresh FB Game Login',
                                attributes: [ {
                                        name: 'type',
                                        value: 'button'
                                    }, {
                                        name: 'style',
                                        value: idrinth.platform === 'facebook' ? '' : 'display:none'
                                    }, {
                                        name: 'onclick',
                                        value: 'idrinth.facebook.rejoin();'
                                    } ]
                            }, {
                                css: 'idrinth-float-half',
                                type: 'button',
                                content: 'NG Raid Join(slow!)',
                                attributes: [ {
                                        name: 'type',
                                        value: 'button'
                                    }, {
                                        name: 'style',
                                        value: idrinth.realSite === 'newgrounds' ? '' : 'display:none'
                                    }, {
                                        name: 'onclick',
                                        value: 'idrinth.newgrounds.joinRaids();'
                                    } ]
                            }, {
                                css: 'idrinth-float-half',
                                type: 'button',
                                content: idrinth.settings.alarmActive ? 'disable timed Autojoin' : 'enable timed Autojoin',
                                attributes: [ {
                                        name: 'type',
                                        value: 'button'
                                    }, {
                                        name: 'style',
                                        value: idrinth.realSite === 'newgrounds' ? '' : 'display:none'
                                    }, {
                                        name: 'onclick',
                                        value: 'idrinth.settings.change(\'alarmActive\',!idrinth.settings.alarmActive);this.innerHTML=idrinth.settings.alarmActive?\'disable timed Autojoin\':\'enable timed Autojoin\''
                                    } ]
                            }
                        ] }, {
                        css: 'idrinth-line',
                        type: 'div',
                        id: 'idrinth-joined-raids',
                        content: 'Last raids joined:',
                        children: [
                            { type: 'ul' }
                        ]
                    } ];
            },
            buildTiers: function () {
                return [ { type: 'div', css: 'idrinth-line', children: [ {
                                type: 'label',
                                content: 'Enter Boss\' Name',
                                css: 'idrinth-float-half',
                                attributes: [
                                    { name: 'for', value: 'idrinth-tierlist-bosssearch' }
                                ]
                            }, {
                                type: 'input',
                                css: 'idrinth-float-half',
                                id: 'idrinth-tierlist-bosssearch',
                                attributes: [
                                    { name: 'onkeyup', value: 'idrinth.tier.getTierForName(this.value);' },
                                    { name: 'onchange', value: 'idrinth.tier.getTierForName(this.value);' },
                                    { name: 'onblur', value: 'idrinth.tier.getTierForName(this.value);' }
                                ]
                            } ] }, {
                        type: 'div',
                        id: 'idrinth-tierlist'
                    } ];
            },
            buildControls: function () {
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
                        }, { type: 'span', content: 'Server: ' + name } ];
                }
                idrinth.ui.tooltip = idrinth.ui.buildElement ( {
                    css: 'idrinth-hovering-box idrinth-tooltip-overwrite',
                    type: 'div',
                    id: 'idrinth-tooltip',
                    children: [
                        { type: 'div', children: getServerPart ( 'Kongregate' ) },
                        { type: 'div', children: getServerPart ( 'World' ) }
                    ],
                    attributes: [
                        { name: 'onmouseenter', value: 'idrinth.names.isHovering=true;' },
                        { name: 'onmouseleave', value: 'idrinth.names.isHovering=false;' }
                    ]
                } );
                idrinth.ui.body.appendChild ( idrinth.ui.tooltip );
            }
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
                for (var count = 0; count < config.children.length; count++) {
                    el.appendChild ( idrinth.ui.buildElement ( config.children[count] ) );
                }
            };
            var addAttributes = function ( el, config ) {
                if ( !config.attributes || !config.attributes.length ) {
                    return;
                }
                for (var count = 0; count < config.attributes.length; count++) {
                    el.setAttribute ( config.attributes[count].name, config.attributes[count].value );
                }
            };
            var makeInputLabel = function ( config ) {
                'use strict';
                var input = [ {
                        name: 'type',
                        value: config.type
                    } ];
                if ( idrinth.settings[config.name] && config.type === 'checkbox' ) {
                    input.push ( {
                        name: 'checked',
                        value: 'checked'
                    } );
                }
                if ( config.type !== 'checkbox' ) {
                    input.push ( {
                        name: 'value',
                        value: idrinth.settings[config.name]
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
                return idrinth.ui.buildElement ( {
                    css: 'idrinth-line',
                    type: 'div',
                    attributes: [ {
                            name: 'style',
                            value: config.platforms && !idrinth.inArray ( idrinth.realSite, config.platforms ) ? 'display:none;' : ''
                        } ],
                    children: [ {
                            type: 'label',
                            css: 'idrinth-float-half',
                            content: config.label,
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
            var el = document.createElement ( config.type );
            setBase ( el, config );
            addChildren ( el, config );
            addAttributes ( el, config );
            return el;
        },
        controls: null,
        tooltipTO: null,
        showTooltip: function ( element ) {
            'use strict';
            function tooltip ( set, element, pos, guilds, platform ) {
                element.setAttribute ( 'style', 'display:none' );
                if ( set ) {
                    element.childNodes[0].setAttribute ( 'href', 'https://dotd.idrinth.de/' + platform + '/summoner/' + set.id + '/' );
                    element.childNodes[0].innerHTML = set.name;
                    element.childNodes[1].childNodes[1].innerHTML = set.level + ' (' + set['7day'] + '/week, ' + set['30day'] + '/month)';
                    element.childNodes[1].childNodes[3].innerHTML = idrinth.names.classes[set.class];
                    element.childNodes[2].childNodes[1].setAttribute ( 'href', 'https://dotd.idrinth.de/' + platform + '/guild/' + set.guildId + '/' );
                    element.childNodes[2].childNodes[1].innerHTML = guilds[set.guildId];
                    element.childNodes[3].childNodes[1].innerHTML = set.updated;
                    element.childNodes[3].setAttribute ( 'style', ( new Date () ) - ( new Date ( set.updated ) ) > 86400000 ? 'color:#aa0000;' : '' );
                    element.setAttribute ( 'style', '' );
                    idrinth.ui.tooltip.setAttribute ( 'style', 'left:' + Math.round ( pos.left - 200 ) + 'px;top:' + Math.round ( pos.top - 100 ) + 'px;' );
                }
            }
            var pos = null;
            var name = idrinth.names.parse ( element ).toLowerCase ( );
            if ( idrinth.settings.names && idrinth.ui.tooltip && idrinth.names.users[name] ) {
                window.clearTimeout ( idrinth.ui.tooltipTO );
                pos = element.getBoundingClientRect ( );
                tooltip ( idrinth.names.users[name].kongregate, idrinth.ui.tooltip.firstChild, pos, idrinth.names.guilds.kongregate, 'kongregate' );
                tooltip ( idrinth.names.users[name].world, idrinth.ui.tooltip.lastChild, pos, idrinth.names.guilds.world, 'world-kongregate' );
                idrinth.ui.tooltipTO = window.setTimeout (
                        idrinth.ui.hideTooltip,
                        idrinth.settings.timeout ? idrinth.settings.timeout : 5000
                        );
            }
        },
        hideTooltip: function () {
            if ( idrinth.names.isHovering ) {
                idrinth.ui.tooltipTO = window.setTimeout (
                        idrinth.ui.hideTooltip,
                        idrinth.settings.timeout ? idrinth.settings.timeout : 5000
                        );
            } else {
                idrinth.ui.tooltip.setAttribute ( 'style', 'display:none' );
            }
        },
        openCloseSettings: function ( ) {
            'use strict';
            var classToAdd = 'inactive';
            var classes = idrinth.ui.controls.getAttribute ( 'class' );
            if ( classes.match ( /(^|\s)inactive($|\s)/ ) ) {
                classToAdd = 'active';
            }
            if ( idrinth.settings.moveLeft ) {
                classToAdd = classToAdd + ' left-sided';
            }
            if ( idrinth.settings.minimalist ) {
                classToAdd = classToAdd + ' small';
            }
            classes = classes.replace ( /(^|\s)(in)?small($|\s)/, ' ' );
            classes = classes.replace ( /(^|\s)(in)?active($|\s)/, ' ' );
            classes = classes.replace ( /(^|\s)(in)?left-sided($|\s)/, ' ' ) + ' ' + classToAdd;
            classes = classes.replace ( /\s{2,}/, ' ' );
            idrinth.ui.controls.setAttribute ( 'class', classes );
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
            try {
                if ( idrinth.realSite === 'kongregate' ) {
                    window.activateGame ( );
                } else if ( idrinth.realSite === 'dawnofthedragons' ) {
                    document.getElementsByTagName ( 'iframe' )[0].setAttribute ( 'src', 'https://web1.dawnofthedragons.com/live_standalone/?idrinth_nc' + ( new Date ( ) ).getTime ( ) );
                } else if ( idrinth.realSite === 'newgrounds' ) {
                    document.getElementById ( 'iframe_embed' ).getElementsByTagName ( 'iframe' )[0].setAttribute ( 'src', ( frame.getAttribute ( 'src' ) ).replace ( /&ir=.*/, '' ) + '&ir=' + Math.random () );
                } else if ( idrinth.realSite === 'armorgames' ) {
                    document.getElementById ( 'gamefilearea' ).getElementsByTagName ( 'iframe' )[0].setAttribute ( 'src', ( frame.getAttribute ( 'src' ) ).replace ( /&ir=.*/, '' ) + '&ir=' + Math.random () );
                }
            } catch ( e ) {
                idrinth.alert ( 'The game couldn\'t be reloaded' );
            }
        },
        getPosition: function ( element ) {
            var xPosition = 0;
            var yPosition = 0;
            xPosition = element.getBoundingClientRect ().left;
            yPosition = element.getBoundingClientRect ().top;
            return { x: xPosition, y: yPosition };
        },
        activateTab: function ( name ) {
            var head = document.getElementById ( 'tab-activator-' + name ).parentNode.childNodes;
            var body = document.getElementById ( 'tab-element-' + name ).parentNode.childNodes;
            for (var count = 0; count < head.length; count++) {
                if ( head[count] === document.getElementById ( 'tab-activator-' + name ) ) {
                    head[count].setAttribute ( 'class', head[count].getAttribute ( 'class' ) + ' active' );
                    body[count].setAttribute ( 'style', 'display:block' );
                } else {
                    head[count].setAttribute ( 'class', ( head[count].getAttribute ( 'class' ) ).replace ( /(^|\s)active($|\s)/, ' ' ) );
                    body[count].setAttribute ( 'style', 'display:none' );
                }
            }
        },
        start: function ( ) {
            'use strict';
            idrinth.ui.body = document.getElementsByTagName ( 'body' )[0];
            document.getElementsByTagName ( 'head' )[0].appendChild ( idrinth.ui.buildElement ( {
                type: 'link',
                attributes: [ {
                        name: 'rel',
                        value: 'stylesheet'
                    }, {
                        name: 'href',
                        value: 'https://dotd.idrinth.de###PATH###/script-styles.css'
                    } ]
            } ) );
            if ( idrinth.realSite === 'kongregate' ) {
                idrinth.ui.buildBasis.buildTooltip ( );
            }
            idrinth.ui.buildBasis.do ( );
            idrinth.war.element = idrinth.ui.buildBasis.war ();
            idrinth.ui.body.appendChild ( idrinth.war.element );
        }
    },
    startInternal: function () {
        if ( idrinth.realSite === 'newgrounds' ) {
            try {
                var frame = document.getElementById ( 'iframe_embed' ).getElementsByTagName ( 'iframe' )[0];
                idrinth.newgrounds.originalUrl = frame.getAttribute ( 'src' );
                if ( window.location.search ) {
                    frame.setAttribute ( 'src', ( frame.getAttribute ( 'src' ) ).replace ( /&ir=.*/, '' ) + '&' + ( window.location.search ).replace ( /^\?/, '' ) );
                }
            } catch ( e ) {
                window.setTimeout ( function () {
                    idrinth.startInternal ();
                }, 500 );
                return;
            }
            window.setTimeout ( idrinth.newgrounds.alarmCheck, 3333 );
        }
        idrinth.settings.start ( );
        idrinth.ui.start ( );
        idrinth.user.start ( );
        idrinth.names.start ( );
        idrinth.raids.start ( );
        idrinth.tier.start ();
        idrinth.chat.start ();
        idrinth.war.start ();
        window.setTimeout ( function () {
            var clipboard = new Clipboard ( '#idrinth-raid-link-list span' );
            clipboard.on ( 'success', function ( e ) {
                e = e || window.event;
                e.trigger.parentNode.removeChild ( e.trigger );
            } );
        }, 1000 );
    },
    start: function ( ) {
        'use strict';
        idrinth.log ( 'Starting Idrinth\'s DotD Script' );
        idrinth.realSite = location.hostname.split ( '.' )[location.hostname.split ( '.' ).length - 2];
        idrinth.platform = idrinth.realSite;
        if ( idrinth.platform === 'dawnofthedragons' ) {
            idrinth.platform = 'facebook';
        }
        if ( idrinth.platform === 'armorgames' ) {
            window.setTimeout ( function () {
                idrinth.startInternal ();
            }, 2222 );
            return;
        }
        idrinth.startInternal ();
    },
    /**
     * @todo replace with a properly styled elements
     * @param String text
     * @returns Null
     */
    alert: function ( text ) {
        window.alert ( text );
    }
};
window.setTimeout ( function ( ) {
    idrinth.start ( );
}, 6666 );
