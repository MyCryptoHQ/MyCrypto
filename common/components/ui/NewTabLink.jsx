// @flow
import * as React from 'react';

type AAttributes = {
  charset?: string,
  coords?: string,
  download?: string,
  href: string,
  hreflang?: string,
  media?: string,
  name?: string,
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
    | 'tag',
  rev?: string,
  shape?: 'default' | 'rect' | 'circle' | 'poly',
  target?: '_blank' | '_parent' | '_self' | '_top',
  type?: string
};

type NewTabLinkProps = {
  content?: React.Element<any> | string,
  children?: React.Element<any> | string,
  rest?: AAttributes
};

const NewTabLink = ({
  /* eslint-disable */
  content, // ESLINT: prop-types validation error, to be fixed in #122
  children /* eslint-enable */,
  ...rest
}: NewTabLinkProps) =>
  <a target="_blank" rel="noopener" {...rest}>
    {content || children} {/* Keep content for short-hand text insertion */}
  </a>;

export default NewTabLink;
