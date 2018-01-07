class NoCache {

    put(phrase, lang, translation) {
        /* do nothing */
    }

    get(phrase, lang) {
        return null;
    }

    remove(phrase, lang) {
        /* do nothing */
    }

    clear() {
        /* do nothing */
    }
}

export default NoCache; 