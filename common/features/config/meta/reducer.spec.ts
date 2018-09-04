import * as actions from './actions';
import * as reducer from './reducer';
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

  const actionsToDispatch = {
    changeLangauge: actions.changeLanguage('langaugeToChange'),
    setOnline: actions.setOnline(),
    setOffline: actions.setOffline(),
    toggleAutoGasLimit: actions.toggleAutoGasLimit(),
    setLatestBlock: actions.setLatestBlock('12345')
  };
  it('should return the inital state', () =>
    expect(reducer.metaReducer(undefined, {} as any)).toEqual(expectedState.initialState));

  it('should handle toggling to offline', () =>
    expect(reducer.metaReducer(expectedState.initialState, actionsToDispatch.setOffline)).toEqual(
      expectedState.togglingToOffline
    ));

  it('should handle toggling back to online', () =>
    expect(
      reducer.metaReducer(expectedState.togglingToOffline, actionsToDispatch.setOnline)
    ).toEqual(expectedState.togglingToOnline));

  it('should handle toggling to manual gas limit', () =>
    expect(
      reducer.metaReducer(expectedState.initialState, actionsToDispatch.toggleAutoGasLimit)
    ).toEqual(expectedState.togglingToManualGasLimit));

  it('should handle toggling back to auto gas limit', () =>
    expect(
      reducer.metaReducer(
        expectedState.togglingToManualGasLimit,
        actionsToDispatch.toggleAutoGasLimit
      )
    ).toEqual(expectedState.togglingToAutoGasLimit));

  it('should handle setting the latest block', () =>
    expect(
      reducer.metaReducer(expectedState.initialState, actionsToDispatch.setLatestBlock)
    ).toEqual(expectedState.settingLatestBlock));
});
