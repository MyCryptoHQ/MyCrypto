import classnames from 'classnames';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import translate, { translateRaw } from 'translations';
import './NavigationLink.scss';

interface Props {
  link: {
    name: string;
    to?: string;
    external?: boolean;
  };
}

interface InjectedLocation extends Props {
  location: { pathname: string };
}

class NavigationLink extends React.Component<Props, {}> {
  get injected() {
    return this.props as InjectedLocation;
  }
  public render() {
    const { link } = this.props;
    const { location } = this.injected;
    const linkClasses = classnames({
      'NavigationLink-link': true,
      'is-disabled': !link.to,
      'is-active':
        location.pathname === link.to ||
        location.pathname.substring(1) === link.to
    });
    const linkLabel = `nav item: ${translateRaw(link.name)}`;

    const linkEl =
      link.external || !link.to ? (
        <a
          className={linkClasses}
          href={link.to}
          aria-label={linkLabel}
          target="_blank"
        >
          {translate(link.name)}
        </a>
      ) : (
        <Link
          className={linkClasses}
          to={(link as any).to}
          aria-label={linkLabel}
        >
          {translate(link.name)}
        </Link>
      );

    return <li className="NavigationLink">{linkEl}</li>;
  }
}

// withRouter is a HOC which provides NavigationLink with a react-router location prop
export default withRouter(NavigationLink);
