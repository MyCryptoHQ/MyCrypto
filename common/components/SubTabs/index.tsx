import React from 'react';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import './SubTabs.scss';

export interface Tab {
  name: string | React.ReactElement<any>;
  path: string;
  disabled?: boolean;
  redirect?: string;
}

interface Props {
  tabs: Tab[];
  match: RouteComponentProps<{}>['match'];
}

export default class SubTabs extends React.Component<Props> {
  public render() {
    const { tabs, match } = this.props;
    const currentPath = match.url;

    return (
      <div className="SubTabs row">
        <div className="SubTabs-tabs col-sm-12">
          {tabs.map((t, i) => (
            // Same as normal Link, but knows when it's active, and applies activeClassName
            <NavLink
              className={`SubTabs-tabs-link ${t.disabled ? 'is-disabled' : ''}`}
              activeClassName="is-active"
              to={currentPath + '/' + t.path}
              key={i}
            >
              {t.name}
            </NavLink>
          ))}
        </div>
      </div>
    );
  }
}
