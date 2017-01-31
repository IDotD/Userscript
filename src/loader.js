// ==UserScript==
// @name           Idrinth's DotD Script
// @description    A userscript for the game Dawn of the Dragons which provides multiple useful tools, like time-saving raid catching, private chatrooms and much more to discover, see the manual at https://idotd.github.io/
// @author         Idrinth
// @version        2.2.0
// @grant          none
// @hompage        https://dotd.idrinth.de
// @include        http://www.kongregate.com/games/5thplanetgames/dawn-of-the-dragons*
// @include        https://www.kongregate.com/games/5thplanetgames/dawn-of-the-dragons*
// @include        http://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons*
// @include        https://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons*
// @include        http://kongregate.com/games/5thplanetgames/dawn-of-the-dragons*
// @include        https://kongregate.com/games/5thplanetgames/dawn-of-the-dragons*
// @include        http://kongregate.com/games/5thPlanetGames/dawn-of-the-dragons*
// @include        https://kongregate.com/games/5thPlanetGames/dawn-of-the-dragons*
// @include        http://www.dawnofthedragons.com/game*
// @include        http://www.dawnofthedragons.com/
// @include        http://www.dawnofthedragons.com
// @include        http://dawnofthedragons.com/game*
// @include        http://web1.dawnofthedragons.com/live_standalone/*
// @include        http://www.newgrounds.com/portal/view/609826*
// @include        http://newgrounds.com/portal/view/609826*
// @include        http://dawnofthedragons.com/
// @include        http://armorgames.com/dawn-of-the-dragons-game/13509*
// @include        http://www.armorgames.com/dawn-of-the-dragons-game/13509*
// ==/UserScript==
( function () {
    var sc = document.createElement ( 'script' );
    sc.setAttribute ( 'src', 'https://dotd.idrinth.de/static/userscript/' + GM_info.script.version + '/' );
    sc.setAttribute ( 'id', 'idotd-loader' );
    sc.setAttribute ( 'async', 'async' );
    sc.errorCounter = 0;
    sc.errorFunction = function () {
        var self = document.getElementById ( 'idotd-loader' );
        self.parentNode.removeChild ( self );
        var sc = document.createElement ( 'script' );
        sc.onerror = self.onerror;
        sc.errorCounter = self.errorCounter + 1;
        sc.errorFunction = self.errorFunction;
        sc.setAttribute ( 'id', 'idotd-loader' );
        sc.setAttribute ( 'async', 'async' );
        sc.setAttribute ( 'src', ( self.getAttribute ( 'src' ) + '' ).replace ( /(userscript\/.*?\/).*$/, '$1' ) + Math.random () + '/' );
        document.getElementsByTagName ( 'head' )[0].appendChild ( sc );
    };
    sc.onerror = function () {
        console.log ( "Failed loading IDotD, retry in " + ( 500 + 100 * this.errorCounter * this.errorCounter ) / 1000 + "sec." );
        window.setTimeout ( this.errorFunction, 500 + 100 * this.errorCounter * this.errorCounter );
    };
    document.getElementsByTagName ( 'head' )[0].appendChild ( sc );
} () );