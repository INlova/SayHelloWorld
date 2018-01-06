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

class TranslateService {

    constructor(apiKey, supportedLangs) {
        this.apiKey = apiKey;
        this.supportedLangs = supportedLangs;
    }

    isSupported(lang) {
        return (!!lang && this.supportedLangs[lang]);
    }

    translate(phrase, lang) {
        const request = {
            text: phrase,
            lang: lang
        };
        return this.fetchData(methodType.TRANSLATE, request)
                   .then((data) => data.text[0]);
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