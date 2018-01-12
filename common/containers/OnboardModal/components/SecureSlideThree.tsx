import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconNine from 'assets/images/onboarding_icon-09.svg';

interface Props {
  site?: string;
}

const SecureSlideThree: React.SFC<Props> = ({ site }) => {
  const header = (
    <div>
      <span>{translate('ONBOARD_secure_3_title')}</span>
      <p>{translate('ONBOARD_secure_3_content__1')}</p>
    </div>
  );

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
  return <OnboardSlide header={header} content={content} slideImage={onboardIconNine} />;
};
export default SecureSlideThree;
