import React, { useContext, useEffect } from 'react';

import { OptionProps } from 'react-select';
import styled from 'styled-components';
import translate from '@translations';
import { NetworkContext, isWalletFormatSupportedOnNetwork } from '@services/Store';
import { NetworkId, Network, WalletId } from '@types';
import { DEFAULT_NETWORK } from '@config';
import { Typography, Selector, Tooltip } from '@components';

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

const NetworkOption = ({
  data,
  selectOption
}: OptionProps<Network> | { data: Network; selectOption?(): void }) => (
  <SContainer onClick={() => selectOption && selectOption(data)}>
    <Typography value={data.name} />
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
  const network = getNetworkById(networkId);

  // set default network if none selected
  useEffect(() => {
    if (!networkId) {
      onChange(DEFAULT_NETWORK);
    }
  }, []);

  // @ADD_ACCOUNT_@todo: The difference in accountType is likely causing
  // the absence of list.
  const options = networks
    // @ts-ignore CHANGE IN WALLETYPE OBJECT CAUSING accountType to error -> @todo: FIX accountType
    .filter((n) => isWalletFormatSupportedOnNetwork(n, accountType));

  return (
    <div {...props}>
      <label>
        {translate('SELECT_NETWORK_LABEL')}{' '}
        {showTooltip && <Tooltip tooltip={translate('NETWORK_TOOLTIP')} />}
      </label>
      <Selector
        placeholder={'Select Network'}
        value={network}
        options={options}
        searchable={true}
        onChange={(option) => onChange(option.id)}
        getOptionLabel={(option) => option.name}
        optionComponent={NetworkOption}
        valueComponent={({ value }) => <NetworkOption data={value} />}
        disabled={disabled}
      />
    </div>
  );
}

export default NetworkSelectDropdown;
