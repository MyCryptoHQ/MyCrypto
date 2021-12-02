import React from 'react';

import { SPACING } from '@theme';

import Box from './Box';
import { Body } from './NewTypography';
import Selector from './Selector';

export interface OptionType<T> {
  label: string;
  value: T;
}

const Option = <T,>({
  value,
  selectOption,
  paddingLeft = '0px'
}: {
  value: OptionType<T>;
  selectOption?(option: OptionType<T>): void;
  paddingLeft?: string;
}) => {
  const handleClick = () => selectOption && selectOption(value);

  return (
    <Box
      padding="12px"
      pl={paddingLeft}
      variant="rowAlign"
      data-testid={`select-${value.label}`}
      onClick={handleClick}
    >
      <Body m="0">{value.label}</Body>
    </Box>
  );
};

export const TextSelector = <T,>({
  options,
  value,
  onChange
}: {
  options: OptionType<T>[];
  value: OptionType<T>;
  onChange(value: OptionType<T>): void;
}) => {
  const handleChange = (value: OptionType<T>) => onChange(value);

  return (
    <Selector<OptionType<T>>
      name="text-selector"
      value={value}
      options={options}
      onChange={handleChange}
      searchable={false}
      optionComponent={({ data, selectOption }) => (
        <Option value={data} selectOption={selectOption} paddingLeft={SPACING.SM} />
      )}
      valueComponent={({ value }) => <Option value={value} />}
    />
  );
};
