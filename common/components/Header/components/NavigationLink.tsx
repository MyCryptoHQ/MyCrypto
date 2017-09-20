import classnames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import translate from 'translations';
import './NavigationLink.scss';

interface Props {
  link: {
    name: string;
    to?: string;
    external?: boolean;
  };
  location: any;
}

export default class NavigationLink extends React.Component<Props, {}> {
  public render() {
    const { link, location } = this.props;
    const linkClasses = classnames({
      'NavigationLink-link': true,
      'is-disabled': !link.to,
      'is-active':
        location.pathname === link.to ||
        location.pathname.substring(1) === link.to
    });
    // $FlowFixMe flow is wrong, this isn't an element
    const linkLabel = `nav item: ${translate(link.name, true)}`;

    const linkEl = link.external
      ? <a
          className={linkClasses}
          href={link.to}
          aria-label={linkLabel}
          target="_blank"
        >
          {translate(link.name)}
        </a>
      : <Link className={linkClasses} to={link.to} aria-label={linkLabel}>
          {translate(link.name)}
        </Link>;

    return (
      <li className="NavigationLink">
        {linkEl}
      </li>
    );
  }
}
