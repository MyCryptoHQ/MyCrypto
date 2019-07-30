import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { languages } from 'config';
import { translateRaw } from 'translations';
import { AppState } from 'features/reducers';
import { configMetaActions, configMetaSelectors } from 'features/config';

const LanguagesList = styled.ul`
  flex-grow: 1;
  margin: 0;
  padding: 0 0 21px 0;
  list-style-type: none;
`;

interface LanguageProps {
  isSelected: boolean;
}

const Language = styled.li<LanguageProps>`
  margin: 0;
  padding: 15px 20px;
  border-top: 1px solid #e9e9e9;
  cursor: pointer;
  transition: background 0.3s ease-in;

  &:hover {
    background: #f2f2f2;
  }

  ${props => props.isSelected && 'background: #f2f2f2;'};
`;

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
    <LanguagesList>
      {Object.entries(languages).map(([code, language]: [string, string]) => (
        <Language
          isSelected={languageSelection === code}
          key={code}
          onClick={() => handleLanguageSelect(code, languageSelection, changeLanguage, onClose)}
        >
          {language}
        </Language>
      ))}
    </LanguagesList>
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
  content: connect(
    mapStateToProps,
    mapDispatchToProps
  )(LanguageSelect)
};
