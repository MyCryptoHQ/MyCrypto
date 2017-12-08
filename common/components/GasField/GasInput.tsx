import React, { Component } from 'react';
import translate from 'translations';
import { Query } from 'components/renderCbs';
import { Aux } from 'components/ui';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getGasLimit } from 'selectors/transaction';

interface StateProps {
  gasLimit: AppState['transaction']['fields']['gasLimit'];
}

interface OwnProps {
  onChange(value: React.FormEvent<HTMLInputElement>): void;
}

type Props = StateProps & OwnProps;
class GasInputClass extends Component<Props> {
  public render() {
    const { gasLimit: { raw, value }, onChange } = this.props;
    return (
      <Aux>
        <label>{translate('TRANS_gas')} </label>

        <Query
          params={['readOnly']}
          withQuery={({ readOnly }) => (
            <input
              className={`form-control ${!!value ? 'is-valid' : 'is-invalid'}`}
              type="text"
              readOnly={!!readOnly}
              value={raw}
              onChange={onChange}
            />
          )}
        />
      </Aux>
    );
  }
}

export const GasInput = connect((state: AppState) => ({ gasLimit: getGasLimit(state) }))(
  GasInputClass
);
