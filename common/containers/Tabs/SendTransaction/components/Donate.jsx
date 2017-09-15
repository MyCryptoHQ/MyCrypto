// @flow
import React from 'react';
import translate from 'translations';

import { donationAddressMap } from 'config/data';

type Props = {
  onDonate: (address: string, amount: string, unit: string) => void
};

type State = {
  clicked: boolean
};

export default class Donate extends React.Component<Props, State> {
  state = {
    clicked: false
  };

  render() {
    return (
      <div className="well">
        <p>
          {translate('sidebar_donation')}
        </p>
        <a className="btn btn-primary btn-block" onClick={this.onClick}>
          {translate('sidebar_donate')}
        </a>
        {this.state.clicked &&
          <div className="text-success text-center marg-v-sm">
            {translate('sidebar_thanks')}
          </div>}
      </div>
    );
  }

  onClick = () => {
    // FIXME move to config
    this.props.onDonate(donationAddressMap.ETH, '1', 'ETH');

    this.setState({ clicked: true });
  };
}
