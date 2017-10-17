import {
  closeNotification,
  Notification,
  TCloseNotification
} from 'actions/notifications';
import React from 'react';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';
import NotificationRow from './NotificationRow';
import './Notifications.scss';

interface Props {
  notifications: Notification[];
  closeNotification: TCloseNotification;
}
export class Notifications extends React.Component<Props, {}> {
  public componentDidUpdate() {
    if (this.props.notifications.length > 1) {
      console.log('notifications: ' + this.props.notifications.length);
      // TODO: remove oldest notification
    }
    console.log(this.props);
  }

  public render() {
    return (
      <CSSTransitionGroup
        className="Notifications"
        transitionName="example"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {this.props.notifications.map((n, i) => (
          <NotificationRow
            key={`${n.level}-${i}`}
            notification={n}
            onClose={this.props.closeNotification}
          />
        ))}
      </CSSTransitionGroup>
    );
  }
}

const mapStateToProps = state => ({
  notifications: state.notifications
});

export default connect(mapStateToProps, { closeNotification })(Notifications);
