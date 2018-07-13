import * as configMetaActions from './actions';
import * as configMetaReducer from './reducer';
import { Theme } from 'config';

describe('meta reducer', () => {
  const expectedInitialState = {
    languageSelection: 'en',
    offline: false,
    autoGasLimit: true,
    latestBlock: '???',
    theme: Theme.LIGHT
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
    changeLangauge: configMetaActions.changeLanguage('langaugeToChange'),
    setOnline: configMetaActions.setOnline(),
    setOffline: configMetaActions.setOffline(),
    toggleAutoGasLimit: configMetaActions.toggleAutoGasLimit(),
    setLatestBlock: configMetaActions.setLatestBlock('12345')
  };
  it('should return the inital state', () =>
    expect(configMetaReducer.metaReducer(undefined, {} as any)).toEqual(
      expectedState.initialState
    ));

  it('should handle toggling to offline', () =>
    expect(configMetaReducer.metaReducer(expectedState.initialState, actions.setOffline)).toEqual(
      expectedState.togglingToOffline
    ));

  it('should handle toggling back to online', () =>
    expect(
      configMetaReducer.metaReducer(expectedState.togglingToOffline, actions.setOnline)
    ).toEqual(expectedState.togglingToOnline));

  it('should handle toggling to manual gas limit', () =>
    expect(
      configMetaReducer.metaReducer(expectedState.initialState, actions.toggleAutoGasLimit)
    ).toEqual(expectedState.togglingToManualGasLimit));

  it('should handle toggling back to auto gas limit', () =>
    expect(
      configMetaReducer.metaReducer(
        expectedState.togglingToManualGasLimit,
        actions.toggleAutoGasLimit
      )
    ).toEqual(expectedState.togglingToAutoGasLimit));

  it('should handle setting the latest block', () =>
    expect(
      configMetaReducer.metaReducer(expectedState.initialState, actions.setLatestBlock)
    ).toEqual(expectedState.settingLatestBlock));
});
