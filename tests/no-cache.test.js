import test from "tape"
import Cache  from "../src/translator/cache/no-cache.js"

test("Should always return null from no-cache", function (tst) {
    const cache = new Cache();
    const lang = "en";
    const phrase = "test";
    cache.put(lang, phrase, "test-translation");
    tst.equal(cache.get(lang, phrase), null);
    tst.end();
});

