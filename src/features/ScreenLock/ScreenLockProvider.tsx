import React, { Component } from 'react';

import pipe from 'ramda/src/pipe';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { ROUTE_PATHS } from '@config';
import { DataContext, IDataContext, ISettingsContext, useSettings } from '@services/Store';
import { translateRaw } from '@translations';
import { decrypt, encrypt, hashPassword, withContext, withHook } from '@utils';

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
  resetEncrypted(): void;
  resetAll(): void;
}

export const ScreenLockContext = React.createContext({} as State);

let inactivityTimer: any = null;
let countDownTimer: any = null;
const defaultCountDownDuration = 59;
const onDemandLockCountDownDuration = 5;

// Would be better to have in services/Store but circular dependencies breaks
// Jest test. Consider adopting such as importing from a 'internal.js'
// https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de
class ScreenLockProvider extends Component<
  RouteComponentProps & IDataContext & ISettingsContext,
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
    startLockCountdown: (lockingOnDemand: boolean) => this.startLockCountdown(lockingOnDemand),
    resetEncrypted: () => this.resetEncrypted(),
    resetAll: () => this.resetAll()
  };

  // causes prop changes that are being observed in componentDidUpdate
  public setPasswordAndInitiateEncryption = async (password: string, hashed: boolean) => {
    const { setUnlockPassword } = this.props;
    try {
      // If password is not hashed yet, hash it
      if (!hashed) {
        const passwordHash = hashPassword(password);
        this.setState(
          (prevState) => ({ ...prevState, shouldAutoLock: true }),
          () => {
            // Initiates encryption in componentDidUpdate
            setUnlockPassword(passwordHash);
          }
        );
      } else {
        // If password is already set initate encryption in componentDidUpdate
        this.setState({ shouldAutoLock: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  public async componentDidUpdate() {
    // locks screen after calling setPasswordAndInitiateEncryption which causes one of these cases:
    //  - password was just set (props.password goes from undefined to defined) and encrypted local storage data does not exist
    //  - password was already set and auto lock should happen (shouldAutoLock) and encrypted local storage data does not exist
    if (
      this.state.shouldAutoLock &&
      this.props.password &&
      !(this.props.encryptedDbState && this.props.encryptedDbState.data)
    ) {
      const encryptedData = encrypt(this.props.exportStorage(), this.props.password).toString();
      this.props.setEncryptedCache(encryptedData);
      this.props.resetAppDb();
      this.lockScreen();
      this.setState({ shouldAutoLock: false });
    }
  }

  public decryptWithPassword = async (password: string): Promise<boolean> => {
    const { destroyEncryptedCache, encryptedDbState, importStorage } = this.props;
    try {
      if (!encryptedDbState) {
        return false;
      }
      const passwordHash = hashPassword(password);
      // Decrypt the data and store it to the MyCryptoCache
      const decryptedData = decrypt(encryptedDbState.data as string, passwordHash);
      const importResult = importStorage(decryptedData);
      if (!importResult) {
        return false;
      }

      destroyEncryptedCache();

      // Navigate to the dashboard and reset inactivity timer
      this.setState({ locked: false }, () => {
        this.props.history.replace(ROUTE_PATHS.DASHBOARD.path);
      });
      this.resetInactivityTimer();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // Wipes encrypted data and unlocks
  public resetEncrypted = async () => {
    const { destroyEncryptedCache } = this.props;
    destroyEncryptedCache();
    this.setState({ locked: false });
  };

  // Wipes both DBs in case of forgotten pw
  public resetAll = async () => {
    const { destroyEncryptedCache, resetAppDb } = this.props;
    destroyEncryptedCache();
    resetAppDb();
    this.setState({ locked: false }, () => {
      this.props.history.replace(ROUTE_PATHS.DASHBOARD.path);
    });
  };

  public componentDidMount() {
    //Determine if screen is locked and set "locked" state accordingly
    const { encryptedDbState } = this.props;

    if (encryptedDbState && encryptedDbState.data) {
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
    // @todo: Refactor to use .bind() probably
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const appContext = this;

    // Lock immediately if password is already set after clicking "Lock" button
    if (lockingOnDemand && this.props.getUnlockPassword()) {
      this.handleCountdownEnded();
      return;
    }
    if (
      this.state.locked ||
      this.state.locking ||
      this.props.location.pathname === ROUTE_PATHS.SCREEN_LOCK_NEW.path
    ) {
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
        document.title = `${translateRaw('SCREEN_LOCK_TAB_TITLE_LOCKING')} ${
          appContext.state.timeLeft - 1
        }`;
        appContext.setState({ timeLeft: appContext.state.timeLeft - 1 });
      }
    }, 1000);
  };

  public cancelLockCountdown = () => {
    clearInterval(countDownTimer);
    this.resetInactivityTimer();
    this.setState({ locking: false });
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
      document.title = translateRaw('DEFAULT_PAGE_TITLE');
      this.props.history.push(ROUTE_PATHS.SCREEN_LOCK_NEW.path);
    }
  };

  public lockScreen = () => {
    /* Navigate to /screen-lock/locked everytime the user tries to navigate to one of the dashboard pages or to the set new password page*/
    this.setState({ locking: false, locked: true });
    document.title = translateRaw('SCREEN_LOCK_TAB_TITLE_LOCKED');

    const isOutsideLock = (path: string) =>
      !path.includes('screen-lock') && path !== ROUTE_PATHS.SETTINGS_IMPORT.path;

    if (
      isOutsideLock(this.props.location.pathname) ||
      this.props.location.pathname.includes(ROUTE_PATHS.SCREEN_LOCK_NEW.path)
    ) {
      this.props.history.push(ROUTE_PATHS.SCREEN_LOCK_LOCKED.path);
    }

    this.props.history.listen((location) => {
      if (this.state.locked && isOutsideLock(location.pathname)) {
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

export default pipe(
  withRouter,
  withContext(DataContext),
  withHook(useSettings)
)(ScreenLockProvider);
