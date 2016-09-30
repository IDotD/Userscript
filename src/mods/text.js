idrinth.text = {     
    data: {
        chat: {
                ban: 'Ban User',
                banned: 'Banned',
                makeMod: 'Make Moderator',
                makeAdmin: 'Make Admin',
                owner: 'Owner',
                makeUser: 'Make user',
                user: 'User',
                invite:'Invite to Chat ',
                close: 'Close',
                unknown:'The given username for dotd.idrinth.de is unknown, do you want to register it there?',
                
                'modify.fail':'Can\'t modify that user at the moment',
                'join.fail':'Can\'t create at the moment',
                'join.notwork':'Joining didn\'t work',
                'chat.join.notwork': 'Joining didn\'t work',
                'chat.login.fail': 'Login failed in an unexpected way',
                'default.error': 'Unexpected error occurred. Please contact script developers'
                                + ' (https://github.com/Idrinth/IDotD).',
                'This part of the script is optional, so logging in is unneeded for raid catching etc.': 'This part of the script is optional, so logging in is unneeded for raid catching etc.',
                'Account': 'Account',
                'This should not be the data for logging in on the related gaming site and the login does not need to match your ingame name - you can set a display name after the registration.': 'This should not be the data for logging in on the related gaming site and the login does not need to match your ingame name - you can set a display name after the registration.',
                "Not logged in, click to login/register": "Not logged in, click to login/register",
                'raid.import.manually.all': 'Import all manually',
                'raid.import.manually.fav': 'Import favs manually',
                'game.reload': 'Reload game',
                'raid.clear': 'Clear Raids',
                'script.reload': 'Reload Script',
                'raid.join.restart': 'Restart Raidjoin',
                'game.facebook.login.refresh': 'Refresh Facebook Game Login',
                'NG Raid Join(slow!)': 'NG Raid Join(slow!)',
                'disable timed Autojoin': 'disable timed Autojoin',
                'enable timed Autojoin': 'enable timed Autojoin',
                'Last raids joined:': 'Last raids joined:',
                'Enter Boss\' Name': 'Enter Boss\' Name'

                }
        },
    get: function (key) {
        var textKey = key || '';
        var text=idrinth.text.data;
        return text.hasOwnProperty(textKey) ? data[textKey] : text['default.error'];
    }
}