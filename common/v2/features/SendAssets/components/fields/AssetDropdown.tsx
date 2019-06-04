import React from 'react';
import { OptionComponentProps } from 'react-select';

import { translateRaw } from 'translations';
import { IAsset } from 'v2/types';
import { AssetSummary, Divider, Dropdown } from 'v2/components';

class AssetOption extends React.PureComponent<OptionComponentProps> {
  public render() {
    const { option, onSelect } = this.props;
    const { symbol, name } = option;
    return (
      <>
        <AssetSummary
          symbol={symbol}
          name={name}
          onClick={() => onSelect!(option, null)}
          selectable={true}
        />
        <Divider />
      </>
    );
  }
}

function AssetDropdown({ assets, name, value, onSelect }: Props<IAsset>) {
  return (
    <Dropdown
      name={name}
      placeholder={translateRaw('SEND_ASSETS_ASSET_SELECTION_PLACEHOLDER')}
      options={assets}
      onChange={(option: IAsset) => onSelect(option)}
      optionComponent={AssetOption}
      value={value}
      valueComponent={({ value: option }) => (
        <AssetSummary symbol={option.symbol} name={option.name} />
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
