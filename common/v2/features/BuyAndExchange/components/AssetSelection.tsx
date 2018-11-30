import React, { Component } from 'react';
import { Field } from 'formik';

import { AssetOption } from '../types';
import './AssetSelection.scss';

enum Modes {
  Button,
  Screen
}

interface Props {
  name: string;
  assets: AssetOption[];
}

interface State {
  mode: Modes;
}

export default class AssetSelect extends Component<Props> {
  public state: State = {
    mode: Modes.Button
  };

  public render() {
    const { name, assets = [] } = this.props;
    const { mode } = this.state;

    return mode === Modes.Button ? (
      <button onClick={this.toggleMode}>ETH</button>
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
                <input type="text" placeholder="Search assets..." />
              </section>
            </section>
            <section className="AssetSelection-assets">
              {assets.map(asset => (
                <section className="AssetSelection-assets-asset">
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
}
