import tape from "tape"
import asyncWrap from "tape-promise"
import fetchMock from "fetch-mock"

import { mockLocalStorage, resetLocalStorage} from "./utils/mock-local-storage"
import TranslateService from "../src/translator/translate-service"

const test = asyncWrap(tape);
const before = test;
const after = test;

before("before translate service testing", function (tst) {
    tst.pass(mockLocalStorage());
    tst.end();
});

test("Should check list of supported languages", function (tst) {
    const supportedLangs = { en: true, ru: false };
    const translator = new TranslateService("api-key", supportedLangs);
    tst.true(translator.isSupported("en"), "En language should be supported");
    tst.false(translator.isSupported("ru"), "Ru language should not be supported");
    tst.false(translator.isSupported("it"), "It language should not be supported");
    tst.end();
});

test("Should detect language using YA Translate API", function(t) {
    const expectedLang = "en";
    const supportedLangs = { en: true, ru: false };
    const translator = new TranslateService("api-key", supportedLangs);
    
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
    const translator = new TranslateService("api-key", supportedLangs);
    
    fetchMock.post("glob:*/api/*translate*", { code: 200, text: [ expectedTranslation ] });

    translator
        .translate("detect-me", "en")
        .then((result) => {
            t.equal(result, expectedTranslation);
            t.end();
        })
        .catch((err) => { t.end(); });
    
    fetchMock.restore();
});

test("Should translate phrase using YA Translate API", function(t) {
    const expectedTranslation = "hello!";
    const supportedLangs = { en: true, ru: false };
    const translator = new TranslateService("api-key", supportedLangs);
    
    fetchMock.post("glob:*/api/*translate*", { code: 200, text: [ expectedTranslation ] });

    translator
        .translate("detect-me", "en")
        .then((result) => {
            t.equal(result, expectedTranslation);
            t.end();
        })
        .catch((err) => { t.end(); });
    
    fetchMock.restore();
});

test("Should use cached translations by default", function(t) {
    const expectedTranslation = "hello!";
    const supportedLangs = { en: true, ru: false };
    const translator = new TranslateService("api-key", supportedLangs);
    
    fetchMock.postOnce("glob:*/api/*translate*", { code: 200, text: [ expectedTranslation ] });

    translator
        .translate("detect-me", "en")
        .then((result) => {
            t.equal(result, expectedTranslation);
            translator
                .translate("detect-me", "en")
                .then((result) => {
                    t.equal(result, expectedTranslation);
                    t.true(fetchMock.done());
                    t.end();
                });
        })
        .catch((err) => { t.end(); });
    
    fetchMock.restore();
});

test("Should not use cache if no-cache option selected", function(t) {
    const expectedTranslation = "hello!";
    const supportedLangs = { en: true, ru: false };
    const translator = new TranslateService("api-key", supportedLangs, "no-cache");
    
    fetchMock.post(
        "glob:*/api/*translate*", 
        { code: 200, text: [ expectedTranslation ] },
        { repeat: 2 });

    translator
        .translate("detect-me", "en")
        .then((result) => {
            t.equal(result, expectedTranslation);
            translator
                .translate("detect-me", "en")
                .then((result) => {
                    t.equal(result, expectedTranslation);
                    t.true(fetchMock.done());
                    t.end();
                });
        })
        .catch((err) => { t.end(); });
    
    fetchMock.restore();
});

test("Should return original phrase if unsupported lang provided", function(t) {
    const supportedLangs = { en: true, ru: false };
    const translator = new TranslateService("api-key", supportedLangs);
    const phrase = "hello!";
    
    translator
        .translate(phrase, "it")
        .then((result) => {
            t.equal(result, phrase);
            t.end();
        })
        .catch((err) => { t.end(); });
});

test("Should return original phrase if failed to get translation", function(t) {
    const supportedLangs = { en: true, ru: false };
    const translator = new TranslateService("api-key", supportedLangs);
    const phrase = "hello!";
    
    fetchMock.post("glob:*/api/*translate*", { code: 401 });

    translator
        .translate(phrase, "en")
        .then((result) => {
            t.equal(result, phrase);
            t.end();
        })
        .catch((err) => { t.end(); });
});

test("Should return original phrase if some lang parameter was missed", function(t) {
    const supportedLangs = { en: true, ru: false };
    const translator = new TranslateService("api-key", supportedLangs);
    const phrase = "hello!";
    
    translator
        .translate(phrase)
        .then((result) => {
            t.equal(result, phrase);
            t.end();
        })
        .catch((err) => { t.end(); });
});

after("after translate service testing", function (tst) {
    tst.pass(resetLocalStorage());
    tst.end();
});
