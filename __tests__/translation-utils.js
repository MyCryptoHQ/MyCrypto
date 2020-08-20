const enLang = require('../src/translations/lang/en.json');

const getTransValueByKey = (translateKey) => enLang.data[translateKey];
const findByTKey = (k) => new RegExp(getTransValueByKey(k, 'i'));

export { getTransValueByKey, findByTKey };
