import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';

import { AppState } from 'redux/reducers';
import { Notification } from 'redux/notifications/types';
import { closeNotification, TCloseNotification } from 'redux/notifications/actions';
import NotificationRow from './NotificationRow';
import './Notifications.scss';

interface Props {
  notifications: Notification[];
  closeNotification: TCloseNotification;
}

export class Notifications extends React.Component<Props, {}> {
  public render() {
    return (
      <TransitionGroup className="Notifications" aria-live="polite">
        {this.props.notifications.map(n => {
          return (
            <CSSTransition classNames="NotificationAnimation" timeout={500} key={n.id}>
              <NotificationRow notification={n} onClose={this.props.closeNotification} />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  notifications: state.notifications
});

export default connect(mapStateToProps, { closeNotification })(Notifications);
