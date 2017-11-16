import { isValidENSorEtherAddress } from 'libs/validators';
import { Query, SetTransactionField } from 'components/renderCbs';
import { SetToFieldAction } from 'actions/transaction';
import { AddressInput } from './AddressInput';
import { Address } from 'libs/units';
import React from 'react';

interface Props {
  to: string | null;
  setter(payload: SetToFieldAction['payload']): void;
}

//TODO: add ens resolving
class AddressField extends React.Component<Props, {}> {
  public componentDidMount() {
    const { to, setter } = this.props;
    if (to) {
      setter({ raw: to, value: Address(to) });
    }
  }

  public render() {
    return <AddressInput onChange={this.setAddress} />;
  }

  private setAddress = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    const validAddress = isValidENSorEtherAddress(value);
    this.props.setter({
      raw: value,
      value: validAddress ? Address(value) : null
    });
  };
}

const DefaultAddressField: React.SFC<{}> = props => (
  <SetTransactionField
    name="to"
    withFieldSetter={setter => (
      <Query
        params={['to']}
        withQuery={({ to }) => <AddressField {...{ ...props, to, setter }} />}
      />
    )}
  />
);

export { DefaultAddressField as AddressField };
/*
    <div className="row form-group">
      <div className="col-xs-11">
           </div>
            </div>
*/
