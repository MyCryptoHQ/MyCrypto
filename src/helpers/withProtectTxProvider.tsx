import ProtectTxProvider from '@features/ProtectTransaction/ProtectTxProvider';

export function withProtectTxProvider(Component: any) {
  return (ownProps: any) => {
    return (
      <ProtectTxProvider>
        <Component {...ownProps} />
      </ProtectTxProvider>
    );
  };
}
