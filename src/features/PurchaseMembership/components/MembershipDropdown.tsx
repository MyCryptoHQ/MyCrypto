import React from 'react';
import styled from 'styled-components';
import { OptionProps } from 'react-select';

import { translateRaw } from '@translations';
import { Typography, Dropdown } from '@components';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import { MEMBERSHIP_CONFIG, IMembershipConfig } from '../config';

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

// @todo check if the nesting of 'IMembershipConfig' is really necessary
export interface TMembershipOption {
  label: string;
  value: IMembershipConfig;
}
export interface MembershipDropdownProps {
  name: string;
  value?: TMembershipOption;
  onSelect(option: TMembershipOption): void;
}

function MembershipDropdown({ name, value, onSelect }: MembershipDropdownProps) {
  const options: TMembershipOption[] = Object.values(MEMBERSHIP_CONFIG).map((c) => ({
    label: c.title,
    value: c
  }));

  return (
    <Dropdown<TMembershipOption>
      name={name}
      placeholder={translateRaw('MEMBERSHIP_DROPDOWN_PLACEHOLDER')}
      options={options}
      onChange={(option) => onSelect(option)}
      optionComponent={({ data, selectOption }: OptionProps<TMembershipOption>) => (
        <MembershipOption option={data} onClick={selectOption} />
      )}
      value={value}
      searchable={false}
      valueComponent={({ value: option }) => <MembershipOption option={option} />}
    />
  );
}

export const MembershipOption = ({
  option,
  onClick
}: {
  option: TMembershipOption;
  onClick?(optoin: TMembershipOption): void;
}) => {
  return (
    <SContainer onClick={() => onClick && onClick(option)}>
      <Typography value={option.label} />
      <DiscountTypography value={option.value.discountNotice} />
    </SContainer>
  );
};

export default MembershipDropdown;
