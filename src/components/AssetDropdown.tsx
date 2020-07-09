import React from 'react';
import styled from 'styled-components';
import { OptionProps } from 'react-select';

import { translateRaw } from '@translations';
import { Asset, ISwapAsset, TSymbol } from '@types';
import { AssetDropdownItem, Divider, Dropdown } from '@components';

const Label = styled.label`
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
  min-width: 175px;
  .asset-dropdown-item {
    padding-top: 11px;
    padding-bottom: 11px;
  }
`;

export interface Props<T> {
  inputId?: string;
  assets: T[];
  selectedAsset: T | null;
  showOnlySymbol?: boolean;
  disabled?: boolean;
  fluid?: boolean;
  searchable?: boolean;
  label?: string;
  onSelect(option: T): void;
}

export type TAssetOption = Asset | ISwapAsset;

function AssetDropdown({
  assets,
  selectedAsset,
  onSelect,
  label,
  showOnlySymbol = false,
  searchable = false,
  disabled = false,
  fluid = false,
  inputId = 'asset-dropdown'
}: Props<Asset | ISwapAsset>) {
  return (
    <DropdownContainer fluid={fluid}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <Dropdown<TAssetOption>
        inputId={inputId}
        name={label}
        placeholder={translateRaw('SEND_ASSETS_ASSET_SELECTION_PLACEHOLDER')}
        options={assets}
        disabled={disabled}
        searchable={searchable}
        onChange={(option: TAssetOption) => onSelect(option)}
        optionComponent={({ data, selectOption }: OptionProps<TAssetOption>) => {
          const { ticker, symbol, name, uuid } = data;
          const ref = ticker ? ticker : symbol;
          return (
            <>
              <AssetDropdownItem
                symbol={ref}
                uuid={uuid}
                name={showOnlySymbol ? undefined : name}
                onClick={() => selectOption(data)}
              />
              <Divider />
            </>
          );
        }}
        value={selectedAsset}
        valueComponent={({ value: { ticker, uuid, symbol, name } }) => {
          const ref = (ticker ? ticker : symbol) as TSymbol;
          return (
            <AssetDropdownItem symbol={ref} uuid={uuid} name={showOnlySymbol ? undefined : name} />
          );
        }}
      />
    </DropdownContainer>
  );
}

export default AssetDropdown;
