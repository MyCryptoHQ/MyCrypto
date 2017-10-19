import {
  closeNotification,
  Notification,
  TCloseNotification
} from 'actions/notifications';
import React from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import NotificationRow from './NotificationRow';
import { uniqueId } from 'lodash';
import './Notifications.scss';

interface Props {
  notifications: Notification[];
  closeNotification: TCloseNotification;
}
export class Notifications extends React.Component<Props, {}> {
  public render() {
    const Transition = props => (
      <CSSTransition
        {...props}
        classNames="example"
        timeout={{ enter: 500, exit: 500 }}
      />
    );
    return (
      <TransitionGroup className="Notifications">
        {this.props.notifications.map((n, i) => {
          return (
            // TODO: add unique ID's to notifications to use as keys. Keys cannot be based off array index
            <Transition key={`${n.level}-${i}`}>
              <NotificationRow
                notification={n}
                onClose={this.props.closeNotification}
              />
            </Transition>
          );
        })}
      </TransitionGroup>
    );
  }
}

const mapStateToProps = state => ({
  notifications: state.notifications
});

export default connect(mapStateToProps, { closeNotification })(Notifications);
