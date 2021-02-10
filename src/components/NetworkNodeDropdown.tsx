import React, { FC, useCallback } from 'react';

import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import { OptionProps } from 'react-select';
import styled from 'styled-components';

import addIcon from '@assets/images/icn-add.svg';
import editIcon from '@assets/images/icn-edit.svg';
import { Selector, Typography } from '@components/index';
import { NetworkUtils, useNetworks } from '@services/Store';
import { COLORS, SPACING } from '@theme';
import { translateRaw } from '@translations';
import { CustomNodeConfig, NetworkId, NodeOptions } from '@types';

const SContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: ${SPACING.SM};
`;

const SContainerValue = styled(SContainer)`
  padding: ${SPACING.XS} ${SPACING.XS} ${SPACING.XS} 0px;
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

type NetworkNodeOptionProps = OptionProps<CustomNodeConfig> & {
  isEditEnabled: boolean;
};

const NetworkNodeOption: React.FC<NetworkNodeOptionProps> = ({ data, label, selectOption }) => {
  const handleSelect = (d: CustomNodeConfig) => selectOption && selectOption(d);

  if (label !== newNode) {
    return (
      <SContainerValue
        data-testid={`node-selector-option-${data.service}`}
        onClick={() => handleSelect(data)}
      >
        <Typography value={label} />
      </SContainerValue>
    );
  } else {
    return (
      <SContainerOption
        data-testid="node-selector-option-custom"
        onClick={() => handleSelect(data)}
      >
        <AddIcon src={addIcon} />
        {translateRaw('CUSTOM_NODE_DROPDOWN_NEW_NODE')}
      </SContainerOption>
    );
  }
};

interface Props {
  networkId: NetworkId;
  onEdit?(node?: CustomNodeConfig): void;
}

const NetworkNodeDropdown: FC<Props> = ({ networkId, onEdit }) => {
  const { getNetworkById, setNetworkSelectedNode } = useNetworks();
  const network = getNetworkById(networkId);

  const onChange = useCallback(
    (node: NodeOptions) => {
      if (!isEmpty(node) && node.service !== newNode) {
        const { name } = node;
        setNetworkSelectedNode(networkId, name);
      } else if (onEdit) {
        onEdit();
      }
    },
    [networkId, setNetworkSelectedNode]
  );

  const { nodes } = network;
  const autoNode = {
    service: translateRaw('AUTO_NODE')
  };
  const selectedNode = NetworkUtils.getSelectedNode(network) || autoNode;
  const displayNodes = [autoNode, ...nodes, ...(isFunction(onEdit) ? [{ service: newNode }] : [])];

  return (
    <Selector<NodeOptions & any>
      value={selectedNode}
      options={displayNodes}
      getOptionLabel={(n) => n.service}
      placeholder={'Auto'}
      searchable={true}
      onChange={(option) => onChange(option)}
      optionComponent={NetworkNodeOption}
      valueComponent={({ value }) => (
        <SContainerValue>
          <Typography value={value.service} />
          {isFunction(onEdit) && value.isCustom && (
            <EditIcon onClick={() => onEdit(value)} src={editIcon} />
          )}
        </SContainerValue>
      )}
    />
  );
};

export default NetworkNodeDropdown;
