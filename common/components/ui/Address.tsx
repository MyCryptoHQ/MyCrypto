import React from 'react';
import { toChecksumAddress } from 'ethereumjs-util';

import { BlockExplorerConfig } from 'types/network';
import { IWallet } from 'libs/wallet';
import NewTabLink from './NewTabLink';

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

const isAddressProps = (props: Props): props is AddressProps =>
  typeof (props as AddressProps).address === 'string';

const Address: React.SFC<Props> = props => {
  let addr = '';
  if (isAddressProps(props)) {
    addr = props.address;
  } else {
    addr = props.wallet.getAddressString();
  }
  addr = toChecksumAddress(addr);

  if (props.explorer) {
    return <NewTabLink href={props.explorer.addressUrl(addr)}>{addr}</NewTabLink>;
  } else {
    return <React.Fragment>{addr}</React.Fragment>;
  }
};

export default Address;
