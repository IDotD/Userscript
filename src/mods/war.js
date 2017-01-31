idrinth.war = {
    /**
     *
     * @type {string}
     */
    from: null,
    /**
     *
     * @type {string}
     */
    to: null,
    /**
     *
     * @type {HTMLElement}
     */
    element: null,
    /**
     * sets the timeout
     * @returns {undefined}
     */
    setTO: function ( ) {
        var active = ( idrinth.war.element.getAttribute ( 'class' ) ).match ( /(^|\s)idrinth-hide($|\s)/ ) !== null;
        idrinth.core.timeouts.add ( 'war', idrinth.war.getData, active ? 30000 : 120000, -1 );
    },
    /**
     * requests data from the server
     * @returns {undefined}
     */
    getData: function () {
        /**
         *
         * @param {object} data
         * @returns {undefined}
         */
        var updateData = function ( data ) {
            /**
             *
             * @param {object} data
             * @returns {undefined}
             */
            var process = function ( data ) {
                /**
                 *
                 * @param {Boolean} onOff
                 * @returns {undefined}
                 */
                var toggleGUI = function ( onOff ) {
                    var toggle = onOff || false;
                    var addClasses = [ ];
                    var removeClasses = [ ];
                    if ( toggle === true ) {
                        removeClasses.push ( 'idrinth-hide' );
                        addClasses.push ( "bottom" );
                        if ( !idrinth.settings.get ( "warBottom" ) ) {
                            removeClasses.push ( "bottom" );
                        }
                    } else {
                        addClasses.push ( "idrinth-hide" );
                        while ( idrinth.war.element.childNodes[1].childNodes[1].firstChild ) {
                            idrinth.war.element.childNodes[1].childNodes[1].removeChild ( idrinth.war.element.childNodes[1].firstChild.firstChild );
                        }
                    }
                    idrinth.ui.updateClassesList ( idrinth.war.element, addClasses, removeClasses );
                };
                /**
                 *
                 * @param {object} data
                 * @returns {undefined}
                 */
                var processJson = function ( data ) {
                    var magicIgmSrv = 'https://dotd.idrinth.de/static/magic-image-service/';
                    /**
                     *
                     * @param {object} data
                     * @returns {Array}
                     */
                    var getMagic = function ( data ) {
                        var magics = [ ];
                        if ( !data || ( data.magics === null || data.magics === '' ) ) {
                            return [ ];
                        }
                        var tmp = data.magics.split ( ',' );
                        for (var key = 0; key < tmp.length; key++) {
                            var magic = tmp[key];
                            var magicObj = {
                                type: 'img',
                                attributes: [
                                    {
                                        name: 'src',
                                        value: magicIgmSrv + magic + '/'
                                    },
                                    {
                                        name: 'width',
                                        value: '20'
                                    } ]
                            };
                            magics.push ( magicObj );
                        }
                        return magics;
                    };
                    /**
                     *
                     * @param {object} raids
                     * @returns {undefined}
                     */
                    function addRaids ( raids ) {
                        for (var key in raids) {
                            if ( idrinth.raids.joined[key] === undefined && idrinth.raids.list[key] === undefined ) {
                                idrinth.raids.list[key] = raids[key];
                            }
                        }
                    }
                    /**
                     *
                     * @param {object} data
                     * @param {HTMLElement} element
                     * @returns {undefined}
                     */
                    function updateBoss ( data, element ) {
                        //TODO: Dummy function, should be removed
                        function cleanUp () {
                            while ( element.getElementsByTagName ( 'td' )[3].firstChild ) {
                                element.getElementsByTagName ( 'td' )[3].removeChild ( element.getElementsByTagName ( 'td' )[3].firstChild );
                            }
                        }

                        cleanUp ();
                        var tmpMagics = getMagic ( data );
                        for (var m = 0; m < tmpMagics.length; m++) {
                            element.getElementsByTagName ( 'td' )[3].appendChild ( idrinth.ui.buildElement ( tmpMagics[m] ) );
                        }
                        element.getElementsByTagName ( 'td' )[0].setAttribute ( "class", 'traffic ' + ( data.amount < 90 ? 'yes' : ( data.amount > 110 ? 'no' : 'maybe' ) ) );
                        element.getElementsByTagName ( 'td' )[0].setAttribute ( "title", data.amount + '/100' );
                        element.getElementsByTagName ( 'td' )[0].firstChild.innerHTML = ( data.amount < 90 ? 'yes' : ( data.amount > 110 ? 'no' : 'maybe' ) );
                    }
                    /**
                     * creates a new bpss
                     * @param {object} data
                     * @param {string} boss
                     * @returns {undefined}
                     */
                    function newBoss ( data, boss ) {
                        idrinth.war.element.childNodes[1].appendChild ( idrinth.ui.buildElement (
                                {
                                    type: 'tr',
                                    id: 'idrinth-war-' + boss,
                                    children: [
                                        {
                                            type: 'td',
                                            css: 'traffic ' + ( data.amount < 90 ? 'yes' : ( data.amount > 110 ? 'no' : 'maybe' ) ),
                                            children: [ {
                                                    type: 'span',
                                                    content: ( data.amount < 90 ? 'yes' : ( data.amount > 110 ? 'no' : 'maybe' ) )
                                                } ],
                                            attributes: [
                                                {
                                                    name: 'title',
                                                    value: data.amount + '/100'
                                                }
                                            ]
                                        },
                                        {
                                            type: 'td',
                                            content: data.name
                                        },
                                        {
                                            type: 'td',
                                            children: [
                                                {
                                                    type: 'input',
                                                    attributes: [
                                                        {
                                                            name: 'type',
                                                            value: 'checkbox'
                                                        },
                                                        {
                                                            name: 'data-id',
                                                            value: boss
                                                        },
                                                        {
                                                            name: 'title',
                                                            value: 'join ' + data.name
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            type: 'td',
                                            children: getMagic ( data )
                                        }
                                    ]
                                }
                        ) );
                    }
                    if ( data.raids !== undefined ) {
                        addRaids ( data.raids );
                    }
                    for (var boss in data.stats) {
                        if ( document.getElementById ( 'idrinth-war-' + boss ) ) {
                            updateBoss ( data.stats[boss], document.getElementById ( 'idrinth-war-' + boss ) );
                        } else {
                            newBoss ( data.stats[boss], boss );
                        }
                    }
                };
                if ( data === "" || data === "null" ) {
                    return;
                }
                if ( data === "{}" ) {
                    toggleGUI ( false );
                    return;
                }
                toggleGUI ( true );
                try {
                    processJson ( JSON.parse ( data ) );
                } catch ( e ) {
                    idrinth.core.log ( e );
                }
            };
            process ( data );
            idrinth.war.setTO ();
        };
        /**
         *
         * @returns {String}
         */
        var raids2Join = function () {
            var list = [ ];
            for (var input in idrinth.war.element.getElementsByTagName ( 'input' )) {
                if ( idrinth.war.element.getElementsByTagName ( 'input' )[input].checked ) {
                    list.push ( idrinth.war.element.getElementsByTagName ( 'input' )[input].getAttribute ( 'data-id' ) );
                }
            }
            if ( list.length > 0 ) {
                return list.join ( ',' );
            }
            return '_';
        };
        idrinth.core.ajax.runHome (
                "war-service/" + raids2Join () + "/" + Date.now () + "/",
                updateData,
                idrinth.war.setTO,
                idrinth.war.setTO,
                idrinth.raids.knowRaids ()
                );
    },
    /**
     * initializes the module
     * @returns {undefined}
     */
    start: function () {
        /**
         * build the gui part
         * @returns {undefined}
         */
        var build = function ( ) {
            idrinth.war.element = idrinth.ui.buildElement (
                    {
                        id: 'idrinth-war',
                        css: 'idrinth-central-box idrinth-hovering-box idrinth-hide',
                        children: [
                            {
                                children: [
                                    {
                                        type: 'span',
                                        content: 'current WAR'
                                    },
                                    {
                                        type: 'span',
                                        css: 'idrinth-circle',
                                        attributes: [
                                            {
                                                name: 'onclick',
                                                value: 'this.parentNode.parentNode.hasAttribute("style")?this.parentNode.parentNode.removeAttribute("style"):this.parentNode.parentNode.setAttribute("style","bottom:0;top:auto");'
                                            }
                                        ],
                                        content: '\u2195'
                                    },
                                    {
                                        type: 'span',
                                        css: 'idrinth-circle',
                                        attributes: [
                                            {
                                                name: 'onclick',
                                                value: 'this.parentNode.nextSibling.hasAttribute("style")?this.parentNode.nextSibling.removeAttribute("style"):this.parentNode.nextSibling.setAttribute("style","display:none");'
                                            }
                                        ],
                                        content: 'X'
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
            idrinth.ui.base.appendChild ( idrinth.war.element );
        };
        idrinth.core.timeouts.add ( 'war', idrinth.war.getData, 5000, -1 );
        build ();
    }
};