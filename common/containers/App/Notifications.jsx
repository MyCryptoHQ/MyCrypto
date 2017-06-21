// @flow
import React from 'react';
import { connect } from 'react-redux';
import { closeNotification } from 'actions/notifications';
import type { Notification } from 'actions/notifications';

function NotificationRow(props: {
    notification: Notification,
    onClose: (n: Notification) => void
}) {
    const { msg, level } = props.notification;
    let klass = '';

    switch (level) {
        case 'danger':
            klass = 'alert-danger';
            break;
        case 'success':
            klass = 'alert-success';
            break;
        case 'warning':
            klass = 'alert-warning';
            break;
    }

    return (
        <div className={`alert popup ${klass} animated-show-hide`} role="alert" aria-live="assertive">
            <span className="sr-only">{level}</span>
            <div className="container" dangerouslySetInnerHTML={{ __html: msg }} />
            <i
                tabIndex="0"
                aria-label="dismiss"
                className="icon-close"
                onClick={() => props.onClose(props.notification)}
            />
        </div>
    );
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
                    <NotificationRow key={`${n.level}-${i}`} notification={n} onClose={this.props.closeNotification} />
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    notifications: state.notifications
});

export default connect(mapStateToProps, { closeNotification })(Notifications);
