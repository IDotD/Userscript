idrinth.tier = {
    /**
     *
     * @type {object}
     */
    list: { },
    /**
     *
     * @type {object}
     */
    taggedSlots: { },
    /**
     *
     * @param {string} name
     * @returns {undefined}
     */
    addTagged: function ( name ) {
        /**
         *
         * @param {string} key
         * @returns {Boolean}
         */
        var isValidParameter = function ( name ) {
            return name && idrinth.tier.list.hasOwnProperty ( name ) && typeof idrinth.tier.list[name] !== 'function' && !document.getElementById ( 'idrinth-tier-box-' + name );
        };
        /**
         *
         * @param {string} key
         * @returns {Boolean}
         */
        var isFreeSlot = function ( key ) {
            return idrinth.tier.taggedSlots.hasOwnProperty ( key ) && typeof key !== 'function' && idrinth.tier.taggedSlots[key] === null;
        };
        if ( !isValidParameter ( name ) ) {
            return;
        }
        var boss = this.list[name];
        /**
         *
         * @param {int} x
         * @param {string} name
         * @returns {undefined}
         */
        var make = function ( x, name ) {
            var makeElement = function ( label, number, description ) {
                return {
                    content: label + ' ' + idrinth.ui.formatNumber ( number ),
                    attributes: [ {
                            name: 'title',
                            value: description
                        } ]
                };
            };
            var info = [
                makeElement ( 'FS', boss.fs.nm, 'Fair share' ),
                makeElement ( 'AP', boss.ap, 'Achievement point damage' )
            ];
            if ( boss.os && boss.os.nm ) {
                info.push ( makeElement ( 'OS', boss.os.nm, 'Optimal share' ) );
                info.unshift ( makeElement ( 'MA', boss.nm[boss.nm.length - 1], 'Maximum/highest tier' ) );
                info.unshift ( makeElement ( 'MI', boss.nm[0], 'Minimum/lowest tier' ) );
            }
            info.unshift (
                    {
                        type: 'strong',
                        content: boss.name.replace ( /\(.*$/, '' )
                    } );
            idrinth.tier.taggedSlots[x] = idrinth.ui.buildElement (
                    {
                        id: 'idrinth-tier-box-' + name,
                        css: 'idrinth-hovering-box idrinth-tier-box',
                        children: [ {
                                children: info
                            } ],
                        attributes: [
                            {
                                name: 'title',
                                value: 'click to close'
                            },
                            {
                                name: 'onclick',
                                value: 'idrinth.ui.removeElement(this.id);idrinth.tier.taggedSlots[\'' + x + '\']=null;'
                            },
                            {
                                name: 'style',
                                value: 'left:' + x + 'px;background-image: url(https://dotd.idrinth.de/static/raid-image-service/' + boss.url + '/);'
                            }
                        ]
                    }
            );
            idrinth.ui.base.appendChild ( idrinth.tier.taggedSlots[x] );
        };
        for (var key in this.taggedSlots) {
            if ( isFreeSlot ( key ) ) {
                return make ( key, name );
            }
        }
        idrinth.core.alert ( idrinth.text.get ( "tier.maxBoxes" ) );
    },
    /**
     * initializes this module
     * @returns {undefined}
     */
    start: function ( ) {
        'use strict';
        var pos = 1;
        /**
         * parsed a json-response and fills tier list and exclusion list
         * @param {string} data
         * @returns {undefined}
         */
        var importData = function ( data ) {
            data = JSON.parse ( data );
            if ( data ) {
                idrinth.tier.list = data;
                /**
                 *
                 * @param {string} name
                 * @param {string} url
                 * @returns {undefined}
                 */
                var create = function ( name, url ) {
                    if ( !idrinth.settings.data.bannedRaids[name] ) {
                        idrinth.settings.data.bannedRaids[name] = false;
                        window.localStorage.setItem ( 'idotd', JSON.stringify ( idrinth.settings.data ) );
                    }
                    document.getElementById ( 'idrinth-raid-may-join-list' ).appendChild ( idrinth.ui.buildElement ( {
                        name: 'bannedRaids#' + name,
                        rType: '#input',
                        type: 'checkbox',
                        id: 'idrinth-raid-may-join-list-' + name,
                        label: idrinth.text.get ( "raids.disableJoining" ) + name
                    } ) );
                    document.getElementById ( 'idrinth-raid-may-join-list' ).lastChild.setAttribute ( 'style',
                            'background-image:url(https://dotd.idrinth.de/static/raid-image-service/' + url + '/);' );
                };
                for (var key in data) {
                    if ( data[key].name ) {
                        create ( data[key].name, data[key].url );
                    }
                }
            } else {
                idrinth.core.timeouts.add ( 'tier', idrinth.tier.start, 1000 );
            }
        };
        while ( 0 < window.innerWidth - 140 * ( pos + 1 ) ) {
            this.taggedSlots[( pos * 140 ).toString ( )] = null;
            pos++;
        }
        idrinth.core.ajax.runHome (
                'tier-service/',
                importData,
                function ( ) {
                    idrinth.core.timeouts.add ( 'tier', idrinth.tier.start, 10000 );
                },
                function ( ) {
                    idrinth.core.timeouts.add ( 'tier', idrinth.tier.start, 10000 );
                }
        );
    },
    /**
     * displays bosses that match both name and type
     * @returns {undefined}
     */
    getMatchingTiers: function ( ) {
        var name = document.getElementById ( 'idrinth-tierlist-namesearch' ).value;
        var type = document.getElementById ( 'idrinth-tierlist-typesearch' ).value;
        /**
         *
         * @param {HTMLElement} elem
         * @returns {undefined}
         */
        var clearInnerHtml = function ( elem ) {
            elem.innerHTML = '';
        };
        /**
         *
         * @param {string} list
         * @returns {undefined}
         */
        var makeList = function ( list ) {
            /**
             *
             * @param {string} listKey
             * @param {string} difficulty
             * @param {string} ic
             * @returns {object} for the buildElement wrapper
             */
            var makeField = function ( listKey, difficulty, ic ) {
                var ln = {
                    type: 'td'
                };
                try {
                    ln.styles = idrinth.tier.list[listKey].os[difficulty] === idrinth.tier[listKey][difficulty][ic] ? 'is-os' : '';
                } catch ( E ) {
                    idrinth.core.log ( E.toString ( ) );
                }
                try {
                    ln.content = idrinth.ui.formatNumber ( idrinth.tier.list[listKey][difficulty][ic] ) + ' ' +
                            idrinth.tier.list[listKey].epics[difficulty][ic] + 'E';
                } catch ( E2 ) {
                    idrinth.core.log ( E2.toString ( ) );
                    try {
                        ln.content = idrinth.ui.formatNumber ( idrinth.tier.list[listKey][difficulty][ic] );
                    } catch ( E3 ) {
                        idrinth.core.log ( E3.toString ( ) );
                    }
                }
                return ln;
            };
            /**
             *
             * @param {string} title
             * @param {object} dataset
             * @returns {HTMLElement}
             */
            var makeRow = function ( title, dataset ) {
                return {
                    type: 'tr',
                    children: [
                        {
                            type: 'th',
                            content: title
                        },
                        {
                            type: 'td',
                            content: idrinth.ui.formatNumber ( dataset.n )
                        },
                        {
                            type: 'td',
                            content: idrinth.ui.formatNumber ( dataset.h )
                        },
                        {
                            type: 'td',
                            content: idrinth.ui.formatNumber ( dataset.l )
                        },
                        {
                            type: 'td',
                            content: idrinth.ui.formatNumber ( dataset.nm )
                        }
                    ]
                };
            };
            var wrapper = document.getElementById ( 'idrinth-tierlist' );
            clearInnerHtml ( wrapper );
            for (var count = list.length - 1; count >= 0; count--) {
                var sub = idrinth.ui.buildElement ( {
                    css: 'tier-wrapper',
                    children: [
                        {
                            type: 'img',
                            attributes: [ {
                                    name: 'src',
                                    value: 'https://dotd.idrinth.de/static/raid-image-service/' + idrinth.tier.list[list[count]].url + '/'
                                } ]
                        },
                        {
                            type: 'strong',
                            content: idrinth.tier.list[list[count]].name
                        },
                        {
                            type: 'span',
                            content: idrinth.tier.list[list[count]].types.join ( ', ' )
                        },
                        {
                            type: 'button',
                            content: idrinth.text.get ( "tier.tag" ),
                            attributes: [
                                {
                                    name: 'onclick',
                                    value: 'idrinth.tier.addTagged(\'' + list[count].replace ( /'/g, '\\\'' ) + '\');'
                                },
                                {
                                    name: 'type',
                                    value: 'action'
                                }
                            ]
                        },
                        {
                            type: 'span',
                            content: 'AP: ' + idrinth.ui.formatNumber ( idrinth.tier.list[list[count]].ap )
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
                                                    content: '#'
                                                },
                                                {
                                                    type: 'th',
                                                    content: idrinth.text.get ( "tier.diff.normal" )
                                                },
                                                {
                                                    type: 'th',
                                                    content: idrinth.text.get ( "tier.diff.hard" )
                                                },
                                                {
                                                    type: 'th',
                                                    content: idrinth.text.get ( "tier.diff.legend" )
                                                },
                                                {
                                                    type: 'th',
                                                    content: idrinth.text.get ( "tier.diff.night" )
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'tbody',
                                    children: [
                                        makeRow ( 'FS', idrinth.tier.list[list[count]].fs ),
                                        makeRow ( 'OS', idrinth.tier.list[list[count]].os ),
                                        makeRow ( '', {
                                            n: '',
                                            l: '',
                                            h: '',
                                            nm: ''
                                        } )
                                    ]
                                }
                            ]
                        }
                    ]
                } );
                var maxTiers = Math.max ( idrinth.tier.list[list[count]].n.length, idrinth.tier.list[list[count]].h.length, idrinth.tier.list[list[count]].l.length, idrinth.tier.list[list[count]].nm.length );
                for (var ic = 0; ic < maxTiers; ic++) {
                    sub.lastChild.lastChild.appendChild ( idrinth.ui.buildElement ( {
                        type: 'tr',
                        children: [
                            {
                                type: 'th',
                                content: ic + 1
                            },
                            makeField ( list[count], 'n', ic ),
                            makeField ( list[count], 'h', ic ),
                            makeField ( list[count], 'l', ic ),
                            makeField ( list[count], 'nm', ic )
                        ]
                    } ) );
                }
                wrapper.appendChild ( sub );
            }
        };
        /**
         *
         * @param {Array} list
         * @param {RegExp} regExp
         * @returns {Boolean}
         */
        var matchesAny = function ( list, regExp ) {
            for (var count = 0; count < list.length; count++) {
                if ( list[count] && list[count].match ( regExp ) ) {
                    return true;
                }
            }
            return false;
        };
        if ( ( !name || name.length === 0 ) && ( !type || type.length === 0 ) ) {
            clearInnerHtml ( document.getElementById ( 'idrinth-tierlist' ) );
            return;
        }
        var result = [ ];
        var nameRegExp = new RegExp ( name, 'i' );
        var typeRegExp = new RegExp ( type, 'i' );
        for (var key in idrinth.tier.list) {
            if ( key.match ( nameRegExp ) && matchesAny ( idrinth.tier.list[key].types, typeRegExp ) ) {
                result.push ( key );
            }
        }
        makeList ( result );
    }
};
