idrinth.lang = {
    awake: function () {
        var language = window.navigator.userLanguage || window.navigator.language;
        alert(language);
        var file = "" ; // JSON to use, dependent on language
        JSON.parse(file);
        for (prop in file) {
            idrinth.lang.prop = file[prop];
        }
    }
}