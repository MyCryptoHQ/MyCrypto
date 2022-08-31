import { FC } from 'react';

import { Box, CollapsibleTable, DashboardPanel, Icon, LinkApp, Network, Text } from '@components';
import NetworkNodeDropdown from '@components/NetworkNodeDropdown';
import { useFeatureFlags } from '@services';
import { COLORS, SPACING } from '@theme';
import { translateRaw } from '@translations';
import { CustomNodeConfig, Network as INetwork, NetworkId } from '@types';
import useScreenSize from '@utils/useScreenSize';

interface Props {
  networks: INetwork[];
  toggleFlipped(networkId: NetworkId, node?: CustomNodeConfig): void;
  toggleNetworkCreation(): void;
}

const NetworkNodes: FC<Props> = ({ networks, toggleFlipped, toggleNetworkCreation }) => {
  const { featureFlags } = useFeatureFlags();
  const { isXsScreen } = useScreenSize();

  const networkNodesTable = {
    head: [
      translateRaw('CUSTOM_NODE_SETTINGS_TABLE_NETWORK_HEADER'),
      translateRaw('CUSTOM_NODE_SETTINGS_TABLE_NETWORK_NODE')
    ],
    body: networks.map(({ id, name, color = COLORS.LIGHT_PURPLE }: INetwork, index) => [
      <Network key={index} color={color}>
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
    <DashboardPanel
      heading={isXsScreen ? <>{translateRaw('NETWORK_AND_NODES')}</> : null}
      headingRight={
        featureFlags.CUSTOM_NETWORKS ? (
          <LinkApp href="#" onClick={toggleNetworkCreation}>
            <Box variant="rowAlign">
              <Icon type="add-bold" width="16px" />
              <Text ml={SPACING.XS} mb={0} color="BLUE_BRIGHT">
                {translateRaw('ADD_NETWORK')}
              </Text>
            </Box>
          </LinkApp>
        ) : undefined
      }
    >
      <CollapsibleTable breakpoint={450} {...networkNodesTable} />
    </DashboardPanel>
  );
};

export default NetworkNodes;
