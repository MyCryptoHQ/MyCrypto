import { gasPriceDefaults, knowledgeBaseURL } from 'config/data';
import throttle from 'lodash/throttle';
import React, { Component } from 'react';
import DropdownShell from 'components/ui/DropdownShell';
import './GasPriceDropdown.scss';
import { SetGasLimitFieldAction } from 'actions/transaction';
import { gasPricetoBase } from 'libs/units';

interface Props {
  value: string;
  onChange(payload: SetGasLimitFieldAction['payload']): void;
}

export default class GasPriceDropdown extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.updateGasPrice = throttle(this.updateGasPrice, 50);
  }

  public render() {
    const { value } = this.props;
    return (
      <DropdownShell
        color="white"
        size="smr"
        ariaLabel={`adjust gas price. current price is ${value} gwei`}
        renderLabel={this.renderLabel}
        renderOptions={this.renderOptions}
      />
    );
  }

  private renderLabel = () => {
    return (
      <span>
        Gas Price<span className="hidden-xs">: {this.props.value} Gwei</span>
      </span>
    );
  };

  private renderOptions = () => {
    const { value } = this.props;
    return (
      <div className="GasPrice-dropdown-menu dropdown-menu dropdown-menu-right">
        <div className="GasPrice-header">
          <span>Gas Price</span>: {value} Gwei
          <input
            type="range"
            value={value}
            min={gasPriceDefaults.gasPriceMinGwei}
            max={gasPriceDefaults.gasPriceMaxGwei}
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
            <a
              href={`${knowledgeBaseURL}/gas/what-is-gas-ethereum`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more
            </a>
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
