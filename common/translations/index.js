// @flow

let activeLanguage = 'en';
let fallbackLanguage = 'en';
let repository = {};

const languages = [
    require('./de'),
    require('./el'),
    require('./en'),
    require('./es'),
    require('./fi'),
    require('./fr'),
    require('./hu'),
    require('./id'),
    require('./it'),
    require('./ja'),
    require('./nl'),
    require('./no'),
    require('./pl'),
    require('./pt'),
    require('./ru') /*sk, sl, sv */,
    require('./tr'),
    require('./vi'),
    require('./zhcn'),
    require('./zhtw')
];

languages.forEach(l => {
    repository[l.code] = l.data;
});

export function setLanguage(code: string) {
    activeLanguage = code;
}

export default function translate(key: string) {
    return repository[activeLanguage][key] || repository[fallbackLanguage][key] || key;
}
