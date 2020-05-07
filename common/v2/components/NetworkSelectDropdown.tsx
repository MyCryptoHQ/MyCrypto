import React, { useContext, useEffect } from 'react';

import { OptionComponentProps } from 'react-select';
import styled from 'styled-components';
import translate from 'v2/translations';
import { NetworkContext, isWalletFormatSupportedOnNetwork } from 'v2/services/Store';
import { NetworkId, WalletId } from 'v2/types';
import { DEFAULT_NETWORK } from 'v2/config';
import { Typography, Dropdown, Tooltip } from 'v2/components';

interface Props {
  network: NetworkId;
  accountType?: WalletId;
  className?: string;
  showTooltip?: boolean;
  disabled?: boolean;
  onChange(network: NetworkId): void;
}

const SContainer = styled('div')`
  display: flex;
  flex-direction: row;
  padding: 12px;
`;

const NetworkOption = ({ option, onSelect }: OptionComponentProps) => (
  <SContainer onClick={() => onSelect && onSelect(option, null)}>
    <Typography value={option.label} />
  </SContainer>
);

function NetworkSelectDropdown({
  network: networkId,
  accountType,
  onChange,
  showTooltip = false,
  disabled = false,
  ...props
}: Props) {
  const { networks, getNetworkById } = useContext(NetworkContext);

  // set default network if none selected
  useEffect(() => {
    if (!networkId) {
      onChange(DEFAULT_NETWORK);
    }
  }, []);

  // @ADD_ACCOUNT_TODO: The difference in accountType is likely causing
  // the absence of list.
  const validNetworks = networks
    // @ts-ignore CHANGE IN WALLETYPE OBJECT CAUSING accountType to error -> TODO: FIX accountType
    .filter((options) => isWalletFormatSupportedOnNetwork(options, accountType))
    .map((n) => ({ label: n.name, value: n }));
  const network = getNetworkById(networkId);

  return (
    <div {...props}>
      <label>
        {translate('SELECT_NETWORK_LABEL')}{' '}
        {showTooltip && <Tooltip tooltip={translate('NETWORK_TOOLTIP')} />}
      </label>
      <Dropdown
        value={{ label: network.name }}
        options={validNetworks.sort()}
        placeholder={DEFAULT_NETWORK}
        searchable={true}
        onChange={(option) => onChange(option.value.id)}
        optionComponent={NetworkOption}
        valueComponent={({ value: option }) => <NetworkOption option={option} />}
        disabled={disabled}
      />
    </div>
  );
}

export default NetworkSelectDropdown;
