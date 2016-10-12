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
        var mockDOM = {}, defaultStructure, document_getElementById;

        beforeEach ( function () {
            defaultStructure = '{ "parentNode.nextSibling.innerHTML": "", "parentNode": { "nextSibling": { "innerHTML": "" } } }';
            document_getElementById = jasmine.createSpyObj ( "input", [ 'value', 'parentNode', 'nextSibling', 'innerHTML' ] );

            for ( var i in idrinth.land.data ) {
                if ( idrinth.land.data.hasOwnProperty ( i ) ) {
                    mockDOM[ 'idrinth-land-' + i ] = JSON.parse ( defaultStructure );
                }
            }
            mockDOM[ 'idrinth-land-gold' ] = { value: '' };

            spyOn ( document, "getElementById" ).and.callFake ( function ( id ) {
                if ( mockDOM.hasOwnProperty ( id ) ) {
                    return mockDOM[ id ];
                }

                return document_getElementById ( id );
            } );

            spyOn(idrinth.core, 'alert');
            spyOn(idrinth.settings, 'save');
            spyOn(idrinth.settings, 'change');
            spyOn(idrinth.text, 'get');
            spyOn(idrinth.text, 'start');
        } );


        it ( "Should properly calculate without errors", function () {
            //Prepare values
            idrinth.settings.land.gold = 8000000000;

            idrinth.land.calculate ();

            expect(mockDOM['idrinth-land-cornfield'].value).toEqual(840);
            expect(mockDOM['idrinth-land-stable'].value).toEqual(650);
            expect(mockDOM['idrinth-land-barn'].value).toEqual(520);
            expect(mockDOM['idrinth-land-store'].value).toEqual(450);
            expect(mockDOM['idrinth-land-pub'].value).toEqual(390);
            expect(mockDOM['idrinth-land-inn'].value).toEqual(350);
            expect(mockDOM['idrinth-land-tower'].value).toEqual(280);
            expect(mockDOM['idrinth-land-fort'].value).toEqual(230);
            expect(mockDOM['idrinth-land-castle'].value).toEqual(200);
            expect(mockDOM['idrinth-land-gold'].value).toEqual(1450000);

            expect(mockDOM['idrinth-land-cornfield'].parentNode.nextSibling.innerHTML).toEqual("+840");
            expect(mockDOM['idrinth-land-stable'].parentNode.nextSibling.innerHTML).toEqual("+650");
            expect(mockDOM['idrinth-land-barn'].parentNode.nextSibling.innerHTML).toEqual("+520");
            expect(mockDOM['idrinth-land-store'].parentNode.nextSibling.innerHTML).toEqual("+450");
            expect(mockDOM['idrinth-land-pub'].parentNode.nextSibling.innerHTML).toEqual("+390");
            expect(mockDOM['idrinth-land-inn'].parentNode.nextSibling.innerHTML).toEqual("+350");
            expect(mockDOM['idrinth-land-tower'].parentNode.nextSibling.innerHTML).toEqual("+280");
            expect(mockDOM['idrinth-land-fort'].parentNode.nextSibling.innerHTML).toEqual("+230");
            expect(mockDOM['idrinth-land-castle'].parentNode.nextSibling.innerHTML).toEqual("+200");

        } );

    } );

} );