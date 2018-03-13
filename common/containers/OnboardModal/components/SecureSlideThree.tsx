import React from 'react';
import { translateRaw, translateMarkdown } from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconNine from 'assets/images/onboarding/slide-09.svg';

interface Props {
  site?: string;
}

const SecureSlideThree: React.SFC<Props> = ({ site }) => {
  const header = translateRaw('ONBOARD_secure_3_title');
  const subheader = translateMarkdown('ONBOARD_secure_3_content__1');

  const content = (
    <div>
      <ul>
        <li>{translateMarkdown('ONBOARD_secure_3_content__2')}</li>
        <li>{translateMarkdown('ONBOARD_secure_3_content__3')}</li>
        <li>{translateMarkdown('ONBOARD_secure_3_content__4')}</li>
        <li>{translateMarkdown('ONBOARD_secure_3_content__5')}</li>
        {site === 'cx' && <li>{translateMarkdown('CX_Warning_1')}</li>}
      </ul>
      <h5 className="text-center">{translateMarkdown('ONBOARD_secure_3_content__6')} </h5>
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
