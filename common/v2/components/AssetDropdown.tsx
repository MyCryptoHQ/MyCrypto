import React from 'react';
import { OptionComponentProps } from 'react-select';
import styled from 'styled-components';
import isEmpty from 'ramda/src/isEmpty';

import { translateRaw } from '@translations';
import { Asset, TSymbol } from '@types';
import { AssetDropdownItem, Divider, Dropdown } from '@components';
import { useEffectOnce } from '@vendor';

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

// Class component to avoid 'Function components cannot be given refs' error
class AssetOption extends React.PureComponent<OptionComponentProps> {
  public render() {
    const { option, onSelect } = this.props;
    const { ticker, symbol, name, uuid } = option;
    const ref = ticker ? ticker : symbol;
    return (
      <>
        <AssetDropdownItem
          symbol={ref}
          uuid={uuid}
          name={name}
          onClick={() => onSelect && onSelect(option, null)}
        />
        <Divider />
      </>
    );
  }
}
// Class component to avoid 'Function components cannot be given refs' error
// tslint:disable:max-classes-per-file
class AssetOptionShort extends React.PureComponent<OptionComponentProps> {
  public render() {
    const { option, onSelect } = this.props;
    const { ticker, symbol, uuid } = option;
    const ref = ticker ? ticker : symbol;
    return (
      <>
        <AssetDropdownItem
          symbol={ref}
          uuid={uuid}
          onClick={() => onSelect && onSelect(option, null)}
        />
        <Divider />
      </>
    );
  }
}

function AssetDropdown({
  assets,
  selectedAsset,
  onSelect,
  showOnlyTicker = false,
  searchable = false,
  disabled = false,
  fluid = false,
  label
}: Props<Asset | { name: string; symbol: TSymbol }>) {
  useEffectOnce(() => {
    // Preselect first value when not provided
    if (isEmpty(selectedAsset) && onSelect && !isEmpty(assets)) {
      onSelect(assets[0]);
    }
  });

  return (
    <DropdownContainer fluid={fluid}>
      {label && <Label>{label}</Label>}
      <Dropdown
        placeholder={translateRaw('SEND_ASSETS_ASSET_SELECTION_PLACEHOLDER')}
        options={assets.map((a) => ({ value: showOnlyTicker ? a.symbol : a.name, ...a }))}
        disabled={disabled}
        searchable={searchable}
        onChange={(option: Asset) => onSelect && onSelect(option)}
        optionComponent={showOnlyTicker ? AssetOptionShort : AssetOption}
        value={!isEmpty(selectedAsset) && selectedAsset}
        valueComponent={({ value: option }) => {
          const { ticker, uuid, symbol, name } = option;
          const ref = ticker ? ticker : symbol;
          return (
            <AssetDropdownItem symbol={ref} uuid={uuid} name={!showOnlyTicker ? name : undefined} />
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
