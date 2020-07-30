import React from 'react';
import styled from 'styled-components';
import { OptionProps } from 'react-select';
import isEmpty from 'lodash/isEmpty';

import { translateRaw } from '@translations';
import { Asset, ISwapAsset, TTicker, TUuid } from '@types';
import { AssetIcon, Typography, Selector } from '@components';
import { useEffectOnce } from '@vendor';

const SContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 14px 15px 14px 15px;
`;

interface ItemProps {
  uuid: TUuid;
  ticker: TTicker;
  name?: string;
  onClick?(): void;
}

export function AssetSelectorItem({ uuid, ticker, name, onClick }: ItemProps) {
  return (
    <SContainer
      {...(onClick ? { onPointerDown: onClick } : null)}
      data-testid={`asset-dropdown-option-${ticker}`}
    >
      <AssetIcon uuid={uuid} size={'1.5rem'} />
      <Typography bold={true} value={ticker} style={{ marginLeft: '10px' }} />
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

interface AssetSelectorProps<T> {
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
  useEffectOnce(() => {
    if (!isEmpty(assets) && isEmpty(selectedAsset)) {
      onSelect(assets[0]);
    }
  });

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
          const { ticker, name, uuid } = data;
          return (
            <AssetSelectorItem
              ticker={ticker}
              uuid={uuid}
              name={showOnlySymbol ? undefined : name}
              onClick={() => selectOption(data)}
            />
          );
        }}
        value={selectedAsset}
        valueComponent={({ value: { ticker, uuid, name } }) => {
          return (
            <AssetSelectorItem
              ticker={ticker}
              uuid={uuid}
              name={showOnlySymbol ? undefined : name}
            />
          );
        }}
        {...props}
      />
    </Wrapper>
  );
}

export default AssetSelector;
