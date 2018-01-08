import TranslateService from "./translate-service";

import { apiKey } from "./settings/api-key";
import { supportedLangs } from "./settings/supported-langs";

export const translator = new TranslateService(apiKey, supportedLangs);