import React, { Component } from 'react';

import { RouteComponentProps, withRouter } from 'react-router-dom';

import { ROUTE_PATHS } from '@config';
import { IDataContext, useSettings } from '@services/Store';
import { useAppStore } from '@store';
import { translateRaw } from '@translations';
import { decrypt, encrypt, hashPassword, withHook } from '@utils';
import { pipe } from '@vendor';

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
  RouteComponentProps &
    IDataContext &
    ReturnType<typeof useSettings> &
    ReturnType<typeof useAppStore>,
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
      !(this.props.vault && this.props.vault.data)
    ) {
      const persistedState = await this.props.exportState().then(JSON.stringify);
      const encryptedData = encrypt(persistedState, this.props.password).toString();
      this.props.setVault(encryptedData);
      this.props.resetAppDb();
      this.lockScreen();
      this.setState({ shouldAutoLock: false });
    }
  }

  public decryptWithPassword = async (password: string): Promise<boolean> => {
    const { destroyVault, vault } = this.props;
    if (!vault || !vault.data) return false;

    try {
      const passwordHash = hashPassword(password);
      // Decrypt the data and store it to the MyCryptoCache
      const decryptedData = decrypt(vault.data as string, passwordHash);
      // @todo: Redux restore decrypt faculty
      // const importResult = importState(decryptedData);
      // if (!importResult) {
      //   return false;
      // }
      if (decryptedData) {
        destroyVault();
      }

      // Navigate to the dashboard and reset inactivity timer
      this.setState({ locked: false }, () => {
        this.props.history.replace(ROUTE_PATHS.DASHBOARD.path);
      });
      this.resetInactivityTimer();
      document.title = translateRaw('SCREEN_LOCK_TAB_TITLE');
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // Wipes encrypted data and unlocks
  public resetEncrypted = async () => {
    const { destroyVault } = this.props;
    destroyVault();
    this.setState({ locked: false }, () => {
      document.title = translateRaw('SCREEN_LOCK_TAB_TITLE');
    });
  };

  // Wipes both DBs in case of forgotten pw
  public resetAll = async () => {
    const { destroyVault, resetAppDb } = this.props;
    destroyVault();
    resetAppDb();
    this.setState({ locked: false }, () => {
      document.title = translateRaw('SCREEN_LOCK_TAB_TITLE');
      this.props.history.replace(ROUTE_PATHS.DASHBOARD.path);
    });
  };

  public componentDidMount() {
    //Determine if screen is locked and set "locked" state accordingly
    const { vault } = this.props;

    if (vault && vault.data) {
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
    if (lockingOnDemand && this.props.password) {
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
    document.title = translateRaw('SCREEN_LOCK_TAB_TITLE');
  };

  public handleCountdownEnded = () => {
    // Check if user has already set up the password.
    // If so encrypt the cache and navigate to "/screen-lock/locked".
    // Otherwise navigate to "/screen-lock/new.
    const password = this.props.password;
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

export default pipe(withRouter, withHook(useSettings), withHook(useAppStore))(ScreenLockProvider);
