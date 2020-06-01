const enLang = require('../src/translations/lang/en.json');

export default class Translations {
  getLanguageValueByKey = (translateKey) => enLang.data[translateKey];
}
