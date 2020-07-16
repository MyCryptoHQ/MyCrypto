import React from 'react';
import styled from 'styled-components';
import { OptionProps } from 'react-select';

import { translateRaw } from '@translations';
import { Asset, ISwapAsset, TSymbol, TUuid } from '@types';
import { AssetIcon, Typography, Selector } from '@components';

const SContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 14px 15px 14px 15px;
`;

export interface ItemProps {
  uuid: TUuid;
  symbol: TSymbol;
  name?: string;
  onClick?(): void;
}

export function AssetSelectorItem({ uuid, symbol, name, onClick }: ItemProps) {
  return (
    <SContainer
      {...(onClick ? { onPointerDown: onClick } : null)}
      data-testid={`asset-dropdown-option-${symbol}`}
    >
      <AssetIcon uuid={uuid} size={'1.5rem'} />
      <Typography bold={true} value={symbol} style={{ marginLeft: '10px' }} />
      {name && <span>&nbsp; - &nbsp;</span>}
      <Typography value={name} />
    </SContainer>
  );
}

const Label = styled.label`
  font-size: 18px;
  width: 100%;
  line-height: 1;
  text-align: left;
  font-weight: normal;
  margin-bottom: 9px;
  color: ${(props) => props.theme.text};
`;

const Wrapper = styled('div')`
  width: ${(props: { fluid: boolean }) => (props.fluid ? '100%' : 'default')};
  min-width: 175px;
  .asset-dropdown-item {
    padding-top: 11px;
    padding-bottom: 11px;
  }
`;

export interface AssetSelectorProps<T> {
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

function AssetSelector({
  assets,
  selectedAsset,
  onSelect,
  label,
  showOnlySymbol = false,
  searchable = false,
  disabled = false,
  fluid = false,
  inputId = 'asset-selector',
  ...props
}: AssetSelectorProps<Asset | ISwapAsset>) {
  return (
    <Wrapper fluid={fluid}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <Selector<TAssetOption>
        inputId={inputId}
        name={label}
        placeholder={translateRaw('SEND_ASSETS_ASSET_SELECTION_PLACEHOLDER')}
        options={assets}
        disabled={disabled}
        searchable={searchable}
        onChange={(option: TAssetOption) => onSelect(option)}
        optionDivider={true}
        optionComponent={({ data, selectOption }: OptionProps<TAssetOption>) => {
          const { ticker, symbol, name, uuid } = data;
          const ref = ticker ? ticker : symbol;
          return (
            <AssetSelectorItem
              symbol={ref}
              uuid={uuid}
              name={showOnlySymbol ? undefined : name}
              onClick={() => selectOption(data)}
            />
          );
        }}
        value={selectedAsset}
        valueComponent={({ value: { ticker, uuid, symbol, name } }) => {
          const ref = (ticker ? ticker : symbol) as TSymbol;
          return (
            <AssetSelectorItem symbol={ref} uuid={uuid} name={showOnlySymbol ? undefined : name} />
          );
        }}
        {...props}
      />
    </Wrapper>
  );
}

export default AssetSelector;
