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
    notification: {
        mention: true,
        message: true,
        raid: true
    },
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
        var store = function ( prefix, list, store ) {
            for (var key in list) {
                if ( list.hasOwnProperty ( key ) && typeof list[key] !== 'object' && typeof list[key] !== 'function' ) {
                    window.localStorage.setItem ( prefix + key, idrinth.settings[key] );
                } else if ( list.hasOwnProperty ( key ) && typeof list[key] === 'object' ) {
                    save ( prefix + key + '-', list[key], store );
                }
            }
        };
        store ( 'idrinth-dotd-', idrinth.settings, store );
    },
    change: function ( field, value ) {
        'use strict';
        var setValue = function ( parent, field, value ) {
            if ( idrinth.core.fieldIsSetting ( parent, field ) ) {
                parent[field] = value;
                idrinth.settings.save ( );
                return true;
            }
            return false;
        };
        if ( !field ) {
            return;
        }
        if ( setValue ( idrinth.settings, field, value ) ) {
            return;
        }
        field = field.split ( '-' );
        if ( !idrinth.settings[field[0]] || !field[1] ) {
            return;
        }
        if ( setValue ( idrinth.settings[field[0]], field[1], value ) ) {
            return;
        }
    },
    start: function ( ) {
        'use strict';
        if ( window.localStorage ) {
            var itemHandler = function ( prefix, key, item ) {
                if ( typeof item !== 'function' ) {
                    var tmp = window.localStorage.getItem ( 'idrinth-dotd-' + prefix + key );
                    if ( tmp ) {
                        if ( tmp === 'false' ) {
                            tmp = false;
                        } else if ( tmp === 'true' ) {
                            tmp = true;
                        }
                        item = tmp;
                    }
                }
                return item;
            };
            for (var key in idrinth.settings) {
                if ( key !== 'land' ) {
                    idrinth.settings[key] = itemHandler ( '', key, idrinth.settings[key] );
                }
            }
            for (var building in idrinth.settings.land) {
                idrinth.settings.land[building] = itemHandler ( 'land-', building, idrinth.settings.land[building] );
            }
        }
    }
};