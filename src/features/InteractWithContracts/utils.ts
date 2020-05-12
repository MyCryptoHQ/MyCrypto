import { parse } from 'query-string';

export const getParsedQueryString = (queryString: string) => {
  const {
    network: networkIdFromUrl,
    address: addressFromUrl,
    function: functionFromUrl,
    input
  } = parse(queryString);

  const inputsArray: string[] = !input ? [] : Array.isArray(input) ? input : [input];

  const inputsFromUrl = inputsArray.map((i) => ({
    name: i.includes(':') ? i.substr(0, i.indexOf(':')) : '',
    value: i.includes(':') ? i.substr(i.indexOf(':') + 1, i.length) : ''
  }));

  return {
    networkIdFromUrl,
    addressFromUrl,
    functionFromUrl,
    inputsFromUrl
  };
};
