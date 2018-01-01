import { Notification } from 'actions/notifications';
import classnames from 'classnames';
import React, { Component } from 'react';
import './Notifications.scss';

interface Props {
  notification: Notification;
  onClose(n: Notification): void;
}

export default class NotificationRow extends Component<Props, {}> {
  public render() {
    const { msg, level } = this.props.notification;
    const notifClass = classnames({
      Notification: true,
      alert: true,
      [`alert-${level}`]: !!level
    });

    return (
      <div className={notifClass} role="alert" aria-live="assertive">
        <span className="sr-only">{level}</span>
        <div className="Notification-message">{msg}</div>
        <button className="Notification-close" aria-label="dismiss" onClick={this.onClose} />
      </div>
    );
  }

  public onClose = () => {
    this.props.onClose(this.props.notification);
  };
}
