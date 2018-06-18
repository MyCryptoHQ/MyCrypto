import {
  changeLanguage,
  setOnline,
  setOffline,
  toggleAutoGasLimit,
  setLatestBlock
} from './actions';
import { metaReducer } from './reducer';

describe('meta reducer', () => {
  const expectedInitialState = {
    languageSelection: 'en',
    offline: false,
    autoGasLimit: true,
    latestBlock: '???'
  };

  const expectedState = {
    initialState: expectedInitialState,
    changingLanguage: {
      ...expectedInitialState,
      languageSelection: 'langaugeToChange'
    },
    togglingToOffline: {
      ...expectedInitialState,
      offline: true
    },
    togglingToOnline: {
      ...expectedInitialState,
      offline: false
    },
    togglingToManualGasLimit: {
      ...expectedInitialState,
      autoGasLimit: false
    },
    togglingToAutoGasLimit: {
      ...expectedInitialState,
      autoGasLimit: true
    },
    settingLatestBlock: {
      ...expectedInitialState,
      latestBlock: '12345'
    }
  };

  const actions = {
    changeLangauge: changeLanguage('langaugeToChange'),
    setOnline: setOnline(),
    setOffline: setOffline(),
    toggleAutoGasLimit: toggleAutoGasLimit(),
    setLatestBlock: setLatestBlock('12345')
  };
  it('should return the inital state', () =>
    expect(metaReducer(undefined, {} as any)).toEqual(expectedState.initialState));

  it('should handle toggling to offline', () =>
    expect(metaReducer(expectedState.initialState, actions.setOffline)).toEqual(
      expectedState.togglingToOffline
    ));

  it('should handle toggling back to online', () =>
    expect(metaReducer(expectedState.togglingToOffline, actions.setOnline)).toEqual(
      expectedState.togglingToOnline
    ));

  it('should handle toggling to manual gas limit', () =>
    expect(metaReducer(expectedState.initialState, actions.toggleAutoGasLimit)).toEqual(
      expectedState.togglingToManualGasLimit
    ));

  it('should handle toggling back to auto gas limit', () =>
    expect(metaReducer(expectedState.togglingToManualGasLimit, actions.toggleAutoGasLimit)).toEqual(
      expectedState.togglingToAutoGasLimit
    ));

  it('should handle setting the latest block', () =>
    expect(metaReducer(expectedState.initialState, actions.setLatestBlock)).toEqual(
      expectedState.settingLatestBlock
    ));
});
