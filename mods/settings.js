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
        if ( window.localStorage ) {
            for (var key in idrinth.settings) {
                if ( idrinth.settings.hasOwnProperty ( key ) && typeof idrinth.settings[key] !== 'object' && typeof idrinth.settings[key] !== 'function' ) {
                    window.localStorage.setItem ( 'idrinth-dotd-' + key, idrinth.settings[key] );
                } else if ( idrinth.settings.hasOwnProperty ( key ) && typeof idrinth.settings[key] === 'object' ) {
                    for (var element in idrinth.settings[key]) {
                        if ( idrinth.settings[key].hasOwnProperty ( element ) && typeof idrinth.settings[key][element] !== 'function' ) {
                            window.localStorage.setItem ( 'idrinth-dotd-' + key + '-' + element, idrinth.settings[key][element] );
                        }
                    }
                }
            }
        }
    },
    change: function ( field, value ) {
        'use strict';
        var setValue = function ( parent, field ) {
            var fieldIsSetting = function ( parent, field ) {
                return parent && typeof parent === 'object' && field && parent.hasOwnProperty ( field ) && typeof parent[field] !== 'object' && typeof parent[field] !== 'function';
            };
            if ( fieldIsSetting ( parent, field ) ) {
                parent[field] = value;
                idrinth.settings.save ( );
                return true;
            }
            return false;
        };
        if ( !field ) {
            return;
        }
        if ( setValue ( idrinth.settings, field ) ) {
            return;
        }
        field = field.split ( '-' );
        if ( !idrinth.settings[field[0]] || !field[1] ) {
            return;
        }
        if ( setValue ( idrinth.settings[field[0]], field[1] ) ) {
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