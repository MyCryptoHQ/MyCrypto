import React, { Component } from 'react';
import classnames from 'classnames';

import { notificationsTypes } from 'features/notifications';
import TransactionSucceeded from 'components/ExtendedNotifications/TransactionSucceeded';
import './Notifications.scss';

interface Props {
  notification: notificationsTypes.Notification;
  onClose(n: notificationsTypes.Notification): void;
}

export default class NotificationRow extends Component<Props, {}> {
  public render() {
    const { msg, level, rendersComponent, componentConfig } = this.props.notification;
    const notifClass = classnames({
      Notification: true,
      alert: true,
      [`alert-${level}`]: !!level
    });

    let internal: any;

    if (!rendersComponent) {
      internal = msg;
    } else if (rendersComponent && componentConfig) {
      const customComponents: any = {
        TransactionSucceeded
      };
      const { component, ...rest } = componentConfig;

      if (customComponents[component]) {
        const CustomComponent = customComponents[component];

        internal = <CustomComponent {...rest} />;
      } else {
        const BasicComponent = component;

        internal = <BasicComponent {...rest}>{msg}</BasicComponent>;
      }
    } else {
      throw new Error('If a notification renders a component is must contain config');
    }

    return (
      <div className={notifClass} role="alert" aria-live="assertive">
        <span className="sr-only">{level}</span>
        <div className="Notification-message">{internal}</div>
        <button className="Notification-close" aria-label="dismiss" onClick={this.onClose} />
      </div>
    );
  }

  public onClose = () => {
    this.props.onClose(this.props.notification);
  };
}
