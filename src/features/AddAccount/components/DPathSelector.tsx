import { DerivationPath as DPath } from '@mycrypto/wallets';
import { OptionProps } from 'react-select';
import styled from 'styled-components';

import { Box, Selector, Text } from '@components';
import { monospace, SPACING } from '@theme';

const DropdownDPath = styled.span`
  padding-left: ${SPACING.XS};
  opacity: 0.5;
  font-size: 11px;
  font-family: ${monospace};
`;

type TDPathOptionProps = { paddingLeft: string } & (
  | OptionProps<DPath, false>
  | { data: DPath; selectOption?(): void }
);
const DPathOption = ({ data, paddingLeft, selectOption }: TDPathOptionProps) => (
  <Box
    p={`11px 10px 11px ${paddingLeft || '0px'}`}
    onClick={selectOption && (() => selectOption(data))}
  >
    <Text mb={SPACING.NONE}>
      {data.name} {data.path && <DropdownDPath>{data.path}</DropdownDPath>}
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
    optionComponent={(props) => <DPathOption paddingLeft={'15px'} {...props} />}
    valueComponent={({ value }) => <DPathOption data={value} paddingLeft={SPACING.XS} />}
    searchable={searchable}
    clearable={clearable}
  />
);
