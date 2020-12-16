import React, { Component } from 'react';

import { AnyAction, bindActionCreators, Dispatch } from '@reduxjs/toolkit';
import { AppState, clearEncryptedData, decrypt, encrypt, exportState, importState } from '@store';
import { getEncryptedData, isEncrypted } from '@store/vault.slice';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { ROUTE_PATHS } from '@config';
import { DataContext, IDataContext } from '@services/Store';
import { translateRaw } from '@translations';
import { hashPassword, withContext } from '@utils';
import { pipe } from '@vendor';

import { default as ScreenLockLocking } from './ScreenLockLocking';

interface State {
  locking: boolean;
  locked: boolean;
  decryptError?: Error;
  toImport?: string;
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
class ScreenLockProvider extends Component<RouteComponentProps & IDataContext & Props, State> {
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
      this.props.encrypt(this.props.password);
      this.lockScreen();
      this.setState({ shouldAutoLock: false });
    }

    // After decrypt with valid password, reset db and
    if (!this.props.isEncrypted && this.state.locked) {
      this.redirectOut();
    }
  }

  public decryptWithPassword = (password: string): void => {
    const { isEncrypted } = this.props;
    if (!isEncrypted) return;
    try {
      const passwordHash = hashPassword(password);
      // Decrypt the data and store it to the MyCryptoCache
      this.props.decrypt(passwordHash);
    } catch (error) {
      console.error(error);
      this.setState({ decryptError: error });
    }
  };

  // Wipes encrypted data and unlocks
  public resetEncrypted = async () => {
    const { clearEncryptedData } = this.props;
    clearEncryptedData();
    this.redirectOut();
  };

  public redirectOut = () => {
    this.setState({ locked: false }, () => {
      this.resetInactivityTimer();
      this.props.history.replace(ROUTE_PATHS.DASHBOARD.path);
    });
  };

  // Wipes both DBs in case of forgotten pw
  public resetAll = async () => {
    const { resetAppDb } = this.props;
    resetAppDb();
    this.resetEncrypted();
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
  };

  public handleCountdownEnded = () => {
    /*Check if user has already set up the password. In that case encrypt the cache and navigate to "/screen-lock/locked".
      If user has not setup the password yet, just navigate to "/screen-lock/new. */
    const { password } = this.props;

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

const mapStateToProps = (state: AppState) => ({
  exportState: exportState(state),
  isEncrypted: isEncrypted(state),
  getEncryptedData: getEncryptedData(state)
});
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ importState, clearEncryptedData, encrypt, decrypt }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

export default pipe(withRouter, withContext(DataContext), connector)(ScreenLockProvider);
