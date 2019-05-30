import React, { useContext } from 'react';
import { ComboBox } from '@mycrypto/ui';

import { translate } from 'translations';
import { NetworkOptionsContext } from 'v2/providers';
import { isWalletFormatSupportedOnNetwork } from 'v2/libs';
import { WalletName } from 'v2/config/data';

interface Props {
  network: string;
  accountType: WalletName;
  onChange(network: string): void;
}

function NetworkSelectDropdown({ network, accountType, onChange }: Props) {
  const { networkOptions } = useContext(NetworkOptionsContext);

  // @ADD_ACCOUNT_TODO: The difference in accountType is likely causing
  // the absence of list.
  const validNetworks = networkOptions
    .filter(options => isWalletFormatSupportedOnNetwork(options, accountType))
    .map(n => n.name);

  return (
    <div>
      <label>{translate('SELECT_NETWORK_LABEL')}</label>
      <ComboBox
        value={network}
        items={new Set(validNetworks.sort())}
        placeholder="Ethereum"
        onChange={({ target: { value } }) => onChange(value)}
      />
    </div>
  );
}

export default NetworkSelectDropdown;
