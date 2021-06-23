import { ComponentType } from 'react';

import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

import { ROUTE_PATHS } from '@config';
import { useAccounts } from '@services/Store';
import { translateRaw } from '@translations';
import { IAppRoute } from '@types';
import { useEffectOnce } from '@vendor';

interface PrivateRouteProps extends IAppRoute {
  key: number;
}

interface PageTitleProps extends RouteComponentProps {
  pageComponent: ComponentType<any>;
  title?: string;
}

const PageTitleRoute = ({ pageComponent: Page, title, ...props }: PageTitleProps) => {
  useEffectOnce(() => {
    document.title = title
      ? translateRaw('PAGE_TITLE_PREPEND') + title
      : translateRaw('DEFAULT_PAGE_TITLE');
  });
  return <Page {...props} />;
};

export const PrivateRoute = ({
  component: Component,
  requireAccounts,
  ...rest
}: PrivateRouteProps) => {
  const { accounts } = useAccounts();
  return (
    <Route
      {...rest}
      render={(props) =>
        (accounts && accounts.length) || !requireAccounts ? (
          <PageTitleRoute pageComponent={Component} title={rest.title} {...props} />
        ) : (
          <Redirect to={ROUTE_PATHS.ADD_ACCOUNT.path} />
        )
      }
    />
  );
};
