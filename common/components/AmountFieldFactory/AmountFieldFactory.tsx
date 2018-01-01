import React, { Component } from 'react';
import { Query } from 'components/renderCbs';
import { setCurrentValue, TSetCurrentValue } from 'actions/transaction';
import { connect } from 'react-redux';
import { AmountInput } from './AmountInputFactory';
import { AppState } from 'reducers';

export interface CallbackProps {
  isValid: boolean;
  readOnly: boolean;
  currentValue:
    | AppState['transaction']['fields']['value']
    | AppState['transaction']['meta']['tokenValue'];
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

interface DispatchProps {
  setCurrentValue: TSetCurrentValue;
}

interface OwnProps {
  value: string | null;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

type Props = DispatchProps & OwnProps;

class AmountFieldClass extends Component<Props, {}> {
  public componentDidMount() {
    const { value } = this.props;
    if (value) {
      this.props.setCurrentValue(value);
    }
  }

  public render() {
    return <AmountInput onChange={this.setValue} withProps={this.props.withProps} />;
  }

  private setValue = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.setCurrentValue(value);
  };
}

const AmountField = connect(null, { setCurrentValue })(AmountFieldClass);

interface DefaultAmountFieldProps {
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const DefaultAmountField: React.SFC<DefaultAmountFieldProps> = ({ withProps }) => (
  <Query
    params={['value']}
    withQuery={({ value }) => <AmountField value={value} withProps={withProps} />}
  />
);

export { DefaultAmountField as AmountFieldFactory };
