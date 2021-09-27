import isEmpty from 'lodash/isEmpty';
import { OptionProps } from 'react-select';
import styled from 'styled-components';

import { AssetIcon, Box, Label, Selector, Text } from '@components';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';
import { Asset, ISwapAsset, TTicker, TUuid } from '@types';
import { useEffectOnce } from '@vendor';

interface ItemProps {
  uuid: TUuid;
  ticker: TTicker;
  showAssetIcon?: boolean;
  name?: string;
  paddingLeft?: string;
  onClick?(): void;
}

export function AssetSelectorItem({
  showAssetIcon = true,
  uuid,
  ticker,
  name,
  paddingLeft,
  onClick
}: ItemProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="row"
      padding={`11px 10px 11px ${paddingLeft || '0px'}`}
      {...(onClick ? { onPointerDown: onClick } : null)}
      data-testid={`asset-selector-option-${ticker}`}
    >
      {showAssetIcon && <AssetIcon uuid={uuid} size={'1.5rem'} />}
      <Text ml={showAssetIcon ? '15px' : '0px'} mb={'0px'}>
        {name ? `${ticker} - ${name}` : ticker}
      </Text>
    </Box>
  );
}

const Wrapper = styled.div<{ width?: string }>`
  width: ${(props: { width?: string }) => props.width ?? 'default'};
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
  width?: string;
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
  inputId = 'asset-selector',
  width,
  ...props
}: AssetSelectorProps<Asset | ISwapAsset>) {
  useEffectOnce(() => {
    if (!isEmpty(assets) && isEmpty(selectedAsset)) {
      onSelect(assets[0]);
    }
  });

  return (
    <Wrapper width={width}>
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
        optionComponent={({ data, selectOption }: OptionProps<TAssetOption, false>) => {
          const { ticker, name, uuid } = data;
          return (
            <AssetSelectorItem
              showAssetIcon={showAssetIcon}
              ticker={ticker}
              uuid={uuid}
              name={showAssetName && name}
              paddingLeft={'15px'}
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
              paddingLeft={SPACING.XS}
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
