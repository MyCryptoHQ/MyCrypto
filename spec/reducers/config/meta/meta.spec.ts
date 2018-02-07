import { meta } from 'reducers/config/meta';
import { changeLanguage, toggleOffline, toggleAutoGasLimit, setLatestBlock } from 'actions/config';

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
  toggleOffline: toggleOffline(),
  toggleAutoGasLimit: toggleAutoGasLimit(),
  setLatestBlock: setLatestBlock('12345')
};

describe('meta reducer', () => {
  it('should return the inital state', () =>
    expect(meta(undefined, {} as any)).toEqual(expectedState.initialState));

  it('should handle toggling to offline', () =>
    expect(meta(expectedState.initialState, actions.toggleOffline)).toEqual(
      expectedState.togglingToOffline
    ));

  it('should handle toggling back to online', () =>
    expect(meta(expectedState.togglingToOffline, actions.toggleOffline)).toEqual(
      expectedState.togglingToOnline
    ));

  it('should handle toggling to manual gas limit', () =>
    expect(meta(expectedState.initialState, actions.toggleAutoGasLimit)).toEqual(
      expectedState.togglingToManualGasLimit
    ));

  it('should handle toggling back to auto gas limit', () =>
    expect(meta(expectedState.togglingToManualGasLimit, actions.toggleAutoGasLimit)).toEqual(
      expectedState.togglingToAutoGasLimit
    ));

  it('should handle setting the latest block', () =>
    expect(meta(expectedState.initialState, actions.setLatestBlock)).toEqual(
      expectedState.settingLatestBlock
    ));
});

export { actions as metaActions, expectedState as metaExpectedState };
