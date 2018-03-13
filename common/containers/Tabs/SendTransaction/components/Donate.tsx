import { donationAddressMap } from 'config';
import React from 'react';
import { translateRaw } from 'translations';

interface Props {
  onDonate(address: string, amount: string, unit: string): void;
}
interface State {
  clicked: boolean;
}
export default class Donate extends React.Component<Props, State> {
  public state = {
    clicked: false
  };
  public render() {
    return (
      <div className="well">
        <p>{translateRaw('sidebar_donation')}</p>
        <a className="btn btn-primary btn-block" onClick={this.onClick}>
          {translateRaw('sidebar_donate')}
        </a>
        {this.state.clicked && (
          <div className="text-success text-center marg-v-sm">{translateRaw('sidebar_thanks')}</div>
        )}
      </div>
    );
  }

  public onClick = () => {
    // FIXME move to config
    this.props.onDonate(donationAddressMap.ETH, '1', 'ETH');

    this.setState({ clicked: true });
  };
}
