import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { languages } from 'config';
import { AppState } from 'features/reducers';
import { configMetaActions, configMetaSelectors } from 'features/config';
import './LanguageSelect.scss';

interface OwnProps {
  closePanel(): void;
}

interface StateProps {
  languageSelection: string;
}

interface DispatchProps {
  changeLanguage: configMetaActions.TChangeLanguage;
}

type Props = OwnProps & StateProps & DispatchProps;

class LanguageSelect extends React.Component<Props> {
  public render() {
    const { languageSelection } = this.props;
    return (
      <div className="LanguageSelect">
        {Object.entries(languages).map(lang => (
          <button
            key={lang[0]}
            className={classnames({
              'LanguageSelect-language': true,
              'is-selected': languageSelection === lang[0]
            })}
            onClick={() => this.handleLanguageSelect(lang[0])}
          >
            {lang[1]}
          </button>
        ))}
      </div>
    );
  }

  private handleLanguageSelect = (lang: string) => {
    this.props.changeLanguage(lang);
    this.props.closePanel();
  };
}

export default connect(
  (state: AppState): StateProps => ({
    languageSelection: configMetaSelectors.getLanguageSelection(state)
  }),
  {
    changeLanguage: configMetaActions.changeLanguage
  }
)(LanguageSelect);
