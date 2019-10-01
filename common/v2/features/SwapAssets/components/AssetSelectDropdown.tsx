import React, { useEffect } from 'react';
import styled from 'styled-components';

import { AssetSummary, Divider, Dropdown } from 'v2/components';
import { ISwapAsset } from '../types';

const Label = styled.div`
  font-size: 18px;
  width: 100%;
  line-height: 1;
  text-align: left;
  font-weight: normal;
  margin-bottom: 9px;
  color: ${props => props.theme.text};
`;

interface DropdownWrapperProps {
  fluid?: boolean;
}

const DropdownWrapper = styled.div<DropdownWrapperProps>`
  display: flex;
  flex-direction: column;
  width: ${props => (props.fluid ? '100%' : 'default')};
  margin-bottom: 15px;
`;

interface Props {
  assets: ISwapAsset[];
  selectedAsset?: ISwapAsset;
  disabled?: boolean;
  label?: string;
  fluid?: boolean;
  showOnlyTicker?: boolean;
  onChange?(asset: ISwapAsset): void;
}

interface IAssetOptionProps {
  option: ISwapAsset;
  onSelect(asset: ISwapAsset): void;
}

function AssetOption(props: IAssetOptionProps) {
  const { option, onSelect } = props;
  const { name, symbol } = option;
  return (
    <>
      <AssetSummary
        symbol={symbol}
        name={name}
        onClick={() => onSelect(option)}
        selectable={true}
      />
      <Divider />
    </>
  );
}

function AssetOptionShort(props: IAssetOptionProps) {
  const { option, onSelect } = props;
  const { symbol } = option;
  return (
    <>
      <AssetSummary symbol={symbol} onClick={() => onSelect(option)} selectable={true} />
      <Divider />
    </>
  );
}

interface IOption {
  value: ISwapAsset;
}

function AssetSelectDropdown({
  assets,
  selectedAsset,
  onChange,
  showOnlyTicker,
  label,
  disabled,
  fluid
}: Props) {
  useEffect(() => {
    if (!selectedAsset && onChange) {
      onChange(assets[0]);
    }
  }, []);

  return (
    <DropdownWrapper fluid={fluid}>
      {label && <Label>{label}</Label>}
      <Dropdown
        options={assets}
        value={selectedAsset && selectedAsset}
        onChange={onChange}
        disabled={disabled}
        optionComponent={showOnlyTicker ? AssetOptionShort : AssetOption}
        valueComponent={({ value: option }: IOption) => (
          <AssetSummary symbol={option.symbol} name={!showOnlyTicker ? option.name : undefined} />
        )}
      />
    </DropdownWrapper>
  );
}

export default AssetSelectDropdown;
