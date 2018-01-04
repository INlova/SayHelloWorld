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

class TranslateService {

    constructor(apiKey, supportedLangs) {
        this.apiKey = apiKey;
        this.supportedLangs = supportedLangs;
    }

    isSupported(lang) {
        return (!lang && !this.supportedLangs[lang]);
    }

    translate(phrase, lang) {
        const request = {
            key: this.apiKey,
            text: phrase,
            lang: lang
        };
        const url = formatUrl("translate", request);
        return fetch(url, { method: "POST" })
                    .then((response) => response.json())
                    .then((data) => { 
                        if (data.code !== 200) {
                            throw new Error("Unable to get translation. Status code: " + data.code);
                        }
                        return data.text[0];
                    });
    }

    detect(phrase, ...hints) {
        const request = {
            key: this.apiKey,
            text: phrase
        };
        if (!!hints && hints.length) {
            request["hint"] = hints.join(",");
        }
        const url = formatUrl("detect", request);
        return fetch(url, { method: "POST" })
            .then((response) => response.json())
            .then((data) => { 
                if (data.code !== 200) {
                    throw new Error("Unable to detect the language. Status code: " + data.code);
                }
                return data.lang;
            });
    }

};

export default TranslateService;