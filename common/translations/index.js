// @flow
import { markupToReact } from './markup';
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
    require('./ko'),
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
    return markupToReact(
        repository[activeLanguage][key] || repository[fallbackLanguage][key] || key
    );
}

export function getTranslators() {
    return [
        'TranslatorName_1',
        'TranslatorName_2',
        'TranslatorName_3',
        'TranslatorName_4',
        'TranslatorName_5'
    ].filter(x => {
        const translated = translate(x);
        if (typeof translated === 'string') {
            return !!translated.trim();
        }
        return !!translated;
    });
}
