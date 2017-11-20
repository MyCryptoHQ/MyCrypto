import React, { Component } from 'react';
import {
  SetDecimalMetaField,
  SetUnitMetaField,
  TokenQuery
} from 'components/renderCbs';
import { ConditionalUnitDropdown } from './components';
import { MergedToken } from 'selectors/wallet';
import { SetDecimalMetaAction, SetUnitMetaAction } from 'actions/transaction';

export const UnitDropDown: React.SFC<{}> = () => (
  <TokenQuery
    withQuery={({ token }) => (
      <SetDecimalMetaField
        withDecimalSetter={decimalSetter => (
          <SetUnitMetaField
            withUnitSetter={unitSetter => (
              <DefaultUnitDropDown
                decimalSetter={decimalSetter}
                unitSetter={unitSetter}
                token={token}
              />
            )}
          />
        )}
      />
    )}
  />
);

interface Props {
  token: MergedToken | undefined | null;
  decimalSetter(payload: SetDecimalMetaAction['payload']);
  unitSetter(payload: SetUnitMetaAction['payload']);
}

class DefaultUnitDropDown extends Component<Props, {}> {
  public componentWillMount() {
    const { token, decimalSetter, unitSetter } = this.props;
    if (token) {
      decimalSetter(token.decimal);
      unitSetter(token.symbol);
    }
  }
  public render() {
    const { decimalSetter, unitSetter } = this.props;
    return (
      <ConditionalUnitDropdown
        onDecimalChange={decimalSetter}
        onUnitChange={unitSetter}
      />
    );
  }
}
