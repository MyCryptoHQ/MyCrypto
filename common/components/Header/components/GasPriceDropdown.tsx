import { gasPriceDefaults } from 'config/data';
import throttle from 'lodash/throttle';
import React, { Component } from 'react';
import DropdownShell from 'components/ui/DropdownShell';
import './GasPriceDropdown.scss';

interface Props {
  value: number;
  onChange(gasPrice: number): void;
}

export default class GasPriceDropdown extends Component<Props, {}> {
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
    return `Gas Price: ${this.props.value} Gwei`;
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
          <p className="small col-xs-4 text-left GasPrice-padding-reset">
            Not So Fast
          </p>
          <p className="small col-xs-4 text-center GasPrice-padding-reset">
            Fast
          </p>
          <p className="small col-xs-4 text-right GasPrice-padding-reset">
            Fast AF
          </p>
          <p className="small GasPrice-description">
            Gas Price is the amount you pay per unit of gas.{' '}
            <code>TX fee = gas price * gas limit</code> & is paid to miners for
            including your TX in a block. Higher the gas price = faster
            transaction, but more expensive. Default is <code>21 GWEI</code>.
          </p>
          <p>
            {/* TODO: maybe not hardcode a link? :) */}
            <a
              href="https://myetherwallet.groovehq.com/knowledge_base/topics/what-is-gas"
              target="_blank"
            >
              Read more
            </a>
          </p>
        </div>
      </div>
    );
  };

  private updateGasPrice = (value: string) => {
    this.props.onChange(parseInt(value, 10));
  };

  private handleGasPriceChange = (
    e: React.SyntheticEvent<HTMLInputElement>
  ) => {
    this.updateGasPrice((e.target as HTMLInputElement).value);
  };
}
