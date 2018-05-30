describe ( 'Land.js tests', function () {

    it ( 'should have a idrinth variable in scope', function () {
        expect ( idrinth ).toBeDefined ();
    } );


    it ( 'should check default data is valid', function () {
        var defData = {
            cornfield: {
                perHour: 100,
                base: 4000
            },
            stable: {
                perHour: 300,
                base: 15000
            },
            barn: {
                perHour: 400,
                base: 25000
            },
            store: {
                perHour: 700,
                base: 50000
            },
            pub: {
                perHour: 900,
                base: 75000
            },
            inn: {
                perHour: 1200,
                base: 110000
            },
            tower: {
                perHour: 2700,
                base: 300000
            },
            fort: {
                perHour: 4500,
                base: 600000
            },
            castle: {
                perHour: 8000,
                base: 1200000
            }
        };

        expect ( idrinth.land.data ).toEqual ( defData );
    } );

    describe ( "Land calculate method", function () {

        beforeEach ( function () {
            var mock = {},
                    defaultStructure = '{ "value": "", "parentNode": { "nextSibling": { "innerHTML": "" } } }',
                    document_getElementById;
            document_getElementById = jasmine.createSpyObj ( "input", [ 'value', 'parentNode', 'nextSibling', 'innerHTML' ] );

            for ( var i in idrinth.land.data ) {
                if ( idrinth.land.data.hasOwnProperty ( i ) ) {
                    mock[ 'idrinth-land-' + i ] = JSON.parse ( defaultStructure );
                }
            }
            mock[ 'idrinth-land-gold' ] = { value: '' };

            spyOn ( document, "getElementById" ).and.callFake ( function ( id ) {
                if ( mock.hasOwnProperty ( id ) ) {
                    return mock[ id ];
                }

                return document_getElementById ( id );
            } );

            spyOn(idrinth.core, 'alert');
        } );


        it ( "Should properly calculate land values", function () {
            idrinth.land.calculate ();
        } );

    } );

} );