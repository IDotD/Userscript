idrinth.names = {
    /**
     * @type {object}
     */
    users: { },
    /**
     * @type {object}
     */
    classes: { },
    /**
     * @type {object}
     */
    guilds: { },
    /**
     * a timeout
     * @type {object}
     */
    ownTimeout: null,
    /**
     * @type {Number}
     */
    counter: 0,
    /**
     * the method being run to handle data im- and export
     * @returns {undefined}
     */
    run: function ( ) {
        'use strict';
        /**
         *
         * @param {string} added the path-segment defining the data returned
         * @returns {undefined}
         */
        var load = function ( added ) {
            /**
             *
             * @param {string} data
             * @returns {undefined}
             */
            var importNames = function ( data ) {
                data = JSON.parse ( data );
                if ( !data ) {
                    return;
                }
                if ( data.users ) {
                    idrinth.names.users = data.users;
                }
                if ( data.guilds ) {
                    idrinth.names.guilds = data.guilds;
                }
                if ( data.classes ) {
                    idrinth.names.classes = data.classes;
                }
            };
            idrinth.core.ajax.runHome (
                    'users-service/' + added,
                    importNames
                    );
        };
        /**
         * adds names from elements on the page
         * @returns {undefined}
         */
        var add = function ( ) {
            /**
             *
             * @param {HTMLElement} element
             * @returns {undefined}
             */
            var processName = function ( element ) {
                var name = '';
                /**
                 *
                 * @param {HTMLElement} element
                 * @returns {string}
                 */
                var parse = function ( element ) {
                    'use strict';
                    if ( element.getAttribute ( 'dotdxname' ) ) {
                        return ( element.getAttribute ( 'dotdxname' ) );
                    }
                    if ( element.getAttribute ( 'username' ) ) {
                        return ( element.getAttribute ( 'username' ) );
                    }
                    return ( element.innerHTML ).replace ( /(<([^>]+)>)/ig, "" );
                };
                try {
                    name = parse ( element );
                } catch ( e ) {
                    return;
                }
                if ( !name ) {
                    return;
                }
                if ( !element.getAttribute ( 'data-idrinth-parsed' ) && idrinth.ui.childOf ( element, 'chat_message_window' ) ) {
                    element.setAttribute ( 'onmouseover', 'idrinth.ui.showTooltip(this);' );
                    element.setAttribute ( 'data-idrinth-parsed', '1' );
                }
                if ( !idrinth.names.users[name.toLowerCase ( )] && name.length > 0 ) {
                    idrinth.names.users[name.toLowerCase ()] = { };
                    idrinth.core.ajax.runHome ( 'users-service/add/' + encodeURIComponent ( name ) + '/' );
                }
            };
            var el = document.getElementsByClassName ( 'username' );
            for (var count = el.length - 1; count >= 0; count--) {
                processName ( el[count] );
            }
        };
        try {
            if ( idrinth.names.counter % 300 === 0 || Object.keys ( idrinth.names.users ).length === 0 ) {
                load ( Object.keys ( idrinth.names.classes ).length === 0 ? 'init/' : 'get/' );
            } else if ( Object.keys ( idrinth.names.users ).length > 0 ) {
                add ( );
            }
        } catch ( e ) {
            idrinth.core.log ( e );
        }
        idrinth.names.counter = idrinth.names.counter + 1;
        idrinth.names.ownTimeout = window.setTimeout ( idrinth.names.run, 6666 );
    },
    /**
     * initialises the module
     * @returns {undefined}
     */
    start: function ( ) {
        'use strict';
        /**
         * creates the tooltip-element
         * @returns {undefined}
         */
        var build = function ( ) {
            /**
             *
             * @param {string} name
             * @returns {Array}
             */
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
                css: 'idrinth-hovering-box idrinth-tooltip-overwrite idrinth-hide',
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
        };
        if ( idrinth.platform === 'kongregate' ) {
            idrinth.names.ownTimeout = window.setTimeout ( idrinth.names.run, 10000 );
            build ();
        }
    }
};