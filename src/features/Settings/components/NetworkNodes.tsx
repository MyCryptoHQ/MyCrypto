import React, { FC } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { DashboardPanel, CollapsibleTable, Network } from '@components';
import { CustomNodeConfig, Network as INetwork, NetworkId } from '@types';
import { translateRaw } from '@translations';
import { COLORS, SPACING } from '@theme';
import { useFeatureFlags } from '@services';
import NetworkNodeDropdown from '@components/NetworkNodeDropdown';
import useScreenSize from '@utils/useScreenSize';

interface Props {
  networks: INetwork[];
  toggleFlipped(networkId: NetworkId, node?: CustomNodeConfig): void;
  toggleNetworkCreation(): void;
}

const AddNetworkButton = styled(Button)`
  color: ${COLORS.BLUE_BRIGHT};
  padding: ${SPACING.BASE};
  opacity: 1;
  &:hover {
    transition: 200ms ease all;
    transform: scale(1.02);
    opacity: 0.7;
  }
`;

const BottomRow = styled.div`
  text-align: center;
  background: ${COLORS.BLUE_GREY_LIGHTEST};
`;

const NetworkNodes: FC<Props> = ({ networks, toggleFlipped, toggleNetworkCreation }) => {
  const { IS_ACTIVE_FEATURE } = useFeatureFlags();
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
      {IS_ACTIVE_FEATURE.CUSTOM_NETWORKS && (
        <BottomRow>
          <AddNetworkButton onClick={toggleNetworkCreation} basic={true}>
            {`+ ${translateRaw('ADD_NETWORK')}`}
          </AddNetworkButton>
        </BottomRow>
      )}
    </DashboardPanel>
  );
};

export default NetworkNodes;
