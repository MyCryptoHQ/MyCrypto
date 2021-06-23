export function withHook<T>(hook: () => T) {
  return (Component: any) => (ownProps: any) => {
    const contextProps: T = hook();
    return <Component {...ownProps} {...contextProps} />;
  };
}
