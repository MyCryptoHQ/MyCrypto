import React, { Component } from 'react';
import { Aux } from 'components/ui';
import { ConfirmationModal } from './components';
import translate from 'translations';
import { getOffline } from 'selectors/config';
import { AppState } from 'reducers';
import { connect } from 'react-redux';

interface StateProps {
  offline: boolean;
}
interface State {
  showModal: boolean;
}

const INITIAL_STATE: State = {
  showModal: false
};

class OnlineSendClass extends Component<StateProps, State> {
  public state: State = INITIAL_STATE;

  public render() {
    const sendButton = (
      <div className="row form-group">
        <div className="col-xs-12">
          <button className="btn btn-primary btn-block" onClick={this.toggleModal}>
            {translate('SEND_trans')}
          </button>
        </div>
      </div>
    );

    const displayModal = this.state.showModal ? (
      <ConfirmationModal onClose={this.toggleModal} />
    ) : null;

    return !this.props.offline ? (
      <Aux>
        {sendButton}
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
