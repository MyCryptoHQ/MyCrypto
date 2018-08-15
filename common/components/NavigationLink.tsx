import React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

import { NavigationLink } from 'config';
import translate, { translateRaw } from 'translations';

interface Props extends RouteComponentProps<{}> {
  link: NavigationLink;
  isHomepage: boolean;
  className?: string;
  disabled?: boolean;
}

class NavigationLinkClass extends React.PureComponent<Props, {}> {
  public render() {
    const { link, location, isHomepage, className, disabled } = this.props;
    let isActive = false;

    if (!link.external) {
      // isActive if
      // 1) Current path is the same as link
      // 2) the first path is the same for both links (/account and /account/send)
      // 3) we're at the root path and this is the "homepage" nav item
      const isSubRoute = location.pathname.split('/')[1] === link.to.split('/')[1];
      isActive =
        location.pathname === link.to || isSubRoute || (isHomepage && location.pathname === '/');
    }

    const linkLabel = `nav item: ${translateRaw(link.name)}`;

    const linkEl =
      link.external || !link.to ? (
        <a
          className={`${className}-link ${!link.to || (disabled && 'is-disabled')} ${isActive &&
            'is-active'}`}
          href={link.to}
          aria-label={linkLabel}
          target="_blank"
          rel="noopener noreferrer"
        >
          {translate(link.name)}
        </a>
      ) : (
        <Link
          className={`${className}-link ${!link.to || (disabled && 'is-disabled')} ${isActive &&
            'is-active'}`}
          to={(link as any).to}
          aria-label={linkLabel}
        >
          {translate(link.name)}
        </Link>
      );

    return (
      <li id={link.name} className={className}>
        {linkEl}
      </li>
    );
  }
}

// withRouter is a HOC which provides NavigationLink with a react-router location prop
export default withRouter<Props>(NavigationLinkClass);
