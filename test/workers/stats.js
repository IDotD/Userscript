var should = require ( 'chai' ).should ();
var expect = require ( 'chai' ).expect;
var rewire = require( 'rewire' );
describe ( 'workers/stats.js', function ( ) {
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
                        describe ('idrinth.work()', function () {
                            [
                                [
                                    {
                                        attack: 1,
                                        defense: 1,
                                        perception: 1,
                                        level: 1,
                                        stats: 1000,
                                        utym: false,
                                        mirele: false,
                                        kraken: false,
                                        legion: 0,
                                        mount: 0,
                                        critchance: 5
                                    }, {
                                        attack: 1000,
                                        defense: 1,
                                        perception: 1,
                                        stats: 1,
                                        level: 1
                                    }
                                ]
                            ].forEach(function(set) {
                                it ('Case '+JSON.stringify(set[0])+' should return '+JSON.stringify(set[1]), function() {
                                    idrinth.work(set[0]).should.be.deep.equal(set[1]);
                                });
                            });
                        });
                    } );
                } );
            } );
            it ( 'should have a PremiumSet property', function ( ) {
                expect( idrinth ).to.have.property( 'PremiumSet' );
                describe( 'idrinth.PremiumSet', function( ) {
                    it ( 'PremiumSet should be a function', function ( ) {
                        idrinth.PremiumSet.should.be.a( 'function' );
                        describe ( 'idrinth.PremiumSet()', function ( ) {
                            var premium = new idrinth.PremiumSet( 'u', 'm', 'k' );
                            it ( 'PremiumSet should return an object', function ( ) {
                                should.exist( premium );
                                premium.should.be.an( 'object' );
                                describe ('idrinth.PremiumSet#Instance', function() {
                                    it ('PremiumSet should have a mirele property', function () {
                                        expect(premium).to.have.property('mirele');
                                        premium.mirele.should.be.equal('m');
                                    });
                                    it ('PremiumSet should have a utym property', function () {
                                        expect(premium).to.have.property('utym');
                                        premium.utym.should.be.equal('u');
                                    });
                                    it ('PremiumSet should have a kraken property', function () {
                                        expect(premium).to.have.property('kraken');
                                        premium.kraken.should.be.equal('k');
                                    });
                                });
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
                        describe ( 'idrinth.MultiplierSet()', function ( ) {
                            var multiplier = new idrinth.MultiplierSet( 'l', 'm', 'c');
                            it ( 'MultiplierSet should return an object', function ( ) {
                                should.exist( multiplier );
                                multiplier.should.be.an( 'object' );
                                describe ('idrinth.MultiplierSet#Instance', function() {
                                    it ('MultiplierSet should have a mount property', function () {
                                        expect(multiplier).to.have.property('mount');
                                        multiplier.mount.should.be.equal('m');
                                    });
                                    it ('MultiplierSet should have a critchance property', function () {
                                        expect(multiplier).to.have.property('critchance');
                                        multiplier.critchance.should.be.equal('c');
                                    });
                                    it ('MultiplierSet should have a legion property', function () {
                                        expect(multiplier).to.have.property('legion');
                                        multiplier.legion.should.be.equal('l');
                                    });
                                });
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
                        describe ( 'idrinth.StatSet()', function ( ) {
                            var stat = new idrinth.StatSet( 'a', 'd', 'p', 'l', 's' );
                            it ( 'StatSet should return an object', function ( ) {
                                should.exist( stat );
                                stat.should.be.an( 'object' );
                                describe ('idrinth.StatSet#Instance', function() {
                                    it ('StatSet should have an attack property', function () {
                                        expect(stat).to.have.property('attack');
                                        stat.attack.should.be.equal('a');
                                    });
                                    it ('StatSet should have an defense property', function () {
                                        expect(stat).to.have.property('defense');
                                        stat.defense.should.be.equal('d');
                                    });
                                    it ('StatSet should have an perception property', function () {
                                        expect(stat).to.have.property('perception');
                                        stat.perception.should.be.equal('p');
                                    });
                                    it ('StatSet should have an level property', function () {
                                        expect(stat).to.have.property('level');
                                        stat.level.should.be.equal('l');
                                    });
                                    it ('StatSet should have an stats property', function () {
                                        expect(stat).to.have.property('stats');
                                        stat.stats.should.be.equal('s');
                                    });
                                    it ('StatSet should have an increase property', function () {
                                        expect(stat).to.have.property('increase');
                                        // @todo test
                                    });
                                    it ('StatSet should have an getCost property', function () {
                                        expect(stat).to.have.property('getCost');
                                        // @todo test
                                    });
                                });
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
                        describe ( 'idrinth.Calculator()', function ( ) {
                            var calculator = new idrinth.Calculator( 'stat', 'premium', 'multiplier');
                            it ( 'Calculator should return an object', function ( ) {
                                should.exist( calculator );
                                calculator.should.be.an( 'object' );
                                describe ('idrinth.Calculator#Instance', function() {
                                    it ('Calculator should have an stat property', function () {
                                        expect(calculator).to.have.property('stat');
                                        calculator.stat.should.be.equal('stat');
                                    });
                                    it ('Calculator should have an premium property', function () {
                                        expect(calculator).to.have.property('premium');
                                        calculator.premium.should.be.equal('premium');
                                    });
                                    it ('Calculator should have an multiplier property', function () {
                                        expect(calculator).to.have.property('multiplier');
                                        calculator.multiplier.should.be.equal('multiplier');
                                    });
                                    //@todo method tests
                                });
                            } );
                        } );
                    } );
                } );
            } );
        } );
    } );
} );