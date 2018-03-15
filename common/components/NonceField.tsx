import React from 'react';
import translate from 'translations';
import { NonceFieldFactory } from 'components/NonceFieldFactory';
import Help from 'components/ui/Help';
import { Spinner, Input } from 'components/ui';
import { connect } from 'react-redux';
import { getNonceRequested, TGetNonceRequested } from 'actions/transaction';
import { nonceRequestPending } from 'selectors/transaction';
import { getOffline } from 'selectors/config';
import { AppState } from 'reducers';
import './NonceField.scss';

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
            <div className="input-group-wrapper Nonce-label">
              <label className="input-group">
                <div className="input-group-header">
                  {translate('OFFLINE_STEP2_LABEL_5')}
                  <Help
                    size="x1"
                    link="https://support.mycrypto.com/transactions/what-is-nonce.html"
                  />
                </div>
                <Input
                  className={`Nonce-field-input  ${!!value ? 'is-valid' : 'is-invalid'}`}
                  type="number"
                  placeholder="7"
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
              </label>
            </div>
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
