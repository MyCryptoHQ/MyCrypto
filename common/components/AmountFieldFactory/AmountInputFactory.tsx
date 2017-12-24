import React, { Component } from 'react';
import { Query } from 'components/renderCbs';
import { ICurrentValue, getCurrentValue, isValidAmount } from 'selectors/transaction';
import { AppState } from 'reducers';
import { connect } from 'react-redux';
import { CallbackProps } from 'components/AmountFieldFactory';

interface OwnProps {
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

interface StateProps {
  currentValue: ICurrentValue;
  validAmount: boolean;
}

type Props = OwnProps & StateProps;

class AmountInputClass extends Component<Props> {
  public render() {
    const { currentValue, onChange, withProps, validAmount } = this.props;

    return (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) =>
          withProps({
            currentValue,
            isValid: validAmount,
            readOnly: !!readOnly,
            onChange
          })
        }
      />
    );
  }
}

export const AmountInput = connect((state: AppState) => ({
  currentValue: getCurrentValue(state),
  validAmount: isValidAmount(state)
}))(AmountInputClass);
