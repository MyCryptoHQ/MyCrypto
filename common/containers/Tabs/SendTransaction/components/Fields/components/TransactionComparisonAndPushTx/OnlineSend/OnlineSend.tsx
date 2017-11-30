import React, { Component } from 'react';
import { Offline } from 'components/renderCbs';
import { Aux } from 'components/ui';
import { ConfirmationModal } from './components';
import translate from 'translations';

interface State {
  showModal: boolean;
}

const INITIAL_STATE: State = {
  showModal: false
};

export class OnlineSend extends Component<{}, State> {
  public state: State = INITIAL_STATE;

  public render() {
    const sendButton = (
      <div className="row form-group">
        <div className="col-xs-12">
          <button
            className="btn btn-primary btn-block"
            onClick={this.toggleModal}
          >
            {translate('SEND_trans')}
          </button>
        </div>
      </div>
    );
    const displayModal = this.state.showModal ? (
      <ConfirmationModal onClose={this.toggleModal} />
    ) : null;
    return (
      <Offline
        withOffline={({ offline }) =>
          !offline ? (
            <Aux>
              {sendButton}

              {displayModal}
            </Aux>
          ) : null
        }
      />
    );
  }
  private toggleModal = () =>
    this.setState((prevState: State) => ({ showModal: !prevState.showModal }));
}
