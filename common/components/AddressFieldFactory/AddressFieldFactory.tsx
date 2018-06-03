import { Query } from 'components/renderCbs';
import { setCurrentTo, TSetCurrentTo } from 'actions/transaction';
import { AddressInputFactory } from './AddressInputFactory';
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
  showLabelMatch?: boolean;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

interface State {
  isFocused: boolean;
}

export interface CallbackProps {
  isValid: boolean;
  isLabelEntry: boolean;
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

  private goingToBlur: number | null = null;

  public componentDidMount() {
    // this 'to' parameter can be either token or actual field related
    const { to } = this.props;
    if (to) {
      this.props.setCurrentTo(to);
    }
  }

  public componentWillUnmount() {
    if (this.goingToBlur) {
      window.clearTimeout(this.goingToBlur);
    }
  }

  public render() {
    return (
      <div className="AddressField">
        <AddressInputFactory
          isSelfAddress={this.props.isSelfAddress}
          showLabelMatch={this.props.showLabelMatch}
          isFocused={this.state.isFocused}
          onChange={this.setAddress}
          onFocus={this.focus}
          onBlur={this.setBlurTimeout}
          withProps={this.props.withProps}
        />
      </div>
    );
  }

  private focus = () => this.setState({ isFocused: true });

  private blur = () => this.setState({ isFocused: false });

  private setAddress = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.setCurrentTo(value);
  };

  private setBlurTimeout = () => (this.goingToBlur = window.setTimeout(this.blur, 150));
}

const AddressFieldFactory = connect(null, { setCurrentTo })(AddressFieldFactoryClass);

interface DefaultAddressFieldProps {
  isSelfAddress?: boolean;
  showLabelMatch?: boolean;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const DefaultAddressField: React.SFC<DefaultAddressFieldProps> = ({
  isSelfAddress,
  showLabelMatch,
  withProps
}) => (
  <Query
    params={['to']}
    withQuery={({ to }) => (
      <AddressFieldFactory
        to={to}
        isSelfAddress={isSelfAddress}
        showLabelMatch={showLabelMatch}
        withProps={withProps}
      />
    )}
  />
);

export { DefaultAddressField as AddressFieldFactory };
