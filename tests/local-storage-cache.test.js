import test from "tape"
import { mockLocalStorage, resetLocalStorage} from "./utils/mock-local-storage"
import Cache  from "../src/translator/cache/local-storage-cache.js"

const before = test;
const after = test;

before("before localStorage cache testing", function (tst) {
    tst.pass(mockLocalStorage());
    tst.end();
});

test("Should put in/get from localStorage cache correctry", function (tst) {
    const cache = new Cache();
    const lang = "en";
    const text = "test-phrase";
    const translation = "test-translation";
    cache.put(text, lang, translation);
    tst.equal(cache.get(text, lang), translation);
    tst.end();
});

test("Should remove single translation from localStorage cache correctry", function (tst) {
    const cache = new Cache();
    cache.put("one", "en", "one-en");
    cache.put("one", "it", "one-it");
    cache.remove("one", "en");
    tst.true(!cache.get("one", "en"));
    tst.equal(cache.get("one", "it"), "one-it");
    tst.end();
});

test("Remove should not affect another phrases stored in the localStorage cache", function (tst) {
    const cache = new Cache();
    cache.put("one", "en", "one-en");
    cache.put("two", "en", "two-en");
    cache.remove("one", "en");
    tst.equal(cache.get("two", "en"), "two-en");
    tst.end();
});

test("Should remove all translations from localStorage cache correctry", function (tst) {
    const cache = new Cache();
    cache.put("one", "en", "one-en");
    cache.put("one", "it", "one-it");
    cache.remove("one");
    tst.true(!cache.get("one", "en"));
    tst.true(!cache.get("one", "it"));
    tst.end();
});

test("Should override localStorage cache correctry", function (tst) {
    const cache = new Cache();
    cache.put("one", "en", "one-en");
    cache.put("one", "en", "one-en-2");
    tst.equal(cache.get("one", "en"), "one-en-2");
    tst.end();
});

test("Should clean up localStorage cache correctry", function (tst) {
    const cache = new Cache();
    cache.put("one", "en", "one-en");
    cache.clear();
    tst.true(!cache.get("one", "en"));
    tst.end();
});

after("after localStorage cache testing", function (tst) {
    tst.pass(resetLocalStorage());
    tst.end();
});
