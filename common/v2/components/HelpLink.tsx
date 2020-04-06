import React from 'react';

import { KB_HELP_ARTICLE, getKBHelpArticle } from 'v2/config';
import NewTabLink, { AAttributes } from './NewTabLink';

interface Props {
  article: KB_HELP_ARTICLE;
  children?: string | React.ReactElement<string>;
}

const HelpLink: React.SFC<AAttributes & Props> = ({ article, children, ...rest }) => (
  <NewTabLink {...rest} href={getKBHelpArticle(article)}>
    {children}
  </NewTabLink>
);

export default HelpLink;
