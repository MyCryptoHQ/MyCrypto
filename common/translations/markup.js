// @flow
// ad-hoc parser for translation strings
import React from 'react';
import Markdown from 'react-markdown';

export function markupToReact(source: string, key: string) {
  return (
    <Markdown
      containerTagName="span"
      containerProps={{ 'data-l10n-key': key }}
      escapeHtml={true}
      unwrapDisallowed={true}
      allowedTypes={['Text', 'Link', 'Emph', 'Strong', 'Code']}
      source={source}
    />
  );
}
