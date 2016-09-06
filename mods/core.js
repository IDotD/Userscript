idrinth.core = {
    ajax: {
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
                request._remove ( request );
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
            textAreaElement.select ();
            success = document.execCommand ( 'copy' );
        } catch ( exception ) {
            idrinth.core.log ( exception.getMessage () );
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
    log: function ( string ) {
        'use strict';
        console.log ( '[IDotDS] ' + string );
    },
    alert: function ( text ) {
        idrinth.ui.buildModal ( 'Info', text );
    },
    confirm: function ( text, callback ) {
        idrinth.ui.buildModal ( 'Do you?', text, callback );
    }
};