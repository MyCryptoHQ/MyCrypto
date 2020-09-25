import React, { useEffect } from 'react';

import { OptionProps } from 'react-select';
import styled from 'styled-components';
import { Overwrite } from 'utility-types';

import { Selector, Tooltip, Typography } from '@components';
import { DEFAULT_NETWORK } from '@config';
import { isWalletSupported, useNetworks } from '@services/Store';
import translate from '@translations';
import { Network, NetworkId, WalletId } from '@types';
import { curry, filter, isNil, pipe, when } from '@vendor';

interface Props {
  network?: NetworkId;
  accountType?: WalletId;
  className?: string;
  showTooltip?: boolean;
  disabled?: boolean;
  onChange(network: NetworkId): void;
  filter?(network: Network): boolean;
}

type UIProps = Overwrite<Omit<Props, 'filter' | 'accountType'>, { network?: Network }> & {
  networks: Network[];
};

const SContainer = styled('div')`
  display: flex;
  flex-direction: row;
  padding: 12px;
`;

const NetworkOption = ({
  data,
  selectOption
}: OptionProps<Network> | { data: Network; selectOption?(): void }) => (
  <SContainer
    data-testid={`network-selector-option-${data.id}`}
    onClick={() => selectOption && selectOption(data)}
  >
    <Typography value={data.name} />
  </SContainer>
);

const NetworkSelectorUI = ({
  network,
  networks,
  onChange,
  showTooltip = false,
  disabled = false,
  ...props
}: UIProps) => {
  return (
    <div {...props}>
      <label htmlFor="network">
        {translate('SELECT_NETWORK_LABEL')}{' '}
        {showTooltip && <Tooltip tooltip={translate('NETWORK_TOOLTIP')} />}
      </label>
      <Selector
        name={'network'}
        placeholder={'Select Network'}
        value={network}
        options={networks}
        searchable={true}
        onChange={(option) => onChange(option.id)}
        getOptionLabel={(option) => option.name}
        optionComponent={NetworkOption}
        valueComponent={({ value }) => <NetworkOption data={value} />}
        disabled={disabled}
      />
    </div>
  );
};

// Smart component to connect to store.
const NetworkSelector = ({
  network: networkId,
  accountType,
  filter: filterPredicate,
  onChange,
  ...props
}: Props) => {
  const { networks, getNetworkById } = useNetworks();
  const network = networkId && getNetworkById(networkId);

  // Provide the default network value to the form. @todo: Move responsability to form.
  useEffect(() => {
    if (network) return;
    onChange(DEFAULT_NETWORK);
  }, []);

  // @ADD_ACCOUNT_@todo: The difference in accountType is likely causing
  // the absence of list.
  const filterNetworks = pipe(
    when(() => !isNil(filterPredicate), filter(filterPredicate!)),
    // This filter limits the display of Networks when adding a Ledger and Trezor. @todo: is it intentional?
    when(() => !isNil(accountType), filter(curry(isWalletSupported)(accountType!))) // when() checks that accountType exists
  );
  const options = filterNetworks(networks);

  return (
    <NetworkSelectorUI
      networks={options as Network[]}
      network={network}
      onChange={onChange}
      {...props}
    />
  );
};

export default NetworkSelector;
