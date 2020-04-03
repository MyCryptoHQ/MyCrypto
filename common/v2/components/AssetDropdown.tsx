import React from 'react';
import { OptionComponentProps } from 'react-select';
import styled from 'styled-components';
import * as R from 'ramda';

import { translateRaw } from 'v2/translations';
import { Asset, TSymbol } from 'v2/types';
import { AssetDropdownItem, Divider, Dropdown } from 'v2/components';
import { useEffectOnce } from 'v2/vendor';

const Label = styled.div`
  font-size: 18px;
  width: 100%;
  line-height: 1;
  text-align: left;
  font-weight: normal;
  margin-bottom: 9px;
  color: ${props => props.theme.text};
`;

const DropdownContainer = styled('div')`
  width: ${(props: { fluid: boolean }) => (props.fluid ? '100%' : 'default')};
`;

// Class component to avoid 'Function components cannot be given refs' error
class AssetOption extends React.PureComponent<OptionComponentProps> {
  public render() {
    const { option, onSelect } = this.props;
    const { ticker, symbol, name } = option;
    const ref = ticker ? ticker : symbol;
    return (
      <>
        <AssetDropdownItem
          symbol={ref}
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
    const { ticker, symbol } = option;
    const ref = ticker ? ticker : symbol;
    return (
      <>
        <AssetDropdownItem symbol={ref} onClick={() => onSelect && onSelect(option, null)} />
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
    if (R.isEmpty(selectedAsset) && onSelect && !R.isEmpty(assets)) {
      onSelect(assets[0]);
    }
  });

  return (
    <DropdownContainer fluid={fluid}>
      {label && <Label>{label}</Label>}
      <Dropdown
        placeholder={translateRaw('SEND_ASSETS_ASSET_SELECTION_PLACEHOLDER')}
        options={assets.map(a => ({ value: showOnlyTicker ? a.symbol : a.name, ...a }))}
        disabled={disabled}
        searchable={searchable}
        onChange={(option: Asset) => onSelect && onSelect(option)}
        optionComponent={showOnlyTicker ? AssetOptionShort : AssetOption}
        value={!R.isEmpty(selectedAsset) && selectedAsset}
        valueComponent={({ value: option }) => {
          const { ticker, symbol, name } = option;
          const ref = ticker ? ticker : symbol;
          return <AssetDropdownItem symbol={ref} name={!showOnlyTicker ? name : undefined} />;
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
