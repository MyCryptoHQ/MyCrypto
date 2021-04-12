import React from 'react';

import { OptionProps } from 'react-select';
import styled from 'styled-components';

import { Box, Text } from '@components';
import { monospace, SPACING } from '@theme';
import { DPath } from '@types';

const DropdownDPath = styled.span`
  padding-left: ${SPACING.XS};
  opacity: 0.5;
  font-size: 11px;
  font-family: ${monospace};
`;

type TDPathOptionProps = OptionProps<DPath> | { data: DPath; selectOption?(): void };
export const DPathOption = ({ data, selectOption }: TDPathOptionProps) => (
  <Box p={'12px'} onClick={selectOption && (() => selectOption(data))}>
    <Text>
      {data.label}{' '}
      {data.value && <DropdownDPath>{data.value.toString().replace(' ', '')}</DropdownDPath>}
    </Text>
  </Box>
);
