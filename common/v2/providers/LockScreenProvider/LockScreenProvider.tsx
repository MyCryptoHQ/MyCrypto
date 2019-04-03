import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { ScreenLockLocking } from 'v2/features/ScreenLock';

interface State {
  locking: boolean;
  locked: boolean;
  timeLeft: number;
  password: string;
  createPassword(password: string): void;
}

export const LockScreenContext = React.createContext({} as State);

let inactivityTimer: any = null;
let countDownTimer: any = null;
const countDownDuration: number = 59;

type Props = RouteComponentProps<{}>;

export class LockScreenProvider extends Component<Props, State> {
  public state: State = {
    locking: false,
    locked: false,
    timeLeft: countDownDuration,
    password: '',
    createPassword: (password: string) => this.createPassword(password)
  };

  public createPassword = (password: string) => {
    // TODO: Encrypt data with password
    console.log('Encrypt with ', password);
  };

  public componentDidMount() {
    //TODO: Determine if screen is locked and set this.state.locked accordingly
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
    inactivityTimer = setTimeout(this.startLockCountdown, 300000);
  };

  public startLockCountdown = () => {
    // TODO: If current path is an exception do not start the lock count down
    if (
      window.location.pathname === '/screen-lock/new' ||
      window.location.pathname === '/screen-lock/locked'
    ) {
      return;
    }

    if (this.state.locked || this.state.locking) {
      return;
    }

    this.setState({ locking: true, timeLeft: countDownDuration });
    const appContext = this;
    countDownTimer = setInterval(() => {
      if (appContext.state.timeLeft === 1) {
        appContext.lockScreen();
      } else {
        document.title = `Locking Screen in ${appContext.state.timeLeft - 1}`;
        appContext.setState({ timeLeft: appContext.state.timeLeft - 1 });
      }
    }, 1000);
  };

  public cancelLockCountdown = () => {
    clearInterval(countDownTimer);
    this.resetInactivityTimer();
    this.setState({ locking: false });
    document.title = 'MyCrypto';
  };

  public lockScreen = () => {
    /*  TODO: Check if user has already set up the password, navigate to correct route (/screen-lock/locked or /screen-lock/new)
     Set document title to "MyCrypto (Locked) only if password is actually set, otherwise just navigate to create password */
    clearInterval(countDownTimer);
    this.setState({ locking: false, locked: false });
    document.title = 'MyCrypto (Locked)';
    this.props.history.push('/screen-lock/new');
  };

  public render() {
    const { children } = this.props;
    const { locking } = this.state;

    return (
      <LockScreenContext.Provider value={this.state}>
        {locking && (
          <ScreenLockLocking
            lockScreen={() => this.lockScreen()}
            cancelLockCountdown={() => this.cancelLockCountdown()}
            timeLeft={this.state.timeLeft}
          />
        )}
        {children}
      </LockScreenContext.Provider>
    );
  }
}
export default withRouter(LockScreenProvider);
