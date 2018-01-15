import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconNine from 'assets/images/onboarding_icon-09.svg';

interface Props {
  site?: string;
}

const SecureSlideThree: React.SFC<Props> = ({ site }) => {
  const header = translate('ONBOARD_secure_3_title');
  const subheader = translate('ONBOARD_secure_3_content__1');

  const content = (
    <div>
      <ul>
        <li>{translate('ONBOARD_secure_3_content__2')}</li>
        <li>{translate('ONBOARD_secure_3_content__3')}</li>
        <li>{translate('ONBOARD_secure_3_content__4')}</li>
        <li>{translate('ONBOARD_secure_3_content__5')}</li>
        {site === 'cx' && <li>{translate('CX_Warning_1')}</li>}
      </ul>
      <h5 className="text-center">{translate('ONBOARD_secure_3_content__6')} </h5>
    </div>
  );

  return (
    <OnboardSlide
      header={header}
      subheader={subheader}
      content={content}
      image={onboardIconNine}
      imageSide="right"
    />
  );
};
export default SecureSlideThree;
