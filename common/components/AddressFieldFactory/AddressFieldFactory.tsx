import { Query } from 'components/renderCbs';
import { setCurrentTo, TSetCurrentTo } from 'actions/transaction';
import { AddressInputFactory } from './AddressInputFactory';
import AddressFieldDropdown from './AddressFieldDropdown';
import React from 'react';
import { connect } from 'react-redux';
import { ICurrentTo } from 'selectors/transaction';
import './AddressFieldFactory.scss';

interface DispatchProps {
  setCurrentTo: TSetCurrentTo;
}

interface OwnProps {
  to: string | null;
  isSelfAddress?: boolean;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

interface State {
  isFocused: boolean;
}

export interface CallbackProps {
  isValid: boolean;
  readOnly: boolean;
  currentTo: ICurrentTo;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
  onFocus(ev: React.FormEvent<HTMLInputElement>): void;
  onBlur(ev: React.FormEvent<HTMLInputElement>): void;
}

type Props = DispatchProps & OwnProps;

class AddressFieldFactoryClass extends React.Component<Props> {
  public state: State = {
    isFocused: false
  };

  public componentDidMount() {
    // this 'to' parameter can be either token or actual field related
    const { to } = this.props;
    if (to) {
      this.props.setCurrentTo(to);
    }
  }

  public render() {
    const { isFocused } = this.state;

    // Allow the click event on a dropdown item to process before hiding the dropdown.
    const onBlur = () => setTimeout(this.blur, 150);

    return (
      <div className="AddressField">
        <AddressInputFactory
          isSelfAddress={this.props.isSelfAddress}
          onChange={this.setAddress}
          onFocus={this.focus}
          onBlur={onBlur}
          withProps={this.props.withProps}
        />
        {isFocused && <AddressFieldDropdown onSelect={this.setAddress} />}
      </div>
    );
  }

  private focus = () => this.setState({ isFocused: true });

  private blur = () => this.setState({ isFocused: false });

  private setAddress = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.setCurrentTo(value);
  };
}

const AddressFieldFactory = connect(null, { setCurrentTo })(AddressFieldFactoryClass);

interface DefaultAddressFieldProps {
  isSelfAddress?: boolean;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const DefaultAddressField: React.SFC<DefaultAddressFieldProps> = ({ isSelfAddress, withProps }) => (
  <Query
    params={['to']}
    withQuery={({ to }) => (
      <AddressFieldFactory to={to} isSelfAddress={isSelfAddress} withProps={withProps} />
    )}
  />
);

export { DefaultAddressField as AddressFieldFactory };
