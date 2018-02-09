import React from 'react';
import { NonceFieldFactory } from 'components/NonceFieldFactory';
import Help from 'components/ui/Help';
import './NonceField.scss';
import { Spinner } from 'components/ui';
import { connect } from 'react-redux';
import { getNonceRequested, TGetNonceRequested } from 'actions/transaction';
import { nonceRequestPending } from 'selectors/transaction';
import { getOffline } from 'selectors/config';
import { AppState } from 'reducers';

interface OwnProps {
  alwaysDisplay: boolean;
}

interface StateProps {
  isOffline: boolean;
  noncePending: boolean;
}

interface DispatchProps {
  requestNonce: TGetNonceRequested;
}

type Props = OwnProps & DispatchProps & StateProps;

class NonceField extends React.Component<Props> {
  public render() {
    const { alwaysDisplay, requestNonce, noncePending, isOffline } = this.props;
    return (
      <NonceFieldFactory
        withProps={({ nonce: { raw, value }, onChange, readOnly, shouldDisplay }) => {
          return alwaysDisplay || shouldDisplay ? (
            <React.Fragment>
              <div className="Nonce-label flex-wrapper">
                <label className="Nonce-label-text">Nonce</label>
                <Help
                  size={'x1'}
                  link={
                    'https://myetherwallet.github.io/knowledge-base/transactions/what-is-nonce.html'
                  }
                />
              </div>
              <div className="Nonce-field">
                <input
                  className={`Nonce-field-input form-control ${
                    !!value ? 'is-valid' : 'is-invalid'
                  }`}
                  type="number"
                  placeholder="e.g. 7"
                  value={raw}
                  readOnly={readOnly}
                  onChange={onChange}
                  disabled={noncePending}
                />
                {noncePending ? (
                  <div className="Nonce-spinner">
                    <Spinner />
                  </div>
                ) : (
                  !isOffline && (
                    <button className="Nonce-refresh" onClick={requestNonce}>
                      <i className="fa fa-refresh" />
                    </button>
                  )
                )}
              </div>
            </React.Fragment>
          ) : null;
        }}
      />
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => {
  return {
    isOffline: getOffline(state),
    noncePending: nonceRequestPending(state)
  };
};

export default connect(mapStateToProps, { requestNonce: getNonceRequested })(NonceField);
