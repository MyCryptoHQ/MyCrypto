import React from 'react';

interface AAttributes {
  charset?: string;
  className?: string;
  coords?: string;
  download?: string;
  href: string;
  hreflang?: string;
  media?: string;
  name?: string;
  rel?:
    | 'alternate'
    | 'author'
    | 'bookmark'
    | 'external'
    | 'help'
    | 'license'
    | 'next'
    | 'nofollow'
    | 'noreferrer'
    | 'noopener'
    | 'prev'
    | 'search'
    | 'tag';
  rev?: string;
  shape?: 'default' | 'rect' | 'circle' | 'poly';
  target?: '_blank' | '_parent' | '_self' | '_top';
  type?: string;
  onClick?(ev: React.MouseEvent<HTMLAnchorElement>): void;
}

interface NewTabLinkProps extends AAttributes {
  content?: React.ReactElement<any> | string;
  children?: React.ReactElement<any> | string;
}

const NewTabLink = ({ content, children, ...rest }: NewTabLinkProps) => (
  <a target="_blank" rel="noopener noreferrer" {...rest}>
    {content || children}
  </a>
);

export default NewTabLink;
