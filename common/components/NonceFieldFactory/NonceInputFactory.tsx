import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { configMetaSelectors } from 'features/config';
import { transactionFieldsSelectors, transactionNetworkSelectors } from 'features/transaction';
import { CallbackProps } from 'components/NonceFieldFactory';
import { Query } from 'components/renderCbs';

interface OwnProps {
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

interface StateProps {
  shouldDisplay: boolean;
  nonce: AppState['transaction']['fields']['nonce'];
}

type Props = OwnProps & StateProps;

class NonceInputFactoryClass extends Component<Props> {
  public render() {
    const { nonce, onChange, shouldDisplay, withProps } = this.props;

    return (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) =>
          withProps({ nonce, onChange, readOnly: !!readOnly, shouldDisplay })
        }
      />
    );
  }
}

export const NonceInputFactory = connect((state: AppState) => ({
  shouldDisplay:
    configMetaSelectors.getOffline(state) || transactionNetworkSelectors.nonceRequestFailed(state),
  nonce: transactionFieldsSelectors.getNonce(state)
}))(NonceInputFactoryClass);
