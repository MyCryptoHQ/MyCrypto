import { closeNotification } from 'actions/notifications/actionCreators';
import { Notification } from 'actions/notifications/actionTypes';
import React from 'react';
import { connect } from 'react-redux';
import NotificationRow from './NotificationRow';
import './Notifications.scss';

interface Props {
  notifications: Notification[];
  closeNotification(n: Notification): void;
}
export class Notifications extends React.Component<Props, {}> {
  public render() {
    if (!this.props.notifications.length) {
      return null;
    }
    return (
      <div className="Notifications">
        {this.props.notifications.map((n, i) =>
          <NotificationRow
            key={`${n.level}-${i}`}
            notification={n}
            onClose={this.props.closeNotification}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notifications: state.notifications
});

export default connect(mapStateToProps, { closeNotification })(Notifications);
