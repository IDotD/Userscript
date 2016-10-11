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
            this.mock = {};
            this.defaultStructure = '{ "value": "", "parentNode": { "nextSibling": { "innerHTML": "" } } }';
            this.document_getElementById = jasmine.createSpyObj ( "input", [ 'value', 'parentNode', 'nextSibling', 'innerHTML' ] );

            for ( var i in idrinth.land.data ) {
                if ( idrinth.land.data.hasOwnProperty ( i ) ) {
                    this.mock[ 'idrinth-land-' + i ] = JSON.parse ( defaultStructure );
                }
            }
            this.mock[ 'idrinth-land-gold' ] = { value: '' };

            spyOn ( document, "getElementById" ).and.callFake ( function ( id ) {
                if ( this.mock.hasOwnProperty ( id ) ) {
                    return this.mock[ id ];
                }

                return this.document_getElementById ( id );
            } );

            spyOn(idrinth.core, 'alert');
            spyOn(idrinth.settings, 'save');
            spyOn(idrinth.settings, 'change');
        } );


        it ( "Should properly calculate without errors", function () {
            //Prepare values
            idrinth.settings.land.gold = 8000000000;

            idrinth.land.calculate ();


        } );

    } );

} );