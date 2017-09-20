import { closeNotification, Notification } from 'actions/notifications';
import React from 'react';
import { connect } from 'react-redux';
import NotificationRow from './NotificationRow';
import './Notifications.scss';

export class Notifications extends React.Component {
  public props: {
    notifications: Notification[];
    closeNotification(n: Notification): void;
  };

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
