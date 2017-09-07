// @flow
import './Notifications.scss';
import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { closeNotification } from 'actions/notifications';
import type { Notification } from 'actions/notifications';

class NotificationRow extends React.Component {
  props: {
    notification: Notification,
    onClose: (n: Notification) => void
  };
  render() {
    const { msg, level } = this.props.notification;
    const notifClass = classnames({
      Notification: true,
      alert: true,
      [`alert-${level}`]: !!level
    });

    return (
      <div className={notifClass} role="alert" aria-live="assertive">
        <span className="sr-only">
          {level}
        </span>
        <div className="Notification-message">
          {msg}
        </div>
        <button
          className="Notification-close"
          aria-label="dismiss"
          onClick={this.onClose}
        />
      </div>
    );
  }

  onClose = () => {
    this.props.onClose(this.props.notification);
  };
}

export class Notifications extends React.Component {
  props: {
    notifications: Notification[],
    closeNotification: (n: Notification) => void
  };
  render() {
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
