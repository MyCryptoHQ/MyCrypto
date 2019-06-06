import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { languages } from 'config';
import { translateRaw } from 'translations';
import { AppState } from 'features/reducers';
import { configMetaActions, configMetaSelectors } from 'features/config';
import { sidebarActions } from 'features/sidebar';

interface StateProps {
  languageSelection: ReturnType<typeof configMetaSelectors.getLanguageSelection>;
}

interface DispatchProps {
  changeLanguage: configMetaActions.TChangeLanguage;
  closeSidebar: sidebarActions.TCloseSidebar;
}

type Props = StateProps & DispatchProps;

class LanguageSelect extends Component<Props> {
  public render() {
    const { languageSelection } = this.props;

    return (
      <section className="SidebarScreen">
        <h1 className="SidebarScreen-heading" style={{ marginBottom: '30px' }}>
          {translateRaw('NEW_SIDEBAR_TEXT_1')}
        </h1>
        <ul className="SidebarScreen-list-full">
          {Object.entries(languages).map(([code, language]) => (
            <li
              key={code}
              className={classnames('SidebarScreen-language', {
                'is-selected': languageSelection === code
              })}
              onClick={() => this.handleLanguageSelect(code)}
            >
              {language}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  private handleLanguageSelect = (code: string) => {
    const { languageSelection, changeLanguage, closeSidebar } = this.props;

    if (code !== languageSelection) {
      changeLanguage(code);
    }

    closeSidebar();
  };
}

const mapStateToProps = (state: AppState) => ({
  languageSelection: configMetaSelectors.getLanguageSelection(state)
});

const mapDispatchToProps = {
  changeLanguage: configMetaActions.changeLanguage,
  closeSidebar: sidebarActions.closeSidebar
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSelect);
