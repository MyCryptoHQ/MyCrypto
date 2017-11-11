import React from 'react';
import {
  NonceInput,
  AddressField,
  AmountField,
  DataField,
  GasField
} from './components';

const Fields: React.SFC<any> = () => (
  <div>
    <AddressField
      placeholder={donationAddressMap.ETH}
      value={this.state.to}
      onChange={readOnly ? null : this.onAddressChange}
    />
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
    <GasField
      readOnly={readonly}
      value={gasLimit}
      onChange={this.onGasChange}
    />
    {(offline || forceOffline) && (
      <div>
        <NonceInput
          value={nonce}
          onChange={this.onNonceChange}
          placeholder={'0'}
        />
      </div>
    )}
    {unit === 'ether' && (
      <DataField
        value={data}
        onChange={readOnly ? void 0 : this.onDataChange}
      />
    )}
  </div>
);
