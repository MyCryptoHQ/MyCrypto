import React, { Component } from 'react';

import { AnyAction, bindActionCreators, Dispatch } from '@reduxjs/toolkit';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { ROUTE_PATHS } from '@config';
import {
  appReset as appResetAction,
  AppState,
  clearEncryptedData,
  decrypt,
  getEncryptedData,
  isEncrypted,
  selectPassword
} from '@store';
import { translateRaw } from '@translations';
import { hashPassword } from '@utils';

interface State {
  locked: boolean;
  decryptError?: Error;
  toImport?: string;
  decryptWithPassword(password: string): void;
  resetEncrypted(): void;
  resetAll(): void;
}

export const ScreenLockContext = React.createContext({} as State);

// Would be better to have in services/Store but circular dependencies breaks
// Jest test. Consider adopting such as importing from a 'internal.js'
// https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de
class ScreenLockProvider extends Component<RouteComponentProps & Props, State> {
  public state: State = {
    locked: false,
    decryptWithPassword: (password: string) => this.decryptWithPassword(password),
    resetEncrypted: () => this.resetEncrypted(),
    resetAll: () => this.resetAll()
  };

  public componentDidMount() {
    //Determine if screen is locked and set "locked" state accordingly
    const { isEncrypted } = this.props;

    if (isEncrypted) {
      this.lockScreen();
    }
  }

  public componentDidUpdate() {
    const { isEncrypted } = this.props;
    if (!isEncrypted && this.state.locked) {
      // After decrypt with valid password, reset db and
      this.redirectOut();
    }
  }

  public decryptWithPassword = (password: string): void => {
    const { isEncrypted, decrypt } = this.props;
    if (!isEncrypted) return;
    try {
      const passwordHash = hashPassword(password);
      // Decrypt the data and store it to the MyCryptoCache
      decrypt(passwordHash);
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
    const { history } = this.props;
    this.setState({ locked: false }, () => {
      history.replace(ROUTE_PATHS.DASHBOARD.path);
    });
  };

  // Wipes both DBs in case of forgotten pw
  public resetAll = async () => {
    const { appReset } = this.props;
    appReset();
    this.resetEncrypted();
  };

  public lockScreen = () => {
    const { location, history } = this.props;
    /* Navigate to /screen-lock/locked everytime the user tries to navigate to one of the dashboard pages or to the set new password page*/
    this.setState({ locked: true });
    document.title = translateRaw('SCREEN_LOCK_TAB_TITLE_LOCKED');

    const isOutsideLock = (path: string) =>
      !path.includes('screen-lock') && path !== ROUTE_PATHS.SETTINGS_IMPORT.path;

    if (isOutsideLock(location.pathname)) {
      history.push(ROUTE_PATHS.SCREEN_LOCK_LOCKED.path);
    }

    history.listen((location) => {
      if (this.state.locked && isOutsideLock(location.pathname)) {
        history.push(ROUTE_PATHS.SCREEN_LOCK_LOCKED.path);
      }
    });
  };

  public render() {
    const { children } = this.props;
    return <ScreenLockContext.Provider value={this.state}>{children}</ScreenLockContext.Provider>;
  }
}

const mapStateToProps = (state: AppState) => ({
  isEncrypted: isEncrypted(state),
  getEncryptedData: getEncryptedData(state),
  password: selectPassword(state)
});
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      clearEncryptedData,
      decrypt,
      appReset: appResetAction
    },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

export default withRouter(connector(ScreenLockProvider));
