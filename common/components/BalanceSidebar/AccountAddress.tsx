import React from 'react';
import { toChecksumAddress } from 'ethereumjs-util';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import translate from 'translations';
import { Address, Identicon } from 'components/ui';

interface Props {
  address: string;
}

interface State {
  copied: boolean;
}

export default class AccountAddress extends React.Component<Props> {
  public state: State = {
    copied: false
  };

  private goingToClearCopied: number | null = null;

  public handleCopy = () =>
    this.setState(
      (prevState: State) => ({
        copied: !prevState.copied
      }),
      this.clearCopied
    );

  public componentWillUnmount() {
    if (this.goingToClearCopied) {
      window.clearTimeout(this.goingToClearCopied);
    }
  }

  public render() {
    const { address } = this.props;
    const { copied } = this.state;

    return (
      <div className="AccountInfo">
        <h5 className="AccountInfo-section-header">{translate('SIDEBAR_ACCOUNTADDR')}</h5>
        <div className="AccountInfo-section AccountInfo-address-section">
          <div className="AccountInfo-address-icon">
            <Identicon address={address} size="100%" />
          </div>
          <div className="AccountInfo-address-wrapper">
            <div className="AccountInfo-address-addr">
              <Address address={address} />
            </div>
            <CopyToClipboard onCopy={this.handleCopy} text={toChecksumAddress(address)}>
              <div
                className={`AccountInfo-copy ${copied ? 'is-copied' : ''}`}
                title="Copy To clipboard"
              >
                <i className="fa fa-copy" />
                <span>{copied ? 'copied!' : 'copy address'}</span>
              </div>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    );
  }

  private clearCopied = () =>
    (this.goingToClearCopied = window.setTimeout(() => this.setState({ copied: false }), 2000));
}
