import React, { useContext, useEffect } from 'react';

import { OptionComponentProps } from 'react-select';
import styled from 'styled-components';
import translate from 'v2/translations';
import { NetworkContext, isWalletFormatSupportedOnNetwork } from 'v2/services/Store';
import { NetworkId, WalletId } from 'v2/types';
import { DEFAULT_NETWORK } from 'v2/config';
import { Typography, Dropdown } from 'v2/components';

interface Props {
  network: string | undefined;
  accountType?: WalletId;
  className?: string;
  onChange(network: NetworkId): void;
}

const DropdownContainer = styled('div')`
  .is-open > .Select-control > .Select-multi-value-wrapper > .Select-input:only-child {
    transform: translateY(0%);
    padding: 12px;
    position: inherit;
  }
`;

const SContainer = styled('div')`
  display: flex;
  flex-direction: row;
  padding: 12px;

  &:hover {
    background-color: var(--color-gray-lighter);
  }
`;

class NetworkOption extends React.PureComponent<OptionComponentProps> {
  public render() {
    const { option, onSelect } = this.props;
    return (
      <SContainer onClick={() => onSelect && onSelect(option, null)}>
        <Typography value={option.label} />
      </SContainer>
    );
  }
}

function NetworkSelectDropdown({ network, accountType, onChange, ...props }: Props) {
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
    .map(n => ({ label: n.name, value: n }));

  return (
    <div {...props}>
      <label>{translate('SELECT_NETWORK_LABEL')}</label>
      <DropdownContainer>
        <Dropdown
          value={{ label: network }}
          options={validNetworks.sort()}
          placeholder={DEFAULT_NETWORK}
          searchable={true}
          onChange={option => onChange(option.value.id)}
          optionComponent={NetworkOption}
          valueComponent={({ value: option }) => <NetworkOption option={option} />}
        />
      </DropdownContainer>
    </div>
  );
}

export default NetworkSelectDropdown;
