import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import CryptoJS, { SHA256, AES } from 'crypto-js';

import * as localCacheService from 'v2/services/LocalCache/LocalCache';
import * as screenLockService from 'v2/services/ScreenLockSettings/ScreenLockSettings';
import { translateRaw } from 'translations';
import { ScreenLockLocking } from 'v2/features/ScreenLock';

interface State {
  locking: boolean;
  locked: boolean;
  timeLeft: number;
  encryptWithPassword(password: string, hashed: boolean): void;
  decryptWithPassword(password: string): void;
}
export const LockScreenContext = React.createContext({} as State);

let inactivityTimer: any = null;
let countDownTimer: any = null;
const countDownDuration: number = 59;
const inactivityTime: number = 300000; // After this time (ms) the screen lock count down will start

export class LockScreenProvider extends Component<RouteComponentProps<{}>, State> {
  public state: State = {
    locking: false,
    locked: false,
    timeLeft: countDownDuration,
    encryptWithPassword: (password: string, hashed: boolean) =>
      this.encryptWithPassword(password, hashed),
    decryptWithPassword: (password: string) => this.decryptWithPassword(password)
  };

  public encryptWithPassword = async (password: string, hashed: boolean) => {
    try {
      let passwordHash;

      // If password is not hashed yet, hash it
      if (!hashed) {
        passwordHash = SHA256(password).toString();
      } else {
        passwordHash = password;
      }

      // Store the password into the local cache
      screenLockService.updateScreenLockSettings({ password: passwordHash });

      // Encrypt the local cache
      const encryptedData = await AES.encrypt(
        JSON.stringify(localCacheService.getCache()),
        passwordHash
      ).toString();
      localCacheService.setEncryptedCache(encryptedData);
      localCacheService.destroyCache();
      this.lockScreen();
    } catch (error) {
      console.error(error);
    }
  };

  public decryptWithPassword = async (password: string): Promise<boolean> => {
    try {
      const passwordHash = SHA256(password).toString();
      // Decrypt the data and store it to the MyCryptoCache
      const decryptedData = await AES.decrypt(
        localCacheService.getEncryptedCache(),
        passwordHash
      ).toString(CryptoJS.enc.Utf8);

      localCacheService.setCache(JSON.parse(decryptedData));
      localCacheService.destroyEncryptedCache();

      // Navigate to the dashboard and reset inactivity timer
      this.setState({ locked: false });
      this.props.history.replace('/dashboard');
      this.resetInactivityTimer();
      document.title = translateRaw('SCREEN_LOCK_TAB_TITLE');
      return true;
    } catch (error) {
      console.error('pp', error);
      return false;
    }
  };

  public componentDidMount() {
    //Determine if screen is locked and set "locked" state accordingly
    if (localCacheService.getEncryptedCache()) {
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
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(this.startLockCountdown, inactivityTime);
  };

  public startLockCountdown = () => {
    //Start the lock screen countdown only if user is on one of the dashboard pages
    if (!window.location.pathname.includes('/dashboard')) {
      return;
    }
    if (this.state.locked || this.state.locking) {
      return;
    }

    this.setState({ locking: true, timeLeft: countDownDuration });
    const appContext = this;

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
    const screenLockSettings = screenLockService.readScreenLockSettings();
    clearInterval(countDownTimer);

    if (screenLockSettings && screenLockSettings.password) {
      this.setState({ locking: false, locked: true });
      this.encryptWithPassword(screenLockSettings.password, true);
    } else {
      this.setState({ locking: false, locked: false });
      document.title = translateRaw('SCREEN_LOCK_TAB_TITLE');
      this.props.history.push('/screen-lock/new');
    }
  };

  public lockScreen = () => {
    /* Navigate to /screen-lock/locked everytime the user tries to navigate to one of the dashboard pages */
    this.setState({ locking: false, locked: true });
    document.title = translateRaw('SCREEN_LOCK_TAB_TITLE_LOCKED');
    this.props.history.push('/screen-lock/locked');

    this.props.history.listen(() => {
      if (this.state.locked === true && window.location.pathname.includes('/dashboard')) {
        this.props.history.replace('/screen-lock/locked');
      }
    });
  };

  public render() {
    const { children } = this.props;
    const { locking, timeLeft } = this.state;

    return (
      <LockScreenContext.Provider value={this.state}>
        {locking && (
          <ScreenLockLocking
            onScreenLockClicked={() => this.handleCountdownEnded()}
            onCancelLockCountdown={() => this.cancelLockCountdown()}
            timeLeft={timeLeft}
          />
        )}
        {children}
      </LockScreenContext.Provider>
    );
  }
}
export default withRouter(LockScreenProvider);
