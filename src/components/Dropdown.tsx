import React from 'react';
import Select, {
  OptionComponentProps,
  ArrowRendererProps,
  OnInputChangeHandler,
  OnInputKeyDownHandler
} from 'react-select';
import styled from 'styled-components';

import { COLORS, FONT_SIZE } from '@theme';

import crossIcon from '@assets/images/icn-cross.svg';
import { CenteredIconArrow } from './IconArrow';

// Give a height to the input when value is defined
// Overide custom styles common/sass/styles/overrides/react-select.scss
interface SProps {
  value?: string;
  disabled?: boolean;
}

const SSelect = styled(Select)`
  height: ${(props: SProps) => (props.value ? 'auto' : '54px')};
  background-color: ${(props: SProps) => (props.disabled ? COLORS.GREY_LIGHTEST : 'default')};
  ${(props) => props.disabled && '.Select-arrow {display: none};'} font-size: ${FONT_SIZE.BASE};

  /* Set max-height to prevent the dropdown form overflowing the footer. */
  .Select-menu {
    max-height: 20em !important;
  }

  .Select-input {
    width: 100%;
    cursor: pointer;

    > input {
      width: 100% !important;
      cursor: pointer;
    }
  }
`;

interface Props<T> {
  options: T[];
  value: T;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  name?: string;
  dropdownIcon?: JSX.Element;
  optionComponent:
    | React.ComponentClass<OptionComponentProps<T>>
    | React.StatelessComponent<OptionComponentProps<T>>;
  valueComponent?: React.ComponentClass<T> | React.StatelessComponent<T>;
  inputValue?: string;
  onInputChange?: OnInputChangeHandler;
  onInputKeyDown?: OnInputKeyDownHandler;
  onCloseResetsInput?: boolean;
  onBlurResetsInput?: boolean;
  onChange?(option: T): void;
  onBlur?(e: string | undefined): void;
}

// Fixes weird placement issues for react-select
const DropdownContainer = styled('div')`
  cursor: pointer;

  .Select-control {
    cursor: pointer;
  }

  .is-searchable.is-open {
    .Select-input,
    .Select-control {
      cursor: text;

      > input {
        cursor: text;
      }
    }
  }

  .is-searchable.is-focused:not(.is-open) > .Select-control {
    cursor: pointer;
  }

  .has-value > .Select-control > .Select-multi-value-wrapper > .Select-input:only-child {
    transform: translateY(0%);
    padding: 16px 15px 16px 15px;
    position: inherit;
  }
`;

const IconWrapper = styled('div')`
  width: 30px;
`;

const OptionWrapper = styled.div`
  &:hover {
    background-color: ${COLORS.GREY_LIGHTEST};
  }
`;

const DropdownIndicator = (props: ArrowRendererProps) => (
  <CenteredIconArrow isFlipped={props.isOpen} />
);

const CustomDropdownIndicator = (dropdownIcon: JSX.Element) => () => (
  <IconWrapper>{dropdownIcon}</IconWrapper>
);

const ClearIndicator = () => (
  <IconWrapper>
    <img src={crossIcon} />
  </IconWrapper>
);

const OptionComponent = (
  props: OptionComponentProps,
  Component:
    | React.ComponentClass<OptionComponentProps>
    | React.StatelessComponent<OptionComponentProps>
) => (
  <OptionWrapper>
    <Component {...props} />
  </OptionWrapper>
);

// ContactLookup dropdown is using custom dropdown indicator (dropdownIcon) and clear field indicator.
// When value is set, it hides dropdown icon, so that clear icon can appear instead of it.
const getDropdownIndicator = (
  value: Props<any>['value'],
  dropdownIcon: Props<any>['dropdownIcon']
) => {
  if (!dropdownIcon) return DropdownIndicator;
  if (!value) return CustomDropdownIndicator(dropdownIcon);
  return null;
};

export default function Dropdown(props: Props<any>) {
  const { value, dropdownIcon, onBlur, inputValue, clearable = false, optionComponent } = props;

  return (
    <DropdownContainer>
      <SSelect
        {...props}
        arrowRenderer={getDropdownIndicator(value, dropdownIcon)}
        clearRenderer={ClearIndicator}
        menuContainerStyle={{ maxHeight: '65vh', borderTop: '1px solid #ececec' }}
        menuStyle={{ maxHeight: '65vh' }}
        onBlur={onBlur ? () => onBlur(inputValue) : undefined}
        clearable={clearable}
        optionComponent={(oProps: OptionComponentProps) => OptionComponent(oProps, optionComponent)}
      />
    </DropdownContainer>
  );
}
