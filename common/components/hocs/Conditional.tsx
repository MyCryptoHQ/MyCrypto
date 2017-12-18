import React, { Component } from 'react';

interface RequiredProps {
  condition: boolean;
  conditionalProps: {
    [key: string]: any;
  };
}

/**
 * Optional
 */
export const withConditional = <WrappedComponentProps extends {}>(
  PassedComponent: React.ComponentType<WrappedComponentProps>
) =>
  class extends Component<WrappedComponentProps & RequiredProps, {}> {
    public render() {
      const { condition, conditionalProps, ...passedProps } = this.props as any;
      return condition ? (
        <PassedComponent {...{ ...passedProps, ...(conditionalProps as object) }} />
      ) : (
        <PassedComponent {...passedProps} />
      );
    }
  };
