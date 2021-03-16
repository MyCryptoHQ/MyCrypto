import React from 'react';

import Select, {
  FocusEventHandler,
  InputActionMeta,
  OptionProps,
  OptionTypeBase,
  components as ReactSelectComponents,
  SelectComponentsConfig,
  Styles,
  ValueContainerProps
} from 'react-select';
import styled from 'styled-components';

import { COLORS, FONT_SIZE } from '@theme';

import Icon from './Icon';

interface SelectorProps<T extends OptionTypeBase> {
  options: T[];
  // We prefer controlled components so `value` is required prop. When it is `null`, React-Select will display the placeholder
  value: T | null | undefined;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  name?: string;
  optionComponent: React.ComponentType<OptionProps<T>>;
  valueComponent?: React.ComponentClass<{ value: T }> | React.StatelessComponent<{ value: T }>;
  inputId?: string;
  inputValue?: string;
  onCloseResetsInput?: boolean;
  onBlurResetsInput?: boolean;
  onBlur?: FocusEventHandler;
  optionDivider?: boolean;
  isClearable?: boolean;
  components?: SelectComponentsConfig<T>;
  getOptionLabel?(option: T): string;
  onChange?(option: T): void;
  onInputChange?(newValue: string, actionMeta: InputActionMeta): void;
  onInputKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
}

// Fixes weird placement issues for react-select
const Wrapper = styled('div')`
  cursor: pointer;
  &:hover {
    cursor: default;
  }
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

export const DropdownIndicatorWrapper = ReactSelectComponents.DropdownIndicator;
export const ClearIndicatorWrapper = ReactSelectComponents.ClearIndicator;

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
    padding: '0px'
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
  // If input is present in the field, it takes up 6px.
  valueContainer: (styles, state) => ({
    ...styles,
    paddingLeft: state.selectProps.isSearchable ? '4px' : '10px'
  })
};

const Selector: <T extends OptionTypeBase>(
  p: SelectorProps<T>
) => React.ReactElement<SelectorProps<T>> = ({
  options,
  value,
  disabled = false,
  placeholder,
  searchable = true,
  isClearable = false,
  name,
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
  components,
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
      isClearable={isClearable}
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
        DropdownIndicator: (props) => {
          const {
            selectProps: { menuIsOpen }
          } = props;
          return (
            <DropdownIndicatorWrapper {...props}>
              <Icon type="expandable" isExpanded={menuIsOpen} height="1em" fill="linkAction" />
            </DropdownIndicatorWrapper>
          );
        },
        Option: (oProps: any) => getOption({ ...oProps, optionDivider }, optionComponent),
        ValueContainer: (oProps: any) => getValueContainer(oProps, valueComponent),
        IndicatorSeparator: () => null,
        ...components
      }}
      {...props}
    />
  </Wrapper>
);

export default Selector;
