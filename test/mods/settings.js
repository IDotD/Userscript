/*describe ( 'Settings.js tests', function () {

    it ( 'should have a idrinth variable in scope', function () {
        expect ( idrinth ).toBeDefined ();
    } );

    it ( 'should have default values defined', function () {
        var defaults = {
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
            bannedRaids: {},
            language: 'en',
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
            }
        };

        var copySettings = JSON.parse ( JSON.stringify ( idrinth.settings ) );

        //CleanUP functions -> not part of the test
        for ( var i in copySettings ) {
            if ( copySettings.hasOwnProperty ( i ) && typeof copySettings[ i ] === 'function' ) {
                delete copySettings[ i ];
            }
        }

        expect ( copySettings ).toEqual ( defaults );
    } );

} );*/