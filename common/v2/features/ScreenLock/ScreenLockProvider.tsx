import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import CryptoJS, { SHA256, AES } from 'crypto-js';
import * as R from 'ramda';
import { isEmpty } from 'lodash';

import { translateRaw } from 'v2/translations';
import { ROUTE_PATHS } from 'v2/config';
import { withContext } from 'v2/utils';
import { DataContext, IDataContext, SettingsContext, ISettingsContext } from 'v2/services/Store';
import { default as ScreenLockLocking } from './ScreenLockLocking';

interface State {
  locking: boolean;
  locked: boolean;
  shouldAutoLock: boolean;
  lockingOnDemand: boolean;
  timeLeft: number;
  encryptWithPassword(password: string, hashed: boolean): void;
  decryptWithPassword(password: string): void;
  startLockCountdown(lockOnDemand?: boolean): void;
}

export const ScreenLockContext = React.createContext({} as State);

let inactivityTimer: any = null;
let countDownTimer: any = null;
const defaultCountDownDuration: number = 59;
const onDemandLockCountDownDuration: number = 5;

// Would be better to have in services/Store but circular dependencies breaks
// Jest test. Consider adopting such as importing from a 'internal.js'
// https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de
class ScreenLockProvider extends Component<
  RouteComponentProps<{}> & IDataContext & ISettingsContext,
  State
