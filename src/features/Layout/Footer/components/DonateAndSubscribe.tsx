import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import classnames from 'classnames';

import { ANALYTICS_CATEGORIES } from '@services';
import { donationAddressMap } from '@config';
import translate from '@translations';
import ether from '@assets/images/ether.png';
import bitcoin from '@assets/images/bitcoin.png';
import Subscribe from './Subscribe';
import './DonateAndSubscribe.scss';
import { useAnalytics } from '@utils';

interface DonationButtonProps {
  icon: string;
  title: string;
}

function DonationButton({ icon, title, ...rest }: DonationButtonProps) {
  return (
    <button className="DonationButton" {...rest}>
      <span>
        <img src={icon} alt={`Icon for ${title}`} /> {title}
      </span>
    </button>
  );
}

const Donate: FC = () => {
  const [displayingMessage, setDisplayMassage] = useState(false);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackDoncation = useAnalytics({
    category: ANALYTICS_CATEGORIES.FOOTER
  });

  const clearTimeoutId = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  }, [timeoutId]);

  useEffect(() => {
    return () => {
      clearTimeoutId();
    };
  }, [clearTimeoutId]);

  const displayMessage = useCallback(() => {
    setDisplayMassage(true);
    clearTimeoutId();

    timeoutId.current = setTimeout(() => {
      setDisplayMassage(false);
    }, 3000);
  }, [setDisplayMassage]);

  const trackDonationClicked = useCallback(
    (title: string) => {
      trackDoncation({
        actionName: `Donate ${title} clicked`
      });
    },
    [trackDoncation]
  );

  const messageClassName = classnames({
    'Donate-buttons-message': true,
    visible: displayingMessage
  });

  return (
    <section className="Donate">
      <h2>{translate('NEW_FOOTER_TEXT_1')}</h2>
      <section className="Donate-buttons">
        <CopyToClipboard
          text={donationAddressMap.ETH}
          onCopy={() => {
            displayMessage();
            trackDonationClicked('Ethereum');
          }}
        >
          <DonationButton icon={ether} title="Ethereum" />
        </CopyToClipboard>
        <CopyToClipboard
          text={donationAddressMap.BTC}
          onCopy={() => {
            displayMessage();
            trackDonationClicked('Bitcoin');
          }}
        >
          <DonationButton icon={bitcoin} title="Bitcoin" />
        </CopyToClipboard>
      </section>
      <p className={messageClassName}>
        <span className="check">✓</span>
        {translate('NEW_FOOTER_TEXT_2')}
      </p>
    </section>
  );
};

export default function DonateAndSubscribe() {
  return (
    <section className="DonateAndSubscribe">
      <Donate />
      <Subscribe />
    </section>
  );
}
