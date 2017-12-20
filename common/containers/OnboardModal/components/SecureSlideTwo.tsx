import React from 'react';
import OnboardSlide from './OnboardSlide';

const SecureSlideTwo = () => {
  const header = (
    <div>
      <span>
        {/* translate="ONBOARD_secure_2_title" */}
        How To Protect Yourself from Scams
      </span>
      <p>
        {/* translate="ONBOARD_secure_2_content__1" */}
        People will try to get you to give them money in return for nothing.
      </p>
      <br />
    </div>
  );
  const content = (
    <ul>
      <li>
        {/* translate="ONBOARD_secure_2_content__2" */}
        If it is too good to be true, it probably is.
      </li>
      <li>
        {/* translate="ONBOARD_secure_2_content__3" */}
        Research before sending money to someone or some project. Look for information on a variety
        of websites and forums. Be wary.
      </li>
      <li>
        {/* translate="ONBOARD_secure_2_content__4" */}
        Ask questions when you don't understand something or it doesn't seem right.
      </li>
      <li>
        {/* translate="ONBOARD_secure_2_content__5" */}
        Don't let fear, FUD, or FOMO win over common sense. If something is very urgent, ask
        yourself 'why?'. It may be to create FOMO or prevent you from doing research.
      </li>
    </ul>
  );
  return <OnboardSlide header={header} content={content} />;
};
export default SecureSlideTwo;
