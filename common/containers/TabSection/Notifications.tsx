import { closeNotification, Notification, TCloseNotification } from 'actions/notifications';
import React from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import NotificationRow from './NotificationRow';
import './Notifications.scss';
import { AppState } from 'reducers';

interface Props {
  notifications: Notification[];
  closeNotification: TCloseNotification;
}

const Transition: React.SFC<{}> = ({ children }) => (
  <CSSTransition
    children={children}
    classNames="NotificationAnimation"
    timeout={{ enter: 500, exit: 500 }}
  />
);

export class Notifications extends React.Component<Props, {}> {
  public render() {
    return (
      <TransitionGroup className="Notifications">
        {this.props.notifications.map(n => {
          return (
            <Transition key={n.id}>
              <NotificationRow notification={n} onClose={this.props.closeNotification} />
            </Transition>
          );
        })}
      </TransitionGroup>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  notifications: state.notifications
});

export default connect(mapStateToProps, { closeNotification })(Notifications);
