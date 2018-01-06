import test from "tape"
import Cache  from "../src/translator/cache/in-memory-cache.js"

test("Should put in/get from in-memory cache correctry", function (tst) {
    const cache = new Cache();
    
    const lang = "en";
    const text = "test-phrase";
    const translation = "test-translation";

    cache.put(text, lang, translation);
    tst.equal(cache.get(text, lang), translation);
    tst.end();
});

test("Should remove single translation from in-memory cache correctry", function (tst) {
    const cache = new Cache();
    cache.put("one", "en", "one-en");
    cache.put("one", "it", "one-it");
    cache.remove("one", "en");
    tst.true(!cache.get("one", "en"));
    tst.equal(cache.get("one", "it"), "one-it");
    tst.end();
});

test("Remove should not affect another phrases stored in the in-memory cache", function (tst) {
    const cache = new Cache();
    cache.put("one", "en", "one-en");
    cache.put("two", "en", "two-en");
    cache.remove("one", "en");
    tst.equal(cache.get("two", "en"), "two-en");
    tst.end();
});

test("Should remove all translations from in-memory cache correctry", function (tst) {
    const cache = new Cache();
    cache.put("one", "en", "one-en");
    cache.put("one", "it", "one-it");
    cache.remove("one");
    tst.true(!cache.get("one", "en"));
    tst.true(!cache.get("one", "it"));
    tst.end();
});

test("Should override in-memory cache correctry", function (tst) {
    const cache = new Cache();
    cache.put("one", "en", "one-en");
    cache.put("one", "en", "one-en-2");
    tst.equal(cache.get("one", "en"), "one-en-2");
    tst.end();
});

test("Should clean up in-memory cache correctry", function (tst) {
    const cache = new Cache();
    cache.put("one", "en", "one-en");
    cache.clear();
    tst.true(!cache.get("one", "en"));
    tst.end();
});
