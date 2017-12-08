import { Query } from 'components/renderCbs';
import { setCurrentTo, TSetCurrentTo } from 'actions/transaction';
import { AddressInput } from './AddressInput';
import React from 'react';
import { connect } from 'react-redux';

interface DispatchProps {
  setCurrentTo: TSetCurrentTo;
}

interface OwnProps {
  to: string | null;
}

type Props = DispatchProps & DispatchProps & OwnProps;

//TODO: add ens resolving
class AddressFieldClass extends React.Component<Props, {}> {
  public componentDidMount() {
    // this 'to' parameter can be either token or actual field related
    const { to } = this.props;
    if (to) {
      this.props.setCurrentTo(to);
    }
  }

  public render() {
    return <AddressInput onChange={this.setAddress} />;
  }

  private setAddress = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.setCurrentTo(value);
  };
}

const AddressField = connect(null, { setCurrentTo })(AddressFieldClass);

const DefaultAddressField: React.SFC<{}> = () => (
  <Query params={['to']} withQuery={({ to }) => <AddressField to={to} />} />
);

export { DefaultAddressField as AddressField };
