import { Aux } from 'components/ui';
import React, { Component } from 'react';
import translate, { translateRaw } from 'translations';
import { Query } from 'components/renderCbs';
import { ICurrentValue, getCurrentValue } from 'selectors/transaction';
import { AppState } from 'reducers';
import { connect } from 'react-redux';

interface OwnProps {
  onChange(ev: React.FormEvent<HTMLInputElement>);
}
interface StateProps {
  currentValue: ICurrentValue;
}
type Props = OwnProps & StateProps;

class AmountInputClass extends Component<Props> {
  public render() {
    const { currentValue, onChange } = this.props;
    const { raw, value } = currentValue;
    return (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) => (
          <Aux>
            <label>{translate('SEND_amount')}</label>
            <input
              className={`form-control ${!!value ? 'is-valid' : 'is-invalid'}`}
              type="number"
              placeholder={translateRaw('SEND_amount_short')}
              value={raw}
              readOnly={!!readOnly}
              onChange={onChange}
            />
          </Aux>
        )}
      />
    );
  }
}

export const AmountInput = connect((state: AppState) => ({ currentValue: getCurrentValue(state) }))(
  AmountInputClass
);
