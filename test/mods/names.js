/*describe ( 'Names.js tests', function () {

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

    describe ( "Names run method", function () {

        beforeAll(function(){

            var SPANUsername = {};
            document.getElementsByClassName = jasmine.createSpy('HTML Class Elements').andCallFake(function(className) {
                if(!SPANUsername[className]) {
                    SPANUsername[className] = document.createElement('span');
                }
                return SPANUsername[className];
            });
        });

        it ( "Should run for new names and add them", function () {

            var testUser = {
                kongregate: { name : 'test'},
                world: { name : 'test'}
            };

            idrinth.names.counter = 300;
            idrinth.names.names['testUser'] = testUser;
            
            idrinth.names.run ();

            expect ( idrinth.names.users ).toEqual ( 2 );
            expect ( idrinth.names.counter ).toEqual ( 121312 );
        } );

        it ( "Should get attribute with name dotdxname", function () {

            idrinth.names.run ();

            expect ( idrinth.names.users ).toEqual ( 2 );
            expect ( idrinth.names.counter ).toEqual ( 300 );
        } );

    } );

    describe ( "Names start method for kongregate", function () {

        it ( "Should start names for kongregate", function () {
            // idrinth.ui.tooltip
            // idrinth.ui.base
            // idrinth.ui.updateClassesList
            // idrinth.settings.get
            // idrinth.ui.setTooltipTimeout
            // idrinth.ui.getElementPositioning

            spyOn(idrinth.core.multibind, 'add');
            spyOn(idrinth.core.timeouts, 'add');

            idrinth.names.run ();

            expect(idrinth.core.multibind.add).toHaveBeenCalled();
            expect(idrinth.core.multibind.add).toHaveBeenCalledTimes(1);

            expect(idrinth.core.timeouts.add).toHaveBeenCalled();
            expect(idrinth.core.timeouts.add).toHaveBeenCalledTimes(1);
        });

    } );
} );*/