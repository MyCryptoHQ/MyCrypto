import { Context, useContext } from 'react';

export function withContext<T>(context: Context<T>) {
  return (Component: any) => (ownProps: any) => {
    const contextProps: T = useContext(context);
    return <Component {...ownProps} {...contextProps} />;
  };
}
