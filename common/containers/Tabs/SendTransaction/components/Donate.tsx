import { donationAddressMap } from 'config';
import React from 'react';
import translate from 'translations';

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
        <p>{translate('SIDEBAR_DONATION')}</p>
        <a className="btn btn-primary btn-block" onClick={this.onClick}>
          {translate('SIDEBAR_DONATE')}
        </a>
        {this.state.clicked && (
          <div className="text-success text-center marg-v-sm">{translate('SIDEBAR_THANKS')}</div>
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
