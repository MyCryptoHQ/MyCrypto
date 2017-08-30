import * as React from 'react';
import type { ABlankNooperProps } from './types';

export const ABlankNooper = ({
  content, //eslint-disable-line
  href //eslint-disable-line
}): ABlankNooperProps =>
  <a target="_blank" rel="noopener" href={href}>
    {content}
  </a>;
