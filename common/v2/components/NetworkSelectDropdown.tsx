import React, { useContext, useEffect } from 'react';
import { ComboBox } from '@mycrypto/ui';

import { translate } from 'translations';
import { NetworkContext, isWalletFormatSupportedOnNetwork } from 'v2/services/Store';
import { WalletName } from 'v2/types';

interface Props {
  network: string;
  accountType: WalletName;
  onChange(network: string): void;
}

const DEFAULT_NETWORK = 'Ethereum';

function NetworkSelectDropdown({ network, accountType, onChange }: Props) {
  const { networks } = useContext(NetworkContext);

  // set default network if none selected
  useEffect(() => {
    if (!network) {
      onChange(DEFAULT_NETWORK);
    }
  }, []);

  // @ADD_ACCOUNT_TODO: The difference in accountType is likely causing
  // the absence of list.
  const validNetworks = networks
    // @ts-ignore CHANGE IN WALLETYPE OBJECT CAUSING accountType to error -> TODO: FIX accountType
    .filter(options => isWalletFormatSupportedOnNetwork(options, accountType))
    .map(n => n.name);

  return (
    <div>
      <label>{translate('SELECT_NETWORK_LABEL')}</label>
      <ComboBox
        value={network}
        items={new Set(validNetworks.sort())}
        placeholder={DEFAULT_NETWORK}
        onChange={({ target: { value } }) => onChange(value)}
      />
    </div>
  );
}

export default NetworkSelectDropdown;
