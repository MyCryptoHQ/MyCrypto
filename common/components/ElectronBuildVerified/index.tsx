import React, { Component } from 'react';
import { VERSION } from 'config';

import './Banner.scss';

interface BannerState {
  displayBanner: boolean;
}

interface BannerProps {
  versionNow: string;
}

interface State {
  displayBanner: boolean;
}

const STORAGE_NAME = 'ElectronBuildVerified';

export default class ElectronBuildVerified extends Component<BannerProps, BannerState> {
  public state: State = {
    displayBanner: this.isBannerPrompted()
  };

  constructor(props: BannerProps) {
    super(props);
  }

  public render() {
    const { displayBanner } = this.state;
    if (displayBanner) {
      return (
        <div className="BannerContainer">
          <div style={{ display: 'flex', padding: '0em 0.5em 0em 0em' }}>
            <input type="checkbox" onChange={e => this.handleCheck(e)} />{' '}
          </div>
          <span>
            I have{' '}
            <a href="https://support.mycrypto.com/staying-safe/verifying-authenticity-of-desktop-app">
              verified that this build ({VERSION})
            </a>{' '}
            is signed by MyCrypto and I understand the risks of not verifying the build.
          </span>
        </div>
      );
    }

    return null;
  }

  public componentWillMount() {
    this.setState({ displayBanner: this.isBannerPrompted() });
  }

  private isBannerPrompted() {
    let storageVerified;
    if (localStorage.getItem(STORAGE_NAME) !== null) {
      try {
        storageVerified = localStorage.getItem(STORAGE_NAME);
        const objStorage = JSON.parse(storageVerified!);
        if (objStorage.versionChecked === this.props.versionNow) {
          return false;
        }
      } catch {
        //
      }
    }

    return true;
  }

  private handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      this.setState({ displayBanner: false });
      localStorage.setItem(
        STORAGE_NAME,
        JSON.stringify({
          versionChecked: this.props.versionNow,
          ack: true,
          ts: Math.floor(Date.now() / 1000)
        })
      );
    }
  };
}
