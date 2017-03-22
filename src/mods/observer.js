idrinth.observer = {
    list: { },
    handle: function ( mutations, isPrivate ) {
        var handleLink = function ( element ) {
            var href = element.getAttribute ( 'href' );
            if ( href && href.match ( /action_type=raidhelp/ ) ) {
                var hash = '';
                var id = '';
                href = href.replace ( /^.*\?/, '' );
                var parts = href.split ( "&" );
                for (var count = 0; count < parts.length; count++) {
                    if ( parts[count].match ( 'raid_id=' ) ) {
                        id = parts[count].split ( '=' )[1];
                    } else if ( parts[count].match ( 'hash=' ) ) {
                        hash = parts[count].split ( '=' )[1];
                    } else if ( parts[count].match ( 'serverid=2' ) && !idrinth.settings.get ( "world" ) ) {
                        return;
                    } else if ( parts[count].match ( 'server_id=2' ) && !idrinth.settings.get ( "world" ) ) {
                        return;
                    }
                }
                if ( !id || !hash ) {
                    return;
                }
                idrinth.raids.private[id] = hash;
                idrinth.core.ajax.runHome ( 'get-raid-service/' + id + '/' + hash + '/' );
            }
        };
        mutations.forEach ( function ( mutation ) {
            mutation.addedNodes.forEach ( function ( node ) {
                if ( node.tagName === 'A' || node.tagName === 'a' ) {
                    handleLink ( node );
                } else {
                    var elements = node.getElementsByTagName ( 'a' );
                    for (var count = 0; count < elements.length; count++) {
                        handleLink ( elements[count] );
                    }
                    ;
                }
            } );
        } );
    },
    start: function () {
        if ( idrinth.platform !== 'kongregate' ) {
            return;
        }
        idrinth.observer.list.chat = new MutationObserver ( function ( mutations ) {
            idrinth.observer.handle ( mutations, false );
        } );
        idrinth.observer.list.chat.observe (
                document.getElementById ( "chat_rooms_container" ).children[1].children[2],
                {
                    childList: true,
                    subtree: true
                }
        );
        idrinth.observer.list.guild = new MutationObserver ( function ( mutations ) {
            idrinth.observer.handle ( mutations, true );
        } );
        idrinth.observer.list.guild.observe (
                document.getElementById ( "chat_rooms_container" ).children[0].children[2],
                {
                    childList: true,
                    subtree: true
                }
        );
    }
};