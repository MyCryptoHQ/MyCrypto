import React from 'react';
import OnboardSlide from './OnboardSlide';

const SecureSlideTwo = () => {
  const header = (
    <div>
      <span>How To Protect Yourself from Scams</span>
      <p>People will try to get you to give them money in return for nothing.</p>
      <br />
    </div>
  );
  const content = (
    <ul>
      <li>If it is too good to be true, it probably is.</li>
      <li>
        Research before sending money to someone or some project. Look for information on a variety
        of websites and forums. Be wary.
      </li>
      <li>Ask questions when you don't understand something or it doesn't seem right.</li>
      <li>
        Don't let fear, FUD, or FOMO win over common sense. If something is very urgent, ask
        yourself 'why?'. It may be to create FOMO or prevent you from doing research.
      </li>
    </ul>
  );
  return <OnboardSlide header={header} content={content} />;
};
export default SecureSlideTwo;
