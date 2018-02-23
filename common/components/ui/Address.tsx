import React from 'react';
import { toChecksumAddress } from 'ethereumjs-util';
import NewTabLink from './NewTabLink';
import { IWallet } from 'libs/wallet';
import { BlockExplorerConfig } from 'types/network';

// interface BaseProps {
//   explorer?: BlockExplorerConfig | null;
// }
//
// interface AddressProps extends BaseProps {
//   address: string;
//   wallet: undefined;
// };
//
// interface WalletProps extends BaseProps {
//   wallet: IWallet;
//   address: undefined;
// };
//
// type Props = AddressProps | WalletProps;

interface BaseProps {
  explorer?: BlockExplorerConfig | null;
  address?: string;
  wallet?: IWallet;
}

const Address: React.SFC<Props> = ({ address, wallet, explorer }) => {
  const addr = toChecksumAddress(wallet ? wallet.getAddressString() : (address as string));
  if (explorer) {
    return <NewTabLink href={explorer.addressUrl(addr)}>{addr}</NewTabLink>;
  } else {
    return <React.Fragment>{addr}</React.Fragment>;
  }
};

export default Address;
