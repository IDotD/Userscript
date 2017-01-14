describe ( 'Names.js tests', function () {

    it ( 'should have a idrinth variable in scope', function () {
        expect ( idrinth ).toBeDefined ();
    } );


    it ( 'should check default data is valid, and empty', function () {
        expect ( idrinth.names.users ).toEqual ( {} );
        expect ( idrinth.names.classes ).toEqual ( {} );
        expect ( idrinth.names.guilds ).toEqual ( {} );
        expect ( idrinth.names.counter ).toEqual ( 0 );
    } );

    describe ( "Names parse method", function () {
        //<span class="username chat_message_window_username ign dotdm_1484406507967"
        // username="arkamat" dotdxname="arkamat" oncontextmenu="return false;">K2 mat</span>

        it ( "Should get attribute with name dotdxname", function () {
            var span = document.createElement ( "span" );
            span.className = 'username chat_message_window_username ign';
            span.setAttribute ( "dotdxname", "testcharacterDTX" );
            span.innerHTML = "K2 TestCharacter";

            expect ( idrinth.names.parse ( span ) ).toEqual ( "testcharacterDTX" );
        } );

        it ( "Should get attribute with name username", function () {

            var span = document.createElement ( "span" );
            span.className = 'username';
            span.setAttribute ( "username", "testcharacterUSN" );
            span.innerHTML = "K2 TestCharacter";

            expect ( idrinth.names.parse ( span ) ).toEqual ( "testcharacterUSN" );
        } );

        it ( "Should get default attribute", function () {
            var span = document.createElement ( "span" );
            span.innerHTML = "K2 TestCharacter";

            expect ( idrinth.names.parse ( span ) ).toEqual ( "K2 TestCharacter" );
        } );

    } );

} );