import { closeNotification, Notification, TCloseNotification } from 'actions/notifications';
import React from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import NotificationRow from './NotificationRow';
import './Notifications.scss';
import { AppState } from 'reducers';

interface Props {
  notifications: Notification[];
  closeNotification: TCloseNotification;
}

export class Notifications extends React.Component<Props, {}> {
  public render() {
    return (
      <TransitionGroup className="Notifications">
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
