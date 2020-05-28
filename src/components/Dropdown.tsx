import React, { ComponentType, FC } from 'react';
import Select, {
  IndicatorProps,
  OptionProps,
  ValueContainerProps,
  components as ReactSelectComponents,
  Styles
} from 'react-select';
import { InputActionMeta } from 'react-select/src/types';
import styled from 'styled-components';
import { Icon } from '@mycrypto/ui';

import { COLORS, FONT_SIZE } from '@theme';

import crossIcon from '@assets/images/icn-cross.svg';

type OptionComponentType<T = any> = React.ComponentClass<OptionProps<T>> | React.FC<OptionProps<T>>;

interface Props<T = any> {
  options: T[];
  value: T | undefined;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  name?: string;
  dropdownIcon?: JSX.Element;
  optionComponent: OptionComponentType<T> | any;
  valueComponent?: ComponentType<{ value: T }>;
  inputValue?: string;
  onCloseResetsInput?: boolean;
  onBlurResetsInput?: boolean;

  onChange?(option: T): void;

  onBlur?(e: string | undefined): void;

  onInputChange?(newValue: string, actionMeta: InputActionMeta): void;

  onInputKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
}

// Fixes weird placement issues for react-select
const DropdownContainer = styled('div')`
  cursor: pointer;
`;

const Chevron = styled(Icon)`
  font-size: 0.75rem;
`;

const IconWrapper = styled('div')`
  width: 30px;
`;

const OptionWrapper = styled.div`
  &:hover {
    background-color: ${COLORS.GREY_LIGHTEST};
  }
`;

const DropdownIndicator: (icon?: JSX.Element) => FC<IndicatorProps<any>> = (icon) => (props) => {
  const {
    selectProps: { menuIsOpen }
  } = props;
  return (
    <ReactSelectComponents.DropdownIndicator {...props}>
      {icon ? (
        <IconWrapper>{icon}</IconWrapper>
      ) : (
        <Chevron icon={menuIsOpen ? 'chevronUp' : 'chevronDown'} />
      )}
    </ReactSelectComponents.DropdownIndicator>
  );
};

const ClearIndicator: FC<IndicatorProps<any>> = (props) => {
  const { clearValue } = props;
  return (
    <IconWrapper onClick={clearValue}>
      <img src={crossIcon} />
    </IconWrapper>
  );
};

const getValueContainer: <T = any>(
  props: ValueContainerProps<T> & OptionProps<T>,
  ValueComponent: ComponentType<{ value: T }> | undefined
) => any = (props, ValueComponent) => {
  const {
    hasValue,
    getValue,
    selectProps: { inputValue }
  } = props;
  if (!hasValue || !ValueComponent) {
    return <ReactSelectComponents.ValueContainer {...props} />;
  }
  const [data] = getValue() as any[];
  const { children } = props;
  return (
    <ReactSelectComponents.ValueContainer {...props}>
      {React.Children.map(children, (child: JSX.Element) =>
        child && [ReactSelectComponents.SingleValue].indexOf(child.type) === -1 ? child : null
      )}
      {!inputValue && <ValueComponent value={data} />}
    </ReactSelectComponents.ValueContainer>
  );
};

const getOption = (props: OptionProps<any>, Component: ComponentType<OptionProps<any>>) => (
  <OptionWrapper>
    <Component {...props} />
  </OptionWrapper>
);

const customStyles: Styles = {
  menu: (provided, state) => ({
    ...provided,
    maxHeight: '65vh',
    border: '0.125em solid rgba(0,122,153,0.65)',
    color: state.selectProps.menuColor,
    'div:last-child > .divider': {
      display: 'none'
    },
    margin: 0,
    borderRadius: '0.125em'
  }),
  control: (provided, state) => ({
    ...provided,
    border: '0.125em solid rgba(63,63,68,0.05)',
    borderRadius: '0.125em',
    boxShadow: 'none',
    '&:hover': {
      border: '0.125em solid rgba(0,122,153,0.65)'
    },
    height: state.hasValue ? 'auto' : '54px',
    fontSize: FONT_SIZE.BASE,
    backgroundColor: state.isDisabled ? COLORS.GREY_LIGHTEST : 'default',
    paddingLeft: state.hasValue ? 0 : 5
  })
};

const Dropdown: <T = any>(p: Props<T>) => React.ReactElement<Props<T>> = (props) => {
  const {
    options,
    value,
    disabled = false,
    placeholder,
    searchable = true,
    clearable = false,
    name,
    dropdownIcon,
    optionComponent,
    valueComponent,
    inputValue,
    onCloseResetsInput,
    onBlurResetsInput,
    onChange,
    onBlur,
    onInputChange,
    onInputKeyDown
  } = props;

  return (
    <DropdownContainer>
      <Select
        options={options}
        defaultValue={value}
        isDisabled={disabled}
        placeholder={placeholder}
        isSearchable={searchable}
        isClearable={clearable}
        name={name}
        blurInputOnSelect={onBlurResetsInput}
        onMenuClose={() => onCloseResetsInput}
        onChange={onChange}
        onBlur={onBlur ? () => onBlur(inputValue) : undefined}
        onInputChange={onInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onInputKeyDown) {
            onInputKeyDown(e);
          }
        }}
        openMenuOnClick={true}
        styles={customStyles}
        components={{
          DropdownIndicator: DropdownIndicator(dropdownIcon),
          Option: (oProps: any) => getOption(oProps, optionComponent),
          ClearIndicator,
          ValueContainer: (oProps: any) => getValueContainer(oProps, valueComponent),
          IndicatorSeparator: () => null
        }}
      />
    </DropdownContainer>
  );
};

export default Dropdown;
