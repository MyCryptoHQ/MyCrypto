import React from 'react';
import Select, {
  IndicatorProps,
  OptionProps,
  ValueContainerProps,
  components as ReactSelectComponents,
  Styles
} from 'react-select';
import { FocusEventHandler, InputActionMeta } from 'react-select/src/types';
import styled from 'styled-components';

import { COLORS, FONT_SIZE } from '@theme';

import crossIcon from '@assets/images/icn-cross.svg';
import { CenteredIconArrow } from './IconArrow';

export interface SelectorProps<T> {
  options: T[];
  // We prefer controlled components so `value` is required prop. When it is `null`, React-Select will display the placeholder
  value: T | null | undefined;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  name?: string;
  dropdownIcon?: JSX.Element;
  optionComponent: React.ComponentType<OptionProps<T>>;
  valueComponent?: React.ComponentClass<{ value: T }> | React.StatelessComponent<{ value: T }>;
  inputId?: string;
  inputValue?: string;
  onCloseResetsInput?: boolean;
  onBlurResetsInput?: boolean;
  onBlur?: FocusEventHandler;
  optionDivider?: boolean;
  getOptionLabel?(option: T): string;
  onChange?(option: T): void;
  onInputChange?(newValue: string, actionMeta: InputActionMeta): void;
  onInputKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
}

// Fixes weird placement issues for react-select
const Wrapper = styled('div')`
  cursor: pointer;
`;

const IconWrapper = styled('div')`
  width: 30px;
`;

const OptionWrapper = styled.div`
  ${(p: { optionDivider: boolean }) =>
    p.optionDivider
      ? `
    border-bottom: 1px solid ${COLORS.GREY_LIGHTER};
    &:last-of-type {
      border-bottom: none
    }
  `
      : ''}

  &:hover {
    background-color: ${COLORS.GREY_LIGHTEST};
  }
`;

const DropdownIndicator: (icon?: JSX.Element) => React.FC<IndicatorProps<any>> = (icon) => (
  props
) => {
  const {
    selectProps: { menuIsOpen }
  } = props;
  return (
    <ReactSelectComponents.DropdownIndicator {...props}>
      {icon ? <IconWrapper>{icon}</IconWrapper> : <CenteredIconArrow isFlipped={menuIsOpen} />}
    </ReactSelectComponents.DropdownIndicator>
  );
};

const ClearIndicator: React.FC<IndicatorProps<any>> = ({ clearValue }) => (
  <IconWrapper onClick={clearValue}>
    <img src={crossIcon} />
  </IconWrapper>
);

const getValueContainer: <T = any>(
  props: ValueContainerProps<T> & OptionProps<T>,
  ValueComponent?: React.ComponentType<{ value: T }>
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

const getOption = (
  { optionDivider = false, ...props }: OptionProps<any> & { optionDivider: boolean },
  Component: React.ComponentType<OptionProps<any>>
) => (
  <OptionWrapper optionDivider={optionDivider}>
    <Component {...props} />
  </OptionWrapper>
);

const customStyles: Styles = {
  menu: (provided, state) => {
    return {
      ...provided,
      maxHeight: '65vh',
      border: '0.125em solid rgba(0,122,153,0.65)',
      color: state.selectProps.menuColor,
      margin: 0,
      borderRadius: '0.125em'
    };
  },
  menuList: (provided) => ({
    ...provided,
    padding: 0
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
  }),
  input: (provided) => ({
    ...provided,
    display: 'inline-block'
  }),
  // Allow the valueComponent to handle it's own padding when present.
  valueContainer: (styles, state) => ({
    ...styles,
    ...(state && state.hasValue && { paddingLeft: 0 })
  })
};

const Selector: <T = any>(p: SelectorProps<T>) => React.ReactElement<SelectorProps<T>> = ({
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
  inputId,
  inputValue,
  onCloseResetsInput,
  onBlurResetsInput,
  onChange,
  onBlur,
  onInputChange,
  onInputKeyDown,
  optionDivider,
  ...props
}) => (
  <Wrapper data-testid="selector">
    <Select
      options={options}
      defaultValue={inputValue}
      value={value}
      isDisabled={disabled}
      placeholder={placeholder}
      isSearchable={searchable}
      isClearable={clearable}
      name={name}
      // We use inputId for aria concerns, and to target the react-select component with getByLabelText
      inputId={inputId || name}
      blurInputOnSelect={onBlurResetsInput}
      onMenuClose={() => onCloseResetsInput}
      onChange={onChange}
      onBlur={onBlur}
      onInputChange={onInputChange}
      onKeyDown={onInputKeyDown}
      openMenuOnClick={true}
      styles={customStyles}
      components={{
        DropdownIndicator: DropdownIndicator(dropdownIcon),
        Option: (oProps: any) => getOption({ ...oProps, optionDivider }, optionComponent),
        ClearIndicator,
        ValueContainer: (oProps: any) => getValueContainer(oProps, valueComponent),
        IndicatorSeparator: () => null
      }}
      {...props}
    />
  </Wrapper>
);

export default Selector;
