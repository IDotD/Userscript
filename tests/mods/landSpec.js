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

    lt ( "", function () {

    } );

} );