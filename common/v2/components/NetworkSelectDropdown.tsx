import React, { useContext, useEffect } from 'react';

import styled from 'styled-components';
import { translate } from 'translations';
import { NetworkContext, isWalletFormatSupportedOnNetwork } from 'v2/services/Store';
import { NetworkId, WalletId } from 'v2/types';
import { DEFAULT_NETWORK } from 'v2/config';
import { Typography, Dropdown } from 'v2/components';
import { OptionComponentProps } from 'react-select';

interface Props {
  network: string | undefined;
  accountType?: WalletId;
  onChange(network: NetworkId): void;
}

const SContainer = styled('div')`
  display: flex;
  flex-direction: row;
  padding: 16px 15px 16px 15px;

  &:hover {
    background-color: var(--color-gray-lighter);
  }
`;

class NetworkOption extends React.PureComponent<OptionComponentProps> {
  public render() {
    const { option, onSelect } = this.props;
    return (
      <SContainer onClick={() => onSelect!(option, null)}>
        <Typography value={option.label} />
      </SContainer>
    );
  }
}

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
      <Dropdown
        value={{ label: network }}
        options={validNetworks.sort().map(n => ({ value: n, label: n }))}
        placeholder={DEFAULT_NETWORK}
        searchable={true}
        onChange={value => onChange(value.label as NetworkId)}
        optionComponent={NetworkOption}
        valueComponent={({ value: option }) => (
          <NetworkOption option={option} />
        )}
      />
    </div>
  );
}

export default NetworkSelectDropdown;
