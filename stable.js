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
                idrinth.log ( e );
            }
            idrinth.facebook.popup = window.open ( "https://apps.facebook.com/dawnofthedragons/" );
            idrinth.facebook.popup.onload = function () {
                window.clearTimeout ( idrinth.facebook.timeout );
                idrinth.facebook.timeout = window.setTimeout ( idrinth.facebook.restart, 3333 );
            };
            idrinth.facebook.timeout = window.setTimeout ( idrinth.facebook.restart, 11111 );
        }
    },
    copyToClipboard: function ( text ) {
        var success;
        try {
            var textAreaElement = idrinth.ui.buildElement ( {
                type: 'textarea',
                id: "idrinth-copy-helper"
            } );
            textAreaElement.value = text;
            idrinth.ui.body.appendChild ( textAreaElement );
            textAreaElement.select ();
            success = document.execCommand ( 'copy' );
        } catch ( exception ) {
            idrinth.log ( exception.getMessage () );
            success = false;
        }
        idrinth.ui.removeElement ( "idrinth-copy-helper" );
        return success;
    },
    sendNotification: function ( title, content ) {
        if ( !( "Notification" in window ) ) {
            return false;
        }
        if ( window.Notification.permission === "default" ) {
            window.Notification.requestPermission ();
        }
        if ( window.Notification.permission === "denied" ) {
            return false;
        }
        return new window.Notification ( title, {
            icon: "https://dotd.idrinth.de/Resources/Images/logo.png",
            body: content
        } );
    },
    newgrounds: {
        originalUrl: '',
        raids: [ ],
        joinRaids: function () {
            for (var key in idrinth.raids.list) {
                if ( idrinth.raids.list[key].hash && idrinth.raids.list[key].raidId ) {
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
            var link = idrinth.newgrounds.originalUrl + '&' + ( idrinth.raids.join.getServerLink ( key ) ).replace ( /^.*?\?/, '' );
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
                if ( !config.attributes || !config.attributes.length ) {
                    return;
                }
                for (var count = 0, l = config.attributes.length; count < l; count++) {
                    if ( config.attributes[count].name && config.attributes[count].value !== undefined ) {
                        el.setAttribute ( config.attributes[count].name, config.attributes[count].value );
                    }
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
                    css: 'idrinth-line' + ( config.platforms && !idrinth.inArray ( idrinth.platform, config.platforms ) ? ' idrinth-hide' : '' ),
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
            var closeFunc = 'this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);';
            if ( typeof altFunc === 'string' ) {
                mod.children[mod.children.length - 1].children = [ {
                        type: 'button',
                        content: 'Ok',
                        attributes: [ {
                                name: 'onclick',
                                value: altFunc
                            } ]
                    }, {
                        type: 'button',
                        content: 'Cancel',
                        attributes: [ {
                                name: 'onclick',
                                value: closeFunc
                            } ]
                    } ];
            } else {
                mod.children[mod.children.length - 1].children = [ {
                        type: 'button',
                        content: 'Ok',
                        attributes: [ {
                                name: 'onclick',
                                value: closeFunc
                            } ]
                    } ];
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
                var baseUrl = 'https://dotd.idrinth.de/' + world ? 'world-kongregate' : 'kongregate';
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
                idrinth.ui.tooltipTO = window.setTimeout ( idrinth.ui.hideTooltip, idrinth.settings.timeout ? idrinth.settings.timeout : 5000 );
            }
        },
        hideTooltip: function () {
            if ( idrinth.names.isHovering ) {
                idrinth.ui.tooltipTO = window.setTimeout ( idrinth.ui.hideTooltip, idrinth.settings.timeout ? idrinth.settings.timeout : 5000 );
                return;
            }
            idrinth.ui.updateClassesList ( idrinth.ui.tooltip, [ 'idrinth-hide' ], [ ] );
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
                if ( idrinth.platform === 'kongregate' ) {
                    window.activateGame ( );
                } else if ( idrinth.platform === 'dawnofthedragons' ) {
                    document.getElementsByTagName ( 'iframe' )[0].setAttribute ( 'src', 'https://web1.dawnofthedragons.com/live_standalone/?idrinth_nc' + ( new Date ( ) ).getTime ( ) );
                } else if ( idrinth.platform === 'newgrounds' ) {
                    document.getElementById ( 'iframe_embed' ).getElementsByTagName ( 'iframe' )[0].setAttribute ( 'src', ( frame.getAttribute ( 'src' ) ).replace ( /&ir=.*/, '' ) + '&ir=' + Math.random () );
                } else if ( idrinth.platform === 'armorgames' ) {
                    document.getElementById ( 'gamefilearea' ).getElementsByTagName ( 'iframe' )[0].setAttribute ( 'src', ( frame.getAttribute ( 'src' ) ).replace ( /&ir=.*/, '' ) + '&ir=' + Math.random () );
                }
            } catch ( e ) {
                idrinth.alert ( 'The game couldn\'t be reloaded' );
            }
        },
        updateClassesList: function ( element, add, remove ) {
            var getClassesList = function ( classString, add, remove ) {
                var forceToArray = function ( value ) {
                    return value && typeof value === 'object' && Array.isArray ( value ) ? value : [ ];
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
            idrinth.ui.body = document.getElementsByTagName ( 'body' )[0];
            document.getElementsByTagName ( 'head' )[0].appendChild ( idrinth.ui.buildElement ( {
                type: 'link',
                attributes: [ {
                        name: 'rel',
                        value: 'stylesheet'
                    }, {
                        name: 'href',
                        value: 'https://dotd.idrinth.de###PATH###/script-styles.css?###VERSION###'
                    } ]
            } ) );
            if ( idrinth.platform === 'kongregate' ) {
                idrinth.ui.buildBasis.buildTooltip ( );
            }
            idrinth.ui.buildBasis.do ( );
            idrinth.war.element = idrinth.ui.buildBasis.war ();
            idrinth.ui.body.appendChild ( idrinth.war.element );
        }
    },
    startInternal: function () {
        var startModules = function () {
            idrinth.settings.start ( );
            idrinth.ui.start ( );
            idrinth.user.start ( );
            idrinth.names.start ( );
            idrinth.raids.start ( );
            idrinth.tier.start ();
            idrinth.chat.start ();
            idrinth.war.start ();
        };
        if ( idrinth.platform === 'newgrounds' ) {
            try {
                var frame = document.getElementById ( 'iframe_embed' ).getElementsByTagName ( 'iframe' )[0];
                idrinth.newgrounds.originalUrl = frame.getAttribute ( 'src' );
                if ( window.location.search ) {
                    frame.setAttribute ( 'src', ( frame.getAttribute ( 'src' ) ).replace ( /&ir=.*/, '' ) + '&' + ( window.location.search ).replace ( /^\?/, '' ) );
                }
            } catch ( e ) {
                window.setTimeout ( idrinth.startInternal, 500 );
                return;
            }
            window.setTimeout ( idrinth.newgrounds.alarmCheck, 3333 );
        }
        startModules ();
        window.setTimeout ( function () {
            var clipboard = new Clipboard ( '#idrinth-raid-link-list span' );
            clipboard.on ( 'success', function ( e ) {
                e = e || window.event;
                e.trigger.parentNode.removeChild ( e.trigger );
            } );
        }, 1000 );
        window.setTimeout ( function () {
            var clipboard = new Clipboard ( '.clipboard-copy' );
            clipboard.on ( 'success', function ( e ) {
                e = e || window.event;
                e.trigger.parentNode.parentNode.removeChild ( e.trigger.parentNode );
            } );
        }, 1000 );
    },
    start: function ( ) {
        'use strict';
        idrinth.log ( 'Starting Idrinth\'s DotD Script' );
        idrinth.platform = location.hostname.split ( '.' )[location.hostname.split ( '.' ).length - 2];
        if ( idrinth.platform === 'dawnofthedragons' ) {
            idrinth.platform = 'facebook';
        }
        if ( idrinth.platform === 'armorgames' ) {
            window.setTimeout ( idrinth.startInternal, 2222 );
            return;
        }
        idrinth.startInternal ();
    },
    alert: function ( text ) {
        idrinth.ui.buildModal ( 'Info', text );
    },
    confirm: function ( text, callback ) {
        idrinth.ui.buildModal ( 'Do you?', text, callback );
    }
};
window.setTimeout ( idrinth.start, 6666 );
