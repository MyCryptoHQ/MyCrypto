import React, { Component } from 'react';
import { Query } from 'components/renderCbs';
import { getNonce, nonceRequestFailed } from 'selectors/transaction';
import { getOffline } from 'selectors/config';
import { AppState } from 'reducers';
import { connect } from 'react-redux';
import { CallbackProps } from 'components/NonceFieldFactory';

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
