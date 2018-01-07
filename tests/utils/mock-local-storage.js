
const originStorage = global.localStorage;

export function mockLocalStorage() {
    const storageData = {};
    const mockStorage = {};
    mockStorage.setItem = function (key, value) { storageData[key] = value + ""; }
    mockStorage.getItem = function (key) { return storageData[key] || ""; }
    global.localStorage = mockStorage;
}

export function resetLocalStorage() {
    global.localStorage = originStorage;
}