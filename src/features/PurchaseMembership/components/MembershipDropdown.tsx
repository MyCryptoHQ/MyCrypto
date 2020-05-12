import React from 'react';
import styled from 'styled-components';
import { OptionComponentProps } from 'react-select';

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

interface Props {
  name: string;
  value: { label: string; value: IMembershipConfig };
  onSelect(option: { label: string; value: IMembershipConfig }): void;
}

function MembershipDropdown({ name, value, onSelect }: Props) {
  return (
    <Dropdown
      name={name}
      placeholder={translateRaw('ACCOUNT_SELECTION_PLACEHOLDER')}
      options={Object.values(MEMBERSHIP_CONFIG).map((c) => ({ label: c.title, value: c }))}
      onChange={(option) => onSelect(option)}
      optionComponent={MembershipOption}
      value={value}
      searchable={false}
      valueComponent={({ value: option }) => <MembershipOption option={option} />}
    />
  );
}

class MembershipOption extends React.PureComponent<OptionComponentProps> {
  public render() {
    const { option, onSelect } = this.props;
    const value = (option.value as unknown) as IMembershipConfig;
    return (
      <SContainer onClick={() => onSelect && onSelect(option, null)}>
        <Typography value={option.label} />
        <DiscountTypography value={value.discountNotice} />
      </SContainer>
    );
  }
}

export default MembershipDropdown;
