import React from 'react';
import { toChecksumAddress } from 'ethereumjs-util';
import NewTabLink from './NewTabLink';
import { IWallet } from 'libs/wallet';
import { BlockExplorerConfig } from 'types/network';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './Address.scss';

interface BaseProps {
  explorer?: BlockExplorerConfig | null;
}

interface AddressProps extends BaseProps {
  address: string;
}

interface WalletProps extends BaseProps {
  wallet: IWallet;
}

type Props = AddressProps | WalletProps;

interface State {
  copied: boolean;
}

const isAddressProps = (props: Props): props is AddressProps =>
  typeof (props as AddressProps).address === 'string';

class Address extends React.Component<Props, State> {
  public state = {
    copied: false
  };

  public render() {
    let addr = '';
    if (isAddressProps(this.props)) {
      addr = this.props.address;
    } else {
      addr = this.props.wallet.getAddressString();
    }
    addr = toChecksumAddress(addr);

    const setInterval = () => {
      this.setState({ copied: true });
      return window.setTimeout(() => this.setState({ copied: false }), 3000);
    };

    const onCopy = () => {
      window.clearInterval(setInterval());
      setInterval();
    };

    return (
      <div className="Truncated" data-last6={addr.slice(-6)}>
        {this.props.explorer ? (
          <NewTabLink href={this.props.explorer.addressUrl(addr)}>{addr}</NewTabLink>
        ) : (
          <>
            <CopyToClipboard onCopy={onCopy} text={addr}>
              <div className="Truncated-target" />
            </CopyToClipboard>
            <p>{addr}</p>
            <i className={`${this.state.copied && 'visible'} fa fa-check`} />
            <i className={`${!this.state.copied && 'visible'} fa fa-copy`} />
          </>
        )}
      </div>
    );
  }
}

export default Address;
