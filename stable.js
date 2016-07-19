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
    war: {
        from: null,
        to: null,
        element: null,
        oc: function () {
            var c = idrinth.war.element.getAttribute ( 'class' );
            if ( c.indexOf ( 'small-window' ) > -1 ) {
                c = c.replace ( 'small-window' );
            } else {
                c = c + ' small-window';
            }
            idrinth.war.element.setAttribute ( 'class', c );
        },
        getData: function () {
            idrinth.runAjax (
                    "https://dotd.idrinth.de/" + ( idrinth.settings.isWorldServer ? "world-" : "" ) + idrinth.platform + "/war-service/" + idrinth.war.warRaids2Join () + "/"+Date.now ()+"/",
                    idrinth.war.updateData,
                    function () {
                        window.setTimeout ( idrinth.war.getData, 1000 );
                    },
                    function () {
                        window.setTimeout ( idrinth.war.getData, 2000 );
                    },
                    idrinth.raids.knowRaids ()
                    );
        },
        warRaids2Join: function () {
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
        },
        updateData: function ( data ) {
            function process ( data ) {
                function addRaids ( raids ) {
                    for (var key in raids) {
                        if ( idrinth.raids.joined[key] === undefined && idrinth.raids.list[key] === undefined ) {
                            idrinth.raids.list[key] = raids[key];
                        }
                    }
                }
                function updateBoss ( data, element ) {
                    while ( element.getElementsByTagName ( 'td' )[3].firstChild ) {
                        element.getElementsByTagName ( 'td' )[3].removeChild ( element.getElementsByTagName ( 'td' )[3].firstChild );
                    }
                    if(data.magics!==null&&data.magics!=='') {
                        var tmp = data.magics.split ( ',' );
                        for (var key = 0; key < tmp.length; key++) {
                            element.getElementsByTagName ( 'td' )[3].appendChild (
                                    idrinth.ui.buildElement ( {
                                        type: 'img',
                                        attributes: [
                                            { name: 'src', value: 'https://dotd.idrinth.de/static/magic-image-service/' + data.magics.split ( ',' )[key] + '/' },
                                            { name: 'width', value: '20' }
                                        ] } )
                                    );
                        }
                    }
                    element.getElementsByTagName ( 'td' )[0].setAttribute ( "class", 'traffic ' + ( data.amount < 90 ? 'yes' : ( data.amount > 110 ? 'no' : 'maybe' ) ) );
                    element.getElementsByTagName ( 'td' )[0].setAttribute ( "title", data.amount + '/100' );
                    element.getElementsByTagName ( 'td' )[0].firstChild.innerHTML = ( data.amount < 90 ? 'yes' : ( data.amount > 110 ? 'no' : 'maybe' ) );
                }
                function newBoss ( data, boss ) {
                    var magics = [ ];
                    if(data.magics!==null&&data.magics!=='') {
                        var tmp = data.magics.split ( ',' );
                        for (var key = 0; key < tmp.length; key++) {
                            magics.push ( {
                                type: 'img',
                                attributes: [
                                    { name: 'src', value: 'https://dotd.idrinth.de/static/magic-image-service/' + data.magics.split ( ',' )[key] + '/' },
                                    { name: 'width', value: '20' }
                                ] }
                            );
                        }
                    }
                    idrinth.war.element.childNodes[1].appendChild ( idrinth.ui.buildElement (
                            {
                                type: 'tr',
                                id: 'idrinth-war-' + boss,
                                children: [
                                    {
                                        type: 'td',
                                        css: 'traffic ' + ( data.amount < 90 ? 'yes' : ( data.amount > 110 ? 'no' : 'maybe' ) ),
                                        children: [ { type: 'span', content: ( data.amount < 90 ? 'yes' : ( data.amount > 110 ? 'no' : 'maybe' ) ) } ],
                                        attributes: [
                                            { name: 'title', value: data.amount + '/100' }
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
                                                    { name: 'type', value: 'checkbox' },
                                                    { name: 'data-id', value: boss },
                                                    { name: 'title', value: 'join ' + data.name }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'td',
                                        children: magics
                                    }
                                ]
                            }
                    ) );
                }
                if ( data === "" || data === "null" ) {
                    return;
                }
                if ( data === "{}" ) {
                    idrinth.war.element.setAttribute ( 'style', 'display:none' );
                    while ( idrinth.war.element.childNodes[1].childNodes[1].firstChild ) {
                        idrinth.war.element.childNodes[1].childNodes[1].removeChild ( idrinth.war.element.childNodes[1].firstChild.firstChild );
                    }
                    return;
                }
                idrinth.war.element.setAttribute ( 'style', '' );
                var classes = idrinth.war.element.getAttribute ( 'class');
                idrinth.war.element.setAttribute ( 'class', idrinth.settings.warBottom?classes+' bottom':classes.replace(/ bottom/g,'') );
                try {
                    data = JSON.parse ( data );
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
                } catch ( e ) {}
            }
            process ( data );
            window.setTimeout ( idrinth.war.getData, 50000 + Math.random () % 20000 );
        },
        start: function () {
            window.setTimeout ( idrinth.war.getData, 5000 );
        }
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
            }
        },
        rejoin: function () {
            try {
                window.clearInterval ( idrinth.raids.interval );
            } catch ( e ) {
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
                idrinth.newgrounds.raids.push ( key );
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
                window.alert ( 'We\'re done! Have fun playing.' );
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
                            }
                        }
                        try {
                            idrinth.ui.removeElement ( 'idrinth-raid-link-' + key );
                        } catch ( e1 ) {
                        }
                        try {
                            idrinth.raids.joined[key] = idrinth.raids.list[key];
                        } catch ( e2 ) {
                        }
                        try {
                            delete idrinth.raids.list[key];
                        } catch ( e3 ) {
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
        sc.setAttribute ( 'src', 'https://dotd.idrinth.de/static/userscript/' + Math.random ()+'/' );
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
            if ( request.readyState === 4) {
                var successCode=(request.status > 199 && request.status < 300) || request.status === 0;
                if( successCode  && typeof success === 'function' ) {
                    success ( request.responseText );
                } else if ( !successCode && typeof failure === 'function') {
                    failure ( request );
                }
            }
            if ( request.readyState === 4 ) {
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
    tier: {
        list: { },
        start: function () {
            'use strict';
            idrinth.runAjax (
                    'https://dotd.idrinth.de/' + idrinth.platform + '/tier-service/',
                    function ( text ) {
                        idrinth.tier.import ( text );
                    },
                    function ( ) {
                        window.setTimeout ( function () {
                            idrinth.tier.start ();
                        }, 10000 );
                    },
                    function ( ) {
                        window.setTimeout ( function () {
                            idrinth.tier.start ();
                        }, 10000 );
                    }
            );
        },
        import: function ( data ) {
            'use strict';
            data = JSON.parse ( data );
            if ( data ) {
                idrinth.tier.list = data;
            } else {
                window.setTimeout ( idrinth.tier.start, 1000 );
            }
        },
        getTierForName: function ( name ) {
            var result = [ ];
            var regExp = new RegExp ( name, 'i' );
            for (var key in idrinth.tier.list) {
                if ( key.match ( regExp ) ) {
                    result.push ( key );
                }
            }
            idrinth.ui.makeTierList ( result );
        }
    },
    land: {
        calculate: function () {
            for (var key in idrinth.settings.land) {
                idrinth.settings.land[key] = parseInt ( document.getElementById ( 'idrinth-land-' + key ).value );
            }
            var results = idrinth.settings.landMax ? idrinth.land.useUp () : idrinth.land.bestPrice ();
            if(Object.keys (results).length===0) {
                window.alert('You lack gold to buy any more buildings at the moment.');
            }
            idrinth.land.putResults ( results );
        },
        bestPrice: function () {
            var factor = idrinth.settings.factor ? 10 : 1;
            var results = { };
            while ( idrinth.settings.land.gold >= 0 ) {
                var min = null;
                var minKey = null;
                for (var key in idrinth.land.data) {
                    if (
                            min === null ||
                            ( 10 + idrinth.settings.land[key] ) * idrinth.land.data[key].base / idrinth.land.data[key].perHour < min )
                    {
                        min = ( 10 + idrinth.settings.land[key] ) * idrinth.land.data[key].base / idrinth.land.data[key].perHour;
                        minKey = key;
                    }
                }
                if ( minKey === null ) {
                    return results;
                }
                var price = ( 10 + idrinth.settings.land[minKey] ) * factor * idrinth.land.data[minKey].base / 10;
                if ( price > idrinth.settings.land.gold ) {
                    idrinth.land.putResults ( results );
                    return;
                }
                idrinth.settings.land.gold = idrinth.settings.land.gold - price;
                results[minKey] = ( results[minKey] === undefined ? 0 : results[minKey] ) + factor;
                idrinth.settings.land[minKey] = idrinth.settings.land[minKey] + factor;
            }
            return results;
        },
        useUp: function () {
            var factor = idrinth.settings.factor ? 10 : 1;
            var results = { };
            while ( idrinth.settings.land.gold >= 0 ) {
                var min = null;
                var minKey = null;
                for (var key in idrinth.land.data) {
                    if (
                            ( min === null ||
                                    ( 10 + idrinth.settings.land[key] ) * idrinth.land.data[key].base / idrinth.land.data[key].perHour < min )
                            && ( 10 + idrinth.settings.land[key] ) * factor * idrinth.land.data[key].base / 10 <= idrinth.settings.land.gold )
                    {
                        min = ( 10 + idrinth.settings.land[key] ) * idrinth.land.data[key].base / idrinth.land.data[key].perHour;
                        minKey = key;
                    }
                }
                if ( minKey === null ) {
                    return results;
                }
                idrinth.settings.land.gold = idrinth.settings.land.gold - ( 10 + idrinth.settings.land[minKey] ) * factor * idrinth.land.data[minKey].base / 10;
                results[minKey] = ( results[minKey] === undefined ? 0 : results[minKey] ) + factor;
                idrinth.settings.land[minKey] = idrinth.settings.land[minKey] + factor;
            }
            return results;
        },
        putResults: function ( results ) {
            for (var key in results) {
                document.getElementById ( 'idrinth-land-' + key ).value = idrinth.settings.land[key];
                document.getElementById ( 'idrinth-land-' + key ).parentNode.nextSibling.innerHTML = '+' + results[key];
            }
            document.getElementById ( 'idrinth-land-gold' ).value = idrinth.settings.land.gold;
            idrinth.settings.save ();
        },
        data: {
            cornfield: { perHour: 100, base: 4000 },
            stable: { perHour: 300, base: 15000 },
            barn: { perHour: 400, base: 25000 },
            store: { perHour: 700, base: 50000 },
            pub: { perHour: 900, base: 75000 },
            inn: { perHour: 1200, base: 110000 },
            tower: { perHour: 2700, base: 300000 },
            fort: { perHour: 4500, base: 600000 },
            castle: { perHour: 8000, base: 1200000 }
        }
    },
    names: {
        load: function ( added) {
            'use strict';
            idrinth.runAjax (
                    'https://dotd.idrinth.de/' + idrinth.platform + '/users-service/'+added,
                    function ( text ) {
                        idrinth.names.import ( text );
                    }
                );
        },
        import: function ( data ) {
            'use strict';
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
        },
        run: function ( ) {
            'use strict';
            try{
                if ( idrinth.names.counter % 300 === 0 || Object.keys ( idrinth.names.users ).length === 0) {
                    idrinth.names.load ( Object.keys ( idrinth.names.classes ).length === 0?'init/':'get/' );
                } else if ( Object.keys ( idrinth.names.users ).length > 0 ) {
                    idrinth.names.add ( );
                }
            } catch(e) {
                console.log (e);
            }
            idrinth.names.counter = idrinth.names.counter + 1;
            idrinth.names.ownTimeout = window.setTimeout ( function ( ) {
                idrinth.names.run ( );
            }, 6666 );
        },
        users: { },
        classes: { },
        guilds: { },
        ownTimeout: null,
        add: function ( ) {
            'use strict';
            var el = document.getElementsByClassName ( 'username' );
            var name = '';
            var count = 0;
            for (count = el.length - 1; count >= 0; count--) {
                try {
                    name = idrinth.names.parse ( el[count] );
                    if ( el[count].getAttribute ( 'onmouseover' ) !== 'idrinth.ui.showTooltip()(this);' && idrinth.ui.childOf ( el[count], 'chat_message_window' ) ) {
                        el[count].setAttribute ( 'onmouseover', 'idrinth.ui.showTooltip(this);' );
                    }
                    if ( !idrinth.names.users[name.toLowerCase ( )] && name.length > 0 ) {
                        idrinth.names.users[name.toLowerCase()] = { };
                        idrinth.runAjax (
                           'https://dotd.idrinth.de/' + idrinth.platform + '/users-service/add/'+encodeURIComponent(name)+'/'
                        );
                    }
                } catch ( e ) {
                }
            }
        },
        parse: function ( element ) {
            'use strict';
            if ( element.getAttribute ( 'dotdxname' ) ) {
                return ( element.getAttribute ( 'dotdxname' ) );
            }
            if ( element.getAttribute ( 'username' ) ) {
                return ( element.getAttribute ( 'username' ) );
            }
            return ( element.innerHTML ).replace ( /(<([^>]+)>)/ig, "" );
        },
        start: function ( ) {
            'use strict';
            if ( idrinth.platform === 'kongregate' ) {
                idrinth.names.ownTimeout = window.setTimeout ( function ( ) {
                    idrinth.names.run ( );
                }, 10000 );
            }
        },
        counter: 0
    },
    platform: '',
    realSite: '',
    settings: {
        raids: false,
        favs: '',
        factor: true,
        moveLeft: false,
        minimalist: false,
        names: true,
        timeout: 5000,
        loadtime: 5000,
        windows: 3,
        warBottom:false,
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
                    if ( key === 'land' ) {
                        for (var building in idrinth.settings.land) {
                            if ( typeof idrinth.settings[key] !== 'function' ) {
                                window.localStorage.setItem ( 'idrinth-dotd-land-' + building, idrinth.settings.land[building] );
                            }
                        }
                    } else if ( typeof idrinth.settings[key] !== 'function' ) {
                        window.localStorage.setItem ( 'idrinth-dotd-' + key, idrinth.settings[key] );
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
            if ( window.localStorage ) {
                'use strict';
                for (var key in idrinth.settings) {
                    if ( key === 'land' ) {
                        for (var building in idrinth.settings.land) {
                            if ( typeof idrinth.settings[key] !== 'function' ) {
                                var tmp = window.localStorage.getItem ( 'idrinth-dotd-land-' + building );
                                if ( tmp ) {
                                    idrinth.settings.land[building] = tmp;
                                }
                            }
                        }
                    } else if ( typeof idrinth.settings[key] !== 'function' ) {
                        var tmp = window.localStorage.getItem ( 'idrinth-dotd-' + key );
                        if ( tmp ) {
                            if ( tmp === 'false' ) {
                                tmp = false;
                            } else if ( tmp === 'true' ) {
                                tmp = true;
                            }
                            idrinth.settings[key] = tmp;
                        }
                    }
                }
            }
        }
    },
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
        makeTierList: function ( list ) {
            var makeField=function(listKey,difficulty,ic) {
                var ln={type: 'td'};
                try{
                    ln.styles= idrinth.tier.list[listKey].os[difficulty]===idrinth.tier[listKey][difficulty][ic]?'is-os':'';
                } catch(E) {
                    idrinth.log( E.toString( ));
                }
                try{
                    ln.content= idrinth.ui.formatNumber ( idrinth.tier.list[listKey][difficulty][ic])+' '+
                                idrinth.tier.list[listKey].epics[difficulty][ic]+'E';
                } catch(E2) {
                    idrinth.log( E2.toString( ));
                    try{
                        ln.content= idrinth.ui.formatNumber ( idrinth.tier.list[listKey][difficulty][ic]);
                    } catch(E3) {
                        idrinth.log( E3.toString( ));
                    }
                }
                return ln;
            };
            var wrapper = document.getElementById ( 'idrinth-tierlist' );
            wrapper.innerHTML = '';
            for (var count = list.length - 1; count >= 0; count--) {
                var sub = idrinth.ui.buildElement ( { type: 'div', css: 'tier-wrapper', children: [
                        { type: 'img', attributes: [ { name: 'src', value: 'https://dotd.idrinth.de/static/raid-image-service/' + idrinth.tier.list[list[count]].url + '/' } ] },
                        { type: 'strong', content: idrinth.tier.list[list[count]].name },
                        { type: 'span', content: 'AP: ' + idrinth.ui.formatNumber ( idrinth.tier.list[list[count]].ap ) },
                        { type: 'table', children: [
                                { type: 'thead', children: [
                                        { type: 'tr', children: [
                                                { type: 'th', content: '#' },
                                                { type: 'th', content: 'Normal' },
                                                { type: 'th', content: 'Hard' },
                                                { type: 'th', content: 'Legend' },
                                                { type: 'th', content: 'Nightmare' }
                                            ] }
                                    ] },
                                { type: 'tbody', children: [
                                        { type: 'tr', children: [
                                                { type: 'th', content: 'FS' },
                                                { type: 'td', content: idrinth.ui.formatNumber ( idrinth.tier.list[list[count]].fs.n ) },
                                                { type: 'td', content: idrinth.ui.formatNumber ( idrinth.tier.list[list[count]].fs.h ) },
                                                { type: 'td', content: idrinth.ui.formatNumber ( idrinth.tier.list[list[count]].fs.l ) },
                                                { type: 'td', content: idrinth.ui.formatNumber ( idrinth.tier.list[list[count]].fs.nm ) }
                                            ] },
                                        { type: 'tr', children: [
                                                { type: 'th', content: 'OS' },
                                                { type: 'td', content: idrinth.ui.formatNumber ( idrinth.tier.list[list[count]].os.n ) },
                                                { type: 'td', content: idrinth.ui.formatNumber ( idrinth.tier.list[list[count]].os.h ) },
                                                { type: 'td', content: idrinth.ui.formatNumber ( idrinth.tier.list[list[count]].os.l ) },
                                                { type: 'td', content: idrinth.ui.formatNumber ( idrinth.tier.list[list[count]].os.nm ) }
                                            ] },
                                        { type: 'tr', children: [
                                                { type: 'td' },
                                                { type: 'td' },
                                                { type: 'td' },
                                                { type: 'td' },
                                                { type: 'td' }
                                            ] }
                                    ] }
                            ] }
                    ] } );
                var maxTiers = Math.max ( idrinth.tier.list[list[count]].n.length, idrinth.tier.list[list[count]].h.length, idrinth.tier.list[list[count]].l.length, idrinth.tier.list[list[count]].nm.length );
                for (var ic = 0; ic < maxTiers; ic++) {
                    sub.lastChild.lastChild.appendChild ( idrinth.ui.buildElement ( { type: 'tr', children: [
                            { type: 'th', content: ic + 1 },
                            makeField(list[count],'n',ic),
                            makeField(list[count],'h',ic),
                            makeField(list[count],'l',ic),
                            makeField(list[count],'nm',ic)
                    ]}));
                }
                wrapper.appendChild ( sub );
            }
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
                                    { name: 'title', value: name + "\n" + 'ID:' + id + "\nPassword: " + pass },
                                    { name: 'onclick', value: 'idrinth.chat.enableChat(this);' }
                                ]
                            }
                    )
                    );
        },
        buildBasis: {
            makeTabs: function ( config ) {
                var head = new Array ();
                var first = true;
                var body = new Array ();
                for (var name in config) {
                    head.push ( {
                        type: 'li',
                        content: name,
                        css: 'tab-activator' + ( first ? ' active' : '' ),
                        id: 'tab-activator-' + name.toLowerCase (),
                        attributes: [
                            { name: 'onclick', value: 'idrinth.ui.activateTab(\'' + name.toLowerCase () + '\');' },
                            { name: 'style', value: 'width:' + Math.floor ( 100 / ( Object.keys ( config ) ).length ) + '%;' }
                        ]
                    } );
                    body.push ( {
                        type: 'li',
                        css: 'tab-element',
                        id: 'tab-element-' + name.toLowerCase (),
                        attributes: [
                            { name: 'style', value: first ? 'display:block;' : 'display:none;' }
                        ],
                        children: config[name]
                    } );
                    first = false;
                }
                return [
                    { type: 'ul', children: head, attributes: [ { name: 'style', value: 'margin:0;padding:0;overflow:hidden;width:100%;' } ] },
                    { type: 'ul', children: body, attributes: [ { name: 'style', value: 'margin:0;padding:0;overflow-x:hidden;width:100%;max-height: 500px;overflow-y: scroll;' } ] }
                ];
            },
            makeInputLabel: function ( config ) {
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
                function getServerPart(name) {
                    return [  {
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
                        },{type:'span',content:'Server: '+name} ];
                }
                idrinth.ui.tooltip = idrinth.ui.buildElement ( {
                    css: 'idrinth-hovering-box idrinth-tooltip-overwrite',
                    type: 'div',
                    id: 'idrinth-tooltip',
                    children:[
                        {type:'div',children: getServerPart('Kongregate')},
                        {type:'div',children: getServerPart('World')}
                    ],
                    attributes:[
                        {name:'onmouseenter',value:'idrinth.names.isHovering=true;'},
                        {name:'onmouseleave',value:'idrinth.names.isHovering=false;'}
                    ]
                } );
                idrinth.ui.body.appendChild ( idrinth.ui.tooltip );
            }
        },
        buildElement: function ( config ) {
            'use strict';
            if ( config.type === '#text' ) {
                return document.createTextNode ( config.content );
            }
            if ( config.rType === '#input' ) {
                return idrinth.ui.buildBasis.makeInputLabel ( config );
            }
            var el = document.createElement ( config.type );
            if ( config.id ) {
                el.id = config.id;
            }
            if ( config.css ) {
                el.setAttribute ( 'class', config.css );
            }
            if ( config.content ) {
                el.appendChild ( document.createTextNode ( config.content ) );
            }
            if ( config.attributes && config.attributes.length > 0 ) {
                for (var count = 0; count < config.attributes.length; count++) {
                    el.setAttribute ( config.attributes[count].name, config.attributes[count].value );
                }
            }
            if ( config.children && config.children.length > 0 ) {
                for (var count = 0; count < config.children.length; count++) {
                    el.appendChild ( idrinth.ui.buildElement ( config.children[count] ) );
                }
            }
            return el;
        },
        controls: null,
        tooltipTO: null,
        showTooltip: function ( element ) {
            function tooltip(set,element,pos,guilds,platform) {
                element.setAttribute ( 'style','display:none');
                if(set) {
                    element.childNodes[0].setAttribute ( 'href', 'https://dotd.idrinth.de/' + platform + '/summoner/' + set.id + '/' );
                    element.childNodes[0].innerHTML = set.name;
                    element.childNodes[1].childNodes[1].innerHTML = set.level+' ('+set['7day']+'/week, '+set['30day']+'/month)';
                    element.childNodes[1].childNodes[3].innerHTML = idrinth.names.classes[set.class];
                    element.childNodes[2].childNodes[1].setAttribute ( 'href', 'https://dotd.idrinth.de/' + platform + '/guild/' + set.guildId + '/' );
                    element.childNodes[2].childNodes[1].innerHTML = guilds[set.guildId];
                    element.childNodes[3].childNodes[1].innerHTML = set.updated;
                    element.childNodes[3].setAttribute ( 'style', ( new Date () ) - ( new Date ( set.updated ) ) > 86400000 ? 'color:#aa0000;' : '' );
                    element.setAttribute ( 'style','');
                    idrinth.ui.tooltip.setAttribute ( 'style', 'left:' + Math.round ( pos.left - 200 ) + 'px;top:' + Math.round ( pos.top - 100 ) + 'px;' );
                }
            }
            'use strict';
            var pos = null;
            var name = idrinth.names.parse ( element ).toLowerCase ( );
            if ( idrinth.settings.names && idrinth.ui.tooltip && idrinth.names.users[name] ) {
                window.clearTimeout ( idrinth.ui.tooltipTO );
                pos = element.getBoundingClientRect ( );
                tooltip(idrinth.names.users[name].kongregate,idrinth.ui.tooltip.firstChild,pos,idrinth.names.guilds.kongregate,'kongregate');
                tooltip(idrinth.names.users[name].world,idrinth.ui.tooltip.lastChild,pos,idrinth.names.guilds.world,'world-kongregate');
                idrinth.ui.tooltipTO = window.setTimeout (
                            idrinth.ui.hideTooltip,
                            idrinth.settings.timeout ? idrinth.settings.timeout : 5000
                        );
            }
        },
        hideTooltip:function() {
                    if(idrinth.names.isHovering) {
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
            if ( idrinth.realSite === 'kongregate' ) {
                window.activateGame ( );
            } else if ( idrinth.realSite === 'dawnofthedragons' ) {
                document.getElementsByTagName ( 'iframe' )[0].setAttribute ( 'src', 'https://web1.dawnofthedragons.com/live_standalone/?idrinth_nc' + ( new Date ( ) ).getTime ( ) );
            } else if ( idrinth.realSite === 'newgrounds' ) {
                var frame = document.getElementById ( 'iframe_embed' ).getElementsByTagName ( 'iframe' )[0];
                frame.setAttribute ( 'src', ( frame.getAttribute ( 'src' ) ).replace ( /&ir=.*/, '' ) + '&ir=' + Math.random () );
            } else if ( idrinth.realSite === 'armorgames' ) {
                var frame = document.getElementById ( 'gamefilearea' ).getElementsByTagName ( 'iframe' )[0];
                frame.setAttribute ( 'src', ( frame.getAttribute ( 'src' ) ).replace ( /&ir=.*/, '' ) + '&ir=' + Math.random () );
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
                        value: 'https://dotd.idrinth.de/idrinth-dotd-script.css?' + idrinth.version
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
    user: {
        token: '',
        id: 0,
        name: '',
        identifier: '',
        start: function ( ) {
            'use strict';
            if ( idrinth.realSite === 'kongregate' ) {
                idrinth.user.name = active_user._attributes.get ( 'username' );
                idrinth.user.token = active_user.gameAuthToken ( );
                idrinth.user.id = active_user.id ( );
            } else if ( idrinth.realSite === 'newgrounds' ) {
                idrinth.user.name = Cookies.get ( 'NG_GG_username' );
            } else if ( idrinth.realSite === 'armorgames' ) {
                var ag = document.getElementById ( 'gamefilearea' ).children[0].src.match ( /^.+user_id=([a-f\d]{32})&auth_token=([a-f\d]{32}).+$/ );
                idrinth.user.name = window.u_name;
                idrinth.user.id = ag[1];
                idrinth.user.token = ag[2];
            }
            window.setTimeout ( idrinth.user.sendAlive, 20000 );
        },
        sendAlive: function () {
            function guid () {
                //from http://stackoverflow.com/a/105074
                function s4 () {
                    return Math.floor ( ( 1 + Math.random () ) * 0x10000 ).toString ( 36 );
                }
                return s4 () + '-' +
                        s4 () + s4 () + '-' +
                        s4 () + s4 () + s4 () + '-' +
                        s4 () + s4 () + s4 () + s4 () + '-' +
                        s4 () + s4 () + s4 () + s4 () + s4 () + '-' +
                        s4 () + s4 () + s4 () + s4 () + s4 () + s4 ();
            }
            if ( window.localStorage ) {
                idrinth.user.identifier = window.localStorage.getItem ( 'idrinth-dotd-uuid' );
                if ( !idrinth.user.identifier || idrinth.user.identifier === '' || idrinth.user.identifier === null || !idrinth.user.identifier.match (/^[a-z0-9]{4}-[a-z0-9]{8}-[a-z0-9]{12}-[a-z0-9]{16}-[a-z0-9]{20}-[a-z0-9]{24}$/) ) {
                    idrinth.user.identifier = guid ();
                }
                window.localStorage.setItem ( 'idrinth-dotd-uuid', idrinth.user.identifier );
                idrinth.runAjax ( 'https://dotd.idrinth.de/' +
                        ( idrinth.settings.isWorldServer ? 'world-' : '' ) + idrinth.platform +
                        '/i-am-alive/' + idrinth.user.identifier + '/' );
            }
        }
    },
    chat: {
        maxId: 0,
        messages: [ ],
        oldMessages: [ ],
        elements: {
            chats: null,
            menu: null
        },
        chatRank: { },
        refreshCount: 0,
        refreshChats: function () {
            idrinth.chat.oldMessages = JSON.parse ( JSON.stringify ( idrinth.chat.messages ) );
            idrinth.chat.messages = new Array ();
            idrinth.runAjax (
                    'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/update/',
                    idrinth.chat.applyMessages,
                    idrinth.chat.returnMessages,
                    idrinth.chat.returnMessages,
                    JSON.stringify ( { maxId: idrinth.chat.maxId, messages: idrinth.chat.oldMessages } )
                    );
            if ( idrinth.chat.refreshCount % 25 === 0 ) {
                idrinth.chat.refreshMembers ();
            }
            idrinth.chat.refreshCount++;
        },
        refreshMembers: function () {
            idrinth.runAjax (
                    'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/accounts/',
                    idrinth.chat.applyMembers,
                    function () {
                        window.setTimeout ( idrinth.chat.refreshMembers, 1000 );
                    },
                    function () {
                        window.setTimeout ( idrinth.chat.refreshMembers, 1000 );
                    },
                    ''
                    );
        },
        returnMessages: function ( data ) {
            for (var count = idrinth.chat.oldMessages.length - 1; count >= 0; count--) {
                idrinth.chat.messages.unshift ( idrinth.chat.oldMessages[count] );
            }
            idrinth.chat.oldMessages = new Array ();
            window.setTimeout ( idrinth.chat.refreshChats, 666 );
        },
        userclick: function ( element, user, chat ) {
            if ( !idrinth.chat.chatRank[chat] || idrinth.chat.chatRank[chat] === 'User' ) {
                return;//Users can't do stuff
            }
            var options = [ ];
            options.push (
                    idrinth.ui.buildElement (
                            { type: 'li', content: 'Ban User', attributes: [
                                    {
                                        name: 'onclick',
                                        value: 'idrinth.chat.useroptions(' + chat + ',' + user + ',\'Banned\');this.parentNode.parentNode.removeChild(this.parentNode);'
                                    }
                                ] } ) );
            if ( idrinth.chat.chatRank[chat] === 'Owner' ) {
                options.push (
                        idrinth.ui.buildElement (
                                { type: 'li', content: 'Make Moderator', attributes: [
                                        {
                                            name: 'onclick',
                                            value: 'idrinth.chat.useroptions(' + chat + ',' + user + ',\'Mod\');this.parentNode.parentNode.removeChild(this.parentNode);'
                                        }
                                    ] } ) );
                options.push (
                        idrinth.ui.buildElement (
                                { type: 'li', content: 'Make Admin', attributes: [
                                        {
                                            name: 'onclick',
                                            value: 'idrinth.chat.useroptions(' + chat + ',' + user + ',\'Owner\');this.parentNode.parentNode.removeChild(this.parentNode);'
                                        }
                                    ] } ) );
                options.push (
                        idrinth.ui.buildElement (
                                { type: 'li', content: 'Make User', attributes: [
                                        {
                                            name: 'onclick',
                                            value: 'idrinth.chat.useroptions(' + chat + ',' + user + ',\'User\');this.parentNode.parentNode.removeChild(this.parentNode);'
                                        }
                                    ] } ) );
            }
            options.push (
                    idrinth.ui.buildElement (
                            { type: 'li', content: 'Close', attributes: [
                                    {
                                        name: 'onclick',
                                        value: 'this.parentNode.parentNode.removeChild(this.parentNode);'
                                    }
                                ] } ) );
            var list = document.createElement ( 'ul' );
            for (var count = 0; count < options.length; count++) {
                list.appendChild ( options[count] );
            }
            list.setAttribute ( 'class', 'idrinth-userinfo-box' );
            var pos = idrinth.ui.getPosition ( element );
            list.setAttribute ( 'style', 'left:' + pos.x + 'px;top:' + pos.y + 'px' );
            idrinth.ui.body.appendChild ( list );
        },
        useroptions: function ( chat, user, rank ) {
            idrinth.runAjax (
                    'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/rank/',
                    function ( reply ) {
                        try {
                            reply = JSON.parse ( reply );
                            alert ( reply.message );
                        } catch ( e ) {
                        }
                    },
                    function ( reply ) {
                        alert ( 'Can\'t modify that user at the moment' );
                    },
                    function ( reply ) {
                        alert ( 'Can\'t modify that user at the moment' );
                    },
                    JSON.stringify ( { chat: chat, user: user, access: rank } )
                    );
        },
        replaceInText: function ( message, regex, callbacks, lastField ) {
            try {
                var matches = message.match ( regex );
                var text = ( message.replace ( regex, '$1########$' + lastField ) ).split ( '########' );
                var textcontent = [ ];
                var length = matches.length + text.length;
                for (var count = 0; count < length; count++) {
                    if ( count % 2 === 0 && typeof callbacks[1] === 'function' ) {
                        var tmp = callbacks[1] ( text[Math.ceil ( count / 2 )] );
                        for (var c2 = 0; c2 < tmp.length; c2++) {
                            if ( tmp[c2] !== undefined ) {
                                textcontent.push ( tmp[c2] );
                            }
                        }
                    } else if ( count % 2 === 0 ) {
                        if ( text[Math.ceil ( count / 2 )] !== undefined ) {
                            textcontent.push ( { type: '#text', content: text[Math.ceil ( count / 2 )] } );
                        }
                    } else {
                        textcontent.push ( callbacks[0] ( matches[Math.ceil ( ( count - 1 ) / 2 )] ) );
                    }
                }
                return textcontent;
            } catch ( e ) {
                if ( typeof callbacks[1] === 'function' ) {
                    var textcontent = [ ];
                    var tmp = callbacks[1] ( message );
                    for (var c2 = 0; c2 < tmp.length; c2++) {
                        textcontent.push ( tmp[c2] );
                    }
                    return textcontent;
                }
                return [ { type: '#text', content: message } ];
            }
        },
        buildEmoticons: function ( message ) {
            if ( !idrinth.chat.emotes.lookup ) {
                return message;
            }
            var part = idrinth.escapeRegExp ( Object.keys ( idrinth.chat.emotes.lookup ).join ( 'TTTT' ) );
            var reg = new RegExp ( '(^| )(' + part.replace ( /TTTT/g, '|' ) + ')($| )', 'g' );
            return idrinth.chat.replaceInText ( message, reg, [ function ( match ) {
                    var el = idrinth.chat.emotes.positions[idrinth.chat.emotes.lookup[match.replace ( / /g, '' )]];
                    return { type: 'span', css: 'idrinth-emoticon',
                        attributes: [
                            { name: 'style', value: 'background-position: 0px -' + el / 8 + 'px;' },
                            { name: 'title', value: message }
                        ], children: [
                            {
                                type: 'span',
                                attributes: [
                                    { name: 'style', value: 'background-position: 0px -' + el / 2 + 'px;' }
                                ]
                            }
                        ]
                    };
                } ], 3 );
        },
        buildMessageText: function ( message ) {
            var reg = new RegExp ( '(^|\\W)(https?://([^/ ]+)(/.*?)?)($| )', 'ig' );
            return idrinth.chat.replaceInText ( message, reg, [ function ( match ) {
                    return { type: 'a',
                        content: match.match ( /:\/\/([^\/]+?)(\/|$)/ )[1],
                        attributes: [
                            { name: 'href', value: match },
                            { name: 'title', value: 'Go to ' + match },
                            { name: 'target', value: '_blank' }
                        ]
                    };
                }, idrinth.chat.buildEmoticons ], 5 );
        },
        applyMessages: function ( data ) {
            if ( !data ) {
                return idrinth.chat.returnMessages ( data );
            }
            data = JSON.parse ( data );
            if ( !data ) {
                return idrinth.chat.returnMessages ( data );
            }
            if ( data.login ) {
                return idrinth.chat.relogin ();
            }
            if ( data.messages ) {
                if ( idrinth.chat.maxId === 0 ) {
                    idrinth.chat.maxId = 1;
                }
                for (var key in data.messages) {
                    if ( document.getElementById ( 'idrinth-chat-tab-' + key ) && document.getElementById ( 'idrinth-chat-tab-' + key ).getElementsByTagName ( 'ul' )[1] ) {
                        var chat = document.getElementById ( 'idrinth-chat-tab-' + key ).getElementsByTagName ( 'ul' )[1];
                        var tab = document.getElementById ( 'idrinth-chat-tab-click-' + key );
                        var isNew = false;
                        for (var key2 in data.messages[key]) {
                            if ( parseInt ( key2 ) < 1 || !document.getElementById ( 'idrinth-single-chat-message-' + key2 ) ) {
                                isNew = true;
                                chat.appendChild ( idrinth.ui.buildElement (
                                        {
                                            type: 'li',
                                            id: 'idrinth-single-chat-message-' + key2 + ( parseInt ( key2 ) < 1 ? '-' + idrinth.getfullDateInt () : '' ),
                                            css: ( parseInt ( data.messages[key][key2].user ) === parseInt ( data.self ) ? 'self-written' : '' ),
                                            children: [
                                                { type: 'span', css: 'time', content: data.messages[key][key2].time.split ( ' ' )[1], attributes: [ { name: 'title', value: data.messages[key][key2].time } ] },
                                                { type: 'span', css: 'user', content: idrinth.chat.users[data.messages[key][key2].user].name, attributes:
                                                            [
                                                                { name: 'data-id', value: data.messages[key][key2].user },
                                                                { name: 'style', value: data.messages[key][key2].user === 0 ? 'font-weight:bold' : '' },
                                                                { name: 'onclick', value: 'idrinth.chat.userclick(this,' + data.messages[key][key2].user + ',' + key + ')' }
                                                            ]
                                                },
                                                { type: '#text', content: ':' },
                                                { type: 'span', children: idrinth.chat.buildMessageText ( data.messages[key][key2].text ) }
                                            ]
                                        }
                                ) );
                                if ( parseInt ( key2 ) > parseInt ( idrinth.chat.maxId ) ) {
                                    idrinth.chat.maxId = key2;
                                }
                            }
                        }
                        var chatClass = document.getElementById ( 'idrinth-chat' ).getAttribute ( 'class' );
                        var chatActive = !( !chatClass ) && !( !chatClass.match ( /(^|\s)active(\s|$)/ ) );
                        if ( isNew && !chatActive ) {
                            document.getElementById ( 'idrinth-chat' ).setAttribute ( 'class', 'new-message' );
                        }
                        var tabClass = tab.getAttribute ( 'class' );
                        var tabActive = !( !tabClass ) && !( !tabClass.match ( /(^|\s)active(\s|$)/ ) );
                        if ( isNew && !tabActive ) {
                            tab.setAttribute ( 'class', tab.getAttribute ( 'class' ) + ' new-message' );
                        } else if ( tabActive && chatActive && chat.lastChild.scrollTop < chat.lastChild.scrollHeight ) {
                            try {
                                chat.lastChild.scrollIntoView ( false );
                            } catch ( e ) {
                            }
                            chat.lastChild.scrollTop = chat.lastChild.scrollHeight;
                        }
                    }
                }
            }
            idrinth.chat.oldMessages = new Array ();
            window.setTimeout ( function () {
                idrinth.chat.refreshChats ();
            }, 666 );
        },
        applyMembers: function ( data ) {
            addMemberElement=function(data,key,key2) {
                var ranks=['','banned','user','mod','owner'];
                        if ( parseInt ( key2 ) === parseInt ( data.self ) ) {
                            idrinth.chat.chatRank[key] = ranks[data.members[key][key2]];
                        }
                        var usedPlatforms='';
                        for(var pkey in data.users[key2].platforms) {
                            if(data.users[key2].platforms[pkey]) {
                                usedPlatforms+=pkey;
                            }
                        }
                        chat.appendChild ( idrinth.ui.buildElement (
                                {
                                    type: 'li',
                                    css: 'user ' + ranks[data.members[key][key2]],
                                    content: (usedPlatforms===''?'':'['+usedPlatforms.toUpperCase()+'] ')+data.users[key2].name,
                                    attributes:
                                            [
                                                { name: 'data-id', value: key2 },
                                                { name: 'onclick', value: 'idrinth.chat.userclick(this,' + key2 + ')' }
                                            ]
                                }
                        ) );
            };
            if ( !data ) {
                return idrinth.chat.returnMessages ( data );
            }
            data = JSON.parse ( data );
            if ( !data ) {
                return idrinth.chat.returnMessages ( data );
            }
            if ( data.users ) {
                idrinth.chat.users = data.users;
            }
            idrinth.chat.chatRank = { };
            if ( data.members ) {
                for (var key in data.members) {
                    if(document.getElementById ( 'idrinth-chat-tab-' + key )) {
                    var chat = document.getElementById ( 'idrinth-chat-tab-' + key ).getElementsByTagName ( 'ul' )[0];
                    while ( chat.firstChild ) {
                        chat.removeChild ( chat.firstChild );
                    }
                    for (var key2 in data.members[key]) {
                        addMemberElement (data,key,key2);
                    }
                }
            }
            }
        },
        emotes: { },
        start: function () {
            if ( !idrinth.settings.chatting ) {
                return;
            }
            if ( !document.getElementById ( 'idrinth-chat' ) ) {
                window.setTimeout ( function () {
                    idrinth.chat.start ();
                }, 1000 );
            }
            window.setTimeout ( function () {
                idrinth.runAjax (
                        'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/login/',
                        idrinth.chat.startLoginCallback,
                        function ( reply ) {},
                        function ( reply ) {
                            window.setTimeout ( function () {
                                idrinth.chat.login ();
                            }, 1 );
                        },
                        JSON.stringify ( {
                            user: idrinth.settings.chatuser,
                            pass: idrinth.settings.chatpass
                        })
                        );
            }, 2500 );
            window.setTimeout ( function () {
                idrinth.runAjax (
                        'https://dotd.idrinth.de/static/emoticons/data/',
                        function ( reply ) {
                            idrinth.chat.emotes = JSON.parse ( reply );
                        },
                        function ( reply ) {
                        },
                        function ( reply ) {
                        },
                        ''
                        );
            }, 1 );
        },
        create: function () {
            idrinth.runAjax (
                    'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/create/',
                    idrinth.chat.joinCallback,
                    function ( reply ) {
                        alert ( 'Can\'t create at the moment' );
                    },
                    function ( reply ) {
                        alert ( 'Can\'t create at the moment' );
                    },
                    document.getElementById ( 'idrinth-make-chat' ).getElementsByTagName ( 'input' )[0].value
                    );
        },
        joinCallback: function ( reply ) {
            if ( !reply ) {
                alert ( 'Can\'t join at the moment' );
                return;
            }
            reply = JSON.parse ( reply );
            if ( !reply ) {
                alert ( 'Can\'t join at the moment' );
                return;
            }
            if ( !reply.success ) {
                if ( reply.message ) {
                    alert ( reply.message );
                } else {
                    alert ( 'Joining didn\'t work' );
                }
                return;
            }
            idrinth.ui.buildChat ( reply.data.id, reply.data.name, reply.data.access, reply.data.pass );
            document.getElementById ( 'idrinth-add-chat' ).getElementsByTagName ( 'input' )[0].value = '';
            document.getElementById ( 'idrinth-add-chat' ).getElementsByTagName ( 'input' )[1].value = '';
            document.getElementById ( 'idrinth-make-chat' ).getElementsByTagName ( 'input' )[0].value = '';
        },
        users: { },
        add: function () {
            idrinth.runAjax (
                    'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/join/',
                    idrinth.chat.joinCallback,
                    function ( reply ) {
                        alert ( 'Can\'t join at the moment' );
                    },
                    function ( reply ) {
                        alert ( 'Can\'t join at the moment' );
                    },
                    JSON.stringify ( {
                        id: document.getElementById ( 'idrinth-add-chat' ).getElementsByTagName ( 'input' )[0].value,
                        pass: document.getElementById ( 'idrinth-add-chat' ).getElementsByTagName ( 'input' )[1].value
                    } )
                    );
        },
        send: function ( id ) {
            idrinth.chat.messages.push ( { chat: id, text: document.getElementById ( 'idrinth-chat-input-' + id ).value } );
            document.getElementById ( 'idrinth-chat-input-' + id ).value = '';
        },
        join: function ( list ) {
            for (var key in list) {
                idrinth.ui.buildChat ( key, list[key].name, list[key].access, list[key].pass );
            }
            window.setTimeout ( function () {
                idrinth.chat.refreshChats ();
            }, 1500 );
            idrinth.chat.refreshMembers ();
        },
        startLoginCallback: function ( data ) {
            if ( !data ) {
                return;
            }
            data = JSON.parse ( data );
            if ( !data || !data.success ) {
                return;
            }
            idrinth.ui.removeElement ( 'idrinth-chat-login' );
            idrinth.chat.join ( data.data );
        },
        loginCallback: function ( data ) {
            if ( !data ) {
                window.alert ( 'Logging in failed in an unexpected way' );
                return;
            }
            data = JSON.parse ( data );
            if ( !data ) {
                window.alert ( 'Logging in failed in an unexpected way' );
                return;
            }
            if ( !data.success && data.message && data['allow-reg'] ) {
                idrinth.chat.startRegistration ();
                return;
            }
            if ( !data.success && data.message ) {
                window.alert ( data.message );
                return;
            }
            if ( data.success ) {
                idrinth.settings.chatuser = document.getElementById ( 'idrinth-chat-login' ).getElementsByTagName ( 'input' )[0].value;
                idrinth.settings.chatpass = document.getElementById ( 'idrinth-chat-login' ).getElementsByTagName ( 'input' )[1].value;
                idrinth.settings.save ();
                idrinth.ui.removeElement ( 'idrinth-chat-login' );
                idrinth.chat.join ( data.data );
                return;
            }
            window.alert ( 'Logging in failed in an unexpected way' );
        },
        startRegistration: function () {
            if ( window.confirm ( 'The given username for dotd.idrinth.de is unknown, do you want to register it there?' ) ) {
                idrinth.chat.register ();
            }
        },
        register: function () {
            idrinth.runAjax (
                    'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/register/',
                    idrinth.chat.loginCallback,
                    function ( reply ) {
                        alert ( 'Logging in failed in an unexpected way' );
                    },
                    function ( reply ) {
                        window.setTimeout ( function () {
                            idrinth.chat.login ();
                        }, 1 );
                    },
                    JSON.stringify ( {
                        user: document.getElementById ( 'idrinth-chat-login' ).getElementsByTagName ( 'input' )[0].value,
                        pass: document.getElementById ( 'idrinth-chat-login' ).getElementsByTagName ( 'input' )[1].value
                    } )
                    );
        },
        login: function () {
            idrinth.runAjax (
                    'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/login/',
                    idrinth.chat.loginCallback,
                    function ( reply ) {
                        alert ( 'Logging in failed in an unexpected way' );
                    },
                    function ( reply ) {
                        window.setTimeout ( function () {
                            idrinth.chat.login ();
                        }, 1 );
                    },
                    JSON.stringify ( {
                        user: document.getElementById ( 'idrinth-chat-login' ).getElementsByTagName ( 'input' )[0].value,
                        pass: document.getElementById ( 'idrinth-chat-login' ).getElementsByTagName ( 'input' )[1].value
                    } )
                    );
        },
        relogin: function () {
            idrinth.runAjax (
                    'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/login/',
                    function () {
                        window.setTimeout ( idrinth.chat.refreshChats, 1500 );
                    },
                    function ( reply ) {
                        alert ( 'Logging in failed in an unexpected way' );
                    },
                    function ( reply ) {
                        window.setTimeout ( function () {
                            idrinth.chat.login ();
                        }, 1 );
                    },
                    JSON.stringify ( {
                        user: idrinth.settings.chatuser,
                        pass: idrinth.settings.chatpass
                    } )
                    );
        },
        enableChat: function ( element ) {
            var lis = document.getElementsByClassName ( 'chat-labels' )[0].getElementsByTagName ( 'li' );
            for (var counter = 0; counter < lis.length; counter++) {
                var cur = lis[counter].getAttribute ( 'class' ) + '';
                lis[counter].setAttribute ( 'class', cur.replace ( /(^|\s)active(\s|$)/, ' ' ) );
            }
            element.setAttribute ( 'class', ( element.getAttribute ( 'class' ) ).replace ( /(^|\s)new-message(\s|$)/, ' ' ) + ' active' );
            var lis = document.getElementsByClassName ( 'chat-tabs' )[0].children;
            for (var counter = 0; counter < lis.length; counter++) {
                lis[counter].setAttribute ( 'class', '' );
                if ( lis[counter].getAttribute ( 'data-id' ) === element.getAttribute ( 'data-id' ) ) {
                    lis[counter].setAttribute ( 'class', 'active' );
                }
            }
        },
        openCloseChat: function ( element ) {
            var chat = element.parentNode;
            if ( chat.getAttribute ( 'class' ) === 'idrinth-hovering-box active' || chat.getAttribute ( 'class' ) === 'idrinth-hovering-box active left-sided' ) {
                chat.setAttribute ( 'class', 'idrinth-hovering-box' + ( idrinth.settings.moveLeft ? ' left-sided' : '' ) +
                        ( chat.getElementsByClassName ( 'new-message' ) && chat.getElementsByClassName ( 'new-message' ).length ? ' new-message' : '' ) );
                element.innerHTML = '&lt;&lt;';
            } else {
                chat.setAttribute ( 'class', 'idrinth-hovering-box active' + ( idrinth.settings.moveLeft ? ' left-sided' : '' ) );
                element.innerHTML = '&gt;&gt;';
            }
        }
    },
    raids: {
        script: null,
        list: { },
        joined: { },
        interval: null,
        requested: 0,
        restartInterval: function () {
            try {
                window.clearInterval ( idrinth.raids.interval );
            } catch ( e ) {
            }
            ;
            idrinth.raids.interval = window.setInterval ( function ( ) {
                idrinth.raids.join.process ( );
            }, 1500 );
        },
        getImportLink: function ( toImport ) {
            return 'https://dotd.idrinth.de/' + ( idrinth.settings.isWorldServer ? 'world-' : '' ) + idrinth.platform +
                    '/raid-service/' + ( toImport === '' ? '_' : toImport ) + '/';
        },
        import: function ( ) {
            'use strict';
            if ( !idrinth.platform ) {
                return;
            }
            idrinth.runAjax (
                    idrinth.raids.getImportLink ( idrinth.settings.raids ? idrinth.settings.favs : '-1' ),
                    function ( text ) {
                        idrinth.raids.importProcess ( text );
                    },
                    function ( ) {
                    },
                    function ( ) {
                    },
                    idrinth.raids.knowRaids ()
                    );
        },
        knowRaids: function () {
            var data = '';
            if ( Object.keys ( idrinth.raids.joined ).length > 0 ) {
                data = data + ',' + ( Object.keys ( idrinth.raids.joined ) ).join ();
            }
            if ( Object.keys ( idrinth.raids.list ).length > 0 ) {
                data = data + ',' + ( Object.keys ( idrinth.raids.list ) ).join ();
            }
            return data.replace ( /^,|,$/, '' );
        },
        importManually: function ( all ) {
            'use strict';
            if ( !idrinth.platform ) {
                return;
            }
            idrinth.runAjax (
                    idrinth.raids.getImportLink ( all ? '_' : idrinth.settings.favs ),
                    function ( text ) {
                        idrinth.raids.importProcess ( text );
                    },
                    function ( ) {
                    },
                    function ( ) {
                    },
                    idrinth.raids.knowRaids ()
                    );
        },
        importProcess: function ( responseText ) {
            'use strict';
            var list = JSON.parse ( responseText );
            for (var key in list) {
                if ( list[key].delete ) {
                    if ( idrinth.raids.list[key] ) {
                        try {
                            delete idrinth.raids.list[key];
                        } catch ( e1 ) {
                        }
                        try {
                            delete idrinth.raids.joined[key];
                        } catch ( e2 ) {
                        }
                        try {
                            idrinth.ui.removeElement ( 'idrinth-raid-link-' + key );
                        } catch ( e ) {
                        }
                    }
                } else if ( idrinth.raids.list[key] === undefined ) {
                    idrinth.raids.list[key] = list[key];
                }
            }
        },
        clearAll: function () {
            try {
                window.clearInterval ( idrinth.raids.interval );
            } catch ( e ) {
            }
            ;
            while ( document.getElementById ( "idrinth-raid-link-list" ).firstChild ) {
                idrinth.ui.removeElement ( document.getElementById ( "idrinth-raid-link-list" ).firstChild.id );
            }
            idrinth.raids.list = { };
            idrinth.raids.joined = { };
            idrinth.raids.restartInterval ();
        },
        join: {
            data: {
                prefix: null,
                makePrefix: function () {
                    if ( idrinth.raids.join.data.prefix === null ) {
                        if ( idrinth.realSite === 'armorgames' ) {
                            idrinth.raids.join.data.prefix = 'http://50.18.191.15/armor/raidjoin.php?user_id=' + idrinth.user.id +
                                    '&auth_token=' + idrinth.user.token + '&';
                        }
                        if ( idrinth.realSite === 'kongregate' ) {
                            idrinth.raids.join.data.prefix = 'http://50.18.191.15/kong/raidjoin.php?kongregate_username=' + idrinth.user.name +
                                    '&kongregate_user_id=' + idrinth.user.id + '&kongregate_game_auth_token=' +
                                    idrinth.user.token + '&';
                        }
                        if ( idrinth.realSite === 'newgrounds' ) {
                            idrinth.raids.join.data.prefix = 'https://newgrounds.com/portal/view/609826?';
                        }
                        if ( idrinth.realSite === 'dawnofthedragons' || idrinth.realSite === 'facebook' ) {
                            idrinth.raids.join.data.prefix = 'https://web1.dawnofthedragons.com/live_iframe/raidjoin.php?';
                        }
                    }
                    return idrinth.raids.join.data.prefix;
                },
                tag: { armorgames: 'ar_', kongregate: 'kv_', newgrounds: 'ng_', facebook: '', dawnofthedragons: '' }
            },
            servers: {
                getServerLink: function ( key ) {
                    function build ( data, tag, prefix ) {
                        try {
                            return prefix +
                                    tag + 'action_type=raidhelp&' +
                                    tag + 'raid_id=' + data.raidId + '&' +
                                    tag + 'difficulty=' + data.difficulty + '&' +
                                    tag + 'hash=' + data.hash +
                                    ( idrinth.settings.isWorldServer ? '&'+tag+'serverid=' + 2 : '' );
                        } catch ( e1 ) {
                            return false;
                        }
                    }
                    var prefix = idrinth.raids.join.data.makePrefix ();
                    var tag = idrinth.raids.join.data.tag[idrinth.realSite];
                    if ( idrinth.raids.list[key] ) {
                        var link = build ( idrinth.raids.list[key], tag, prefix );
                        if ( link ) {
                            return link;
                        }
                    }
                    if ( idrinth.raids.joined[key] ) {
                        var link = build ( idrinth.raids.joined[key], tag, prefix );
                        if ( link ) {
                            return link;
                        }
                    }
                    return prefix;
                },
                kongregate: function ( key ) {
                    'use strict';
                    idrinth.raids.join.byAjax.do ( key, idrinth.raids.join.servers.getServerLink ( key ) );
                },
                armorgames: function ( key ) {
                    'use strict';
                    idrinth.raids.join.byAjax.do ( key, idrinth.raids.join.servers.getServerLink ( key ) );
                },
                postLink: function ( key ) {
                    'use strict';
                    if ( !document.getElementById ( 'idrinth-raid-link-' + key ) ) {
                        var span = document.createElement ( 'span' );
                        span.id = 'idrinth-raid-link-' + key;
                        span.setAttribute ( 'data-clipboard-text', idrinth.raids.join.servers.getServerLink ( key ) );
                        span.appendChild ( document.createTextNode ( idrinth.raids.list[key].name + '\'s ' + idrinth.raids.list[key].raid ) );
                        document.getElementById ( 'idrinth-raid-link-list' ).appendChild ( span );
                    }
                },
                facebook: function ( key ) {
                    'use strict';
                    idrinth.raids.join.byFrame.do ( key, idrinth.raids.join.servers.getServerLink ( key ) );
                },
                dawnofthedragons: function ( key ) {
                    'use strict';
                    idrinth.raids.join.byFrame.do ( key, idrinth.raids.join.servers.getServerLink ( key ) );
                }
            },
            byAjax: {
                'do': function ( key, link ) {
                    'use strict';
                    idrinth.runAjax (
                            link,
                            function ( ) {
                                idrinth.raids.join.messages.success ( key );
                            },
                            function ( ) {
                                idrinth.raids.join.messages.failed ( key );
                            },
                            function ( ) {
                                idrinth.raids[key].joined = false;
                                idrinth.raids.join.messages.failed ( key );
                            }
                    );
                }
            },
            messages: {
                writeToGui: function ( string ) {
                    var li = document.createElement ( 'li' );
                    var ul = document.getElementById ( 'idrinth-joined-raids' ).getElementsByTagName ( 'ul' )[0];
                    li.appendChild ( document.createTextNode ( ( new Date () ).toLocaleTimeString () + ' ' + string ) );
                    if ( !ul.firstChild ) {
                        ul.appendChild ( li );
                    } else {
                        if ( ul.childNodes.length > 9 ) {
                            ul.removeChild ( ul.lastChild );
                        }
                        ul.insertBefore ( li, ul.firstChild );
                    }
                },
                log: function ( string ) {
                    idrinth.log ( string );
                    idrinth.raids.join.messages.writeToGui ( string );
                },
                success: function ( key ) {
                    'use strict';
                    idrinth.raids.join.messages.log ( 'Joined ' + idrinth.raids.list[key].name + '\'s ' + idrinth.raids.list[key].raid );
                    try {
                        idrinth.ui.removeElement ( 'idrinth-raid-link-' + key );
                    } catch ( e ) {
                    }
                    try {
                        idrinth.raids.joined[key] = idrinth.raids.list[key];
                        delete idrinth.raids.list[key];
                    } catch ( e1 ) {
                    }
                },
                failed: function ( key ) {
                    'use strict';
                    idrinth.raids.join.messages.log ( 'Could not join ' + idrinth.raids.list[key].name + '\'s ' + idrinth.raids.list[key].raid );
                },
                trying: function ( key ) {
                    'use strict';
                    eval ( "window.setTimeout(function(){try{idrinth.ui.removeElement ('idrinth-raid-link-'+key);}catch(e){}},300)" );
                    if ( idrinth.raids.list[key] ) {
                        idrinth.raids.join.messages.log ( 'Trying to join ' + idrinth.raids.list[key].name + '\'s ' + idrinth.raids.list[key].raid );
                    }
                    try {
                        idrinth.raids.joined[key] = idrinth.raids.list[key];
                        delete idrinth.raids.list[key];
                    } catch ( e1 ) {
                    }
                }
            },
            byFrame: {
                windows: [ null, null, null ],
                timeouts: [ ],
                'do': function ( key, link ) {
                    'use strict';
                    for (var count = 0; count < idrinth.settings.windows; count++) {
                        if ( idrinth.raids.join.byFrame.windows[count] === null || idrinth.raids.join.byFrame.windows[count] === undefined ) {
                            idrinth.raids.join.byFrame.windows[count] =
                                    idrinth.ui.buildElement ( { type: 'iframe', id: 'join-' + key, attributes: [
                                            { name: 'src', value: link },
                                            { name: 'sandbox', value: 'allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts' },
                                            { name: 'style', value: 'position:absolute;top:' + count + 'px;left:0;width:1px;height:1px;z-index:-100;' },
                                            { name: 'onload', value: 'try{event.stopPropagation();}catch(e){}window.setTimeout(){function(){idrinth.raids.join.byFrame.remove(' + count + ',\'' + key + '\');},1234);' },
                                            { name: 'onunload', value: 'try{event.stopPropagation();}catch(e){}' }
                                        ] } );
                            idrinth.raids.join.byFrame.timeouts[count] = eval ( 'window.setTimeout(function(){idrinth.raids.join.byFrame.remove(' + count + ',\'' + key + '\');},30000);' );
                            idrinth.ui.body.appendChild ( idrinth.raids.join.byFrame.windows[count] );
                            idrinth.raids.join.messages.trying ( key );
                            return;
                        }
                    }
                    idrinth.raids.list[key].joined = false;
                },
                remove: function ( count, key ) {
                    try {
                        window.clearTimeout ( idrinth.raids.join.byFrame.timeouts[count] );
                    } catch ( e0 ) {
                    }
                    try {
                        idrinth.raids.join.byFrame.windows[count] = null;
                    } catch ( e1 ) {
                    }
                    try {
                        idrinth.ui.removeElement ( 'join-' + key );
                    } catch ( e2 ) {
                    }
                }
            },
            'do': function ( ) {
                'use strict';
                var added = 0;
                for (var key in idrinth.raids.list) {
                    if ( !idrinth.raids.list[key].joined ) {
                        added++;
                        idrinth.raids.join.servers.postLink ( key );
                        idrinth.raids.list[key].joined = true;
                        if ( typeof idrinth.raids.join.servers[idrinth.realSite] === 'function' ) {
                            idrinth.raids.join.servers[idrinth.realSite] ( key );
                        }
                    }
                    if ( added > 99 || ( idrinth.platform == 'facebook' && added >= idrinth.settings.windows ) ) {
                        return true;
                    }
                }
                return false;
            },
            process: function ( ) {
                'use strict';
                if ( !idrinth.raids.join.do ( ) && Date.now ( ) - 60000 > idrinth.raids.requested ) {
                    idrinth.raids.requested = Date.now ( );
                    idrinth.raids.import ( );
                }
            }
        },
        start: function ( ) {
            'use strict';
            idrinth.raids.restartInterval ();
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
    }
};
window.setTimeout ( function ( ) {
    idrinth.start ( );
}, 6666 );