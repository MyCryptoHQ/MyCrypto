const enLang = require('../src/translations/lang/en.json');

const getTransValueByKey = (translateKey) => enLang.data[translateKey];

export {
  getTransValueByKey
};
