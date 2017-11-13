import { isValidENSorEtherAddress } from 'libs/validators';
import { Query } from 'components/renderCbs';
import { AddressInput } from './AddressInput';
import { Address } from 'libs/units';
import React from 'react';

interface Props extends DefaultProps {
  to: string | null;
}

interface State {
  address: string;
  validAddress: boolean;
}
//TODO: add ens resolving
export class AddressField extends React.Component<Props, State> {
  public componentDidMount() {
    const { to, onChange } = this.props;

    if (to) {
      onChange(Address(to));
    }

    const state: State = to
      ? { address: to, validAddress: true }
      : { address: '', validAddress: false };

    this.setState(state);
  }

  public render() {
    return (
      <AddressInput
        value={this.state.address}
        validAddress={this.state.validAddress}
        onChange={this.setAddress}
      />
    );
  }

  private setAddress = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    const validAddress = isValidENSorEtherAddress(value);
    this.props.onChange(validAddress ? Address(value) : null);
    this.setState({ address: value, validAddress });
  };
}

interface DefaultProps {
  placeholder: string;
  ensAddress: string | null;
  onChange(to: Address | null): void;
}

export const DefaultAddressField: React.SFC<DefaultProps> = props => (
  <Query
    params={['to']}
    withQuery={({ to }) => <AddressField {...{ ...props, to }} />}
  />
);

/*
    <div className="row form-group">
      <div className="col-xs-11">
           </div>
            </div>
*/
