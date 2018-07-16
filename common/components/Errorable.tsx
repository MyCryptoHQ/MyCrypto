import React from 'react';
import { connect } from 'react-redux';

import { notificationsActions } from 'features/notifications';

interface DispatchProps {
  showNotification: notificationsActions.TShowNotification;
}

interface OwnProps {
  /**
   * Optional custom error message to display when a error is caught, otherwise the
   * actual error message is displayed to the user
   */
  errorMessage?: string;
  /**
   * Optional should catch condition, if left undefined then the component will by default
   * catch all errors, if false, then the component will not catch errors, if true,
   * the component will catch errors
   */
  shouldCatch?: boolean;

  /**
   * Optional callback handler when an error is encountered and this component
   * should catch it
   */
  onError?(): void;
}

type Props = DispatchProps & OwnProps;

class ErrorBoundary extends React.Component<Props> {
  public componentDidCatch(error: Error, info: any) {
    console.error(error);
    console.error(info);
    const { errorMessage, onError, shouldCatch } = this.props;

    if (shouldCatch === false) {
      throw error;
    }

    this.props.showNotification('danger', errorMessage || error.message);
    if (onError) {
      onError();
    }
  }

  public render() {
    return this.props.children;
  }
}

export default connect(null, { showNotification: notificationsActions.showNotification })(
  ErrorBoundary
);
