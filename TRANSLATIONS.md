## Translations

In order to use built in translation extractor you can run:
```
yarn translations:extract
```

The script will auto extract all translation keys wrapped inside `translate`, `translateRaw` and `translateMarker` functions.
It will merge new keys, without modifying old ones and sort them alphabetically.
It will update all *.json files inside `src/translations/lang/*.json`, meaning all languages will be updated with new keys.

### Add new translation key
To add new translation key, just wrap the key inside `translate`, `translateRaw` or `translateMarker` functions.
And run `yarn translations:extract`, to update the *.json files. Find the key in *.json file,
and insert the value(Do this at least for English language(`en.json`)).

#### Naming keys(IMPORTANT!):
##### Always name the key with uppercase letters(otherwise they will be ignored)
- Correct: `translateRaw('SUCCESS_MESSAGE')`
- Incorrect: `translateRaw('successMessage')`
##### Don't use only number key for translation keys(the will be ignored)
- Correct: `translateRaw('SUCCESS_0')` OR `translateRaw('0_SUCCESS')`
- Incorrect: `translateRaw('0')` OR `translateRaw('123456789')`
##### Don't use variables as translation keys
- Correct, use map function:
```typescript
const mapTranslationKey = (message: string) => {
    switch(message) {
        case 'success':
          return translateMarker('SUCCESS_MESSAGE');
        case 'error':
        default:
          return translateMarker('ERROR_MESSAGE');
    }
};

translateRaw(mapTranslationKey(message));
```
- Incorrect: `translateRaw(message)`, where message is a variable

### Merging translations
If all translation keys were added via this script, just remove all merging conflicts tag `<<<<<<<`,
`=======` and `>>>>>>>` so that the `.json` file is valid. And rerun `yarn translations:extract`.

### Adding new language

To add a new translation create a file `<language-name>.json` and use the following boilerplate:
```json
{
	"code": "<language-name>",
	"data": {

	}
}
```
