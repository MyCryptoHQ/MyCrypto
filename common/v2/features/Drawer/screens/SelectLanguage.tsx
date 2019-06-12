import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { languages } from 'config';
import { translateRaw } from 'translations';
import { AppState } from 'features/reducers';
import { configMetaActions, configMetaSelectors } from 'features/config';

interface StateProps {
  languageSelection: ReturnType<typeof configMetaSelectors.getLanguageSelection>;
}

interface DispatchProps {
  changeLanguage: configMetaActions.TChangeLanguage;
  onClose(): void;
}

const handleLanguageSelect = (
  code: string,
  languageSelection: ReturnType<typeof configMetaSelectors.getLanguageSelection>,
  changeLanguage: configMetaActions.TChangeLanguage,
  onClose: () => void
) => {
  if (code !== languageSelection) {
    changeLanguage(code);
    AnalyticsService.instance.track(ANALYTICS_CATEGORIES.SIDEBAR, 'Language changed', {
      lang: code
    });
  }

  onClose();
};

type Props = StateProps & DispatchProps;

function LanguageSelect({ languageSelection, changeLanguage, onClose }: Props) {
  return (
    <section className="SidebarScreen">
      <ul className="SidebarScreen-list-full">
        {Object.entries(languages).map(([code, language]) => (
          <li
            key={code}
            className={classnames('SidebarScreen-language', {
              'is-selected': languageSelection === code
            })}
            onClick={() => handleLanguageSelect(code, languageSelection, changeLanguage, onClose)}
          >
            {language}
          </li>
        ))}
      </ul>
    </section>
  );
}

const mapStateToProps = (state: AppState) => ({
  languageSelection: configMetaSelectors.getLanguageSelection(state)
});

const mapDispatchToProps = {
  changeLanguage: configMetaActions.changeLanguage
};

export default {
  title: translateRaw('NEW_SIDEBAR_TEXT_1'),
  content: connect(mapStateToProps, mapDispatchToProps)(LanguageSelect)
};
