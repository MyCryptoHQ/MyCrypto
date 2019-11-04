export interface IRoutePath {
  name: string;
  title?: string;
  path: string;
}

export interface IAppRoute extends IRoutePath {
  component: React.ReactNode;
  exact?: boolean;
  seperateLayout?: boolean;
  requireAccounts?: boolean;
}

// To facilitate accessing using dot notation.
export interface IRoutePaths {
  [K: string]: IRoutePath;
}
