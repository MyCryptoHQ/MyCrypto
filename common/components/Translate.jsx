// @flow
import React from 'react';
import Markdown from 'react-markdown';
import { translateRaw } from 'translations';

type Props = {
  translationKey: string
};

const Translate = ({ translationKey }: Props) => {
  const source = translateRaw(translationKey);
  return (
    <Markdown
      containerTagName="span"
      containerProps={{ 'data-l10n-key': translationKey }}
      escapeHtml={true}
      unwrapDisallowed={true}
      allowedTypes={['Text', 'Link', 'Emph', 'Strong', 'Code']}
      source={source}
    />
  );
};

//
// class Translate extends React.Component<Props> {
//   props: Props;
//
//   render() {
//     const { translationKey, textOnly } = this.props;
//     const source = translateRaw(translationKey);
//
//     console.log('<Translate />', translationKey, textOnly);
//
//     return (
//       <Markdown
//         containerTagName="span"
//         containerProps={{ 'data-l10n-key': translationKey }}
//         escapeHtml={true}
//         unwrapDisallowed={true}
//         allowedTypes={['Text', 'Link', 'Emph', 'Strong', 'Code']}
//         source={source}
//       />
//     );
//   }
// }

export default Translate;
