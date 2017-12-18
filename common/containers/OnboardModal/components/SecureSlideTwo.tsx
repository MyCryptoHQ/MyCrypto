import React from 'react';
import onboardIconEight from 'assets/images/onboarding_icon-08.svg';

interface Props {
  setOnboardStatus(slideNumber: number): void;
}

const SecureSlideTwo: React.SFC<Props> = ({ setOnboardStatus }) => {
  return (
    <article className="onboarding__modal">
      <h3 className="onboarding__title">
        {/* translate="ONBOARD_secure_2_title" */}
        How To Protect Yourself from Scams
      </h3>
      <p className="text-center">
        {/* translate="ONBOARD_secure_2_content__1" */}
        People will try to get you to give them money in return for nothing.
      </p>
      <br />
      <section className="row row--flex">
        <div className="col-xs-12 col-sm-8 onboarding__content">
          <ul>
            <li>
              {/* translate="ONBOARD_secure_2_content__2" */}
              If it is too good to be true, it probably is.
            </li>
            <li>
              {/* translate="ONBOARD_secure_2_content__3" */}
              Research before sending money to someone or some project. Look for information on a
              variety of websites and forums. Be wary.
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
        </div>
        <div className="col-xs-12 col-sm-4 onboarding__image">
          <img src={onboardIconEight} width="100%" height="auto" />
        </div>
      </section>
      <div className="onboarding__buttons">
        <a onClick={() => setOnboardStatus(7)} className="btn btn-default">
          <span>
            {/* translate="ONBOARD_secure_3_title__alt" */}
            Phuck Phishers
          </span>
        </a>
        <a onClick={() => setOnboardStatus(9)} className="btn btn-primary">
          <span>
            {/* translate="ONBOARD_secure_3_title" */}
            How To Protect Yourself from Loss
          </span>
        </a>
      </div>
    </article>
  );
};
export default SecureSlideTwo;
