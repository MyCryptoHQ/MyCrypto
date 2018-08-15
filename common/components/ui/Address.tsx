import React from 'react';
import { connect } from 'react-redux';

import { IWallet } from 'libs/wallet';
import { BlockExplorerConfig } from 'types/network';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { AppState } from 'features/reducers';
import { getChecksumAddressFn } from 'features/config';
import NewTabLink from './NewTabLink';
import './Address.scss';

interface BaseProps {
  address: string;
  explorer?: BlockExplorerConfig | null;
  wallet?: IWallet | null;
}

interface StateProps {
  toChecksumAddress: ReturnType<typeof getChecksumAddressFn>;
}

type Props = BaseProps & StateProps;

interface State {
  copied: boolean;
}

export class Address extends React.PureComponent<Props, State> {
  public state = {
    copied: false
  };
  public render() {
    const { wallet, address, toChecksumAddress } = this.props;
    let renderAddress = '';
    if (address !== null && address !== undefined) {
      renderAddress = address;
    } else {
      renderAddress = wallet !== null && wallet !== undefined ? wallet.getAddressString() : '';
    }
    renderAddress = toChecksumAddress(renderAddress);

    const setInterval = () => {
      this.setState({ copied: true });
      return window.setTimeout(() => this.setState({ copied: false }), 3000);
    };

    const onCopy = () => {
      window.clearInterval(setInterval());
      setInterval();
    };

    return (
      <div className="Truncated" data-last6={address.slice(-6)}>
        {this.props.explorer ? (
          <NewTabLink href={this.props.explorer.addressUrl(address)}>{address}</NewTabLink>
        ) : (
          <>
            <CopyToClipboard onCopy={onCopy} text={address}>
              <div className="Truncated-target" />
            </CopyToClipboard>
            <p>{address}</p>
            <i className={`${this.state.copied && 'visible'} fa fa-check`} />
            <i className={`${!this.state.copied && 'visible'} fa fa-copy`} />
          </>
        )}
      </div>
    );
  }
}

export default connect((state: AppState) => ({
  toChecksumAddress: getChecksumAddressFn(state)
}))(Address);
