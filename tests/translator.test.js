import tape from "tape"
import asyncWrap from "tape-promise"
import fetchMock from "fetch-mock"
import Translator from "../src/translator/translator.js"
const test = asyncWrap(tape);

test("Should check list of supported languages", function (tst) {
    const supportedLangs = { en: true, ru: false };
    const translator = new Translator("api-key", supportedLangs);
    tst.true(translator.isSupported("en"), "En language should be supported");
    tst.false(translator.isSupported("ru"), "Ru language should not be supported");
    tst.false(translator.isSupported("it"), "It language should not be supported");
    tst.end();
});

test("Should detect language using YA Translate API", function(t) {
    const expectedLang = "en";
    const supportedLangs = { en: true, ru: false };
    const translator = new Translator("api-key", supportedLangs);
    
    fetchMock.post("glob:*/api/*detect*", { code: 200, lang: expectedLang });

    translator
        .detect("detect-me")
        .then((result) => {
            t.equal(result, expectedLang);
            t.end();
        })
        .catch((err) => { t.end(); });
    
    fetchMock.restore();
});

test("Should translate phrase using YA Translate API", function(t) {
    const expectedTranslation = "hello!";
    const supportedLangs = { en: true, ru: false };
    const translator = new Translator("api-key", supportedLangs);
    
    fetchMock.post("glob:*/api/*translate*", { code: 200, text: [ expectedTranslation ] });

    translator
        .translate("detect-me")
        .then((result) => {
            t.equal(result, expectedTranslation);
            t.end();
        })
        .catch((err) => { t.end(); });
    
    fetchMock.restore();
});
