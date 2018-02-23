import React from 'react';
import { toChecksumAddress } from 'ethereumjs-util';
import NewTabLink from './NewTabLink';
import { IWallet } from 'libs/wallet';
import { BlockExplorerConfig } from 'types/network';

interface Props {
  explorer?: BlockExplorerConfig | null;
  address?: string;
  wallet?: IWallet;
}

const Address: React.SFC<Props> = ({ address, wallet, explorer }) => {
  let addr = '';
  if (wallet) {
    addr = wallet.getAddressString();
  } else if (address) {
    addr = address;
  }
  addr = toChecksumAddress(addr);

  if (explorer) {
    return <NewTabLink href={explorer.addressUrl(addr)}>{addr}</NewTabLink>;
  } else {
    return <React.Fragment>{addr}</React.Fragment>;
  }
};

export default Address;
