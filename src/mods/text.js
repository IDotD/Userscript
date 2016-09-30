idrinth.text = {
    getText: function (key) {
        var textKey = key || '';
        var text = {

            // currently under progress

            // Texts from chat.js
            // TODO ? - Remove getMsg function in idrinth.chat and call text via key directly from idrinth.text
            // TODO ? - Replace hardcoded strings with function calls to idrinth.text

            'Ban User': 'Ban User',
            'Banned': 'Banned',
            'Make Moderator': 'Make Moderator',
            'Make Admin': 'Make Admin',
            'Owner': 'Owner',
            'Make User': 'Make User',
            'User': 'User',

            'Invite to Chat ': 'Invite to Chat ',
            //'User':'User', - only reminder there is something to change in chat.js

            'Close': 'Close',

            // line 439 - only reminder there is something to change in chat.js

            'This part of the script is optional, so logging in is unneeded for raid catching etc.': 'This part of the script is optional, so logging in is unneeded for raid catching etc.',
            'Account': 'Account',
            'This should not be the data for logging in on the related gaming site and the login does not need to match your ingame name - you can set a display name after the registration.': 'This should not be the data for logging in on the related gaming site and the login does not need to match your ingame name - you can set a display name after the registration.',

            "Not logged in, click to login/register": "Not logged in, click to login/register",



            'modify.fail': 'Can\'t modify that user at the moment',
            'create.fail': 'Can\'t create at the moment',
            'join.fail': 'Can\'t join at the moment',
            'join.notwork': 'Joining didn\'t work',
            'user.unknown': 'The given username for dotd.idrinth.de is unknown, do you want to register it there?',
            'login.fail': 'Login failed in an unexpected way',
            'default.error': 'Unexpected error occurred. Please contact script developers'
                    + ' (https://github.com/Idrinth/IDotD).',

            // Texts from ui.js
            // TODO ? - Replace hardcoded strings with function calls to idrinth.text
            'Import all manually': 'Import all manually',
            'Import favs manually': 'Import favs manually',
            'Reload game': 'Reload game',
            'Clear Raids': 'Clear Raids',
            'Reload Script': 'Reload Script',
            'Restart Raidjoin': 'Restart Raidjoin',
            'Refresh Facebook Game Login': 'Refresh Facebook Game Login',
            'NG Raid Join(slow!)': 'NG Raid Join(slow!)',
            'disable timed Autojoin': 'disable timed Autojoin',
            'enable timed Autojoin': 'enable timed Autojoin',

            'Last raids joined:': 'Last raids joined:',
            'Enter Boss\' Name': 'Enter Boss\' Name'


        }
        return text.hasOwnProperty(textKey) ? text[textKey] : text['default.error'];
    }
}