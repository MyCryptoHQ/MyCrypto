import React, { Component } from 'react';
import { Field } from 'formik';

import { assetContainsFilter } from '../helpers';
import { AssetOption } from '../types';
import './AssetSelection.scss';

enum Modes {
  Button,
  Screen
}

interface Props {
  name: string;
  value: string;
  assets: AssetOption[];
  onChange(asset: AssetOption): void;
}

interface State {
  mode: Modes;
  filter: string;
}

export default class AssetSelect extends Component<Props> {
  public state: State = {
    mode: Modes.Button,
    filter: ''
  };

  public render() {
    const { name, value, assets = [] } = this.props;
    const { mode, filter } = this.state;

    return mode === Modes.Button ? (
      <button onClick={this.toggleMode}>{value}</button>
    ) : (
      <Field
        name={name}
        render={({ field, form }) => (
          <section className="AssetSelection">
            <section className="AssetSelection-head">
              <button onClick={this.toggleMode} className="AssetSelection-head-close">
                <i className="fa fa-close" />
              </button>
              <h4>Select Asset</h4>
              <section className="AssetSelection-head-filter">
                <i className="fa fa-search" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={filter}
                  onChange={this.handleFilterChange}
                />
              </section>
            </section>
            <section className="AssetSelection-assets">
              {assets.filter(asset => assetContainsFilter(filter, asset)).map(asset => (
                <section
                  className="AssetSelection-assets-asset"
                  onClick={() => this.handleAssetSelection(asset)}
                >
                  <img src={asset.logo} />
                  <p>{asset.ticker}</p>
                </section>
              ))}
            </section>
          </section>
        )}
      />
    );
  }

  private toggleMode = () =>
    this.setState((prevState: State) => ({
      mode: prevState.mode === Modes.Button ? Modes.Screen : Modes.Button
    }));

  private handleFilterChange = ({ target: { value: filter } }: React.ChangeEvent<any>) =>
    this.setState({
      filter
    });

  private handleAssetSelection = (asset: AssetOption) => {
    const { onChange } = this.props;
    onChange(asset);
    this.toggleMode();
  };
}
