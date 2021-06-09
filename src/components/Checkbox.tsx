import React from 'react';

import { Typography } from '@mycrypto/ui';
import styled from 'styled-components';

interface CheckboxProps {
  name: string;
  label?: string;
  checked: boolean;
  icon?: any;
  marginLeft?: string;
  className?: string;
  onChange(): void;
}

const SContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 31px;
  margin-bottom: 15px;
  font-size: 1em;
  cursor: pointer;
`;

// Styling Checkbox Starts
// Adapted from: https://appitventures.com/blog/styling-checkbox-css-tips/
const checkboxSize = '20px';
const borderRadius = '2px';
const SLabel = styled('label')`
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 18px;
  line-height: ${checkboxSize};
  height: ${checkboxSize};
  width: ${checkboxSize};
  clear: both;
  margin: 0;

  & > input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  & > span {
    position: absolute;
    height: ${checkboxSize};
    width: ${checkboxSize};
    background-color: transparent;
    border-radius: ${borderRadius};
    border: ${(props) => `1px solid ${props.theme.colors.GREY_ATHENS}`};
    transition: all 0.2s ease-out;
  }

  & > input:checked ~ span {
    background-color: transparent;
    border-radius: ${borderRadius};
    transform: rotate(0deg) scale(1);
    opacity: 1;
    border: ${(props) => `1px solid ${props.theme.colors.GREY_ATHENS}`};
  }

  /*
    Create the pseudo content element and place it in the center
    Hide it by setting the scale(0)
    This will be the origin of the transition.
  */
  & > span::after {
    position: absolute;
    content: '';
    left: 50%;
    top: 50%;
    margin-top: -1px;
    margin-left: -1px;
    height: 0;
    width: 0;
    border: ${(props) => `1px solid ${props.theme.colors.BLUE_BRIGHT}`};
    opacity: 1;
    transform: rotate(0deg) scale(0);
    transition: all 0.2s ease-out;
  }

  /*
     When the checkbox is selected we transform to show half the borders
     of a rotated rectangle which provides the swoosh effect.
    'top' & 'left' are used to position the swoosh with the container.
    'width' & 'height' serve as the size.
  */
  & > input:checked ~ span::after {
    opacity: 1;
    left: 35%;
    top: 15%;
    width: 7px;
    height: 12px;
    border: ${(props) => `solid ${props.theme.colors.BLUE_BRIGHT}`};
    border-radius: 1px;
    border-width: 0 2px 2px 0;
    background-color: transparent;
    transform: rotate(45deg) scale(1);
  }
`;

const SIconContainer = styled('div')`
  display: flex;
  align-items: center;
  margin-right: 15px;
  & img {
    width: 30px;
    height: 30px;
  }
`;

const SLabelContainer = styled('div')`
  padding: 7px 0;
`;

export default function Checkbox({
  className,
  name,
  label,
  checked,
  onChange,
  icon,
  marginLeft = '15px'
}: CheckboxProps) {
  return (
    <SContainer className={className} onClick={onChange}>
      <SLabel key={name} htmlFor={name}>
        <input
          data-for="hidden-checkbox"
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
        />
        <span data-for="custom-checkbox" />
      </SLabel>
      <div style={{ display: 'flex', flexDirection: 'row', marginLeft }}>
        {icon && <SIconContainer>{icon()}</SIconContainer>}
        {label && (
          <SLabelContainer>
            <Typography style={{ fontSize: '1em', margin: 0 }}>{label}</Typography>
          </SLabelContainer>
        )}
      </div>
    </SContainer>
  );
}
