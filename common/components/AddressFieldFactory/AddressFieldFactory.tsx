import { Query } from 'components/renderCbs';
import { setCurrentTo, TSetCurrentTo } from 'actions/transaction';
import { AddressInputFactory } from './AddressInputFactory';
import React from 'react';
import { connect } from 'react-redux';
import { ICurrentTo } from 'selectors/transaction';

interface DispatchProps {
  setCurrentTo: TSetCurrentTo;
}

interface OwnProps {
  to: string | null;
  isSelfAddress?: boolean;
  chainId: number;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

export interface CallbackProps {
  isValid: boolean;
  readOnly: boolean;
  currentTo: ICurrentTo;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

type Props = DispatchProps & OwnProps;

class AddressFieldFactoryClass extends React.Component<Props> {
  public componentDidMount() {
    // this 'to' parameter can be either token or actual field related
    const { to, chainId } = this.props;
    if (to) {
      this.props.setCurrentTo({ raw: to, chainId: chainId });
    }
  }

  public render() {
    return (
      <AddressInputFactory
        isSelfAddress={this.props.isSelfAddress}
        onChange={this.setAddress}
        withProps={this.props.withProps}
      />
    );
  }

  private setAddress = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;

    this.props.setCurrentTo({ raw: value, chainId: this.props.chainId });
  };
}

const AddressFieldFactory = connect(null, { setCurrentTo })(AddressFieldFactoryClass);

interface DefaultAddressFieldProps {
  isSelfAddress?: boolean;
  chainId: number;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const DefaultAddressField: React.SFC<DefaultAddressFieldProps> = ({
  isSelfAddress,
  chainId,
  withProps
}) => (
  <Query
    params={['to']}
    withQuery={({ to }) => (
      <AddressFieldFactory
        to={to}
        isSelfAddress={isSelfAddress}
        withProps={withProps}
        chainId={chainId}
      />
    )}
  />
);

export { DefaultAddressField as AddressFieldFactory };
