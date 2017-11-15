import React from 'react';
import {
  NonceField,
  AddressField,
  AmountField,
  DataField,
  GasField
} from './components';

const Fields: React.SFC<any> = () => (
  <div>
    <AddressField />
    <AmountField
      unit={unit}
      decimal={decimal}
      balance={balance}
      tokens={this.props.tokenBalances
        .filter(token => !token.balance.eqn(0))
        .map(token => token.symbol)
        .sort()}
      onAmountChange={this.onAmountChange}
      readOnly={readOnly}
      onUnitChange={this.onUnitChange}
    />
    <GasField />
    <NonceField />
    <DataField withData={} unit={} />
  </div>
);
