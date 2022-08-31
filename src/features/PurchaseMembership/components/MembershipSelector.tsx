import { useSelector } from 'react-redux';
import { OptionProps } from 'react-select';
import styled from 'styled-components';

import { Selector, Typography } from '@components';
import { selectNetwork } from '@store';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import { translateRaw } from '@translations';

import { IMembershipConfig, MEMBERSHIP_CONFIG } from '../config';

interface StyleProps {
  paddingLeft?: string;
}

interface MembershipItemProps {
  option: IMembershipConfig;
  onClick?(option: IMembershipConfig): void;
}

const SContainer = styled('div')<StyleProps>`
  display: flex;
  flex-direction: row;
  padding: 11px 12px 11px 0px;
  ${({ paddingLeft }) => paddingLeft && `padding-left: ${paddingLeft};`}
`;

const NetworkName = styled(Typography)`
  margin-left: ${SPACING.XS};
  font-weight: 300;
`;

const DiscountTypography = styled(Typography)`
  color: ${COLORS.BLUE_BRIGHT};
  font-size: ${FONT_SIZE.XS};
  margin-left: ${SPACING.XS};
`;

export const MembershipSelectorItem = ({
  option,
  paddingLeft,
  onClick
}: MembershipItemProps & StyleProps) => {
  const network = useSelector(selectNetwork(option.networkId));
  return (
    <SContainer paddingLeft={paddingLeft} onClick={() => onClick && onClick(option)}>
      <Typography value={option.title} />
      <NetworkName value={` (${network.name.toLowerCase()})`} />
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
  const options: IMembershipConfig[] = Object.values(MEMBERSHIP_CONFIG).filter(
    ({ disabled }) => !disabled
  );

  return (
    <Selector<IMembershipConfig>
      name={name}
      placeholder={translateRaw('MEMBERSHIP_DROPDOWN_PLACEHOLDER')}
      options={options}
      onChange={(option) => onSelect(option)}
      getOptionLabel={(option) => option.title}
      optionComponent={({ data, selectOption }: OptionProps<IMembershipConfig, false>) => (
        <MembershipSelectorItem option={data} onClick={selectOption} paddingLeft={SPACING.SM} />
      )}
      valueComponent={({ value: option }) => <MembershipSelectorItem option={option} />}
      value={value}
      searchable={false}
    />
  );
}
