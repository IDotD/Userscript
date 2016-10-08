idrinth.lang = {
    start: function () {
        var language = window.navigator.userLanguage || window.navigator.language;
        var file = ""; // JSON to use, dependent on language
        file = JSON.parse ( file );
        for (var prop in file) {
            idrinth.lang[prop] = file[prop];
        }
    }
}