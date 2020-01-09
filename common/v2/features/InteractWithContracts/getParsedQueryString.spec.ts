import { getParsedQueryString } from './utils';

describe('it parses guery string', () => {
  it("checks if parsed object's values are the same as inputs", () => {
    const network = 'Ropsten';
    const address = '0xbb4AAaF8cAA1A575B43E7673e5b155C1c5A8BC13';
    const functionName = 'etherBalances';
    const queryString = `network=${network}&address=${address}&function=${functionName}`;
    const { networkIdFromUrl, addressFromUrl, functionFromUrl } = getParsedQueryString(queryString);
    expect(networkIdFromUrl).toEqual(network);
    expect(addressFromUrl).toEqual(address);
    expect(functionFromUrl).toEqual(functionName);
  });

  it('inputsFromUrl array should be empty if there are no input params', () => {
    const queryString = `network=&address=&function=`;
    const { inputsFromUrl } = getParsedQueryString(queryString);
    expect(inputsFromUrl).toEqual([]);
  });

  it('inputsFromUrl array values should be empty strings if inputs are non-parsable', () => {
    const queryString = `input=foobar`;
    const { inputsFromUrl } = getParsedQueryString(queryString);
    const [input] = inputsFromUrl;
    expect(input.name).toEqual('');
    expect(input.value).toEqual('');
  });

  it('input params should be parsed by first colon', () => {
    const name = 'foo';
    const value = 'foo:bar';
    const queryString = `input=${name}:${value}`;
    const { inputsFromUrl } = getParsedQueryString(queryString);
    const [input] = inputsFromUrl;
    expect(input.name).toEqual(name);
    expect(input.value).toEqual(value);
  });
});
