class InMemoryCache {

    constructor() {
        this._data = {}
    }
    
    put(phrase, lang, translation) {
        this._data[phrase] = this._data[phrase] || {};
        this._data[phrase][lang] = translation;
    }

    get(phrase, lang) {
        if (!this._data[phrase]) {
            return null;
        }
        return this._data[phrase][lang];
    }

    remove(phrase, lang) {
        if (!lang) {
            delete this._data[phrase];
        } else {
            delete this._data[phrase][lang];
        }
    }

    clear() {
        this._data = {};
    }
}

export default InMemoryCache; 