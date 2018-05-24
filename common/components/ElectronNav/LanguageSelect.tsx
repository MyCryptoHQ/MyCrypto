import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { languages } from 'config';
import { TChangeLanguage, changeLanguage } from 'actions/config';
import { getLanguageSelection } from 'selectors/config';
import { AppState } from 'reducers';
import './LanguageSelect.scss';

interface OwnProps {
  closePanel(): void;
}

interface StateProps {
  languageSelection: string;
}

interface DispatchProps {
  changeLanguage: TChangeLanguage;
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
    languageSelection: getLanguageSelection(state)
  }),
  {
    changeLanguage
  }
)(LanguageSelect);
