idrinth.settings = {
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
    };