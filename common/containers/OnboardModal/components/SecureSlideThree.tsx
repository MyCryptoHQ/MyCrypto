import React from 'react';
import OnboardSlide from './OnboardSlide';

interface Props {
  site?: string;
}

const SecureSlideThree: React.SFC<Props> = ({ site }) => {
  const links = {
    tips:
      'https://myetherwallet.github.io/knowledge-base/getting-started/protecting-yourself-and-your-funds.html'
  };
  const header = (
    <div>
      <span>How To Protect Yourself from Loss</span>
      <p>If you lose your private key or password, it is gone forever. Don't lose it.</p>
    </div>
  );

  const content = (
    <div>
      <ul>
        <li>
          Make a backup of your private key and password. Do NOT just store it on your computer.
          Print it out on a piece of paper or save it to a USB drive.
        </li>
        <li>
          Store this paper or USB drive in a different physical location. A backup is not useful if
          it is destroyed by a fire or flood along with your laptop.
        </li>
        <li>
          Do not store your private key in Dropbox, Google Drive, or other cloud storage. If that
          account is compromised, your funds will be stolen.
        </li>
        <li>
          If you have more than 1-week's worth of pay worth of cryptocurrency, get a hardware
          wallet. No excuses. It's worth it. I promise.
        </li>
        {site === 'cx' && (
          <li>
            Make sure you have <strong>external backups</strong>. Chrome Extensions are not 100%
            reliable. Many things could happen that would cause loss, including uninstalling the
            extension. This is an easy way to access your wallets, <strong>not</strong> a way to
            back them up.
          </li>
        )}
      </ul>
      <h5 className="text-center">
        <a href={links.tips}>Even more Security Tips!</a>
      </h5>
    </div>
  );
  return <OnboardSlide header={header} content={content} />;
};
export default SecureSlideThree;
