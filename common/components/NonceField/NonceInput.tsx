import React, { Component } from 'react';
import { Aux } from 'components/ui';
import { Query } from 'components/renderCbs';
import Help from 'components/ui/Help';
import { getNonce, nonceRequestFailed } from 'selectors/transaction';
import { isAnyOffline } from 'selectors/config';
import { AppState } from 'reducers';
import { connect } from 'react-redux';
const nonceHelp = (
  <Help
    size={'x1'}
    link={'https://myetherwallet.github.io/knowledge-base/transactions/what-is-nonce.html'}
  />
);

interface OwnProps {
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}
interface StateProps {
  shouldDisplay: boolean;
  nonce: AppState['transaction']['fields']['nonce'];
}
type Props = OwnProps & StateProps;

class NonceInputClass extends Component<Props> {
  public render() {
    const { nonce: { raw, value }, onChange, shouldDisplay } = this.props;
    const content = (
      <Aux>
        {nonceHelp}
        <label>Nonce</label>

        <Query
          params={['readOnly']}
          withQuery={({ readOnly }) => (
            <input
              className={`form-control ${!!value ? 'is-valid' : 'is-invalid'}`}
              type="text"
              value={raw}
              readOnly={!!readOnly}
              onChange={onChange}
            />
          )}
        />
      </Aux>
    );

    return shouldDisplay ? content : null;
  }
}

export const NonceInput = connect((state: AppState) => ({
  shouldDisplay: isAnyOffline(state) || nonceRequestFailed(state),
  nonce: getNonce(state)
}))(NonceInputClass);
