import { gasPriceDefaults, HELP_ARTICLE } from 'config';
import throttle from 'lodash/throttle';
import React, { Component } from 'react';
import { DropdownShell, HelpLink } from 'components/ui';
import './GasPriceDropdown.scss';
import { SetGasLimitFieldAction } from 'actions/transaction';
import { gasPricetoBase } from 'libs/units';
import { AppState } from 'reducers';
import { getGasPrice } from 'selectors/transaction';
import { connect } from 'react-redux';

interface OwnProps {
  onChange(payload: SetGasLimitFieldAction['payload']): void;
}

interface StateProps {
  gasPrice: AppState['transaction']['fields']['gasPrice'];
}

type Props = OwnProps & StateProps;

class GasPriceDropdown extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.updateGasPrice = throttle(this.updateGasPrice, 50);
  }

  public render() {
    return (
      <DropdownShell
        color="white"
        size="smr"
        ariaLabel={`adjust gas price. current price is ${this.props.gasPrice.raw} gwei`}
        renderLabel={this.renderLabel}
        renderOptions={this.renderOptions}
      />
    );
  }

  private renderLabel = () => {
    return (
      <span>
        Gas Price<span className="hidden-xs">: {this.props.gasPrice.raw} Gwei</span>
      </span>
    );
  };

  private renderOptions = () => {
    return (
      <div className="GasPrice-dropdown-menu dropdown-menu dropdown-menu-right">
        <div className="GasPrice-header">
          <span>Gas Price</span>: {this.props.gasPrice.raw} Gwei
          <input
            type="range"
            value={this.props.gasPrice.raw}
            min={gasPriceDefaults.minGwei}
            max={gasPriceDefaults.maxGwei}
            onChange={this.handleGasPriceChange}
          />
          <p className="small col-xs-4 text-left GasPrice-padding-reset">Not So Fast</p>
          <p className="small col-xs-4 text-center GasPrice-padding-reset">Fast</p>
          <p className="small col-xs-4 text-right GasPrice-padding-reset">Fast AF</p>
          <p className="small GasPrice-description">
            Gas Price is the amount you pay per unit of gas.{' '}
            <code>TX fee = gas price * gas limit</code> & is paid to miners for including your TX in
            a block. Higher the gas price = faster transaction, but more expensive. Default is{' '}
            <code>21 GWEI</code>.
          </p>
          <p>
            <HelpLink article={HELP_ARTICLE.WHAT_IS_GAS}>Read more</HelpLink>
          </p>
        </div>
      </div>
    );
  };

  private updateGasPrice = (value: string) => {
    this.props.onChange({ raw: value, value: gasPricetoBase(parseInt(value, 10)) });
  };

  private handleGasPriceChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.updateGasPrice(e.currentTarget.value);
  };
}

const mapStateToProps = (state: AppState): StateProps => ({ gasPrice: getGasPrice(state) });

export default connect(mapStateToProps)(GasPriceDropdown);
