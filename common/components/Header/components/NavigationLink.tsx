import classnames from 'classnames';
import React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import translate, { translateRaw } from 'translations';
import './NavigationLink.scss';

interface Props extends RouteComponentProps<{}> {
  link: {
    name: string;
    to?: string;
    external?: boolean;
  };
  isHomepage: boolean;
}

class NavigationLink extends React.Component<Props, {}> {
  public render() {
    const { link, location, isHomepage } = this.props;
    // isActive if
    // 1) Current path is the same as link
    // 2) the first path is the same for both links (/account and /account/send)
    // 3) we're at the root path and this is the "homepage" nav item
    const isActive =
      location.pathname === link.to ||
      (link.to && location.pathname.split('/')[1] === link.to.split('/')[1]) ||
      (isHomepage && location.pathname === '/');

    const linkClasses = classnames({
      'NavigationLink-link': true,
      'is-disabled': !link.to,
      'is-active': isActive
    });
    const linkLabel = `nav item: ${translateRaw(link.name)}`;

    const linkEl =
      link.external || !link.to ? (
        <a className={linkClasses} href={link.to} aria-label={linkLabel} target="_blank">
          {translate(link.name)}
        </a>
      ) : (
        <Link className={linkClasses} to={(link as any).to} aria-label={linkLabel}>
          {translate(link.name)}
        </Link>
      );

    return <li className="NavigationLink">{linkEl}</li>;
  }
}

// withRouter is a HOC which provides NavigationLink with a react-router location prop
export default withRouter<Props>(NavigationLink);
