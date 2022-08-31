import { useEffect } from 'react';

import { OptionProps } from 'react-select';
import styled from 'styled-components';
import { Overwrite } from 'utility-types';

import { Body, Box, Selector, Tooltip } from '@components';
import { DEFAULT_NETWORK } from '@config';
import { isWalletSupported, useNetworks } from '@services/Store';
import { COLORS, SPACING } from '@theme';
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
interface StyleProps extends OptionProps<Network, false> {
  paddingLeft?: string;
}

type UIProps = Overwrite<
  Omit<Props, 'filter' | 'accountType' | 'onChange'>,
  { network?: Network }
> & {
  onSelect(n: NetworkId): void;
  networks: Network[];
};

const NetworkOption = ({
  data,
  paddingLeft = '0',
  selectOption
}: StyleProps | { data: Network; selectOption?(): void; paddingLeft?: string }) => (
  <Box
    padding="12px"
    pl={paddingLeft}
    display="flex"
    flexDirection="row"
    data-testid={`network-selector-option-${data.id}`}
    onClick={() => selectOption && selectOption(data)}
  >
    <Body as="span">{data.name}</Body>
  </Box>
);

const SLabel = styled.label`
  color: ${COLORS.GREY_DARKEST};
  font-weight: normal;
`;

const NetworkSelectorUI = ({
  network,
  networks,
  onSelect,
  showTooltip = false,
  disabled = false,
  ...props
}: UIProps) => {
  return (
    <div {...props}>
      <SLabel htmlFor="network">
        {translate('SELECT_NETWORK_LABEL')}{' '}
        {showTooltip && <Tooltip tooltip={translate('NETWORK_TOOLTIP')} />}
      </SLabel>
      <Selector
        name={'network'}
        placeholder={'Select Network'}
        value={network}
        options={networks}
        searchable={true}
        onChange={(option) => onSelect(option.id)}
        getOptionLabel={(option) => option.name}
        optionComponent={(props) => <NetworkOption paddingLeft={SPACING.SM} {...props} />}
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
      onSelect={onChange}
      {...props}
    />
  );
};

export default NetworkSelector;
