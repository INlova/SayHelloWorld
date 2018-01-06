const cacheName = "sayHelloCache";

class LocalStorageCache {
    
    constructor() {
        localStorage.setItem(cacheName, "{}");
    }
    
    put(phrase, lang, translation) {
        const raw = localStorage.getItem(cacheName);
        const data = JSON.parse(raw) || {};
        data[phrase] = data[phrase] || {};
        data[phrase][lang] = translation;
        localStorage.setItem(cacheName, JSON.stringify(data));
    }

    get(phrase, lang) {
        const raw = localStorage.getItem(cacheName);
        if (!raw) { return null; }
        const data = JSON.parse(raw) || {};
        if (!data[phrase]) { return null; }
        return data[phrase][lang];
    }

    remove(phrase, lang) {
        const raw = localStorage.getItem(cacheName);
        const data = JSON.parse(raw) || {};
        if (!lang) {
            delete data[phrase];
        } else {
            delete data[phrase][lang];
        }
        localStorage.setItem(cacheName, JSON.stringify(data));
    }

    clear() {
        localStorage.setItem(cacheName, "{}");
    }
}

export default LocalStorageCache; 