> {
  public state: State = {
    locking: false,
    locked: false,
    shouldAutoLock: false,
    lockingOnDemand: false,
    timeLeft: defaultCountDownDuration,
    encryptWithPassword: (password: string, hashed: boolean) =>
      this.setPasswordAndInitiateEncryption(password, hashed),
    decryptWithPassword: (password: string) => this.decryptWithPassword(password),
    startLockCountdown: (lockingOnDemand: boolean) => this.startLockCountdown(lockingOnDemand)
  };

  // causes prop changes that are being observed in componentDidUpdate
  public setPasswordAndInitiateEncryption = async (password: string, hashed: boolean) => {
    const { setUnlockPassword } = this.props;
    try {
      let passwordHash;

      // If password is not hashed yet, hash it
      if (!hashed) {
        passwordHash = SHA256(password).toString();
        setUnlockPassword(passwordHash);
      } else {
        // If password is already set initate encryption in componentDidUpdate
        this.setState({ shouldAutoLock: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  public async componentDidUpdate(prevProps: IDataContext) {
    // locks screen after calling setPasswordAndInitiateEncryption which causes one of these cases:
    //  - password was just set (props.password goes from undefined to defined) and enrypted local storage data does not exist
    //  - password was already set and auto lock should happen (shouldAutoLock) and enrypted local storage data does not exist
    if (
      (this.state.shouldAutoLock || !prevProps.password) &&
      this.props.password &&
      isEmpty(this.props.encryptedDbState)
    ) {
      const encryptedData = await AES.encrypt(
        this.props.exportStorage(),
        this.props.password
      ).toString();
      this.props.setEncryptedCache(encryptedData);
      this.props.resetAppDb();
      this.lockScreen();
      this.setState({ shouldAutoLock: false });
    }
  }

  public decryptWithPassword = async (password: string): Promise<boolean> => {
    const { destroyEncryptedCache, encryptedDbState, importStorage } = this.props;
    try {
      const passwordHash = SHA256(password).toString();
      // Decrypt the data and store it to the MyCryptoCache
      const decryptedData = await AES.decrypt(
        encryptedDbState.data as string,
        passwordHash
      ).toString(CryptoJS.enc.Utf8);
      importStorage(decryptedData);

      destroyEncryptedCache();

      // Navigate to the dashboard and reset inactivity timer
      this.setState({ locked: false });
      this.props.history.replace(ROUTE_PATHS.DASHBOARD.path);
      this.resetInactivityTimer();
      document.title = translateRaw('SCREEN_LOCK_TAB_TITLE');
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  public componentDidMount() {
    //Determine if screen is locked and set "locked" state accordingly
    const { encryptedDbState } = this.props;

    if (encryptedDbState) {
      this.lockScreen();
    }
    this.trackInactivity();
  }

  public trackInactivity = () => {
    window.onload = this.resetInactivityTimer;
    window.onmousemove = this.resetInactivityTimer;
    window.onkeypress = this.resetInactivityTimer;
    window.onmousedown = this.resetInactivityTimer;
    window.ontouchstart = this.resetInactivityTimer;
  };

  public resetInactivityTimer = () => {
    const { settings } = this.props;
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(this.startLockCountdown, settings.inactivityTimer);
  };

  public startLockCountdown = (lockingOnDemand = false) => {
    const appContext = this;

    // Lock immediately if password is already set after clicking "Lock" button
    if (lockingOnDemand && this.props.getUnlockPassword()) {
      appContext.handleCountdownEnded();
      return;
    }
    //Start the lock screen countdown only if user is on one of the dashboard pages
    if (!this.props.location.pathname.includes(ROUTE_PATHS.DASHBOARD.path)) {
      return;
    }
    if (this.state.locked || this.state.locking) {
      return;
    }

    this.setState({
      locking: true,
      timeLeft: lockingOnDemand ? onDemandLockCountDownDuration : defaultCountDownDuration,
      lockingOnDemand
    });

    countDownTimer = setInterval(() => {
      if (appContext.state.timeLeft === 1) {
        appContext.handleCountdownEnded();
      } else {
        document.title = `${translateRaw('SCREEN_LOCK_TAB_TITLE_LOCKING')} ${appContext.state
          .timeLeft - 1}`;
        appContext.setState({ timeLeft: appContext.state.timeLeft - 1 });
      }
    }, 1000);
  };

  public cancelLockCountdown = () => {
    clearInterval(countDownTimer);
    this.resetInactivityTimer();
    this.setState({ locking: false });
    document.title = translateRaw('SCREEN_LOCK_TAB_TITLE');
  };

  public handleCountdownEnded = () => {
    /*Check if user has already set up the password. In that case encrypt the cache and navigate to "/screen-lock/locked".
      If user has not setup the password yet, just navigate to "/screen-lock/new. */
    const { getUnlockPassword } = this.props;
    const password = getUnlockPassword();
    clearInterval(countDownTimer);
    if (password) {
      this.setState({ locking: false, locked: true });
      this.setPasswordAndInitiateEncryption(password, true);
    } else {
      this.setState({ locking: false, locked: false });
      document.title = translateRaw('SCREEN_LOCK_TAB_TITLE');
      this.props.history.push(ROUTE_PATHS.SCREEN_LOCK_NEW.path);
    }
  };

  public lockScreen = () => {
    /* Navigate to /screen-lock/locked everytime the user tries to navigate to one of the dashboard pages or to the set new password page*/
    this.setState({ locking: false, locked: true });
    document.title = translateRaw('SCREEN_LOCK_TAB_TITLE_LOCKED');

    if (
      this.props.location.pathname.includes(ROUTE_PATHS.DASHBOARD.path) ||
      this.props.location.pathname.includes(ROUTE_PATHS.SCREEN_LOCK_NEW.path) ||
      this.props.location.pathname.includes(ROUTE_PATHS.NO_ACCOUNTS.path) ||
      this.props.location.pathname === ROUTE_PATHS.ROOT.path
    ) {
      this.props.history.push(ROUTE_PATHS.SCREEN_LOCK_LOCKED.path);
    }

    this.props.history.listen(location => {
      if (this.state.locked === true && location.pathname.includes(ROUTE_PATHS.DASHBOARD.path)) {
        this.props.history.push(ROUTE_PATHS.SCREEN_LOCK_LOCKED.path);
      }
    });
  };

  public render() {
    const { children } = this.props;
    const { locking, timeLeft, lockingOnDemand } = this.state;

    return (
      <ScreenLockContext.Provider value={this.state}>
        {locking ? (
          <ScreenLockLocking
            onScreenLockClicked={() => this.handleCountdownEnded()}
            onCancelLockCountdown={() => this.cancelLockCountdown()}
            lockingOnDemand={lockingOnDemand}
            timeLeft={timeLeft}
          />
        ) : (
          children
        )}
      </ScreenLockContext.Provider>
    );
  }
}

export default R.pipe(
  withRouter,
  withContext(DataContext),
  withContext(SettingsContext)
)(ScreenLockProvider);
