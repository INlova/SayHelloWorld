import TranslateService from "./translator/translator";
import { apiKey } from "./translator/settings/api-key";
import { supportedLangs } from "./translator/settings/supported-langs";

console.log("hello!");
const translator = new TranslateService(apiKey, supportedLangs);
translator.translate("Привет", "en").then(r => { console.log(r); });
translator.detect("Привет", "en").then(r => { console.log(r); });
