idrinth.chat = {
    self: 0,
    maxId: 0,
    messages: [ ],
    oldMessages: [ ],
    elements: {
        chats: null,
        menu: null
    },
    chatRank: { },
    refreshCount: 0,
    refreshChats: function () {
        idrinth.chat.oldMessages = JSON.parse ( JSON.stringify ( idrinth.chat.messages ) );
        idrinth.chat.messages = new Array ();
        idrinth.runAjax (
                'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/update/',
                idrinth.chat.applyMessages,
                idrinth.chat.returnMessages,
                idrinth.chat.returnMessages,
                JSON.stringify ( { maxId: idrinth.chat.maxId, messages: idrinth.chat.oldMessages } )
                );
        if ( idrinth.chat.refreshCount % 25 === 0 ) {
            idrinth.chat.refreshMembers ();
        }
        idrinth.chat.refreshCount++;
    },
    refreshMembers: function () {
        idrinth.runAjax (
                'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/accounts/',
                idrinth.chat.applyMembers,
                function () {
                    window.setTimeout ( idrinth.chat.refreshMembers, 1000 );
                },
                function () {
                    window.setTimeout ( idrinth.chat.refreshMembers, 1000 );
                },
                ''
                );
    },
    returnMessages: function ( data ) {
        for (var count = idrinth.chat.oldMessages.length - 1; count >= 0; count--) {
            idrinth.chat.messages.unshift ( idrinth.chat.oldMessages[count] );
        }
        idrinth.chat.oldMessages = new Array ();
        window.setTimeout ( idrinth.chat.refreshChats, 666 );
    },
    userclick: function ( element, user, chat ) {
        if ( !idrinth.chat.chatRank[chat][idrinth.chat.self] || idrinth.chat.chatRank[chat][idrinth.chat.self] === 'User' ) {
            return;//Users can't do stuff
        }
        var options = [ ];
        options.push (
                idrinth.ui.buildElement (
                        { type: 'li', content: 'Ban User', attributes: [
                                {
                                    name: 'onclick',
                                    value: 'idrinth.chat.useroptions(' + chat + ',' + user + ',\'Banned\');this.parentNode.parentNode.removeChild(this.parentNode);'
                                }
                            ] } ) );
        if ( idrinth.chat.chatRank[chat][idrinth.chat.self] === 'Owner' ) {
            options.push (
                    idrinth.ui.buildElement (
                            { type: 'li', content: 'Make Moderator', attributes: [
                                    {
                                        name: 'onclick',
                                        value: 'idrinth.chat.useroptions(' + chat + ',' + user + ',\'Mod\');this.parentNode.parentNode.removeChild(this.parentNode);'
                                    }
                                ] } ) );
            options.push (
                    idrinth.ui.buildElement (
                            { type: 'li', content: 'Make Admin', attributes: [
                                    {
                                        name: 'onclick',
                                        value: 'idrinth.chat.useroptions(' + chat + ',' + user + ',\'Owner\');this.parentNode.parentNode.removeChild(this.parentNode);'
                                    }
                                ] } ) );
            options.push (
                    idrinth.ui.buildElement (
                            { type: 'li', content: 'Make User', attributes: [
                                    {
                                        name: 'onclick',
                                        value: 'idrinth.chat.useroptions(' + chat + ',' + user + ',\'User\');this.parentNode.parentNode.removeChild(this.parentNode);'
                                    }
                                ] } ) );
        }
        options.push (
                idrinth.ui.buildElement (
                        { type: 'li', content: 'Close', attributes: [
                                {
                                    name: 'onclick',
                                    value: 'this.parentNode.parentNode.removeChild(this.parentNode);'
                                }
                            ] } ) );
        var list = document.createElement ( 'ul' );
        for (var count = 0; count < options.length; count++) {
            list.appendChild ( options[count] );
        }
        list.setAttribute ( 'class', 'idrinth-userinfo-box' );
        var pos = idrinth.ui.getPosition ( element );
        list.setAttribute ( 'style', 'left:' + pos.x + 'px;top:' + pos.y + 'px' );
        idrinth.ui.body.appendChild ( list );
    },
    useroptions: function ( chat, user, rank ) {
        idrinth.runAjax (
                'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/rank/',
                function ( reply ) {
                    try {
                        reply = JSON.parse ( reply );
                        idrinth.alert ( reply.message );
                    } catch ( e ) {
                        idrinth.log ( e );
                    }
                },
                function ( reply ) {
                    idrinth.alert ( 'Can\'t modify that user at the moment' );
                },
                function ( reply ) {
                    idrinth.alert ( 'Can\'t modify that user at the moment' );
                },
                JSON.stringify ( { chat: chat, user: user, access: rank } )
                );
    },
    replaceInText: function ( message, regex, callbacks, lastField ) {
        var complexHandler = function ( message, regex, callbacks, lastField ) {
            var matches = message.match ( regex );
            var text = ( message.replace ( regex, '$1########$' + lastField ) ).split ( '########' );
            var textcontent = [ ];
            var length = matches.length + text.length;
            for (var count = 0; count < length; count++) {
                if ( count % 2 === 0 && typeof callbacks[1] === 'function' ) {
                    var tmp = callbacks[1] ( text[Math.ceil ( count / 2 )] );
                    for (var c2 = 0; c2 < tmp.length; c2++) {
                        if ( tmp[c2] !== undefined ) {
                            textcontent.push ( tmp[c2] );
                        }
                    }
                } else if ( count % 2 === 0 ) {
                    if ( text[Math.ceil ( count / 2 )] !== undefined ) {
                        textcontent.push ( { type: '#text', content: text[Math.ceil ( count / 2 )] } );
                    }
                } else {
                    textcontent.push ( callbacks[0] ( matches[Math.ceil ( ( count - 1 ) / 2 )] ) );
                }
            }
            return textcontent;
        };
        var simpleHandler = function ( message, callbacks ) {
            if ( typeof callbacks[1] === 'function' ) {
                var textcontent = [ ];
                var tmp = callbacks[1] ( message );
                for (var c2 = 0; c2 < tmp.length; c2++) {
                    textcontent.push ( tmp[c2] );
                }
                return textcontent;
            }
            return [ { type: '#text', content: message } ];
        };
        try {
            return complexHandler ( message, regex, callbacks, lastField );
        } catch ( e ) {
            return simpleHandler ( message, callbacks );
        }
    },
    buildEmoticons: function ( message ) {
        if ( !idrinth.chat.emotes.lookup ) {
            return message;
        }
        var part = idrinth.escapeRegExp ( Object.keys ( idrinth.chat.emotes.lookup ).join ( 'TTTT' ) );
        var reg = new RegExp ( '(^| )(' + part.replace ( /TTTT/g, '|' ) + ')($| )', 'g' );
        return idrinth.chat.replaceInText ( message, reg, [ function ( match ) {
                var el = idrinth.chat.emotes.positions[idrinth.chat.emotes.lookup[match.replace ( / /g, '' )]];
                return { type: 'span', css: 'idrinth-emoticon',
                    attributes: [
                        { name: 'style', value: 'background-position: 0px -' + el / 8 + 'px;' },
                        { name: 'title', value: message }
                    ], children: [
                        {
                            type: 'span',
                            attributes: [
                                { name: 'style', value: 'background-position: 0px -' + el / 2 + 'px;' }
                            ]
                        }
                    ]
                };
            } ], 3 );
    },
    buildMessageText: function ( message ) {
        var reg = new RegExp ( '(^|\\W)(https?://([^/ ]+)(/.*?)?)($| )', 'ig' );
        return idrinth.chat.replaceInText ( message, reg, [ function ( match ) {
                return { type: 'a',
                    content: match.match ( /:\/\/([^\/]+?)(\/|$)/ )[1],
                    attributes: [
                        { name: 'href', value: match },
                        { name: 'title', value: 'Go to ' + match },
                        { name: 'target', value: '_blank' }
                    ]
                };
            }, idrinth.chat.buildEmoticons ], 5 );
    },
    applyMessages: function ( data ) {
        var processMessages = function ( messages ) {
            var addMessages = function ( chatMessages, chatId, chatElement ) {
                var buildMessage = function ( message, chat, chatId, messageId ) {
                    chat.appendChild ( idrinth.ui.buildElement (
                            {
                                type: 'li',
                                id: 'idrinth-single-chat-message-' + messageId + ( parseInt ( messageId, 10 ) < 1 ? '-' + idrinth.getfullDateInt () : '' ),
                                css: ( parseInt ( message.user, 10 ) === parseInt ( idrinth.chat.self, 10 ) ? 'self-written ' : '' ),
                                children: [
                                    { type: 'span', css: 'time', content: message.time.split ( ' ' )[1], attributes: [ { name: 'title', value: message.time } ] },
                                    { type: 'span', css: 'user ' + idrinth.chat.ranks[parseInt ( idrinth.chat.chatRank[chatId][message.user], 10 )], content: idrinth.chat.users[message.user].name, attributes:
                                                [
                                                    { name: 'data-id', value: message.user },
                                                    { name: 'style', value: ( message.user === 0 ? 'font-weight:bold' : '' ) },
                                                    { name: 'onclick', value: 'idrinth.chat.userclick(this,' + message.user + ',' + chatId + ')' }
                                                ]
                                    },
                                    { type: '#text', content: ':' },
                                    { type: 'span', children: idrinth.chat.buildMessageText ( message.text ) }
                                ]
                            }
                    ) );
                };
                var isNew = false;
                for (var messageId in chatMessages) {
                    if ( parseInt ( messageId, 10 ) < 1 || !document.getElementById ( 'idrinth-single-chat-message-' + messageId ) ) {
                        isNew = true;
                        buildMessage ( messages[chatId][messageId], chatElement, chatId, messageId );
                        if ( parseInt ( messageId, 10 ) > parseInt ( idrinth.chat.maxId, 10 ) ) {
                            idrinth.chat.maxId = messageId;
                        }
                    }
                }
                return isNew;
            };
            var setChatClass = function ( isNew, chat, chatId ) {
                var isActive = function ( element ) {
                    var cssClass = element.getAttribute ( 'class' );
                    return !( !cssClass ) && !( !cssClass.match ( /(^|\s)active(\s|$)/ ) );
                };
                var chatActive = isActive ( document.getElementById ( 'idrinth-chat' ) );
                if ( isNew && !chatActive ) {
                    document.getElementById ( 'idrinth-chat' ).setAttribute ( 'class', 'new-message' );
                }
                var tab = document.getElementById ( 'idrinth-chat-tab-click-' + chatId );
                var tabActive = isActive ( tab );
                if ( isNew && !tabActive ) {
                    tab.setAttribute ( 'class', tab.getAttribute ( 'class' ) + ' new-message' );
                } else if ( tabActive && chatActive && chat.lastChild.scrollTop < chat.lastChild.scrollHeight ) {
                    try {
                        chat.lastChild.scrollIntoView ( false );
                    } catch ( e ) {
                    }
                    chat.lastChild.scrollTop = chat.lastChild.scrollHeight;
                }
            };
            if ( idrinth.chat.maxId === 0 ) {
                idrinth.chat.maxId = 1;
            }
            for (var key in messages) {
                if ( document.getElementById ( 'idrinth-chat-tab-' + key ) && document.getElementById ( 'idrinth-chat-tab-' + key ).getElementsByTagName ( 'ul' )[1] ) {
                    var chat = document.getElementById ( 'idrinth-chat-tab-' + key ).getElementsByTagName ( 'ul' )[1];
                    setChatClass ( addMessages ( messages[key], key, chat ), chat, key );
                }
            }
        };
        if ( !data ) {
            return idrinth.chat.returnMessages ( data );
        }
        data = JSON.parse ( data );
        if ( !data ) {
            return idrinth.chat.returnMessages ( data );
        }
        if ( data.login ) {
            return idrinth.chat.relogin ();
        }
        if ( data.messages ) {
            processMessages ( data.messages );
        }
        idrinth.chat.oldMessages = new Array ();
        window.setTimeout ( function () {
            idrinth.chat.refreshChats ();
        }, 666 );
    },
    ranks: [ '', 'banned', 'user', 'mod', 'owner' ],
    applyMembers: function ( data ) {
        var applyMemberData = function () {
            var addMemberElement = function ( chat, chatId, userId ) {
                var usedPlatforms = '';
                for (var pkey in idrinth.chat.users[userId].platforms) {
                    if ( idrinth.chat.users[userId].platforms[pkey] ) {
                        usedPlatforms += pkey;
                    }
                }
                chat.appendChild ( idrinth.ui.buildElement (
                        {
                            type: 'li',
                            css: 'user ' + idrinth.chat.ranks[parseInt ( idrinth.chat.members[chatId][userId], 10 )],
                            content: ( usedPlatforms === '' ? '' : '[' + usedPlatforms.toUpperCase () + '] ' ) + idrinth.chat.users[userId].name,
                            attributes:
                                    [
                                        { name: 'data-id', value: userId },
                                        { name: 'onclick', value: 'idrinth.chat.userclick(this,' + userId + ')' }
                                    ]
                        }
                ) );
            };
            for (var chatId in idrinth.chat.members) {
                if ( document.getElementById ( 'idrinth-chat-tab-' + chatId ) ) {
                    var chat = document.getElementById ( 'idrinth-chat-tab-' + chatId ).getElementsByTagName ( 'ul' )[0];
                    while ( chat.firstChild ) {
                        chat.removeChild ( chat.firstChild );
                    }
                    for (var userId in idrinth.chat.members[chatId]) {
                        addMemberElement ( chat, chatId, userId );
                    }
                }
            }
        };
        if ( !data ) {
            return idrinth.chat.returnMessages ( data );
        }
        data = JSON.parse ( data );
        if ( !data ) {
            return idrinth.chat.returnMessages ( data );
        }
        idrinth.chat.self = data.self;
        idrinth.chat.users = data.users;
        idrinth.chat.chatRank = data.members;
        applyMemberData ();
    },
    emotes: { },
    start: function () {
        if ( !idrinth.settings.chatting ) {
            return;
        }
        if ( !document.getElementById ( 'idrinth-chat' ) ) {
            window.setTimeout ( function () {
                idrinth.chat.start ();
            }, 1000 );
        }
        window.setTimeout ( function () {
            idrinth.runAjax (
                    'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/login/',
                    idrinth.chat.startLoginCallback,
                    function ( reply ) {
                    },
                    function ( reply ) {
                        window.setTimeout ( function () {
                            idrinth.chat.login ();
                        }, 1 );
                    },
                    JSON.stringify ( {
                        user: idrinth.settings.chatuser,
                        pass: idrinth.settings.chatpass
                    } )
                    );
        }, 2500 );
        window.setTimeout ( function () {
            idrinth.runAjax (
                    'https://dotd.idrinth.de/static/emoticons/data/',
                    function ( reply ) {
                        idrinth.chat.emotes = JSON.parse ( reply );
                    },
                    function ( reply ) {
                    },
                    function ( reply ) {
                    },
                    ''
                    );
        }, 1 );
    },
    create: function () {
        idrinth.runAjax (
                'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/create/',
                idrinth.chat.joinCallback,
                function ( reply ) {
                    idrinth.alert ( 'Can\'t create at the moment' );
                },
                function ( reply ) {
                    idrinth.alert ( 'Can\'t create at the moment' );
                },
                document.getElementById ( 'idrinth-make-chat' ).getElementsByTagName ( 'input' )[0].value
                );
    },
    joinCallback: function ( reply ) {
        if ( !reply ) {
            idrinth.alert ( 'Can\'t join at the moment' );
            return;
        }
        reply = JSON.parse ( reply );
        if ( !reply ) {
            idrinth.alert ( 'Can\'t join at the moment' );
            return;
        }
        if ( !reply.success ) {
            if ( reply.message ) {
                idrinth.alert ( reply.message );
            } else {
                idrinth.alert ( 'Joining didn\'t work' );
            }
            return;
        }
        idrinth.ui.buildChat ( reply.data.id, reply.data.name, reply.data.access, reply.data.pass );
        document.getElementById ( 'idrinth-add-chat' ).getElementsByTagName ( 'input' )[0].value = '';
        document.getElementById ( 'idrinth-add-chat' ).getElementsByTagName ( 'input' )[1].value = '';
        document.getElementById ( 'idrinth-make-chat' ).getElementsByTagName ( 'input' )[0].value = '';
    },
    users: { },
    add: function () {
        idrinth.runAjax (
                'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/join/',
                idrinth.chat.joinCallback,
                function ( reply ) {
                    idrinth.alert ( 'Can\'t join at the moment' );
                },
                function ( reply ) {
                    idrinth.alert ( 'Can\'t join at the moment' );
                },
                JSON.stringify ( {
                    id: document.getElementById ( 'idrinth-add-chat' ).getElementsByTagName ( 'input' )[0].value,
                    pass: document.getElementById ( 'idrinth-add-chat' ).getElementsByTagName ( 'input' )[1].value
                } )
                );
    },
    send: function ( id ) {
        idrinth.chat.messages.push ( { chat: id, text: document.getElementById ( 'idrinth-chat-input-' + id ).value } );
        document.getElementById ( 'idrinth-chat-input-' + id ).value = '';
    },
    join: function ( list ) {
        for (var key in list) {
            idrinth.ui.buildChat ( key, list[key].name, list[key].access, list[key].pass );
        }
        window.setTimeout ( function () {
            idrinth.chat.refreshChats ();
        }, 1500 );
        idrinth.chat.refreshMembers ();
    },
    startLoginCallback: function ( data ) {
        if ( !data ) {
            return;
        }
        data = JSON.parse ( data );
        if ( !data || !data.success ) {
            return;
        }
        idrinth.ui.removeElement ( 'idrinth-chat-login' );
        idrinth.chat.join ( data.data );
    },
    loginCallback: function ( data ) {
        if ( !data ) {
            idrinth.alert ( 'Logging in failed in an unexpected way' );
            return;
        }
        data = JSON.parse ( data );
        if ( !data ) {
            idrinth.alert ( 'Logging in failed in an unexpected way' );
            return;
        }
        if ( !data.success && data.message && data['allow-reg'] ) {
            idrinth.chat.startRegistration ();
            return;
        }
        if ( !data.success && data.message ) {
            idrinth.alert ( data.message );
            return;
        }
        if ( data.success ) {
            idrinth.settings.chatuser = document.getElementById ( 'idrinth-chat-login' ).getElementsByTagName ( 'input' )[0].value;
            idrinth.settings.chatpass = document.getElementById ( 'idrinth-chat-login' ).getElementsByTagName ( 'input' )[1].value;
            idrinth.settings.save ();
            idrinth.ui.removeElement ( 'idrinth-chat-login' );
            idrinth.chat.join ( data.data );
            return;
        }
        idrinth.alert ( 'Logging in failed in an unexpected way' );
    },
    startRegistration: function () {
        if ( window.confirm ( 'The given username for dotd.idrinth.de is unknown, do you want to register it there?' ) ) {
            idrinth.chat.register ();
        }
    },
    register: function () {
        idrinth.runAjax (
                'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/register/',
                idrinth.chat.loginCallback,
                function ( reply ) {
                    idrinth.alert ( 'Logging in failed in an unexpected way' );
                },
                function ( reply ) {
                    window.setTimeout ( function () {
                        idrinth.chat.login ();
                    }, 1 );
                },
                JSON.stringify ( {
                    user: document.getElementById ( 'idrinth-chat-login' ).getElementsByTagName ( 'input' )[0].value,
                    pass: document.getElementById ( 'idrinth-chat-login' ).getElementsByTagName ( 'input' )[1].value
                } )
                );
    },
    login: function () {
        idrinth.runAjax (
                'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/login/',
                idrinth.chat.loginCallback,
                function ( reply ) {
                    idrinth.alert ( 'Logging in failed in an unexpected way' );
                },
                function ( reply ) {
                    window.setTimeout ( function () {
                        idrinth.chat.login ();
                    }, 1 );
                },
                JSON.stringify ( {
                    user: document.getElementById ( 'idrinth-chat-login' ).getElementsByTagName ( 'input' )[0].value,
                    pass: document.getElementById ( 'idrinth-chat-login' ).getElementsByTagName ( 'input' )[1].value
                } )
                );
    },
    relogin: function () {
        idrinth.runAjax (
                'https://dotd.idrinth.de/' + idrinth.platform + '/chat-service/login/',
                function () {
                    window.setTimeout ( idrinth.chat.refreshChats, 1500 );
                },
                function ( reply ) {
                    idrinth.alert ( 'Logging in failed in an unexpected way' );
                },
                function ( reply ) {
                    window.setTimeout ( function () {
                        idrinth.chat.login ();
                    }, 1 );
                },
                JSON.stringify ( {
                    user: idrinth.settings.chatuser,
                    pass: idrinth.settings.chatpass
                } )
                );
    },
    enableChat: function ( element ) {
        var tabs = document.getElementsByClassName ( 'chat-tabs' )[0].children;
        var labels = document.getElementsByClassName ( 'chat-labels' )[0].children;
        for (var counter = 0; counter < labels.length; counter++) {
            var cur = labels[counter].getAttribute ( 'class' ) + '';
            labels[counter].setAttribute ( 'class', cur.replace ( /(^|\s)active(\s|$)/, ' ' ) );
            tabs[counter].setAttribute ( 'class', '' );
            if ( tabs[counter].getAttribute ( 'data-id' ) === element.getAttribute ( 'data-id' ) ) {
                tabs[counter].setAttribute ( 'class', 'active' );
            }
        }
        if ( element.hasAttribute ( 'class' ) ) {
            element.setAttribute ( 'class', ( element.getAttribute ( 'class' ) ).replace ( /(^|\s)new-message(\s|$)/, ' ' ) + ' active' );
        } else {
            element.setAttribute ( 'class', 'active' );
        }
    },
    openCloseChat: function ( element ) {
        var chat = element.parentNode;
        if ( chat.getAttribute ( 'class' ) === 'idrinth-hovering-box active' || chat.getAttribute ( 'class' ) === 'idrinth-hovering-box active left-sided' ) {
            chat.setAttribute ( 'class', 'idrinth-hovering-box' + ( idrinth.settings.moveLeft ? ' left-sided' : '' ) +
                    ( chat.getElementsByClassName ( 'new-message' ) && chat.getElementsByClassName ( 'new-message' ).length ? ' new-message' : '' ) );
            element.innerHTML = '&lt;&lt;';
        } else {
            chat.setAttribute ( 'class', 'idrinth-hovering-box active' + ( idrinth.settings.moveLeft ? ' left-sided' : '' ) );
            element.innerHTML = '&gt;&gt;';
        }
    }
};