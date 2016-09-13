idrinth.core = {
    escapeRegExp: function ( str ) {
        return str.replace ( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&" );
    },
    fieldIsSetting: function ( parent, field ) {
        return parent && typeof parent === 'object' && field && parent.hasOwnProperty ( field ) && typeof parent[field] !== 'object' && typeof parent[field] !== 'function';
    },
    ajax: {
        runHome: function ( url, success, failure, timeout, additionalHeader ) {
            var homeUrl = 'https://dotd.idrinth.de/' + ( idrinth.settings.isWorldServer ? 'world-' : '' ) + idrinth.platform + ( '/' + url ).replace ( /\/\// );
            idrinth.core.ajax.run ( homeUrl, success, failure, timeout, additionalHeader )
        },
        active: { },
        run: function ( url, success, failure, timeout, additionalHeader ) {
            'use strict';
            var requestHandler = new XMLHttpRequest ( );
            requestHandler.onreadystatechange = function ( event ) {
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
                    delete idrinth.core.ajax.active[request._url];
                }
            };
            requestHandler.timeout = 30000;
            requestHandler.ontimeout = function ( event ) {
                var request = ( event || window.event ).target;
                timeout.bind ( request );
                delete idrinth.core.ajax.active[request._url];
                idrinth.core.log ( 'Request to ' + request._url + ' failed.' );
            };
            var error = function ( event ) {
                delete idrinth.core.ajax.active[( event || window.event ).target._url];
                idrinth.core.log ( 'Request to ' + ( event || window.event ).target._url + ' failed.' );
            };
            requestHandler.onerror = error;
            requestHandler.onabort = error;
            requestHandler._url = url;
            requestHandler.open ( "GET", url, true );
            if ( url.match ( '/dotd\.idrinth\.de/' ) ) {
                if ( additionalHeader ) {
                    requestHandler.setRequestHeader ( "Idrinth-Addition", additionalHeader );
                }
                requestHandler.withCredentials = true;
            }
            idrinth.core.ajax.active[url] = requestHandler;
            idrinth.core.ajax.active[url].send ( );
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
            textAreaElement.select ( );
            success = document.execCommand ( 'copy' );
        } catch ( exception ) {
            idrinth.core.log ( exception.getMessage ( ) );
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
            window.Notification.requestPermission ( );
        }
        if ( window.Notification.permission === "denied" ) {
            return false;
        }
        return new window.Notification ( title, {
            icon: "https://dotd.idrinth.de/Resources/Images/logo.png",
            body: content
        } );
    },
    log: function ( string ) {
        'use strict';
        console.log ( '[IDotDS] ' + string );
    },
    alert: function ( text ) {
        idrinth.ui.buildModal ( 'Info', text );
    },
    confirm: function ( text, callback ) {
        idrinth.ui.buildModal ( 'Do you?', text, callback );
    },
    multibind: {
        events: { },
        add: function ( event, selector, method ) {
            var bind = function ( event, selector, method ) {
                idrinth.core.multibind.events[event] = idrinth.core.multibind.events[event] ? idrinth.core.multibind.events[event] : { };
                idrinth.core.multibind.events[event][selector] = idrinth.core.multibind.events[event][selector] ? idrinth.core.multibind.events[event][selector] : [ ];
                idrinth.core.multibind.events[event][selector].push ( method );
            };
            if ( idrinth.core.multibind.events[event] ) {
                //trying not to break all old code there
                if ( idrinth.ui.body.getAttribute ( 'on' + event ) ) {
                    var tmp = new Function ( idrinth.ui.body.getAttribute ( 'on' + event ) );
                    bind ( event, 'body', tmp );
                }
                if ( idrinth.ui.body['on' + event] && typeof idrinth.ui.body['on' + event] === 'function' ) {
                    bind ( event, 'body', idrinth.ui.body['on' + event] );
                }
            }
            bind ( event, selector, method );
        },
        triggered: function ( element, event ) {
            if ( idrinth.core.multibind.events[event] ) {
                for (var selector in idrinth.core.multibind.events[event]) {
                    var el = idrinth.ui.matchesCss ( element, selector );
                    if ( el ) {
                        for (var pos = 0; pos < idrinth.core.multibind.events[event][selector].length; pos++) {
                            try {
                                idrinth.core.multibind.events[event][selector][pos].bind ( el, event );
                            } catch ( exception ) {
                                idrinth.core.log ( exception.getMessage () );
                            }
                        }
                    }
                }
            }
        }
    }
};