// @flow
import React from 'react';
import { connect } from 'react-redux';
import { closeNotification } from 'actions/notifications';
import type { Notification } from 'actions/notifications';

class NotificationRow extends React.Component {
  props: {
    notification: Notification,
    onClose: (n: Notification) => void
  };
  render() {
    const { msg, level } = this.props.notification;
    let className = '';

    switch (level) {
      case 'danger':
        className = 'alert-danger';
        break;
      case 'success':
        className = 'alert-success';
        break;
      case 'warning':
        className = 'alert-warning';
        break;
    }

    return (
      <div
        className={`alert popup ${className} animated-show-hide`}
        role="alert"
        aria-live="assertive"
      >
        <span className="sr-only">{level}</span>
        <div className="container" dangerouslySetInnerHTML={{ __html: msg }} />
        <i
          tabIndex="0"
          aria-label="dismiss"
          className="icon-close"
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
      <div className="alerts-container">
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
