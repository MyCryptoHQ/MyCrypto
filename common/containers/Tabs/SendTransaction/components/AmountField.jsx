// @flow
import React from 'react';
import translate from 'translations';
import UnitDropdown from './UnitDropdown';
import type { TokenBalance } from 'selectors/wallet';
import { getTokenBalances } from 'selectors/wallet';
import { getNetworkConfig } from 'selectors/config';
import type { NetworkConfig } from 'config/data';
import type { State as AppState } from 'reducers';
import { connect } from 'react-redux';
import type Big from 'big.js';

type Props = {
  value: string,
  unit: string,
  onChange?: (value: string, unit: string) => void
};

type ReduxProps = {
  balance: Big,
  tokenBalances: TokenBalance[],
  network: NetworkConfig,
  tokens: string[]
};

export class AmountField extends React.Component {
  props: Props & ReduxProps;

  render() {
    const { value, unit, onChange, tokens, network } = this.props;
    const isReadonly = !onChange;
    return (
      <div>
        <label>
          {translate('SEND_amount')}
        </label>
        <div className="input-group col-sm-11">
          <input
            className={`form-control ${isFinite(Number(value)) &&
            Number(value) > 0
              ? 'is-valid'
              : 'is-invalid'}`}
            type="text"
            placeholder={translate('SEND_amount_short')}
            value={value}
            disabled={isReadonly}
            onChange={isReadonly ? void 0 : this.onValueChange}
          />
          <UnitDropdown
            value={unit}
            etherName={network.unit}
            options={['ether'].concat(tokens)}
            onChange={isReadonly ? void 0 : this.onUnitChange}
          />
        </div>
        {!isReadonly &&
          <p>
            <a onClick={this.onSendEverything}>
              <span className="strong">
                {translate('SEND_TransferTotal')}
              </span>
            </a>
          </p>}
      </div>
    );
  }

  onUnitChange = (unit: string) => {
    if (this.props.onChange) {
      this.props.onChange(this.props.value, unit);
    }
  };

  onValueChange = (e: SyntheticInputEvent) => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value, this.props.unit);
    }
  };

  onSendEverything = () => {
    const { unit, balance, tokenBalances, onChange } = this.props;
    if (unit === 'ether') {
      // TODO sub gas for eth
      return onChange && onChange(balance.toString(), unit);
    }

    const token = tokenBalances.find(token => token.symbol === unit);
    if (!token) {
      return;
    }
    return onChange && onChange(token.balance.toString(), unit);
  };
}

function mapStateToProps(state: AppState) {
  const tokenBalances = getTokenBalances(state);
  const tokens = tokenBalances
    .filter(token => !token.balance.eq(0))
    .map(token => token.symbol)
    .sort();

  return {
    balance: state.wallet.balance,
    tokenBalances,
    tokens,
    network: getNetworkConfig(state)
  };
}

export default connect(mapStateToProps)(AmountField);
