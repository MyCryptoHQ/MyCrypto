import React from 'react';

import { OptionProps } from 'react-select';
import styled from 'styled-components';

import { Selector, Typography } from '@components';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import { translateRaw } from '@translations';

import { IMembershipConfig, MEMBERSHIP_CONFIG } from '../config';

const SContainer = styled('div')`
  display: flex;
  flex-direction: row;
  padding: 12px;
`;

const DiscountTypography = styled(Typography)`
  color: ${COLORS.BLUE_BRIGHT};
  font-size: ${FONT_SIZE.XS};
  margin-left: ${SPACING.XS};
`;

export const MembershipSelectorItem = ({
  option,
  onClick
}: {
  option: IMembershipConfig;
  onClick?(option: IMembershipConfig): void;
}) => {
  return (
    <SContainer onClick={() => onClick && onClick(option)}>
      <Typography value={option.title} />
      <DiscountTypography value={option.discountNotice} />
    </SContainer>
  );
};

export interface MembershipSelectorProps {
  name: string;
  value: IMembershipConfig | null;
  onSelect(option: IMembershipConfig): void;
}

export default function MembershipSelector({ name, value, onSelect }: MembershipSelectorProps) {
  const options: IMembershipConfig[] = Object.values(MEMBERSHIP_CONFIG);

  return (
    <Selector<IMembershipConfig>
      name={name}
      placeholder={translateRaw('MEMBERSHIP_DROPDOWN_PLACEHOLDER')}
      options={options}
      onChange={(option) => onSelect(option)}
      getOptionLabel={(option) => option.title}
      optionComponent={({ data, selectOption }: OptionProps<IMembershipConfig>) => (
        <MembershipSelectorItem option={data} onClick={selectOption} />
      )}
      valueComponent={({ value: option }) => <MembershipSelectorItem option={option} />}
      value={value}
      searchable={false}
    />
  );
}
