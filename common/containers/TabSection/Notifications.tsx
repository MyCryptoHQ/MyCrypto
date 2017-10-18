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
  public render() {
    return (
      <CSSTransitionGroup
        className="Notifications"
        transitionName="example"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {this.props.notifications.map((n, i) => {
          // console.log(n, i);
          return (
            <NotificationRow
              key={`${n.level}-${i}`}
              notification={n}
              onClose={this.props.closeNotification}
            />
          );
        })}
      </CSSTransitionGroup>
    );
  }
}

const mapStateToProps = state => ({
  notifications: state.notifications
});

export default connect(mapStateToProps, { closeNotification })(Notifications);
