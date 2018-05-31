var should = require ( 'chai' ).should ();
var expect = require ( 'chai' ).expect;
var rewire = require( 'rewire' );
describe ( 'worker/stat.js', function ( ) {
    it ( 'should have a idrinth variable in scope', function ( ) {
        var idrinth = rewire ( "../../src/workers/stats" ).__get__( 'idrinth' );
        should.exist ( idrinth );
        idrinth.should.be.an ( 'object' );
        describe ( 'idrinth', function ( ) {
            it ( 'should have a work property', function ( ) {
                expect( idrinth ).to.have.property( 'work' );
                describe ( 'idrinth.work', function ( ) {
                    it ( 'work should be a function', function ( ) {
                        idrinth.work.should.be.a( 'function' );
                    } );
                } );
            } );
            it ( 'should have a PremiumSet property', function ( ) {
                expect( idrinth ).to.have.property( 'PremiumSet' );
                describe( 'idrinth.PremiumSet', function( ) {
                    it ( 'PremiumSet should be a function', function ( ) {
                        idrinth.PremiumSet.should.be.a( 'function' );
                        describe ( 'idrinth.PremiumSet#Instance', function ( ) {
                            var premium = new idrinth.PremiumSet( );
                            it ( 'PremiumSet should return an object', function ( ) {
                                should.exist( premium );
                                premium.should.be.an( 'object' );
                            } );
                        } );
                    } );
                } );
            } );
            it ( 'should have a MultiplierSet property', function ( ) {
                expect( idrinth ).to.have.property( 'MultiplierSet' );
                describe ( 'idrinth.MultiplierSet', function ( ) {
                    it ( 'MultiplierSet should be a function', function ( ) {
                        idrinth.MultiplierSet.should.be.a( 'function' );
                        describe ( 'idrinth.MultiplierSet#Instance', function ( ) {
                            var multiplier = new idrinth.MultiplierSet( );
                            it ( 'MultiplierSet should return an object', function ( ) {
                                should.exist( multiplier );
                                multiplier.should.be.an( 'object' );
                            } );
                        } );
                    } );
                } );
            } );
            it ( 'should have a StatSet property', function ( ) {
                expect( idrinth ).to.have.property( 'StatSet' );
                describe ( 'idrinth.StatSet', function ( ) {
                    it ( 'StatSet should be a function', function ( ) {
                        idrinth.StatSet.should.be.a( 'function' );
                        describe ( 'idrinth.StatSet#Instance', function ( ) {
                            var stat = new idrinth.StatSet( );
                            it ( 'StatSet should return an object', function ( ) {
                                should.exist( stat );
                                stat.should.be.an( 'object' );
                            } );
                        } );
                    } );
                } );
            } );
            it ( 'should have a Calculator property', function ( ) {
                expect( idrinth ).to.have.property( 'Calculator' );
                describe ( 'idrinth.Calculator', function ( ) {
                    it ( 'Calculator should be a function', function ( ) {
                        idrinth.Calculator.should.be.a( 'function' );
                        describe ( 'idrinth.Calculator#Instance', function ( ) {
                            var calculator = new idrinth.Calculator( );
                            it ( 'Calculator should return an object', function ( ) {
                                should.exist( calculator );
                                calculator.should.be.an( 'object' );
                            } );
                        } );
                    } );
                } );
            } );
        } );
    } );
} );