import React, { useCallback, useContext, FC, useState, useEffect } from 'react';
import { OptionComponentProps } from 'react-select';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';

import { NetworkContext, NetworkUtils } from 'v2/services/Store';
import { CustomNodeConfig, NetworkId, NodeOptions } from 'v2/types';
import { Typography, Dropdown } from 'v2/components/index';
import { translateRaw } from 'v2/translations';
import { SPACING, COLORS } from 'v2/theme';

import addIcon from 'assets/images/icn-add.svg';
import editIcon from 'assets/images/icn-edit.svg';

const SContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 12px;

  &:hover {
    background-color: var(--color-gray-lighter);
  }
`;

const SContainerValue = styled(SContainer)`
  > img {
    position: absolute;
    right: ${SPACING.SM};
  }
`;

const SContainerOption = styled(SContainer)`
  display: flex;
  position: relative;
  align-content: center;
  color: ${COLORS.BLUE_BRIGHT};
`;

const EditIcon = styled.img`
  cursor: pointer;
  padding: ${SPACING.XS} ${SPACING.SM};
  &:hover {
    transition: 200ms ease all;
    opacity: 0.7;
  }
`;

const AddIcon = styled.img`
  display: flex;
  align-self: center;
  height: 12px;
  width: 12px;
  margin-right: ${SPACING.XS};
`;

const newNode = 'NEW_NODE';
const autoNodeLabel = translateRaw('AUTO_NODE');

interface NetworkOptionProps extends OptionComponentProps<CustomNodeConfig> {
  isEditEnabled: boolean;
}

class NetworkOption extends React.PureComponent<NetworkOptionProps> {
  public render() {
    const { option, onSelect } = this.props;

    const isEditEnabled = this.props.isEditEnabled === undefined || false;
    const {
      value: { isCustom }
    } = option as { value: CustomNodeConfig };

    if (option.label !== newNode) {
      return (
        <SContainerValue onClick={() => onSelect && onSelect(option, null)}>
          <Typography value={option.label} />
          {isFunction(option.toggleFlipped) && isEditEnabled && isCustom === true && (
            <EditIcon
              onClick={e => {
                e.preventDefault();

                if (option.toggleFlipped) {
                  option.toggleFlipped(option.value);
                }
              }}
              src={editIcon}
            />
          )}
        </SContainerValue>
      );
    } else {
      return (
        <SContainerOption onClick={() => onSelect && onSelect({}, null)}>
          <AddIcon src={addIcon} />
          {translateRaw('CUSTOM_NODE_DROPDOWN_NEW_NODE')}
        </SContainerOption>
      );
    }
  }
}

interface Props {
  networkId: NetworkId;
  toggleFlipped?(node?: CustomNodeConfig): void;
}

const NetworkNodeDropdown: FC<Props> = ({ networkId, toggleFlipped }) => {
  const { networks, getNetworkById, setNetworkSelectedNode } = useContext(NetworkContext);
  const [network, setNetwork] = useState(() => getNetworkById(networkId));
  const [selectedNode, setSelectedNode] = useState(() => NetworkUtils.getSelectedNode(network));

  useEffect(() => {
    const newNetwork = getNetworkById(networkId);
    setNetwork(newNetwork);
    setSelectedNode(NetworkUtils.getSelectedNode(newNetwork));
  }, [networkId, networks]);

  const onChange = useCallback(
    (node: NodeOptions) => {
      if (!isEmpty(node)) {
        const { name } = node;
        setNetworkSelectedNode(networkId, name);
        setSelectedNode(node);
      } else if (toggleFlipped) {
        toggleFlipped();
      }
    },
    [networkId, setNetworkSelectedNode]
  );

  const { nodes, autoNode: autoNodeName } = network;
  const autoNode = {
    ...NetworkUtils.getAutoNode(network),
    service: autoNodeLabel
  };
  const { service, name: selectedNodeName } = selectedNode;
  let displayNodes = [autoNode, ...nodes];

  if (isFunction(toggleFlipped)) {
    displayNodes = [...displayNodes, { service: newNode } as any];
  }

  return (
    <Dropdown
      value={{
        label: selectedNodeName === autoNodeName ? autoNodeLabel : service,
        value: selectedNode
      }}
      options={displayNodes.map(n => ({ label: n.service, value: n, toggleFlipped }))}
      placeholder={'Auto'}
      searchable={true}
      onChange={option => onChange(option.value)}
      optionComponent={NetworkOption}
      valueComponent={({ value: option }) => <NetworkOption isEditEnabled={true} option={option} />}
    />
  );
};

export default NetworkNodeDropdown;
