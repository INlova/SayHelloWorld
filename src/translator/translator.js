import NoCache from "./cache/no-cache";
import InMemoryCache from "./cache/in-memory-cache";
import LocalStorageCache from "./cache/local-storage-cache";

const encode = encodeURIComponent;

const formatUrl = (method, query) => {
    const queryStr = Object.keys(query)
        .map((key) => {
            const val = query[key];
            if (val === undefined) { return ""; }
            if (val === null) { return encode(key); }
            return encode(key) + "=" + encode(val);
        }).join("&");
    return `https://translate.yandex.net/api/v1.5/tr.json/${method}?${queryStr}`;
};

const methodType = {
    TRANSLATE: "translate",
    DETECT: "detect"
};

const cacheType = {
    NONE: "none",
    IN_MEMORY: "in-memory",
    LOCAL_STORAGE: "local-storage"
};

class TranslateService {

    constructor(apiKey, supportedLangs, cache = cacheType.IN_MEMORY) {
        this.apiKey = apiKey;
        this.supportedLangs = supportedLangs || [];
        switch (cache) {
            case cacheType.IN_MEMORY:
                this.cache = new InMemoryCache();
                break;
            case cacheType.LOCAL_STORAGE:
                this.cache = new LocalStorageCache();
                break;
            case cacheType.NONE:
            default:
                this.cache = new NoCache();
        }
    }

    isSupported(lang) {
        return (!!lang && this.supportedLangs[lang]);
    }

    translate(phrase, lang) {
        if (!phrase || !lang || !this.isSupported(lang)) {
            return Promise.resolve(phrase);
        }
        const cached = this.cache.get(phrase, lang);
        if (cached && cached.length > 0) {
            return Promise.resolve(cached);
        }
        const request = {
            text: phrase,
            lang: lang
        };
        return this.fetchData(methodType.TRANSLATE, request)
                   .then((data) => {
                       const translation = data.text[0];
                       this.cache.put(phrase, lang, translation);
                       return translation;
                   })
                  .catch((err) => {
                      console.error(err);
                      return phrase;
                  });
    }

    detect(phrase, ...hints) {
        const request = { text: phrase };
        if (!!hints && hints.length) {
            request["hint"] = hints.join(",");
        }
        return this.fetchData(methodType.DETECT, request)
                   .then((data) => data.lang);
    }

    fetchData(method, request) {
        request["key"] = this.apiKey;
        const url = formatUrl(method, request);
        return fetch(url, { method: "POST" })
                .then((response) => response.json())
                .then((data) => {
                    if (data.code !== 200) {
                        throw new Error(`Failed request for ${method}. Status code: ${data.code}`);
                    }
                    return data;
                });
    }
};

export default TranslateService;