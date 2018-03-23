import React from 'react';
import translate from 'translations';
import { Link } from 'react-router-dom';
import { HelpLink } from 'components/ui';
import { HELP_ARTICLE } from 'config';
import OnboardSlide from './OnboardSlide';
import onboardIconTen from 'assets/images/onboarding/slide-10.svg';

interface Props {
  closeModal(): void;
}

const FinalSlide: React.SFC<Props> = ({ closeModal }) => {
  const header = translate('ONBOARD_FINAL_TITLE');
  const subheader = translate('ONBOARD_FINAL_SUBTITLE');

  const content = (
    <ul>
      <li>
        <HelpLink article={HELP_ARTICLE.HARDWARE_WALLET_RECOMMENDATIONS} className="strong">
          {translate('ONBOARD_FINAL_CONTENT__2')}
        </HelpLink>
      </li>
      <li>
        <HelpLink article={HELP_ARTICLE.MIGRATE_TO_METAMASK} className="strong">
          {translate('ONBOARD_FINAL_CONTENT__3')}
        </HelpLink>
      </li>
      <li>
        <HelpLink article={HELP_ARTICLE.RUNNING_LOCALLY} className="strong">
          {translate('ONBOARD_FINAL_CONTENT__4')}
        </HelpLink>
      </li>
      <li>
        <HelpLink article={HELP_ARTICLE.MIGRATE_TO_LEDGER} className="strong">
          {translate('ONBOARD_FINAL_CONTENT__5')}
        </HelpLink>
      </li>
      <li>
        <HelpLink article={HELP_ARTICLE.SENDING_TO_TREZOR} className="strong">
          {translate('ONBOARD_FINAL_CONTENT__6')}
        </HelpLink>
      </li>
      <li>
        <HelpLink article={HELP_ARTICLE.MIGRATE_TO_METAMASK} className="strong">
          {translate('ONBOARD_FINAL_CONTENT__7')}
        </HelpLink>
      </li>
      <li>
        <HelpLink article={HELP_ARTICLE.HOME} className="strong">
          {translate('ONBOARD_FINAL_CONTENT__8')}
        </HelpLink>
      </li>
      <li>
        <Link onClick={closeModal} to="/account" className="strong">
          <span> {translate('ONBOARD_FINAL_CONTENT__9')}</span>
        </Link>
      </li>
    </ul>
  );
  return (
    <OnboardSlide
      header={header}
      subheader={subheader}
      content={content}
      image={onboardIconTen}
      imageSide="left"
    />
  );
};
export default FinalSlide;
