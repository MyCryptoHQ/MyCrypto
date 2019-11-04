import React from 'react';

import { HELP_ARTICLE, knowledgeBaseURL } from 'config';
import NewTabLink, { AAttributes } from './NewTabLink';

interface Props {
  article?: HELP_ARTICLE;
  children?: string | React.ReactElement<string>;
}

const HelpLink: React.SFC<AAttributes & Props> = ({ article, children, ...rest }) => (
  <NewTabLink {...rest} href={`${knowledgeBaseURL}/${article}`}>
    {children}
  </NewTabLink>
);

export default HelpLink;
