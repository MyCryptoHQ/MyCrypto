import { Notification } from 'actions/notifications';
import classnames from 'classnames';
import React, { Component } from 'react';
import './Notifications.scss';

interface Props {
  notification: Notification;
  onClose(n: Notification): void;
}

export default class NotificationRow extends Component<Props, {}> {
  public componentDidUpdate(prevProps) {
    if (
      prevProps.notification.msg.props.txHash !==
        this.props.notification.msg.props.txHash &&
      !!this.props.notification
    ) {
      console.log('something got overridden');
      console.log(
        prevProps.notification.msg.props.txHash +
          ' to ' +
          this.props.notification.msg.props.txHash
      );
      console.log(prevProps, this.props.notification);
    }
  }

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
        <button
          className="Notification-close"
          aria-label="dismiss"
          onClick={this.onClose}
        />
      </div>
    );
  }

  public onClose = () => {
    this.props.onClose(this.props.notification);
  };
}
