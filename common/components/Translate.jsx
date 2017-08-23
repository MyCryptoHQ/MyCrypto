// @flow
import React from 'react';
import { connect } from 'react-redux';
import Markdown from 'react-markdown';
import { getLanguageSelection } from 'selectors/config';
import { translateRaw } from 'translations';

type Props = {
  translationKey: string,
  lang: string
};

class Translate extends React.Component {
  props: Props;

  render() {
    const { translationKey, lang } = this.props;
    const source = translateRaw(translationKey, lang);

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
  }
}

function mapStateToProps(state) {
  return { lang: getLanguageSelection(state) };
}

export default connect(mapStateToProps)(Translate);
