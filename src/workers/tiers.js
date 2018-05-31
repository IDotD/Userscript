var idrinth = {
    /**
     *
     * @param {Array} list
     * @param {RegExp} regExp
     * @returns {Boolean}
     */
    matchesAny: function ( list, regExp ) {
        for (var count = 0; count < list.length; count++) {
            if ( list[count] && list[count].match ( regExp ) ) {
                return true;
            }
        }
        return regExp.toString () === "/(?:)/i";
    },
    isFilterValid: function (data) {
        if(data.name && data.name.length > 0) {
            return true;
        }
        return data.type && data.type.length > 0;
    },
    /**
     * @param {Object} data
     * @return {Array}
     */
    work: function ( data ) {
        let result = [ ];
        if (idrinth.isFilterValid(data)) {
            let nameRegExp = new RegExp ( data.name, "i" );
            let typeRegExp = new RegExp ( data.type, "i" );
            for (let key in data.list) {
                if (
                    key.match ( nameRegExp ) &&
                    idrinth.matchesAny ( data.list[key].types, typeRegExp )
                ) {
                    result.push ( key );
                }
            }
        }
        return result;
    }
};