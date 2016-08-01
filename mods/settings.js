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
    settingsAction: function ( action ) {
        var innerObj,
                outerVal,
                innerVal,
                handleItem,
                saveItem,
                settings = idrinth.settings,
                processInner,
                prefix = 'idrinth-dotd-',
                actions = {
                    'save': 'save',
                    'start': 'start'
                };

        if ( !window.localStorage && !actions.hasOwnProperty ( action ) ) {
            return;
        }

        handleItem = function handleItemF ( action, name, item ) {
            var tmp;
            if ( action === 'save' ) {
                window.localStorage.setItem ( name, JSON.stringify ( item ) );
            } else {
                tmp = window.localStorage.getItem ( name );
                tmp = tmp !== 'false' || tmp !== 'true' ? tmp : !!tmp;
            }
            return tmp;
        };

        saveItem = function saveItemF ( key, key2, obj, val ) {
            if ( key && key2 ) {
                obj[ key ][ key2 ] = val;
            } else {
                obj[ key ] = val;
            }
        };

        processInner = function ( action, prefix, key, innerObj ){
            for ( var key2 in innerObj ) {
                if ( innerObj.hasOwnProperty ( key2 ) ) {
                    innerVal = handleItem ( action, prefix + key + "-" + key2, innerObj[ key2 ] );
                    saveItem ( key, key2, settings, innerVal );
                }
            }
        };

        for ( var key in settings ) {
            if ( settings.hasOwnProperty ( key ) && typeof settings[ key ] !== 'function' ) {
                if ( settings[ key ] === 'object' ) {
                    innerObj = settings[ key ];
                    processInner( action, prefix, key, innerObj );
                } else {
                    outerVal = handleItem ( action, prefix + key, settings[ key ] );
                    saveItem ( key, null, settings, outerVal );
                }
            }
        }
    },
    save: function ( ) {
        'use strict';
        this.settingsAction ( 'save' );
    },
    change: function ( field, value ) {
        'use strict';
        idrinth.settings[field] = value;
        idrinth.settings.save ( );
    },
    start: function ( ) {
        'use strict';
        this.settingsAction( 'start' );
    }
};