var should = require ( 'chai' ).should ();
var expect = require ( 'chai' ).expect;
var rewire = require( 'rewire' );
describe ( 'workers/tiers.js', function ( ) {
    it ( 'should have a idrinth variable in scope', function ( ) {
        var idrinth = rewire ( "../../src/workers/tiers" ).__get__( 'idrinth' );
        should.exist ( idrinth );
        idrinth.should.be.an ( 'object' );
        describe ( 'idrinth', function ( ) {
            it ( 'should have a work property', function ( ) {
                expect( idrinth ).to.have.property( 'work' );
                describe ( 'idrinth.work', function ( ) {
                    it ( 'work should be a function', function ( ) {
                        idrinth.work.should.be.a( 'function' );
                        describe ('idrinth.work()', function () {
                            //todo
                        });
                    } );
                } );
            } );
            it ( 'should have a matchesAny property', function ( ) {
                expect( idrinth ).to.have.property( 'matchesAny' );
                describe( 'idrinth.matchesAny', function( ) {
                    it ( 'matchesAny should be a function', function ( ) {
                        idrinth.matchesAny.should.be.a( 'function' );
                        describe ( 'idrinth.matchesAny()', function ( ) {
                            //todo
                        } );
                    } );
                } );
            } );
            it ( 'should have a isFilterValid property', function ( ) {
                expect( idrinth ).to.have.property( 'isFilterValid' );
                describe( 'idrinth.isFilterValid', function( ) {
                    it ( 'isFilterValid should be a function', function ( ) {
                        idrinth.isFilterValid.should.be.a( 'function' );
                        describe ( 'idrinth.isFilterValid()', function ( ) {
                            //todo
                        } );
                    } );
                } );
            } );
        } );
    } );
} );