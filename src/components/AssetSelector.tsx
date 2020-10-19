import React from 'react';

import isEmpty from 'lodash/isEmpty';
import { OptionProps } from 'react-select';
import styled from 'styled-components';

import { AssetIcon, Box, Label, Selector, Typography } from '@components';
import { translateRaw } from '@translations';
import { Asset, ISwapAsset, TTicker, TUuid } from '@types';
import { useEffectOnce } from '@vendor';

interface ItemProps {
  uuid: TUuid;
  ticker: TTicker;
  showAssetIcon?: boolean;
  name?: string;
  onClick?(): void;
}

export function AssetSelectorItem({
  showAssetIcon = true,
  uuid,
  ticker,
  name,
  onClick
}: ItemProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="row"
      padding="11px 10px"
      {...(onClick ? { onPointerDown: onClick } : null)}
      data-testid={`asset-selector-option-${ticker}`}
    >
      {showAssetIcon && <AssetIcon uuid={uuid} size={'1.5rem'} />}
      <Typography
        bold={false}
        value={ticker}
        style={{ marginLeft: showAssetIcon ? '10px' : '0px' }}
      />
      {name && <span>&nbsp; - &nbsp;</span>}
      <Typography value={name} />
    </Box>
  );
}

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
  showAssetName?: boolean;
  showAssetIcon?: boolean;
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
  showAssetName = false,
  showAssetIcon = true,
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
        getOptionLabel={(option) => (showAssetName ? option.name : option.ticker)}
        optionDivider={true}
        optionComponent={({
          data,
          selectOption,
          innerProps: { onMouseMove, onMouseOver, ...newInnerProps }
        }: OptionProps<TAssetOption>) => {
          const { ticker, name, uuid } = data;
          return (
            <AssetSelectorItem
              {...newInnerProps}
              showAssetIcon={showAssetIcon}
              ticker={ticker}
              uuid={uuid}
              name={showAssetName && name}
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
              showAssetIcon={showAssetIcon}
              name={showAssetName ? name : undefined}
            />
          );
        }}
        {...props}
      />
    </Wrapper>
  );
}

export default AssetSelector;
