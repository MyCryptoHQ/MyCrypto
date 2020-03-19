import React from 'react';
import styled from 'styled-components';

import { translateRaw } from 'v2/translations';
import { Typography, Dropdown } from 'v2/components';
import { MEMBERSHIP_CONFIG, IMembershipConfig } from '../config';
import { OptionComponentProps } from 'react-select';

const SContainer = styled('div')`
  display: flex;
  flex-direction: row;
  padding: 12px;

  &:hover {
    background-color: var(--color-gray-lighter);
  }
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
      options={Object.values(MEMBERSHIP_CONFIG).map(c => ({ label: c.title, value: c }))}
      onChange={option => onSelect(option)}
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
    return (
      <SContainer onClick={() => onSelect && onSelect(option, null)}>
        <Typography value={option.label} />
      </SContainer>
    );
  }
}

export default MembershipDropdown;
