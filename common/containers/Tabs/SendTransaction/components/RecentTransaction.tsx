import React from 'react';
import moment from 'moment';

import { NetworkConfig } from 'types/network';
import { SavedTransaction } from 'types/transactions';
import { Wei } from 'libs/units';
import { Identicon, Address, UnitDisplay } from 'components/ui';
import './RecentTransaction.scss';

interface Props {
  tx: SavedTransaction;
  network: NetworkConfig;
  onClick(hash: string): void;
}

export default class RecentTransaction extends React.Component<Props> {
  public render() {
    const { tx, network } = this.props;

    return (
      <tr className="RecentTx" key={tx.time} onClick={this.handleClick}>
        <td className="RecentTx-to">
          <Identicon address={tx.to} />
          <Address address={tx.to} />
        </td>
        <td className="RecentTx-value">
          <UnitDisplay
            value={Wei(tx.value)}
            unit="ether"
            symbol={network.unit}
            checkOffline={false}
          />
        </td>
        <td className="RecentTx-time">{moment(tx.time).format('l LT')}</td>
        <td className="RecentTx-arrow">
          <i className="fa fa-chevron-right" />
        </td>
      </tr>
    );
  }

  private handleClick = () => {
    this.props.onClick(this.props.tx.hash);
  };
}
