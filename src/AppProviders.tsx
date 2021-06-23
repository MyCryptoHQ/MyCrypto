import { ErrorProvider } from '@features';
import { DevToolsProvider } from '@services';

function AppProviders({ children }: { children: JSX.Element[] | JSX.Element | null }) {
  return (
    <DevToolsProvider>
      <ErrorProvider>{children}</ErrorProvider>
    </DevToolsProvider>
  );
}

export default AppProviders;
