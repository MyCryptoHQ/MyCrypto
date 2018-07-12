import React from 'react';
import { connect } from 'react-redux';

import { ICurrentTo } from 'features/types';
import { transactionActions } from 'features/transaction';
import { Query } from 'components/renderCbs';
import { AddressInputFactory } from './AddressInputFactory';
import './AddressFieldFactory.scss';

interface DispatchProps {
  setCurrentTo: transactionActions.TSetCurrentTo;
}

interface OwnProps {
  to: string | null;
  isSelfAddress?: boolean;
  showLabelMatch?: boolean;
  showIdenticon?: boolean;
  value?: string;
  dropdownThreshold?: number;
  onChangeOverride?: (ev: React.FormEvent<HTMLInputElement>) => void;
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
    const {
      isSelfAddress,
      showLabelMatch,
      withProps,
      showIdenticon,
      onChangeOverride,
      value,
      dropdownThreshold
    } = this.props;

    return (
      <div className="AddressField">
        <AddressInputFactory
          isSelfAddress={isSelfAddress}
          showLabelMatch={showLabelMatch}
          withProps={withProps}
          showIdenticon={showIdenticon}
          onChangeOverride={onChangeOverride}
          value={value}
          dropdownThreshold={dropdownThreshold}
          isFocused={this.state.isFocused}
          onChange={this.setAddress}
          onFocus={this.focus}
          onBlur={this.setBlurTimeout}
        />
      </div>
    );
  }

  private focus = () => this.setState({ isFocused: true });

  private blur = () => this.setState({ isFocused: false });

  private setAddress = (ev: React.FormEvent<HTMLInputElement>) => {
    const { onChangeOverride, setCurrentTo } = this.props;
    const { value } = ev.currentTarget;

    onChangeOverride ? onChangeOverride(ev) : setCurrentTo(value);
  };

  private setBlurTimeout = () => (this.goingToBlur = window.setTimeout(this.blur, 150));
}

const AddressFieldFactory = connect(null, { setCurrentTo: transactionActions.setCurrentTo })(
  AddressFieldFactoryClass
);

interface DefaultAddressFieldProps {
  isSelfAddress?: boolean;
  showLabelMatch?: boolean;
  showIdenticon?: boolean;
  value?: string;
  dropdownThreshold?: number;
  onChangeOverride?: (ev: React.FormEvent<HTMLInputElement>) => void;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const DefaultAddressField: React.SFC<DefaultAddressFieldProps> = ({
  isSelfAddress,
  showLabelMatch,
  showIdenticon,
  value,
  withProps,
  onChangeOverride,
  dropdownThreshold
}) => (
  <Query
    params={['to']}
    withQuery={({ to }) => (
      <AddressFieldFactory
        to={to}
        isSelfAddress={isSelfAddress}
        showLabelMatch={showLabelMatch}
        withProps={withProps}
        showIdenticon={showIdenticon}
        onChangeOverride={onChangeOverride}
        value={value}
        dropdownThreshold={dropdownThreshold}
      />
    )}
  />
);

export { DefaultAddressField as AddressFieldFactory };
