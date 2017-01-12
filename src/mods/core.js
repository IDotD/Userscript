idrinth.core = {
    /**
     *
     * @param {string} str
     * @returns {string}
     */
    escapeRegExp: function ( str ) {
        return str.replace ( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&" );
    },
    /**
     *
     * @param {object} parent
     * @param {string} field
     * @param {Boolean} allowObjects
     * @returns {Boolean}
     */
    fieldIsSetting: function ( parent, field, allowObjects ) {
        return parent && typeof parent === 'object' && field && parent.hasOwnProperty ( field ) && ( parent[field] === null || typeof parent[field] !== 'object' || allowObjects ) && typeof parent[field] !== 'function';
    },
    /**
     *
     * @type {object}
     */
    ajax: {
        /**
         *
         * @type {object}
         */
        active: { },
        /**
         *
         * @param {string} url
         * @param {function} success
         * @param {function} failure
         * @param {function} timeout
         * @param {string} additionalHeader
         * @param {Boolean} [false] isStatic
         * @returns {undefined}
         */
        runHome: function ( url, success, failure, timeout, additionalHeader, isStatic ) {
            var server = isStatic ? 'static' : ( idrinth.settings.get ( "isWorldServer" ) ? 'world-' : '' ) + idrinth.platform;
            var homeUrl = 'https://dotd.idrinth.de/' + server + ( '/' + url ).replace ( /\/\//, '/' );
            idrinth.core.ajax.run ( homeUrl, success, failure, timeout, additionalHeader );
        },
        /**
         *
         * @param {string} url
         * @param {function} success
         * @param {function} failure
         * @param {function} timeout
         * @param {string} additionalHeader
         * @param {Boolean} [false] isStatic
         * @returns {undefined}
         */
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
                        idrinth.core.log ( typeof e.getMessage === 'function' ? e.getMessage () : ( e.message ? e.message : e ) );
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
                if ( typeof timeout === 'function' ) {
                    timeout.bind ( request );
                }
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
    /**
     *
     * @type {object}
     */
    copyToClipboard: {
        /**
         *
         * @param {string} text
         * @returns {Boolean}
         */
        text: function ( text ) {
            var success;
            try {
                var textAreaElement = idrinth.ui.buildElement ( {
                    type: 'textarea',
                    id: "idrinth-copy-helper"
                } );
                textAreaElement.value = text;
                idrinth.ui.base.appendChild ( textAreaElement );
                textAreaElement.select ( );
                success = document.execCommand ( 'copy' );
            } catch ( exception ) {
                idrinth.core.log ( exception.getMessage ( ) );
                success = false;
            }
            idrinth.ui.removeElement ( "idrinth-copy-helper" );
            return success;
        },
        /**
         *
         * @param {HTMLElement} element
         * @returns {string}
         */
        element: function ( element ) {
            if ( element.hasAttribute ( 'data-clipboard-text' ) ) {
                return idrinth.core.copyToClipboard.text ( element.getAttribute ( 'data-clipboard-text' ) );
            }
            if ( element.value ) {
                return idrinth.core.copyToClipboard.text ( element.value );
            }
            return idrinth.core.copyToClipboard.text ( element.innerHTML );
        }
    },
    /**
     *
     * @param {string} title
     * @param {string|HTMLElement} content
     * @returns {Boolean|window.Notification}
     */
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
    /**
     *
     * @type {object}
     */
    timeouts: {
        /**
         *
         * @type {object}
         */
        next: null,
        /**
         *
         * @type {object}
         */
        list: { },
        /**
         * makes sure the timeout is removed when called next
         * @param {string} identifier
         * @returns {undefined}
         */
        remove: function ( identifier ) {
            'use strict';
            if ( idrinth.core.timeouts.list[identifier] !== undefined ) {
                idrinth.core.timeouts.list[identifier].repeats = 1;
                idrinth.core.timeouts.list[identifier].func = function () {
                };
            }
        },
        /**
         *
         * @param {string} identifier
         * @param {function} func
         * @param {int} time in milliseconds
         * @param {Number} [1] maxRepeats -1 will repeat until the end of time
         * @returns {undefined}
         */
        add: function ( identifier, func, time, maxRepeats ) {
            'use strict';
            var date = new Date ();
            idrinth.core.timeouts.list[identifier] = {
                func: func,
                next: date.getTime () + date.getMilliseconds () / 1000 + time / 1000,
                duration: time,
                repeats: maxRepeats ? maxRepeats : 1
            };
            if ( !idrinth.core.timeouts.next ) {
                idrinth.core.timeouts.next = window.setTimeout ( idrinth.core.timeouts.process, 1000 );
            }
        },
        /**
         * activates all relevant timeouts and intervals
         * @returns {undefined}
         */
        process: function () {
            'use strict';
            var date = ( new Date () ).getTime () + ( new Date () ).getMilliseconds () / 1000;
            var min = 10;
            /**
             *
             * @param {Number} durationLeft
             * @param {Number} minDuration
             * @returns {Number}
             */
            var getVal = function ( durationLeft, minDuration ) {
                if ( durationLeft < 0.1 ) {
                    return 0.1;
                }
                return durationLeft < minDuration ? durationLeft : minDuration;
            };
            for (var property in idrinth.core.timeouts.list) {
                if ( idrinth.core.timeouts.list.hasOwnProperty ( property ) ) {
                    if ( date >= idrinth.core.timeouts.list[property].next ) {
                        try {
                            idrinth.core.timeouts.list[property].func ();
                            idrinth.core.timeouts.list[property].repeats = Math.max ( -1, idrinth.core.timeouts.list[property].repeats - 1 );
                            if ( idrinth.core.timeouts.list[property].repeats ) {
                                min = getVal ( idrinth.core.timeouts.list[property].duration, min );
                                idrinth.core.timeouts.list[property].next = date + idrinth.core.timeouts.list[property].duration / 1000;
                            } else {
                                delete idrinth.core.timeouts.list[property];
                            }
                        } catch ( e ) {
                            idrinth.core.log ( e.message ? e.message : e.getMessage () );
                        }
                    } else {
                        min = getVal ( idrinth.core.timeouts.list[property].next - date, min );
                    }
                }
            }
            if ( Object.keys ( idrinth.core.timeouts.list ).length ) {
                idrinth.core.timeouts.next = window.setTimeout ( idrinth.core.timeouts.process, Math.ceil ( min * 1000 ) );
            }
        }
    },
    /**
     *
     * @param {string} string
     * @returns {undefined}
     */
    log: function ( string ) {
        'use strict';
        console.log ( '[IDotDS] ' + string );
    },
    /**
     *
     * @param {string} text
     * @returns {undefined}
     */
    alert: function ( text ) {
        idrinth.ui.buildModal ( 'Info', text );
    },
    /**
     *
     * @param {string} text
     * @param {function} callback
     * @returns {undefined}
     */
    confirm: function ( text, callback ) {
        idrinth.ui.buildModal ( 'Do you?', text, callback );
    },
    /**
     *
     * @type {object}
     */
    multibind: {
        /**
         *
         * @type {object}
         */
        events: { },
        /**
         *
         * @param {string} event
         * @param {string} selector
         * @param {function} method
         * @returns {undefined}
         */
        add: function ( event, selector, method ) {
            var bind = function ( event, selector, method ) {
                idrinth.core.multibind.events[event] = idrinth.core.multibind.events[event] ? idrinth.core.multibind.events[event] : { };
                idrinth.core.multibind.events[event][selector] = idrinth.core.multibind.events[event][selector] ? idrinth.core.multibind.events[event][selector] : [ ];
                idrinth.core.multibind.events[event][selector].push ( method );
            };
            if ( !idrinth.core.multibind.events[event] ) {
                idrinth.ui.base.addEventListener ( event, function ( e ) {
                    e = e || window.event;
                    idrinth.core.multibind.triggered ( e.target, e.type );
                } );
            }
            bind ( event, selector, method );
        },
        /**
         *
         * @param {HTMLElement} element
         * @param {string} event
         * @returns {undefined}
         */
        triggered: function ( element, event ) {
            /**
             *
             * @param {HTMLElement} el
             * @param {string} event
             * @param {string} selector
             * @returns {undefined}
             */
            var handleElement = function ( el, event, selector ) {
                if ( !el ) {
                    return;
                }
                for (var pos = 0; pos < idrinth.core.multibind.events[event][selector].length; pos++) {
                    try {
                        idrinth.core.multibind.events[event][selector][pos] ( el, event );
                    } catch ( exception ) {
                        idrinth.core.log ( exception.message ? exception.message : exception.getMessage () );
                    }
                }
            };
            if ( idrinth.core.multibind.events[event] ) {
                for (var selector in idrinth.core.multibind.events[event]) {
                    if ( idrinth.core.multibind.events[event].hasOwnProperty ( selector ) ) {
                        handleElement ( idrinth.ui.matchesCss ( element, selector ), event, selector );
                    }
                }
            }
        }
    }
};
