import React from 'react';

import { OptionProps } from 'react-select';
import styled from 'styled-components';

import { Box, Selector, Text } from '@components';
import { monospace, SPACING } from '@theme';
import { DPath } from '@types';

const DropdownDPath = styled.span`
  padding-left: ${SPACING.XS};
  opacity: 0.5;
  font-size: 11px;
  font-family: ${monospace};
`;

type TDPathOptionProps = OptionProps<DPath> | { data: DPath; selectOption?(): void };
const DPathOption = ({ data, selectOption }: TDPathOptionProps) => (
  <Box p={'12px'} onClick={selectOption && (() => selectOption(data))}>
    <Text mb={SPACING.NONE}>
      {data.label}{' '}
      {data.value && <DropdownDPath>{data.value.toString().replace(' ', '')}</DropdownDPath>}
    </Text>
  </Box>
);

interface DPathSelectorProps {
  dPaths: DPath[];
  selectedDPath: DPath;
  searchable?: boolean;
  clearable?: boolean;
  selectDPath(dpath: DPath): void;
}

export const DPathSelector = ({
  searchable = true,
  clearable = true,
  selectedDPath,
  dPaths,
  selectDPath
}: DPathSelectorProps) => (
  <Selector
    value={selectedDPath}
    onChange={selectDPath}
    options={dPaths}
    optionComponent={DPathOption}
    valueComponent={({ value }) => <DPathOption data={value} />}
    searchable={searchable}
    clearable={clearable}
  />
);
