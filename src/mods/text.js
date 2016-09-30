idrinth.text = {     
    data: {
        chat: {
            ui:{
                close: 'Close',
                invite:'Invite to Chat ',
                account: 'Account',
                chat: 'Chat',
                createChat: 'Create Chat',
                joinChat: 'Join Chat',
                createAddChat: "Click to create additional chat",
                creditEmoticon: 'Emoticons provided by ',
                copyIdPasswort: 'Copy Password&Id',
                moreSettings: 'More settings at ',
                deleteRoom: 'Delete Room',
                leaveRoom: 'Leave Room',
            },
            message:{
                optional: 'This part of the script is optional, so logging in is unneeded for raid catching etc.',
                invalid: 'This should not be the data for logging in on the related gaming site and the login does not need to match your ingame name - you can set a display name after the registration.',
                offline: "Not logged in, click to login/register",
                modifyFail:'Can\'t modify that user at the moment',
                createFail: 'Can\'t create at the moment',
                joinFail: 'Can\'t join at the moment',
                joinNotwork:'Joining didn\'t work',
                loginFail: 'Login failed in an unexpected way',
                unknown:'The given username for dotd.idrinth.de is unknown, do you want to register it there?',
            },
            error:{
                errorDefault: 'Unexpected error occurred. Please contact script developers'
                                + ' (https://github.com/Idrinth/IDotD).',
            }
        },
        land: {
            lackGold: 'You lack gold to buy any more buildings at the moment.',
        },
    },
    get: function (key) {
        var getSub = function (obj, keys, func) {
            var key = keys.shift();
            if (obj.hasOwnProperty(key)) {
                if (keys.length > 0) {
                    return func(obj[key], keys, func);
                }
                return obj[key];
            }
            return idrinth.text.data.chat.error.errorDefault;
        };
        return getSub(idrinth.text.data,key.split('.'),getSub);
    }
}