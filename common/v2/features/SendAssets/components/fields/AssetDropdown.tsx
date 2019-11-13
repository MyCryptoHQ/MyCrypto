import React from 'react';
import { OptionComponentProps } from 'react-select';

import { translateRaw } from 'v2/translations';
import { Asset } from 'v2/types';
import { AssetSummary, Divider, Dropdown } from 'v2/components';

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
  const filteredAssets: Asset[] = assets.filter(
    (asset, index) => assets.map(assetObj => assetObj.uuid).indexOf(asset.uuid) >= index
  ); /* Removes duplicates */
  return (
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
  );
}

interface Props<T> {
  assets: T[];
  name: string;
  value: T;
  onSelect(option: T): void;
}

export default AssetDropdown;
