import React from 'react';
import translate, { translateMd } from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconNine from 'assets/images/onboarding/slide-09.svg';

interface Props {
  site?: string;
}

const SecureSlideThree: React.SFC<Props> = ({ site }) => {
  const header = translate('ONBOARD_SECURE_3_TITLE');
  const subheader = translate('ONBOARD_SECURE_3_CONTENT__1');

  const content = (
    <div>
      <ul>
        <li>{translateMd('ONBOARD_SECURE_3_CONTENT__2')}</li>
        <li>{translateMd('ONBOARD_SECURE_3_CONTENT__3')}</li>
        <li>{translateMd('ONBOARD_SECURE_3_CONTENT__4')}</li>
        <li>{translateMd('ONBOARD_SECURE_3_CONTENT__5')}</li>
        {site === 'cx' && <li>{translateMd('CX_WARNING_1')}</li>}
      </ul>
      <h5 className="text-center">{translateMd('ONBOARD_SECURE_3_CONTENT__6')} </h5>
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
