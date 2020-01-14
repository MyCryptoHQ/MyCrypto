import React, { useState, useEffect } from 'react';
import { OptionComponentProps } from 'react-select';
import styled from 'styled-components';

import { translateRaw } from 'v2/translations';
import { Asset } from 'v2/types';
import { AssetSummary, Divider, Dropdown } from 'v2/components';

// Fixes weird placement issues for react-select
const DropdownContainer = styled('div')`
  .has-value > .Select-control > .Select-multi-value-wrapper > .Select-input:only-child {
    transform: translateY(0%);
    padding: 16px 15px 16px 15px;
    position: inherit;
  }
`;

class AssetOption extends React.PureComponent<OptionComponentProps> {
  public render() {
    const { option, onSelect } = this.props;
    const { ticker, name } = option;
    return (
      <>
        <AssetSummary
          symbol={ticker}
          name={name}
          onClick={() => onSelect!(option, null)}
          selectable={true}
        />
        <Divider />
      </>
    );
  }
}

function AssetDropdown({ assets, name, value, onSelect }: Props<Asset>) {
  const [filteredAssets, setFilteredAssets] = useState([] as Asset[]);
  useEffect(() => {
    setFilteredAssets(
      assets
        .filter(
          (asset, index) => assets.map(assetObj => assetObj.uuid).indexOf(asset.uuid) >= index
        )
        .map(asset => ({ label: asset.name, id: asset.uuid, ...asset }))
    ); /* Removes duplicates and maps to format accepted by react-select */
  }, []);
  return (
    <DropdownContainer>
      <Dropdown
        name={name}
        placeholder={translateRaw('SEND_ASSETS_ASSET_SELECTION_PLACEHOLDER')}
        options={filteredAssets}
        onChange={(option: Asset) => onSelect(option)}
        optionComponent={AssetOption}
        value={value && value.ticker ? value : undefined}
        valueComponent={({ value: option }) => (
          <AssetSummary symbol={option.ticker} name={option.name} />
        )}
      />
    </DropdownContainer>
  );
}

interface Props<T> {
  assets: T[];
  name: string;
  value: T;
  onSelect(option: T): void;
}

export default AssetDropdown;
