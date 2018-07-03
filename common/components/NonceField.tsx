import React from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { AppState } from 'features/reducers';
import { getOffline } from 'features/config';
import { transactionNetworkActions, transactionNetworkSelectors } from 'features/transaction';
import { Spinner, Input } from 'components/ui';
import Help from 'components/ui/Help';
import { NonceFieldFactory } from 'components/NonceFieldFactory';
import './NonceField.scss';

interface OwnProps {
  alwaysDisplay: boolean;
  showInvalidBeforeBlur?: boolean;
}

interface StateProps {
  isOffline: boolean;
  noncePending: boolean;
}

interface DispatchProps {
  requestNonce: transactionNetworkActions.TGetNonceRequested;
}

type Props = OwnProps & DispatchProps & StateProps;

class NonceField extends React.Component<Props> {
  public render() {
    const {
      alwaysDisplay,
      showInvalidBeforeBlur,
      requestNonce,
      noncePending,
      isOffline
    } = this.props;
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
                  isValid={!!value}
                  className="Nonce-field-input"
                  type="number"
                  placeholder="7"
                  value={raw}
                  readOnly={readOnly}
                  onChange={onChange}
                  disabled={noncePending}
                  showInvalidWithoutValue={true}
                  showInvalidBeforeBlur={showInvalidBeforeBlur}
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
    noncePending: transactionNetworkSelectors.nonceRequestPending(state)
  };
};

export default connect(mapStateToProps, {
  requestNonce: transactionNetworkActions.getNonceRequested
})(NonceField);
