import { config, INITIAL_STATE } from 'reducers/config';
import * as configActions from 'actions/config';
import { NODES } from 'config/data';

describe('config reducer', () => {
  it('should return the initial state', () => {
    expect(config(undefined, {})).toEqual(INITIAL_STATE);
  });

  it('should handle CONFIG_LANGUAGE_CHANGE', () => {
    const language = 'en';
    expect(config(undefined, configActions.changeLanguage(language))).toEqual({
      ...INITIAL_STATE,
      languageSelection: language
    });
  });

  it('should handle CONFIG_NODE_CHANGE', () => {
    const node = NODES[0];

    expect(config(undefined, configActions.changeNode(node))).toEqual({
      ...INITIAL_STATE,
      nodeSelection: node
    });
  });

  it('should handle CONFIG_GAS_PRICE', () => {
    const gasPrice = 20;

    expect(config(undefined, configActions.changeGasPrice(gasPrice))).toEqual({
      ...INITIAL_STATE,
      gasPriceGwei: gasPrice
    });
  });
});
