import React from 'react';

import { OptionProps } from 'react-select';
import styled from 'styled-components';

import { Typography } from '@components';
import { monospace, SPACING } from '@theme';
import { DPath } from '@types';

const DropdownDPath = styled.span`
  padding-left: ${SPACING.XS};
  opacity: 0.5;
  font-size: 11px;
  font-family: ${monospace};
`;

const SContainer = styled('div')`
  display: flex;
  flex-direction: row;
  padding: 12px 12px 12px 0px;
`;

type TDPathOptionProps = OptionProps<DPath> | { data: DPath; selectOption?(): void };
export const DPathOption = ({ data, selectOption }: TDPathOptionProps) => (
  <SContainer onClick={selectOption && (() => selectOption(data))}>
    <Typography>
      {data.label}{' '}
      {data.value && <DropdownDPath>{data.value.toString().replace(' ', '')}</DropdownDPath>}
    </Typography>
  </SContainer>
);
