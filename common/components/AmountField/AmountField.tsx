import React, { Component } from 'react';
import { Query } from 'components/renderCbs';
import { setCurrentValue, TSetCurrentValue } from 'actions/transaction';
import { connect } from 'react-redux';
import { AmountInput } from './AmountInput';

interface DispatchProps {
  setCurrentValue: TSetCurrentValue;
}

interface OwnProps {
  value: string | null;
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
    return <AmountInput onChange={this.setValue} />;
  }

  private setValue = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.setCurrentValue(value);
  };
}
const AmountField = connect(null, { setCurrentValue })(AmountFieldClass);

const DefaultAmountField: React.SFC<{}> = () => (
  <Query params={['value']} withQuery={({ value }) => <AmountField value={value} />} />
);

export { DefaultAmountField as AmountField };
