import React, { Component } from 'react';
import { Aux } from 'components/ui';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { getOffline } from 'selectors/config';
import { AppState } from 'reducers';
import { connect } from 'react-redux';
import { CallbackProps } from '../SendButtonFactory';

interface StateProps {
  offline: boolean;
}
interface State {
  showModal: boolean;
}

interface OwnProps {
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}
const INITIAL_STATE: State = {
  showModal: false
};

type Props = OwnProps & StateProps;
class OnlineSendClass extends Component<Props, State> {
  public state: State = INITIAL_STATE;

  public render() {
    const displayModal = this.state.showModal ? (
      <ConfirmationModal onClose={this.toggleModal} />
    ) : null;

    return !this.props.offline ? (
      <Aux>
        {this.props.withProps({ onClick: this.toggleModal })}
        {displayModal}
      </Aux>
    ) : null;
  }

  private toggleModal = () =>
    this.setState((prevState: State) => ({ showModal: !prevState.showModal }));
}

export const OnlineSend = connect((state: AppState) => ({ offline: getOffline(state) }))(
  OnlineSendClass
);
