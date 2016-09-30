idrinth.text = {
    getText: function (key) {
        var textKey = key || '';
        var data = {
            "chat.user.action.ban": "Ban user",
            'chat.user.status.banned': 'Banned',
            'chat.user.action.makeMod': 'Make Moderator',
            'chat.user.action.makeAdmin': 'Make Admin',
            'chat.user.owner': 'Owner',
            'chat.user.action.makeUser': 'Make User',
            'chat.user.user': 'User',
            'chat.user.action.invite ': 'Invite to Chat ',
            'chat.user.action.close': 'Close',

            'chat.user.modify.fail': 'Can\'t modify that user at the moment',
            'chat.create.fail': 'Can\'t create at the moment',
            'chat.join.fail': 'Can\'t join at the moment',
            'chat.join.notwork': 'Joining didn\'t work',
            'chat.user.status.unknown': 'The given username for dotd.idrinth.de is unknown, do you want to register it there?',
            'chat.login.fail': 'Login failed in an unexpected way',
            'default.error': 'Unexpected error occurred. Please contact script developers'
                    + ' (https://github.com/Idrinth/IDotD).',

            'This part of the script is optional, so logging in is unneeded for raid catching etc.': 'This part of the script is optional, so logging in is unneeded for raid catching etc.',
            'Account': 'Account',
            'This should not be the data for logging in on the related gaming site and the login does not need to match your ingame name - you can set a display name after the registration.': 'This should not be the data for logging in on the related gaming site and the login does not need to match your ingame name - you can set a display name after the registration.',
            "Not logged in, click to login/register": "Not logged in, click to login/register",

            'raid.import.manually.all': 'Import all manually',
            'raid.import.manually.fav': 'Import favs manually',

            'reload.game': 'Reload game',
            'raid.clear': 'Clear Raids',
            'reload.script': 'Reload Script',
            'Restart Raidjoin': 'Restart Raidjoin',
            'Refresh Facebook Game Login': 'Refresh Facebook Game Login',
            'NG Raid Join(slow!)': 'NG Raid Join(slow!)',
            'disable timed Autojoin': 'disable timed Autojoin',
            'enable timed Autojoin': 'enable timed Autojoin',

            'Last raids joined:': 'Last raids joined:',
            'Enter Boss\' Name': 'Enter Boss\' Name'
        }


        return text.hasOwnProperty(textKey) ? data[textKey] : text['default.error'];
    }
}