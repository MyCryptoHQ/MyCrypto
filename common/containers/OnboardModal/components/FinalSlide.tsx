import React from 'react';
import { translateRaw } from 'translations';
import { Link } from 'react-router-dom';
import { HelpLink } from 'components/ui';
import { HELP_ARTICLE } from 'config';
import OnboardSlide from './OnboardSlide';
import onboardIconTen from 'assets/images/onboarding/slide-10.svg';

interface Props {
  closeModal(): void;
}

const FinalSlide: React.SFC<Props> = ({ closeModal }) => {
  const header = translateRaw('ONBOARD_final_title');
  const subheader = translateRaw('ONBOARD_final_subtitle');

  const content = (
    <ul>
      <li>
        <HelpLink article={HELP_ARTICLE.HARDWARE_WALLET_RECOMMENDATIONS} className="strong">
          {translateRaw('ONBOARD_final_content__2')}
        </HelpLink>
      </li>
      <li>
        <HelpLink article={HELP_ARTICLE.MIGRATE_TO_METAMASK} className="strong">
          {translateRaw('ONBOARD_final_content__3')}
        </HelpLink>
      </li>
      <li>
        <HelpLink article={HELP_ARTICLE.RUNNING_LOCALLY} className="strong">
          {translateRaw('ONBOARD_final_content__4')}
        </HelpLink>
      </li>
      <li>
        <HelpLink article={HELP_ARTICLE.MIGRATE_TO_LEDGER} className="strong">
          {translateRaw('ONBOARD_final_content__5')}
        </HelpLink>
      </li>
      <li>
        <HelpLink article={HELP_ARTICLE.SENDING_TO_TREZOR} className="strong">
          {translateRaw('ONBOARD_final_content__6')}
        </HelpLink>
      </li>
      <li>
        <HelpLink article={HELP_ARTICLE.MIGRATE_TO_METAMASK} className="strong">
          {translateRaw('ONBOARD_final_content__7')}
        </HelpLink>
      </li>
      <li>
        <HelpLink article={HELP_ARTICLE.HOME} className="strong">
          {translateRaw('ONBOARD_final_content__8')}
        </HelpLink>
      </li>
      <li>
        <Link onClick={closeModal} to="/account" className="strong">
          <span> {translateRaw('ONBOARD_final_content__9')}</span>
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
