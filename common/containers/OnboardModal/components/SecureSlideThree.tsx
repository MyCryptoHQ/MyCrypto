import React from 'react';
import onboardIconNine from 'assets/images/onboarding_icon-09.svg';

interface Props {
  setOnboardStatus(slideNumber: number): void;
  site?: string;
}

const SecureSlideThree: React.SFC<Props> = ({ setOnboardStatus, site }) => {
  return (
    <article className="onboarding__modal">
      <h3 className="onboarding__title">
        {/* translate="ONBOARD_secure_3_title" */}
        How To Protect Yourself from Loss
      </h3>
      <p className="text-center">
        {/* translate="ONBOARD_secure_3_content__1" */}
        If you lose your private key or password, it is gone forever. Don't lose it.
      </p>
      <section className="row row--flex">
        <div className="col-xs-12 col-sm-7">
          <ul>
            <li>
              {/* translate="ONBOARD_secure_3_content__2" */}
              Make a backup of your private key and password. Do NOT just store it on your computer.
              Print it out on a piece of paper or save it to a USB drive.
            </li>
            <li>
              {/* translate="ONBOARD_secure_3_content__3" */}
              Store this paper or USB drive in a different physical location. A backup is not useful
              if it is destroyed by a fire or flood along with your laptop.
            </li>
            <li>
              {/* translate="ONBOARD_secure_3_content__4" */}
              Do not store your private key in Dropbox, Google Drive, or other cloud storage. If
              that account is compromised, your funds will be stolen.
            </li>
            <li>
              {/* translate="ONBOARD_secure_3_content__5" */}
              If you have more than 1-week's worth of pay worth of cryptocurrency, get a hardware
              wallet. No excuses. It's worth it. I promise.
            </li>
            {site === 'cx' && (
              <li>
                {/* translate="CX_Warning_1" */}
                Make sure you have **external backups**. Chrome Extensions are not 100% reliable.
                Many things could happen that would cause loss, including uninstalling the
                extension. This is an easy way to access your wallets, **not** a way to back them
                up.
              </li>
            )}
          </ul>
        </div>
        <div className="col-xs-12 col-sm-4 onboarding__image">
          <img src={onboardIconNine} width="100%" height="auto" />
        </div>
      </section>
      <h5 className="text-center">
        {/* translate="ONBOARD_secure_3_content__6" */}
        [Even more Security
        Tips!](https://myetherwallet.github.io/knowledge-base/getting-started/protecting-yourself-and-your-funds.html)
      </h5>
      <div className="onboarding__buttons">
        <a onClick={() => setOnboardStatus(8)} className="btn btn-default">
          <span>
            {/* translate="ONBOARD_secure_2_title__alt_2" */}
            Screw Scams
          </span>
        </a>
        <a onClick={() => setOnboardStatus(10)} className="btn btn-primary">
          <span>
            {/* translate="ONBOARD_final_title__alt" */}
            One more click &amp; you're done! 🤘
          </span>
        </a>
      </div>
    </article>
  );
};
export default SecureSlideThree;
