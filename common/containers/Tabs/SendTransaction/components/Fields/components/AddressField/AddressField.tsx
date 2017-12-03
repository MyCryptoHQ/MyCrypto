import { isValidENSorEtherAddress } from 'libs/validators';
import {
  Query,
  SetTransactionField,
  GetTransactionMetaFields,
  SetTokenToMetaField
} from 'components/renderCbs';
import { SetToFieldAction, SetTokenToMetaAction } from 'actions/transaction';
import { AddressInput } from './AddressInput';
import { Address } from 'libs/units';
import React from 'react';

interface Props {
  to: string | null;
  unit: string;
  toSetter(payload: SetToFieldAction['payload']): void;
  tokenToSetter(payload: SetTokenToMetaAction['payload']): void;
}

//TODO: add ens resolving
class AddressField extends React.Component<Props, {}> {
  public componentDidMount() {
    // this 'to' parameter can be either token or actual field related
    const { to, tokenToSetter, toSetter, unit } = this.props;
    if (to) {
      const valueToSet = { raw: to, value: Address(to) };
      const setter = unit === 'ether' ? toSetter : tokenToSetter;
      setter(valueToSet);
    }
  }

  public render() {
    return <AddressInput onChange={this.setAddress} />;
  }

  private setAddress = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    const { toSetter, tokenToSetter, unit } = this.props;
    const validAddress = isValidENSorEtherAddress(value);
    const valueToSet = {
      raw: value,
      value: validAddress ? Address(value) : null
    };
    const setter = unit === 'ether' ? toSetter : tokenToSetter;
    setter(valueToSet);
  };
}

const DefaultAddressField: React.SFC<{}> = () => (
  <SetTransactionField
    name="to"
    withFieldSetter={toSetter => (
      <SetTokenToMetaField
        withTokenToSetter={tokenToSetter => (
          <GetTransactionMetaFields
            withFieldValues={({ unit }) => (
              <Query
                params={['to']}
                withQuery={({ to }) => (
                  <AddressField
                    to={to}
                    toSetter={toSetter}
                    unit={unit}
                    tokenToSetter={tokenToSetter}
                  />
                )}
              />
            )}
          />
        )}
      />
    )}
  />
);

export { DefaultAddressField as AddressField };
