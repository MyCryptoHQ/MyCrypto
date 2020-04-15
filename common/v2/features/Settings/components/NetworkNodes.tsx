import React, { FC } from 'react';

import { DashboardPanel, CollapsibleTable, Network } from 'v2/components';
import { CustomNodeConfig, Network as INetwork, NetworkId } from 'v2/types';
import { translateRaw } from 'v2/translations';
import { COLORS } from 'v2/theme';
import NetworkNodeDropdown from 'v2/components/NetworkNodeDropdown';

interface Props {
  networks: INetwork[];
  toggleFlipped(networkId: NetworkId, node?: CustomNodeConfig): void;
}

const NetworkNodes: FC<Props> = ({ networks, toggleFlipped }) => {
  const networkNodesTable = {
    head: ['Network', 'Node'],
    body: networks.map(({ id, name, color }: INetwork, index) => [
      <Network key={index} color={color || COLORS.LIGHT_PURPLE}>
        {name}
      </Network>,
      <NetworkNodeDropdown
        key={index}
        networkId={id}
        toggleFlipped={(node: CustomNodeConfig) => toggleFlipped(id, node)}
      />
    ]),
    config: {
      primaryColumn: 'Network',
      sortableColumn: 'Network',
      sortFunction: (a: any, b: any) => {
        const aLabel = a.props.label;
        const bLabel = b.props.label;
        return aLabel === bLabel ? true : aLabel.localeCompare(bLabel);
      }
    }
  };
  return (
    <DashboardPanel heading={<>{translateRaw('NETWORK_AND_NODES')}</>}>
      <CollapsibleTable breakpoint={450} {...networkNodesTable} />
    </DashboardPanel>
  );
};

export default NetworkNodes;
