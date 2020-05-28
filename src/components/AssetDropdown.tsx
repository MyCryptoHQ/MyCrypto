import React, { FC } from 'react';
import styled from 'styled-components';
import isEmpty from 'ramda/src/isEmpty';
import { OptionProps } from 'react-select';

import { translateRaw } from '@translations';
import { Asset, TSymbol } from '@types';
import { AssetDropdownItem, Divider, Dropdown } from '@components';
import { useEffectOnce } from '@vendor';
import { ISwapAsset } from '@features/SwapAssets/types';
import { SPACING } from '@theme';

const Label = styled.div`
  font-size: 18px;
  width: 100%;
  line-height: 1;
  text-align: left;
  font-weight: normal;
  margin-bottom: 9px;
  color: ${(props) => props.theme.text};
`;

const DropdownContainer = styled('div')`
  width: ${(props: { fluid: boolean }) => (props.fluid ? '100%' : 'default')};
`;

type AssetDropdownType = Asset & { name: string; symbol: TSymbol };

const AssetOption: FC<OptionProps<AssetDropdownType>> = (props) => {
  const { data, selectOption } = props;
  const { ticker, symbol, name, uuid } = data as Asset;
  const ref = ticker ? ticker : symbol;
  return (
    <>
      <AssetDropdownItem
        symbol={ref as TSymbol}
        uuid={uuid}
        name={name}
        onClick={() => selectOption && selectOption(data)}
      />
      <Divider />
    </>
  );
};

const AssetOptionShort: FC<OptionProps<AssetDropdownType>> = (props) => {
  const { data, selectOption } = props;
  const { ticker, symbol, uuid } = data as Asset;
  const ref = ticker ? ticker : symbol;
  return (
    <>
      <AssetDropdownItem
        symbol={ref as TSymbol}
        uuid={uuid}
        onClick={() => selectOption && selectOption(data)}
      />
      <Divider />
    </>
  );
};

function AssetDropdown({
  assets,
  selectedAsset,
  onSelect,
  showOnlyTicker = false,
  searchable = false,
  disabled = false,
  fluid = false,
  label
}: Props<Asset | ISwapAsset>) {
  useEffectOnce(() => {
    // Preselect first value when not provided
    if (isEmpty(selectedAsset) && onSelect && !isEmpty(assets)) {
      onSelect(assets[0]);
    }
  });

  return (
    <DropdownContainer fluid={fluid}>
      {label && <Label>{label}</Label>}
      <Dropdown<AssetDropdownType>
        placeholder={translateRaw('SEND_ASSETS_ASSET_SELECTION_PLACEHOLDER')}
        options={
          assets.map((a) => ({
            value: showOnlyTicker ? a.symbol : a.name,
            ...a
          })) as AssetDropdownType[]
        }
        disabled={disabled}
        searchable={searchable}
        onChange={(option) => onSelect && onSelect(option)}
        optionComponent={showOnlyTicker ? AssetOptionShort : AssetOption}
        value={
          (!isEmpty(selectedAsset) ? selectedAsset : undefined) as AssetDropdownType | undefined
        }
        valueComponent={({ value }) => {
          const { ticker, uuid, symbol, name } = value;
          const ref = ticker ? ticker : symbol;
          return (
            <AssetDropdownItem
              symbol={ref as TSymbol}
              uuid={uuid}
              name={!showOnlyTicker ? name : undefined}
              paddingLeft={SPACING.XS}
            />
          );
        }}
      />
    </DropdownContainer>
  );
}

export interface Props<T> {
  assets: T[];
  selectedAsset?: T;
  showOnlyTicker?: boolean;
  disabled?: boolean;
  fluid?: boolean;
  searchable?: boolean;
  label?: string;
  onSelect?(option: T): void;
}

export default AssetDropdown;
