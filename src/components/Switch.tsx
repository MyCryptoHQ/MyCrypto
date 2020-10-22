import React from 'react';

import styled from 'styled-components';

import { Box, Input, Text } from '@components';

const LabelText = styled(Text)`
  color: ${(props) => props.theme.text};
  cursor: pointer;
`;
const Checkbox = styled(Input)<{
  greyable?: boolean;
}>`
  :checked + span {
    background-color: ${(props) =>
      props.greyable && !props.checked ? props.theme.switchBackgroundGreyable : '#b2d7e0'};
  }
  :checked + span::before {
    transform: translateX(30px);
  }
`;

const SliderBackground = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 16px;
  margin-left: 8px;
  margin-right: 8px;
  input {
    display: none;
  }
`;
const Slider = styled.span<{ greyable?: boolean; checked?: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) =>
    props.greyable && !props.checked ? props.theme.switchBackgroundGreyable : '#b2d7e0'};
  transition: 0.4s;
  border-radius: 17px;
  ::before {
    position: absolute;
    content: '';
    height: 22px;
    width: 22px;
    left: -4px;
    bottom: -3px;
    background-color: ${(props) =>
      props.greyable && !props.checked ? 'grey' : props.theme.primary};
    transition: 0.4s;
    border-radius: 17px;
  }
`;

interface Props {
  greyable?: boolean;
  labelLeft?: string;
  labelRight?: string;
  checked?: boolean;
  onChange?(): void;
}
export const Switch = ({ greyable, onChange, labelLeft, labelRight, checked }: Props) => (
  <Box variant="verticalCenter">
    <LabelText as="label" htmlFor="toggle">
      {labelLeft}
    </LabelText>
    <SliderBackground htmlFor="toggle">
      <Checkbox
        greyable={greyable}
        id="toggle"
        type="checkbox"
        onChange={onChange}
        checked={checked}
      />
      <Slider checked={checked} greyable={greyable} />
    </SliderBackground>
    <LabelText as="label" htmlFor="toggle">
      {labelRight}
    </LabelText>
  </Box>
);

export default Switch;
