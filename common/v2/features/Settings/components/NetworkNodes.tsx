import React, { FC } from 'react';

import { DashboardPanel, CollapsibleTable, Network } from 'v2/components';
import { CustomNodeConfig, Network as INetwork, NetworkId } from 'v2/types';
import { translateRaw } from 'v2/translations';
import { COLORS } from 'v2/theme';
import NetworkNodeDropdown from 'v2/components/NetworkNodeDropdown';
import useScreenSize from 'v2/utils/useScreenSize';

interface Props {
  networks: INetwork[];
  toggleFlipped(networkId: NetworkId, node?: CustomNodeConfig): void;
}

const NetworkNodes: FC<Props> = ({ networks, toggleFlipped }) => {
  const { isXsScreen } = useScreenSize();

  const networkNodesTable = {
    head: [
      translateRaw('CUSTOM_NODE_SETTINGS_TABLE_NETWORK_HEADER'),
      translateRaw('CUSTOM_NODE_SETTINGS_TABLE_NETWORK_NODE')
    ],
    body: networks.map(({ id, name, color }: INetwork, index) => [
      <Network key={index} color={color || COLORS.LIGHT_PURPLE}>
        {name}
      </Network>,
      <NetworkNodeDropdown
        key={index}
        networkId={id}
        onEdit={(node: CustomNodeConfig) => toggleFlipped(id, node)}
      />
    ]),
    config: {
      primaryColumn: translateRaw('CUSTOM_NODE_SETTINGS_TABLE_NETWORK_HEADER'),
      sortableColumn: translateRaw('CUSTOM_NODE_SETTINGS_TABLE_NETWORK_HEADER'),
      sortFunction: () => (a: any, b: any) => {
        const aLabel = a.props.label;
        const bLabel = b.props.label;
        return aLabel === bLabel ? true : aLabel.localeCompare(bLabel);
      }
    }
  };
  return (
    <DashboardPanel heading={isXsScreen ? <>{translateRaw('NETWORK_AND_NODES')}</> : null}>
      <CollapsibleTable breakpoint={450} {...networkNodesTable} />
    </DashboardPanel>
  );
};

export default NetworkNodes;
