import React from 'react';
import { toChecksumAddressByChainId } from 'libs/checksum';
import NewTabLink from './NewTabLink';
import { IWallet } from 'libs/wallet';
import { BlockExplorerConfig, NetworkConfig } from 'types/network';
import { getNetworkConfig } from 'selectors/config';
import { AppState } from 'reducers';
import { connect } from 'react-redux';

interface BaseProps {
  explorer?: BlockExplorerConfig | null;
  address?: string | null;
  wallet?: IWallet | null;
}

interface StateProps {
  network: NetworkConfig;
}

type Props = BaseProps & StateProps;

// const isAddressProps = (props: Props): props is Props =>
//   typeof (props as AddressProps).address === 'string';

export class Address extends React.PureComponent<Props> {
  public render() {
    debugger;
    let addr = '';
    let chainId = 0;
    if (this.props.address != null) {
      addr = this.props.address;
      if (this.props.network) {
        chainId = this.props.network.chainId;
      }
    } else {
      addr = this.props.wallet != null ? this.props.wallet.getAddressString() : '';
    }
    addr = toChecksumAddressByChainId(addr, chainId);

    if (this.props.explorer) {
      return <NewTabLink href={this.props.explorer.addressUrl(addr)}>{addr}</NewTabLink>;
    } else {
      return <React.Fragment>{addr}</React.Fragment>;
    }
  }
}

//export default Address;
export default connect((state: AppState) => ({
  network: getNetworkConfig(state)
}))(Address);
