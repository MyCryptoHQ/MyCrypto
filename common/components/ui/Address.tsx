import React from 'react';
import { toChecksumAddressByChainId } from 'libs/checksum';
import NewTabLink from './NewTabLink';
import { IWallet } from 'libs/wallet';
import { BlockExplorerConfig, NetworkConfig } from 'types/network';

interface BaseProps {
  explorer?: BlockExplorerConfig | null;
}

interface AddressProps extends BaseProps {
  address: string;
  network?: NetworkConfig;
}

interface WalletProps extends BaseProps {
  wallet: IWallet;
}

type Props = AddressProps | WalletProps;

const isAddressProps = (props: Props): props is AddressProps =>
  typeof (props as AddressProps).address === 'string';

const Address: React.SFC<Props> = props => {
  let addr = '';
  let chainId = 0;
  if (isAddressProps(props)) {
    addr = props.address;
    if (props.network) {
      chainId = props.network.chainId;
    }
  } else {
    addr = props.wallet.getAddressString();
  }
  addr = toChecksumAddressByChainId(addr, chainId);

  if (props.explorer) {
    return <NewTabLink href={props.explorer.addressUrl(addr)}>{addr}</NewTabLink>;
  } else {
    return <React.Fragment>{addr}</React.Fragment>;
  }
};

export default Address;
