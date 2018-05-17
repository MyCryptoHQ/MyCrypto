import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { getOffline } from 'features/selectors';
import { getNonce, nonceRequestFailed } from 'features/transaction/selectors';
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
  shouldDisplay: getOffline(state) || nonceRequestFailed(state),
  nonce: getNonce(state)
}))(NonceInputFactoryClass);
